#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { compile } from "../compiler/compile.js";
import { KwechiriError } from "../errors/kwechiri-error.js";
import { executeJavaScript } from "../runtime/execute.js";

async function main(arguments_: readonly string[]): Promise<number> {
  const [sourcePath, ...extra] = arguments_;
  if (sourcePath === undefined || extra.length > 0) {
    console.error("Ojiji: kwechiri <faịlụ.kwe>\nUsage: kwechiri <file.kwe>");
    return 1;
  }
  if (!sourcePath.endsWith(".kwe")) {
    console.error('Faịlụ Kwechiri ga-eji ".kwe" kwụsị.');
    return 1;
  }

  const absolutePath = resolve(sourcePath);
  try {
    const source = await readFile(absolutePath, "utf8");
    executeJavaScript(compile(source, sourcePath), sourcePath);
    return 0;
  } catch (error: unknown) {
    if (error instanceof KwechiriError) {
      console.error(`KWECHIRI ERROR\n${error.message}`);
    } else if (error instanceof Error) {
      console.error(`KWECHIRI ERROR\n${error.message}`);
    } else {
      console.error("KWECHIRI ERROR\nNjehie a na-amaghị mere. (An unknown error occurred.)");
    }
    return 1;
  }
}

process.exitCode = await main(process.argv.slice(2));
