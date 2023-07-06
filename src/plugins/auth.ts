import fastifyAuth from '@fastify/auth';
import fastifyJWT from '@fastify/jwt';
import fp from 'fastify-plugin';

export default fp(async (fastify, opts) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    fastify.register(fastifyJWT, { secret: process.env.JWT_SECRET });
    fastify.register(fastifyAuth);
    fastify.decorate('verifyJWT', verifyJWT);
});

async function verifyJWT(request: any, reply: any, done: any): Promise<any> {
    try {
        await request.jwtVerify();
        done();
    } catch (err) {
        reply.send(err);
    }
}

declare module 'fastify' {
    export interface FastifyInstance {
        verifyJWT(request: any, reply: any, done: any): Promise<void>;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { username: string; role: string }; // payload type is used for signing and verifying
        user: {
            username: string;
            role: string;
        }; // user type is return type of `request.user` object
    }
}
