# ConvertX Brand Guidelines

## Brand Overview

**ConvertX** is a fast, clean, and reliable unit & currency converter web app built for students, professionals, and everyday users. The brand communicates speed, clarity, intelligence, and trustworthiness. Every design decision should feel purposeful — nothing is decorative without reason.

---

## Brand Name

**++ConvertX++**

- Always written as "ConvertX" — capital C and capital X, no space
- The "X" represents conversion, exchange, and transformation
- Never written as "Convertx", "convertX", "Convert X", or "CONVERTX"

### Acceptable Usage
- ConvertX
- CONVERTX (all caps, only for display/poster use)

### Unacceptable Usage
- convertx (all lowercase)
- Convertx (lowercase x)
- Convert X (with space)
- Convert-X (with hyphen)
- CX (abbreviation — never use)

---

## Logo Usage

### Clear Space
- Maintain minimum clear space around the logo equal to the height of the letter "C" in "ConvertX" on all sides
- Never crowd the logo with other elements

### Minimum Size
- Digital: 100px width minimum
- Print: 1 inch / 25mm width minimum
- Favicon: 16x16px (use "X" icon mark only)

### Logo Don'ts
- Do not stretch or distort the logo
- Do not rotate the logo
- Do not apply drop shadows or glows
- Do not place on busy or clashing backgrounds
- Do not recolor the logo outside approved palette
- Do not use outdated versions of the logo

---

## Color Palette

### Primary Color

**++ConvertX Electric Blue++**
- HEX: `#2563EB`
- RGB: 37, 99, 235
- HSL: 221°, 83%, 53%
- CMYK: 84, 58, 0, 8
- Use as: Primary brand color, CTA buttons, active states, links, key highlights

### Secondary Colors

**++Slate Dark++**
- HEX: `#0F172A`
- RGB: 15, 23, 42
- Use as: Primary background (dark mode), navbar background

**++Slate Mid++**
- HEX: `#1E293B`
- RGB: 30, 41, 59
- Use as: Card backgrounds (dark mode), secondary surfaces

**++Cool Gray++**
- HEX: `#94A3B8`
- RGB: 148, 163, 184
- Use as: Secondary text, placeholder text, borders, dividers

**++Light Background++**
- HEX: `#F8FAFC`
- Use as: Page background (light mode)

**++White++**
- HEX: `#FFFFFF`
- Use as: Text on dark backgrounds, card surfaces

### Accent / Functional Colors

**++Success Green++** — `#22C55E` — positive change, success messages

**++Error Red++** — `#EF4444` — errors, negative values, invalid input

**++Warning Amber++** — `#F59E0B` — warnings, rate delay notices

**++Purple Accent++** — `#8B5CF6` — Favorites section, special badges

### Color Rules
- Never use more than 3 colors in a single UI component
- Primary Blue is always the sole action color — only one primary CTA per screen
- Dark mode is the **default** theme
- Maintain minimum contrast ratio of **4.5:1** for all text (WCAG AA) in both modes

---

## Typography

### Font Families

**Display / Heading: `Space Grotesk`**
- Google Fonts: `Space Grotesk:wght@400;500;600;700`
- Use for: H1, H2, H3, logo text, category titles

**Body / UI: `Inter`**
- Google Fonts: `Inter:wght@300;400;500;600`
- Use for: Body text, labels, input fields, buttons, descriptions

**Numbers / Results: `JetBrains Mono`**
- Google Fonts: `JetBrains Mono:wght@400;600`
- Use for: Conversion result numbers, input values, exchange rate display

### Font Size Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| xs | 11px | 16px | 400 | Footnotes, timestamps |
| sm | 13px | 20px | 400 | Helper text, labels |
| base | 15px | 24px | 400 | Body text |
| md | 17px | 26px | 500 | UI labels, nav items |
| lg | 20px | 28px | 600 | Card titles |
| xl | 24px | 32px | 600 | Page headings (H3) |
| 2xl | 30px | 38px | 700 | Section headings (H2) |
| 3xl | 38px | 46px | 700 | Hero heading (H1) |
| result | 48px | 56px | 700 | Conversion result output |

### Typography Rules
- Never use font weights below 300
- Result numbers always use `JetBrains Mono` at 48px or larger
- Labels above inputs: Inter 13px, weight 500, color `#94A3B8`
- Do not use more than 2 font families on any single page

---

## Spacing System

All spacing values are multiples of **4px base unit**.

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Icon padding, tight gaps |
| space-2 | 8px | Inner padding small elements |
| space-3 | 12px | Compact list items |
| space-4 | 16px | Standard inner padding |
| space-5 | 20px | Between related elements |
| space-6 | 24px | Card padding |
| space-8 | 32px | Section gap |
| space-10 | 40px | Large section padding |
| space-12 | 48px | Hero sections |
| space-16 | 64px | Page-level vertical spacing |

