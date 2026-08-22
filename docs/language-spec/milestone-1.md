# Milestone 1: Hello World

## Status

Development specification for Kwechiri 0.1.0.

## Supported program

Milestone 1 supports calls to the built-in output operation with one string:

```kwe
bipụta("Ndewo Ụwa!")
```

`bipụta` is the canonical spelling for this milestone. Source files use the
`.kwe` extension and UTF-8 encoding.

Multiple output statements are accepted. Variables, numbers, booleans,
arithmetic, conditions, loops, functions, collections, and modules are not yet
part of the implemented language.

## Result

The compiler produces JavaScript `console.log` calls. The CLI executes that
generated JavaScript with Node.js.
