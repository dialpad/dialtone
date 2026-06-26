# Known issues

## Latent components

These component folders exist in `packages/combinator/src/components/**`, but the
current live app does not mount them:

- `settings_menu`
- `header`
- `event_console`
- `renderer/renderer_menu.vue`
- `renderer/renderer_button_bar.vue`

Do not document them as working UI. DLT-3498 tracks the follow-up decision to
rewire or remove them.

## Settings without a mounted settings UI

The settings model still reads and writes localStorage-backed values for root
theme/sidebar, code scheme/indent/verbose, and renderer background/positioning.
Only settings that mounted components consume affect the live UI. The
`settings_menu` and `renderer_menu` controls are latent until DLT-3498 resolves
them.

## Small screens

A `640px` media query hides the root `.dialtone-playground` container. The
playground currently has no mobile layout.

## Overlay and focus-heavy components

The renderer catches render errors and displays a critical notice, but components
that move content outside the render container or capture focus still need manual
checks. Examples include modal, popover, banner, toast, and other overlay-like
components.

## Generated documentation quality

Control quality depends on the Dialtone Vue component documentation. Missing
`@values`, missing slot docs, or stale comments can leave the Combinator with
less specific controls even when the component source supports a narrower API.

## Silent variant member mismatches

The Combinator merges variant data by matching member names against docgen
output. If a prop, attribute, or slot is renamed in the component but the variant
file still uses the old name, the Combinator ignores that variant override.
