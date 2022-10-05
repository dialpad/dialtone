<template>
  <nav
    :aria-label="ariaLabel"
    data-qa="dt-breadcrumbs"
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
import util from '@/common/utils';

/**
 * Breadcrumbs are links used to provide context for the currently-viewed page
 * and where it is located within the overall site structure.
 * @see https://dialpad.design/components/breadcrumbs.html
 */
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
     * @values true, false
     */
    inverted: {
      type: Boolean,
      default: false,
    },

    /**
     * Descriptive label for the navigation content.
     */
    ariaLabel: {
      type: String,
      default: 'breadcrumb',
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
