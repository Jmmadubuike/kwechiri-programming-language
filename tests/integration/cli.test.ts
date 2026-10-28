import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

interface CliResult { readonly status: number | null; readonly stdout: string; readonly stderr: string }

const temporaryDirectories: string[] = [];
const cliPath = resolve("dist/cli/index.js");
const runCli = (arguments_: readonly string[], cwd = process.cwd()): CliResult => {
  const result = spawnSync(process.execPath, [cliPath, ...arguments_], { cwd, encoding: "utf8" });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
};
const temporaryDirectory = (name = "kwechiri-cli-"): string => {
  const directory = mkdtempSync(join(tmpdir(), name));
  temporaryDirectories.push(directory);
  return directory;
};

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe("Kwechiri CLI integration", () => {
  it("applies one inferred signature to imported functions", () => {
    const directory = temporaryDirectory();
    writeFileSync(join(directory, "identity.kwe"), "bupụ ọrụ identity(x) { laghachi x }", "utf8");
    writeFileSync(
      join(directory, "main.kwe"),
      'webata { identity } site na "./identity.kwe"\nbipụta(identity(1))\nbipụta(identity(2))',
      "utf8",
    );
    expect(runCli([join(directory, "main.kwe")])).toEqual({ status: 0, stdout: "1\n2\n", stderr: "" });

    writeFileSync(
      join(directory, "invalid.kwe"),
      'webata { identity } site na "./identity.kwe"\na = identity(1)\nb = identity("otu")',
      "utf8",
    );
    const incompatible = runCli(["check", join(directory, "invalid.kwe")]);
    expect(incompatible.status).toBe(1);
    expect(incompatible.stderr).toContain("Function calls must use one parameter signature");
  });

  it("preserves mutable collection identity across module imports while keeping bindings read-only", () => {
    const directory = temporaryDirectory();
    writeFileSync(
      join(directory, "values.kwe"),
      'bupụ items = [1, 2]\nbupụ itemsAlias = items\nbupụ person = { aha: "Uche" }\nbupụ personAlias = person',
      "utf8",
    );
    writeFileSync(
      join(directory, "main.kwe"),
      'webata { items, itemsAlias, person, personAlias } site na "./values.kwe"\nitems[0] = 10\nperson.aha = "Ada"\nbipụta(itemsAlias)\nbipụta(personAlias)',
      "utf8",
    );
    expect(runCli([join(directory, "main.kwe")])).toEqual({
      status: 0,
      stdout: '[10,2]\n{"aha":"Ada"}\n',
      stderr: "",
    });
    writeFileSync(
      join(directory, "rebind.kwe"),
      'webata { items } site na "./values.kwe"\nitems = [3, 4]',
      "utf8",
    );
    const rebound = runCli(["check", join(directory, "rebind.kwe")]);
    expect(rebound.status).toBe(1);
    expect(rebound.stderr).toContain("Imported bindings are read-only");
  });

  it("imports and exports values containing efu without changing module behavior", () => {
    const directory = temporaryDirectory();
    writeFileSync(join(directory, "value.kwe"), "bupụ ihe = { uru: efu }", "utf8");
    writeFileSync(join(directory, "main.kwe"), 'webata { ihe } site na "./value.kwe"\nbipụta(ihe.uru == efu)', "utf8");
    expect(runCli([join(directory, "main.kwe")])).toEqual({ status: 0, stdout: "eziokwu\n", stderr: "" });
  });

  it("matches module keywords and bindings by NFC while leaving the requested path raw", () => {
    const directory = temporaryDirectory();
    const rawExportKeyword = "bupụ".normalize("NFD");
    const rawImportKeyword = "webata".normalize("NFD");
    const rawSiteKeyword = "site".normalize("NFD");
    const rawNaKeyword = "na".normalize("NFD");
    const rawName = "ụbọchị".normalize("NFD");
    const rawFileName = `${"ọrụ".normalize("NFD")}.kwe`;
    writeFileSync(join(directory, rawFileName), `${rawExportKeyword} ${rawName} = "Mọnde"`, "utf8");
    writeFileSync(
      join(directory, "main.kwe"),
      `// comment before imports\n${rawImportKeyword} { ụbọchị } ${rawSiteKeyword} ${rawNaKeyword} "./${rawFileName}"// trailing comment\nbipụta(ụbọchị)`,
      "utf8",
    );
    expect(runCli([join(directory, "main.kwe")])).toEqual({ status: 0, stdout: "Mọnde\n", stderr: "" });
  });

  it("keeps module import and export names case-sensitive", () => {
    const directory = temporaryDirectory();
    writeFileSync(join(directory, "value.kwe"), "bupụ Aha = 1", "utf8");
    writeFileSync(join(directory, "main.kwe"), 'webata { aha } site na "./value.kwe"\nbipụta(aha)', "utf8");
    const result = runCli(["check", join(directory, "main.kwe")]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Missing export');
  });

  it("preserves shorthand and makes run equivalent without generated output", () => {
    const directory = temporaryDirectory();
    const source = join(directory, "hello.kwe");
    writeFileSync(source, 'bipụta("Ndewo Ụwa!")', "utf8");
    const shorthand = runCli([source]);
    const named = runCli(["run", source]);
    expect(shorthand).toEqual({ status: 0, stdout: "Ndewo Ụwa!\n", stderr: "" });
    expect(named).toEqual(shorthand);
    expect(existsSync(join(directory, "hello.js"))).toBe(false);
  });

  it("runs the variables tutorial with its documented output", () => {
    expect(runCli([resolve("examples/tutorials/variables.kwe")])).toEqual({
      status: 0,
      stdout: "Uche\n36\neziokwu\nefu\nAda\n",
      stderr: "",
    });
  });

  it("runs the expressions and decisions tutorial with its documented output", () => {
    expect(runCli([resolve("examples/tutorials/expressions-and-decisions.kwe")])).toEqual({
      status: 0,
      stdout: "16\neziokwu\nụgha\neziokwu\neziokwu\neziokwu\nOkenye\n",
      stderr: "",
    });
  });

  it("runs the loops tutorial with its documented output", () => {
    expect(runCli([resolve("examples/tutorials/loops.kwe")])).toEqual({
      status: 0,
      stdout: "Mgbe\n1\n2\n3\nKwụsị\n1\nGaa n'ihu\n1\n3\n4\n",
      stderr: "",
    });
  });

  it("runs the functions tutorial with its documented output", () => {
    expect(runCli([resolve("examples/tutorials/functions.kwe")])).toEqual({
      status: 0,
      stdout: "30\nOkenye\nNwatakịrị\nAda\nefu\n",
      stderr: "",
    });
  });

  it("runs the collections tutorial with its documented output", () => {
    expect(runCli([resolve("examples/tutorials/collections.kwe")])).toEqual({
      status: 0,
      stdout: '["Uche","Ada","Obi"]\n{"aha":"Uche","afọ":36}\nUche\n["Uche","Chidi","Obi"]\n{"aha":"Uche","afọ":37}\n',
      stderr: "",
    });
  });

  it("runs the modules tutorial with its documented output", () => {
    expect(runCli([resolve("examples/tutorials/modules/main.kwe")])).toEqual({
      status: 0,
      stdout: 'Ada\n["Uche","Obi"]\n',
      stderr: "",
    });
  });

  it("runs the standard library strings tutorial with its documented output", () => {
    expect(runCli([resolve("examples/tutorials/standard-library.kwe")])).toEqual({
      status: 0,
      stdout: "eziokwu\nụgha\neziokwu\neziokwu\n6\nNdewo, Kwechiri\neziokwu\n",
      stderr: "",
    });
  });

  it("checks valid source and a valid module graph silently without executing", () => {
    expect(runCli(["check", resolve("tests/fixtures/division-by-zero.kwe")])).toEqual({ status: 0, stdout: "", stderr: "" });
    expect(runCli(["check", resolve("examples/modules/main.kwe")])).toEqual({ status: 0, stdout: "", stderr: "" });
  });

  it("reports syntax, semantic, module, and runtime diagnostics as exit 1", () => {
    const directory = temporaryDirectory();
    const cases = [
      ["syntax.kwe", 'bipụta("missing"'],
      ["semantic.kwe", "bipụta(amaghi)"],
      ["module.kwe", 'webata { efu } site na "./missing.kwe"'],
      ["runtime.kwe", "bipụta(10 / 0)"],
    ] as const;
    for (const [name, source] of cases) writeFileSync(join(directory, name), source, "utf8");
    for (const name of ["syntax.kwe", "semantic.kwe", "module.kwe"]) {
      const result = runCli(["check", join(directory, name)]);
      expect(result.status).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("KWECHIRI ERROR");
    }
    const runtime = runCli(["run", join(directory, "runtime.kwe")]);
    expect(runtime.status).toBe(1);
    expect(runtime.stdout).toBe("");
    expect(runtime.stderr).toContain("Division by zero");
    expect(runtime.stderr).not.toContain(" at ");
  });

  it("compiles to a default sibling that runs directly with Node", () => {
    const directory = temporaryDirectory();
    const source = join(directory, "hello.kwe");
    const output = join(directory, "hello.js");
    writeFileSync(source, 'bipụta("Ndewo")', "utf8");
    expect(runCli(["compile", source])).toEqual({ status: 0, stdout: "", stderr: "" });
    expect(existsSync(output)).toBe(true);
    const executed = spawnSync(process.execPath, [output], { encoding: "utf8" });
    expect({ status: executed.status, stdout: executed.stdout, stderr: executed.stderr }).toEqual({ status: 0, stdout: "Ndewo\n", stderr: "" });
  });

  it("compiles a module graph to an explicit directly runnable output", () => {
    const directory = temporaryDirectory();
    const output = join(directory, "module.js");
    expect(runCli(["compile", resolve("examples/modules/main.kwe"), "--out", output])).toEqual({ status: 0, stdout: "", stderr: "" });
    const executed = spawnSync(process.execPath, [output], { encoding: "utf8" });
    expect(executed.status).toBe(0);
    expect(executed.stdout.trim()).toBe("5.14159");
  });

  it("runs, checks, and compiles the official string standard module", () => {
    const directory = temporaryDirectory();
    const source = join(directory, "standard.kwe");
    const output = join(directory, "standard.js");
    writeFileSync(source, [
      'webata { nwereEriri, maliteNa, kwụsịNa, ogologoEriri, jikọọEriri } site na "kwechiri:eriri"',
      'bipụta(nwereEriri("Kwechiri", "chiri"))',
      'bipụta(maliteNa("Kwechiri", "Kwe"))',
      'bipụta(kwụsịNa("Kwechiri", "chiri"))',
      'bipụta(ogologoEriri("Ụbọchị"))',
      'bipụta(jikọọEriri("Kwe", "chiri"))',
    ].join("\n"), "utf8");
    expect(runCli(["run", source])).toEqual({ status: 0, stdout: "eziokwu\neziokwu\neziokwu\n6\nKwechiri\n", stderr: "" });
    expect(runCli(["check", source])).toEqual({ status: 0, stdout: "", stderr: "" });
    expect(runCli(["compile", source, "--out", output])).toEqual({ status: 0, stdout: "", stderr: "" });
    const executed = spawnSync(process.execPath, [output], { encoding: "utf8" });
    expect({ status: executed.status, stdout: executed.stdout, stderr: executed.stderr }).toEqual({
      status: 0,
      stdout: "eziokwu\neziokwu\neziokwu\n6\nKwechiri\n",
      stderr: "",
    });
  });

  it("keeps expected runtime failures concise in directly runnable output", () => {
    const directory = temporaryDirectory();
    const source = join(directory, "runtime.kwe");
    const output = join(directory, "runtime.js");
    writeFileSync(source, "bipụta(10 / 0)", "utf8");
    expect(runCli(["compile", source]).status).toBe(0);
    const executed = spawnSync(process.execPath, [output], { encoding: "utf8" });
    expect(executed.status).toBe(1);
    expect(executed.stdout).toBe("");
    expect(executed.stderr).toContain("KWECHIRI ERROR");
    expect(executed.stderr).not.toContain(" at ");
  });

  it("refuses overwrite, supports force, and preserves output after failed compilation", () => {
    const directory = temporaryDirectory();
    const source = join(directory, "program.kwe");
    const output = join(directory, "program.js");
    writeFileSync(source, 'bipụta("first")', "utf8");
    writeFileSync(output, "preserve", "utf8");
    expect(runCli(["compile", source]).status).toBe(3);
    expect(readFileSync(output, "utf8")).toBe("preserve");
    expect(runCli(["compile", source, "--force"]).status).toBe(0);
    expect(readFileSync(output, "utf8")).toContain("executeJavaScript");
    const generated = readFileSync(output, "utf8");
    writeFileSync(source, "bipụta(unknown)", "utf8");
    expect(runCli(["compile", source, "--force"]).status).toBe(1);
    expect(readFileSync(output, "utf8")).toBe(generated);
  });

  it("classifies entry and destination filesystem failures as exit 3", () => {
    const directory = temporaryDirectory();
    const source = join(directory, "hello.kwe");
    writeFileSync(source, 'bipụta("hello")', "utf8");
    expect(runCli(["check", join(directory, "missing.kwe")]).status).toBe(3);
    expect(runCli(["compile", source, "--out", join(directory, "missing", "hello.js")]).status).toBe(3);
    const destinationDirectory = join(directory, "destination.js");
    mkdirSync(destinationDirectory);
    expect(runCli(["compile", source, "--out", destinationDirectory]).status).toBe(3);
  });

  it("implements help, version, usage errors, and stream separation", () => {
    for (const arguments_ of [["--help"], ["run", "--help"], ["check", "--help"], ["compile", "--help"]]) {
      const result = runCli(arguments_);
      expect(result.status).toBe(0);
      expect(result.stdout).toContain("Usage:");
      expect(result.stderr).toBe("");
    }
    expect(runCli(["--version"])).toEqual({ status: 0, stdout: "0.1.0-development\n", stderr: "" });
    for (const arguments_ of [[], ["run"], ["invalid", "hello.kwe"], ["run", "hello.KWE"], ["compile", "hello.kwe", "--out", "hello.JS"]]) {
      const result = runCli(arguments_);
      expect(result.status).toBe(2);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("KWECHIRI USAGE ERROR");
    }
  });

  it("preserves Unicode in source, directories, filenames, and output paths", () => {
    const root = temporaryDirectory("kwechiri-ụzọ-");
    const directory = join(root, "ọrụ");
    mkdirSync(directory);
    const source = join(directory, "ụbọchị.kwe");
    const output = join(directory, "nsonaazụ.js");
    writeFileSync(source, 'ụbọchị = "Mọnde"\nbipụta(ụbọchị)', "utf8");
    expect(runCli(["compile", source, "--out", output]).status).toBe(0);
    const executed = spawnSync(process.execPath, [output], { encoding: "utf8" });
    expect(executed.status).toBe(0);
    expect(executed.stdout).toBe("Mọnde\n");
  });
});
