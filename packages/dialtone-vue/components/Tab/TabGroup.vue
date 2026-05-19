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
        TAB_LIST_SIZE_MODIFIERS[String(size)],
        TAB_ORIENTATION_MODIFIERS[orientation],
        orientation !== 'vertical' && TAB_SPREAD_MODIFIERS[spread],
        {
          [TAB_LIST_KIND_MODIFIERS.inverted]: inverted,
          [TAB_LIST_IMPORTANCE_MODIFIERS.borderless]: borderless,
        },
        resolvedTabsClass,
      ]"
      v-bind="tabListChildProps"
      role="tablist"
      :aria-label="label"
      :aria-orientation="orientation"
      @keydown.left="tabLeft"
      @keydown.right="tabRight"
      @keydown.up="tabUp"
      @keydown.down="tabDown"
      @keydown.enter="selectTab"
      @keydown.space="selectTab"
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
  TAB_SPREADS,
  TAB_SPREAD_MODIFIERS,
} from './TabsConstants';
import { ref } from 'vue';
import { useIndicatorAnimation } from '@/common/composables/useIndicatorAnimation';

/**
 * Tabs allow users to navigation between grouped content in different views while within the same page context.
 * @see https://dialtone.dialpad.com/components/tabs.html
 */
export default {
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
     * Controls how tabs distribute available space within the tab list.
     * @values none, grow, equal
     */
    spread: {
      type: String,
      default: 'none',
      validator (value) {
        return TAB_SPREADS.includes(value);
      },
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
     * @values 100, 200, 300, 400, 500
     */
    size: {
      type: [String, Number],
      default: 300,
      validator (size) {
        return TAB_LIST_SIZES.includes(String(size));
      },
    },

    /**
     * Pass through classes, used to customize the tab list
     */
    tabsClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Pass through classes, used to customize the tab list
     * @deprecated Use tabsClass
     */
    tabListClass: {
      type: [String, Array, Object],
      default: undefined,
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

    /**
     * If true, the selection indicator animates between tabs on click.
     * @values true, false
     */
    showIndicatorTransition: {
      type: Boolean,
      default: true,
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

  setup () {
    const tabs = ref(null);
    const indicator = useIndicatorAnimation(
      tabs, '--tab-indicator-duration', '--tab-indicator-easing',
    );
    return { tabs, indicator };
  },

  data () {
    return {
      provideObj: {
        selected: '', // the currently displayed tab id
        disabled: false, // disable group
        size: 300,
        kind: 'default',
        outlined: false,
        orientation: 'horizontal',
        spread: 'none',
        focusedTabId: null, // tracks last-focused tab for roving tabindex
      },

      tabItems: [],
      TAB_LIST_SIZE_MODIFIERS,
      TAB_LIST_KIND_MODIFIERS,
      TAB_LIST_IMPORTANCE_MODIFIERS,
      TAB_ORIENTATION_MODIFIERS,
      TAB_SPREAD_MODIFIERS,
    };
  },

  computed: {
    resolvedTabsClass () {
      return this.tabListClass ?? this.tabsClass;
    },
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
      handler (newVal, oldVal) {
        this.provideObj.selected = this.selected;
        if (newVal !== oldVal) {
          this.provideObj.focusedTabId = null;
        }
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

    spread: {
      immediate: true,
      handler () {
        this.provideObj.spread = this.spread;
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
      this.tabItems = this.getTabChildren();

      // Clear stale focusedTabId if the focused tab was removed
      if (this.provideObj.focusedTabId && !this.tabItems.some(t => t.tabId === this.provideObj.focusedTabId)) {
        this.provideObj.focusedTabId = null;
      }
    },

    setFocus (focusId) {
      if (this.provideObj.focusedTabId !== focusId) {
        this.provideObj.focusedTabId = focusId;
      }
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
      const len = this.tabItems.length;
      return (fromIndex + direction + len) % len;
    },

    transitionIndicator (panelId, newContext) {
      if (!newContext || !this.showIndicatorTransition) {
        this.provideObj.selected = panelId;
        return;
      }

      const old = this.indicator.snapshot('[aria-selected="true"]');

      this.provideObj.selected = panelId;
      if (!old) return;

      this.$nextTick(() => {
        let hideProps = { backgroundColor: 'transparent' };
        let indicatorExtra = {};
        let pseudoElement = '::after';

        if (this.outlined) {
          hideProps = { borderColor: 'transparent', backgroundColor: 'transparent' };
          indicatorExtra = { boxShadow: `inset 0 0 0 ${old.style.borderWidth} ${old.style.borderColor}` };
          pseudoElement = '::before';
        } else if (this.kind === 'muted') {
          indicatorExtra = { backgroundColor: old.style.backgroundColor };
          pseudoElement = '::before';
        }

        this.indicator.animate({
          oldRect: old.rect,
          newEl: newContext,
          orientation: this.orientation,
          hideProps,
          indicatorExtra,
          pseudoElement,
        });
      });
    },

    selectFocusOnTab (index) {
      const { context, panelId, isDisabled } = this.tabItems[index];
      context.focus();
      if (this.activationMode === 'auto' && !isDisabled) {
        this.indicator.cancel();
        this.provideObj.selected = panelId;
        this.onChange();
      }
    },

    selectTab (event) {
      const tabEl = event.target.closest('[role="tab"]');
      const index = tabEl
        ? this.tabItems.findIndex(t => t.context === tabEl)
        : this.getFocusedTabIndex();

      if (index === -1) return;
      if (this.tabItems[index]?.isDisabled) return;
      if (this.provideObj.selected === this.tabItems[index]?.panelId) return;

      this.$emit('before-change', event);
      if (event.defaultPrevented) return;

      // Prevent keyboard defaults (Space scroll, Enter form submit)
      // after confirming the tab change will proceed
      event.preventDefault();

      this.selectTabByIndex(index);
      this.onChange();
    },

    selectTabByIndex (index) {
      const { context, panelId } = this.tabItems[index];
      this.transitionIndicator(panelId, context);
      context.focus();
    },

    getFocusedTabIndex () {
      const focusedId = this.provideObj.focusedTabId;
      const index = this.tabItems.findIndex((context) =>
        focusedId ? context.tabId === focusedId : context.isSelected,
      );

      return index === -1 ? 0 : index;
    },

    onHomeButton () {
      if (this.tabItems.length) this.selectFocusOnTab(0);
    },

    onEndButton () {
      if (this.tabItems.length) this.selectFocusOnTab(this.tabItems.length - 1);
    },

  },
};
</script>
