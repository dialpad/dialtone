<template>
  <dt-button
    v-if="updateAvailable"
    importance="outlined"
    size="xs"
    icon-position="right"
    class="d-recipe-settings-menu-button-update"
    :aria-label="ariaLabel"
    v-bind="$attrs"
  >
    <slot />
    <template #icon>
      <dt-icon-more-vertical
        size="300"
      />
    </template>
  </dt-button>
  <dt-button
    v-else
    importance="clear"
    kind="inverted"
    class="d-recipe-settings-menu-button"
    :aria-label="ariaLabel"
    v-bind="$attrs"
  >
    <template #icon>
      <dt-icon-more-vertical
        size="300"
      />
    </template>
  </dt-button>
</template>

<script>
import DtButton from '@/components/button/button.vue';
import { DtIconMoreVertical } from '@dialpad/dialtone-icons/vue3';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeSettingsMenuButton',

  components: {
    DtButton,
    DtIconMoreVertical,
  },

  inheritAttrs: false,

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

};
</script>
