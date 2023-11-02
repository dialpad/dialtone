<template>
  <dt-description-list
    :gap="gap"
    :items="items"
    :direction="direction"
    :term-class="termClass"
    :description-class="descriptionClass"
  />
</template>

<script>
import DtDescriptionList from './description_list.vue';

export default {
  name: 'DtDescriptionListDefault',
  components: { DtDescriptionList },
};
</script>
