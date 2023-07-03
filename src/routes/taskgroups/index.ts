import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { client, gql } from '../../db/client';
import { CreateTaskGroupsDTO } from './schema';

const taskgroups: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();
    server.get('/', async function (request, reply) {
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
        return { data: result.data };
    });

    server.post(
        '/',
        { schema: { body: CreateTaskGroupsDTO } },
        async function (request, reply) {
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
                        hn: request.body.hn,
                    },
                },
            });
            return { data: result.data };
        },
    );
};

export default taskgroups;
