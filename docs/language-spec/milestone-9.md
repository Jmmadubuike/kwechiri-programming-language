# Milestone 9: Runtime boundary

## Status

Approved development specification for Kwechiri 0.1.0.

Milestone 9 does not add source syntax. It formalizes behavior already visible
to Kwechiri programs:

- `bipụta` output and collection formatting
- division-by-zero validation
- checked array indexing
- categorized runtime errors with file, line, and column
- isolated execution through a supplied runtime

The Node.js implementation is the first host. Generated code does not call
`console.log`, construct raw errors, or embed language helper functions.
Filesystem, network, database, time, input, environment, and package APIs are
not part of this milestone.
