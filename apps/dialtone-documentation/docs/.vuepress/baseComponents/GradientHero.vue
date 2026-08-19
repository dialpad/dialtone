<template>
  <div class="gradient-overlay" style="--overlay-opacity: 0; --text-opacity: 1;">
    <div class="gradient-overlay__overlay" />
    <DtBox
      block-size="100p"
      padding-block-end="700"
      class="d-plc-center"
    >
      <DtBox class="home-gradient-hero-content">
        <dt-text
          as="p"
          variant="headline-md"
          strength="semibold"
          :size="viewport.pick({
            default: '200',
            lg: '300',
          })"
          align="center"
          class="d-tt-uppercase d-px-200 d-o80"
        >
          Dialpad's design system
        </dt-text>
        <dt-text
          as="h1"
          kind="headline"
          strength="medium"
          density="200"
          align="center"
          class="d-p-400 home-gradient-hero-title"
        >
          Start with the system. The fastest way to build Dialpad.
        </dt-text>
        <dt-text
          as="p"
          variant="body-md"
          :size="viewport.pick({
            default: '200',
            lg: '350',
          })"
          align="center"
          strength="medium"
          class="d-px-500 d-o80"
          wrap="balance"
        >
          Built on clarity, consistency, and accessibility: components, design tokens, and guidance that make good design the default.
        </dt-text>
        <dt-stack direction="row" justify="center" gap="300" class="d-pbs-500">
          <dt-button
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

  @media screen and (min-width: 960px) {
    font-size: 64px;
  }

  &__text {
  }
}
</style>
