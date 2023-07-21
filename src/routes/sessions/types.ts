import { Static, Type } from '@sinclair/typebox';

// Base type
const Session = Type.Object({
    id: Type.String(),
    createdAt: Type.String(),
    shift: Type.String(),
});

export const CreateSessionReq = Type.Pick(Session, ['shift']);
export type CreateSessionReq = Static<typeof CreateSessionReq>;
