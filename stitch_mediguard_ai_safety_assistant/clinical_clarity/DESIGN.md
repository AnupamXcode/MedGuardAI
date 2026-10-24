---
name: Clinical Clarity
colors:
  surface: '#eefdf8'
  surface-dim: '#ceddd8'
  surface-bright: '#eefdf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e8f7f2'
  surface-container: '#e2f1ec'
  surface-container-high: '#ddebe7'
  surface-container-highest: '#d7e6e1'
  on-surface: '#111e1b'
  on-surface-variant: '#3e4944'
  inverse-surface: '#263330'
  inverse-on-surface: '#e5f4ef'
  outline: '#6e7a74'
  outline-variant: '#bdc9c3'
  surface-tint: '#006b55'
  primary: '#00624d'
  on-primary: '#ffffff'
  primary-container: '#147d64'
  on-primary-container: '#c5ffe9'
  inverse-primary: '#7cd7ba'
  secondary: '#006b5e'
  on-secondary: '#ffffff'
  secondary-container: '#88f2de'
  on-secondary-container: '#006f62'
  tertiary: '#794d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#9a6300'
  on-tertiary-container: '#fff1e3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#98f4d5'
  primary-fixed-dim: '#7cd7ba'
  on-primary-fixed: '#002118'
  on-primary-fixed-variant: '#00513f'
  secondary-fixed: '#8bf5e1'
  secondary-fixed-dim: '#6dd8c5'
  on-secondary-fixed: '#00201b'
  on-secondary-fixed-variant: '#005046'
  tertiary-fixed: '#ffddb6'
  tertiary-fixed-dim: '#ffb959'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#643f00'
  background: '#eefdf8'
  on-background: '#111e1b'
  surface-variant: '#d7e6e1'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.005em
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an authoritative, reassuring, and hyper-legible interface tailored for critical healthcare decisions. Balancing acute pharmacological precision with empathetic warmth, the visual language avoids both the detached sterility of legacy clinical software and the casual levity of generic consumer wellness apps.

The aesthetic leans on **Modern Editorial Minimalism** fused with selective tactile depth. It incorporates pure white card structures set against soft organic canvases, razor-sharp typographic hierarchy, and restrained glassmorphic accents reserved strictly for transient overlays, status heads, and context banners. Soft 3D medical iconography and structural data visualizations communicate immediate clarity under high-cognitive-load scenarios. The emotional signature is calm confidence, life-critical reliability, and effortless navigational flow.

## Colors

The palette is engineered around clinical safety cues and rigorous contrast standards.

- **Primary Canvas (`#FAFCFA`)**: A restorative, tinted warm white that eliminates harsh ocular fatigue during extended diagnostic review.
- **Surface Pure (`#FFFFFF`)**: Pure white reserved for focal content containers, cards, and input panels to establish natural spatial separation without heavy ornamentation.
- **Deep Emerald (`#147D64`)**: The principal brand anchor. Represents clinical safety, deep-rooted authority, and decisive actions.
- **Fresh Teal (`#49B7A5`)**: Used for secondary interactive triggers, active navigation highlights, progress meters, and supplemental visual data paths.
- **Soft Mint (`#E8F6F0`)**: A tint-fill tone dedicated to positive outcome states, safe interaction tags, and subtle focus halos.
- **Neutral Deep Charcoal (`#24312E`)**: Dominant typography token, ensuring WCAG AAA legibility against white and mint backgrounds without the abrasive glare of pure `#000000`.
- **Secondary Neutral Slate (`#73817B`)**: Dedicated to metadata, secondary guidance, helper strings, and inactive states.
- **Pale Sage Border (`#E2EBE5`)**: Structural boundary lines providing crisp, non-distracting containment for tabular metrics and segmented layouts.
- **Warm Amber (`#E9A23B`)**: Distinct warning accent designating moderate interactions, monitoring requirements, and dosage notices.
- **Coral Red (`#D95757`)**: Urgent, high-risk contraindication token applied strictly to life-threatening interaction alerts and destructive confirmation gates.

## Typography

The typographic hierarchy implements **Plus Jakarta Sans** for headlines and titles to provide a sculptured, human-centered architectural presence, paired with **Inter** for dense pharmacological records, dosage calculations, and operational UI labels where absolute legibility and tabular numeral precision are mandatory.

- Never use all-caps for clinical descriptions, warning narratives, or patient guidance; reserve full-capitalization strictly for abbreviated compound codes or micro status markers via `label-sm`.
- Quantitative values, metric units, dosage tables, and lab figures must activate tabular numbers (`tnum`) through OpenType font features to ensure scannable vertical alignment across medication lists.
- Line heights are intentionally generous across the body tiers to prevent misinterpretation of adjacent lines when reading multi-drug contraindication reports.

## Layout & Spacing

The layout is built upon an adaptive 12-column fluid grid system across desktop viewpoints, transitioning to an 8-column layout on tablet devices, and a 4-column layout on mobile viewports.

- **Desktop (1200px and up)**: 12 columns, `margin` of `2.5rem`, `gutter` of `1.5rem`. Maximum layout canvas is constrained to 1440px for editorial reading comfort.
- **Tablet (768px – 1199px)**: 8 columns, `margin` of `1.5rem`, `gutter` of `1rem`. Secondary analytical sidebars collapse into contextual slide-over trays or lower stacked groups.
- **Mobile (below 768px)**: 4 columns, `margin-mobile` of `1rem`, `gutter-mobile` of `1rem`. Multi-column interaction tables convert to singular linear risk-tier cards.

