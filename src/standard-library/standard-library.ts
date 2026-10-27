import type { StandardIntrinsic } from "./catalog.js";

export interface KwechiriStandardLibrary {
  readonly stringContains: (value: string, search: string) => boolean;
  readonly stringStartsWith: (value: string, prefix: string) => boolean;
  readonly stringEndsWith: (value: string, suffix: string) => boolean;
}

export const standardLibrary: KwechiriStandardLibrary = Object.freeze<KwechiriStandardLibrary>({
  stringContains: (value: string, search: string) => value.includes(search),
  stringStartsWith: (value: string, prefix: string) => value.startsWith(prefix),
  stringEndsWith: (value: string, suffix: string) => value.endsWith(suffix),
});

export const standardImplementationName = (intrinsic: StandardIntrinsic): keyof KwechiriStandardLibrary => intrinsic;
