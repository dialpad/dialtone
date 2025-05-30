<template>
  <dt-button
    v-if="updateAvailable"
    importance="outlined"
    size="xs"
    icon-position="right"
    class="d-recipe-settings-menu-button-update"
    :aria-label="ariaLabel"
    v-on="$listeners"
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
    v-on="$listeners"
  >
    <template #icon>
      <dt-icon-more-vertical
        size="300"
      />
    </template>
  </dt-button>
</template>

<script>
/*
 * TODO (Dialtone 10): Localize this component as it'd be a breaking change localizing right now.
 */
import DtButton from '@/components/button/button.vue';
import { DtIconMoreVertical } from '@dialpad/dialtone-icons/vue2';

export default {
  name: 'DtRecipeSettingsMenuButton',

  components: {
    DtButton,
    DtIconMoreVertical,
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
