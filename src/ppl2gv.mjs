import { readFileSync, writeFileSync } from 'fs';
import { processPplString } from './src/core.mjs';

export function processPplFile(filenameIn, filenameOut) {
  const s = readFileSync(filenameIn).toString();
  const s2 = processPplString(s);
  writeFileSync(filenameOut, s2);
}
