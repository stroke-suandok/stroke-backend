import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { getTasks } from './services';
import { TasksReq } from './types';

const graph: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();
    server.route({
        method: 'POST',
        url: '/tasks',
        schema: { body: TasksReq },
        handler: async (request, reply) => {
            const data = await getTasks(server, request.body);
            return data;
        },
    });
};

export default graph;
