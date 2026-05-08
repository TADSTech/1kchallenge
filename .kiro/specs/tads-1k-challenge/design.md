# Design Document

## Overview

The TADS 1K Challenge is a Next.js 14 (App Router) single-page application that functions as both a marketing landing page and a lightweight interactive mini-app. The page is built around a "Cyber-Industrial Maximalism" design language: black backgrounds, neon green and alert orange accents, monospaced typography, heavy Framer Motion animations, and CRT-era visual effects.

The application has no persistent backend — all state (milestone list, registration confirmation, proof upload status) is managed client-side in React component state. The page is structured as a series of full-width sections stacked vertically, each corresponding to a major feature area: Brand Header, Animated Background, Navbar, Entry Terminal, Milestone Command Center, and Evidence Vault.

**Key technology choices:**
- **Next.js 14 (App Router)** — framework, routing, and SSR/SSG
- **Framer Motion** — all interactive and entrance animations
- **Lucide-React** — icon library for all iconographic elements
- **Tailwind CSS** — utility-first styling with custom design tokens
- **JetBrains Mono / Space Mono** — monospaced typeface loaded via `next/font`
- **React Hook Form** — form state management and validation for the Entry Terminal
- **TypeScript** — type safety throughout

---

## Architecture

The application is a single Next.js page (`app/page.tsx`) that composes all section components. There is no routing between pages. All state is local to each section component; no global state manager is needed.

```
app/
  page.tsx                  ← Root page, composes all sections
  layout.tsx                ← Root layout: font loading, global CSS, metadata
  globals.css               ← Tailwind base, custom CSS (scanlines, CRT flicker)

components/
  navbar/
    Navbar.tsx
  header/
    BrandHeader.tsx
  background/
    AnimatedBackground.tsx
  entry-terminal/
    EntryTerminal.tsx
    TerminalInput.tsx
    MagneticButton.tsx
  dashboard/
    Dashboard.tsx
    MilestoneCard.tsx
    AddMilestoneButton.tsx
  evidence-vault/
    EvidenceVault.tsx
    HexLog.tsx
    ProgressBar.tsx
  shared/
    GlitchText.tsx          ← Reusable glitch animation wrapper
    MagneticButton.tsx      ← Reusable magnetic button wrapper
    ScanlineOverlay.tsx     ← Fixed viewport scanline pseudo-element

lib/
  constants.ts              ← Color tokens, animation durations, breakpoints
  types.ts                  ← Shared TypeScript types
  validation.ts             ← Form and file validation logic (pure functions)
  animations.ts             ← Shared Framer Motion variants
```

### Data Flow

```
page.tsx
  ├── AnimatedBackground   (no props, self-contained, mouse tracking via useMousePosition hook)
  ├── ScanlineOverlay      (no props, pure CSS)
  ├── Navbar               (no props, scroll-to-section via anchor IDs)
  ├── BrandHeader          (no props, static content)
  ├── EntryTerminal        (no props, internal form state via React Hook Form)
  ├── Dashboard            (milestones: Milestone[], setMilestones via useState)
  └── EvidenceVault        (no props, internal upload state)
```

---

## Components and Interfaces

### `AnimatedBackground`

Renders a full-viewport canvas or CSS gradient layer. Tracks mouse position via a `useMousePosition` hook and shifts the gradient offset in response. Runs a `requestAnimationFrame` loop to maintain continuous animation.

```typescript
// No props — self-contained
export function AnimatedBackground(): JSX.Element
```

**Implementation note:** Uses a CSS `radial-gradient` with a `transform: translate()` driven by mouse coordinates, wrapped in a `motion.div` for smooth interpolation. The gradient is rendered as a fixed `position: fixed` element behind all content (`z-index: -1`).

### `ScanlineOverlay`

A pure CSS component — a `div` with a `::before` pseudo-element that renders horizontal scanlines using a `repeating-linear-gradient`. Fixed to the viewport, pointer-events disabled, `z-index: 9999`.

```typescript
export function ScanlineOverlay(): JSX.Element
```

### `Navbar`

Fixed top navigation bar with glassmorphism styling. Animates in on mount with a spring-based slide-down. Contains anchor links that trigger smooth scroll.

```typescript
export function Navbar(): JSX.Element
```

**Sections linked:** `#entry-terminal`, `#dashboard`, `#evidence-vault`

### `BrandHeader`

Static section rendering the challenge title and tagline with neon glow text effects.

```typescript
export function BrandHeader(): JSX.Element
```

### `EntryTerminal`

Registration form styled as a Linux terminal window. Manages form state via React Hook Form.

```typescript
interface EntryTerminalFormValues {
  username: string;
  email: string;
}

export function EntryTerminal(): JSX.Element
```

