# Kwechiri website

This directory contains the static Kwechiri website for `kwechiri.dev`.

The website build requires Node.js 22.23.4 or newer. This does not change the
Kwechiri compiler's separate Node.js 20 support.

The site is documentation-first. Its `/playground/` route compiles and runs one
Kwechiri source file locally in a dedicated browser worker. Source is not
uploaded. The site adds cookieless Vercel Web Analytics for visit counts and no
persistence.

The playground supports certified `kwechiri:` imports but not relative
filesystem modules. Batch 12A deployment and execution limits are documented in
[the repository roadmap](../docs/roadmap/MILESTONE-12-BROWSER-PLAYGROUND.md).

## Local development

```sh
npm ci
npm run dev
```

## Validation

```sh
npm run check
npm run test:e2e:install
npm run test:e2e
```

The repository root also provides `npm run website:check`.
