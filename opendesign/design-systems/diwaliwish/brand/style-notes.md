# DiwaliWish Brand — Visual Style Notes

## Color Roles

| Role | Token | Usage |
|------|-------|-------|
| Background Primary | `--dw-bg-midnight` | Deep midnight purple — hero sections, dark layouts |
| Background Secondary | `--dw-bg-maroon` | Warm maroon — alternate sections, card backgrounds |
| Accent Gold | `--dw-accent-gold` | Primary CTA, highlights, diya glow |
| Accent Amber | `--dw-accent-amber` | Secondary highlights, floating particles |
| Accent Saffron | `--dw-accent-saffron` | Tertiary accents, festive details |
| Surface Paper | `--dw-surface-paper` | Warm off-white cards, print-friendly greeting cards |
| Surface Elevated | `--dw-surface-elevated` | Pure white modals, inputs |
| Text Ink | `--dw-text-ink` | Near-black text on light surfaces |
| Text Light | `--dw-text-ink-light` | White text on dark backgrounds |

## Typography

- **Headings / Display:** Cormorant (serif) — luxury, traditional Indian elegance
- **Body / UI:** Montserrat (sans-serif) — modern, clean, highly readable
- **Decorative accents:** Cormorant at large sizes for festive headlines

## Background Treatments

- Deep midnight purple (`#0E0A1E`) for hero and dark sections
- Warm maroon (`#3E0A14`) for alternate festive sections
- Subtle radial glows behind diya elements (gold/amber at 15–25% opacity)
- No generic bluish-purple gradients
- No flat white on flat black as default

## Motion Principles

1. **Diya flicker** — CSS keyframe animation on flame element, 3s duration, realistic light falloff
2. **Cinematic card opening** — GSAP Flip plugin, 500–800ms, expo.inOut easing, shared element between routes
3. **Floating golden particles** — CSS animation, subtle upward drift with gentle sway, 6–8s loop
4. **ScrollTrigger reveals** — GSAP, staggerChildren 0.1s, fade + slight upward drift, respect `prefers-reduced-motion`
5. **Page transitions** — Framer Motion, 500–800ms, expo.inOut, shared layout animations
6. **Hover states** — 150–300ms smooth transitions, scale 1.02–1.05, glow intensification
7. **Micro-interactions** — Button press scale 0.95, input focus ring glow, card lift on hover

## Iconography

- Source: Heroicons / Lucide-style SVG icons (no emoji)
- Colors: Gold, amber, saffron, or white-on-dark
- Sizes: 16px, 20px, 24px, 32px
- Placeholder pattern: labeled SVG rectangles when real icons unavailable

## Borders, Radius, Shadows

- Radius: 8px (sm), 12px (md), 16px (lg), 24px (xl)
- No colored left-border accent strips on cards
- Shadows: warm, dark-tinted (rgba(14,10,30,0.1–0.25)), never gray-on-white defaults
- Glow shadow: gold-tinted for festive emphasis

## Imagery Vibe

- Diya (oil lamp) motifs — glowing flame, warm light
- Rangoli patterns — subtle geometric backgrounds
- Gold leaf textures — premium finish
- No hand-drawn complex SVGs; use labeled placeholders or copy real assets

## Accessibility

- WCAG 4.5:1 contrast minimum on all text
- Visible focus-visible rings (gold accent)
- `prefers-reduced-motion` — disable flicker, particles, parallax; render final states
- Touch targets: 44px minimum on mobile
- Keyboard-navigable all interactive elements
