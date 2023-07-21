import { gql } from '@apollo/client';
import { FastifyInstance } from 'fastify';

import { type CreateSessionReq } from './types';

export async function createSession(
    fastify: FastifyInstance,
    body: CreateSessionReq,
) {
    const gqlMutation = gql`
        mutation Mutation($input: [SESSIONCreateInput!]!) {
            createSessions(input: $input) {
                sessions {
                    createdAt
                    id
                    shift
                }
            }
        }
    `;

    const variable = {
        input: {
            shift: body.shift,
        },
    };

    const result = await fastify.apolloClient.mutate({
        mutation: gqlMutation,
        variables: variable,
    });

    return result.data.createSessions.sessions;
}

export async function getSessions(fastify: FastifyInstance) {
    const gqlQuery = gql`
        query Query {
            sessions {
                createdAt
                id
                shift
            }
        }
    `;
    const results = await fastify.apolloClient.query({ query: gqlQuery });
    return results.data.sessions;
}
