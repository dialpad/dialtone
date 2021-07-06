<template>
  <nav
    :class="[
      'd-breadcrumbs',
      { [BREADCRUMBS_INVERTED_MODIFIER]: inverted },
    ]"
  >
    <ol>
      <!-- @slot default slot for breadcrumbs content -->
      <slot>
        <dt-breadcrumb-item
          v-for="(item, index) in breadcrumbs"
          :key="getBreadcrumbItemKey(index)"
          :inverted="inverted"
          v-bind="item"
        />
      </slot>
    </ol>
  </nav>
</template>

<script>
import { BREADCRUMBS_INVERTED_MODIFIER } from './breadcrumbs_constants.js';
import DtBreadcrumbItem from './breadcrumb_item';
import util from '../utils';

export default {
  name: 'DtBreadcrumbs',

  components: {
    DtBreadcrumbItem,
  },

  props: {
    /**
     * A provided list of breadcrumbs. Overridden by default slot
     */
    breadcrumbs: {
      type: Array,
      default: () => [],
      validate (breadcrumbs) {
        return breadcrumbs.every(({ href, label }) => {
          return href !== undefined && label !== undefined;
        });
      },
    },

    /**
     * Passed through to link. If true, applies inverted styles to the link.
     */
    inverted: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      BREADCRUMBS_INVERTED_MODIFIER,
    };
  },

  methods: {
    getBreadcrumbItemKey (index) {
      return `breadcrumbs-item-${index}-${util.getUniqueString()}`;
    },
  },
};
</script>
