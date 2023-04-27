<template>
  <dt-recipe-settings-menu-button
    :update-available="$attrs.updateAvailable"
    :aria-label="$attrs.ariaLabel"
    @click="$attrs.onClick"
  >
    <template v-if="defaultSlot">
      {{ defaultSlot }}
    </template>
  </dt-recipe-settings-menu-button>
</template>

<script>
import DtRecipeSettingsMenuButton from './settings_menu_button';

export default {
  name: 'DtRecipeSettingsMenuButtonDefault',
  components: { DtRecipeSettingsMenuButton },
};
</script>
