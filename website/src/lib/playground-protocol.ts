export interface PlaygroundLocation {
  readonly fileName: string;
  readonly line: number;
  readonly column: number;
}

export interface PlaygroundRunRequest {
  readonly type: "run";
  readonly requestId: number;
  readonly source: string;
}

export interface PlaygroundSuccessResponse {
  readonly type: "success";
  readonly requestId: number;
  readonly output: string;
  readonly elapsedMs: number;
}

export type PlaygroundDiagnosticKind =
  | "compile"
  | "runtime"
  | "limit"
  | "internal";

export interface PlaygroundDiagnosticResponse {
  readonly type: "diagnostic";
  readonly requestId: number;
  readonly kind: PlaygroundDiagnosticKind;
  readonly message: string;
  readonly location?: PlaygroundLocation;
}

export type PlaygroundWorkerResponse =
  | PlaygroundSuccessResponse
  | PlaygroundDiagnosticResponse;
