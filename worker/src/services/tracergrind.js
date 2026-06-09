import { exec } from "child_process";
import { writeFileSync } from "fs";
import { join, basename, resolve } from "path";

const HOST_DATA_PATH = process.env.HOST_DATA_PATH;

export function runTracergrind(dirPath, baseName) {
  return new Promise((resolvePromise, reject) => {
    if (!HOST_DATA_PATH) {
      return reject("HOST_DATA_PATH não definido no .env");
    }

    const dirName = basename(dirPath);

    const command =
      `docker run --rm ` +
      `--ulimit nofile=262144:262144 ` +
      `-v "${HOST_DATA_PATH}:/data" ` +
      `tracergrind ` +
      `-d -d --tool=tracergrind ` +
      `--output=/data/uploads/${dirName}/${baseName}.trace ` +
      `/data/uploads/${dirName}/${baseName}.out`;

    console.log("HOST_DATA_PATH:", HOST_DATA_PATH);
    console.log("COMMAND:", command);

    exec(command, (error, stdout, stderr) => {
      const logPath = join(dirPath, "tracergrind.log");

      writeFileSync(
        logPath,
        [
          `COMMAND:\n${command}`,
          `\nHOST_DATA_PATH:\n${HOST_DATA_PATH}`,
          `\nSTDOUT:\n${stdout}`,
          `\nSTDERR:\n${stderr}`,
        ].join("\n"),
      );

      if (error) {
        return reject(stderr || error.message);
      }

      resolvePromise(stdout);
    });
  });
}
