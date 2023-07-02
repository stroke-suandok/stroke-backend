import { FastifyPluginAsync } from "fastify";
import "module-alias/register";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return { root: true };
  });
};

export default root;
