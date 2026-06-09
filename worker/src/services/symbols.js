import { exec } from "child_process";
import { join } from "path";

export function extractSymbols(dirPath, baseName) {
  return new Promise((resolve, reject) => {
    const outputFile = join(dirPath, `${baseName}.symbols`);
    const binaryPath = join(dirPath, `${baseName}.out`);

    const command = `
      readelf -Wa ${binaryPath} | grep -e .text -e main > ${outputFile}
    `;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr);
      }

      resolve(stdout);
    });
  });
}
