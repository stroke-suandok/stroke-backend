import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';

const UserType = Type.Object({
    username: Type.String(),
    role: Type.String(),
});

const SignInReqDTO = Type.Object({
    username: Type.String(),
    password: Type.String(),
});

const SignInResDTO = Type.Object({
    accessToken: Type.String(),
    refreshToken: Type.String(),
    user: UserType,
});

const RefreshTokenResDTO = Type.Object({
    accessToken: Type.String(),
    user: UserType,
});

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.route({
        method: 'GET',
        url: '/me',
        schema: {
            response: {
                200: UserType,
            },
        },
        preHandler: fastify.auth([fastify.verifyJWT]),
        handler: async (request, reply) => {
            reply.send(request.user);
        },
    });

    server.route({
        method: 'POST',
        url: '/signin',
        schema: {
            body: SignInReqDTO,
            response: {
                200: SignInResDTO,
            },
        },
        handler: async (request, reply) => {
            const { username, password } = request.body as any;

            // Look up database
            const usersData = [
                { username: 'admin', password: 'admin', role: 'ADMIN' },
                { username: 'user', password: 'user', role: 'USER' },
            ];

            // Verify user
            const user = usersData.find(
                (u) => u.username === username && u.password === password,
            );

            if (user) {
                const { password, ...userWithoutPassword } = user;
                const accessToken = fastify.jwt.sign(userWithoutPassword, {
                    expiresIn: '10s',
                });
                const refreshToken = fastify.jwt.sign(userWithoutPassword, {
                    expiresIn: '20m',
                });
                reply.send({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user: userWithoutPassword,
                });
            } else {
                reply.status(401).send({ message: 'Unauthorized' });
            }
        },
    });

    server.route({
        method: 'POST',
        url: '/refreshtoken',
        schema: {
            response: {
                200: RefreshTokenResDTO,
            },
        },
        preHandler: fastify.auth([fastify.verifyJWT]),
        handler: async (request, reply) => {
            const accessToken = fastify.jwt.sign(request.user, {
                expiresIn: '1m',
            });

            reply.send({
                accessToken: accessToken,
                user: request.user,
            });
        },
    });

    server.route({
        method: 'GET',
        preHandler: fastify.auth([fastify.verifyJWT]),
        url: '/protected',
        handler: async (request, reply) => {
            reply.send({ message: 'This is a protected route' });
        },
    });
};

export default auth;
