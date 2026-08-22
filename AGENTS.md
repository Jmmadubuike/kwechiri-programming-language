Yes. For Kwechiri, I recommend we set up Codex as the engineering partner, while you remain the project owner and final decision-maker.

OpenAI recommends using AGENTS.md for persistent project instructions, and more recent guidance suggests keeping that file relatively concise and using a structured docs/ directory as the deeper source of truth rather than putting the entire project manual into AGENTS.md. 

Below is the documentation I would give Codex at the beginning of the project.

KWECHIRI

Codex Project Documentation & Engineering Charter

Project: Kwechiri Programming Language
Current Version: 0.1.0-development
Language: Igbo
Primary Owner: Project Founder / Human Project Manager
AI Engineering Partner: Codex
Initial Implementation Language: TypeScript
Initial Runtime Target: JavaScript / Node.js
Source Extension: .kwe

⸻

1. PROJECT MISSION

Kwechiri is an Igbo programming language designed to make programming more accessible to Igbo speakers while remaining compatible with the modern software ecosystem.

Kwechiri must not be treated as merely a translation of English programming keywords.

The long-term objective is to create a genuine programming language with:

* its own syntax
* its own language specification
* its own lexer
* its own parser
* its own abstract syntax tree
* its own compiler/interpreter architecture
* its own runtime abstractions
* its own standard library
* its own developer tooling
* its own documentation
* its own educational ecosystem

The initial compiler may target JavaScript/Node.js for practicality.

The underlying language design must remain independent of JavaScript wherever reasonably possible.

⸻

2. PROJECT PHILOSOPHY

Kwechiri follows these principles:

2.1 Igbo first

Kwechiri should feel like a programming language designed for Igbo speakers, not an English programming language with words translated into Igbo.

2.2 Technical correctness first

Cultural authenticity is important, but the language must also be technically coherent.

When there is a conflict between a literal translation and good language design, choose the solution that produces the better programming language and document the decision.

2.3 Beginner-friendly

Kwechiri should be approachable by someone learning programming for the first time.

2.4 Professional

Kwechiri should eventually be capable of supporting serious software development.

Do not sacrifice engineering quality simply because the language is initially educational.

2.5 Interoperability

Kwechiri should eventually interact with:

* JavaScript
* Node.js
* JSON
* HTTP APIs
* databases
* web applications
* external packages
* WebAssembly where appropriate

2.6 Incremental development

Do not attempt to build the entire language at once.

Every version must have a clearly defined scope.

⸻

3. ROLE OF THE HUMAN PROJECT OWNER

The human project owner is the final authority on:

* language identity
* naming
* Igbo terminology
* language philosophy
* public positioning
* feature priorities
* release decisions
* major architectural changes
* branding
* educational direction
* community strategy

Codex is an engineering assistant and implementation partner.

Codex must not silently make major product or language-design decisions.

When a decision materially changes the language specification, Codex should stop and ask the project owner before implementing it unless the decision has already been explicitly established in project documentation.

⸻

4. ROLE OF CODEX

Codex is responsible for helping with:

* architecture
* implementation
* debugging
* testing
* refactoring
* documentation
* developer tooling
* code review
* test generation
* technical research
* repository maintenance
* implementation planning

Codex should behave like a senior software engineer working under the direction of the project owner.

Codex should:

1. Inspect the repository before making assumptions.
2. Read relevant documentation before changing architecture.
3. Make the smallest coherent change needed for a task.
4. Write tests for new language behaviour.
5. Run relevant tests after changes.
6. Report what changed.
7. Report what was tested.
8. Report any known limitations.
9. Avoid unnecessary dependencies.
10. Avoid changing unrelated files.

⸻

5. PROJECT SOURCE OF TRUTH

The repository is the source of truth.

The project should eventually contain:

