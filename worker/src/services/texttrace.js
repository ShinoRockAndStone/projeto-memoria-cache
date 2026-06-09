import { exec } from "child_process";
import { basename, resolve } from "path";

const HOST_DATA_PATH = process.env.HOST_DATA_PATH;

export function runTextTrace(dirPath, baseName) {
  return new Promise((resolvePromise, reject) => {
    if (!HOST_DATA_PATH) {
      return reject("HOST_DATA_PATH não definido no .env");
    }

    const dirName = basename(dirPath);

    const command =
      `docker run --rm ` +
      `--ulimit nofile=262144:262144 ` +
      `-v "${HOST_DATA_PATH}:/data" ` +
      `texttrace ` +
      `/data/uploads/${dirName}/${baseName}.trace ` +
      `/data/uploads/${dirName}/${baseName}.texttrace`;

    console.log("HOST_DATA_PATH:", HOST_DATA_PATH);
    console.log("COMMAND:", command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        return reject(stderr || error.message);
      }

      resolvePromise(stdout);
    });
  });
}
