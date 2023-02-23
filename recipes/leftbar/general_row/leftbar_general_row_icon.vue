<template>
  <dt-icon
    v-if="isIconType"
    :name="getIconName"
    size="300"
  />
  <div
    v-else-if="isContactCenterType"
    :class="contactCenterIconClasses"
  />
  <div
    v-else-if="isDialbotType"
    :class="dialbotClasses"
  >
    <icon-dialpad-glyph
      class="d-svg--size18"
      color="white"
    />
  </div>
</template>

<script>
import { DtIcon } from '@/components/icon';
import IconDialpadGlyph from '@dialpad/dialtone/lib/dist/vue/icons/IconDialpadGlyph';
import {
  LEFTBAR_GENERAL_ROW_ICON_MAPPING as ICON_MAPPING,
  LEFTBAR_GENERAL_ROW_TYPES as TYPES,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS as COLORS,
} from '@/recipes/leftbar/general_row/general_row_constants';

export default {
  name: 'DtRecipeLeftbarGeneralRowIcon',
  components: { DtIcon, IconDialpadGlyph },
  props: {
    type: {
      type: String,
      default: null,
    },

    color: {
      type: String,
      default: null,
    },
  },

  computed: {
    isIconType () {
      return ![TYPES.DIALBOT, TYPES.CONTACT_CENTER].includes(this.type);
    },

    isContactCenterType () {
      return this.type === TYPES.CONTACT_CENTER;
    },

    isDialbotType () {
      return this.type === TYPES.DIALBOT;
    },

    getIconName () {
      return ICON_MAPPING[this.type];
    },

    contactCenterIconClasses () {
      return [
        'dt-leftbar-row__icon-cc',
        COLORS[this.color],
      ];
    },

    dialbotClasses () {
      return [
        'd-bar-circle',
        'd-bgc-purple-400',
        'd-w24',
        'd-h24',
        'd-d-flex',
        'd-ai-center',
        'd-jc-center',
      ];
    },
  },
};
</script>
