# Implementation Tasks

## Task List

- [x] 1. Project Scaffolding & Design Tokens
  - [x] 1.1 Bootstrap a Next.js 14 (App Router) project with TypeScript and Tailwind CSS
  - [x] 1.2 Install dependencies: `framer-motion`, `lucide-react`, `react-hook-form`, `fast-check`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jest-axe`
  - [x] 1.3 Load JetBrains Mono (or Space Mono) via `next/font` in `app/layout.tsx` and apply it as the global font
  - [x] 1.4 Create `lib/constants.ts` with `COLORS`, `ANIMATION`, and `BREAKPOINTS` design tokens as defined in the design document
  - [x] 1.5 Create `lib/types.ts` with `Milestone`, `RegistrationFormValues`, `VaultState`, and `AcceptedMimeType` types
  - [x] 1.6 Create `lib/animations.ts` with shared Framer Motion variants (entrance, glitch, stagger)
  - [x] 1.7 Configure `tailwind.config.ts` to extend the theme with custom colors (`cyberLime`, `alertOrange`, `voidBlack`) and the monospaced font family
  - [x] 1.8 Add global CSS to `app/globals.css`: Tailwind base layers, scanline keyframe, CRT flicker keyframe, and neon glow text-shadow utility class

- [x] 2. Validation Logic & Property-Based Tests
  - [x] 2.1 Create `lib/validation.ts` with `validateEmail(s: string): boolean`, `validateRequired(s: string): boolean`, and `validateMimeType(s: string): boolean` pure functions
  - [x] 2.2 Write property-based tests (fast-check) for Property 1: valid emails accepted, invalid rejected
  - [x] 2.3 Write property-based tests (fast-check) for Property 2: whitespace-only strings rejected by `validateRequired`
  - [x] 2.4 Write property-based tests (fast-check) for Property 3: only `image/png`, `image/jpeg`, `image/webp` accepted by `validateMimeType`
  - [x] 2.5 Run all PBT tests and confirm they pass (minimum 100 iterations each)

- [x] 3. Shared Primitive Components
  - [x] 3.1 Create `components/shared/GlitchText.tsx` — wraps children in a Framer Motion element that applies a glitch distortion animation on hover (translate X jitter + opacity flicker)
  - [x] 3.2 Create `components/shared/MagneticButton.tsx` — tracks cursor proximity via `mousemove` event, translates the button toward the cursor up to `maxShift` px within `radius` px; translation magnitude must never exceed `maxShift`
  - [x] 3.3 Write property-based tests (fast-check) for Property 4: MagneticButton translation magnitude ≤ `maxShift` for all cursor positions within radius
  - [x] 3.4 Create `components/shared/ScanlineOverlay.tsx` — fixed full-viewport `div` with a CSS `::before` pseudo-element rendering horizontal scanlines via `repeating-linear-gradient`; pointer-events disabled, `z-index: 9999`, reduced opacity
  - [x] 3.5 Write unit tests for `MagneticButton` translation clamping and `GlitchText` render

- [ ] 4. Animated Background
  - [x] 4.1 Create a `useMousePosition` hook in `lib/hooks/useMousePosition.ts` that tracks the cursor's X/Y coordinates via a `mousemove` event listener and returns them as reactive state
  - [x] 4.2 Create `components/background/AnimatedBackground.tsx` — fixed full-viewport layer (`z-index: -1`) rendering a matrix-style grid using CSS `background-image` with a `linear-gradient` grid pattern
  - [x] 4.3 Wire the `useMousePosition` hook into `AnimatedBackground` and shift the grid offset using a Framer Motion `useSpring`-smoothed transform so the background reacts to mouse movement
  - [x] 4.4 Ensure the background animation runs continuously and the component cleans up its event listeners on unmount

- [ ] 5. Navbar
  - [x] 5.1 Create `components/navbar/Navbar.tsx` with `position: fixed`, `top: 0`, full-width, glassmorphism styles (semi-transparent background, `backdrop-filter: blur(12px)`), and a 4px solid `#39FF14` bottom border
  - [x] 5.2 Add navigation anchor links to `#entry-terminal`, `#dashboard`, and `#evidence-vault` sections; implement smooth scroll via `scrollIntoView({ behavior: 'smooth' })`
  - [x] 5.3 Implement the elastic bounce entrance animation using Framer Motion `motion.nav` with `initial={{ y: -100 }}`, `animate={{ y: 0 }}`, and a spring easing with `stiffness: 300, damping: 20`
  - [x] 5.4 Write a snapshot test confirming the Navbar renders all three navigation links

