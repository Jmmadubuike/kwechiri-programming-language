import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface PackageMetadata {
  readonly license?: string;
}

const readPackage = (path: string): PackageMetadata =>
  JSON.parse(readFileSync(resolve(path), "utf8")) as PackageMetadata;

describe("project license", () => {
  it("uses the standard MIT text and copyright notice", () => {
    const license = readFileSync(resolve("LICENSE"), "utf8");

    expect(license).toMatch(/^MIT License\n\nCopyright \(c\) 2026 Joseph Mmadubuike\n/u);
    expect(license).toContain("Permission is hereby granted, free of charge");
    expect(license).toContain("THE SOFTWARE IS PROVIDED \"AS IS\"");
  });

  it("declares MIT in compiler, website, and VS Code extension packages", () => {
    expect(readPackage("package.json").license).toBe("MIT");
    expect(readPackage("website/package.json").license).toBe("MIT");
    expect(readPackage("extensions/vscode/package.json").license).toBe("MIT");
  });
});
