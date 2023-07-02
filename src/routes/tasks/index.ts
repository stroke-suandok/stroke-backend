import { FastifyPluginAsync } from "fastify";
import { client, gql } from "../../db-client";

const tasks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is an example";
  });

  fastify.get("/tasks", async function (request, reply) {
    try {
      const result = await client.query({
        query: gql`
          query Tasks {
            tasks {
              id
            }
          }
        `,
      });
      console.log(result);
      return { data: result.data };
    } catch (e) {
      console.log(e);
      return { test: "none" };
    }
  });
};

export default tasks;