**Sub-components:**
- `TerminalInput` — a single input field with terminal prompt prefix and focus glow animation
- `MagneticButton` — the submit button with magnetic hover behavior

### `Dashboard`

Manages the list of milestones in local state. Renders `MilestoneCard` components connected by pipe-styled vertical lines.

```typescript
export function Dashboard(): JSX.Element
```

### `MilestoneCard`

Displays a single milestone. Animates in when entering the viewport via Framer Motion `whileInView`. Applies CRT flicker via a CSS keyframe animation on a periodic interval.

```typescript
interface MilestoneCardProps {
  milestone: Milestone;
}

export function MilestoneCard({ milestone }: MilestoneCardProps): JSX.Element
```

### `EvidenceVault`

Drag-and-drop file upload zone. Manages upload state internally.

```typescript
type VaultState = 'idle' | 'drag-over' | 'verifying' | 'success' | 'error';

export function EvidenceVault(): JSX.Element
```

### `GlitchText`

Reusable wrapper that applies the Glitch_Effect animation on hover to its children.

```typescript
interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GlitchText({ children, className }: GlitchTextProps): JSX.Element
```

### `MagneticButton`

Reusable wrapper that tracks cursor proximity and translates the button toward the cursor within a configurable radius.

```typescript
interface MagneticButtonProps {
  children: React.ReactNode;
  radius?: number;       // default: 60
  maxShift?: number;     // default: 8 (px)
  className?: string;
  onClick?: () => void;
}

export function MagneticButton(props: MagneticButtonProps): JSX.Element
```

### `HexLog`

Scrolling panel of fake hexadecimal lines, auto-scrolled during the verification animation.

```typescript
interface HexLogProps {
  isActive: boolean;
}

export function HexLog({ isActive }: HexLogProps): JSX.Element
```

### `ProgressBar`

Animated progress bar that fills from 0% to 100% over a configurable duration.

```typescript
interface ProgressBarProps {
  duration: number;  // seconds
  onComplete: () => void;
}

export function ProgressBar({ duration, onComplete }: ProgressBarProps): JSX.Element
```

---

## Data Models

### `Milestone`

```typescript
interface Milestone {
  id: string;           // UUID, generated client-side
  title: string;        // Goal title
  targetDate: string;   // ISO date string (YYYY-MM-DD)
  status: 'PENDING' | 'VERIFIED';
}
```

### `RegistrationFormValues`

```typescript
interface RegistrationFormValues {
  username: string;   // required, non-empty
  email: string;      // required, valid email format
}
```

### `VaultState`

```typescript
type VaultState = 'idle' | 'drag-over' | 'verifying' | 'success' | 'error';
```

### `AcceptedMimeType`

```typescript
const ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
type AcceptedMimeType = typeof ACCEPTED_MIME_TYPES[number];
```

### Design Tokens (constants.ts)

```typescript
export const COLORS = {
  background: '#000000',
  cyberLime: '#39FF14',
  alertOrange: '#FF5F1F',
} as const;

export const ANIMATION = {
  crtFlickerMinInterval: 4000,  // ms
  crtFlickerMaxInterval: 8000,  // ms
  verificationDuration: 3,      // seconds
  magneticRadius: 60,           // px
  magneticMaxShift: 8,          // px
} as const;

export const BREAKPOINTS = {
  mobile: 768,  // px — single-column below this
} as const;
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Valid email addresses are accepted, invalid ones are rejected

*For any* string, the email validation function SHALL return `true` if and only if the string matches a valid email format (contains exactly one `@`, a non-empty local part, and a non-empty domain with at least one `.`).

**Validates: Requirements 4.7**

### Property 2: Empty and whitespace-only inputs are rejected

*For any* string composed entirely of whitespace characters (spaces, tabs, newlines), the form field validation SHALL reject it as empty and return a validation error.

**Validates: Requirements 4.7**

### Property 3: Accepted MIME types are allowed, all others are rejected

*For any* file MIME type string, the file validation function SHALL return `true` if and only if the MIME type is one of `image/png`, `image/jpeg`, or `image/webp`.

**Validates: Requirements 6.7, 6.8**

### Property 4: Magnetic button translation stays within bounds

*For any* cursor position within the magnetic radius, the computed button translation SHALL have a magnitude no greater than `maxShift` pixels in any direction.

**Validates: Requirements 4.5, 7.2**

---

## Error Handling

### Form Validation Errors

- Empty required fields: inline error message in `#FF5F1F` rendered beneath the offending field via React Hook Form's `errors` object
- Invalid email format: same inline error treatment
- Errors are cleared when the field value changes and re-validated on blur and submit

### File Upload Errors

