export const ExitCode = {
  Success: 0,
  KwechiriDiagnostic: 1,
  InvalidUsage: 2,
  FileSystemFailure: 3,
  InternalFailure: 4,
} as const;

export type ExitCode = (typeof ExitCode)[keyof typeof ExitCode];
