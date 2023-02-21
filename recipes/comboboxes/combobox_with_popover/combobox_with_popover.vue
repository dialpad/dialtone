<template>
  <dt-combobox
    ref="combobox"
    :loading="loading"
    :label="label"
    :label-visible="labelVisible"
    :size="size"
    :description="description"
    :empty-list="emptyList"
    :empty-state-message="emptyStateMessage"
    :show-list="isListShown"
    :on-beginning-of-list="onBeginningOfList"
    :on-end-of-list="onEndOfList"
    :list-rendered-outside="true"
    :list-id="listId"
    data-qa="dt-combobox"
    v-bind="comboboxListeners"
  >
    <template
      #input="{ inputProps }"
    >
      <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
      <div
        :id="externalAnchor"
        ref="input"
        @focusin="onFocusIn"
        @keydown.up="openOnArrowKeyPress($event)"
        @keydown.down="openOnArrowKeyPress($event)"
      >
        <slot
          name="input"
          :input-props="inputProps"
          :on-input="handleDisplayList"
        />
      </div>
    </template>
    <template #list="{ opened, listProps, clearHighlightIndex }">
      <dt-popover
        ref="popover"
        v-model:open="isListShown"
        :hide-on-click="false"
        :max-height="maxHeight"
        :max-width="maxWidth"
        :offset="popoverOffset"
        :sticky="popoverSticky"
        placement="bottom-start"
        initial-focus-element="none"
        padding="none"
        role="listbox"
        :external-anchor="externalAnchor"
        :content-width="contentWidth"
        :content-appear="true"
        :content-tabindex="null"
        :modal="false"
        :auto-focus="false"
        :append-to="appendTo"
        :visually-hidden-close-label="visuallyHiddenCloseLabel"
        :visually-hidden-close="visuallyHiddenClose"
        @opened="opened"
      >
        <template
          v-if="hasSlotContent($slots.header)"
          #headerContent
        >
          <div
            ref="header"
          >
            <slot name="header" />
          </div>
        </template>

        <template #content>
          <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
          <div
            ref="listWrapper"
            :class="[DROPDOWN_PADDING_CLASSES[padding], listClass]"
            @mouseleave="clearHighlightIndex"
            @focusout="clearHighlightIndex"
          >
            <combobox-loading-list
              v-if="loading"
              v-bind="listProps"
            />
            <combobox-empty-list
              v-else-if="emptyList && emptyStateMessage"
              v-bind="listProps"
              :message="emptyStateMessage"
            />
            <slot
              v-else
              name="list"
              :list-props="listProps"
            />
          </div>
        </template>

        <template
          v-if="hasSlotContent($slots.footer)"
          #footerContent
        >
          <div
            ref="footer"
          >
            <slot name="footer" />
          </div>
        </template>
      </dt-popover>
    </template>
  </dt-combobox>
</template>

<script>
/* eslint-disable vuejs-accessibility/no-static-element-interactions */
import ComboboxLoadingList from '@/components/combobox/combobox_loading-list.vue';
import ComboboxEmptyList from '@/components/combobox/combobox_empty-list.vue';
import { DtCombobox } from '@/components/combobox';
import { DtPopover, POPOVER_CONTENT_WIDTHS } from '@/components/popover';
import { getUniqueString, hasSlotContent } from '@/common/utils';
import {
  POPOVER_APPEND_TO_VALUES,
} from '@/components/popover/popover_constants';
import {
  DROPDOWN_PADDING_CLASSES,
} from '@/components/dropdown/dropdown_constants';
import SrOnlyCloseButtonMixin from '@/common/mixins/sr_only_close_button';
import { LABEL_SIZES } from '@/components/combobox/combobox_constants';

