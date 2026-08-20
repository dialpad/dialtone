<template>
  <dt-box
    padding="100"
    padding-block-start="125"
    padding-inline="150"
    surface="secondary"
    border-color="subtle"
    :border-width-block-end="viewport.pick({
      default: '100',
      lg: false,
    })"
    :border-radius="viewport.pick({
      lg: '400',
    })"
  >
    <dt-stack direction="row" justify="space-between" gap="400">
      <dt-stack direction="row" gap="150" class="d-w100p">
        <dt-button
          v-if="!viewport.above('lg')"
          v-dt-tooltip:bottom-start="mobileMenuOpen ? 'Close menu' : 'View menu'"
          kind="muted"
          importance="clear"
          aria-controls="sidebar-mobile"
          :active="mobileMenuOpen"
          :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
          :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
          @click="emit('toggle-mobile-menu')"
        >
          <template #startIcon="{ iconSize }">
            <dt-icon name="menu" :size="iconSize" />
          </template>
        </dt-button>
      </dt-stack>
      <dt-link
        title="Dialtone homepage"
        :underline="false"
        to="/"
      >
        <dt-illustration name="dialpad-logo" class="d-w-125" />
      </dt-link>
      <dt-stack class="d-w100p">
        <navbar class="d-mis-auto" />
      </dt-stack>
    </dt-stack>
  </dt-box>
</template>

<script setup>
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';
import Navbar from '../components/Navbar.vue';

defineProps({
  mobileMenuOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['toggle-mobile-menu']);
const viewport = useViewportBreakpoints();
</script>
