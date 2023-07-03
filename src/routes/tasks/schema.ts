import { Static, Type } from '@sinclair/typebox';

export const CreateTasksDTO = Type.Object({
    taskGroupId: Type.String(),
    title: Type.String(),
});

export type CreateTasksDTO = Static<typeof CreateTasksDTO>;
