import { gql } from '@apollo/client';
import { FastifyInstance } from 'fastify';

import { type CreateUserReq } from './types';

const userFragment = gql`
    fragment USER_FRAGMENT on USER {
        id
        username
        title
        firstName
        lastName
        role
        department
        updatedAt
        createdAt
    }
`;

export async function getUsers(fastify: FastifyInstance) {
    const gqlQuery = gql`
        ${userFragment}
        query Query {
            users {
                ...USER_FRAGMENT
            }
        }
    `;
    const results = await fastify.apolloClient.query({ query: gqlQuery });
    return results.data.users;
}

export async function createUsers(
    fastify: FastifyInstance,
    body: CreateUserReq,
) {
    const gqlMutation = gql`
        ${userFragment}
        mutation Mutation($input: [USERCreateInput!]!) {
            createUsers(input: $input) {
                users {
                    ...USER_FRAGMENT
                }
            }
        }
    `;
    const result = await fastify.apolloClient.mutate({
        mutation: gqlMutation,
        variables: { input: body },
    });
    return result.data.createUsers.users;
}