- [ ] 6. Brand Header
  - [x] 6.1 Create `components/header/BrandHeader.tsx` rendering the title "TADS 1K CHALLENGE" with the neon green glow CSS class and the tagline beneath it
  - [x] 6.2 Apply staggered Framer Motion entrance animations to the title and tagline (title first, tagline after a 0.2s delay)
  - [x] 6.3 Write a snapshot test confirming the title and tagline text render correctly

- [ ] 7. Entry Terminal (Registration Form)
  - [x] 7.1 Create `components/entry-terminal/TerminalInput.tsx` — an input field with a terminal prompt prefix (`> _`), default 4px solid border, and a Framer Motion `animate` that applies a `#39FF14` box-shadow glow on focus and removes it on blur
  - [x] 7.2 Create `components/entry-terminal/EntryTerminal.tsx` — terminal window chrome (title bar with three mock window-control dots, monospaced font), containing two `TerminalInput` fields (Username, Email) and a `MagneticButton` submit button wrapped in `GlitchText`
  - [x] 7.3 Wire React Hook Form into `EntryTerminal` using `validateRequired` and `validateEmail` from `lib/validation.ts`; display inline error messages in `#FF5F1F` beneath each field on validation failure
  - [x] 7.4 On successful form submission, replace the form with a terminal success message: `[OK] Registration committed.` styled in `#39FF14`
  - [x] 7.5 Add `id="entry-terminal"` to the section wrapper for Navbar anchor linking
  - [x] 7.6 Ensure all inputs have associated `<label>` elements or `aria-label` attributes; add `aria-label` to the submit button
  - [x] 7.7 Write unit tests: empty fields show errors, valid submission shows confirmation, focus applies glow, blur removes glow

