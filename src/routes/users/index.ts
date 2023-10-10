import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { deleteUsers,createUsers, getUsers, searchUsers } from './services';
import { DeleteUserReq,CreateUserReq, SearchUserReq, UsersRes } from './types';

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.route({
        method: 'GET',
        url: '/',
        schema: {
            description: 'Get all users',
            tags: ['users'],
            response: {
                200: UsersRes,
            },
        },
        handler: async function (request, reply) {
            const data = await getUsers(server);
            return data;
        },
    });

    server.route({
        method: 'POST',
        url: '/search',
        schema: {
            body: SearchUserReq,
            response: {
                200: UsersRes,
            },
        },
        handler: async function (request, reply) {
            return await searchUsers(server, request.body);
        },
    });

    server.route({
        method: 'PUT',
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

    server.route({
        method: 'DELETE',
        schema: {
            description: 'Delete a user',
            tags: ['users'],
            body: DeleteUserReq,
        },
        url: '/',
        handler: async function (request, reply) {
            const data = await deleteUsers(server, request.body);
            return data;
        },
    });
};

export default users;