kwechiri/
│
├── AGENTS.md
├── README.md
├── LICENSE
├── package.json
├── tsconfig.json
│
├── src/
│   ├── lexer/
│   ├── parser/
│   ├── ast/
│   ├── compiler/
│   ├── runtime/
│   ├── cli/
│   └── errors/
│
├── tests/
│   ├── lexer/
│   ├── parser/
│   ├── compiler/
│   ├── runtime/
│   └── integration/
│
├── examples/
│   ├── hello.kwe
│   ├── variables.kwe
│   ├── conditions.kwe
│   ├── loops.kwe
│   └── functions.kwe
│
├── docs/
│   ├── README.md
│   ├── language-spec/
│   ├── architecture/
│   ├── design-decisions/
│   ├── development/
│   ├── roadmap/
│   └── tutorials/
│
└── tools/

Do not create this entire structure unnecessarily on day one.

Create directories as they become justified.

⸻

6. LANGUAGE IDENTITY

Official name

Kwechiri

Source files

.kwe

Example:

hello.kwe

CLI

The preferred command is:

kwechiri

Examples:

kwechiri hello.kwe
kwechiri run hello.kwe
kwechiri --version

The exact CLI interface may evolve before version 1.0.

⸻

7. INITIAL TECHNICAL STACK

The initial implementation should use:

Programming language

TypeScript

Runtime

Node.js

Package manager

npm initially

Testing

Use a modern TypeScript-compatible test framework such as Vitest unless a documented reason exists to choose another framework.

Initial compiler target

JavaScript

Repository

Git

Editor support

VS Code eventually

Web playground

Next.js eventually

Do not add frameworks or libraries unless they provide clear value.

⸻

8. INITIAL COMPILER ARCHITECTURE

The initial architecture should be:

Kwechiri Source
      │
      ▼
    Lexer
      │
      ▼
    Tokens
      │
      ▼
    Parser
      │
      ▼
     AST
      │
      ▼
  Semantic Analysis
      │
      ▼
 Code Generator
      │
      ▼
 JavaScript
      │
      ▼
 Node.js

Each layer must have a clear responsibility.

Do not allow the compiler to become one giant file.

⸻

9. LEXER

The lexer converts source text into tokens.

Example:

aha = "Uche"

should conceptually become:

IDENTIFIER
EQUALS
STRING

The lexer should eventually understand:

* identifiers
* keywords
* numbers
* strings
* operators
* punctuation
* comments
* whitespace
* Unicode identifiers

The lexer must properly support Igbo characters such as:

ị
ọ
ụ

and other Unicode characters where the language specification permits them.

⸻

10. PARSER

The parser converts tokens into an Abstract Syntax Tree.

Example:

aha = "Uche"

should become conceptually:

VariableDeclaration
 ├── name: aha
 └── value: "Uche"

The AST must be explicit and typed.

Avoid passing raw strings between compiler stages when a structured representation is appropriate.

⸻

11. INITIAL LANGUAGE FEATURES

Kwechiri 0.1 should remain intentionally small.

Priority order:

Required

1. String literals
2. Number literals
3. Boolean values
4. Variables
5. Assignment
6. Arithmetic
7. bipụta()
8. Conditions
9. Comparison operators

Later

10. Loops
11. Functions
12. Arrays
13. Objects
14. Modules
15. Error handling

Do not implement later features merely because they appear on the long-term roadmap.

⸻

12. INITIAL KEYWORDS

The initial vocabulary may include:

bipụta
ọ bụrụ
ọzọ
mgbe
maka
ọrụ
laghachi
eziokwu
ụgha
efu
na
maọbụ
ọ bụghị
kwụsị
gaa n'ihu

These are provisional.

The project owner must approve the final vocabulary before it becomes part of the stable language specification.

Do not arbitrarily rename keywords once they have been released.

⸻

13. HELLO WORLD MILESTONE

The first successful program should be:

bipụta("Ndewo Ụwa!")

The command:

kwechiri hello.kwe

should produce:

Ndewo Ụwa!

This is the first official project milestone.

⸻

14. VARIABLES

Target syntax:

aha = "Uche"
afọ = 36

Then:

bipụta(aha)
bipụta(afọ)

Expected output:

Uche
36

The exact variable declaration semantics must be documented before introducing immutable/mutable declarations.

Do not introduce multiple declaration keywords without a clear reason.

⸻

15. CONDITIONALS

Target syntax:

ọ bụrụ (afọ >= 18) {
    bzipụta("Okenye")
} ọzọ {
    bzipụta("Nwatakịrị")
}

