import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { createTask, getTasks, searchTasks, patchTask, deleteTask } from './services';
import { CreateTaskReq, PatchTaskReq, SearchTaskReq, DeleteTaskReq } from './types';

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

    server.route({
        method: 'PATCH',
        url: '/',
        schema: {
            body: PatchTaskReq,
        },
        handler: async function (request, reply) {
            const data = await patchTask(server, request.body);
            return data;
        },
    });

    server.route({
        method: 'DELETE',
        url: '/',
        schema: {
            body: DeleteTaskReq,
        },
        handler: async function (request, reply) {
            const data = await deleteTask(server, request.body);
            return data;
        },
    });
    
};

export default tasks;
