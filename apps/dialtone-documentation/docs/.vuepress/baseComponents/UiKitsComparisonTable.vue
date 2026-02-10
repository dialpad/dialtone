<template>
  <div v-dt-scrollbar:never class="d-hmx464 d-bar8 d-ba d-bc-subtle d-mt24">
    <div>
      <table class="d-table dialtone-doc-table">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
          <tr>
            <th scope="col" class="d-p0 d-bbw0 d-tt-none">
              <div class="d-p16 d-bb d-bbw1">
                Criteria
              </div>
            </th>
            <th scope="col" class="d-p0 d-bbw0 d-tt-none">
              <div class="d-p16 d-bb d-bbw1">
                Design System Component
              </div>
            </th>
            <th scope="col" class="d-p0 d-bbw0 d-tt-none">
              <div class="d-p16 d-bb d-bbw1">
                UI Kit Component
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="d-ta-left">
              <strong>Token &amp; theming dependency</strong>
            </td>
            <td class="d-ta-left">
              Fully token-driven; adapts to themes/brands.
            </td>
            <td class="d-ta-left">
              May extend tokens with product-specific styles.
            </td>
          </tr>
          <tr>
            <td class="d-ta-left">
              <strong>Level of abstraction</strong>
            </td>
            <td class="d-ta-left">
              Atomic or small molecule (Button, Input, Modal).
            </td>
            <td class="d-ta-left">
              Composite pattern (Message Composer, Callbar Row).
            </td>
          </tr>
          <tr>
            <td class="d-ta-left">
              <strong>Scope of applicability</strong>
            </td>
            <td class="d-ta-left">
              Broad, cross-product and cross-platform usage.
            </td>
            <td class="d-ta-left">
              Specific to one feature, product, or surface.
            </td>
          </tr>
          <tr>
            <td class="d-ta-left">
              <strong>Reusability</strong>
            </td>
            <td class="d-ta-left">
              Reusable across many contexts by design.
            </td>
            <td class="d-ta-left">
              Reusable across some teams/features, not universal.
            </td>
          </tr>
          <tr>
            <td class="d-ta-left">
              <strong>API stability</strong>
            </td>
            <td class="d-ta-left">
              Stable, minimal, generic API; rare breaking changes.
            </td>
            <td class="d-ta-left">
              APIs evolve quickly with product needs.
            </td>
          </tr>
          <tr>
            <td class="d-ta-left">
              <strong>Behavioral independence</strong>
            </td>
            <td class="d-ta-left">
              Presentation-level only, no business logic.
            </td>
            <td class="d-ta-left">
              Encodes domain/feature-specific behaviors.
            </td>
          </tr>
          <tr>
            <td class="d-ta-left">
              <strong>Surface area</strong>
            </td>
            <td class="d-ta-left">
              Singular control or simple combination.
            </td>
            <td class="d-ta-left">
              Large composition of atoms + HTML + logic.
            </td>
          </tr>
          <tr>
            <td class="d-ta-left">
              <strong>Cross-platform support</strong>
            </td>
            <td class="d-ta-left">
              Exists or planned across Web, Mobile, Desktop.
            </td>
            <td class="d-ta-left">
              Only relevant on one platform or channel.
            </td>
          </tr>
          <tr>
            <td class="d-ta-left">
              <strong>Adoption signal</strong>
            </td>
            <td class="d-ta-left">
              Adopted or requested by multiple teams.
            </td>
            <td class="d-ta-left">
              Primarily used by one team/feature until proven.
            </td>
          </tr>
          <tr>
            <td class="d-ta-left">
              <strong>Accessibility &amp; i18n</strong>
            </td>
            <td class="d-ta-left">
              Meets full accessibility and internationalization standards.
            </td>
            <td class="d-ta-left">
              Accessibility handled contextually, may be lighter.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'UiKitsComparisonTable',
});
</script>
