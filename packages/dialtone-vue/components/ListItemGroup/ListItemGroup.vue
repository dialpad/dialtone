<template>
  <ul
    :id="id"
    :class="['d-list-item-group', listClass]"
    role="group"
    data-qa="dt-dropdown-list-wrapper"
    :aria-labelledby="`${id}-heading`"
  >
    <li
      v-if="heading"
      :id="`${id}-heading`"
      role="presentation"
      data-qa="dt-dropdown-list-heading"
      :class="['dt-dropdown-list--header', headingClass]"
    >
      <!-- @slot Slot for heading, will override heading prop -->
      <slot name="heading">
        {{ heading }}
      </slot>
    </li>
    <!-- @slot Slot for the list component -->
    <slot />
  </ul>
</template>

<script>
import {} from './ListItemGroupConstants';
import { getUniqueString } from '@/common/utils';

export default {
  name: 'DtListItemGroup',

  props: {
    /**
     * Id of the List Item Group
     */
    id: {
      type: String,
      default () { return getUniqueString(); },
    },

    /**
     * List's heading.
     * Can also be overridden with a slot of the same name.
     */
    heading: {
      type: String,
      default: '',
    },

    /**
     * Additional class to style the heading
     */
    headingClass: {
      type: [String, Array, Object],
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
