<template>
  <DtBox
    :padding="viewport.pick({
      default: '0',
      lg: '300',
    })"
    padding-block-end="0"
    class="d-zi-navigation"
  >
    <DtBox
      :padding="viewport.pick({
        default: '150',
        md: '200',
      })"
      padding-inline="250"
      surface="secondary"
      :border-radius="viewport.pick({
        lg: '400',
      })"
      :shadow="viewport.pick({
        default: 'l',
        lg: false,
      })"
    >
      <dt-stack direction="row" justify="space-between" gap="400">
        <dt-stack direction="row" gap="150">
          <dt-button
            v-if="!viewport.above('lg')"
            v-dt-tooltip:bottom="`View menu`"
            kind="muted"
            importance="outlined"
            aria-label="Open Menu"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon name="menu" :size="iconSize" />
            </template>
          </dt-button>
          <dt-link
            title="Dialtone homepage"
            :underline="false"
            to="/"
          >
            <DtIllustration name="dialpad-logo" class="d-h-50 d-w-auto" />
          </dt-link>
        </dt-stack>
        <DtBox>
          <navbar />
        </DtBox>
      </dt-stack>
    </DtBox>
  </DtBox>
</template>

<script setup>
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';
import Navbar from '../components/Navbar.vue';

const viewport = useViewportBreakpoints();
</script>