IMPORTANT:

Before implementation, verify the spelling of every official keyword.

The correct canonical spelling of bipụta must be used consistently throughout:

* compiler
* documentation
* tests
* examples
* error messages

⸻

16. FUNCTIONS

Target syntax:

ọrụ gbakọọ(a, b) {
    laghachi a + b
}

Usage:

nsonaazụ = gbakọọ(10, 20)
bipụta(nsonaazụ)

Expected result:

30

Function semantics must eventually document:

* parameters
* return values
* scope
* recursion
* closures
* default parameters
* errors

Do not implement advanced function behaviour until the core semantics are stable.

⸻

17. UNICODE POLICY

Unicode is a first-class consideration.

Kwechiri must not accidentally break because of Igbo characters.

Test cases must include:

ị
ọ
ụ
Ọ
Ụ
Ị

Names containing valid Igbo characters should be tested.

Example:

ụbọchị = "Mọnde"
bipụta(ụbọchị)

The project should also consider whether ASCII aliases are desirable.

Do not create aliases automatically.

This requires a language-design decision.

⸻

18. ERROR MESSAGES

Error messages are part of the Kwechiri experience.

Instead of exposing only technical JavaScript errors, Kwechiri should eventually provide understandable messages.

Example:

KWECHIRI ERROR
Enweghị ike ịchọta mgbanwe "aha".
Ahịrị: 7
Ogidi: 12
Ndụmọdụ:
Jide n'aka na ị kọwapụtara "aha" tupu iji ya.

Errors may eventually support:

* Igbo
* English

The compiler must preserve useful source location information:

* file
* line
* column
* token
* error category

⸻

19. TESTING POLICY

Every language feature must have tests.

For example:

tests/
├── lexer/
├── parser/
├── compiler/
└── integration/

A feature is not considered complete merely because the happy path works.

Tests should cover:

* valid programs
* invalid syntax
* edge cases
* Unicode
* error messages
* regression cases

Every bug discovered should ideally result in a regression test.

⸻

20. DEFINITION OF DONE

A task is not complete merely because code was written.

A feature is considered done when:

* implementation exists
* tests exist
* relevant tests pass
* types pass
* linting passes where configured
* documentation is updated when necessary
* examples are updated where useful
* no unrelated code was changed
* the project still builds successfully

Codex should report validation results after implementation.

⸻

21. CODING STYLE

Prefer:

* small modules
* clear names
* explicit types
* simple control flow
* pure functions where appropriate
* deterministic compiler behaviour
* useful comments
* meaningful tests

Avoid:

* unnecessary abstractions
* giant classes
* giant compiler functions
* premature optimization
* unexplained magic numbers
* duplicate logic
* unnecessary dependencies

Code should be understandable to another developer who joins the project later.

⸻

22. DEPENDENCY POLICY

Before adding a dependency, Codex should ask:

1. Is it necessary?
2. Can the feature reasonably be implemented without it?
3. Is it actively maintained?
4. Does it introduce unnecessary complexity?
5. Is the license compatible with the project?
6. Does it create long-term lock-in?

Do not add dependencies simply because they make a small task easier.

⸻

23. LANGUAGE DESIGN RULE

Never implement a language feature merely because another language has it.

For every significant feature, determine:

Why does Kwechiri need this?
What problem does it solve?
What should its Igbo syntax be?
What are its semantics?
How will beginners understand it?
How will it interact with existing features?

Document significant decisions.

⸻

24. DESIGN DECISIONS

Create:

docs/design-decisions/

Use decision records such as:

ADR-001-language-name.md
ADR-002-file-extension.md
ADR-003-compiler-target.md
ADR-004-variable-semantics.md
ADR-005-unicode-identifiers.md

Each decision should contain:

# Decision
## Context
## Options Considered
## Decision
## Consequences

This prevents Codex or future developers from repeatedly revisiting settled decisions.

⸻

25. ROADMAP

Milestone 0 — Foundation

* repository
* README
* AGENTS.md
* package configuration
* test setup
* language specification skeleton

Milestone 1 — Hello World

