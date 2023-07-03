import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { driver } from '../../db/server';

const admin: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();
    server.get('/clear', async function (request, reply) {
        const session = driver.session();
        await session.run('MATCH (n) DETACH DELETE n');
        await session.close();
        return { data: 'All cleared' };
    });
};

export default admin;