Spacing rhythms derive exclusively from an 8pt base unit. Component interiors favor open spatial breathing room around key diagnostic outputs, reducing stress during clinical evaluation.

## Elevation & Depth

Visual hierarchy is maintained primarily through structured tonal layering, supplemented by soft ambient light physics and targeted glassmorphism:

1. **Base Layer (Level 0)**: The main application canvas (`#FAFCFA`). Flush, matte, zero elevation.
2. **Surface Layer (Level 1)**: Primary cards, patient dossiers, and modular metrics panels sit on pure `#FFFFFF`, bounded by a single 1px hairline border (`#E2EBE5`). Soft ambient drop: `0px 2px 12px -2px rgba(36, 49, 46, 0.04)`.
3. **Elevated Content (Level 2)**: Active drag items, flyout suggestions, and hover-state risk cards rely on an intensified, diffused shadow: `0px 8px 24px -4px rgba(20, 125, 100, 0.06), 0px 2px 6px -1px rgba(36, 49, 46, 0.03)`.
4. **Transient Floating Layer (Level 3)**: Modals, dose confirmation prompts, and floating risk alert bars leverage subtle frosted glass: background `rgba(255, 255, 255, 0.88)` with `backdrop-filter: blur(12px)` and a crisp outer border of `rgba(226, 235, 229, 0.60)`. Shadow: `0px 20px 32px -8px rgba(36, 49, 46, 0.10)`.

Dark, high-contrast, muddy drop shadows are strictly prohibited to preserve the luminous health-tech aesthetic.

## Shapes

The design system employs **Roundedness Level 2** to convey modern approachability without compromising enterprise precision:

- Standard input fields, action buttons, and individual line items apply `0.5rem` (`8px`) corner radius.
- Cards, patient record panels, and analytical insight blocks adopt `1rem` (`16px`) corner radius, delivering an inviting, contemporary silhouette.
- Modals, large interactive summaries, and persistent safety banner containers feature `1.5rem` (`24px`).
- Badges, risk category pills, and drug classification tags use fully rounded pill shapes (`9999px`) to maintain clear visual distinction from operational card surfaces.

## Components

### Buttons
- **Primary**: Solid Deep Emerald (`#147D64`) background, pure white text, font `label-lg`, height 44px, radius `0.5rem`. On hover: transition to `#0E634F` with subtle ambient lift (`0 4px 12px rgba(20, 125, 100, 0.2)`).
- **Secondary**: Crisp white background, 1px border in `#E2EBE5`, text in `#147D64`. On hover: background shifts to `#E8F6F0` with border shifting to `#49B7A5`.
- **Destructive/Critical**: Soft coral background (`rgba(217, 87, 87, 0.10)`), text in `#D95757`, border in `rgba(217, 87, 87, 0.20)`. Used for clearing regimen or dismissing high-risk warnings.

### Badges & Risk Severity Chips
Pill-shaped containers (`height: 24px`, padding `0 10px`, font `label-sm`), featuring deliberate semantic coloring:
- **Safe / Compatible**: `#E8F6F0` background, `#147D64` text, no border.
- **Moderate Warning**: Soft amber background (`rgba(233, 162, 59, 0.12)`), `#A66A13` text, border `1px solid rgba(233, 162, 59, 0.3)`.
- **High-Risk Contraindication**: Soft coral background (`rgba(217, 87, 87, 0.12)`), `#B83232` text, border `1px solid rgba(217, 87, 87, 0.35)`. Accompanied by a bold 12px alert symbol prefix.

### Cards
- Surface is pure `#FFFFFF` with an outer border of `1px solid #E2EBE5`, corner radius of `16px`, and Level 1 elevation.
- Internal padding adheres strictly to `space-lg` (`1.5rem`).
- Header areas feature `title-md` titles, paired with secondary metadata (`body-sm` in `#73817B`). 
- Interactive cards include a micro-transition on hover: `translateY(-2px)` and Level 2 elevation shadow tinting.

### Input Fields & Drug Search Selectors
- Height 48px, background `#FFFFFF`, border `1px solid #E2EBE5`, radius `0.5rem`, padding horizontal `space-md`.
- Typography: `body-md` in `#24312E` with placeholder text in `#73817B`.
- Focus state: border color transitions to Deep Emerald (`#147D64`) with a soft glow ring: `0 0 0 3px rgba(20, 125, 100, 0.15)`.
- Integrated autocomplete dropdowns leverage Level 3 frosted glass surfaces with smooth highlighting in `#E8F6F0`.

### Checkboxes & Radios
- Size: 18px by 18px.
- Unchecked: `#FFFFFF` surface with `1.5px solid #E2EBE5`.
- Checked: `#147D64` fill with pure white clinical checkmark or center pip. Focus ring mirrors input glow.

### Lists & Drug Interaction Matrices
- Table headers use `#FAFCFA` surface, `label-md` in `#73817B`, with a 1px bottom border in `#E2EBE5`.
- List rows feature 56px minimum touch targets, alternating subtle divider lines, and active background transitions to `#FAFCFA` upon hover.

### Specialized Component: Interaction Pathway Graph
- Visual connection nodes between two or more drugs utilize `#E2EBE5` linking paths that illuminate into `#D95757` (High Risk) or `#49B7A5` (Safe) with directional pulsing micro-animations when an interaction is selected.