<template>
  <dt-popover
    v-model:open="isOpen"
  >
    <template #anchor>
      <dt-recipe-settings-menu-button
        :update-available="$attrs.updateAvailable"
        :aria-label="$attrs.ariaLabel"
        @click="isOpen = !isOpen"
      >
        <template v-if="defaultSlot">
          {{ defaultSlot }}
        </template>
      </dt-recipe-settings-menu-button>
    </template>
    <template #content>
      hewwo
    </template>
  </dt-popover>
</template>

<script>
import DtRecipeSettingsMenuButton from './settings_menu_button.vue';
import { DtPopover } from '../../..'

export default {
  name: 'DtRecipeSettingsMenuButtonDefault',
  components: { DtRecipeSettingsMenuButton, DtPopover },
  data() {
    return { isOpen: false }
  },
};
</script>
