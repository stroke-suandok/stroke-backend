import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from '@neo4j/graphql';
import 'dotenv/config';
import neo4j from 'neo4j-driver';

import { typeDefs } from '../src/db/typeDefs';

const main = async () => {
    const driver = neo4j.driver(
        'bolt://localhost:7687',
        neo4j.auth.basic('neo4j', process.env.DB_PASSWORD || ''),
    );

    // console.log({debug: process.env.DEBUG})
    const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

    const server = new ApolloServer({
        schema: await neoSchema.getSchema(),
    });

    const { url } = await startStandaloneServer(server, {
        context: async ({ req }) => ({ req }),
        listen: { port: 4000 },
    });

    console.log(`🚀 Server ready at ${url}`);
};

main();
