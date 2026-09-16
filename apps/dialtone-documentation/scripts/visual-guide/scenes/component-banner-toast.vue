<template>
  <!-- DLT-2944: banner and toast were restyled alongside notice (typography
       via DtText). kind="info" exists on both branches so the pair isolates
       the restyle, not the success→positive rename (told in the notice
       scene). DtBanner positions itself against the nearest positioned
       ancestor, so it renders inside a relative container. Cross-branch
       props: show-close/hide-close pair, title (staging) + header-text
       (next). -->
  <div
    class="vg-scene"
    style="width:640px;"
  >
    <p class="vg-heading">
      Banner &amp; toast
    </p>
    <div class="vg-banner-host">
      <dt-banner
        kind="info"
        title="Banner title"
        header-text="Banner title"
        :show-close="false"
        :hide-close="true"
      >
        Page-level banner body copy.
      </dt-banner>
    </div>
    <div style="margin-top:20px;">
      <dt-toast
        kind="info"
        title="Toast title"
        header-text="Toast title"
        :open="true"
        :show="true"
        :show-close="false"
        :hide-close="true"
      >
        Toast body copy.
      </dt-toast>
    </div>
  </div>
</template>

<style>
/* The banner pins itself to the viewport; the pair compares its styling,
   not its positioning, so render it in-flow for the capture. */
.vg-banner-host .d-banner {
  position: static !important;
}
</style>
