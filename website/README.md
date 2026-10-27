# Kwechiri website

This directory contains the static Kwechiri website for `kwechiri.dev`.

The website build requires Node.js 22.12 or newer. This does not change the
Kwechiri compiler's separate Node.js 20 support.

The site is documentation-first and does not execute user-submitted Kwechiri
code. Browser execution belongs to the separately approved browser playground
milestone.

## Local development

```sh
npm ci
npm run dev
```

## Validation

```sh
npm run check
```

The repository root also provides `npm run website:check`.
