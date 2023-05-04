<template>
  <dt-button
    :id="`dt-tab-${id}`"
    :class="[
      'd-tab',
      {
        [TAB_IMPORTANCE_MODIFIERS.selected]: isSelected,
      },
      tabClass,
    ]"
    role="tab"
    :aria-selected="`${isSelected}`"
    :aria-controls="`dt-panel-${panelId}`"
    :aria-label="label"
    data-qa="dt-tab"
    :tabindex="isSelected ? '0' : '-1'"
    :disabled="groupContext.disabled || disabled"
    v-bind="$attrs"
    v-on="tabListeners"
  >
    <!-- @slot default slot, defaults contains dt-button -->
    <slot />
  </dt-button>
</template>

<script>
import { TAB_IMPORTANCE_MODIFIERS } from './tabs_constants';
import { DtButton } from '../button';

/**
 * Tabs allow users to navigation between grouped content in different views while within the same page context.
 * @see https://dialpad.design/components/tabs.html
 */
export default {
  name: 'DtTab',
  components: {
    DtButton,
  },

  inject: ['changeContentPanel', 'groupContext', 'setFocus'],

  inheritAttrs: false,

  props: {
    /**
     * Id of the tab
     */
    id: {
      type: String,
      required: true,
    },

    /**
     * Id of the associated content panel
     */
    panelId: {
      type: String,
      required: true,
    },

    /**
     * Describes the tab
     */
    label: {
      type: String,
      default: '',
    },

    /**
     * Controls the state of the tab
     * @values true, false
     */
    selected: {
      type: Boolean,
      default: false,
    },

    /**
     * If true, disables the tab
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Used to customize the tab element
     */
    tabClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  data () {
    return {
      TAB_IMPORTANCE_MODIFIERS,
    };
  },

  computed: {
    isSelected () {
      return this.groupContext.selected === this.panelId;
    },

    tabListeners () {
      return {
        ...this.$listeners,

        click: event => {
          this.selectPanel();
          this.$emit('click', event);
        },

        focus: event => {
          this.setFocus(this.id);
          this.$emit('focus', event);
        },
      };
    },
  },

  mounted () {
    this.setSelectedPanelByDefault();
  },

  methods: {
    setSelectedPanelByDefault () {
      if (this.selected) {
        this.selectPanel(true);
      }
    },

    selectPanel (selectOverride = false) {
      this.changeContentPanel({
        selected: this.panelId,
        selectOverride,
      });
    },
  },
};
</script>
