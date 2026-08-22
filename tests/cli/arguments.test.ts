import { describe, expect, it } from "vitest";
import { CliUsageError, parseArguments } from "../../src/cli/arguments.js";
import { defaultOutputPath } from "../../src/cli/commands.js";

describe("CLI arguments", () => {
  it("parses shorthand and named execution", () => {
    expect(parseArguments(["hello.kwe"])).toEqual({ kind: "run", sourcePath: "hello.kwe" });
    expect(parseArguments(["run", "hello.kwe"])).toEqual({ kind: "run", sourcePath: "hello.kwe" });
    expect(parseArguments(["check", "hello.kwe"])).toEqual({ kind: "check", sourcePath: "hello.kwe" });
  });

  it("parses compile options after the source", () => {
    expect(parseArguments(["compile", "hello.kwe"])).toEqual({ kind: "compile", sourcePath: "hello.kwe", force: false });
    expect(parseArguments(["compile", "hello.kwe", "--force", "--out", "build/hello.js"])).toEqual({
      kind: "compile", sourcePath: "hello.kwe", outputPath: "build/hello.js", force: true,
    });
  });

  it("derives a sibling output by replacing only the final extension", () => {
    expect(defaultOutputPath("hello.kwe")).toBe("hello.js");
    expect(defaultOutputPath("src/example.hello.kwe")).toBe("src/example.hello.js");
  });

  it("parses global and command help and global version", () => {
    expect(parseArguments(["--help"])).toEqual({ kind: "help" });
    expect(parseArguments(["run", "--help"])).toEqual({ kind: "help", command: "run" });
    expect(parseArguments(["check", "--help"])).toEqual({ kind: "help", command: "check" });
    expect(parseArguments(["compile", "--help"])).toEqual({ kind: "help", command: "compile" });
    expect(parseArguments(["--version"])).toEqual({ kind: "version" });
  });

  it("rejects invalid usage", () => {
    const invalidArguments: readonly (readonly string[])[] = [
      [], ["run"], ["check"], ["compile"], ["run", "hello.kwe", "extra"],
      ["check", "hello.kwe", "--force"], ["run", "hello.kwe", "--force"],
      ["run", "hello.kwe", "--out", "hello.js"], ["unknown", "hello.kwe"], ["--unknown"],
      ["run", "hello.KWE"], ["compile", "hello.kwe", "--out"],
      ["compile", "hello.kwe", "--out", "hello.JS"],
      ["compile", "hello.kwe", "--out", "one.js", "--out", "two.js"],
      ["compile", "hello.kwe", "--force", "--force"], ["compile", "--force", "hello.kwe"],
      ["--help", "extra"], ["--version", "extra"],
    ];
    for (const arguments_ of invalidArguments) expect(() => parseArguments(arguments_)).toThrow(CliUsageError);
  });
});
