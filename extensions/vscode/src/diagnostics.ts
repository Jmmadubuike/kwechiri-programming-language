import { KwechiriError } from "../../../src/errors/kwechiri-error.js";

export interface KwechiriProblem {
  readonly fileName: string;
  readonly line: number;
  readonly column: number;
  readonly message: string;
}

export function compilerProblemFromError(error: unknown, fallbackFileName: string): KwechiriProblem | undefined {
  if (!(error instanceof KwechiriError)) return undefined;

  const fileName = error.fileName ?? fallbackFileName;
  const line = Math.max(1, error.location.line);
  const column = Math.max(1, error.location.column);
  const locationPrefix = `${fileName}:${line}:${column}: `;
  const message = error.message.startsWith(locationPrefix)
    ? error.message.slice(locationPrefix.length)
    : error.message;

  return { fileName, line, column, message };
}

export function diagnosticFileName(problem: KwechiriProblem, entryFileName: string, targetExists: boolean): string {
  return problem.fileName === entryFileName || targetExists ? problem.fileName : entryFileName;
}
