# Requirements Document

## Introduction

The TADS 1K Challenge is a high-intensity, 90-day financial sprint landing page built with a "Cyber-Industrial Maximalism" design language. The page serves as both a marketing surface and a functional mini-application where users can register for the challenge, track financial milestones, and submit proof of progress. The aesthetic deliberately evokes a high-stakes hacking terminal crossed with a luxury trading floor — heavy neon, aggressive motion, and relentless visual energy. The frontend is built with Next.js, Framer Motion, and Lucide-React.

---

## Glossary

- **Page**: The TADS 1K Challenge Next.js web application.
- **User**: A visitor who registers for or participates in the challenge.
- **Navbar**: The floating glass navigation bar fixed at the top of the viewport.
- **Entry_Terminal**: The registration form component styled as a Linux terminal prompt.
- **Dashboard**: The Milestone Command Center — the authenticated user's progress view.
- **Milestone_Card**: A single card in the Dashboard representing one financial goal.
- **Evidence_Vault**: The drag-and-drop proof upload component.
- **Proof_File**: An image file (screenshot) dropped into the Evidence_Vault.
- **Hex_Log**: The scrolling fake hexadecimal log displayed during proof verification animation.
- **Glitch_Effect**: A CSS/Framer Motion animation that distorts an element's visual appearance briefly on hover.
- **Scanline_Overlay**: A full-viewport CSS pseudo-element that renders horizontal CRT scanlines over all content.
- **CRT_Flicker**: A periodic brightness/opacity animation applied to Milestone_Cards simulating a CRT monitor.
- **Magnetic_Button**: A button whose position shifts slightly toward the cursor on hover.
- **Status**: The state of a Milestone_Card — one of `PENDING` or `VERIFIED`.

---

## Requirements

### Requirement 1: Brand Header

**User Story:** As a visitor, I want to immediately understand the challenge's identity and tone, so that I know what I'm signing up for before scrolling.

#### Acceptance Criteria

1. THE Page SHALL render the title "TADS 1K CHALLENGE" in all-caps, bold, monospaced typography with a neon green (`#39FF14`) text-glow CSS effect.
2. THE Page SHALL render the tagline "Industrialize your hustle. Three months. One thousand dollars. Zero excuses." directly beneath the title in monospaced font.
3. THE Page SHALL apply the Scanline_Overlay as a fixed, full-viewport pseudo-element with reduced opacity so underlying content remains legible.
4. THE Page SHALL use `#000000` as the base background color throughout all sections.
5. THE Page SHALL use `#39FF14` (Cyber Lime) and `#FF5F1F` (Alert Orange) as the only accent colors for interactive and decorative elements.
6. THE Page SHALL use a monospaced font (JetBrains Mono or Space Mono) as the sole typeface for all text content.

---

### Requirement 2: Animated Background

**User Story:** As a visitor, I want the background to feel alive and reactive, so that the page communicates high energy from the moment it loads.

#### Acceptance Criteria

1. THE Page SHALL render a moving matrix-style grid or grain-textured gradient as the full-viewport background layer beneath all content.
2. WHEN the User moves the mouse, THE Page SHALL shift the background gradient or grid offset in response to the cursor's X/Y position.
3. THE Page SHALL animate the background continuously at a frame rate that does not drop below 30fps on a mid-range desktop device.
4. WHILE the background animation is active, THE Page SHALL ensure all foreground text maintains a contrast ratio of at least 4.5:1 against the animated background.

---

### Requirement 3: Navbar

**User Story:** As a visitor, I want a persistent navigation bar, so that I can jump to any section of the page without scrolling back to the top.

#### Acceptance Criteria

1. THE Navbar SHALL be fixed to the top of the viewport and remain visible during scroll.
2. THE Navbar SHALL apply a glassmorphism style: semi-transparent background with a `backdrop-filter: blur` effect and a 4px solid `#39FF14` bottom border.
3. WHEN the Page first loads, THE Navbar SHALL animate into view by sliding down from above the viewport with an elastic bounce easing curve.
4. THE Navbar SHALL contain navigation links to the Entry_Terminal section, the Dashboard section, and the Evidence_Vault section.
5. WHEN a Navbar link is clicked, THE Page SHALL smoothly scroll to the corresponding section.

---

### Requirement 4: Entry Terminal (Registration)

**User Story:** As a visitor, I want to register for the challenge through a form that matches the terminal aesthetic, so that the sign-up experience feels immersive and on-brand.

#### Acceptance Criteria

1. THE Entry_Terminal SHALL render as a component styled to resemble a Linux terminal window, including a title bar with mock window-control dots and a terminal prompt prefix (e.g., `> _`) on each input field.
2. THE Entry_Terminal SHALL contain input fields for: Username, Email Address, and a "Commit to Challenge" submit button.
3. WHEN an input field receives focus, THE Entry_Terminal SHALL apply a neon green (`#39FF14`) glowing border animation to that field.
4. WHEN the focus leaves an input field, THE Entry_Terminal SHALL remove the glowing border and revert to the default 4px solid border style.
5. THE Entry_Terminal submit button SHALL use the Magnetic_Button style: on cursor hover within a 60px radius, the button SHALL translate toward the cursor position by up to 8px.
6. WHEN the submit button is hovered, THE Entry_Terminal SHALL apply the Glitch_Effect animation to the button label.
7. WHEN the User submits the form with an empty required field, THE Entry_Terminal SHALL display an inline error message in `#FF5F1F` (Alert Orange) beneath the offending field without navigating away from the page.
8. WHEN the User submits the form with valid data, THE Entry_Terminal SHALL display a confirmation message styled as a terminal success output (e.g., `[OK] Registration committed.`).