---

## Border Radius

| Name | Value | Usage |
|------|-------|-------|
| radius-sm | 6px | Badges, tags, chips |
| radius-md | 10px | Input fields, small cards |
| radius-lg | 14px | Main cards, dropdowns |
| radius-xl | 20px | Modal windows, large cards |
| radius-full | 9999px | Pills, toggles, avatar |

---

## Elevation / Shadows

**Dark Mode:**
```
shadow-sm:  0 1px 3px rgba(0,0,0,0.4)
shadow-md:  0 4px 12px rgba(0,0,0,0.5)
shadow-lg:  0 8px 24px rgba(0,0,0,0.6)
shadow-glow: 0 0 20px rgba(37,99,235,0.3)
```

**Light Mode:**
```
shadow-sm:  0 1px 3px rgba(0,0,0,0.08)
shadow-md:  0 4px 12px rgba(0,0,0,0.12)
shadow-lg:  0 8px 24px rgba(0,0,0,0.16)
```

---

## Buttons

### Primary Button (CTA)
- Background: `#2563EB`
- Text: `#FFFFFF`, Inter, 15px, weight 600
- Padding: 12px / 24px
- Border radius: 10px
- Height: 44px | Min width: 120px
- Hover: `#1D4ED8`, transition 150ms ease
- Active: `#1E40AF`, scale 0.98
- Disabled: bg `#334155`, text `#64748B`, cursor not-allowed

### Secondary Button (Outline)
- Background: transparent
- Border: 1.5px solid `#2563EB`
- Text: `#2563EB`, Inter, 15px, weight 600
- Padding: 12px / 24px | Height: 44px
- Hover: Background `rgba(37,99,235,0.1)`

### Ghost Button
- Background: transparent | Border: none
- Text: `#94A3B8`, Inter, 14px, weight 500
- Hover: text `#FFFFFF`, bg `rgba(255,255,255,0.08)`

### Icon Button
- Size: 40x40px | Icon: 18x18px
- Background: `rgba(255,255,255,0.06)`
- Border radius: 10px
- Hover: bg `rgba(37,99,235,0.2)`

### Swap Button (Special)
- Size: 48x48px (circle)
- Background: `#2563EB`
- Icon: swap arrows (↕)
- Shadow: `shadow-glow`
- Hover: rotate icon 180°, transition 300ms ease
- Active: scale 0.94

---

## Input Fields

### Standard Input
- Height: 52px
- Background: `#1E293B` (dark) / `#F1F5F9` (light)
- Border: 1.5px solid `#334155` (dark) / `#CBD5E1` (light)
- Border radius: 10px
- Text: JetBrains Mono, 20px, weight 600
- Placeholder: Inter, 15px, `#475569`
- Padding: 0 16px
- Focus: border `#2563EB`, box-shadow `0 0 0 3px rgba(37,99,235,0.2)`
- Error: border `#EF4444`, box-shadow `0 0 0 3px rgba(239,68,68,0.2)`
- Disabled: opacity 0.5, cursor not-allowed

### Dropdown / Select
- Height: 52px — same styling as input
- Right chevron: 16x16px, `#94A3B8`
- Options panel: bg `#1E293B`, border `1.5px solid #334155`, radius 14px, max-height 300px
- Option height: 44px | padding: 0 16px
- Option hover: bg `rgba(37,99,235,0.15)`
- Option selected: bg `rgba(37,99,235,0.2)`, text `#2563EB`
- Currency dropdown: always has search field + flag icons (20x15px, rounded 2px)

---

## Cards

### Converter Card (Main)
- Background: `#1E293B` (dark) / `#FFFFFF` (light)
- Border: 1px solid `rgba(255,255,255,0.08)` (dark)
- Border radius: 20px | Padding: 32px
- Shadow: `shadow-lg` | Max width: 560px | Width: 100%

### Result Display Area
- Background: `rgba(37,99,235,0.08)`
- Border: 1.5px solid `rgba(37,99,235,0.3)`
- Border radius: 14px | Padding: 20px 24px
- Result: JetBrains Mono, 48px, weight 700, `#FFFFFF`
- Unit label: Inter, 16px, weight 500, `#94A3B8`

---

## Icons

- Library: **Lucide Icons** (lucide.dev)
- Sizes: 18px (UI), 20px (nav), 24px (section headers)
- Stroke width: 1.75px | Style: outline only (never filled)

### Icon Map
| Context | Lucide Icon |
|---------|-------------|
| Length | `ruler` |
| Weight | `scale` |
| Temperature | `thermometer` |
| Area | `square` |
| Volume | `flask-conical` |
| Speed | `gauge` |
| Currency | `coins` |
| Time | `clock` |
| Swap | `arrow-left-right` |
| Copy | `copy` |
| Favorites | `star` |
| History | `history` |
| Settings | `settings` |
| Search | `search` |
| Dark mode | `moon` |
| Light mode | `sun` |

