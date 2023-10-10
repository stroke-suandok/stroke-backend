import { Static, Type } from '@sinclair/typebox';

export const UserBase = Type.Object({
    id: Type.String(),
    username: Type.String(),
    password: Type.String(),
    title: Type.String(),
    firstName: Type.String(),
    lastName: Type.String(),
    role: Type.String(),
    department: Type.String(),
    updatedAt: Type.Optional(Type.String()),
    createdAt: Type.String(),
});
export type UserBase = Static<typeof UserBase>;
const UserNoPassword = Type.Omit(UserBase, ['password']);

// Default response
export const UserRes = UserNoPassword;
export const UsersRes = Type.Array(UserNoPassword);
export type UserRes = Static<typeof UserRes>;
export type UsersRes = Static<typeof UsersRes>;

// Search
export const SearchUserReq = Type.Object({
    ...Type.Partial(
        Type.Omit(UserNoPassword, ['title', 'updatedAt', 'createdAt']),
    ).properties,
});
export type SearchUserReq = Static<typeof SearchUserReq>;

// Create
export const CreateUserReq = Type.Omit(UserBase, [
    'id',
    'updatedAt',
    'createdAt',
]);
export type CreateUserReq = Static<typeof CreateUserReq>;

// DELETE 
export const DeleteUserReq = Type.Pick(UserBase, ['id']);
export type DeleteUserReq = Static<typeof DeleteUserReq>;
