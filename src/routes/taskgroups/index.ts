import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';

import { createTaskGroups, getTaskGroups } from './services';

const CreateTaskGroupsDTO = Type.Object({
    hn: Type.String(),
});

type CreateTaskGroupsDTO = Static<typeof CreateTaskGroupsDTO>;

const taskgroups: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();
    server.get('/', async function (request, reply) {
        const data = await getTaskGroups();
        return data;
    });

    server.post(
        '/',
        { schema: { body: CreateTaskGroupsDTO } },
        async function (request, reply) {
            const data = await createTaskGroups(request.body.hn);
            return data;
        },
    );
};

export default taskgroups;