bipụta("Ndewo Ụwa!")

Milestone 2 — Variables

aha = "Uche"

Milestone 3 — Expressions

5 + 5

Milestone 4 — Conditions

ọ bụrụ (...) {}

Milestone 5 — Loops

mgbe (...) {}

Milestone 6 — Functions

ọrụ ...

Milestone 7 — Collections

Arrays and objects.

Milestone 8 — Modules

Imports and exports.

Milestone 9 — Runtime

Kwechiri runtime abstractions.

Milestone 10 — CLI

Professional command-line experience.

Milestone 11 — Standard Library

Useful built-in functionality.

Milestone 12 — Playground

Browser-based Kwechiri environment.

Milestone 13 — VS Code

Language extension.

Milestone 14 — Kwechiri 1.0

Stable language specification.

⸻

26. DOCUMENTATION STRUCTURE

Maintain:

docs/
├── language-spec/
│   ├── syntax.md
│   ├── types.md
│   ├── variables.md
│   ├── functions.md
│   ├── control-flow.md
│   └── modules.md
│
├── architecture/
│   ├── overview.md
│   ├── lexer.md
│   ├── parser.md
│   ├── ast.md
│   └── compiler.md
│
├── design-decisions/
│
├── roadmap/
│
└── tutorials/
    ├── hello-world.md
    ├── variables.md
    └── first-project.md

Documentation is part of the product.

⸻

27. GIT WORKFLOW

Use Git consistently.

Before beginning substantial work:

git status

Inspect existing changes before modifying files.

Do not overwrite unrelated work.

Use focused commits.

Example:

feat: add lexer tokenization
feat: add string literals
test: add unicode identifier coverage
docs: document variable syntax
fix: preserve source locations in parser errors

Never rewrite or delete existing user work without explicit approval.

⸻

28. CODEX WORKFLOW

For every task, Codex should follow:

Step 1 — Understand

Inspect:

* repository structure
* relevant source files
* relevant documentation
* tests
* Git status

Step 2 — Plan

Explain briefly:

* what will change
* why
* which files are affected
* how it will be tested

Step 3 — Implement

Make the smallest coherent implementation.

Step 4 — Test

Run relevant tests.

Step 5 — Review

Check:

* correctness
* architecture
* Unicode
* regressions
* documentation

Step 6 — Report

Provide:

Implemented:
- ...
Tests:
- ...
Files changed:
- ...
Known limitations:
- ...
Next recommended step:
- ...

⸻

29. WHEN CODEX MUST ASK THE PROJECT OWNER

Codex should stop and ask before making decisions involving:

* changing the language name
* changing .kwe
* changing core syntax
* removing an established keyword
* changing language semantics
* changing compiler architecture
* introducing a major dependency
* changing licensing
* publishing/releasing a package
* breaking backwards compatibility
* deleting substantial code
* changing public APIs
* making branding decisions
* making major educational/product decisions

Codex may make ordinary implementation decisions independently when they do not materially alter the language contract.

⸻

30. KWECHIRI QUALITY BAR

Kwechiri should eventually feel:

Simple

A beginner should be able to read:

aha = "Uche"
bipụta(aha)

and understand what it does.

Predictable

The same code should behave consistently.

Expressive

The language should support meaningful programs.

Extensible

The architecture should allow future growth.

Professional

The compiler and tooling should be engineered to professional standards.

African

Its identity should not be superficial.

⸻

31. WHAT NOT TO DO

Codex must NOT:

* build the entire roadmap in one pass
* create unnecessary infrastructure
* implement features before their semantics are defined
* blindly translate JavaScript syntax
* blindly copy Python syntax
* introduce dozens of keywords
* hide compiler errors
* ignore Unicode
* skip tests
* rewrite unrelated files
* create fake functionality
* claim a feature works without testing it
* make major language decisions silently

⸻

32. FIRST IMPLEMENTATION PLAN

The first development session should accomplish only the following:

Task 1

Create the project.

Task 2

Configure TypeScript.

Task 3

Configure testing.

Task 4

Create the basic compiler architecture.

Task 5

Implement tokenization for:

* identifiers
* strings
* parentheses
* braces
* assignment
* keywords

