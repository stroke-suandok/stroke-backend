import { FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

import { gql } from '../../plugins/db/client';
import { searchTaskGroups } from '../taskgroups/services';
import { type CreateTaskReq, type SearchTaskReq } from './types';

const taskFragment = gql`
    fragment TASK_FRAGMENT on TASK {
        id
        taskType
        title
        isRequired
        isCompleted
        status
        taskCategory
        createdAt
        updatedAt
        completedAt
        roleAllowed
        roleDisallowed
        departmentAllowed
        departmentDisallowed
        standardTime
    }
`;

export async function getTasks(fastify: FastifyInstance) {
    const gqlQuery = gql`
        ${taskFragment}
        query Query {
            tasks {
                ...TASK_FRAGMENT
            }
        }
    `;

    const results = await fastify.apolloClient.query({ query: gqlQuery });
    return results.data.tasks;
}

export async function createTask(
    fastify: FastifyInstance,
    body: CreateTaskReq,
) {
    // Handle id
    if (!body.id) {
        body.id = uuidv4();
    }

    // Make sure parentIds and childrenIds are not null
    if (!body.parentIds) {
        body.parentIds = [];
    }
    if (!body.childrenIds) {
        body.childrenIds = [];
    }

    const { taskGroupId, parentIds, childrenIds, ...mainFields } = body;

    // Check taskGroupId
    const taskGroups = await searchTaskGroups(fastify, { id: taskGroupId });
    if (taskGroups.length === 0) {
        throw new Error('taskGroupId not found');
    } else if (taskGroups.length > 1) {
        throw new Error('taskGroupId is not unique');
    }

    // Check parentIds
    const parentIdsExist = await checkTasksExist(fastify, parentIds);
    if (!parentIdsExist) throw new Error('parentIds not found');

    // Check childrenIds
    const childrenIdsExist = await checkTasksExist(fastify, childrenIds);
    if (!childrenIdsExist) throw new Error('childrenIds not found');

    // Continue with task creation
    const gqlMutation = gql`
        ${taskFragment}
        mutation Mutation($input: [TASKCreateInput!]!) {
            createTasks(input: $input) {
                tasks {
                    ...TASK_FRAGMENT
                }
            }
        }
    `;

    const variables = {
        input: {
            ...mainFields,
            taskGroup: {
                connect: {
                    where: {
                        node: { id: taskGroupId },
                    },
                },
            },
            parents: {
                connect: parentIds?.map((id) => ({
                    where: { node: { id: id } },
                })),
            },
            children: {
                connect: childrenIds?.map((id) => ({
                    where: { node: { id: id } },
                })),
            },
        },
    };

    const result = await fastify.apolloClient.mutate({
        mutation: gqlMutation,
        variables: variables,
    });

    if (result?.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message);
    }
    return result.data.createTasks.tasks;
}

export async function searchTasks(
    fastify: FastifyInstance,
    body: SearchTaskReq,
) {
    const gqlQuery = gql`
        ${taskFragment}
        query Query($where: TASKWhere) {
            tasks(where: $where) {
                ...TASK_FRAGMENT
            }
        }
    `;

    const result = await fastify.apolloClient.query({
        query: gqlQuery,
        variables: { where: body },
    });

    return result.data.tasks;
}

async function checkTasksExist(fastify: FastifyInstance, ids: string[]) {
    for await (const id of ids) {
        const tasks = await searchTasks(fastify, { id });
        if (tasks.length === 0) {
            return false;
        }
    }

    return true;
}
