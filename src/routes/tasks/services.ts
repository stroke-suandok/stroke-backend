import { v4 as uuidv4 } from 'uuid';

import { client, gql } from '../../db/client';

export async function getTasksByTaskGroupId(taskGroupId: string) {
    const result = await client.query({
        query: gql`
            query Query($where: TASKWhere) {
                tasks(where: $where) {
                    id
                    title
                    taskType
                }
            }
        `,
        variables: {
            where: {
                inTaskGroup: {
                    id: taskGroupId,
                },
            },
        },
    });
    return result.data.tasks;
}

interface PropsCreateTasks {
    taskType: string;
    title: string;
    taskGroupId: string;
    parentTaskIds: string[];
    requiredArr: boolean[];
    status?: string;
    id?: string;
}

export async function createTasks({
    taskType,
    title,
    taskGroupId,
    parentTaskIds,
    requiredArr,
    status,
    id,
}: PropsCreateTasks) {
    if (parentTaskIds.length !== requiredArr.length) {
        throw new Error(
            'parentTaskIds and requiredArr must have the same length',
        );
    }
    const connects = parentTaskIds.map((id, index) => ({
        id: id,
        required: requiredArr[index] || true,
    }));

    const result = await client.mutate({
        mutation: gql`
            mutation Mutation($input: [TASKCreateInput!]!) {
                createTasks(input: $input) {
                    tasks {
                        id
                    }
                }
            }
        `,
        variables: {
            input: {
                id: id || uuidv4(),
                taskType: taskType,
                title: title,
                status: status || 'PENDING',
                inTaskGroup: {
                    connect: {
                        where: {
                            node: { id: taskGroupId },
                        },
                    },
                },
                precededBy: {
                    connect: [
                        ...connects.map((c) => ({
                            where: {
                                node: { id: c.id },
                            },
                            edge: {
                                required: c.required,
                            },
                        })),
                    ],
                },
            },
        },
    });
    return result.data.createTasks.tasks;
}
