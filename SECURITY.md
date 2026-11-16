# Security policy

## Supported versions

The current stable release is `kwechiri@1.1.0`. Security fixes are provided on
a best-effort basis for the latest published release line. Older versions may
not receive fixes, so users should upgrade to the latest release when possible.

No formal long-term-support commitment is currently published.

## Reporting a vulnerability

Please do not report a security vulnerability in a public issue, discussion, or
pull request.

The preferred channel is GitHub private vulnerability reporting on the
repository's **Security** tab.

If private reporting is unavailable, contact the project owner privately through
<https://github.com/Jmmadubuike> and identify the report as a security matter.

Please include:

- the affected package, command, extension, or website component;
- the affected version or commit;
- the operating system and Node.js version, where relevant;
- a minimal reproducible example or set of steps;
- the observed impact and any known preconditions;
- whether the issue is already public or has been reported elsewhere; and
- a safe way to contact you for follow-up.

Do not include live credentials, private keys, personal data, or third-party
data in a report. Use redacted examples.

## Scope

Reports are especially useful for:

- the compiler, parser, semantic analyzer, code generator, and module loader;
- the `kwechiri` CLI and its file, output, and error-handling boundaries;
- the Kwechiri runtime and generated JavaScript;
- the VS Code extension and its diagnostics or workspace boundaries;
- the browser playground and website build; and
- supply-chain or release-integrity problems in this repository.

Third-party services, provider accounts, and social engineering are outside the
repository's direct security boundary. If a report concerns a dependency or
external provider, the project may redirect it to the appropriate maintainer.

## What to expect

The maintainer will make a best-effort attempt to acknowledge, reproduce, and
triage the report. Response and remediation times are not guaranteed. Please
allow reasonable time for investigation and coordinated disclosure before
publishing details.

When a fix is ready, the project will document the affected versions and
release status without exposing reporter information unless the reporter
agrees.

## Safe research

Please act in good faith, use only systems and data you are authorised to test,
avoid disrupting other users, and stop testing if you encounter sensitive data.
This policy does not grant permission to access third-party systems.
