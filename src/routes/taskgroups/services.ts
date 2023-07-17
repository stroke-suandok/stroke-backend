import { FastifyInstance } from 'fastify';

// import { v4 as uuidv4 } from 'uuid';
import { gql } from '../../plugins/db/client';
import { patientFragment } from '../patients/services';
import { searchPatients } from '../patients/services';
import { type CreateTaskGroupReq, type SearchTaskGroupsReq } from './types';

const taskGroupFragment = gql`
    ${patientFragment}
    fragment TASK_GROUP_FRAGMENT on TASK_GROUP {
        id
        destination
        entry
        patient {
            ...PATIENT_FRAGMENT
        }
    }
`;

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
    const { hospitalNumber, ...bodyNoHN } = body;

    const patients = await searchPatients(fastify, {
        hospitalNumber: hospitalNumber,
    });

    if (patients.length === 0) {
        throw new Error(
            `Patient with hospital number ${hospitalNumber} not found`,
        );
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
            ...bodyNoHN,
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
