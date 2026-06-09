import type { FastifyInstance } from "fastify";
import { jobStatusController } from "../controllers/jobStatusController.js";

export async function jobStatusRoutes(app: FastifyInstance) {
  app.get("/jobs/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const result = await jobStatusController(id);

      return reply.send(result);
    } catch (error: any) {
      return reply.status(404).send({
        error: error.message,
      });
    }
  });
}
