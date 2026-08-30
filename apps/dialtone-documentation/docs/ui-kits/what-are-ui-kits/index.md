---
title: What are UI Kits?
description: An introduction to UI Kits -- domain-specific components built with Dialtone.
keywords: ["design kits", "product patterns", "composition", "templates", "domain components"]
prev:
  text: Meet the Kits
  link: /ui-kits/
---

> [!INFO]
> UI Kit component details are currently being developed. For the most up-to-date details and proposals, see the `#dialpad-uikits` channel.

## Overview

UI Kits are reusable compositions that combine multiple atomic Dialtone components into production-ready patterns. While Dialtone provides the "atoms" (like buttons and inputs), UI Kits aim to provide the "compositions" specific to certain product domains, such as Messaging or Analytics. UI Kits are built with Vue 3 and are available as npm packages.

## Component Grouping

Individual components (e.g., `DtDropdownField`, `DtInputTextField`) are grouped into kits (e.g., `FormKit`) based on their primary use case and are managed by the product teams closest to the feature domain.

Components can be imported into any Dialpad project via a package with the kit name:

```javascript
import "@dialpad/formkit/vue3/css";
import { DtInputTextField } from "@dialpad/formkit/vue3";
```

## Component Classification

Product teams are encouraged to treat kits an an incubator for domain-specific components that have the potential to be reused by other teams. Once a component is widely adopted and reused, it can be considered for promotion into the core Dialtone design system.

### Design System vs. UI Kit Components

- In atomic design, is it an atom or small molecule? → Likely Design System.
- Does it combine many atoms + HTML + domain logic? → UI Kit.
- Has it spread across multiple teams and have a stabilized API? → Consider promoting to Dialtone.

| Criteria | Design System Component | UI Kit Component |
| --- | --- | --- |
| **Token & theming dependency** | Fully token-driven; adapts to themes/brands. | May extend tokens with product-specific styles. |
| **Level of abstraction** | Atomic or small molecule (Button, Input, Modal). | Composite pattern (Message Composer, Callbar Row). |
| **Scope of applicability** | Broad, cross-product and cross-platform usage. | Specific to one feature, product, or surface. |
| **Reusability** | Reusable across many contexts by design. | Reusable across some teams/features, not universal. |
| **API stability** | Stable, minimal, generic API; rare breaking changes. | APIs evolve quickly with product needs. |
| **Behavioral independence** | Presentation-level only, no business logic. | Encodes domain/feature-specific behaviors. |
| **Surface area** | Singular control or simple combination. | Large composition of atoms + HTML + logic. |
| **Cross-platform support** | Exists or planned across Web, Mobile, Desktop. | Only relevant on one platform or channel. |
| **Adoption signal** | Adopted or requested by multiple teams. | Primarily used by one team/feature until proven. |
| **Accessibility & i18n** | Meets full accessibility and internationalization standards. | Accessibility handled contextually, may be lighter. |

## History & Benefits

Many UI Kit components began as "Dialtone recipes", while others were created by product teams to solve specific problems. We are evolving our component architecture to better serve Dialpad’s scaling product needs via:

- **Modular Architecture**: By organizing compositions into separate thematic packages (e.g., ChatKit, FormKit), teams only install the specific kits they need.
- **Shared Ownership**: Unlike core Dialtone primitives maintained by a central team, UI Kits are owned and maintained by the product teams closest to the feature domain.
- **Organic Growth**: Kits act as an "incubator" for new patterns. When a component proves its value across multiple product areas and its API stabilizes, it becomes a candidate to "graduate" into the core Dialtone design system.
