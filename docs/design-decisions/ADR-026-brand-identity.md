# ADR-026: Kwechiri brand identity

## Context

The website, documentation, VS Code extension, and Marketplace publisher need a
single visual identity. The owner supplied the primary Kwechiri logo and
directed that its palette be used everywhere Kwechiri is represented.

## Decision

The owner-supplied
`assets/brand/kwechiri-programming-language-logo-main.png` is the master logo.
The square crop `assets/brand/kwechiri-mark-128.png` is used for compact
product and publisher icons.

The active palette is:

| Token | Value | Use |
|---|---|---|
| Ink | `#080A0C` | primary text and dark surfaces |
| Black | `#000000` | logo field and footer |
| Electric blue | `#0388EC` | primary accent |
| Cyan | `#02B4EF` | links and technical highlights |
| Deep blue | `#01337B` | high-contrast actions |
| Orange | `#FE7A0C` | emphasis and focus |
| Emerald | `#12D69C` | confirmed and successful states |
| White | `#FFFFFF` | primary light surface |
| Slate | `#E3E7E7` | secondary light text |

Text colors may use darker accessible variants of the decorative brand colors.

## Consequences

The website, favicon, social preview, README, VS Code extension icon, and
Marketplace profile use this identity. Product structure and technical behavior
remain unchanged. Future brand assets should derive from the master logo rather
than reintroducing the earlier green-and-gold temporary identity.
