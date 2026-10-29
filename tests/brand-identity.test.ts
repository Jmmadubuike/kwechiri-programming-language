import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string): Buffer => readFileSync(resolve(path));
const pngDimensions = (path: string): readonly [number, number] => {
  const image = read(path);
  expect(image.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  return [image.readUInt32BE(16), image.readUInt32BE(20)];
};

describe("Kwechiri brand identity", () => {
  it("keeps the supplied logo and required raster sizes", () => {
    expect(read("assets/brand/kwechiri-programming-language-logo-main.png").length).toBeGreaterThan(0);
    expect(pngDimensions("assets/brand/kwechiri-logo-main-128.png")).toEqual([128, 128]);
    expect(pngDimensions("assets/brand/kwechiri-mark-128.png")).toEqual([128, 128]);
    expect(pngDimensions("website/public/favicon.png")).toEqual([128, 128]);
  });

  it("shares the compact mark across the website and VS Code extension", () => {
    const mark = read("assets/brand/kwechiri-mark-128.png");
    expect(read("website/public/favicon.png")).toEqual(mark);
    expect(read("extensions/vscode/kwechiri-logo.png")).toEqual(mark);
  });

  it("keeps the owner-approved palette in the website tokens", () => {
    const styles = readFileSync(resolve("website/src/styles/global.css"), "utf8");

    for (const color of ["#0388ec", "#02b4ef", "#fe7a0c", "#12d69c", "#000000"]) {
      expect(styles).toContain(color);
    }
    for (const retiredColor of ["#123d2d", "#f3c969", "#c88a20", "#9e4f28"]) {
      expect(styles).not.toContain(retiredColor);
    }
  });
});
