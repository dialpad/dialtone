<template>
  <nav
    :aria-label="ariaLabel || i18n.$t('DIALTONE_BREADCRUMBS_ARIA_LABEL')"
    data-qa="dt-breadcrumbs"
    :class="[
      'd-breadcrumbs',
      { [BREADCRUMBS_INVERTED_MODIFIER]: inverted },
    ]"
  >
    <ol :class="['d-breadcrumbs__list', listClass]">
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
import { BREADCRUMBS_INVERTED_MODIFIER } from './BreadcrumbsConstants';
import DtBreadcrumbItem from './BreadcrumbItem.vue';
import utils from '@/common/utils';
import { DialtoneLocalization } from '@/localization';

/**
 * Breadcrumbs are links used to provide context for the currently-viewed page
 * and where it is located within the overall site structure.
 * @see https://dialtone.dialpad.com/components/breadcrumbs.html
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
     * @deprecated Use v-dt-mode instead.
     * Passed through to link. If true, applies inverted styles to the link.
     * @values true, false
     * @deprecated Use v-dt-mode directive instead.
     */
    inverted: {
      type: Boolean,
      default: false,
    },

    /**
     * Additional CSS class(es) applied to the list wrapper element.
     */
    listClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Descriptive label for the navigation content.
     */
    ariaLabel: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      BREADCRUMBS_INVERTED_MODIFIER,
      i18n: new DialtoneLocalization(),
    };
  },

  methods: {
    getBreadcrumbItemKey (index) {
      return `breadcrumbs-item-${index}-${utils.getUniqueString()}`;
    },
  },
};
</script>
