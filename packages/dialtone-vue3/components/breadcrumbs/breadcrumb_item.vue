<template>
  <li
    data-qa="dt-breadcrumb-item"
    :class="[
      'd-breadcrumbs__item',
      { [BREADCRUMB_ITEM_SELECTED_MODIFIER]: selected },
    ]"
    v-bind="addClassStyleAttrs($attrs)"
  >
    <dt-link
      :kind="linkKind"
      :inverted="linkInverted"
      :aria-current="ariaCurrent"
      data-qa="breadcrumb-item"
      v-bind="removeClassStyleAttrs($attrs)"
    >
      <!-- @slot default slot for breadcrumb item's label -->
      <slot>
        {{ label }}
      </slot>
    </dt-link>
  </li>
</template>

<script>
import { BREADCRUMB_ITEM_SELECTED_MODIFIER } from './breadcrumbs_constants';
import { removeClassStyleAttrs, addClassStyleAttrs } from '@/common/utils';
import { DtLink, MUTED } from '@/components/link';

export default {
  name: 'DtBreadcrumbItem',

  components: {
    DtLink,
  },

  inheritAttrs: false,

  props: {
    /**
     * Passed through to link. If true, applies inverted styles to the link.
     */
    inverted: {
      type: Boolean,
      default: false,
    },

    /**
     * Applies selected styles to the breadcrumb
     */
    selected: {
      type: Boolean,
      default: false,
    },

    /**
     * Describes the breadcrumb. Overridden by default slot
     */
    label: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      BREADCRUMB_ITEM_SELECTED_MODIFIER,

    };
  },

  computed: {
    linkKind () {
      return this.inverted ? '' : MUTED;
    },

    linkInverted () {
      return !!this.inverted;
    },

    ariaCurrent () {
      return this.selected ? 'location' : undefined;
    },
  },

  methods: {
    removeClassStyleAttrs,
    addClassStyleAttrs,
  },
};
</script>
