import { faker } from '@faker-js/faker';

import { gql } from '../../plugins/db/client';
import { type Patient } from '../../routes/patients/types';
import { taskGroupFragment } from '../../routes/taskgroups/types';
import { getRandomElement, getRandomEntry } from './utils';

export function seedTaskgroups(patients: Patient[]) {
    const taskGroupsData = [...Array(2).keys()].map((idx) => {
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
    // Check if any patients are left without a task group
    const patientsWithoutTaskGroups = patients.filter(
        (patient) =>
            !taskGroupsData.some((taskGroup) =>
                taskGroup.patient.connect.where.node.hospitalNumber === patient.hospitalNumber
            )
    );

    // If there are patients without a task group, create additional task groups
    patientsWithoutTaskGroups.forEach((patient) => {
        const additionalTaskGroup = {
            entry: getRandomEntry(),
            destination: `Ward ${faker.location.buildingNumber()}`,
            patient: {
                connect: {
                    where: { node: { hospitalNumber: patient.hospitalNumber } },
                },
            },
        };
        taskGroupsData.push(additionalTaskGroup);
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
