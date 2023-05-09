<template>
  <ol
    class="d-p0"
    data-qa="dt-combobox-empty-list"
  >
    <slot>
      <dt-list-item
        role="option"
        navigation-type="none"
        type="custom"
        :class="['dt-empty-list-item', itemClass]"
      >
        <span>{{ message }}</span>
      </dt-list-item>
    </slot>
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

<style lang="less">
.dt-empty-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-200);
  line-height: var(--lh4);
  padding: var(--space-300) var(--space-450);
}
</style>
