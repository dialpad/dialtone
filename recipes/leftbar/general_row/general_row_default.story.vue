<template>
  <dt-recipe-general-row
    :type="$attrs.type"
    :color="$attrs.color"
    :description="$attrs.description"
    :unread-count="$attrs.unreadCount"
    :selected="$attrs.selected"
    @click="$attrs.onClick"
  />
</template>

<script>
import DtRecipeGeneralRow from './general_row';

export default {
  name: 'DtRecipeGeneralRowDefault',
  components: { DtRecipeGeneralRow },
};
</script>
