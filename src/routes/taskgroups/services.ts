import { FastifyInstance } from 'fastify';

// import { v4 as uuidv4 } from 'uuid';
import { gql } from '../../plugins/db/client';
import { searchPatients, createPatient } from '../patients/services';
import { type CreateTaskGroupReq, type SearchTaskGroupsReq } from './types';
import { taskGroupFragment } from './types';
import { createBlueprint } from '../blueprints/services';

export async function getTaskGroups(fastify: FastifyInstance) {
    const gqlQuery = gql`
        ${taskGroupFragment}
        query Query {
            taskGroups {
                ...TASK_GROUP_FRAGMENT
            }
        }
    `;
    const result = await fastify.apolloClient.query({ query: gqlQuery });
    return result.data.taskGroups;
}

export async function createTaskGroup(
    fastify: FastifyInstance,
    body: CreateTaskGroupReq,
) {
    const { hospitalNumber, title, firstName, lastName, blueprint,...bodyTaskGroup } = body;

    const patients = await searchPatients(fastify, {
        hospitalNumber: hospitalNumber,
    });

    

    if (patients.length === 0) {
        createPatient(fastify,{
            hospitalNumber: body.hospitalNumber,
            firstName: body.firstName,
            lastName: body.lastName,
            title: body.title,
         })
    } else if (patients.length > 1) {
        throw new Error(
            `Multiple patients with hospital number ${hospitalNumber} found`,
        );
    }

    const gqlMutation = gql`
        ${taskGroupFragment}
        mutation Mutation($input: [TASK_GROUPCreateInput!]!) {
            createTaskGroups(input: $input) {
                taskGroups {
                    ...TASK_GROUP_FRAGMENT
                }
            }
        }
    `;

    const variables = {
        input: {
            ...bodyTaskGroup,
            patient: {
                connect: {
                    where: { node: { hospitalNumber: hospitalNumber } },
                },
            },
        },
    };

    const result = await fastify.apolloClient.mutate({
        mutation: gqlMutation,
        variables: variables,
    });


    
    if (result.errors && result.errors.length > 0) {
        throw fastify.httpErrors.internalServerError(
            JSON.stringify(result.errors),
        );
    }
    createBlueprint(fastify,{blueprintType:"BP_demo",taskGroupId:result.data.createTaskGroups.taskGroups[0].id})
    return result.data.createTaskGroups.taskGroups;
}

export async function searchTaskGroups(
    fastify: FastifyInstance,
    body: SearchTaskGroupsReq,
) {
    const gqlQuery = gql`
        ${taskGroupFragment}
        query Query($where: TASK_GROUPWhere) {
            taskGroups(where: $where) {
                ...TASK_GROUP_FRAGMENT
            }
        }
    `;

    const result = await fastify.apolloClient.query({
        query: gqlQuery,
        variables: { where: body },
    });

    return result.data.taskGroups;
}

// export async function createTaskGroups(hn: string) {
//     const result = await client.mutate({
//         mutation: gql`
//             mutation Mutation($input: [TASK_GROUPCreateInput!]!) {
//                 createTaskGroups(input: $input) {
//                     taskGroups {
//                         id
//                     }
//                 }
//             }
//         `,
//         variables: {
//             input: {
//                 id: uuidv4(),
//                 hn: hn,
//                 hasTasks: {
//                     create: {
//                         node: {
//                             id: uuidv4(),
//                             title: 'Fill in Pateint Info',
//                             taskType: 'FILL_PATIENT_INFO',
//                             status: 'SUCCESS',
//                         },
//                     },
//                 },
//             },
//         },
//     });

//     return result.data.createTaskGroups.taskGroups;
// }

export async function createTaskGroups(
    fastify: FastifyInstance,
    body: any,
) {
    const gqlQuery = gql`
        ${taskGroupFragment}
        query Query($where: TASK_GROUPWhere) {
            taskGroups(where: $where) {
                ...TASK_GROUP_FRAGMENT
            }
        }
    `;

    const result = await fastify.apolloClient.query({
        query: gqlQuery,
        variables: { where: body },
    });

    return result.data.taskGroups;
}
