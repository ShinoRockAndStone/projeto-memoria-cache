import { Queue } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis({
  host: "redis",
  port: 6379,
  maxRetriesPerRequest: null,
});

export const compileQueue = new Queue("compile", { connection });
