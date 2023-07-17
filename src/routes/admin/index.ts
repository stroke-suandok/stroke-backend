import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { sseRouteHandler } from '../../plugins/sse/utils';
import {
    clearData,
    getGraphInfo,
    getTasksWithActiveStatus, // seedData,
} from './services';

const admin: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.get('/clear', async function (request, reply) {
        await clearData();
        return 'All Cleared';
    });

    server.get('/tasks', async function (request, reply) {
        const data = await getTasksWithActiveStatus();
        return data;
    });

    server.get('/graphs', async function (request, reply) {
        const data = await getGraphInfo();
        return data;
    });

    server.route({
        method: 'GET',
        url: '/sse',
        handler: sseRouteHandler,
    });

    server.route({
        method: 'GET',
        url: '/sse/send',
        handler: (request, reply) => {
            const { sseSubs } = server;
            sseSubs.forEach((sub) => {
                sub.broadcast({ data: 'Message from server', event: 'test' });
            });
            return 'ok';
        },
    });
};

export default admin;
