# Z-Index

Utility classes for setting an element's z-index level.

- **Keywords**: stacking, layer, overlap

## Classes

Set an element's z-index by using a class (`.d-zi-{level}`>). These classes match up with the variables names listed above. The table below lists the available z-index levels, class names, and the CSS output.

| Class | Output |
| --- | --- |
| `d-zi-active` | z-index: var(--zi-active) !important |
| `d-zi-base` | z-index: var(--zi-base) !important |
| `d-zi-base1` | z-index: var(--zi-base1) !important |
| `d-zi-drawer` | z-index: var(--zi-drawer) !important |
| `d-zi-dropdown` | z-index: var(--zi-dropdown) !important |
| `d-zi-hide` | z-index: var(--zi-hide) !important |
| `d-zi-modal` | z-index: var(--zi-modal) !important |
| `d-zi-modal-element` | z-index: var(--zi-modal-element) !important |
| `d-zi-navigation` | z-index: var(--zi-navigation) !important |
| `d-zi-navigation-fixed` | z-index: var(--zi-navigation-fixed) !important |
| `d-zi-notification` | z-index: var(--zi-notification) !important |
| `d-zi-popover` | z-index: var(--zi-popover) !important |
| `d-zi-selected` | z-index: var(--zi-selected) !important |
| `d-zi-tooltip` | z-index: var(--zi-tooltip) !important |
| `d-zi-unset` | z-index: unset !important |

## Variables

When writing Less, you can set an element's z-index by using a variable (`var(--zi-{name})`). The table below lists the available variables, output, and a description for when they should be used.

  <div>
| Variable | Output | Description |
| --- | --- | --- |
| var(--zi-{{ name }}) | {{ output }} | {{ description }} |

  </div>
