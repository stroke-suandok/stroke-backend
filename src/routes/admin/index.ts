import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { clearData, getTasksWithActiveStatus, seedData } from './services';

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
};

export default admin;
