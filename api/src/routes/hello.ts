import type { FastifyInstance } from "fastify";
import { helloController } from "../controllers/helloController.js";

export async function helloRoutes(app: FastifyInstance) {
  app.get("/hello", async (request, reply) => {
    return helloController();
  });
}