- Invalid MIME type: `VaultState` transitions to `'error'`, error message displayed in `#FF5F1F`, drop zone resets to `'idle'` pulsing state after a 2-second delay
- No server errors to handle — all processing is client-side

### Animation Failures

- All Framer Motion animations are wrapped in `AnimatePresence` where appropriate
- `prefers-reduced-motion` is respected via a `useReducedMotion()` hook from Framer Motion; when active, all motion variants fall back to simple opacity transitions
- The `requestAnimationFrame` loop in `AnimatedBackground` is cleaned up on component unmount via `useEffect` cleanup

### Accessibility Fallbacks

- All icon-only buttons have `aria-label` attributes
- All form inputs have associated `<label>` elements
- Focus indicators use a `#39FF14` outline with sufficient contrast
- Keyboard navigation is fully supported; the magnetic button effect is mouse-only and does not interfere with keyboard interaction

---

## Testing Strategy

### PBT Applicability Assessment

This feature is primarily a UI rendering and animation application. The vast majority of requirements describe visual appearance, animation behavior, and layout — none of which are suitable for property-based testing. However, there are two pure logic modules that benefit from property-based testing:

1. **`lib/validation.ts`** — email validation and file MIME type validation are pure functions with large input spaces where property-based testing adds real value
2. **`MagneticButton` translation math** — the clamping logic is a pure function testable with PBT

All other requirements (animations, layout, glassmorphism, CRT effects, drag-and-drop UI states) are best covered by snapshot tests, visual regression tests, and example-based unit tests.

**Property-based testing library:** [fast-check](https://github.com/dubzzz/fast-check) (TypeScript-native, well-maintained, integrates with Vitest/Jest)

### Unit Tests (Vitest + React Testing Library)

**`lib/validation.ts`**
- Email validation: valid formats accepted, invalid formats rejected (example-based)
- Whitespace-only strings rejected as empty
- MIME type validation: accepted types pass, all others fail

**`components/entry-terminal/EntryTerminal.tsx`**
- Submitting with empty fields shows inline error messages
- Submitting with valid data shows confirmation message
- Focus on input applies glow class; blur removes it

**`components/evidence-vault/EvidenceVault.tsx`**
- Dropping a valid image file triggers verification animation sequence
- Dropping an invalid file type shows error message and resets state
- File picker input accepts same MIME types as drag-and-drop

**`components/dashboard/Dashboard.tsx`**
- Clicking "Add Milestone" adds a new card to the list
- New milestone card has `PENDING` status by default
- `PENDING` status badge renders in `#FF5F1F`
- `VERIFIED` status badge renders in `#39FF14`

**`components/shared/MagneticButton.tsx`**
- Translation magnitude never exceeds `maxShift` for any cursor position within radius

### Property-Based Tests (fast-check, minimum 100 iterations each)

**Feature: tads-1k-challenge, Property 1: Valid email addresses are accepted, invalid ones are rejected**
- Generate arbitrary strings; verify that `validateEmail(s)` returns `true` iff the string matches the email pattern
- Generate valid email-shaped strings; verify all are accepted

**Feature: tads-1k-challenge, Property 2: Empty and whitespace-only inputs are rejected**
- Generate strings composed entirely of whitespace characters (`\s+`); verify all are rejected by `validateRequired`
- Generate non-empty, non-whitespace strings; verify all are accepted

**Feature: tads-1k-challenge, Property 3: Accepted MIME types are allowed, all others are rejected**
- Generate arbitrary MIME type strings; verify `validateMimeType(s)` returns `true` iff `s` is in `['image/png', 'image/jpeg', 'image/webp']`

**Feature: tads-1k-challenge, Property 4: Magnetic button translation stays within bounds**
- Generate arbitrary cursor positions (x, y) and button center positions; verify the computed translation vector magnitude ≤ `maxShift`

### Snapshot Tests (Vitest + React Testing Library)

- `BrandHeader` renders title and tagline correctly
- `Navbar` renders all three navigation links
- `MilestoneCard` renders goal title, target date, and status badge for both `PENDING` and `VERIFIED` states
- `EvidenceVault` renders in idle state with upload icon and warning typography

### Visual Regression Tests (Playwright or Storybook + Chromatic — optional)

- Full-page screenshot at 1440px viewport
- Full-page screenshot at 375px viewport (mobile single-column)
- Navbar glassmorphism appearance
- Entry Terminal terminal window appearance

### Accessibility Tests (axe-core via jest-axe)

- No WCAG 2.1 AA violations on the full page render
- All form inputs have accessible labels
- All icon-only buttons have `aria-label` attributes
- Focus indicators are visible

### `prefers-reduced-motion` Tests

- When `prefers-reduced-motion: reduce` is set, Framer Motion animations use opacity-only variants
- CRT flicker and scanline CSS animations are disabled or reduced
