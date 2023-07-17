import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';

import { createBlueprint } from './services';
import { CreateBlueprintReq } from './types';

const blueprints: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.route({
        method: 'POST',
        schema: { body: CreateBlueprintReq },
        url: '/',
        handler: async (request, reply) => {
            const data = await createBlueprint(server, request.body);
            return data;
        },
    });
};

export default blueprints;
