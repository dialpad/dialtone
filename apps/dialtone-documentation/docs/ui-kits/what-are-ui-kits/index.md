---
title: What are UI Kits?
description: An introduction to UI Kits -- domain-specific components built with Dialtone.
prev:
  text: Meet the Kits
  link: /ui-kits/
---

## Overview

UI Kits are reusable compositions that combine multiple atomic Dialtone components into production-ready patterns. While Dialtone provides the "atoms" (like buttons and inputs), UI Kits aim to provide the "compositions" specific to certain product domains, such as Messaging or Analytics. UI Kits are built with Vue 3 and are available as npm packages.

## Component Grouping

Individual components (e.g., `DpDropdownField`, `DpInputTextField`) are grouped into kits (e.g., `FormKit`) based on their primary use case and are managed by the product teams closest to the feature domain.

Components can be imported into any Dialpad project via a package with the kit name:

```javascript
import "@dialpad/formkit/vue3/css";
import { DpInputTextField } from "@dialpad/formkit/vue3";
```

## Component Classification

Product teams are encouraged to treat kits an an incubator for domain-specific components that have the potential to be reused by other teams. Once a component is widely adopted and reused, it can be considered for promotion into the core Dialtone design system.

### Design System vs. UI Kit Components

- In atomic design, is it an atom or small molecule? → Likely Design System.
- Does it combine many atoms + HTML + domain logic? → UI Kit.
- Has it spread across multiple teams and have a stabilized API? → Consider promoting to Dialtone.

<div class="d-py16 d-mt24 d-bgc-secondary d-bar16">
  <table class="d-table">
    <colgroup>
      <col class="d-w30p">
      <col class="d-w30p">
      <col class="d-w30p">
    </colgroup>
    <thead>
      <tr>
        <th class="d-ta-left d-va-top">
          <div class="d-mb4">Criteria</div>
        </th>
        <th class="d-ta-left d-va-top">
          <div class="d-mb4">Design System Component</div>
        </th>
        <th class="d-ta-left d-va-top">
          <div class="d-mb4">UI Kit Component</div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="d-ta-left"><strong>Token &amp; theming dependency</strong></td>
        <td class="d-ta-left">Fully token-driven; adapts to themes/brands.</td>
        <td class="d-ta-left">May extend tokens with product-specific styles.</td>
      </tr>
      <tr>
        <td class="d-ta-left"><strong>Level of abstraction</strong></td>
        <td class="d-ta-left">Atomic or small molecule (Button, Input, Modal).</td>
        <td class="d-ta-left">Composite pattern (Message Composer, Callbar Row).</td>
      </tr>
      <tr>
        <td class="d-ta-left"><strong>Scope of applicability</strong></td>
        <td class="d-ta-left">Broad, cross-product and cross-platform usage.</td>
        <td class="d-ta-left">Specific to one feature, product, or surface.</td>
      </tr>
      <tr>
        <td class="d-ta-left"><strong>Reusability</strong></td>
        <td class="d-ta-left">Reusable across many contexts by design.</td>
        <td class="d-ta-left">Reusable across some teams/features, not universal.</td>
      </tr>
      <tr>
        <td class="d-ta-left"><strong>API stability</strong></td>
        <td class="d-ta-left">Stable, minimal, generic API; rare breaking changes.</td>
        <td class="d-ta-left">APIs evolve quickly with product needs.</td>
      </tr>
      <tr>
        <td class="d-ta-left"><strong>Behavioral independence</strong></td>
        <td class="d-ta-left">Presentation-level only, no business logic.</td>
        <td class="d-ta-left">Encodes domain/feature-specific behaviors.</td>
      </tr>
      <tr>
        <td class="d-ta-left"><strong>Surface area</strong></td>
        <td class="d-ta-left">Singular control or simple combination.</td>
        <td class="d-ta-left">Large composition of atoms + HTML + logic.</td>
      </tr>
      <tr>
        <td class="d-ta-left"><strong>Cross-platform support</strong></td>
        <td class="d-ta-left">Exists or planned across Web, Mobile, Desktop.</td>
        <td class="d-ta-left">Only relevant on one platform or channel.</td>
      </tr>
      <tr>
        <td class="d-ta-left"><strong>Adoption signal</strong></td>
        <td class="d-ta-left">Adopted or requested by multiple teams.</td>
        <td class="d-ta-left">Primarily used by one team/feature until proven.</td>
      </tr>
      <tr>
        <td class="d-ta-left"><strong>Accessibility &amp; i18n</strong></td>
        <td class="d-ta-left">Meets full accessibility and internationalization standards.</td>
        <td class="d-ta-left">Accessibility handled contextually, may be lighter.</td>
      </tr>
    </tbody>
  </table>
</div>

## History and Benefits

Many UI Kit components began as "Dialtone recipes", while others were created by product teams to solve specific problems. We are evolving our component architecture to better serve Dialpad’s scaling product needs via:

- **Modular Architecture**: By organizing compositions into separate thematic packages (e.g., ChatKit, FormKit), teams only install the specific kits they need.
- **Clearer Ownership**: Unlike core Dialtone primitives maintained by a central team, UI Kits are owned and maintained by the product teams closest to the feature domain.
- **Organic Growth**: Kits act as an "incubator" for new patterns. When a component proves its value across multiple product areas and its API stabilizes, it becomes a candidate to "graduate" into the core Dialtone design system.
