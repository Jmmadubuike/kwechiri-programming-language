# Identifiers

Identifiers support Unicode letters and Igbo characters including `ị`, `ọ`,
and `ụ`. After the first character, combining marks, Unicode numbers, and `_`
are also accepted.

Kwechiri names are resolved through compiler symbol tables. They are not used
directly as JavaScript variable names; generated names are internal. Approved
keywords cannot be used where the grammar requires an identifier.

Name identity is case-sensitive and based on Unicode NFC. Canonically
equivalent spellings therefore identify the same variable, function,
parameter, object-property identifier, import, or export. There is no case
folding and there are no ASCII aliases for Igbo keywords. Raw spelling remains
available on tokens for diagnostics, source slicing, and source offsets.

Module path strings and all other string contents are raw values, not names;
they are not normalized. Filesystem path lookup therefore uses the path spelling
written by the program.

Source locations use line, column, and source offset information.

**Status: Undecided** — the final identifier code-point profile, Unicode version
policy, identifier style conventions, and whether source coordinates will
eventually use UTF-16 code units, Unicode code points, or display units.
