import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { createTask, getTasks, searchTasks } from './services';
import { CreateTaskReq, SearchTaskReq } from './types';

const tasks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.route({
        method: 'GET',
        url: '/',
        schema: {},
        handler: async function (request, reply) {
            const data = await getTasks(server);
            return data;
        },
    });

    server.route({
        method: 'POST',
        url: '/',
        schema: { body: CreateTaskReq },
        handler: async function (request, reply) {
            const data = await createTask(server, request.body);
            return data;
        },
    });

    server.route({
        method: 'POST',
        url: '/search',
        schema: {
            body: SearchTaskReq,
        },
        handler: async function (request, reply) {
            const data = await searchTasks(server, request.body);
            return data;
        },
    });
};

export default tasks;
