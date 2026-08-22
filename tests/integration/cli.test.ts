import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("Kwechiri CLI", () => {
  it(
    "runs hello.kwe",
    async () => {
      const { stdout, stderr } = await execFileAsync(
        process.execPath,
        ["dist/cli/index.js", "hello.kwe"],
        { encoding: "utf8" },
      );
      expect(stdout.trim()).toBe("Ndewo Ụwa!");
      expect(stderr).toBe("");
    },
    15_000,
  );

  it(
    "runs examples/variables.kwe",
    async () => {
      const { stdout, stderr } = await execFileAsync(
        process.execPath,
        ["dist/cli/index.js", "examples/variables.kwe"],
        { encoding: "utf8" },
      );
      expect(stdout.trim().split(/\r?\n/u)).toEqual(["Uche", "36"]);
      expect(stderr).toBe("");
    },
    15_000,
  );

  it(
    "runs examples/expressions.kwe",
    async () => {
      const { stdout, stderr } = await execFileAsync(
        process.execPath,
        ["dist/cli/index.js", "examples/expressions.kwe"],
        { encoding: "utf8" },
      );
      expect(stdout.trim().split(/\r?\n/u)).toEqual(["60", "15", "-3"]);
      expect(stderr).toBe("");
    },
    15_000,
  );

  it(
    "reports division by zero as a Kwechiri CLI error",
    async () => {
      await expect(
        execFileAsync(process.execPath, ["dist/cli/index.js", "tests/fixtures/division-by-zero.kwe"], {
          encoding: "utf8",
        }),
      ).rejects.toMatchObject({
        stderr: expect.stringContaining("tests/fixtures/division-by-zero.kwe:1:11: Enweghị ike ikewa site na efu."),
      });
    },
    15_000,
  );

  it(
    "runs examples/conditions.kwe",
    async () => {
      const { stdout, stderr } = await execFileAsync(
        process.execPath,
        ["dist/cli/index.js", "examples/conditions.kwe"],
        { encoding: "utf8" },
      );
      expect(stdout.trim()).toBe("Okenye");
      expect(stderr).toBe("");
    },
    15_000,
  );

  it(
    "runs examples/loops.kwe",
    async () => {
      const { stdout, stderr } = await execFileAsync(
        process.execPath,
        ["dist/cli/index.js", "examples/loops.kwe"],
        { encoding: "utf8" },
      );
      expect(stdout.trim().split(/\r?\n/u)).toEqual(["1", "2", "3", "4", "5"]);
      expect(stderr).toBe("");
    },
    15_000,
  );

  it(
    "runs examples/functions.kwe",
    async () => {
      const { stdout, stderr } = await execFileAsync(
        process.execPath,
        ["dist/cli/index.js", "examples/functions.kwe"],
        { encoding: "utf8" },
      );
      expect(stdout.trim()).toBe("30");
      expect(stderr).toBe("");
    },
    15_000,
  );

  it(
    "runs examples/collections.kwe",
    async () => {
      const { stdout, stderr } = await execFileAsync(
        process.execPath,
        ["dist/cli/index.js", "examples/collections.kwe"],
        { encoding: "utf8" },
      );
      expect(stdout.trim().split(/\r?\n/u)).toEqual([
        '["Uche","Ada","Obi"]',
        '{"aha":"Uche","afọ":36}',
        "Uche",
      ]);
      expect(stderr).toBe("");
    },
    15_000,
  );

  it(
    "runs a multi-file module program",
    async () => {
      const { stdout, stderr } = await execFileAsync(
        process.execPath,
        ["dist/cli/index.js", "examples/modules/main.kwe"],
        { encoding: "utf8" },
      );
      expect(stdout.trim()).toBe("5.14159");
      expect(stderr).toBe("");
    },
    15_000,
  );

  it(
    "reports circular module dependencies",
    async () => {
      await expect(execFileAsync(process.execPath, ["dist/cli/index.js", "tests/fixtures/modules/cycle-a.kwe"], { encoding: "utf8" })).rejects.toMatchObject({
        stderr: expect.stringContaining("Circular dependency"),
      });
    },
    15_000,
  );

  it(
    "reports a missing named export",
    async () => {
      await expect(execFileAsync(process.execPath, ["dist/cli/index.js", "tests/fixtures/modules/missing-export.kwe"], { encoding: "utf8" })).rejects.toMatchObject({
        stderr: expect.stringContaining("Missing export"),
      });
    },
    15_000,
  );
});
