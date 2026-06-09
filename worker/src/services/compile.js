import { exec } from "child_process";
import { writeFileSync } from "fs";
import { join, dirname, resolve } from "path";

const HOST_DATA_PATH = process.env.HOST_DATA_PATH;

export function compileIsolated(filePath, outputPath) {
  return new Promise((resolvePromise, reject) => {
    if (!HOST_DATA_PATH) {
      return reject("HOST_DATA_PATH não definido no .env");
    }

    console.log("HOST_DATA_PATH:", HOST_DATA_PATH);

    const command =
      `docker run --rm ` +
      `--entrypoint gcc ` +
      `-v "${HOST_DATA_PATH}:/data" ` +
      `tracergrind ` +
      `-g ` +
      `-O0 ` +
      `-fno-pie ` +
      `-no-pie ` +
      `-fno-omit-frame-pointer ` +
      `${filePath} ` +
      `-o ${outputPath}`;

    exec(command, (error, stdout, stderr) => {
      const logPath = join(dirname(filePath), "compile.log");

      writeFileSync(
        logPath,
        [
          `COMMAND:\n${command}`,
          `\nHOST_DATA_PATH:\n${HOST_DATA_PATH}`,
          `\nFILE_PATH:\n${filePath}`,
          `\nOUTPUT_PATH:\n${outputPath}`,
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
