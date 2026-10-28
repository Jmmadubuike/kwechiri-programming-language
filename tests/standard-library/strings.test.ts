import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { compileFile } from "../../src/compiler/compile-file.js";
import { loadModuleGraph } from "../../src/modules/loader.js";
import { executeJavaScript } from "../../src/runtime/execute.js";
import { standardModule } from "../../src/standard-library/catalog.js";

const temporaryDirectories: string[] = [];
const temporaryDirectory = (): string => {
  const directory = mkdtempSync(join(tmpdir(), "kwechiri-standard-library-"));
  temporaryDirectories.push(directory);
  return directory;
};
const write = (root: string, name: string, source: string): string => {
  const file = join(root, name);
  writeFileSync(file, source, "utf8");
  return file;
};
const outputOf = async (source: string, directory = temporaryDirectory()): Promise<unknown[]> => {
  const output = vi.fn();
  executeJavaScript(await compileFile(write(directory, "main.kwe", source)), "main.kwe", {
    print: output,
    divide: (left, right) => left / right,
    index: (collection, index) => collection[index],
    setIndex: (collection, index, value) => { collection[index] = value; },
  });
  return output.mock.calls.map(([value]) => value);
};

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe("kwechiri:eriri", () => {
  it("records the five approved exports in the declarative catalog", () => {
    const module = standardModule("kwechiri:eriri");
    expect([...module?.exports.values() ?? []]).toEqual([
      expect.objectContaining({ publicName: "nwereEriri", arity: 2, parameterTypes: ["string", "string"], returnType: "boolean", mutation: "none", intrinsic: "stringContains" }),
      expect.objectContaining({ publicName: "maliteNa", arity: 2, parameterTypes: ["string", "string"], returnType: "boolean", mutation: "none", intrinsic: "stringStartsWith" }),
      expect.objectContaining({ publicName: "kwụsịNa", arity: 2, parameterTypes: ["string", "string"], returnType: "boolean", mutation: "none", intrinsic: "stringEndsWith" }),
      expect.objectContaining({ publicName: "ogologoEriri", arity: 1, parameterTypes: ["string"], returnType: "number", mutation: "none", intrinsic: "stringGraphemeLength" }),
      expect.objectContaining({ publicName: "jikọọEriri", arity: 2, parameterTypes: ["string", "string"], returnType: "string", mutation: "none", intrinsic: "stringConcat" }),
    ]);
  });

  it("implements true and false cases for all three predicates", async () => {
    const source = [
      'webata { nwereEriri, maliteNa, kwụsịNa } site na "kwechiri:eriri"',
      'bipụta(nwereEriri("Kwechiri", "chiri"))',
      'bipụta(nwereEriri("Kwechiri", "CHIRI"))',
      'bipụta(maliteNa("Kwechiri", "Kwe"))',
      'bipụta(maliteNa("Kwechiri", "kwe"))',
      'bipụta(kwụsịNa("Kwechiri", "chiri"))',
      'bipụta(kwụsịNa("Kwechiri", "Chiri"))',
    ].join("\n");
    expect(await outputOf(source)).toEqual([true, false, true, false, true, false]);
  });

  it("defines empty strings using exact sequence semantics", async () => {
    const source = [
      'webata { nwereEriri, maliteNa, kwụsịNa } site na "kwechiri:eriri"',
      'bipụta(nwereEriri("", ""))',
      'bipụta(nwereEriri("Kwe", ""))',
      'bipụta(maliteNa("", ""))',
      'bipụta(maliteNa("Kwe", ""))',
      'bipụta(kwụsịNa("", ""))',
      'bipụta(kwụsịNa("Kwe", ""))',
      'bipụta(nwereEriri("", "K"))',
    ].join("\n");
    expect(await outputOf(source)).toEqual([true, true, true, true, true, true, false]);
  });

  it("supports Igbo text while keeping string contents raw and case-sensitive", async () => {
    const decomposed = "ụbọchị".normalize("NFD");
    const source = [
      'webata { nwereEriri, maliteNa, kwụsịNa } site na "kwechiri:eriri"',
      'bipụta(nwereEriri("Ụbọchị ọma", "bọchị"))',
      'bipụta(maliteNa("Ụbọchị ọma", "Ụbọchị"))',
      'bipụta(kwụsịNa("Ụbọchị ọma", "ọma"))',
      `bipụta(nwereEriri("ụbọchị", "${decomposed}"))`,
      'bipụta(nwereEriri("Ụbọchị", "ụbọchị"))',
    ].join("\n");
    expect(await outputOf(source)).toEqual([true, true, true, false, false]);
  });

  it("uses NFC identity for public names without adding case folding or aliases", async () => {
    const decomposedName = "kwụsịNa".normalize("NFD");
    expect(await outputOf(`webata { ${decomposedName} } site na "kwechiri:eriri"\nbipụta(${decomposedName}("Kwechiri", "chiri"))`)).toEqual([true]);
    const directory = temporaryDirectory();
    await expect(loadModuleGraph(write(directory, "case.kwe", 'webata { KwụsịNa } site na "kwechiri:eriri"'))).rejects.toThrow(/Unknown Kwechiri standard export/);
  });

  it("counts user-perceived grapheme clusters for empty, ASCII, and Igbo text", async () => {
    const decomposed = "ụbọchị".normalize("NFD");
    const source = [
      'webata { ogologoEriri } site na "kwechiri:eriri"',
      'bipụta(ogologoEriri(""))',
      'bipụta(ogologoEriri("Kwechiri"))',
      'bipụta(ogologoEriri("ụbọchị"))',
      `bipụta(ogologoEriri("${decomposed}"))`,
      'bipụta(ogologoEriri("👩🏽‍💻"))',
      'bipụta(ogologoEriri("🇳🇬"))',
    ].join("\n");

    expect(await outputOf(source)).toEqual([0, 8, 6, 6, 1, 1]);
  });

  it("concatenates exact raw strings without coercion or normalization", async () => {
    const composed = "ụ";
    const decomposed = composed.normalize("NFD");
    const source = [
      'webata { jikọọEriri } site na "kwechiri:eriri"',
      'bipụta(jikọọEriri("", ""))',
      'bipụta(jikọọEriri("Kwe", "chiri"))',
      'bipụta(jikọọEriri("ụbọchị", " ọma"))',
      `bipụta(jikọọEriri("${composed}", "${decomposed}"))`,
    ].join("\n");

    const output = await outputOf(source);
    expect(output).toEqual(["", "Kwechiri", "ụbọchị ọma", composed + decomposed]);
    expect(output[3]).not.toBe(composed + composed);
  });

  it.each([
    ['nwereEriri(42, "x")', /argument type mismatch/i],
    ['maliteNa("x", eziokwu)', /argument type mismatch/i],
    ['kwụsịNa("x")', /argument count/i],
    ['nwereEriri("x", "x", "x")', /argument count/i],
    ["ogologoEriri(42)", /argument type mismatch/i],
    ['ogologoEriri("x", "y")', /argument count/i],
    ['jikọọEriri("x")', /argument count/i],
    ['jikọọEriri("x", eziokwu)', /argument type mismatch/i],
  ])("rejects invalid call %s with a located semantic diagnostic", async (call, message) => {
    const directory = temporaryDirectory();
    const source = `webata { nwereEriri, maliteNa, kwụsịNa, ogologoEriri, jikọọEriri } site na "kwechiri:eriri"\nvalue = ${call}`;
    await expect(compileFile(write(directory, "invalid.kwe", source))).rejects.toThrow(message);
    await expect(compileFile(join(directory, "invalid.kwe"))).rejects.toThrow(/invalid\.kwe:\d+:\d+:/);
  });

  it("rejects unknown standard modules and exports without filesystem resolution", async () => {
    const directory = temporaryDirectory();
    await expect(loadModuleGraph(write(directory, "module.kwe", 'webata { x } site na "kwechiri:amaghi"'))).rejects.toThrow(/Unknown Kwechiri standard module/);
    await expect(loadModuleGraph(write(directory, "export.kwe", 'webata { wepụEriri } site na "kwechiri:eriri"'))).rejects.toThrow(/Unknown Kwechiri standard export/);
  });

  it("applies ordinary duplicate and local collision rules", async () => {
    const directory = temporaryDirectory();
    await expect(loadModuleGraph(write(directory, "duplicate.kwe", 'webata { nwereEriri } site na "kwechiri:eriri"\nwebata { nwereEriri } site na "kwechiri:eriri"'))).rejects.toThrow(/Duplicate import/);
    await expect(loadModuleGraph(write(directory, "variable.kwe", 'webata { nwereEriri } site na "kwechiri:eriri"\nnwereEriri = 1'))).rejects.toThrow(/collision/);
    await expect(loadModuleGraph(write(directory, "function.kwe", 'webata { nwereEriri } site na "kwechiri:eriri"\nọrụ nwereEriri(a, b) { laghachi eziokwu }'))).rejects.toThrow(/collision/);
  });

  it("coexists with relative filesystem modules without weakening their rules", async () => {
    const directory = temporaryDirectory();
    write(directory, "value.kwe", 'bupụ text = "Kwechiri"');
    expect(await outputOf('webata { nwereEriri } site na "kwechiri:eriri"\nwebata { text } site na "./value.kwe"\nbipụta(nwereEriri(text, "Kwe"))', directory)).toEqual([true]);
    await expect(loadModuleGraph(write(directory, "bare.kwe", 'webata { x } site na "package"'))).rejects.toThrow(/relative/);
  });
});
