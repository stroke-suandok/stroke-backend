import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { createUsers, getUsers } from './services';
import { CreateUserReq, GetUsersRes } from './types';

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.route({
        method: 'GET',
        url: '/',
        schema: {
            description: 'Get all users',
            tags: ['users'],
            response: {
                200: GetUsersRes,
            },
        },
        handler: async function (request, reply) {
            const data = await getUsers(server);
            return data;
        },
    });

    server.route({
        method: 'POST',
        schema: {
            description: 'Create a user',
            tags: ['users'],
            body: CreateUserReq,
        },
        url: '/',
        handler: async function (request, reply) {
            const data = await createUsers(server, request.body);
            return data;
        },
    });
};

export default users;
