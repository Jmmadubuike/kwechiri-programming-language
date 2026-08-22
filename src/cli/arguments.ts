export type CliRequest =
  | { readonly kind: "help"; readonly command?: "run" | "check" | "compile" }
  | { readonly kind: "version" }
  | { readonly kind: "run"; readonly sourcePath: string }
  | { readonly kind: "check"; readonly sourcePath: string }
  | { readonly kind: "compile"; readonly sourcePath: string; readonly outputPath?: string; readonly force: boolean };

export class CliUsageError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "CliUsageError";
  }
}

const requireSourceExtension = (sourcePath: string): void => {
  if (!sourcePath.endsWith(".kwe")) {
    throw new CliUsageError('Kwechiri source files must end in lowercase ".kwe".');
  }
};

const parseSimpleCommand = (command: "run" | "check", arguments_: readonly string[]): CliRequest => {
  if (arguments_.length === 1 && arguments_[0] === "--help") return { kind: "help", command };
  if (arguments_.length !== 1) throw new CliUsageError(`Usage: kwechiri ${command} <file.kwe>`);
  const sourcePath = arguments_[0] as string;
  if (sourcePath.startsWith("-")) throw new CliUsageError(`Unknown option: ${sourcePath}`);
  requireSourceExtension(sourcePath);
  return { kind: command, sourcePath };
};

const parseCompile = (arguments_: readonly string[]): CliRequest => {
  if (arguments_.length === 1 && arguments_[0] === "--help") return { kind: "help", command: "compile" };
  const sourcePath = arguments_[0];
  if (sourcePath === undefined || sourcePath.startsWith("-")) {
    throw new CliUsageError("Usage: kwechiri compile <file.kwe> [--out <file.js>] [--force]");
  }
  requireSourceExtension(sourcePath);

  let outputPath: string | undefined;
  let force = false;
  for (let index = 1; index < arguments_.length; index += 1) {
    const argument = arguments_[index] as string;
    if (argument === "--force") {
      if (force) throw new CliUsageError('Option "--force" may be supplied only once.');
      force = true;
      continue;
    }
    if (argument === "--out") {
      if (outputPath !== undefined) throw new CliUsageError('Option "--out" may be supplied only once.');
      const value = arguments_[index + 1];
      if (value === undefined || value.startsWith("-")) throw new CliUsageError('Option "--out" requires a file path.');
      if (!value.endsWith(".js")) throw new CliUsageError('Compiled output must end in lowercase ".js".');
      outputPath = value;
      index += 1;
      continue;
    }
    throw new CliUsageError(argument.startsWith("-") ? `Unknown option: ${argument}` : `Unexpected argument: ${argument}`);
  }

  return { kind: "compile", sourcePath, ...(outputPath === undefined ? {} : { outputPath }), force };
};

export function parseArguments(arguments_: readonly string[]): CliRequest {
  const [first, ...rest] = arguments_;
  if (first === undefined) throw new CliUsageError('Usage: kwechiri <file.kwe> | <command> [options]\nUse "kwechiri --help" for help.');
  if (first === "--help") {
    if (rest.length > 0) throw new CliUsageError('Option "--help" does not accept arguments.');
    return { kind: "help" };
  }
  if (first === "--version") {
    if (rest.length > 0) throw new CliUsageError('Option "--version" does not accept arguments.');
    return { kind: "version" };
  }
  if (first === "run" || first === "check") return parseSimpleCommand(first, rest);
  if (first === "compile") return parseCompile(rest);
  if (first.startsWith("-")) throw new CliUsageError(`Unknown option: ${first}`);
  if (rest.length > 0) throw new CliUsageError(`Unknown command or extra arguments: ${first}`);
  requireSourceExtension(first);
  return { kind: "run", sourcePath: first };
}
