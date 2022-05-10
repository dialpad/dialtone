<template>
  <dt-combobox
    ref="combobox"
    :show-list="isListShown"
    :on-beginning-of-list="onBeginningOfList"
    :on-end-of-list="onEndOfList"
    :list-aria-label="listAriaLabel"
    :list-rendered-outside="true"
    :list-id="listId"
    data-qa="dt-combobox"
    v-bind="comboboxListeners"
  >
    <template
      #input="{ inputProps }"
    >
      <div
        :id="externalAnchor"
        ref="input"
        @focusin="showComboboxList"
        @focusout="onFocusOut"
        @keydown.up="openOnArrowKeyPress($event)"
        @keydown.down="openOnArrowKeyPress($event)"
      >
        <slot
          name="input"
          :input-props="inputProps"
        />
      </div>
    </template>
    <template #list="{ opened, listProps, clearHighlightIndex }">
      <dt-popover
        v-model:open="isListShown"
        :hide-on-click="true"
        :max-height="maxHeight"
        :max-width="maxWidth"
        placement="bottom-start"
        padding="none"
        role="listbox"
        :external-anchor="externalAnchor"
        :content-width="contentWidth"
        :content-tabindex="null"
        :modal="false"
        :auto-focus="false"
        @opened="opened"
      >
        <template
          v-if="$slots.header"
          #headerContent
        >
          <div
            ref="header"
            @focusout="onFocusOut"
          >
            <slot name="header" />
          </div>
        </template>

        <template #content>
          <div
            ref="listWrapper"
            :class="[DROPDOWN_PADDING_CLASSES[padding], listClass]"
            @mouseleave="clearHighlightIndex"
            @focusout="clearHighlightIndex; onFocusOut"
          >
            <slot
              name="list"
              :list-props="listProps"
            />
          </div>
        </template>

        <template
          v-if="$slots.footer"
          #footerContent
        >
          <div
            ref="footer"
            @focusout="onFocusOut"
          >
            <slot name="footer" />
          </div>
        </template>
      </dt-popover>
    </template>
  </dt-combobox>
</template>

<script>
import { DtCombobox, DtPopover, POPOVER_CONTENT_WIDTHS } from '@';
import { getUniqueString } from '@/common/utils';
import {
  DROPDOWN_PADDING_CLASSES,
} from '@/components/dropdown/dropdown_constants';

export default {
  name: 'DtRecipeComboboxWithPopover',

  components: {
    DtCombobox,
    DtPopover,
  },

  props: {
    /**
     * String to use for the list's aria-label.
     */
    listAriaLabel: {
      type: String,
      required: true,
    },

    /**
     * Determines when to show the list element and also controls the aria-expanded attribute.
     * Leaving this null will have the combobox trigger on input focus by default.
     * If you set this value, the default trigger behavior will be disabled and you can
     * control it as you need.
     */
    showList: {
      type: Boolean,
      default: null,
    },

    /**
     * Sets an ID on the list element of the component. Used by several aria attributes
     * as well as when deriving the IDs for each item.
     */
    listId: {
      type: String,
      default () { return getUniqueString(); },
    },

    /**
     * Additional class for the wrapper list element.
     */
    listClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * A method that will be called when the selection goes past the beginning of the list.
     */
    onBeginningOfList: {
      type: Function,
      default: null,
    },

    /**
     * A method that will be called when the selection goes past the end of the list.
     */
    onEndOfList: {
      type: Function,
      default: null,
    },

    /**
     * Determines maximum height for the popover before overflow.
     * Possible units rem|px|em
     */
    maxHeight: {
      type: String,
      default: '',
    },

    /**
     * Determines maximum width for the popover before overflow.
     * Possible units rem|px|%|em
     */
    maxWidth: {
      type: String,
      default: '',
    },

    /**
     * Vertical padding size around the list element.
     */
    padding: {
      type: String,
      default: 'small',
      validator: (padding) => {
        return Object.keys(DROPDOWN_PADDING_CLASSES).some((item) => item === padding);
      },
    },

    /**
     * Width configuration for the popover content. When its value is 'anchor',
     * the popover content will have the same width as the anchor.
     */
    contentWidth: {
      type: String,
      default: null,
      validator: contentWidth => POPOVER_CONTENT_WIDTHS.includes(contentWidth),
    },

    /**
     * If the list should be shown by pressing up or down arrow key on the input element.
     * This can be set when not passing showList prop.
     */
    openWithArrowKeys: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['select', 'escape', 'highlight', 'opened'],

  data () {
    return {
      DROPDOWN_PADDING_CLASSES,
      isListShown: false,
      isInputFocused: false,
      isListFocused: false,
      externalAnchor: getUniqueString(),
    };
  },

  computed: {
    comboboxListeners () {
      return {
        ...this.$attrs,

        onSelect: this.onSelect,

        onEscape: this.onEscape,

        onHighlight: this.onHighlight,
      };
    },
  },

  watch: {
    showList: {
      handler: function (show) {
        if (show !== null) {
          this.isListShown = show;
        }
      },

      immediate: true,
    },

    isListShown (val) {
      this.onOpened(val);
    },
  },

  methods: {
    showComboboxList () {
      if (this.showList != null) { return; }
      this.isListShown = true;
    },

    closeComboboxList () {
      if (this.showList != null) { return; }
      this.isListShown = false;
    },

    onSelect (highlightIndex) {
      this.$emit('select', highlightIndex);
    },

    onEscape () {
      this.$emit('escape');
      this.closeComboboxList();
    },

    onHighlight (highlightIndex) {
      this.$emit('highlight', highlightIndex);
    },

    onOpened (opened) {
      this.$emit('opened', opened);
    },

    onFocusOut (e) {
      const comboboxRefs = ['input', 'header', 'footer', 'listWrapper'];
      const isComboboxStillFocused = comboboxRefs.some((ref) => {
        return this.$refs[ref]?.contains(e.relatedTarget);
      });

      if (!isComboboxStillFocused) {
        this.closeComboboxList();
      }
    },

    openOnArrowKeyPress (e) {
      if (this.showList !== null || this.isListShown || !this.openWithArrowKeys) {
        return;
      }

      this.showComboboxList();
    },
  },
};
</script>

<style lang="less">

</style>
