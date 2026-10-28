import type { StandardIntrinsic } from "./catalog.js";

export interface KwechiriStandardLibrary {
  readonly stringContains: (value: string, search: string) => boolean;
  readonly stringStartsWith: (value: string, prefix: string) => boolean;
  readonly stringEndsWith: (value: string, suffix: string) => boolean;
  readonly stringGraphemeLength: (value: string) => number;
  readonly stringConcat: (left: string, right: string) => string;
}

const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

export const standardLibrary: KwechiriStandardLibrary = Object.freeze<KwechiriStandardLibrary>({
  stringContains: (value: string, search: string) => value.includes(search),
  stringStartsWith: (value: string, prefix: string) => value.startsWith(prefix),
  stringEndsWith: (value: string, suffix: string) => value.endsWith(suffix),
  stringGraphemeLength: (value: string) => [...graphemeSegmenter.segment(value)].length,
  stringConcat: (left: string, right: string) => left + right,
});

export const standardImplementationName = (intrinsic: StandardIntrinsic): keyof KwechiriStandardLibrary => intrinsic;
