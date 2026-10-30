# Identifiers

Identifiers support Unicode letters and Igbo characters including `ị`, `ọ`,
and `ụ`. After the first character, combining marks, Unicode numbers, and `_`
are also accepted.

Scanning operates on Unicode code points, so astral letters can form
identifiers without being split into surrogate halves. Unicode 15.0.0 is the
guaranteed portable baseline. A newer host may accept characters added later
in Unicode, but those characters do not carry a cross-host 1.0 guarantee.

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

Identifier style conventions are deferred beyond 1.0. The code-point profile,
Unicode baseline, NFC identity, coordinate units, and no-alias rule are fixed
by ADR-028 and ADR-027.
