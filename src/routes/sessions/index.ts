import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { createSession, getSessions } from './services';
import { CreateSessionReq } from './types';

const sessions: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.route({
        method: 'POST',
        url: '/',
        schema: {
            body: CreateSessionReq,
        },
        handler: async function (request, reply) {
            const data = await createSession(server, request.body);
            return data;
        },
    });

    server.route({
        method: 'GET',
        url: '/',
        schema: {},
        handler: async function (request, reply) {
            const data = await getSessions(server);

            return data;
        },
    });
};

export default sessions;
