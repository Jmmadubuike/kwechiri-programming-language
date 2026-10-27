# Runtime architecture

The compiler emits JavaScript that expects a `_kweRuntime` dependency. The
executor creates an isolated function scope and supplies a `KwechiriRuntime`
implementation. `NodeKwechiriRuntime` is the initial adapter.

Before compilation, the module loader emits each canonical module once in
dependency-first order. Imported collections remain shared JavaScript
references across that flattened graph; the runtime does not copy or freeze
them. Module path resolution, containment, caching, and cycle rejection remain
compiler concerns and do not expand the runtime API.

Pure Standard Library operations use a portable implementation injected beside
the runtime. They do not expand `KwechiriRuntime` or depend on Node or browser
capabilities. Compiler-known intrinsic calls target this private implementation
boundary rather than arbitrary host APIs.

Runtime operations receive original source locations. Failures use
`KwechiriRuntimeError`, including a stable category, filename, line, column,
and bilingual message. The compiler therefore defines language intent while
the runtime defines host behavior.
