<!-- eslint-disable vue/no-restricted-class -->
<template>
  <li>
    <dt-stack
      v-if="heading"
      direction="row"
      align="center"
      class="dt-dropdown-list--header d-fs12 d-fc-black-400 d-fw-bold d-lh4 d-py4 d-px12"
    >
      <span>{{ heading }}</span>
    </dt-stack>
    <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
    <ul
      :class="['d-ps-relative', 'd-stack2', 'd-px0', listClass]"
      data-qa="dt-dropdown-list-wrapper"
    >
      <!-- @slot Slot for the list component -->
      <slot />
    </ul>
  </li>
</template>

<script>
import { DtStack } from '@/components/stack';

export default {
  name: 'DtDropdownList',

  components: { DtStack },
  props: {
    /**
     * List's heading.
     */
    heading: {
      type: String,
      default: '',
    },

    /**
     * Additional class for the wrapper list element.
     */
    listClass: {
      type: [String, Array, Object],
      default: '',
    },
  },
};
</script>
