import { ApolloServer, BaseContext } from '@apollo/server';
import fastifyApollo, {
    fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';
import { Neo4jGraphQL } from '@neo4j/graphql';
import 'dotenv/config';
import fp from 'fastify-plugin';
import neo4j, { Driver } from 'neo4j-driver';

import { typeDefs } from '../../db/typedefs';
import { client, gql } from './client';

declare module 'fastify' {
    export interface FastifyInstance {
        apolloClient: typeof client;
        gql: typeof gql;
        neo4jDriver: Driver;
    }
}

// Neo4j driver for raw cypher queries
export const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', process.env.DB_PASSWORD || 'neo4j'),
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

export default fp(async (fastify) => {
    // Register Graphql server
    const apollo = new ApolloServer<BaseContext>({
        schema: await neoSchema.getSchema(),
        plugins: [fastifyApolloDrainPlugin(fastify)],
    });
    await neoSchema.assertIndexesAndConstraints({ options: { create: true } });
    await apollo.start();
    fastify.register(fastifyApollo(apollo));

    // Store apollo client and gql in fastify instance
    fastify.decorate('apolloClient', client);
    fastify.decorate('gql', gql);

    // Store Neo4j driver
    fastify.decorate('neo4jDriver', driver);
});
