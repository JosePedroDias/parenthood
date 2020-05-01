import { readFileSync, writeFileSync } from 'fs';
import { processPplString } from './core.mjs';

export function processPplFile(filenameIn, filenameOut) {
  const s = readFileSync(filenameIn).toString();
  const s2 = processPplString(s);
  writeFileSync(filenameOut, s2);
}

if (process.argv) {
  const args = Array.from(process.argv);
  args.shift();
  args.shift();

  if (args.length === 0) {
    console.log(
      'requires at least an input path. support an optionally 2nd output path.'
    );
  } else if (args.length === 1) {
    args.push(args[0].replace('.ppl', '.gv'));
  }

  processPplFile(args[0], args[1]);
}
