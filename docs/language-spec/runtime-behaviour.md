# Runtime behaviour

Generated JavaScript receives a `KwechiriRuntime` dependency. The runtime owns
output formatting, checked division, checked array indexing, and runtime-error
construction. `NodeKwechiriRuntime` is the initial host implementation.

Programs execute in an isolated function scope. Runtime errors carry a stable
category and original source location. Compiler stages do not call Node output
APIs directly.

The runtime milestone adds no filesystem, HTTP, database, clock, input,
environment-variable, or package API.

**Status: Undecided** — future host capabilities, browser execution policy, and
standard-library/runtime ownership beyond the implemented operations.
