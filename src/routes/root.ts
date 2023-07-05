import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/', async function (request, reply) {
        return { root: true };
    });

    fastify.route({
        method: 'GET',
        url: '/jwt',
        preHandler: fastify.auth([fastify.verifyJWT]),
        handler: async (request, reply) => {
            reply.send({ user: request.user });
        },
    });

    fastify.route({
        method: 'POST',
        url: '/login',
        handler: async (request, reply) => {
            const { username, password } = request.body as any;
            if (username === 'admin' && password === 'admin') {
                const token = fastify.jwt.sign({ username, role: 'admin' });
                reply.send({ token });
            } else {
                reply.status(401).send({ message: 'Unauthorized' });
            }
        },
    });
};

export default root;
