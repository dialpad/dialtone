<template>
  <li>
    <div
      v-if="heading"
      class="dt-dropdown-list--header d-fs12 d-fc-black-400 d-fw-bold d-lh4 d-py4 d-px12 d-d-flex d-ai-center"
    >
      <span>{{ heading }}</span>
    </div>
    <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
    <ul
      :class="['d-ps-relative', 'd-px0', listClass]"
      data-qa="dt-dropdown-list-wrapper"
    >
      <!-- @slot Slot for the list component -->
      <slot />
    </ul>
  </li>
</template>

<script>
export default {
  name: 'DtDropdownList',

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
