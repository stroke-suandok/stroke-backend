import { faker } from '@faker-js/faker';

import { gql } from '../../plugins/db/client';
import { type Patient } from '../../routes/patients/types';
import { taskGroupFragment } from '../../routes/taskgroups/types';
import { getRandomElement, getRandomEntry } from './utils';

export function seedTaskgroups(patients: Patient[]) {
    const taskGroupsData = [...Array(20).keys()].map((idx) => {
        const patient = getRandomElement(patients);
        return {
            entry: getRandomEntry(),
            destination: `Ward ${faker.location.buildingNumber()}`,
            patient: {
                connect: {
                    where: { node: { hospitalNumber: patient.hospitalNumber } },
                },
            },
        };
    });

    const gqlMutation = gql`
        mutation Mutation($input: [TASK_GROUPCreateInput!]!) {
            createTaskGroups(input: $input) {
                taskGroups {
                    id
                }
            }
        }
    `;

    const variables = {
        input: taskGroupsData,
    };

    return {
        query: gqlMutation,
        variables,
    };
}

export function queryTaskGroups() {
    const gqlQuery = gql`
        ${taskGroupFragment}
        query Query {
            taskGroups {
                ...TASK_GROUP_FRAGMENT
            }
        }
    `;
    return {
        query: gqlQuery,
    };
}
