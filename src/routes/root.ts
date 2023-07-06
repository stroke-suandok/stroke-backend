import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // fastify.get('/', async function (request, reply) {
    //     return { root: true };
    // });

    fastify.route({
        method: 'GET',
        url: '/',
        preHandler: fastify.auth([fastify.publicRoute]),
        handler: async (request, reply) => {
            reply.send({ msg: 'It is working!' });
        },
    });
};

export default root;
