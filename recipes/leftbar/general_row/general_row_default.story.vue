<template>
  <dt-recipe-general-row
    :type="type"
    :color="color"
    :description="description"
    :unread-count="unreadCount"
    :selected="selected"
    @click="onClick"
  />
</template>

<script>
import DtRecipeGeneralRow from './general_row';

export default {
  name: 'DtRecipeGeneralRowDefault',
  components: { DtRecipeGeneralRow },
};
</script>
