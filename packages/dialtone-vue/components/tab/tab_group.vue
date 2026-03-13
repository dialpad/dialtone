<template>
  <div
    data-qa="dt-tab-group"
    :class="['d-tab-neux', { 'd-tab-neux--vertical': orientation === 'vertical' }]"
  >
    <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -->
    <div
      ref="tabs"
      :class="[
        'd-tablist',
        TAB_LIST_SIZE_MODIFIERS[size],
        TAB_ORIENTATION_MODIFIERS[orientation],
        {
          [TAB_LIST_KIND_MODIFIERS.inverted]: inverted,
          [TAB_LIST_IMPORTANCE_MODIFIERS.borderless]: borderless,
        },
        tabListClass,
      ]"
      v-bind="tabListChildProps"
      role="tablist"
      :aria-label="label"
      :aria-orientation="orientation"
      @keydown.left="tabLeft"
      @keydown.right="tabRight"
      @keydown.up="tabUp"
      @keydown.down="tabDown"
      @keyup.enter="selectTab"
      @keyup.space="selectTab"
      @click="selectTab"
      @keydown.home.prevent="onHomeButton"
      @keydown.end.prevent="onEndButton"
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
  TAB_ORIENTATIONS,
  TAB_ORIENTATION_MODIFIERS,
  TAB_ACTIVATION_MODES,
  TAB_GROUP_KINDS,
} from './tabs_constants';

/**
 * Tabs allow users to navigation between grouped content in different views while within the same page context.
 * @see https://dialtone.dialpad.com/components/tabs.html
 */
export default {
  compatConfig: { MODE: 3 },
  name: 'DtTabGroup',

  provide () {
    return {
      groupContext: this.provideObj,
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
     * @deprecated Use v-dt-mode directive instead.
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
     * The orientation of the tab list
     * @values horizontal, vertical
     */
    orientation: {
      type: String,
      default: 'horizontal',
      validator (value) {
        return TAB_ORIENTATIONS.includes(value);
      },
    },

    /**
     * If provided, applies size styles to the tab group
     * @values default, xs, sm, lg, xl
     */
    size: {
      type: String,
      default: 'default',
      validator (size) {
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

    /**
     * The visual style kind applied to tabs within this group.
     * Maps to specific DtButton kind/importance combinations for selected/unselected states.
     * @values default, muted
     */
    kind: {
      type: String,
      default: 'default',
      validator (value) {
        return TAB_GROUP_KINDS.includes(value);
      },
    },

    /**
     * If true, the selected tab renders with outlined importance instead of clear.
     * @values true, false
     */
    outlined: {
      type: Boolean,
      default: false,
    },

    /**
     * Controls whether tabs are selected on focus (auto) or on click/keypress (manual)
     * @values auto, manual
     */
    activationMode: {
      type: String,
      default: 'manual',
      validator (value) {
        return TAB_ACTIVATION_MODES.includes(value);
      },
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

    /**
     * Before change tab event with the event argument, useful to perform validations and prevent changing tabs if neccessary.
     *
     * @event before-change
     * @type {Event}
     */
    'before-change',
  ],

  data () {
    return {
      provideObj: {
        selected: '', // the currently displayed tab id
        disabled: false, // disable group
        size: 'default',
        kind: 'default',
        outlined: false,
        orientation: 'horizontal',
      },

      focusId: null,
      tabs: [],
      TAB_LIST_SIZE_MODIFIERS,
      TAB_LIST_KIND_MODIFIERS,
      TAB_LIST_IMPORTANCE_MODIFIERS,
      TAB_ORIENTATION_MODIFIERS,
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

    size: {
      immediate: true,
      handler () {
        this.provideObj.size = this.size;
      },
    },

    kind: {
      immediate: true,
      handler () {
        this.provideObj.kind = this.kind;
      },
    },

    outlined: {
      immediate: true,
      handler () {
        this.provideObj.outlined = this.outlined;
      },
    },

    orientation: {
      immediate: true,
      handler () {
        this.provideObj.orientation = this.orientation;
      },
    },
  },

  mounted () {
    this.updateSelected();
  },

  updated () {
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
      const tabs = Array.from(this.$refs.tabs.querySelectorAll('[role="tab"]'));
      return tabs
        .map(el => {
          return ({
            context: el,
            panelId: el.getAttribute('aria-controls')?.replace('dt-panel-', ''),
            tabId: el.getAttribute('id')?.replace('dt-tab-', ''),
            isSelected: el.getAttribute('aria-selected') === 'true',
            isDisabled: el.getAttribute('aria-disabled') === 'true',
          });
        });
    },

    onChange () {
      this.$emit('change', { ...this.provideObj });
    },

    tabLeft () {
      if (this.orientation !== 'horizontal') return;
      this.navigatePrevious();
    },

    tabRight () {
      if (this.orientation !== 'horizontal') return;
      this.navigateNext();
    },

    tabUp (event) {
      if (this.orientation !== 'vertical') return;
      event.preventDefault();
      this.navigatePrevious();
    },

    tabDown (event) {
      if (this.orientation !== 'vertical') return;
      event.preventDefault();
      this.navigateNext();
    },

    navigatePrevious () {
      const index = this.getFocusedTabIndex();
      if (index === -1) return;

      const nextIndex = this.findNextTab(index, -1);
      this.selectFocusOnTab(nextIndex);
    },

    navigateNext () {
      const index = this.getFocusedTabIndex();
      if (index === -1) return;

      const nextIndex = this.findNextTab(index, 1);
      this.selectFocusOnTab(nextIndex);
    },

    findNextTab (fromIndex, direction) {
      const len = this.tabs.length;
      return (fromIndex + direction + len) % len;
    },

    selectFocusOnTab (index) {
      const { context, panelId, isDisabled } = this.tabs[index];
      context.focus();
      if (this.activationMode === 'auto' && !isDisabled) {
        this.provideObj.selected = panelId;
        this.onChange();
      }
    },

    selectTab (event) {
      if (this.isSameTabClicked()) return;

      const index = this.getFocusedTabIndex();
      if (this.tabs[index]?.isDisabled) return;

      this.$emit('before-change', event);
      if (event.defaultPrevented) return;

      this.selectTabByIndex(index);
      this.onChange();
    },

    selectTabByIndex (index) {
      const { context, panelId } = this.tabs[index];
      this.provideObj.selected = panelId;
      context.focus();
    },

    getFocusedTabIndex () {
      // Hot fix https://github.com/dialpad/dialtone/pull/849
      // The main issue is that this.tabs is not being updated at the time this is being triggered.

      const index = this.tabs.findIndex((context) =>
        this.focusId ? context.tabId === `${this.focusId}` : context.isSelected,
      );

      return index === -1 ? 0 : index;
    },

    onHomeButton () {
      if (this.tabs.length) this.selectFocusOnTab(0);
    },

    onEndButton () {
      if (this.tabs.length) this.selectFocusOnTab(this.tabs.length - 1);
    },

    isSameTabClicked () {
      const tab = this.tabs[this.getFocusedTabIndex()];
      return this.provideObj.selected === tab.panelId;
    },
  },
};
</script>
