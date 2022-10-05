<template>
  <ol
    class="d-p0"
    data-qa="dt-combobox-empty-list"
  >
    <dt-list-item
      class="d-d-flex d-jc-center"
      role="option"
      navigation-type="arrow-keys"
    >
      <span>{{ message }}</span>
    </dt-list-item>
  </ol>
</template>

<script>
import { DtListItem } from '../list_item';

export default {
  name: 'ComboboxEmptyList',

  components: { DtListItem },

  props: {
    /**
     * Message to display when list is empty
     */
    message: {
      type: String,
      required: true,
    },
  },
};
</script>
