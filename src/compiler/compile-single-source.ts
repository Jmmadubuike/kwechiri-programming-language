import { DiagnosticCodes } from "../errors/diagnostic-catalog.js";
import { KwechiriError } from "../errors/kwechiri-error.js";
import { TokenType } from "../lexer/token.js";
import { tokenize } from "../lexer/lexer.js";
import { standardModule, type StandardExportDefinition } from "../standard-library/catalog.js";
import { compileWithStandardBindings } from "./compile.js";

interface PreparedSingleSource {
  readonly source: string;
  readonly standardBindings: ReadonlyMap<string, StandardExportDefinition>;
}

const importPattern = /^\s*([\p{L}\p{M}_]+)\s*\{([^}]*)\}\s*([\p{L}\p{M}_]+)\s+([\p{L}\p{M}_]+)\s+"([^"]+)"\s*$/u;
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

function prepareSingleSource(source: string, fileName: string): PreparedSingleSource {
  const lines = source.split(/\r?\n/u);
  const imports = new Map<string, string>();
  const standardBindings = new Map<string, StandardExportDefinition>();
  const bodyLines: string[] = [];
  let sawBody = false;
  let standardBindingId = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] as string;
    const importMatch = importPattern.exec(withoutLineComment(line));
    const isImport = importMatch !== null
      && identity(importMatch[1] as string) === "webata"
      && identity(importMatch[3] as string) === "site"
      && identity(importMatch[4] as string) === "na";

    if (isImport && importMatch !== null) {
      if (sawBody) {
        throw new KwechiriError(
          DiagnosticCodes.ModuleImportsMustComeFirst,
          "`webata` ga-adị tupu okwu ndị ọzọ. (Imports must come first.)",
          { line: index + 1, column: 1, offset: 0 },
          fileName,
        );
      }

      const request = importMatch[5] as string;
      const requestedStandardModule = request.startsWith("kwechiri:") ? standardModule(request) : undefined;
      if (request.startsWith("kwechiri:") && requestedStandardModule === undefined) {
        throw new KwechiriError(
          DiagnosticCodes.StandardUnknownModule,
          `Amaghị standard module "${request}". (Unknown Kwechiri standard module.)`,
          { line: index + 1, column: 1, offset: 0 },
          fileName,
        );
      }
      if (requestedStandardModule === undefined) {
        throw new KwechiriError(
          DiagnosticCodes.ModuleFilesystemUnavailable,
          "Naanị `kwechiri:` standard modules ka browser playground na-akwado. (Filesystem modules are unavailable in the browser playground.)",
          { line: index + 1, column: 1, offset: 0 },
          fileName,
        );
      }

      for (const rawName of (importMatch[2] as string).split(",")) {
        const sourceName = rawName.trim();
        const name = identity(sourceName);
        if (!name) continue;
        if (imports.has(name)) {
          throw new KwechiriError(
            DiagnosticCodes.ModuleDuplicateImport,
            `E webatala "${name}" ugboro abụọ. (Duplicate import.)`,
            { line: index + 1, column: 1, offset: 0 },
            fileName,
          );
        }
        const definition = requestedStandardModule.exports.get(name);
        if (definition === undefined) {
          throw new KwechiriError(
            DiagnosticCodes.StandardUnknownExport,
            `Standard module "${request}" anaghị ebupụ "${name}". (Unknown Kwechiri standard export.)`,
            { line: index + 1, column: 1, offset: 0 },
            fileName,
          );
        }
        const internal = `_kweStd${standardBindingId++}`;
        imports.set(name, internal);
        standardBindings.set(internal, definition);
      }
      bodyLines.push("");
      continue;
    }

    if (withoutLineComment(line).trim() !== "") sawBody = true;
    bodyLines.push(line);
  }

  const cleaned = bodyLines.join("\n");
  const tokens = tokenize(cleaned, fileName);
  const locals = new Set<string>();
  for (let index = 0; index < tokens.length - 1; index += 1) {
    const token = tokens[index];
    const next = tokens[index + 1];
    if (token?.type === TokenType.Identifier
      && ((next?.type === TokenType.Equals && tokens[index - 1]?.type !== TokenType.Dot)
        || tokens[index - 1]?.canonicalLexeme === "ọrụ")) {
      locals.add(token.canonicalLexeme ?? token.lexeme);
    }
  }

  for (const name of locals) {
    if (imports.has(name)) {
      throw new KwechiriError(
        DiagnosticCodes.ModuleImportCollision,
        `Aha "${name}" na-adị n'ihe e webatara nakwa na nkwupụta local. (Imported bindings are read-only; imported/local binding collision.)`,
        { line: 1, column: 1, offset: 0 },
        fileName,
      );
    }
  }

  for (let index = 0; index < tokens.length - 1; index += 1) {
    const token = tokens[index];
    if (token?.type === TokenType.Identifier
      && tokens[index + 1]?.type === TokenType.Equals
      && imports.has(token.canonicalLexeme ?? token.lexeme)) {
      throw new KwechiriError(
        DiagnosticCodes.ModuleReadOnlyImport,
        `Enweghị ike ịgbanwe ihe e webatara "${token.lexeme}". (Imported bindings are read-only.)`,
        token.location,
        fileName,
      );
    }
  }

  let namespaced = cleaned;
  const replacements = tokens
    .filter((token, index) => token.type === TokenType.Identifier
      && imports.has(token.canonicalLexeme ?? token.lexeme)
      && tokens[index - 1]?.type !== TokenType.Dot
      && tokens[index + 1]?.type !== TokenType.Colon)
    .sort((left, right) => right.location.offset - left.location.offset);
  for (const token of replacements) {
    const name = token.canonicalLexeme ?? token.lexeme;
    namespaced = `${namespaced.slice(0, token.location.offset)}${imports.get(name) as string}${namespaced.slice(token.location.offset + token.lexeme.length)}`;
  }

  return { source: namespaced, standardBindings };
}

export function compileSingleSource(source: string, fileName = "<playground>"): string {
  const prepared = prepareSingleSource(source, fileName);
  return compileWithStandardBindings(prepared.source, fileName, prepared.standardBindings);
}
