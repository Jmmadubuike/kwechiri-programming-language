# Identifiers

Identifiers support Unicode letters and Igbo characters including `ị`, `ọ`,
and `ụ`. After the first character, combining marks, Unicode numbers, and `_`
are also accepted.

Kwechiri names are resolved through compiler symbol tables. They are not used
directly as JavaScript variable names; generated names are internal. Approved
keywords cannot be used where the grammar requires an identifier.

Source locations use line, column, and source offset information.

**Status: Undecided** — NFC normalization, canonically equivalent spellings,
ASCII aliases, and identifier style conventions.
