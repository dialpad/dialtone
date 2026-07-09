---
title: Visual Changes for Designers
description: What changed visually in Dialtone Next, what should look identical, and how to tell an intended change from a migration bug during design QA.
status: ready
---

This guide is for **designers and QA reviewing product surfaces that migrated to Dialtone Next**. It shows every visual change that is intentional, lists what must look identical, and catalogs the problems that have actually come up during migrations — so you can tell a refresh from a regression before filing a bug.

> [!WARNING] Do not QA against the Figma library
> The DT9 Component Library in Figma has **not** been updated to Dialtone Next visuals. Comparing a migrated screen against Figma will flag intentional changes as bugs. The reference is this guide plus the running Next build.

The quick triage flow:

1. Something looks different → check [the refresh](#one-token-every-page) and [redesigned components](#redesigned-components) below. If it's listed, it's intentional — no ticket needed.
2. Not listed there → check [what must look identical](#what-must-look-identical). If it's on that list, any visible difference **is** a bug.
3. Still unsure → check [problems we've actually seen](#problems-weve-actually-seen) for the symptom, then [file it](#how-to-review-and-file) under your team's migration epic.

## One token, every page

The changes in this section need **no product code change to appear** — a token value changed, so every page shifts at once. They are the most common source of false bug reports: the whole app looks nudged, and it's supposed to.

### Body text is bigger (and headlines smaller)

The type scale was rebuilt. Default body text grows from 15px to 16px — this alone touches virtually every screen. Mid sizes shift slightly (19→20px, 27→26px) and the largest headline shrinks from 38px to 32px. Input text grows from 12px to 14px.

<before-after
  before="/assets/images/migration-visual/token-type-scale-before-light.png"
  after="/assets/images/migration-visual/token-type-scale-after-light.png"
  alt="Type scale specimen showing measured pixel sizes per token stop"
/>

Expect: text wraps differently, rows get slightly taller, dense layouts breathe differently. This is correct. Text that becomes **clipped or truncated** because a fixed-height container didn't accommodate the new size is worth flagging.

### Neutrals are warm now

Pure grays are gone. Page backgrounds, cards, borders, and gray text all pick up a faint warm "sandstone" cast, in both light and dark mode, and some grays lighten slightly.

<before-after
  before="/assets/images/migration-visual/token-neutrals-before-light.png"
  after="/assets/images/migration-visual/token-neutrals-after-light.png"
  alt="Neutral surfaces, borders, and text colors in light mode"
/>

<before-after
  before="/assets/images/migration-visual/token-neutrals-before-dark.png"
  after="/assets/images/migration-visual/token-neutrals-after-dark.png"
  alt="Neutral surfaces, borders, and text colors in dark mode"
/>

Expect: the whole UI feels slightly warmer/creamier. A surface that changes **hue entirely** (e.g. gray to blue) is not part of this.

### Base colors were re-tuned, not just renamed

Blues rotate toward indigo, greens move from lime toward emerald, warning golds get warmer and deeper. Brand purple buttons and critical reds were deliberately kept visually stable.

<before-after
  before="/assets/images/migration-visual/token-color-ramps-before-light.png"
  after="/assets/images/migration-visual/token-color-ramps-after-light.png"
  alt="Base color ramps for purple, blue, green, red, and gold"
/>

Expect: charts, tags, and accents using base colors look *slightly* different by design. Status colors also shift: positives are mintier, warnings warmer, dark-mode criticals softer. An element that **loses its color entirely** (transparent, or inheriting a parent color) is a bug — see [problems](#problems-weve-actually-seen).

### Focus rings are a deeper blue

Every focused control shows a more saturated, slightly darker blue ring, in both modes.

<before-after
  before="/assets/images/migration-visual/token-focus-ring-before-light.png"
  after="/assets/images/migration-visual/token-focus-ring-after-light.png"
  alt="Focus ring color on a button, an input, and an icon button"
/>

### Overlays are lighter than the page in dark mode

Modals, popovers, toasts, and menus now sit on a dedicated overlay surface. In light mode the difference is barely perceptible; in dark mode overlay panels are **clearly lighter than the page behind them** — elevation expressed through color. This is the single most-reported "looks like a bug" change.

<before-after
  before="/assets/images/migration-visual/token-overlay-surface-before-dark.png"
  after="/assets/images/migration-visual/token-overlay-surface-after-dark.png"
  alt="Page surface versus overlay surface in dark mode"
/>

### Disabled controls change their translucency treatment

Disabled controls let the background show through on both versions — the pair below renders on a gradient precisely so you can see it. What changes in Next: the fade is now a **desaturating color-mix** rather than a plain opacity drop, so disabled fills read lighter and grayer, and input surfaces shift from fully transparent to a frosted translucent white (DLT-3446).

<before-after
  before="/assets/images/migration-visual/token-disabled-states-before-light.png"
  after="/assets/images/migration-visual/token-disabled-states-after-light.png"
  alt="Enabled and disabled buttons and inputs over a gradient backdrop"
/>

### A few fixed sizes move by 4–16px

Nine legacy size tokens have no exact match in the new layout scale, so **when a surface is migrated** its fixed dimensions shift to the nearest stop — sidebars, panels, and modals move by 4–16px (old size in gray, new in purple, to scale below). These small moves are sanctioned; see the [full table](/guides/migration/layout-and-spacing-tokens/) for every mapping. Note that un-migrated code keeps rendering the old sizes — the deprecated tokens still resolve for now — so this shift marks *migrated* surfaces, not broken ones.

<dt-box surface="secondary" border-width="100" border-color="subtle" border-radius="400" padding="300">
  <img :src="$withBase('/assets/images/migration-visual/token-size-shifts-after-light.png')" alt="To-scale bars comparing each legacy size token to its nearest layout token, with the pixel delta" class="d-d-block d-w100p">
</dt-box>

## Redesigned components

These components changed on purpose (each links back to its ticket or engineering guide).

### Buttons

Squarer corners (8px→6px radius), label weight drops from semibold to medium, adjusted label sizes, softer outlined borders, and slightly darker primary hover/active states (DLT-2946). Grouped buttons pick up the same restyle (DLT-2947) — the pair below includes a button group.

<before-after
  before="/assets/images/migration-visual/component-button-before-light.png"
  after="/assets/images/migration-visual/component-button-after-light.png"
  alt="Button kinds and importance levels"
/>

### Tabs

Selected/hover colors are re-mapped, and the selected-tab indicator now **slides** between tabs instead of jumping (DLT-3292–3294). The animation isn't visible in a static image — watch for it in the product.

<before-after
  before="/assets/images/migration-visual/component-tabs-before-light.png"
  after="/assets/images/migration-visual/component-tabs-after-light.png"
  alt="Tab group with a selected tab"
/>

### Segmented control

A brand-new component (DLT-413) — anywhere you see it is new UI, with no "before" to compare against.

<dt-box surface="secondary" border-width="100" border-color="subtle" border-radius="400" padding="300" class="d-wmx60p">
  <img :src="$withBase('/assets/images/migration-visual/component-segmented-control-after-light.png')" alt="Segmented control, new in Dialtone Next" class="d-d-block d-w100p">
</dt-box>

### Filter pill

Also new as a core component (DLT-2941; previously only recipe pills existed). Filter pills come with a dropdown single-select, an apply/cancel footer for deferred selection, and a read-only state — all new affordances you'll see appear in filter bars.

<dt-box surface="secondary" border-width="100" border-color="subtle" border-radius="400" padding="300" class="d-wmx60p">
  <img :src="$withBase('/assets/images/migration-visual/component-filter-pill-after-light.png')" alt="Filter pill with dropdown and read-only variant, new in Dialtone Next" class="d-d-block d-w100p">
</dt-box>

### Avatars

Redesigned color system (12 hue families, deterministically assigned per person), and **group avatars render at their real size** instead of being forced tiny. Count badges cap at "9+" on small sizes. Group avatars looking noticeably larger than before is expected (DLT-2942, [guide](/guides/migration/avatar-updates/)).

<before-after
  before="/assets/images/migration-visual/component-avatar-before-light.png"
  after="/assets/images/migration-visual/component-avatar-after-light.png"
  alt="Single avatar, seeded avatar colors, and a group avatar"
/>

### Chips

Display-only chips no longer look clickable — no hover state, no pointer cursor. Only chips explicitly marked interactive keep the button affordance (DLT-3195, [guide](/guides/migration/chip-interactive/)). A chip that **should** be clickable but looks dead means the migration missed the opt-in — that's a bug.

<before-after
  before="/assets/images/migration-visual/component-chip-before-light.png"
  after="/assets/images/migration-visual/component-chip-after-light.png"
  alt="Display chip, interactive chip, and chip with close button"
/>

### Inputs and validation messages

Input text grows to 14px. Validation messages keep their severity icons and gain a new blue **info** variant (DLT-3422, DLT-3423) — and the severity words themselves changed: `error` is now `critical`, `success` is now `positive`, with the same colors. The pairs below show each side rendering its own vocabulary.

<before-after
  before="/assets/images/migration-visual/component-input-before-light.png"
  after="/assets/images/migration-visual/component-input-after-light.png"
  alt="Inputs with info, warning, and critical validation states"
/>

<before-after
  before="/assets/images/migration-visual/component-validation-before-light.png"
  after="/assets/images/migration-visual/component-validation-after-light.png"
  alt="Validation messages across severities including the new info variant"
/>

### Checkboxes and radios

New control drawing and label typography set with DtText (DLT-2949). States (checked, disabled) read the same — the geometry and text metrics shift.

<before-after
  before="/assets/images/migration-visual/component-checkbox-radio-before-light.png"
  after="/assets/images/migration-visual/component-checkbox-radio-after-light.png"
  alt="Checkbox states and a radio group"
/>

### Select menus

Restyled in the same pass as inputs (DLT-2959): control height, label typography, and menu text follow the new type scale.

<before-after
  before="/assets/images/migration-visual/component-select-before-light.png"
  after="/assets/images/migration-visual/component-select-after-light.png"
  alt="Select menus with label and description"
/>

### Notices

Same palette intent, refreshed typography. Two kind names changed — `success` is now `positive` and `error` is now `critical` — with identical colors. In the pair below, each side styles the name it knows; an unstyled gray notice in the product means an un-migrated kind name.

<before-after
  before="/assets/images/migration-visual/component-notice-before-light.png"
  after="/assets/images/migration-visual/component-notice-after-light.png"
  alt="Notice kinds including the renamed success/positive and error/critical"
/>

### Banners and toasts

Restyled alongside notices (DLT-2944): stronger info-blue tints, DtText typography, and toasts gain the leading kind icon and larger radius.

<before-after
  before="/assets/images/migration-visual/component-banner-toast-before-light.png"
  after="/assets/images/migration-visual/component-banner-toast-after-light.png"
  alt="Info banner and info toast"
/>

### Breadcrumbs

Typography and separator treatment updated with the refresh (DLT-2945).

<before-after
  before="/assets/images/migration-visual/component-breadcrumbs-before-light.png"
  after="/assets/images/migration-visual/component-breadcrumbs-after-light.png"
  alt="Breadcrumb trail with current page"
/>

### Pagination

Inherits the new button styling — the active page is now a filled squircle (DLT-2965).

<before-after
  before="/assets/images/migration-visual/component-pagination-before-light.png"
  after="/assets/images/migration-visual/component-pagination-after-light.png"
  alt="Pagination with active page and overflow ellipses"
/>

### Empty states

Tighter layout and headline sizes from the new type scale (DLT-2957).

<before-after
  before="/assets/images/migration-visual/component-empty-state-before-light.png"
  after="/assets/images/migration-visual/component-empty-state-after-light.png"
  alt="Empty state with illustration, title, and body"
/>

### Keyboard shortcuts

Keycap chips restyled (DLT-2960).

<before-after
  before="/assets/images/migration-visual/component-keyboard-shortcut-before-light.png"
  after="/assets/images/migration-visual/component-keyboard-shortcut-after-light.png"
  alt="Keyboard shortcut keycap combinations"
/>

### Presence

Status indicators change from color-only circles to squircles with **internal shapes** — check for active, dash for busy and do-not-disturb, outline for offline — so statuses are distinguishable by more than color (DLT-3438). The `dnd` value is also new.

<before-after
  before="/assets/images/migration-visual/component-presence-before-light.png"
  after="/assets/images/migration-visual/component-presence-after-light.png"
  alt="Presence indicators across all statuses"
/>

### Links

Link rendering is stable, with one behavior change: quiet links (previously never underlined) now show an **underline on hover** ([guide](/guides/migration/link-and-button-navigation/)).

<before-after
  before="/assets/images/migration-visual/component-link-before-light.png"
  after="/assets/images/migration-visual/component-link-after-light.png"
  alt="Standalone and inline links"
/>

### Modals

Modals are now native dialogs rendered in the browser's top layer ([guide](/guides/migration/modal-native-dialog/)). Visually near-identical in light mode; in dark mode the modal surface is lighter than the page (see [overlays](#overlays-are-lighter-than-the-page-in-dark-mode)). Tooltips or popovers rendering **underneath** a modal is a bug.

<before-after
  before="/assets/images/migration-visual/component-modal-before-light.png"
  after="/assets/images/migration-visual/component-modal-after-light.png"
  alt="Open modal over page content with backdrop"
/>

## What must look identical

Most of the migration is renames. After a **correct** migration, all of the following are pixel-identical — any visible difference here is a bug, not a refresh:

- **Shadows** — see the callout below.
- **Border radius** — utility classes were renamed to logical names; the radius values did not change.
- **Spacing** — spacing tokens were renamed; every shared stop keeps its exact pixel value.
- **Component sizes** — t-shirt sizes (`sm`/`md`/`lg`) became numeric (`200`/`300`/`400`), mapping to the same rendered sizes.
- **Severity vocabulary** — `danger` and `error` collapse to `critical`, and `success` becomes `positive`, across `kind`, `tone`, and validation types ([guide](/guides/migration/component-props/)). Same colors, new names.
- **Renamed props and events** — `show`→`open`, `title`→`header-text`, `hide-*`→`show-*`, logical naming (`left`→`start`): behavior-preserving renames with no visual surface.
- **Scrollbar behavior** — "never auto-hide" was renamed to "always visible"; same behavior.

<before-after
  before="/assets/images/migration-visual/control-shadows-before-light.png"
  after="/assets/images/migration-visual/control-shadows-after-light.png"
  alt="Shadow elevations that must match exactly"
/>

<before-after
  before="/assets/images/migration-visual/control-spacing-before-light.png"
  after="/assets/images/migration-visual/control-spacing-after-light.png"
  alt="Spacing scale bars that must match exactly"
/>

> [!CRITICAL] Shadows have not changed
> A shadow/elevation refresh was designed for Next but is **not shipping in the current release** — it lives on a separate branch. If shadows look softer, harder, or differently layered on a migrated screen today, that is a bug. This section will move to the "expected" list if the elevation refresh lands later.

## Problems we've actually seen

Patterns from real migration QA (primarily the ubervoice migration, June–July 2026), ordered by how often they occurred.

| What you see | Likely cause | What to do |
| --- | --- | --- |
| Spacing collapsed, elements misaligned, buttons invisible, raw class names visible in the UI, whole pages unstyled | CSS layering conflicts between Dialtone Next and app CSS — the dominant early-migration failure. Dialtone is **removing cascade layers from its main build**, so this cluster should not recur | If you see these symptoms on a current build, escalate in #dialtone-next immediately — don't spend time self-diagnosing |
| Colors don't change when switching theme/mode; "material" setting does nothing | App-level theme tokens not yet migrated to the new theming API (e.g. DP-196839) | File under your team's migration epic, note which theme you switched from/to |
| Dropdown/popover clipped behind a sidebar or panel | An ancestor gained an overflow-hidden utility — z-index can't save a popup once its container clips it (e.g. DP-197761) | File it with the exact page; note what the popup was anchored to |
| Charts or embedded content render blank | Downstream code that can't parse OKLCH color values (e.g. DP-194053, analytics charts) | File it — this needs an engineering fix in the embedding code |
| Close buttons or icons **reappeared** on banners, chips, toasts; modals never open (or never close) | Un-migrated renamed props (`hide-close`→`show-close`, `show`→`open`, `title`→`header-text`) — the old prop is silently ignored ([guide](/guides/migration/component-props/)) | File it; mention which element and what it should look like |
| A row of buttons or a toolbar collapsed into a vertical stack | Flex-to-stack conversion missing its row direction — the new stack defaults to vertical ([guide](/guides/migration/flex-to-stack/)) | File it — quick, mechanical fix |
| A destructive button or link lost its red and looks like a default one | Un-migrated severity word — `danger`/`error` were renamed to `critical`, and the old word no longer styles anything ([guide](/guides/migration/component-props/)) | File it — one-word fix |
| An element lost its background/text color entirely, or a translucent tint disappeared | Reference to a removed color stop or removed per-channel color variable ([color stops](/guides/migration/color-stops/), [HSL to OKLCH](/guides/migration/hsl-to-oklch/)) | File it with a screenshot of the colorless element |
| A scrollbar auto-hides where it used to stay visible | Un-migrated scrollbar setting ([guide](/guides/migration/scrollbar-always/)) | File it |
| A button that was styled as borderless/custom now renders wrong | The old implementation "hacked" a component with utility classes; the migration surfaces the workaround (e.g. DP-194338) | File it — the fix is using the proper component API, not restoring the hack |

One more pattern worth naming: **half-expected, half-bug**. An intentional color shift can coexist with a real defect it exposed (e.g. a hover state that became unreadable after the token alignment — DP-194781). If part of a change matches this guide but something is genuinely broken (contrast, readability, overlap), file the broken part and reference the expected part.

## How to review and file

**Source of truth**: this guide + the running Next build. Not the Figma library (pre-Next), not screenshots from before June 2026.

**Priorities** while migration QA is running: critical visual breakage first (unstyled, invisible, unusable), behavior-affecting changes second, pixel nits last — small spacing/wrapping differences are mostly the type-scale change doing its job.

When you file, include:

1. Page URL and the exact surface (component, section).
2. Screenshots in **both light and dark mode** — several Next changes are mode-specific.
3. A before screenshot or stable-environment comparison, if you have one.
4. A line confirming you checked this guide ("not listed as expected").
5. File under **your team's Dialtone Next migration epic**, not a general bug board — that's where the migration engineers triage.

Questions or unsure about a diff? Ask in **#dialtone-next** — a quick check there has repeatedly saved multi-day triage loops.
