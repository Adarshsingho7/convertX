# System Instructions: ConvertX — Unit & Currency Converter

## Project Overview

Build a **ConvertX** web application — a fast, clean, student-friendly unit and currency converter. The app allows users to instantly convert values across different unit categories and live currency exchange rates. The UI defaults to dark mode, follows the ConvertX Brand Guidelines exactly, and is designed to be used daily by students and professionals.

The app is hosted online and built using **Antigravity (Google)** as the development and hosting platform.

---

## Navigation Structure

### Top Navigation Bar
- ConvertX logo (left)
- Category tabs (center on desktop, scrollable on mobile)
- Dark/Light mode toggle (right)

### Category Tabs (in order)
- Currency
- Length
- Weight / Mass
- Temperature
- Area
- Volume
- Speed
- Time

### Mobile Bottom Navigation
- Converter (home icon)
- History (history icon)
- Favorites (star icon)
- Settings (settings icon)

---

## Pages & Sections

---

### 1. Converter Page (Main / Home)

This is the default landing page. It shows the active converter based on the selected category tab.

#### Layout
- Desktop: Two-column layout (65% converter card | 35% sidebar)
- Mobile: Single column, stacked

#### Main Converter Card

**Input Section (Top)**
- Label above: category name + unit type (e.g., "From — Meter")
- Unit dropdown (full width): searchable, shows unit name + abbreviation
- Value input field: large, real-time, JetBrains Mono font, numeric keyboard on mobile

**Swap Button (Center)**
- Circular blue button between the two input sections
- On click: swaps the From and To units AND their values
- Animated rotation 180° on click

**Output Section (Bottom)**
- Label above: "To — Kilometer"
- Unit dropdown (full width)
- Result display area: read-only styled box
  - Shows result number (JetBrains Mono 48px)
  - Shows full unit name beside it
  - Copy icon button (top right of result box) — copies result to clipboard
  - On copy: icon changes to checkmark for 1.5 seconds

**Below the converter card (inside card, smaller)**
- "1 [From Unit] = [X] [To Unit]" — quick exchange rate reference line
- For currency: "Last updated: [time]" timestamp

#### Sidebar (Desktop only)

**Quick Reference Panel**
- Shows top 5 common conversions for the current category
- Example for Length: 1 mile = 1.609 km, 1 inch = 2.54 cm, etc.
- Click any row to auto-fill the converter

**Recent Conversions**
- Shows last 5 conversions done in this session
- Format: "100 km → 62.14 miles — [time ago]"
- Click to re-use
- Clear history button at bottom

**Favorites**
- Starred unit pairs saved by user
- Star icon to add/remove current pair from favorites
- Shows saved favorites list

---

### 2. History Page

- Full list of all conversions done (session + local storage)
- Grouped by date: Today, Yesterday, This Week
- Each row: [Value] [From Unit] → [Result] [To Unit] | [Category] | [Time]
- Search bar to filter history
- Clear all button (with confirmation prompt)
- Export to CSV button (downloads history as .csv file)

---

### 3. Favorites Page

- Grid of saved unit pairs (from/to)
- Each card: Category icon + "Meter → Kilometer" + last used value
- Click card: opens that converter pre-filled
- Remove button (X) on each card
- Empty state: "No favorites yet. Star a conversion to save it here."

---

### 4. Settings Page

- **Theme:** Dark / Light / System toggle (3 options)
- **Default Category:** Dropdown to pick which category opens first
- **Currency Update Frequency:** Every 1 hour / Every 6 hours / Manual only
- **Number Format:** 1,000.00 (comma) / 1.000,00 (period) / 1000.00 (none)
- **Decimal Places:** 2 / 4 / 6 / 8 (dropdown)
- **Clear All Data:** Button to wipe history and favorites (with confirmation)
- **About ConvertX:** Version info, credits

---

## Unit Categories & Units

### Currency
- Use live exchange rate API (frankfurter.app — free, no key needed)
- Endpoint: `https://api.frankfurter.app/latest?base=USD`
- Show 30+ major currencies with country flag emoji
- Currencies to include (minimum):
  USD, EUR, GBP, INR, JPY, CAD, AUD, CHF, CNY, SGD, AED, SAR, MYR, HKD, NZD, SEK, NOK, DKK, ZAR, BRL, MXN, KRW, THB, IDR, PKR, BDT, EGP, TRY, RUB, PLN
- Show currency name + code + flag emoji in dropdown

### Length
Meter (m), Kilometer (km), Centimeter (cm), Millimeter (mm), Micrometer (µm), Nanometer (nm), Mile (mi), Yard (yd), Foot (ft), Inch (in), Nautical Mile (nmi), Light Year (ly)

