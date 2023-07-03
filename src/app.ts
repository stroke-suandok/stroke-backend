import { ApolloServer, BaseContext } from '@apollo/server';
import fastifyApollo, {
    fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import 'dotenv/config';
import { FastifyPluginAsync } from 'fastify';
import { join } from 'path';

import { neoSchema } from './db/server';

export type AppOptions = {
    // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts,
): Promise<void> => {
    // Place here your custom code!

    // Graphql server
    const apollo = new ApolloServer<BaseContext>({
        schema: await neoSchema.getSchema(),
        plugins: [fastifyApolloDrainPlugin(fastify)],
    });
    await apollo.start();
    await fastify.register(fastifyApollo(apollo));

    // Do not touch the following lines

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application
    void fastify.register(AutoLoad, {
        dir: join(__dirname, 'plugins'),
        options: opts,
    });

    // This loads all plugins defined in routes
    // define your routes in one of these
    void fastify.register(AutoLoad, {
        dir: join(__dirname, 'routes'),
        options: opts,
    });
};

export default app;
export { app, options };
