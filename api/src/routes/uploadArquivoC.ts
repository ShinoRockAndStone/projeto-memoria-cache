import type { FastifyInstance } from "fastify";
import { Readable } from "stream";
import { uploadController } from "../controllers/uploadArquivoCController.js";

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: "No file uploaded" });
    }

    if (!data.filename.endsWith(".c")) {
      return reply.status(400).send({ error: "Only .c files are allowed" });
    }

    const fileBuffer = await data.toBuffer();

    if (fileBuffer.length > 800) {
      return reply.status(400).send({ error: "File cannot exceed 800 bytes" });
    }

    return uploadController({
      ...data,
      file: Readable.from(fileBuffer),
    });
  });
}
