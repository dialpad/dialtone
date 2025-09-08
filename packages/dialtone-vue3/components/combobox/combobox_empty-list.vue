<template>
  <ol
    class="d-combobox__empty-list"
    data-qa="dt-combobox-empty-list"
  >
    <slot>
      <dt-list-item
        role="option"
        navigation-type="none"
        type="custom"
        :class="['d-combobox__empty-list-item', itemClass]"
      >
        <span>{{ message }}</span>
      </dt-list-item>
    </slot>
  </ol>
</template>

<script>
import { DtListItem } from '@/components/list_item';

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

    /**
     * Additional class name for the empty list element.
     * Can accept all of String, Object, and Array, i.e. has the
     * same api as Vue's built-in handling of the class attribute.
     */
    itemClass: {
      type: [String, Object, Array],
      default: '',
    },
  },
};
</script>
