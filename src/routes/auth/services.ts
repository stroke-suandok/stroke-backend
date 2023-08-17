import { gql } from '@apollo/client';
import { FastifyInstance } from 'fastify';

import { searchUsers } from '../users/services';
import { userFragment } from '../users/services';
import { type UserBase } from '../users/types';
import { type SignInReq } from './types';

export async function getMe(fastify: FastifyInstance, username: string) {
    const users = await searchUsers(fastify, { username });
    if (users.length === 1) {
        return users[0];
    } else {
        throw fastify.httpErrors.internalServerError('Cannot find user');
    }
}

export async function signIn(fastify: FastifyInstance, body: SignInReq) {
    const { username, password } = body;

    // Look up database
    const gqlQuery = gql`
        ${userFragment}
        query Query($where: USERWhere) {
            users(where: $where) {
                ...USER_FRAGMENT
                password
            }
        }
    `;
    const results = await fastify.apolloClient.query({
        query: gqlQuery,
        variables: { where: { username } },
    });

    const users = results.data.users as UserBase[];

    // Check for no username
    if (users.length === 0)
        throw fastify.httpErrors.unauthorized('No username found');

    // Also check for duplicate usernames
    if (users.length > 1)
        throw fastify.httpErrors.unauthorized('Duplicate usernames found');

    const user = users[0];
    // Verify user
    const valid = await fastify.bcrypt.compare(password, user.password);

    if (!valid)
        throw fastify.httpErrors.unauthorized(
            'Incorrect username / password combination.',
        );

    const { password: _, ...rest } = user;
    return rest;
}
