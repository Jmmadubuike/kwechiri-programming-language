import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const websiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(websiteRoot, "..");
const pairs = [
  ["hello.kwe", "hello.kwe"],
  ["functions.kwe", "functions.kwe"],
  ["conditions.kwe", "conditions.kwe"],
  ["collections.kwe", "collections.kwe"],
  ["modules/main.kwe", "modules-main.kwe"],
  ["tutorials/variables.kwe", "tutorial-variables.kwe"],
  ["tutorials/expressions-and-decisions.kwe", "tutorial-expressions-and-decisions.kwe"],
  ["tutorials/loops.kwe", "tutorial-loops.kwe"],
  ["tutorials/functions.kwe", "tutorial-functions.kwe"],
  ["tutorials/collections.kwe", "tutorial-collections.kwe"],
];

for (const [sourceName, websiteName] of pairs) {
  const source = readFileSync(resolve(repositoryRoot, "examples", sourceName), "utf8").replaceAll("\r\n", "\n");
  const snapshot = readFileSync(
    resolve(websiteRoot, "src", "generated", "examples", websiteName),
    "utf8",
  ).replaceAll("\r\n", "\n");
  if (source !== snapshot) {
    throw new Error(
      `Website example ${websiteName} differs from examples/${sourceName}. Copy the verified source into the website snapshot.`,
    );
  }
}

console.log(`Verified ${pairs.length} website example snapshots against repository examples.`);