### Weight / Mass
Kilogram (kg), Gram (g), Milligram (mg), Microgram (µg), Metric Ton (t), Pound (lb), Ounce (oz), Stone (st), Imperial Ton, US Ton, Carat (ct)

### Temperature
Celsius (°C), Fahrenheit (°F), Kelvin (K), Rankine (°R)
- Note: Temperature uses formulas, not a simple multiplier

### Area
Square Meter (m²), Square Kilometer (km²), Square Centimeter (cm²), Square Millimeter (mm²), Hectare (ha), Square Mile (mi²), Square Yard (yd²), Square Foot (ft²), Square Inch (in²), Acre

### Volume
Liter (L), Milliliter (mL), Cubic Meter (m³), Cubic Centimeter (cm³), Cubic Millimeter (mm³), Gallon (US), Gallon (UK), Quart (US), Pint (US), Cup (US), Fluid Ounce (US), Tablespoon, Teaspoon, Cubic Inch, Cubic Foot

### Speed
Meter per second (m/s), Kilometer per hour (km/h), Mile per hour (mph), Knot (kn), Foot per second (ft/s), Mach (at sea level)

### Time
Second (s), Millisecond (ms), Microsecond (µs), Nanosecond (ns), Minute (min), Hour (hr), Day, Week, Month (30 days), Year (365 days), Decade, Century

---

## Conversion Logic

### Unit Conversion Approach
- Store all units with a **base unit conversion factor** (e.g., all lengths convert via meters)
- Formula: `result = (inputValue * fromFactor) / toFactor`
- Temperature exception: use explicit formulas (C→F: multiply by 9/5 then add 32, etc.)

### Currency Conversion Approach
- Fetch rates from frankfurter.app API on page load
- Cache rates in localStorage with timestamp
- Recalculate based on user settings (refresh frequency)
- Formula: `result = inputValue * (toRate / fromRate)` using USD as base

### Real-Time Conversion
- Convert on every keystroke — no submit button needed
- If input is empty or 0: show 0 in result
- If input is invalid (letters, symbols): show input error state, no crash

### Precision
- Default: 4 decimal places
- User can change in settings (2 / 4 / 6 / 8)
- Very small numbers use scientific notation automatically (e.g., 2.34e-9)
- Never show more than 10 significant digits

---

## Data Storage (localStorage)

### Keys to store:
```
convertx_theme            — "dark" | "light" | "system"
convertx_defaultCategory  — category name string
convertx_decimalPlaces    — number (2,4,6,8)
convertx_numberFormat     — "comma" | "period" | "none"
convertx_currencyRates    — JSON object of rates
convertx_ratesTimestamp   — ISO timestamp string
convertx_rateFrequency    — "1h" | "6h" | "manual"
convertx_history          — JSON array of conversion objects
convertx_favorites        — JSON array of favorite pairs
convertx_lastCategory     — last used category tab
convertx_lastFrom         — last used "from" unit
convertx_lastTo           — last used "to" unit
```

### History Item Object:
```json
{
  "id": "uuid-string",
  "category": "Length",
  "fromUnit": "Meter",
  "fromUnitSymbol": "m",
  "toUnit": "Kilometer",
  "toUnitSymbol": "km",
  "inputValue": 1000,
  "resultValue": 1,
  "timestamp": "2025-01-01T10:30:00Z"
}
```

### Favorite Item Object:
```json
{
  "id": "uuid-string",
  "category": "Currency",
  "fromUnit": "USD",
  "toUnit": "INR",
  "addedAt": "2025-01-01T10:30:00Z"
}
```

---

## Error Handling

### Network Error (currency fetch)
- Show banner: "Using cached rates from [timestamp]. Connect to update."
- Still allow conversion using cached rates
- If no cache exists: disable currency tab, show "Internet required for currency conversion"

### Invalid Input
- Letters or special characters in input: show red border + message "Please enter a number"
- Extremely large numbers (>1e15): allow but show warning "Result may lose precision"
- Division by zero or undefined conversion: show "Conversion not available"

### API Failure
- Log error to console
- Show user-friendly message, never show raw error object to user
- Retry button for currency refresh

---

## Responsiveness Requirements

### Mobile (< 640px)
- Converter card: full width, 16px horizontal padding
- Input and dropdowns: full width, height 52px
- Result number: 36px (reduced from 48px desktop)
- Swap button: 44x44px
- Category tabs: horizontally scrollable, no wrapping
- Bottom navigation bar: fixed, 60px height
- Sidebar hidden on mobile (history/favorites accessible via bottom nav)
- Font size minimum: 13px

### Tablet (640px–1024px)
- Single column layout
- Converter card: max-width 500px, centered
- No bottom nav — use top tabs
- Sidebar shown as collapsible panel below converter

