<template>
  <dt-button
    v-if="updateAvailable"
    importance="outlined"
    size="xs"
    icon-position="right"
    class="d-recipe-settings-menu-button-update"
    :aria-label="buttonLabel"
    :title="buttonLabel"
    v-on="$listeners"
  >
    {{ buttonLabel }}
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
    :aria-label="buttonLabel"
    :title="buttonLabel"
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
import DtButton from '@/components/button/button.vue';
import { DtIconMoreVertical } from '@dialpad/dialtone-icons/vue2';
import { DtLocalizationMixin } from '@/common/mixins';

export default {
  name: 'DtRecipeSettingsMenuButton',

  components: {
    DtButton,
    DtIconMoreVertical,
  },

  mixins: [DtLocalizationMixin],

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

  computed: {
    buttonLabel () {
      return this.updateAvailable
        ? this.i18n.$t('DIALTONE_SETTINGS_MENU_UPDATE_BUTTON_LABEL')
        : this.i18n.$t('DIALTONE_SETTINGS_MENU_DEFAULT_BUTTON_LABEL');
    },
  },

};
</script>