---

### Requirement 5: Milestone Command Center (Dashboard)

**User Story:** As a registered User, I want to track my financial milestones in a dashboard, so that I can monitor my progress toward the $1,000 goal over 90 days.

#### Acceptance Criteria

1. THE Dashboard SHALL render a vertical list of Milestone_Cards connected by "Industrial Pipe" styled vertical lines between each card.
2. THE Dashboard SHALL display an "Add Milestone" button above the Milestone_Card list.
3. WHEN the "Add Milestone" button is clicked, THE Dashboard SHALL trigger a heavy mechanical entrance animation (visual only — no audio) for the new Milestone_Card, building the card's content line-by-line.
4. WHEN the "Add Milestone" button is hovered, THE Dashboard SHALL apply the Glitch_Effect to the button label.
5. WHEN the "Add Milestone" button is hovered, THE Dashboard SHALL apply the Magnetic_Button behavior to the button.
6. EACH Milestone_Card SHALL display: Goal Title, Target Date, and Status (one of `PENDING` or `VERIFIED`).
7. WHEN a Milestone_Card enters the viewport during scroll, THE Dashboard SHALL animate the card by building its content line-by-line using a staggered reveal animation.
8. WHILE a Milestone_Card is visible, THE Dashboard SHALL apply the CRT_Flicker animation to the card at a periodic interval between 4 and 8 seconds.
9. WHEN a Milestone_Card's Status is `PENDING`, THE Dashboard SHALL render the Status badge in `#FF5F1F` (Alert Orange).
10. WHEN a Milestone_Card's Status is `VERIFIED`, THE Dashboard SHALL render the Status badge in `#39FF14` (Cyber Lime).
11. THE Dashboard SHALL use Lucide-React icons for all iconographic elements within Milestone_Cards (e.g., calendar icon for Target Date, check/clock icon for Status).

---

### Requirement 6: Evidence Vault (Proof Upload)

**User Story:** As a registered User, I want to upload screenshot proof of my financial progress, so that my milestones can be verified.

#### Acceptance Criteria

1. THE Evidence_Vault SHALL render a drag-and-drop zone styled with a "Top Secret" aesthetic: dashed 4px border, bold warning typography, and a Lucide-React upload icon.
2. WHILE no Proof_File has been detected in the drop zone, THE Evidence_Vault SHALL pulse its border color between `#FF5F1F` (Alert Orange) and transparent on a 1-second cycle.
3. WHEN a Proof_File is dragged over the Evidence_Vault drop zone, THE Evidence_Vault SHALL highlight the drop zone with a solid `#39FF14` border to indicate an active drop target.
4. WHEN a Proof_File is dropped onto the Evidence_Vault, THE Evidence_Vault SHALL transition the border color to `#39FF14` (Cyber Lime) and begin the verification animation sequence.
5. WHEN the verification animation sequence begins, THE Evidence_Vault SHALL display a "Verifying Data..." label, a fake progress bar that fills from 0% to 100% over 3 seconds, and a scrolling Hex_Log panel beneath the progress bar.
6. WHEN the fake progress bar reaches 100%, THE Evidence_Vault SHALL display a confirmation message styled as a terminal success output (e.g., `[OK] Proof committed to vault.`).
7. THE Evidence_Vault SHALL accept image files with MIME types `image/png`, `image/jpeg`, and `image/webp`.
8. IF a dropped file has a MIME type other than `image/png`, `image/jpeg`, or `image/webp`, THEN THE Evidence_Vault SHALL display an error message in `#FF5F1F` and reset the drop zone to its default pulsing state.
9. THE Evidence_Vault SHALL also support file selection via a standard file-picker input as a fallback to drag-and-drop.

---

### Requirement 7: Global Interaction Effects

**User Story:** As a visitor, I want every interactive element to respond with dramatic visual feedback, so that the page feels alive and high-stakes at all times.

#### Acceptance Criteria

1. THE Page SHALL apply the Glitch_Effect on hover to every button element on the page.
2. THE Page SHALL apply the Magnetic_Button behavior on hover to every primary call-to-action button on the page.
3. THE Page SHALL render thick 4px solid borders on all card and container elements using either `#39FF14` or `#FF5F1F` as the border color.
4. THE Page SHALL apply glassmorphism styling (semi-transparent background + `backdrop-filter: blur`) to all card and panel components.
5. WHEN the Page first loads, THE Page SHALL animate all above-the-fold content into view using Framer Motion entrance animations with staggered delays between elements.
6. THE Page SHALL use Framer Motion for all animations defined in this document; CSS-only animations are permitted only for the Scanline_Overlay and CRT_Flicker effects.

---

### Requirement 8: Responsiveness and Accessibility

**User Story:** As a User on any device, I want the page to be usable and readable, so that I can register and track milestones from a phone or tablet.

#### Acceptance Criteria

1. THE Page SHALL render a single-column layout on viewports narrower than 768px.
2. THE Page SHALL render a multi-column layout on viewports 768px and wider where the design benefits from additional horizontal space.
3. THE Page SHALL ensure all interactive elements have a minimum touch target size of 44×44px.
4. THE Page SHALL provide `aria-label` attributes on all icon-only buttons and interactive elements that lack visible text labels.
5. THE Page SHALL ensure all form inputs in the Entry_Terminal have associated `<label>` elements or `aria-label` attributes.
6. WHEN the User activates keyboard navigation (Tab key), THE Page SHALL display a visible focus indicator on the currently focused element using a `#39FF14` outline.
7. WHERE the User has enabled the `prefers-reduced-motion` OS setting, THE Page SHALL disable or reduce all Framer Motion animations and CSS keyframe animations to simple opacity fades.
