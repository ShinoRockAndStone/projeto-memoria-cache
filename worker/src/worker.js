import { join } from "path";
import os from "os";

import { Worker } from "bullmq";
import IORedis from "ioredis";

import { compileIsolated } from "./services/compile.js";
import { runTracergrind } from "./services/tracergrind.js";
import { runTextTrace } from "./services/texttrace.js";
// import { extractSymbols } from "./services/symbols.js";
import { saveMetadata } from "./services/metadata.js";
import { extractMainMemoryAccesses } from "./services/extractMainMemoryAccesses.js";

const HOST_DATA_PATH = process.env.HOST_DATA_PATH;

if (!HOST_DATA_PATH) {
  throw new Error("HOST_DATA_PATH não definido");
}
const connection = new IORedis({
  host: "redis",
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "compile",
  async (job) => {
    const pipelineStart = Date.now();
    const { filePath, dirPath, filename } = job.data;
    const baseName = filename.replace(".c", "");
    const outputPath = join(dirPath, `${baseName}.out`);

    await job.updateData({
      ...job.data,
      stage: "compiling",
    });
    await job.updateProgress(10);
    const compileStart = Date.now();
    await compileIsolated(filePath, outputPath);
    const compileMs = Date.now() - compileStart;

    await job.updateData({
      ...job.data,
      stage: "tracing",
    });
    await job.updateProgress(40);
    const tracerStart = Date.now();
    await runTracergrind(dirPath, baseName);
    const tracergrindMs = Date.now() - tracerStart;

    await job.updateData({
      ...job.data,
      stage: "texttrace",
    });
    await job.updateProgress(70);
    const texttraceStart = Date.now();
    await runTextTrace(dirPath, baseName);
    const texttraceMs = Date.now() - texttraceStart;

    await job.updateData({
      ...job.data,
      stage: "symbols",
    });
    await job.updateProgress(90);
    // const symbolsStart = Date.now();
    // await extractSymbols(dirPath, baseName);
    // const symbolsMs = Date.now() - symbolsStart;

    const textTracePath = join(dirPath, `${baseName}.texttrace`);
    const binaryPath = join(dirPath, `${baseName}.out`);
    const memoryAccesses = extractMainMemoryAccesses(textTracePath, binaryPath);

    await job.updateData({
      ...job.data,
      stage: "completed",
    });
    await job.updateProgress(100);
    const totalMs = Date.now() - pipelineStart;
    await saveMetadata(dirPath, {
      jobId: job.id,
      filename,
      status: "completed",
      timestamps: {
        createdAt: new Date(job.timestamp).toISOString(),
        finishedAt: new Date().toISOString(),
      },
      durations: {
        compileMs,
        tracergrindMs,
        texttraceMs,
        // symbolsMs,
        totalMs,
      },
      stages: {
        compile: "completed",
        tracergrind: "completed",
        texttrace: "completed",
        // symbols: "completed",
      },
      files: {
        source: `${baseName}.c`,
        binary: `${baseName}.out`,
        trace: `${baseName}.trace`,
        texttrace: `${baseName}.texttrace`,
        // symbols: `${baseName}.elf`,
      },
      logs: {
        compile: "compile.log",
        tracergrind: "tracergrind.log",
      },
    });

    return {
      success: true,
      outputPath,
      traceFile: `${baseName}.trace`,
      textTraceFile: `${baseName}.texttrace`,
      // elfFile: `${baseName}.elf`,
    };
  },
  { connection },
);

worker.on("completed", (job, result) => {
  console.log(`Job ${job.id} concluído`);
  console.log(result);
});

worker.on("failed", async (job, err) => {
  console.error(`Job ${job?.id} falhou:`);
  console.error(err);
  if (job) {
    await job.updateData({
      ...job.data,
      stage: "failed",
    });
  }
});
