import { FastifyInstance } from 'fastify';

import { driver } from '../../plugins/db';
// import { v4 as uuidv4 } from 'uuid';
import { gql } from '../../plugins/db/client';
import { createBlueprint } from '../blueprints/services';
import { createPatient, searchPatients } from '../patients/services';
import { DeleteTaskgroupReq, type CreateTaskGroupReq, type SearchTaskGroupsReq } from './types';
import { taskGroupFragment } from './types';

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

export async function getTaskGroupsWithDetails(fastify: FastifyInstance) {
    const session = driver.session();
    const data = await session.run(`
    MATCH (taskGroup: TASK_GROUP)
    OPTIONAL MATCH (patient: PATIENT) - [: PATIENT_IN] - > (taskGroup)
    OPTIONAL MATCH (tasks: TASK) - [: IN_TASKGROUP] - > (taskGroup)
    OPTIONAL MATCH (taskStart: TASK) - [: IN_TASKGROUP] - > (taskGroup)
    WHERE NOT () - [: NEXT] - > (taskStart)
    OPTIONAL MATCH (taskEnd: TASK) - [: IN_TASKGROUP] - > (taskGroup)
    WHERE NOT () < -[: NEXT] - (taskEnd)
    OPTIONAL MATCH p = (taskStart) - [: NEXT * ] - > (taskEnd)
    WITH taskGroup, patient, [n IN nodes(p)
    WHERE n.status = 'PENDING' | n
    ] AS nodesPending, collect(tasks.status) AS taskStatusList
    WITH taskGroup, patient, nodesPending[0] AS nodesCurrent,
    reduce(isAllSuccess = true , status IN taskStatusList | isAllSuccess AND (status = 'SUCCESS')) AS isAllSuccess,
    reduce(isAnyPending = false , status IN taskStatusList | isAnyPending OR (status = 'PENDING')) AS isAnyPending,
    reduce(isAnyCancel = false , status IN taskStatusList | isAnyCancel OR (status = 'CANCEL')) AS isAnyCancel
    WITH taskGroup, patient, collect( DISTINCT nodesCurrent {
      .*, createdAt: apoc.temporal.format(nodesCurrent.createdAt, 'iso_instant')
      }) AS currentTasks, isAllSuccess, isAnyPending, isAnyCancel
      RETURN taskGroup {
        .*,
        createdAt: apoc.temporal.format(taskGroup.createdAt, 'iso_instant'),
        patient: patient {
          .*, createdAt: apoc.temporal.format(patient.createdAt, 'iso_instant')
          },
          currentTasks: currentTasks,
          isAllSuccess: isAllSuccess,
          isAnyPending: isAnyPending,
          isAnyCancel: isAnyCancel
        }
    `);
    await session.close();
    return data.records.map((r) => r.get('taskGroup'));
}

export async function createTaskGroup(
    fastify: FastifyInstance,
    body: CreateTaskGroupReq,
) {
    const {
        hospitalNumber,
        title,
        firstName,
        lastName,
        blueprintType,
        ...bodyTaskGroup
    } = body;

    const patients = await searchPatients(fastify, {
        hospitalNumber: hospitalNumber,
    });

    if (patients.length === 0) {
        createPatient(fastify, {
            hospitalNumber: body.hospitalNumber,
            firstName: body.firstName,
            lastName: body.lastName,
            title: body.title,
        });
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
    createBlueprint(fastify, {
        blueprintType: blueprintType,
        taskGroupId: result.data.createTaskGroups.taskGroups[0].id,
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

export async function createTaskGroups(fastify: FastifyInstance, body: any) {
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

export async function deleteTaskgroup(fastify:FastifyInstance, body: DeleteTaskgroupReq){
    const gqlMutation = gql`
    mutation Mutation($where: TASK_GROUPWhere) {
        deleteTaskGroups(where: $where) {
        nodesDeleted
    }
}
    `;

    const {id} = body;
    try{
        const result = await fastify.apolloClient.mutate({
            mutation: gqlMutation,
            variables: {
                "where": {
                    "id": id
                  }
            }

        });
        if (result.errors && result.errors.length > 0) {
            throw fastify.httpErrors.internalServerError(
                JSON.stringify(result.errors),
            );
        }


    }catch (error) {
        throw fastify.httpErrors.internalServerError(JSON.stringify(error));
    }

}
