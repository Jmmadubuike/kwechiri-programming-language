import { describe, expect, it, vi } from "vitest";
import { runCli, type CliIo } from "../../src/cli/app.js";
import { defaultCommandDependencies, executeRequest } from "../../src/cli/commands.js";
import { ExitCode } from "../../src/cli/exit-codes.js";
import { KwechiriError } from "../../src/errors/kwechiri-error.js";
import { KwechiriRuntimeError } from "../../src/runtime/kwechiri-runtime.js";

const captureIo = (): { io: CliIo; stdout: ReturnType<typeof vi.fn>; stderr: ReturnType<typeof vi.fn> } => {
  const stdout = vi.fn();
  const stderr = vi.fn();
  return { io: { stdout, stderr }, stdout, stderr };
};

describe("CLI application", () => {
  it("maps help to stdout and success", async () => {
    const { io, stdout, stderr } = captureIo();
    expect(await runCli(["--help"], io)).toBe(ExitCode.Success);
    expect(stdout).toHaveBeenCalledWith(expect.stringContaining("kwechiri run"));
    expect(stderr).not.toHaveBeenCalled();
  });

  it("maps usage failures to stderr and exit 2", async () => {
    const { io, stdout, stderr } = captureIo();
    expect(await runCli([], io)).toBe(ExitCode.InvalidUsage);
    expect(stdout).not.toHaveBeenCalled();
    expect(stderr).toHaveBeenCalledWith(expect.stringContaining("KWECHIRI USAGE ERROR"));
  });

  it("maps Kwechiri compiler and runtime errors to exit 1", async () => {
    for (const error of [
      new KwechiriError("bad source", { line: 1, column: 1, offset: 0 }, "bad.kwe"),
      new KwechiriRuntimeError("bad runtime", "DIVISION_BY_ZERO", { line: 1, column: 1, offset: 0 }, "bad.kwe"),
    ]) {
      const { io, stderr } = captureIo();
      const dependencies = { ...defaultCommandDependencies, compileFile: vi.fn().mockRejectedValue(error) };
      expect(await runCli(["check", "bad.kwe"], io, dependencies)).toBe(ExitCode.KwechiriDiagnostic);
      expect(stderr).toHaveBeenCalledWith(expect.stringContaining("KWECHIRI ERROR"));
    }
  });

  it("maps recognized filesystem errors to exit 3", async () => {
    const { io, stderr } = captureIo();
    const error = Object.assign(new Error("missing"), { code: "ENOENT" });
    const dependencies = { ...defaultCommandDependencies, compileFile: vi.fn().mockRejectedValue(error) };
    expect(await runCli(["check", "missing.kwe"], io, dependencies)).toBe(ExitCode.FileSystemFailure);
    expect(stderr).toHaveBeenCalledWith(expect.stringContaining("KWECHIRI FILESYSTEM ERROR"));
  });

  it("maps unexpected errors and thrown values to exit 4 without stacks", async () => {
    for (const error of [new Error("compiler defect"), "unexpected value"]) {
      const { io, stderr } = captureIo();
      const dependencies = { ...defaultCommandDependencies, compileFile: vi.fn().mockRejectedValue(error) };
      expect(await runCli(["check", "valid.kwe"], io, dependencies)).toBe(ExitCode.InternalFailure);
      const message = String(stderr.mock.calls[0]?.[0]);
      expect(message).toContain("KWECHIRI INTERNAL ERROR");
      expect(message).not.toContain("at ");
    }
  });

  it("checks without executing generated JavaScript", async () => {
    const compileFile = vi.fn().mockResolvedValue("generated");
    const executeJavaScript = vi.fn();
    await executeRequest({ kind: "check", sourcePath: "hello.kwe" }, vi.fn(), {
      ...defaultCommandDependencies, compileFile, executeJavaScript,
    });
    expect(compileFile).toHaveBeenCalledOnce();
    expect(executeJavaScript).not.toHaveBeenCalled();
  });

  it("guards source and output identity even when force is set", async () => {
    await expect(executeRequest(
      { kind: "compile", sourcePath: "same.kwe", outputPath: "same.kwe", force: true },
      vi.fn(),
      { ...defaultCommandDependencies, compileFile: vi.fn().mockResolvedValue("generated") },
    )).rejects.toThrow(/must not resolve to the source/);
  });

  it("guards an existing output alias that resolves to the source", async () => {
    const realpath = vi.fn().mockResolvedValue("canonical-source.kwe");
    await expect(executeRequest(
      { kind: "compile", sourcePath: "source.kwe", outputPath: "alias.js", force: true },
      vi.fn(),
      { ...defaultCommandDependencies, compileFile: vi.fn().mockResolvedValue("generated"), realpath },
    )).rejects.toThrow(/must not resolve to the source/);
    expect(realpath).toHaveBeenCalledTimes(2);
  });
});
