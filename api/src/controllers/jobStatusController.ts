import fs from "node:fs";
import path from "node:path";

import { compileQueue } from "../queue.js";

export async function jobStatusController(jobId: string) {
  const job = await compileQueue.getJob(jobId);

  if (!job) {
    throw new Error("Job não encontrado");
  }

  const status = await job.getState();

  let accesses: string[] = [];

  if (status === "completed") {
    const baseName = job.data.filename.replace(".c", "");

    const analysisPath = path.join(
      job.data.dirPath,
      `${baseName}-main-memory-accesses.json`,
    );

    const analysisContent = fs.readFileSync(analysisPath, "utf8");

    const analysis = JSON.parse(analysisContent);

    accesses = analysis.accesses
      .filter((access: any) => access.accessType === "LOAD")
      .map((access: any) => access.memoryAddress);
  }

  return {
    id: job.id,
    status,

    simulation: {
      accesses,
    },
  };
}
