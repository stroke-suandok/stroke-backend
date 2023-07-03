import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';

import { createTasks, getTasksByTaskGroupId } from './services';

const GetTasksDTO = Type.Object({
    taskGroupId: Type.String(),
});
type GetTasksDTO = Static<typeof GetTasksDTO>;

const CreateTasksDTO = Type.Object({
    taskGroupId: Type.String(),
    parentTaskId: Type.String(),
    title: Type.String(),
    taskType: Type.String(),
    required: Type.Boolean(),
});
type CreateTasksDTO = Static<typeof CreateTasksDTO>;

const tasks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();
    server.get(
        '/',
        {
            schema: {
                querystring: GetTasksDTO,
            },
        },
        async function (request, reply) {
            const data = await getTasksByTaskGroupId(request.query.taskGroupId);
            return data;
        },
    );

    server.post(
        '/',
        { schema: { body: CreateTasksDTO } },
        async function (request, reply) {
            const data = await createTasks({
                taskType: request.body.taskType,
                taskGroupId: request.body.taskGroupId,
                title: request.body.title,
                parentTaskIds: [request.body.parentTaskId],
                requiredArr: [request.body.required],
            });
            return data;
        },
    );
};

export default tasks;
