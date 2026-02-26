<template>
  <dt-button
    :id="`dt-tab-${id}`"
    :class="[
      tabClass,
      { 'd-btn--disabled': isDisabled },
      { 'd-tab--is-selected': !groupContext.outlined && groupContext.kind !== 'muted' && isSelected },
    ]"
    :importance="buttonImportance"
    :kind="buttonKind"
    :active="buttonActive"
    :size="buttonSize"
    role="tab"
    :aria-selected="`${isSelected}`"
    :aria-controls="`dt-panel-${panelId}`"
    :aria-label="label"
    :aria-disabled="isDisabled ? 'true' : undefined"
    data-qa="dt-tab"
    :tabindex="isSelected ? '0' : '-1'"
    v-bind="$attrs"
    v-on="tabListeners"
  >
    <!-- @slot Icon slot, passed through to DtButton's icon slot -->
    <template
      v-if="$slots.icon"
      #icon="{ iconSize }"
    >
      <slot
        name="icon"
        :icon-size="iconSize"
      />
    </template>
    <!-- @slot default slot, defaults contains dt-button -->
    <slot />
  </dt-button>
</template>

<script>
import { DtButton } from '../button';

/**
 * Tabs allow users to navigation between grouped content in different views while within the same page context.
 * @see https://dialtone.dialpad.com/components/tabs.html
 */
export default {
  compatConfig: { MODE: 3 },
  name: 'DtTab',
  components: {
    DtButton,
  },

  inject: ['groupContext', 'setFocus'],

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

  emits: [
    /**
     * Native button focus in event
     *
     * @event focus
     * @type {FocusEvent}
     */
    'focus',

    /**
     * Native button click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],

  computed: {
    tabListeners () {
      return {
        click: event => {
          this.$emit('click', event);
        },

        focus: event => {
          this.setFocus(this.id);
          this.$emit('focus', event);
        },
      };
    },

    isDisabled () {
      return this.groupContext.disabled || this.disabled;
    },

    buttonSize () {
      const size = this.groupContext.size;
      return size === 'default' ? undefined : size;
    },

    isSelected () {
      return this.groupContext.selected === this.panelId;
    },

    buttonKind () {
      if (this.groupContext.outlined) {
        return this.groupContext.kind === 'muted' ? 'muted' : 'default';
      }
      if (this.groupContext.kind === 'muted') {
        return 'muted';
      }
      return this.isSelected ? 'default' : 'muted';
    },

    buttonImportance () {
      if (this.groupContext.outlined && this.isSelected) {
        return 'outlined';
      }
      return 'clear';
    },

    buttonActive () {
      if (this.groupContext.outlined) {
        return false;
      }
      if (this.groupContext.kind === 'muted') {
        return this.isSelected;
      }
      return false;
    },
  },

  mounted () {
    if (this.selected) {
      this.groupContext.selected = this.panelId;
    }
  },
};
</script>
