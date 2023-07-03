import { v4 as uuidv4 } from 'uuid';

import { client, gql } from '../../db/client';

export async function getTaskGroups() {
    const result = await client.query({
        query: gql`
            query Query {
                taskGroups {
                    id
                    hn
                }
            }
        `,
    });

    return result.data.taskGroups;
}

export async function createTaskGroups(hn: string) {
    const result = await client.mutate({
        mutation: gql`
            mutation Mutation($input: [TASK_GROUPCreateInput!]!) {
                createTaskGroups(input: $input) {
                    taskGroups {
                        id
                    }
                }
            }
        `,
        variables: {
            input: {
                id: uuidv4(),
                hn: hn,
                hasTasks: {
                    create: {
                        node: {
                            id: uuidv4(),
                            title: 'Fill in Pateint Info',
                            taskType: 'FILL_PATIENT_INFO',
                            status: 'SUCCESS',
                        },
                    },
                },
            },
        },
    });

    return result.data.createTaskGroups.taskGroups;
}
