import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import crypto from "crypto";

import { compileQueue } from "../queue.js";

export async function uploadController(file: any) {
  const baseName = file.filename.replace(".c", "");

  // gera ID único
  const uniqueId = crypto.randomUUID();

  const folderName = `${uniqueId}-${baseName}`;

  const dirPath = path.resolve("/data/uploads", folderName);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, file.filename);

  // salva arquivo
  await pipeline(file.file, fs.createWriteStream(filePath));

  // cria job JÁ COM DADOS COMPLETOS
  const job = await compileQueue.add("compile-job", {
    filename: file.filename,
    dirPath,
    filePath,
    folderName,
  });

  return {
    message: "Arquivo recebido com sucesso",
    jobId: job.id,
    folder: folderName,
  };
}
