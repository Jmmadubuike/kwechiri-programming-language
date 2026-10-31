import type { StandardIntrinsic } from "./catalog.js";

export interface KwechiriStandardLibrary {
  readonly stringContains: (value: string, search: string) => boolean;
  readonly stringStartsWith: (value: string, prefix: string) => boolean;
  readonly stringEndsWith: (value: string, suffix: string) => boolean;
  readonly stringGraphemeLength: (value: string) => number;
  readonly stringConcat: (left: string, right: string) => string;
  readonly stringTrim: (value: string) => string;
  readonly stringLowercase: (value: string) => string;
  readonly stringUppercase: (value: string) => string;
  readonly stringReplaceAll: (value: string, search: string, replacement: string) => string;
}

const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const surroundingWhitespace = /^\p{White_Space}+|\p{White_Space}+$/gu;

export const standardLibrary: KwechiriStandardLibrary = Object.freeze<KwechiriStandardLibrary>({
  stringContains: (value: string, search: string) => value.includes(search),
  stringStartsWith: (value: string, prefix: string) => value.startsWith(prefix),
  stringEndsWith: (value: string, suffix: string) => value.endsWith(suffix),
  stringGraphemeLength: (value: string) => [...graphemeSegmenter.segment(value)].length,
  stringConcat: (left: string, right: string) => left + right,
  stringTrim: (value: string) => value.replace(surroundingWhitespace, ""),
  stringLowercase: (value: string) => value.toLowerCase(),
  stringUppercase: (value: string) => value.toUpperCase(),
  stringReplaceAll: (value: string, search: string, replacement: string) =>
    search === "" ? value : value.split(search).join(replacement),
});

export const standardImplementationName = (intrinsic: StandardIntrinsic): keyof KwechiriStandardLibrary => intrinsic;
