import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const extensionRoot = new URL("../", import.meta.url);
const readJson = async (relativePath) =>
  JSON.parse(await readFile(new URL(relativePath, extensionRoot), "utf8"));

const manifest = await readJson("package.json");
const languageConfiguration = await readJson("language-configuration.json");
const grammar = await readJson("syntaxes/kwechiri.tmLanguage.json");

const languages = manifest.contributes?.languages;
const grammarContributions = manifest.contributes?.grammars;
const commands = manifest.contributes?.commands;
const kwechiriLanguage = Array.isArray(languages)
  ? languages.find((language) => language.id === "kwechiri")
  : undefined;

if (manifest.private !== true) throw new Error("The extension package must remain private.");
if (manifest.license !== "MIT") throw new Error("The extension must declare the MIT license.");
if (manifest.icon !== "kwechiri-logo.png") throw new Error("The extension icon is not registered.");
if (manifest.main !== "./dist/extension.js") throw new Error("Unexpected extension entry point.");
if (!kwechiriLanguage?.extensions?.includes(".kwe")) throw new Error("The .kwe extension is not registered.");
if (kwechiriLanguage.configuration !== "./language-configuration.json") {
  throw new Error("The Kwechiri language configuration is not registered.");
}
if (!Array.isArray(grammarContributions) || grammarContributions[0]?.scopeName !== "source.kwechiri") {
  throw new Error("The Kwechiri grammar is not registered.");
}
if (!Array.isArray(commands) || commands[0]?.command !== "kwechiri.checkCurrentFile") {
  throw new Error("The check-current-file command is not registered.");
}
if (languageConfiguration.comments?.lineComment !== "//") {
  throw new Error("Kwechiri line comments are not configured.");
}
if (grammar.scopeName !== "source.kwechiri") throw new Error("Unexpected grammar scope.");

for (const requiredKeyword of ["bipụta", "ọrụ", "laghachi", "kwụsị", "webata", "bupụ"]) {
  if (!JSON.stringify(grammar).includes(requiredKeyword)) {
    throw new Error(`Grammar is missing the keyword ${requiredKeyword}.`);
  }
}

await access(fileURLToPath(new URL("dist/extension.js", extensionRoot)));
await access(fileURLToPath(new URL("kwechiri-logo.png", extensionRoot)));
await access(fileURLToPath(new URL("../../../LICENSE", import.meta.url)));

for (const contribution of ["completionProviders", "debuggers", "formatters", "languageserver", "snippets"]) {
  if (contribution in (manifest.contributes ?? {})) {
    throw new Error(`Unapproved VS Code contribution: ${contribution}.`);
  }
}

console.log("Verified Kwechiri VS Code manifest, grammar, language configuration, and bundle.");
