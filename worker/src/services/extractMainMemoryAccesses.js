import fs from "fs";
import path from "path";
import { execSync } from "child_process";

function getMainRange(binaryPath) {
  const output = execSync(`readelf -s ${binaryPath}`).toString();

  const mainLine = output.split("\n").find((line) => line.includes(" main"));

  if (!mainLine) {
    throw new Error("Função main não encontrada");
  }

  const parts = mainLine.trim().split(/\s+/);

  const start = parseInt(parts[1], 16);
  const size = parseInt(parts[2], 10);

  const end = start + size - 1;

  return {
    start,
    end,
    size,
  };
}

function getObjdumpOutput(binaryPath) {
  return execSync(`objdump -d "${binaryPath}" --disassemble=main`).toString();
}

function getMainInstructionAddresses(binaryPath) {
  const objdump = getObjdumpOutput(binaryPath);

  const addresses = [];

  for (const line of objdump.split("\n")) {
    const match = line.match(/^\s*([0-9a-fA-F]+):/);

    if (!match) {
      continue;
    }

    addresses.push(match[1].toLowerCase().padStart(16, "0"));
  }

  if (addresses.length === 0) {
    throw new Error(
      `[extractMainMemoryAccesses] No instructions found for main in ${binaryPath}`,
    );
  }

  return addresses;
}

function parseMemoryAccesses(text) {
  const regex =
    /\[M\].*?INS_ADDRESS:\s*([0-9a-fA-F]+).*?START_ADDRESS:\s*([0-9a-fA-F]+).*?LENGTH:\s*(\d+).*?MODE:\s*([RW])/g;

  const accesses = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const insAddress = parseInt(match[1], 16);
    const memAddress = parseInt(match[2], 16);
    const length = parseInt(match[3], 10);
    const mode = match[4];

    accesses.push({
      insAddress,
      instructionAddress: `0x${insAddress.toString(16)}`,
      memoryAddress: `0x${memAddress.toString(16)}`,
      accessType: mode === "R" ? "LOAD" : "STORE",
      size: length,
    });
  }

  return accesses;
}

function buildMainMemoryAccessesResult(baseName, main, accesses) {
  const loads = accesses.filter(
    (access) => access.accessType === "LOAD",
  ).length;
  const stores = accesses.filter(
    (access) => access.accessType === "STORE",
  ).length;

  return {
    program: {
      name: baseName,
      main: {
        start: `0x${main.start.toString(16)}`,
        end: `0x${main.end.toString(16)}`,
        size: main.size,
      },
    },
    statistics: {
      totalAccesses: accesses.length,
      loads,
      stores,
    },
    accesses: accesses.map(
      ({ instructionAddress, memoryAddress, accessType, size }) => ({
        instructionAddress,
        memoryAddress,
        accessType,
        size,
      }),
    ),
  };
}

function writeMainMemoryAccessesResult(
  textTracePath,
  baseName,
  main,
  accesses,
) {
  const dirPath = path.dirname(textTracePath);
  const outputPath = path.join(
    dirPath,
    `${baseName}-main-memory-accesses.json`,
  );
  const result = buildMainMemoryAccessesResult(baseName, main, accesses);

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  return result;
}

function saveSliceTextToBinaryDir(binaryPath, baseName, sliceText) {
  const dirPath = path.dirname(binaryPath);
  const outputPath = path.join(dirPath, `${baseName}-main-slice.txt`);
  fs.writeFileSync(outputPath, sliceText, "utf8");
  return outputPath;
}

function saveObjdumpOutput(binaryPath, baseName, objdumpText) {
  const dirPath = path.dirname(binaryPath);
  const outputPath = path.join(dirPath, `${baseName}-objdump.txt`);
  fs.writeFileSync(outputPath, objdumpText, "utf8");
  console.log(
    `[extractMainMemoryAccesses] Saved objdump output to ${outputPath}`,
  );
  return outputPath;
}

export function extractMainMemoryAccesses(textTracePath, binaryPath) {
  return extractMainMemoryAccessesFromInstructions(textTracePath, binaryPath);
}

function extractMainMemoryAccessesFromInstructions(textTracePath, binaryPath) {
  console.log(
    `[extractMainMemoryAccesses] Extracting memory accesses from main`,
  );

  const { start, end, size } = getMainRange(binaryPath);

  const baseName = path.basename(textTracePath).replace(".texttrace", "");

  const objdumpOutput = getObjdumpOutput(binaryPath);

  const mainInstructions = getMainInstructionAddresses(binaryPath);

  const mainInstructionSet = new Set(mainInstructions);

  saveMainInstructionsToBinaryDir(binaryPath, baseName, mainInstructions);

  saveObjdumpOutput(binaryPath, baseName, objdumpOutput);

  const lines = fs.readFileSync(textTracePath, "utf8").split("\n");

  const filteredMemoryLines = [];
  const seenInstructions = new Set();

  for (const line of lines) {
    if (!line.startsWith("[M]")) {
      continue;
    }

    const match = line.match(/INS_ADDRESS:\s+([0-9a-fA-F]{16})/);

    if (!match) {
      continue;
    }

    const instructionAddress = match[1].toLowerCase();

    if (!mainInstructionSet.has(instructionAddress)) {
      continue;
    }

    seenInstructions.add(instructionAddress);
    filteredMemoryLines.push(line);
  }

  const sliceText = filteredMemoryLines.join("\n");

  saveSliceTextToBinaryDir(binaryPath, baseName, sliceText);

  const accesses = parseMemoryAccesses(sliceText);

  console.log(
    `[extractMainMemoryAccesses] Main contains ${mainInstructionSet.size} instructions`,
  );

  console.log(
    `[extractMainMemoryAccesses] Memory accesses originated from ${seenInstructions.size} main instructions`,
  );

  console.log(
    `[extractMainMemoryAccesses] Extracted ${accesses.length} memory accesses from main`,
  );

  return writeMainMemoryAccessesResult(
    textTracePath,
    baseName,
    { start, end, size },
    accesses,
  );
}

function saveMainInstructionsToBinaryDir(binaryPath, baseName, instructions) {
  const dirPath = path.dirname(binaryPath);

  const outputPath = path.join(dirPath, `${baseName}-main-instructions.txt`);

  fs.writeFileSync(outputPath, instructions.join("\n"), "utf8");

  console.log(
    `[extractMainMemoryAccesses] Saved main instructions to ${outputPath}`,
  );

  return outputPath;
}