### Desktop (> 1024px)
- Two-column layout
- Sidebar always visible
- Hover states fully active

---

## Performance Requirements

- First paint: under 2 seconds on 4G
- All unit data: stored in JS constants (no API needed except currency)
- Lazy load: sidebar content (history/favorites) loads after converter renders
- Images: none (use SVG icons only)
- No heavy libraries — avoid jQuery, lodash
- Use vanilla JS or lightweight framework as supported by Antigravity

---

## Accessibility Requirements

- All inputs: associated `<label>` tags
- All icon buttons: `aria-label` attribute
- Focus ring visible on all interactive elements
- Tab order logical: input → dropdown → swap → output → copy
- Escape key closes any open dropdown
- Arrow keys navigate dropdown options
- Screen reader: result area has `aria-live="polite"` so it announces updates

---

## SEO & Meta Tags

```html
<title>ConvertX — Fast Unit & Currency Converter</title>
<meta name="description" content="Convert units and currencies instantly. Length, weight, temperature, area, volume, speed, time, and 30+ live currencies. Free, fast, and ad-free.">
<meta name="keywords" content="unit converter, currency converter, length converter, weight converter, temperature converter, free converter">
<meta property="og:title" content="ConvertX — Fast Unit & Currency Converter">
<meta property="og:description" content="Convert anything instantly. Free, fast, student-friendly.">
<meta name="theme-color" content="#0F172A">
<link rel="icon" href="/favicon.ico">
```

---

## File & Folder Structure

```
convertx/
├── index.html              — Main HTML entry point
├── favicon.ico             — "X" icon mark, 32x32px
├── brandGuidelines.md      — Full UI/brand specification
├── gemini.md               — This system instructions file
├── css/
│   ├── main.css            — Global styles, CSS variables, reset
│   ├── components.css      — Buttons, inputs, cards, dropdowns
│   ├── layout.css          — Grid, navigation, responsive breakpoints
│   └── animations.css      — All keyframes and transitions
├── js/
│   ├── app.js              — Main app init, routing between tabs
│   ├── converter.js        — Core conversion logic and formulas
│   ├── units.js            — All unit data (categories, factors, names)
│   ├── currency.js         — Currency API fetch, cache, conversion
│   ├── history.js          — History read/write localStorage
│   ├── favorites.js        — Favorites read/write localStorage
│   ├── settings.js         — Settings read/write localStorage
│   ├── ui.js               — DOM helpers, dropdowns, theme toggle
│   └── utils.js            — Formatting, number precision, UUID gen
└── assets/
    └── icons/              — SVG icon files (if not using CDN)
```

---

## CSS Variables (Full List)

```css
:root {
  /* Colors - Dark Mode (default) */
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-tertiary: #334155;
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted: #475569;
  --border: rgba(255, 255, 255, 0.08);
  --border-strong: #334155;
  --accent: #2563EB;
  --accent-hover: #1D4ED8;
  --accent-active: #1E40AF;
  --accent-subtle: rgba(37, 99, 235, 0.15);
  --success: #22C55E;
  --error: #EF4444;
  --warning: #F59E0B;
  --purple: #8B5CF6;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.5);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.6);
  --shadow-glow: 0 0 20px rgba(37,99,235,0.3);

  /* Typography */
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Layout */
  --max-width: 1100px;
  --nav-height: 64px;
  --bottom-nav-height: 60px;
  --card-max-width: 560px;
}

[data-theme="light"] {
  --bg-primary: #F8FAFC;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #F1F5F9;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #94A3B8;
  --border: #E2E8F0;
  --border-strong: #CBD5E1;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.12);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.16);
}
```

---

## External Dependencies

| Dependency | Purpose | URL |
|------------|---------|-----|
| Space Grotesk | Display font | Google Fonts |
| Inter | UI font | Google Fonts |
| JetBrains Mono | Numbers font | Google Fonts |
| Lucide Icons | Icon library | https://unpkg.com/lucide@latest |
| Frankfurter API | Live currency rates | https://api.frankfurter.app |

No other external libraries. No jQuery. No Bootstrap.

---

## Key Behaviors Summary

1. App opens on **Currency converter** by default (most popular)
2. Last used category, from/to units, and input value are **remembered on reload**
3. Conversion happens **instantly on keystroke**
4. Currency rates are **cached in localStorage**, refreshed per user settings
5. Theme is **remembered across sessions**
6. History stores last **50 conversions** max (drop oldest when limit hit)
7. Favorites max: **20 pairs**
8. Copy to clipboard works with **one click** on result
9. Swap button animates and **swaps both units and values**
10. All errors are **handled gracefully** — app never crashes on bad input