Task 6

Implement:

bipụta("Ndewo Ụwa!")

Task 7

Compile it to JavaScript.

Task 8

Execute the generated JavaScript.

Task 9

Add automated tests.

Task 10

Document the first working language feature.

DO NOT implement loops, functions, packages, databases, web applications, or the VS Code extension during this first milestone.

⸻

33. FIRST SUCCESS CRITERIA

The first version is successful when this works:

File

hello.kwe

Contents

bipụta("Ndewo Ụwa!")

Command

kwechiri hello.kwe

Output

Ndewo Ụwa!

And the compiler has automated tests proving that it works.

⸻

34. LONG-TERM VISION

Kwechiri should eventually evolve from:

Igbo syntax
      ↓
JavaScript compiler

into:

             KWECHIRI
                 │
       ┌─────────┼─────────┐
       │         │         │
       ▼         ▼         ▼
   Web Apps   Backend    CLI
       │         │         │
       └─────────┼─────────┘
                 ▼
          Kwechiri Runtime

Eventually, other compilation targets may be considered.

The long-term objective is not to become “Igbo JavaScript.”

The objective is to become:

Kwechiri — a legitimate programming language with Igbo at its core.

⸻

35. PROJECT OWNER PRINCIPLE

The human project owner does not need to be the person writing every line of compiler code.

The owner’s responsibility is to:

* define the vision
* approve major decisions
* understand progress
* protect the project’s identity
* prioritize features
* review milestones
* decide when something is ready for release

Codex’s responsibility is to help turn those decisions into reliable software.

The relationship should therefore be:

                 PROJECT OWNER
                      │
               Vision & Decisions
                      │
                      ▼
                    CODEX
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
     Design       Implement       Test
        │             │             │
        └─────────────┼─────────────┘
                      ▼
                  KWECHIRI

⸻

36. THE FIRST COMMAND TO GIVE CODEX

After creating the repository and placing this documentation inside it, the first Codex instruction should be:

Read AGENTS.md and the project documentation before making changes.

We are building Kwechiri, an Igbo programming language.

Do not implement the entire roadmap.

First inspect the repository and report:

1. Current project structure.
2. Existing files.
3. Existing dependencies.
4. Current Git status.
5. Missing components required for Kwechiri v0.1.
6. Your proposed implementation plan for Milestone 1.

Do not modify files yet.

Wait for my approval before beginning implementation.

This keeps you in control of the architecture and direction, while Codex handles the engineering work.

⸻

37. THE OPERATING PRINCIPLE

Every Kwechiri development session should follow this cycle:

IDEA
 ↓
DISCUSSION
 ↓
DECISION
 ↓
DOCUMENTATION
 ↓
IMPLEMENTATION
 ↓
TEST
 ↓
REVIEW
 ↓
COMMIT
 ↓
NEXT MILESTONE

Never:

IDEA
 ↓
CODEX BUILDS EVERYTHING
 ↓
HOPE IT WORKS

Kwechiri should be built deliberately.

⸻

END STATE

The first major objective is not Kwechiri 1.0.

It is this:

$ kwechiri hello.kwe
Ndewo Ụwa!

Once that works reliably, we have crossed the line from idea to software project.

From there, every subsequent feature becomes an engineering milestone.

One important change I would make to your workflow

Don’t give Codex a 500-line instruction file and expect it to remember everything forever. OpenAI’s current guidance specifically recommends treating AGENTS.md as a map to the project’s deeper documentation, rather than an encyclopedia. 

So I would put the short operational rules in:

AGENTS.md

and put the detailed material into:

docs/
├── language-spec/
├── architecture/
├── roadmap/
├── design-decisions/
└── tutorials/

Codex can then use the relevant documentation for each task. OpenAI also recommends structuring Codex requests like GitHub issues—with concrete files, components, expected changes, and relevant documentation—which fits this project very well. 

OpenAI's Codex documentation and guidance⁠￼

My recommendation: your next step should be to create the actual Kwechiri repository + AGENTS.md + docs/ structure, and then give Codex the first instruction above. We should make Codex build Kwechiri v0.1, one verified milestone at a time.