<!-- eslint-disable vue/no-restricted-class -->
<template>
  <li>
    <dt-stack
      v-if="heading"
      direction="row"
      align="center"
      class="dt-dropdown-list--header d-py-50 d-px-150"
    >
      <dt-text
        kind="label"
        :size="100"
        strength="bold"
        tone="muted"
      >
        {{ heading }}
      </dt-text>
    </dt-stack>
    <!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events, dialtone/deprecated-stack-flow-classes -->
    <ul
      :class="['d-ps-relative', 'd-stack2', 'd-px-0', listClass]"
      data-qa="dt-dropdown-list-wrapper"
    >
      <!-- @slot Slot for the list component -->
      <slot />
    </ul>
  </li>
</template>

<script>
import { DtStack } from '@/components/Stack';
import { DtText } from '@/components/Text';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtDropdownList',
  components: { DtStack, DtText },
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
