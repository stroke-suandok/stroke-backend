import { faker } from '@faker-js/faker';

import { gql } from '../../plugins/db/client';
import { patientFragment } from '../../routes/patients/types';
import { getRandomDepartment, getRandomRole, getRandomTitle } from './utils';

const usersData = [...Array(10).keys()].map((idx) => {
    return {
        username: `username${idx + 1}`,
        role: getRandomRole(),
        title: getRandomTitle(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        department: getRandomDepartment(),
    };
});
// Fix some of the user roles for development
usersData[0].role = 'SUPER_ADMIN';
usersData[1].role = 'ADMIN';
usersData[2].role = 'USER';

const patientsData = [...Array(6).keys()].map((idx) => {
    return {
        title: getRandomTitle(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        hospitalNumber: faker.string.numeric(7),
        visitNumber: faker.string.numeric(6),
        admitNumber: faker.string.numeric(5),
    };
});

export function seedCreateUsers(passwordHashed: string) {
    const usersDataWithPassword = usersData.map((user) => ({
        ...user,
        password: passwordHashed,
    }));
    const gqlMutation = gql`
        mutation Mutation($input: [USERCreateInput!]!) {
            createUsers(input: $input) {
                users {
                    id
                }
            }
        }
    `;
    const variables = {
        input: usersDataWithPassword,
    };
    return {
        query: gqlMutation,
        variables,
    };
}

export function queryUsers() {
    const gqlQuery = gql`
        query Query {
            users {
                id
                username
                role
            }
        }
    `;
    return {
        query: gqlQuery,
    };
}

export function seedPatients() {
    const gqlMutation = gql`
        mutation CreatePatients($input: [PATIENTCreateInput!]!) {
            createPatients(input: $input) {
                patients {
                    id
                }
            }
        }
    `;
    const variables = {
        input: patientsData,
    };
    return {
        query: gqlMutation,
        variables,
    };
}

export function queryPatients() {
    const gqlQuery = gql`
        ${patientFragment}
        query Query {
            patients {
                ...PATIENT_FRAGMENT
            }
        }
    `;
    return {
        query: gqlQuery,
    };
}