---

## Navigation

### Top Bar
- Height: 64px | Background: `#0F172A` (dark) / `#FFFFFF` (light)
- Border bottom: `1px solid rgba(255,255,255,0.08)`
- Position: sticky top, z-index 100
- Backdrop filter: `blur(12px)`
- Left: Logo | Center: Category tabs | Right: Theme toggle

### Category Tabs
- Height: 36px | Padding: 0 16px
- Font: Inter, 14px, weight 500
- Inactive: `#94A3B8` | Active: `#FFFFFF`, border-bottom `2px solid #2563EB`, bg `rgba(37,99,235,0.2)`
- Hover: text `#FFFFFF`, bg `rgba(255,255,255,0.06)`

### Mobile Bottom Bar
- Height: 60px | Background: `#0F172A`
- Border top: `1px solid rgba(255,255,255,0.08)`
- Max 4 icons: Converter, History, Favorites, Settings
- Active icon: `#2563EB` | Inactive: `#475569`
- Label: Inter, 10px

---

## Layout & Grid

- Max content width: 1100px, centered
- Page padding: 24px (desktop) / 16px (tablet) / 12px (mobile)

### Breakpoints
| Name | Width |
|------|-------|
| mobile | < 640px |
| tablet | 640px – 1024px |
| desktop | > 1024px |

### Desktop Converter Layout
- Left (65%): Main converter card
- Right (35%): Quick reference, recent conversions, favorites

### Mobile Layout
- Single column, full width
- Converter card first, reference section below (collapsible)

---

## Animations & Transitions

- Global default: `transition: all 150ms ease`
- Result update: fade out (opacity 0, translateY -4px) → in (opacity 1, translateY 0), 200ms
- Swap rotation: 180°, 300ms, cubic-bezier(0.34, 1.56, 0.64, 1)
- Card entrance: opacity 0→1, translateY 12px→0, 400ms, stagger 80ms
- Dropdown: scaleY 0→1, 150ms ease-out
- Copy feedback: icon changes copy→check for 1500ms, green glow on result
- Theme toggle: 250ms ease on bg/color/border
- Max interaction duration: 500ms
- Always respect `prefers-reduced-motion`

---

## Theme Tokens

### Dark Mode
| Token | Value |
|-------|-------|
| bg-primary | `#0F172A` |
| bg-secondary | `#1E293B` |
| bg-tertiary | `#334155` |
| text-primary | `#F8FAFC` |
| text-secondary | `#94A3B8` |
| text-muted | `#475569` |
| border | `rgba(255,255,255,0.08)` |

### Light Mode
| Token | Value |
|-------|-------|
| bg-primary | `#F8FAFC` |
| bg-secondary | `#FFFFFF` |
| bg-tertiary | `#F1F5F9` |
| text-primary | `#0F172A` |
| text-secondary | `#475569` |
| text-muted | `#94A3B8` |
| border | `#E2E8F0` |

---

## Accessibility

- All interactive elements: visible focus state (3px outline, `#2563EB`)
- All icons: `aria-label` or `alt` text
- Minimum touch target: 44x44px on mobile
- Color must not be the sole indicator — pair with text/icon
- All inputs must have associated `<label>` elements
- Dropdowns: keyboard navigable (arrows, Enter, Escape)
- Contrast: 4.5:1 normal text, 3:1 large text (WCAG AA)

---

## Loading States

- Use **skeleton loaders** (not spinners) for content
- Skeleton color: `#334155` (dark) / `#E2E8F0` (light)
- Shimmer: gradient left→right, 1.5s infinite
- Rate loading: "Updating rates..." with dot pulse below result
- Spinner (button only): 16x16px, `#FFFFFF`

---

## Error & Empty States

- Input error: red border + Inter 12px `#EF4444` message below + `alert-circle` icon
- Rate unavailable: gray result area + "Rate unavailable. Check connection." + `wifi-off` icon
- Empty history: simple SVG + "No conversions yet. Start converting!"

---

## Do's and Don'ts

### Do ✅
- Use defined color palette exclusively
- Keep converter card centered and prominent
- Use JetBrains Mono for all numeric output
- Show unit name next to result at all times
- Provide one-click copy for results
- Convert in real-time on input change

### Don't ❌
- Never use rainbow or gradient text
- Never add unnecessary decorative illustrations
- Never place ads inside the main converter card
- Never use system default fonts
- Never place more than 2 CTAs on screen at once
- Never auto-submit — always real-time conversion
- Never use red for anything except errors and negative values
