import { Static, Type } from '@sinclair/typebox';

export const TasksReq = Type.Object({
    taskGroupId: Type.String(),
});
export type TasksReq = Static<typeof TasksReq>;
