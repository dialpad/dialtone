<template>
  <div class="gradient-overlay" style="--overlay-opacity: 0; --text-opacity: 1;">
    <div class="gradient-overlay__overlay" />
    <DtBox
      block-size="100p"
      padding-block-end="800"
      class="d-plc-center"
    >
      <DtBox class="home-gradient-hero-content">
        <dt-box class="d-d-flex d-plc-center d-mbe-600">
          <dt-link to="/dialtone/">
            <dt-box
              :inline-size="viewport.pick({
                default: '125',
                md: '150',
                lg: '200',
              })"
              style="filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 25px 30px);"
            >
              <svg-loader name="home--dialtone-badge" />
            </dt-box>
          </dt-link>
        </dt-box>
        <dt-text
          as="h1"
          kind="headline"
          strength="medium"
          density="200"
          align="center"
          class="d-p-400 home-gradient-hero-title d-wmx-1300 d-mx-auto"
        >
          Start with the system. The fastest way to build Dialpad.
        </dt-text>
        <dt-text
          as="p"
          variant="body-md"
          :size="viewport.pick({
            default: '200',
            md: '350',
          })"
          align="center"
          strength="medium"
          class="d-px-500 d-o80 d-wmx-800 d-mx-auto"
          wrap="balance"
        >
          <!-- Built on clarity, consistency, and accessibility:  -->
          Components, design tokens, and guidance that make good design the default.
        </dt-text>
        <dt-stack direction="row" justify="center" gap="250" class="d-pbs-500">
          <dt-button
            v-dt-mode:dark
            class="home-gradient-hero-btn"
            to="/dialtone/"
            :size="400"
            @click="sendAnalyticsEvent()"
          >
            Docs
          </dt-button>
          <dt-button
            to="/about/whats-new/"
            link
            link-kind="muted"
            class="d-fc-primary"
          >
            <dt-text
              variant="body-lg"
              size="300"
              strength="semibold"
            >
              What's New?
            </dt-text>
          </dt-button>
        </dt-stack>
      </DtBox>
    </DtBox>
  </div>
</template>

<script setup>
import { useViewportBreakpoints } from '../theme/composables/useViewportBreakpoints.js';

// Component handles gradient overlay hero section with scroll-driven animations
// Animations are controlled by parent page's scroll handler that updates CSS variables
const viewport = useViewportBreakpoints();
</script>

<style lang="less">
/* Styles are inherited from parent page's .gradient-overlay definitions */
/* Unscoped to allow parent's dynamic CSS variable updates to work */

.home-gradient-hero-btn {
  --button-color-text: var(--dt-color-neutral-white);
  --button-color-background: var(--dt-color-purple-50);
}
.home-gradient-hero-content {
  transform: translateY(var(--text-translate-y, 0px));
  opacity: var(--text-opacity);
}

.home-gradient-hero-title {
  font-size: 32px;
  font-family: var(--dt-font-family-expressive);
  text-wrap: balance;
  transition: none;
  background: linear-gradient(180deg, var(--dt-color-purple-900), var(--dt-color-purple-1000));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  @media screen and (min-width: 640px) {
    font-size: 46px;
  }

  @media screen and (min-width: 960px) {
    font-size: 64px;
  }

  &__text {
  }
}
</style>
