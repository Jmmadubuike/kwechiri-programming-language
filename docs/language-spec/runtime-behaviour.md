# Runtime behaviour

Generated JavaScript receives a `KwechiriRuntime` dependency. The runtime owns
output formatting, checked division, checked array indexing and index mutation,
and runtime-error construction. `NodeKwechiriRuntime` is the initial command-line
host implementation. The Batch 12A playground supplies the same runtime
contract inside an isolated browser worker.

Programs execute in an isolated function scope. Runtime errors carry a stable
category and original source location. Compiler stages do not call Node output
APIs directly.

The runtime milestone adds no filesystem, HTTP, database, clock, input,
environment-variable, or package API.

The browser playground compiles one source file and permits certified
`kwechiri:` imports. Filesystem modules, source uploads, persistence, analytics,
accounts, and DOM/network APIs remain outside its approved boundary. Worker
timeouts and output limits are tool resource controls, not language behavior.

Language-facing output renders Boolean values as `eziokwu` and `ụgha` and the
absence value as `efu`, including within printable collections. The initial
JavaScript backend represents absence using `null`; this is an implementation
detail, and JavaScript `undefined` is not a Kwechiri value.

Collection output uses the compact Kwechiri collection display format. It is
not JSON: nested Boolean and absence values retain their Kwechiri spellings.

**Status: Undecided** — host capabilities beyond the implemented local
playground, production-grade untrusted-code execution, and Standard
Library/runtime ownership beyond the implemented operations.
