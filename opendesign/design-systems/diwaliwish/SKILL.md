# DiwaliWish Design System Skill

A portable design system skill for DiwaliWish — Personalized Diwali Wishes & Fun Predictions.

## Discovery Marker

This folder is recognized as a design system by `opendesign` auto-discovery because it contains `SKILL.md` and `tokens/colors_and_type.css`.

## Token File

Canonical tokens live at:
`./opendesign/design-systems/diwaliwish/tokens/colors_and_type.css`

Import this file in any HTML page or CSS build that needs DiwaliWish design tokens.

## Brand

- **Name:** DiwaliWish
- **Purpose:** Personalized Diwali greetings with zodiac-based fun predictions, lucky color/number/flower/trait, theme selection, and downloadable greeting cards
- **Audience:** Friends, family, college students, social-media users
- **Tone:** Warm, personal, festive, premium, elegant

## Visual Direction

- Deep midnight purple and warm maroon backgrounds
- Rich gold, amber, saffron accents (oklch, shared chroma & lightness)
- Cormorant headings + Montserrat body
- Diya-inspired glowing light, floating particles, cinematic card interactions

## Usage

```html
<link rel="stylesheet" href="./opendesign/design-systems/diwaliwish/tokens/colors_and_type.css">
```

Then reference tokens via `var(--dw-* )` in your CSS.
