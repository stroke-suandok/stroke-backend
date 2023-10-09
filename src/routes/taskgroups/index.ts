import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import {
    createTaskGroup,
    getTaskGroups,
    getTaskGroupsWithDetails,
    searchTaskGroups,
} from './services';
import {
    CreateTaskGroupReq,
    GetTaskGroupRes,
    SearchTaskGroupsReq,
} from './types';

const taskgroups: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // fastify.addHook('onRequest', async (request, reply) => {
    //     try {
    //         await request.jwtVerify();
    //     } catch (err) {
    //         reply.send(err);
    //     }
    // });

    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.route({
        method: 'GET',
        url: '/',
        schema: {
            response: {
                200: GetTaskGroupRes,
            },
        },
        handler: async function (request, reply) {
            const data = await getTaskGroups(server);
            return data;
        },
    });

    server.route({
        method: 'GET',
        url: '/details',
        schema: {},
        handler: async function (request, reply) {
            const data = await getTaskGroupsWithDetails(server);
            return data;
        },
    });

    server.route({
        method: 'PUT',
        url: '/',
        schema: {
            body: CreateTaskGroupReq,
        },
        handler: async function (request, reply) {
            const data = await createTaskGroup(server, request.body);
            return data;
        },
    });

    server.route({
        method: 'POST',
        url: '/search',
        schema: {
            body: SearchTaskGroupsReq,
            response: {
                200: GetTaskGroupRes,
            },
        },
        handler: async function (request, reply) {
            const data = await searchTaskGroups(server, request.body);
            return data;
        },
    });
};

export default taskgroups;
