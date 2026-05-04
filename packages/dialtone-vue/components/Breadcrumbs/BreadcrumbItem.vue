<template>
  <li
    data-qa="dt-breadcrumb-item"
    :class="[
      'd-breadcrumbs__item',
      { [BREADCRUMB_ITEM_SELECTED_MODIFIER]: selected },
      $attrs.class,
    ]"
    :style="$attrs.style"
  >
    <dt-link
      :kind="linkKind"
      :inverted="linkInverted"
      :aria-current="ariaCurrent"
      :underline="false"
      data-qa="breadcrumb-item"
      v-bind="removeClassStyleAttrs($attrs)"
      :class="['d-breadcrumbs__link']"
    >
      <!-- @slot default slot for breadcrumb item's label -->
      <slot>
        {{ label }}
      </slot>
    </dt-link>
  </li>
</template>

<script>
import { BREADCRUMB_ITEM_SELECTED_MODIFIER } from './BreadcrumbsConstants';
import { removeClassStyleAttrs } from '@/common/Utils';
import { DtLink, MUTED } from '@/components/Link';

export default {
  name: 'DtBreadcrumbItem',

  components: {
    DtLink,
  },

  inheritAttrs: false,

  props: {
    /**
     * @deprecated Use v-dt-mode instead.
     * Passed through to link. If true, applies inverted styles to the link.
     * @deprecated Use v-dt-mode directive instead.
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
  },
};
</script>
