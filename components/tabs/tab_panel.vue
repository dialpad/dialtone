<template>
  <div
    :id="`dt-panel-${id}`"
    role="tabpanel"
    :tabindex="isFirstElementFocusable ? -1 : 0"
    :aria-labelledby="`dt-tab-${tabId}`"
    :aria-hidden="`${hidePanel}`"
    :class="[
      {
        'd-d-none': hidePanel,
      },
      tabPanelClass,
    ]"
    data-qa="dt-tab-panel"
  >
    <!-- @slot Default slot for Tab Panel -->
    <slot v-show="!hidden" />
  </div>
</template>

<script>
import Modal from '@/common/mixins/modal.js';

/**
 * Tabs allow users to navigation between grouped content in different views while within the same page context.
 * @see https://dialpad.design/components/tabs.html
 */
export default {
  name: 'DtTabPanel',

  mixins: [Modal],

  inject: ['groupContext'],

  props: {
    /**
     * Id of the panel
     */
    id: {
      type: String,
      required: true,
    },

    /**
     * Id of the associated tab
     */
    tabId: {
      type: String,
      required: true,
    },

    /**
    * If true, hides the tab content
     * @values true, false
    */
    hidden: {
      type: Boolean,
      default: false,
    },

    /**
     * Used to customize the tab element
     */
    tabPanelClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  data () {
    return {
      isFirstElementFocusable: false,
    };
  },

  computed: {
    hidePanel () {
      return this.groupContext.selected !== this.id || this.hidden;
    },
  },

  async mounted () {
    this.isFirstElementFocusable = !!(await this.getFirstFocusableElement(this.$el));
  },
};
</script>
