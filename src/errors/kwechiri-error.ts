export interface SourceLocation {
  readonly line: number;
  readonly column: number;
  readonly offset: number;
}

export class KwechiriError extends Error {
  public constructor(
    message: string,
    public readonly location: SourceLocation,
    public readonly fileName?: string,
  ) {
    const source = fileName === undefined ? "" : `${fileName}:`;
    super(`${source}${location.line}:${location.column}: ${message}`);
    this.name = "KwechiriError";
  }
}
