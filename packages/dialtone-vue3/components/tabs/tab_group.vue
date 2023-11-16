<template>
  <div
    data-qa="dt-tab-group"
  >
    <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -->
    <div
      ref="tabs"
      :class="[
        'd-tablist',
        TAB_LIST_SIZE_MODIFIERS[size],
        {
          [TAB_LIST_KIND_MODIFIERS.inverted]: inverted,
          [TAB_LIST_IMPORTANCE_MODIFIERS.borderless]: borderless,
        },
        tabListClass,
      ]"
      v-bind="tabListChildProps"
      role="tablist"
      :aria-label="label"
      @keyup.left="tabLeft"
      @keyup.right="tabRight"
      @keyup.enter="selectTab"
      @keyup.space="selectTab"
      @keydown.home="onHomeButton"
      @keydown.end="onEndButton"
    >
      <!-- @slot Slot for Tabs -->
      <slot name="tabs" />
    </div>
    <!-- @slot Default slot for Panel -->
    <slot />
  </div>
</template>

<script>
import {
  TAB_LIST_SIZES,
  TAB_LIST_KIND_MODIFIERS,
  TAB_LIST_IMPORTANCE_MODIFIERS,
  TAB_LIST_SIZE_MODIFIERS,
} from './tabs_constants';

/**
 * Tabs allow users to navigation between grouped content in different views while within the same page context.
 * @see https://dialpad.design/components/tabs.html
 */
export default {
  name: 'DtTabGroup',

  provide () {
    return {
      groupContext: this.provideObj,
      changeContentPanel: this.changeContentPanel,
      setFocus: this.setFocus,
    };
  },

  props: {
    /**
     * Identifies the tab group
     */
    label: {
      type: String,
      default: '',
    },

    /**
     * The id of the selected tab panel which should be displayed
     */
    selected: {
      type: String,
      default: '',
    },

    /**
     * If true, disables the tab group
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * If true, applies inverted styles to the tab group
     * @values true, false
     */
    inverted: {
      type: Boolean,
      default: false,
    },

    /**
     * If true, applies borderless styles to the tab group
     * @values true, false
     */
    borderless: {
      type: Boolean,
      default: false,
    },

    /**
     * If provided, applies size styles to the tab group
     * @values default, sm
     */
    size: {
      type: String,
      default: 'default',
      validate (size) {
        return TAB_LIST_SIZES.includes(size);
      },
    },

    /**
     * Pass through classes, used to customize the tab list
     */
    tabListClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Pass through props, used to customize the tab list
     */
    tabListChildProps: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: [
    /**
     * Change tab event with the arguments: selected id of the current tab and disabled value
     *
     * @event change
     * @type {Object}
     */
    'change',
  ],

  data () {
    return {
      provideObj: {
        selected: '', // the currently displayed tab id
        disabled: false, // disable group
      },

      focusId: null,
      tabs: [],
      TAB_LIST_SIZE_MODIFIERS,
      TAB_LIST_KIND_MODIFIERS,
      TAB_LIST_IMPORTANCE_MODIFIERS,
    };
  },

  watch: {
    disabled: {
      immediate: true,
      handler () {
        this.provideObj.disabled = this.disabled;
      },
    },

    selected: {
      immediate: true,
      handler () {
        this.provideObj.selected = this.selected;
      },
    },
  },

  mounted () {
    this.updateSelected();
  },

  beforeUpdate () {
    this.updateSelected();
  },

  methods: {
    updateSelected () {
      /**
       * Prevent override tab selected by default
       */
      if (!this.provideObj.selected) {
        this.provideObj.selected = this.selected;
      }
      this.tabs = this.getTabChildren();
    },

    setFocus (focusId) {
      this.focusId = focusId;
    },

    getTabChildren () {
      const tabs = Array.from(this.$refs.tabs.children);
      return tabs
        .filter(({ className }) => className.includes('d-tab'))
        .map(el => {
          return ({
            context: el,
            panelId: el.getAttribute('aria-controls')?.replace('dt-panel-', ''),
            id: el.getAttribute('id')?.replace('dt-tab-', ''),
            isSelected: el.getAttribute('aria-selected') === 'true',
          });
        });
    },

    onChange () {
      this.$emit('change', { ...this.provideObj });
    },

    changeContentPanel ({ selected, selectOverride }) {
      this.provideObj.selected = selected;
      if (!selectOverride) {
        this.onChange();
      }
    },

    tabLeft () {
      const { index, tabs } = this.getIndexAndTabs();
      if (index === -1) return;
      const indexElement = index - 1 < 0 ? tabs.length - 1 : index - 1;
      this.selectFocusOnTab(indexElement, tabs);
    },

    tabRight () {
      const { index, tabs } = this.getIndexAndTabs();
      if (index === -1) return;

      const indexElement = index + 1 > tabs.length - 1 ? 0 : index + 1;
      this.selectFocusOnTab(indexElement, tabs);
    },

    selectFocusOnTab (index, tabs) {
      const { context } = tabs[index];
      context.focus();
    },

    selectTab () {
      const { tabs, index } = this.getIndexAndTabs();
      this.selectTabByIndex(index, tabs);
    },

    selectTabByIndex (index, tabs) {
      const { context, panelId } = tabs[index];
      this.provideObj.selected = panelId;
      context.focus();
    },

    getIndexAndTabs () {
      const index = this.tabs.findIndex((context) =>
        this.focusId ? context.id === `${this.focusId}` : context.isSelected);
      return {
        tabs: this.tabs,
        index,
      };
    },

    onHomeButton () {
      if (this.tabs.length === 0) return;
      this.tabs[0]?.context?.focus();
    },

    onEndButton () {
      if (this.tabs.length === 0) return;
      this.tabs[this.tabs.length - 1]?.context?.focus();
    },
  },
};
</script>
