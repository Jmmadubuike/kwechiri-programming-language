/**
 * Line-level source structure used by the module loader and the browser
 * single-source boundary. Both need to ignore comments and avoid treating
 * text inside strings as `webata` imports or `bupụ` exports, and multiline
 * strings can span lines, so the scan is stateful across the line list.
 */

export interface StructuredSourceLine {
  readonly raw: string;
  readonly structural: string;
  readonly startsInsideMultilineString: boolean;
}

export function structureSourceLines(lines: readonly string[]): StructuredSourceLine[] {
  const structured: StructuredSourceLine[] = [];
  let inMultilineString = false;

  for (const raw of lines) {
    const startsInsideMultilineString = inMultilineString;
    let structural = "";
    let inString = false;
    let escaped = false;
    let lineComment = false;
    let index = 0;

    while (index < raw.length) {
      const character = raw[index] as string;

      if (inMultilineString) {
        structural += character;
        if (escaped) {
          escaped = false;
        } else if (character === "\\") {
          escaped = true;
        } else if (character === '"' && raw[index + 1] === '"' && raw[index + 2] === '"') {
          structural += '""';
          inMultilineString = false;
          index += 2;
        }
        index += 1;
        continue;
      }

      if (lineComment) {
        index += 1;
        continue;
      }

      if (inString) {
        structural += character;
        if (escaped) {
          escaped = false;
        } else if (character === "\\") {
          escaped = true;
        } else if (character === '"') {
          inString = false;
        }
        index += 1;
        continue;
      }

      if (character === '"' && raw[index + 1] === '"' && raw[index + 2] === '"') {
        structural += '"""';
        inMultilineString = true;
        index += 3;
        continue;
      }
      if (character === '"') {
        structural += character;
        inString = true;
        index += 1;
        continue;
      }
      if (character === "/" && raw[index + 1] === "/") {
        lineComment = true;
        index += 2;
        continue;
      }

      structural += character;
      index += 1;
    }

    structured.push({ raw, structural, startsInsideMultilineString });
  }

  return structured;
}
