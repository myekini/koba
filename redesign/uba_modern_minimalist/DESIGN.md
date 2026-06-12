---
name: UBA Modern Minimalist
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5d3f3c'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#926f6a'
  outline-variant: '#e7bdb7'
  surface-tint: '#c00010'
  primary: '#a8000c'
  on-primary: '#ffffff'
  primary-container: '#d31118'
  on-primary-container: '#ffe5e2'
  inverse-primary: '#ffb4ab'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#525252'
  on-tertiary: '#ffffff'
  tertiary-container: '#6a6a6a'
  on-tertiary-container: '#ecebeb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#930009'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1b1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  section-gap: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style
This design system is anchored in the philosophy of "Radical Clarity." For a pan-African banking leader like UBA, the interface must balance institutional trust with the frictionless speed of modern fintech. The brand personality is precise, transparent, and approachable.

The aesthetic follows a **Modern Corporate** style with heavy leanings toward **Minimalism**. By stripping away non-functional decorative elements and relying on a disciplined color palette, the design system ensures that the user's financial data remains the primary focus. High-quality whitespace is treated as a functional tool to reduce cognitive load during complex banking tasks. The emotional response is one of calm control and reliability.

## Colors
The palette is intentionally restrained to emphasize the UBA brand identity through strategic placement. 

- **Primary (UBA Red):** Reserved exclusively for high-priority calls to action (CTAs), critical status indicators, and subtle branding touchpoints. 
- **Primary Text (Charcoal):** Used for all headings and primary body copy to ensure high contrast and readability.
- **Neutrals:** A range of light greys defines the structural skeleton of the interface. This includes subtle borders to separate content without creating visual noise and soft background washes to distinguish different functional containers.
- **Background:** A pure white base is mandatory to maintain the minimalist, clean aesthetic and maximize the "pop" of the red accent.

## Typography
This design system utilizes **Hanken Grotesk** for its contemporary, sharp, and highly legible characteristics. The typographic hierarchy is designed to guide the eye through financial statements and transaction histories with ease.

Large display sizes are used sparingly for account balances, while labels use a slightly heavier weight and increased letter spacing to ensure clarity at small sizes. Generous line height is applied across all body text to prevent dense "blocks" of information, maintaining the minimalist feel even in data-heavy views. On mobile devices, headline sizes should scale down by roughly 20% to maintain screen real estate while preserving the relative hierarchy.

## Layout & Spacing
The layout follows a **Fixed Grid** model for desktop (centered 1200px container) and a **Fluid Grid** for mobile devices. A strict 8px spatial scale governs all padding and margin decisions.

- **Desktop:** 12-column grid with 24px gutters.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

Information is grouped into logical sections with wide gaps (40px+) to distinguish between different banking modules (e.g., separating "Account Summary" from "Quick Actions"). Alignment is strictly left-heavy for readability, with financial figures right-aligned for easy decimal comparison in tables.

## Elevation & Depth
Depth in this design system is achieved through **Ambient Shadows** and **Tonal Layers** rather than heavy gradients. 

- **Surface Levels:** The primary background is white (Level 0). Cards and containers sitting on this background use a subtle 1px border (`#E5E5E5`) and a very soft, diffused shadow (Offset: 0, 4px; Blur: 20px; Opacity: 4% Black).
- **Interactions:** When a user interacts with a card or button, the shadow should slightly increase in spread to provide tactile feedback, mimicking the object lifting off the page.
- **Modals:** Use a semi-transparent white backdrop blur (8px) to maintain context while focusing the user on the task at hand.

## Shapes
The shape language is defined by modern, oversized radii to soften the corporate nature of banking. 

Standard containers, such as account cards and transaction modules, utilize a **16px (1rem)** corner radius. Larger components like dashboard "hero" sections or modal containers may use up to **24px (1.5rem)** to emphasize their containment. Buttons follow a similar logic, utilizing a 12px or fully pill-shaped radius depending on their hierarchy level. This consistency in rounding creates a cohesive, "friendly-yet-professional" interface.

## Components

- **Buttons:** 
  - *Primary:* Solid UBA Red background, white text, 12px radius. 
  - *Secondary:* Ghost style with a light grey border and charcoal text. 
- **Cards:** White backgrounds with a 1px border in `#E5E5E5`. The "Account Card" should feature the balance in `headline-lg` with the UBA Red accent used only for the "Transfer" or "Pay" action.
- **Input Fields:** Minimalist design with a 1px bottom border by default, transitioning to a full 1px charcoal outline on focus. Labels sit above the input in `label-md`.
- **Transaction Lists:** Clean rows with ample vertical padding (16px). Use charcoal for the merchant name and a lighter grey for the date/category.
- **Status Indicators:** Small, circular dots or subtle pill-shaped chips. Success uses green, while alerts/warnings use the UBA Red.
- **Progress Bars:** Thin 4px tracks in light grey with the active progress in UBA Red. Use for savings goals or spending limits.