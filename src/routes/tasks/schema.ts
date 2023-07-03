import { Static, Type } from '@sinclair/typebox';

export const CreateTasksDTO = Type.Object({
    taskGroupId: Type.String(),
    parentTaskId: Type.String(),
    title: Type.String(),
    taskType: Type.String(),
    required: Type.Boolean(),
});

export const GetTasksDTO = Type.Object({
    taskGroupId: Type.String(),
});
export type CreateTasksDTO = Static<typeof CreateTasksDTO>;
export type GetTasksDTO = Static<typeof GetTasksDTO>;
