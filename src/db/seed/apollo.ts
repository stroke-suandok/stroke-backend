import { ApolloServer, BaseContext } from '@apollo/server';
import { Neo4jGraphQL } from '@neo4j/graphql';
import 'dotenv/config';
import neo4j from 'neo4j-driver';

import { typeDefs } from '../typedefs';

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', process.env.DB_PASSWORD || 'neo4j'),
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

export async function getApolloServer() {
    const apollo = new ApolloServer<BaseContext>({
        schema: await neoSchema.getSchema(),
    });
    await neoSchema.assertIndexesAndConstraints({ options: { create: true } });
    return { apollo, driver };
}
