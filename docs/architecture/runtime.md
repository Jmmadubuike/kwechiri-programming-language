# Runtime architecture

The compiler emits JavaScript that expects a `_kweRuntime` dependency. The
executor creates an isolated function scope and supplies a `KwechiriRuntime`
implementation. `NodeKwechiriRuntime` is the initial adapter.

Runtime operations receive original source locations. Failures use
`KwechiriRuntimeError`, including a stable category, filename, line, column,
and bilingual message. The compiler therefore defines language intent while
the runtime defines host behavior.