- [ ] 8. Milestone Command Center (Dashboard)
  - [x] 8.1 Create `components/dashboard/MilestoneCard.tsx` — glassmorphism card with 4px solid border, displaying Goal Title, Target Date (with Lucide `Calendar` icon), and Status badge (with Lucide `CheckCircle` or `Clock` icon); Status badge color is `#39FF14` for `VERIFIED` and `#FF5F1F` for `PENDING`
  - [x] 8.2 Implement the scroll-triggered line-by-line build animation on `MilestoneCard` using Framer Motion `whileInView` with a staggered `variants` object that reveals each field sequentially
  - [x] 8.3 Implement the CRT flicker effect on `MilestoneCard` using a CSS keyframe animation (`@keyframes crtFlicker`) applied via a `useEffect` that sets a random interval between 4000ms and 8000ms
  - [x] 8.4 Create `components/dashboard/AddMilestoneButton.tsx` — a `MagneticButton` wrapping `GlitchText`; on click, adds a new `Milestone` object (with generated UUID, empty title, today's date, `PENDING` status) to the parent's state and triggers a mechanical entrance animation on the new card
  - [x] 8.5 Create `components/dashboard/Dashboard.tsx` — manages `milestones` state via `useState<Milestone[]>`; renders `AddMilestoneButton` above a vertical list of `MilestoneCard` components connected by "Industrial Pipe" vertical lines (a centered `div` with a `#39FF14` left border)
  - [x] 8.6 Add `id="dashboard"` to the section wrapper for Navbar anchor linking
  - [x] 8.7 Write unit tests: clicking "Add Milestone" adds a card with `PENDING` status; `PENDING` badge is orange; `VERIFIED` badge is lime green

- [x] 9. Evidence Vault (Proof Upload)
  - [x] 9.1 Create `components/evidence-vault/HexLog.tsx` — a fixed-height scrollable panel that generates and appends random hex strings every 100ms when `isActive` is true; auto-scrolls to the bottom on each new line
  - [x] 9.2 Create `components/evidence-vault/ProgressBar.tsx` — a Framer Motion `motion.div` that animates `width` from `0%` to `100%` over `duration` seconds using a linear easing; calls `onComplete` when the animation finishes
  - [x] 9.3 Create `components/evidence-vault/EvidenceVault.tsx` with `VaultState` managed via `useState`; render the drop zone with dashed 4px border, Lucide `Upload` icon, and "TOP SECRET" warning typography
  - [x] 9.4 Implement the idle pulsing border animation: CSS `@keyframes pulse` alternating the border color between `#FF5F1F` and transparent on a 1-second cycle; active when `vaultState === 'idle'`
  - [x] 9.5 Implement drag-and-drop event handlers (`onDragOver`, `onDragLeave`, `onDrop`): set state to `'drag-over'` on drag-over (solid `#39FF14` border), validate MIME type on drop using `validateMimeType`, transition to `'verifying'` on valid file or `'error'` on invalid
  - [x] 9.6 Implement the verification animation sequence: when `vaultState === 'verifying'`, render "Verifying Data..." label, `ProgressBar` (3-second duration), and `HexLog`; on `ProgressBar` `onComplete`, transition to `'success'` and display `[OK] Proof committed to vault.`
  - [x] 9.7 Implement the error state: display error message in `#FF5F1F`, then reset to `'idle'` after 2 seconds
  - [x] 9.8 Add a hidden `<input type="file" accept="image/png,image/jpeg,image/webp">` as a fallback file picker, triggered by a "Browse Files" button
  - [x] 9.9 Add `id="evidence-vault"` to the section wrapper for Navbar anchor linking
  - [x] 9.10 Write unit tests: valid image drop triggers verification sequence; invalid file type shows error and resets; file picker accepts same MIME types

- [x] 10. Page Assembly & Global Effects
  - [x] 10.1 Assemble `app/page.tsx` composing all section components in order: `AnimatedBackground`, `ScanlineOverlay`, `Navbar`, `BrandHeader`, `EntryTerminal`, `Dashboard`, `EvidenceVault`
  - [x] 10.2 Wrap above-the-fold content in a Framer Motion `AnimatePresence` block with staggered entrance animations (0.1s delay between each element)
  - [x] 10.3 Add a `useReducedMotion()` hook from Framer Motion in `app/layout.tsx` or a global provider; pass a `reducedMotion` flag to all animated components so they fall back to simple opacity fades when `prefers-reduced-motion: reduce` is set
  - [x] 10.4 Verify all card and container elements have 4px solid borders in `#39FF14` or `#FF5F1F` and glassmorphism styling
  - [x] 10.5 Verify all primary CTA buttons use both `GlitchText` and `MagneticButton` wrappers

- [x] 11. Responsiveness & Accessibility
  - [x] 11.1 Apply Tailwind responsive classes to ensure single-column layout below `768px` and multi-column layout at `md:` breakpoint and above for the Dashboard and any side-by-side sections
  - [x] 11.2 Ensure all interactive elements have a minimum touch target size of `44×44px` (use `min-h-[44px] min-w-[44px]` Tailwind classes)
  - [x] 11.3 Add `aria-label` attributes to all icon-only buttons (e.g., the "Add Milestone" button icon, the file picker trigger)
  - [x] 11.4 Add a global focus style in `globals.css`: `*:focus-visible { outline: 2px solid #39FF14; outline-offset: 2px; }`
  - [x] 11.5 Run `jest-axe` accessibility audit on the full page render and fix any reported WCAG 2.1 AA violations

- [x] 12. Final Verification
  - [x] 12.1 Run the full test suite (`vitest run`) and confirm all unit tests, PBT tests, and accessibility tests pass
  - [x] 12.2 Manually verify the page in a browser at 1440px and 375px viewports: confirm all animations fire, drag-and-drop works, form validation works, and the aesthetic matches the "Cyber-Industrial Maximalism" brief
  - [x] 12.3 Verify `prefers-reduced-motion` behavior by enabling the OS setting and confirming animations reduce to opacity fades
