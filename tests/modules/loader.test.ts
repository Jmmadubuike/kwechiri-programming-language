import { existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { compileFile } from "../../src/compiler/compile-file.js";
import { DiagnosticCodes } from "../../src/errors/diagnostic-catalog.js";
import { loadModuleGraph } from "../../src/modules/loader.js";
import { executeJavaScript } from "../../src/runtime/execute.js";

const temporaryDirectories: string[] = [];
const temporaryDirectory = (): string => {
  const directory = mkdtempSync(join(tmpdir(), "kwechiri-modules-"));
  temporaryDirectories.push(directory);
  return directory;
};
const write = (root: string, name: string, source: string): string => {
  const file = join(root, name);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, source, "utf8");
  return file;
};
const outputOf = async (entry: string): Promise<unknown[][]> => {
  const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
  try {
    executeJavaScript(await compileFile(entry));
    return log.mock.calls;
  } finally {
    log.mockRestore();
  }
};

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe("module graph hardening", () => {
  it("accepts explicit relative .kwe paths, including contained parent traversal", async () => {
    const root = temporaryDirectory();
    write(root, "shared.kwe", "bupụ uru = 7");
    write(root, "sub/dependency.kwe", 'webata { uru } site na "../shared.kwe"\nbupụ ihe = uru + 2');
    const entry = write(root, "main.kwe", 'webata { uru } site na "./shared.kwe"\nwebata { ihe } site na "./sub/dependency.kwe"\nbipụta(uru + ihe)');
    expect(await outputOf(entry)).toEqual([[16]]);
  });

  it.each([
    ["missing module", 'webata { x } site na "./missing.kwe"', /Missing imported module/],
    ["uppercase extension", 'webata { x } site na "./value.KWE"', /\.kwe/],
    ["extensionless import", 'webata { x } site na "./value"', /\.kwe/],
    ["absolute import", 'webata { x } site na "C:/value.kwe"', /relative/],
    ["directory import", 'webata { x } site na "./folder.kwe"', /identify a file/],
    ["bare specifier", 'webata { x } site na "package"', /relative/],
    ["out-of-root traversal", 'webata { x } site na "../outside.kwe"', /escapes the project/],
  ])("rejects %s with a controlled diagnostic", async (_name, source, message) => {
    const parent = temporaryDirectory();
    const root = join(parent, "project");
    mkdirSync(join(root, "folder.kwe"), { recursive: true });
    write(parent, "outside.kwe", "bupụ x = 1");
    write(root, "value.KWE", "bupụ x = 1");
    await expect(loadModuleGraph(write(root, "main.kwe", source))).rejects.toThrow(message);
  });

  it("uses one canonical module instance for normalized path variants", async () => {
    const root = temporaryDirectory();
    write(root, "value.kwe", 'bipụta("dependency")\nbupụ first = 1\nbupụ second = 2');
    const entry = write(root, "main.kwe", [
      'webata { first } site na "./value.kwe"',
      'webata { second } site na "./sub/../value.kwe"',
      'bipụta(first + second)',
    ].join("\n"));
    expect(await outputOf(entry)).toEqual([["dependency"], [3]]);
  });

  it("initializes dependencies before importers in deterministic order", async () => {
    const root = temporaryDirectory();
    write(root, "leaf.kwe", 'bipụta("leaf")\nbupụ leaf = 1');
    write(root, "middle.kwe", 'webata { leaf } site na "./leaf.kwe"\nbipụta("middle")\nbupụ middle = leaf + 1');
    const entry = write(root, "main.kwe", 'webata { middle } site na "./middle.kwe"\nbipụta("main")\nbipụta(middle)');
    expect(await outputOf(entry)).toEqual([["leaf"], ["middle"], ["main"], [2]]);
  });

  it.each([
    ["direct", [["a.kwe", 'webata { a } site na "./a.kwe"\nbupụ a = 1']]],
    ["indirect", [["a.kwe", 'webata { b } site na "./b.kwe"\nbupụ a = b'], ["b.kwe", 'webata { a } site na "./a.kwe"\nbupụ b = a']]],
    ["long", [["a.kwe", 'webata { b } site na "./b.kwe"\nbupụ a = b'], ["b.kwe", 'webata { c } site na "./c.kwe"\nbupụ b = c'], ["c.kwe", 'webata { a } site na "./a.kwe"\nbupụ c = a']]],
  ] as const)("rejects a %s cycle and reports its chain", async (_name, files) => {
    const root = temporaryDirectory();
    for (const [name, source] of files) write(root, name, source);
    await expect(loadModuleGraph(join(root, "a.kwe"))).rejects.toThrow(/a\.kwe.*->.*a\.kwe.*Circular dependency/s);
  });

  it("keeps imported bindings read-only while permitting shared collection mutation", async () => {
    const root = temporaryDirectory();
    write(root, "state.kwe", "bupụ items = [1, 2]");
    write(root, "mutate.kwe", 'webata { items } site na "./state.kwe"\nitems[0] = 9\nbupụ alias = items');
    write(root, "observe.kwe", 'webata { items } site na "./state.kwe"\nbipụta(items)\nbupụ observed = items');
    const entry = write(root, "main.kwe", 'webata { alias } site na "./mutate.kwe"\nwebata { observed } site na "./observe.kwe"\nbipụta(alias)\nbipụta(observed)');
    expect(await outputOf(entry)).toEqual([["[9,2]"], ["[9,2]"], ["[9,2]"]]);

    for (const declaration of ["bupụ value = 1", "bupụ ọrụ value() { laghachi 1 }", "bupụ value = [1]"]) {
      write(root, "value.kwe", declaration);
      const assignment = declaration.includes("[1]") ? "value = [2]" : "value = 2";
      await expect(loadModuleGraph(write(root, "rebind.kwe", `webata { value } site na "./value.kwe"\n${assignment}`))).rejects.toThrow(/read-only|collision/);
    }
  });

  it("rejects import collisions for variables, functions, duplicate imports, and NFC-equivalent names", async () => {
    const root = temporaryDirectory();
    write(root, "value.kwe", "bupụ ụbọchị = 1\nbupụ other = 2");
    const decomposed = "ụbọchị".normalize("NFD");
    const cases = [
      'webata { ụbọchị } site na "./value.kwe"\nụbọchị = 2',
      'webata { ụbọchị } site na "./value.kwe"\nọrụ ụbọchị() { laghachi 2 }',
      'webata { ụbọchị } site na "./value.kwe"\nwebata { ụbọchị } site na "./value.kwe"',
      `webata { ụbọchị } site na "./value.kwe"\nọrụ ${decomposed}() { laghachi 2 }`,
      'webata { ụbọchị } site na "./value.kwe"\nbupụ ọrụ ụbọchị() { laghachi 2 }',
    ];
    for (const [index, source] of cases.entries()) {
      await expect(loadModuleGraph(write(root, `collision-${index}.kwe`, source))).rejects.toThrow(/Duplicate import|read-only|collision/);
    }
  });

  it("preserves explicit export visibility and imported function contracts", async () => {
    const root = temporaryDirectory();
    write(root, "api.kwe", "private = 1\nọrụ hidden() { laghachi 2 }\nbupụ ọrụ identity(x) { laghachi x }");
    expect(await outputOf(write(root, "main.kwe", 'webata { identity } site na "./api.kwe"\nbipụta(identity([1, 2]))'))).toEqual([["[1,2]"]]);
    for (const name of ["private", "hidden"]) {
      await expect(loadModuleGraph(write(root, `${name}.kwe`, `webata { ${name} } site na "./api.kwe"`))).rejects.toThrow(/Missing export/);
    }
    await expect(compileFile(write(root, "arity.kwe", 'webata { identity } site na "./api.kwe"\nvalue = identity()'))).rejects.toThrow(/Wrong argument count/);
  });

  it("supports Unicode paths without normalizing raw module path strings", async () => {
    const root = temporaryDirectory();
    const directory = "ọrụ".normalize("NFD");
    const file = "ụbọchị".normalize("NFD");
    write(root, `${directory}/${file}.kwe`, 'bupụ uru = "Mọnde"');
    expect(await outputOf(write(root, "main.kwe", `webata { uru } site na "./${directory}/${file}.kwe"\nbipụta(uru)`))).toEqual([["Mọnde"]]);
    const normalizedRelative = `${directory.normalize("NFC")}/${file.normalize("NFC")}.kwe`;
    const normalizedRequest = `./${normalizedRelative}`;
    if (normalizedRequest !== `./${directory}/${file}.kwe`) {
      const normalizedEntry = write(root, "normalized.kwe", `webata { uru } site na "${normalizedRequest}"\nbipụta(uru)`);
      if (existsSync(join(root, normalizedRelative))) {
        expect(await outputOf(normalizedEntry)).toEqual([["Mọnde"]]);
      } else {
        await expect(loadModuleGraph(normalizedEntry)).rejects.toThrow(/Missing imported module/);
      }
    }
  });

  it("preserves astral identifiers across module exports and imports", async () => {
    const root = temporaryDirectory();
    const name = "\u{10400}";
    write(root, "value.kwe", `bupụ ${name} = 7`);
    const entry = write(root, "main.kwe", `webata { ${name} } site na "./value.kwe"\nbipụta(${name})`);
    expect(await outputOf(entry)).toEqual([[7]]);
  });

  it("uses canonical identity and containment for symlink aliases when supported", async () => {
    const parent = temporaryDirectory();
    const root = join(parent, "project");
    const outside = join(parent, "outside");
    mkdirSync(root);
    mkdirSync(outside);
    write(root, "inside/value.kwe", 'bipụta("once")\nbupụ first = 1\nbupụ second = 2');
    write(outside, "secret.kwe", "bupụ secret = 3");
    try {
      symlinkSync(join(root, "inside"), join(root, "alias"), "junction");
      symlinkSync(outside, join(root, "escape"), "junction");
    } catch (error: unknown) {
      if (error instanceof Error && "code" in error && ["EPERM", "EACCES", "ENOSYS"].includes(String(error.code))) return;
      throw error;
    }
    const entry = write(root, "main.kwe", [
      'webata { first } site na "./inside/value.kwe"',
      'webata { second } site na "./alias/value.kwe"',
      'bipụta(first + second)',
    ].join("\n"));
    expect(await outputOf(entry)).toEqual([["once"], [3]]);
    await expect(loadModuleGraph(write(root, "escape.kwe", 'webata { secret } site na "./escape/secret.kwe"'))).rejects.toThrow(/Canonical module path escapes/);
  });

  it("rejects malformed UTF-8 entry and imported source files", async () => {
    const root = temporaryDirectory();
    const invalidEntry = join(root, "invalid-entry.kwe");
    writeFileSync(invalidEntry, Buffer.from([0x62, 0x69, 0x70, 0xff]));
    await expect(loadModuleGraph(invalidEntry)).rejects.toMatchObject({
      code: DiagnosticCodes.ModuleInvalidUtf8,
      fileName: expect.stringMatching(/invalid-entry\.kwe$/u),
    });

    const invalidImport = join(root, "invalid-import.kwe");
    writeFileSync(invalidImport, Buffer.from([0xc3, 0x28]));
    const entry = write(root, "main.kwe", 'webata { value } site na "./invalid-import.kwe"');
    await expect(loadModuleGraph(entry)).rejects.toMatchObject({
      code: DiagnosticCodes.ModuleInvalidUtf8,
      fileName: expect.stringMatching(/invalid-import\.kwe$/u),
    });
  });

  it("preserves multiline string content that resembles imports or exports", async () => {
    const root = temporaryDirectory();
    const entry = write(root, "main.kwe", [
      'ede = """',
      'webata { uru } site na "./fake.kwe"',
      'bupụ uru = 7',
      '"""',
      'bipụta(ede)',
    ].join("\n"));
    expect(await outputOf(entry)).toEqual([['\nwebata { uru } site na "./fake.kwe"\nbupụ uru = 7\n']]);
  });
});
