import { readFile } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { KwechiriError } from "../errors/kwechiri-error.js";
import { tokenize } from "../lexer/lexer.js";
import { TokenType } from "../lexer/token.js";

interface ModuleResult {
  readonly source: string;
  readonly exports: ReadonlyMap<string, string>;
}

const importPattern = /^\s*([\p{L}\p{M}_]+)\s*\{([^}]*)\}\s*([\p{L}\p{M}_]+)\s+([\p{L}\p{M}_]+)\s+"([^"]+)"\s*$/u;
const exportPattern = /^(\s*)([\p{L}\p{M}_]+)\s+(?:([\p{L}\p{M}_]+)\s+)?([\p{L}_][\p{L}\p{M}\p{N}_]*)/u;
const identity = (value: string): string => value.normalize("NFC");
const withoutLineComment = (line: string): string => {
  let inString = false;
  let escaped = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (inString && character === "\\") {
      escaped = true;
      continue;
    }
    if (character === '"') {
      inString = !inString;
      continue;
    }
    if (!inString && character === "/" && line[index + 1] === "/") return line.slice(0, index);
  }
  return line;
};

export async function loadModuleGraph(entryPath: string): Promise<string> {
  const entry = resolve(entryPath);
  const root = dirname(entry);
  const cache = new Map<string, ModuleResult>();
  const visiting: string[] = [];
  const orderedSources: string[] = [];
  let moduleId = 0;

  const load = async (filePath: string): Promise<ModuleResult> => {
    const absolute = resolve(filePath);
    const cached = cache.get(absolute);
    if (cached !== undefined) return cached;
    const cycleAt = visiting.indexOf(absolute);
    if (cycleAt >= 0) {
      const cycle = [...visiting.slice(cycleAt), absolute].map((item) => relative(root, item) || ".").join(" -> ");
      throw new KwechiriError(`Achọpụtara okirikiri module: ${cycle}. (Circular dependency.)`, { line: 1, column: 1, offset: 0 }, absolute);
    }
    if (absolute !== root && !absolute.startsWith(`${root}${sep}`)) {
      throw new KwechiriError("Ụzọ module apụghị ịpụ n'ọrụ a. (Module path escapes the project.)", { line: 1, column: 1, offset: 0 }, absolute);
    }
    if (extname(absolute) !== ".kwe") {
      throw new KwechiriError('Ụzọ module ga-eji ".kwe" kwụsị.', { line: 1, column: 1, offset: 0 }, absolute);
    }

    visiting.push(absolute);
    let raw: string;
    try {
      raw = await readFile(absolute, "utf8");
    } catch (error: unknown) {
      if (absolute !== entry && error instanceof Error && "code" in error && error.code === "ENOENT") {
        throw new KwechiriError(`Enweghị ike ịchọta module "${relative(root, absolute)}". (Missing imported module.)`, { line: 1, column: 1, offset: 0 }, absolute);
      }
      throw error;
    }
    const lines = raw.split(/\r?\n/u);
    const imports = new Map<string, string>();
    const bodyLines: string[] = [];
    let sawBody = false;

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index] as string;
      const structuralLine = withoutLineComment(line);
      const importMatch = importPattern.exec(structuralLine);
      const isImport = importMatch !== null
        && identity(importMatch[1] as string) === "webata"
        && identity(importMatch[3] as string) === "site"
        && identity(importMatch[4] as string) === "na";
      if (isImport && importMatch !== null) {
        if (sawBody) throw new KwechiriError("`webata` ga-adị tupu okwu ndị ọzọ. (Imports must come first.)", { line: index + 1, column: 1, offset: 0 }, absolute);
        const request = importMatch[5] as string;
        if (!request.startsWith("./") && !request.startsWith("../")) throw new KwechiriError("Naanị ụzọ module relative ka akwadoro.", { line: index + 1, column: 1, offset: 0 }, absolute);
        const dependency = await load(resolve(dirname(absolute), request));
        for (const rawName of (importMatch[2] as string).split(",")) {
          const sourceName = rawName.trim();
          const name = identity(sourceName);
          if (!name) continue;
          if (imports.has(name)) throw new KwechiriError(`E webatala "${name}" ugboro abụọ. (Duplicate import.)`, { line: index + 1, column: 1, offset: 0 }, absolute);
          const internal = dependency.exports.get(name);
          if (internal === undefined) throw new KwechiriError(`Module ahụ anaghị ebupụ "${name}". (Missing export.)`, { line: index + 1, column: 1, offset: 0 }, absolute);
          imports.set(name, internal);
        }
        bodyLines.push("");
        continue;
      }
      if (structuralLine.trim() !== "") sawBody = true;
      bodyLines.push(line);
    }

    const exported = new Set<string>();
    const cleanedLines = bodyLines.map((line, index) => {
      const match = exportPattern.exec(line);
      if (match === null || identity(match[2] as string) !== "bupụ") return line;
      if (match[3] !== undefined && identity(match[3]) !== "ọrụ") return line;
      const name = identity(match[4] as string);
      if (exported.has(name)) throw new KwechiriError(`E bupụla "${name}" ugboro abụọ. (Duplicate export.)`, { line: index + 1, column: 1, offset: 0 }, absolute);
      exported.add(name);
      const prefixLength = (match[1] as string).length + (match[2] as string).length;
      return `${match[1] as string}${line.slice(prefixLength).replace(/^\s+/u, "")}`;
    });
    const cleaned = cleanedLines.join("\n");
    const tokens = tokenize(cleaned, absolute);
    const locals = new Set<string>();
    for (let index = 0; index < tokens.length - 1; index += 1) {
      const token = tokens[index];
      const next = tokens[index + 1];
      if (token?.type === TokenType.Identifier
        && ((next?.type === TokenType.Equals && tokens[index - 1]?.type !== TokenType.Dot)
          || (tokens[index - 1]?.canonicalLexeme === "ọrụ"))) {
        locals.add(token.canonicalLexeme ?? token.lexeme);
      }
    }
    for (const name of exported) if (!locals.has(name)) throw new KwechiriError(`Enweghị ike ibupụ "${name}" n'ihi na akọwaghị ya.`, { line: 1, column: 1, offset: 0 }, absolute);
    for (let index = 0; index < tokens.length - 1; index += 1) {
      const token = tokens[index];
      if (token?.type === TokenType.Identifier
        && tokens[index + 1]?.type === TokenType.Equals
        && imports.has(token.canonicalLexeme ?? token.lexeme)) {
        throw new KwechiriError(`Enweghị ike ịgbanwe ihe e webatara "${token.lexeme}". (Imported bindings are read-only.)`, token.location, absolute);
      }
    }

    const prefix = `_mod${moduleId++}_`;
    const renames = new Map(imports);
    for (const name of locals) renames.set(name, `${prefix}${name}`);
    let namespaced = cleaned;
    const replacements = tokens
      .filter((token, index) => token.type === TokenType.Identifier && renames.has(token.canonicalLexeme ?? token.lexeme) && tokens[index - 1]?.type !== TokenType.Dot && tokens[index + 1]?.type !== TokenType.Colon)
      .sort((a, b) => b.location.offset - a.location.offset);
    for (const token of replacements) {
      const canonical = token.canonicalLexeme ?? token.lexeme;
      namespaced = `${namespaced.slice(0, token.location.offset)}${renames.get(canonical)}${namespaced.slice(token.location.offset + token.lexeme.length)}`;
    }

    const exports = new Map([...exported].map((name) => [name, renames.get(name) as string]));
    const result = { source: namespaced, exports };
    cache.set(absolute, result);
    orderedSources.push(namespaced);
    visiting.pop();
    return result;
  };

  await load(entry);
  return orderedSources.filter(Boolean).join("\n");
}
