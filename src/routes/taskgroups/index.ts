import { FastifyPluginAsync } from 'fastify';

import { client, gql } from '../../db/client';

const taskgroups: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/', async function (request, reply) {
        const result = await client.query({
            query: gql`
                query Query {
                    taskGroups {
                        id
                    }
                }
            `,
        });
        return { data: result.data };
    });

    fastify.post('/', async function (request, reply) {
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
                input: {},
            },
        });
        return { data: result.data };
    });
};

export default taskgroups;
