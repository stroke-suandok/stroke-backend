import { gql } from '@apollo/client';
import { FastifyInstance } from 'fastify';

import { type CreatePatientReq, type SearchPatientsReq } from './types';
import { type Patient } from './types';

export const patientFragment = gql`
    fragment PATIENT_FRAGMENT on PATIENT {
        id
        title
        firstName
        lastName
        hospitalNumber
        visitNumber
        admitNumber
        updatedAt
        createdAt
    }
`;

export async function getPatients(fastify: FastifyInstance) {
    const gqlQuery = gql`
        ${patientFragment}
        query Query {
            patients {
                ...PATIENT_FRAGMENT
            }
        }
    `;
    const results = await fastify.apolloClient.query({ query: gqlQuery });
    return results.data.patients;
}

export async function createPatient(
    fastify: FastifyInstance,
    body: CreatePatientReq,
) {
    const gqlMutation = gql`
        ${patientFragment}
        mutation CreatePatients($input: [PATIENTCreateInput!]!) {
            createPatients(input: $input) {
                patients {
                    ...PATIENT_FRAGMENT
                }
            }
        }
    `;
    const result = await fastify.apolloClient.mutate({
        mutation: gqlMutation,
        variables: { input: body },
    });
    return result.data.createPatients.patients;
}

export async function searchPatients(
    fastify: FastifyInstance,
    body: SearchPatientsReq,
) {
    const gqlQuery = gql`
        ${patientFragment}
        query Query($where: PATIENTWhere) {
            patients(where: $where) {
                ...PATIENT_FRAGMENT
            }
        }
    `;

    const result = await fastify.apolloClient.query<{ patients: Patient[] }>({
        query: gqlQuery,
        variables: { where: body },
    });

    return result.data.patients;
}
