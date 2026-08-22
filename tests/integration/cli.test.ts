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
});
