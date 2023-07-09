import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { serializeSSEEvent, sseEventHandler } from '../../plugins/sse';
import {
    clearData,
    getGraphInfo,
    getTasksWithActiveStatus,
    seedData,
} from './services';

const admin: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.get('/clear', async function (request, reply) {
        await clearData();
        return 'All Cleared';
    });

    server.get('/seed', async function (request, reply) {
        await seedData();
        return 'Seeded';
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
        handler: sseEventHandler,
    });

    server.route({
        method: 'GET',
        url: '/sse/send',
        handler: (request, reply) => {
            const { sseSubscribers } = server;
            sseSubscribers.forEach((subscriber) => {
                subscriber.reply.raw.write(
                    serializeSSEEvent({ data: 'hello' }),
                );
            });
            return 'ok';
        },
    });
};

export default admin;
