# Standard module resolution

The `kwechiri:` namespace is reserved exclusively for official Standard
Library modules. Standard APIs use existing named imports:

```kwe
webata { nwereEriri } site na "kwechiri:eriri"
```

Standard specifiers are compiler-owned identities. They are not filesystem
paths, fake `.kwe` files, packages, npm modules, remote URLs, or aliases. An
unknown `kwechiri:` module is an error. Relative filesystem imports continue to
use canonical containment and physical-file identity under ADR-019.

Standard imports obey ordinary duplicate and imported/local collision rules.
Only cataloged exports may be imported. Batch 11A defines only
`kwechiri:eriri`.
