<template>
  <dt-description-list
    :gap="$attrs.gap"
    :items="$attrs.items"
    :direction="$attrs.direction"
    :term-class="$attrs.termClass"
    :description-class="$attrs.descriptionClass"
  />
</template>

<script>
import DtDescriptionList from './description_list.vue';

export default {
  name: 'DtDescriptionListDefault',
  components: { DtDescriptionList },
};
</script>
