import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.route({
        method: 'GET',
        url: '/me',
        preHandler: fastify.auth([fastify.verifyJWT]),
        handler: async (request, reply) => {
            reply.send({ user: request.user });
        },
    });

    server.route({
        method: 'POST',
        url: '/signin',
        handler: async (request, reply) => {
            const { username, password } = request.body as any;
            if (username === 'admin' && password === 'admin') {
                const token = fastify.jwt.sign({ username, role: 'ADMIN' });
                reply.send({
                    accessToken: token,
                    refreshToken: token,
                    user: { username, role: 'ADMIN' },
                });
            } else {
                reply.status(401).send({ message: 'Unauthorized' });
            }
        },
    });
};

export default auth;
