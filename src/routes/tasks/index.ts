import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { client, gql } from '../../db/client';
import { CreateTasksDTO, GetTasksDTO } from './schema';

const tasks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();
    server.get(
        '/',
        {
            schema: {
                querystring: GetTasksDTO,
            },
        },
        async function (request, reply) {
            const result = await client.query({
                query: gql`
                    query Query($where: TASKWhere) {
                        tasks(where: $where) {
                            id
                            title
                            taskType
                        }
                    }
                `,
                variables: {
                    where: {
                        inTaskGroup: {
                            id: request.query.taskGroupId,
                        },
                    },
                },
            });
            return { data: result.data };
        },
    );

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
                        taskType: request.body.taskType,
                        title: request.body.title,
                        inTaskGroup: {
                            connect: {
                                where: {
                                    node: { id: request.body.taskGroupId },
                                },
                            },
                        },
                        precededBy: {
                            connect: {
                                where: {
                                    node: { id: request.body.parentTaskId },
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
