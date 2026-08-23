# Runtime behaviour

Generated JavaScript receives a `KwechiriRuntime` dependency. The runtime owns
output formatting, checked division, checked array indexing and index mutation,
and runtime-error construction. `NodeKwechiriRuntime` is the initial host
implementation.

Programs execute in an isolated function scope. Runtime errors carry a stable
category and original source location. Compiler stages do not call Node output
APIs directly.

The runtime milestone adds no filesystem, HTTP, database, clock, input,
environment-variable, or package API.

Language-facing output renders Boolean values as `eziokwu` and `ụgha` and the
absence value as `efu`, including within printable collections. The initial
JavaScript backend represents absence using `null`; this is an implementation
detail, and JavaScript `undefined` is not a Kwechiri value.

Collection output uses the compact Kwechiri collection display format. It is
not JSON: nested Boolean and absence values retain their Kwechiri spellings.

**Status: Undecided** — future host capabilities, browser execution policy, and
standard-library/runtime ownership beyond the implemented operations.
