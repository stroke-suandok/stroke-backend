import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { client, gql } from '../../db/client';
import { CreateTasksDTO } from './schema';

const tasks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();
    server.get('/', async function (request, reply) {
        const result = await client.query({
            query: gql`
                query Query {
                    tasks {
                        id
                    }
                }
            `,
        });
        return { data: result.data };
    });

    server.post(
        '/',
        { schema: { body: CreateTasksDTO } },
        async function (request, reply) {
            const result = await client.mutate({
                mutation: gql`
                    mutation Mutation($input: [TASKCreateInput!]!) {
                        createTasks(input: $input) {
                            tasks {
                                id
                            }
                        }
                    }
                `,
                variables: {
                    input: {
                        taskType: 'TEST_TYPE',
                        title: request.body.title,
                        inTaskGroup: {
                            connect: {
                                where: {
                                    node: { id: request.body.taskGroupId },
                                },
                            },
                        },
                    },
                },
            });
            return { data: result.data };
        },
    );
};

export default tasks;
