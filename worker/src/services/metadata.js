import { writeFileSync } from "fs";
import { join } from "path";

export function saveMetadata(dirPath, metadata) {
  const metadataPath = join(dirPath, "metadata.json");

  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}
