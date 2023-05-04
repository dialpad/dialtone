<template>
  <dt-button
    v-if="updateAvailable"
    importance="outlined"
    size="xs"
    icon-position="right"
    class="d-h32 d-bar-pill d-bgc-blue-200 d-bgo25 h:d-bgo50 d-bc-blue-500 d-bco25 d-fc-blue-500"
    :aria-label="ariaLabel"
    v-on="$listeners"
  >
    <slot />
    <template #icon>
      <dt-icon
        name="more-vertical"
        size="300"
        class="d-fc-blue-500"
      />
    </template>
  </dt-button>
  <dt-button
    v-else
    importance="clear"
    kind="inverted"
    class="settings-menu-button d-p0 d-bar24 d-h32 d-w24 d-theme-topbar-fc"
    :aria-label="ariaLabel"
    v-on="$listeners"
  >
    <template #icon>
      <dt-icon
        name="more-vertical"
        size="300"
      />
    </template>
  </dt-button>
</template>

<script>
import DtButton from '@/components/button/button.vue';
import { DtIcon } from '@/components/icon';

export default {
  name: 'DtRecipeSettingsMenuButton',

  components: {
    DtButton,
    DtIcon,
  },

  props: {
    /**
     * Determines whether the button should display the update state
     * default is false
     * @values true, false
     */
    updateAvailable: {
      type: Boolean,
      default: false,
    },

    /**
     * Aria label
     */
    ariaLabel: {
      type: String,
      required: true,
    },
  },

  emits: [
    /**
     * Native click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],

};
</script>

<style scoped lang="less">
.d-btn:active {
  --bgo: 85% !important;
}

.settings-menu-button {
  &:hover {
    background-color: hsla(var(--theme-topbar-color-hsl) / .05);
  }

  &:focus-visible {
    color: var(--theme-topbar-color-hsl);
    box-shadow: 0 0 0 var(--size-200) hsla(var(--theme-sidebar-color-hsl) / .15);
  }
}
</style>
