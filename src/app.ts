import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import { ApolloServer, BaseContext } from "@apollo/server";
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";

import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import "dotenv/config";

const typeDefs = `#graphql
type TASK {
  id: ID @id
  taskType: String
  title: String
  followedBy: [TASK!]! @relationship(type: "FOLLOWED_BY", direction: OUT)
  precededBy: [TASK!]! @relationship(type: "FOLLOWED_BY", direction: IN)
  inTaskGroup: TASK_GROUP @relationship(type: "IN", direction: OUT)
}

type TASK_GROUP {
  id: ID @id
  hasTasks: [TASK!]! @relationship(type: "IN", direction: IN)
}
`;

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", process.env.DB_PASSWORD || "neo4j")
);

// console.log({debug: process.env.DEBUG})
const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!
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
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });
};

export default app;
export { app, options };