export default {
  name: 'DtRecipeComboboxWithPopover',

  components: {
    DtCombobox,
    DtPopover,
    ComboboxLoadingList,
    ComboboxEmptyList,
  },

  mixins: [SrOnlyCloseButtonMixin],

  props: {
    /**
     * String to use for the input label.
     */
    label: {
      type: String,
      required: true,
    },

    /**
     * Determines visibility of input label.
     * @values true, false
     */
    labelVisible: {
      type: Boolean,
      default: true,
    },

    /**
     * Size of the input, one of `xs`, `sm`, `md`, `lg`, `xl`
     * @values null, xs, sm, md, lg, xl
     */
    size: {
      type: String,
      default: null,
      validator: (t) => Object.values(LABEL_SIZES).includes(t),
    },

    /**
     * Description for the input
     */
    description: {
      type: String,
      default: '',
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

    /**
     *  Displaces the popover content box from its anchor element
     *  by the specified number of pixels.
     */
    popoverOffset: {
      type: Array,
      default: () => [0, 4],
    },

    /**
     * If the popover sticks to the input.
     */
    popoverSticky: {
      type: [Boolean, String],
      default: false,
    },

    /**
     * Displays the list when the combobox is focused, before the user has typed anything.
     * When this is enabled the list will not close after selection.
     */
    hasSuggestionList: {
      type: Boolean,
      default: true,
    },

    /**
     * Determines when to show the skeletons and also controls aria-busy attribute.
     */
    loading: {
      type: Boolean,
      default: false,
    },

    /**
     * Sets the list to an empty state, and displays the message from prop `emptyStateMessage`.
     */
    emptyList: {
      type: Boolean,
      default: false,
    },

    /**
     * Message to show when the list is empty
     */
    emptyStateMessage: {
      type: String,
      default: '',
    },

    /**
     * Sets the element to which the popover is going to append to.
     * 'body' will append to the nearest body (supports shadow DOM).
     * @values 'body', 'parent', HTMLElement,
     */
    appendTo: {
      type: [HTMLElement, String],
      default: 'body',
      validator: appendTo => {
        return POPOVER_APPEND_TO_VALUES.includes(appendTo) ||
            (appendTo instanceof HTMLElement);
      },
    },
  },

  emits: [
    /**
     * Event fired when item selected
     *
     * @event select
     * @type {Number}
     */
    'select',

    /**
     * Event fired when 'escape' key is pressed
     *
     * @event escape
     */
    'escape',

    /**
     * Event fired when an item is highlighted
     *
     * @event highlight
     * @type {Number}
     */
    'highlight',

    /**
     * Emitted when items are shown or hidden
     *
     * @event opened
     * @type {Boolean | Array}
     */
    'opened',
  ],

  data () {
    return {
      DROPDOWN_PADDING_CLASSES,
      isListShown: false,
      isInputFocused: false,
      isListFocused: false,
      externalAnchor: getUniqueString(),
      hasSlotContent,
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
      if (val) {
        window.addEventListener('mousedown', this.onFocusOut);
      } else {
        window.removeEventListener('mousedown', this.onFocusOut);
      }
      this.onOpened(val);
    },
  },

  methods: {
    handleDisplayList (value) {
      if (!this.hasSuggestionList && value) { this.showComboboxList(); }
      if (!this.hasSuggestionList && !value) { this.closeComboboxList(); }
    },

    showComboboxList () {
      if (this.showList != null) { return; }
      this.isListShown = true;
    },

    closeComboboxList () {
      if (this.showList != null) { return; }
      this.isListShown = false;
    },

    onSelect (highlightIndex) {
      if (this.loading) return;

      this.$emit('select', highlightIndex);
      if (!this.hasSuggestionList) {
        // we don't display the list before the user has typed anything
        this.closeComboboxList();
      }
    },

    onEscape () {
      this.$emit('escape');
      this.closeComboboxList();
    },

    onHighlight (highlightIndex) {
      if (this.loading) return;

      this.$emit('highlight', highlightIndex);
    },

    onOpened (opened) {
      this.$emit('opened', opened);
    },

    onFocusIn (e) {
      if (this.hasSuggestionList && e && this.$refs.input.querySelector('input') === e.target) {
        // only trigger if we show suggestion list when focused, and
        // it's the input specifically that was focused
        this.showComboboxList();
      }
    },

    onFocusOut (e) {
      // Check if the focus change was to another target within the combobox component
      const isComboboxStillFocused = Object.keys(this.$refs).some(refName => {
        const ref = this.$refs[refName];
        return ref.$el ? ref.$el.contains(e.target) : ref.contains(e.target);
      });
      if (isComboboxStillFocused) return;

      // If outside the combobox then close
      this.closeComboboxList();
    },

    openOnArrowKeyPress () {
      if (this.showList !== null || this.isListShown || !this.openWithArrowKeys) { return; }

      this.showComboboxList();
    },
  },
};
</script>
