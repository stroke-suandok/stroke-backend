import { gql } from '@apollo/client';
import { FastifyInstance } from 'fastify';

import {
    type CreateUserReq,
    type DeleteUserReq,
    type SearchUserReq,
    type UsersRes,
} from './types';

export const userFragment = gql`
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
    const results = await fastify.apolloClient.query({
        query: gqlQuery,
    });
    return results.data.users;
}

export async function searchUsers(
    fastify: FastifyInstance,
    body: SearchUserReq,
) {
    const gqlQuery = gql`
        ${userFragment}
        query Query($where: USERWhere) {
            users(where: $where) {
                ...USER_FRAGMENT
            }
        }
    `;
    const results = await fastify.apolloClient.query({
        query: gqlQuery,
        variables: { where: body },
    });
    return results.data.users as UsersRes;
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
    try {
        const result = await fastify.apolloClient.mutate({
            mutation: gqlMutation,
            variables: {
                input: {
                    ...body,
                    password: await fastify.bcrypt.hash(body.password),
                },
            },
        });

        if (result.errors && result.errors.length > 0) {
            throw fastify.httpErrors.internalServerError(
                JSON.stringify(result.errors),
            );
        }

        return result.data.createUsers.users;
    } catch (error) {
        throw fastify.httpErrors.internalServerError(JSON.stringify(error));
    }
}

export async function deleteUsers(
    fastify: FastifyInstance,
    body: DeleteUserReq,
) {
    const gqlMutation = gql`
        mutation Mutation($id: ID) {
            deleteUsers(where: { id: $id }) {
                nodesDeleted
            }
        }
    `;

    const { id } = body;
    try {
        const result = await fastify.apolloClient.mutate({
            mutation: gqlMutation,
            variables: {
                id: id,
            },
        });
        if (result.errors && result.errors.length > 0) {
            throw fastify.httpErrors.internalServerError(
                JSON.stringify(result.errors),
            );
        }
    } catch (error) {
        throw fastify.httpErrors.internalServerError(JSON.stringify(error));
    }
}
