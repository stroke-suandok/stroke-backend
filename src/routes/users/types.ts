import { Static, Type } from '@sinclair/typebox';

export const User = Type.Object({
    id: Type.String(),
    username: Type.String(),
    password: Type.String(),
    title: Type.String(),
    firstName: Type.String(),
    lastName: Type.String(),
    role: Type.Optional(Type.String()),
    department: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),
    createdAt: Type.String(),
});
const UserNoPassword = Type.Omit(User, ['password']);
export type User = Static<typeof UserNoPassword>;

// Default response
export const GetUsersRes = Type.Array(UserNoPassword);

// Create user
export const CreateUserReq = Type.Omit(User, ['id', 'updatedAt', 'createdAt']);
export type CreateUserReq = Static<typeof CreateUserReq>;
