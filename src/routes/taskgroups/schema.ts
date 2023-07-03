import { Static, Type } from '@sinclair/typebox';

export const CreateTaskGroupsDTO = Type.Object({
    hn: Type.String(),
});

export type CreateTaskGroupsDTO = Static<typeof CreateTaskGroupsDTO>;
