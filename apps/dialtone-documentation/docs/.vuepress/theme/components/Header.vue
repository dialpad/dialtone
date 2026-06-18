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
      padding="200"
      padding-inline="250"
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
        <dt-stack direction="row" gap="150">
          <dt-button
            v-if="!viewport.above('lg')"
            v-dt-tooltip:bottom-start="mobileMenuOpen ? 'Close menu' : 'View menu'"
            kind="muted"
            importance="outlined"
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

defineProps({
  mobileMenuOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['toggle-mobile-menu']);
const viewport = useViewportBreakpoints();
</script>
