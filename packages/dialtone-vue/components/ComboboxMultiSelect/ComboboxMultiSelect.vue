<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <dt-combobox-with-popover
    ref="comboboxWithPopover"
    :label="label"
    :show-list="showList"
    :max-height="listMaxHeight"
    :max-width="listMaxWidth"
    :popover-offset="popoverOffset"
    :has-suggestion-list="hasSuggestionList"
    content-width="anchor"
    :append-to="appendTo"
    :dialog-class="dialogClass"
    :transition="transition"
    v-bind="extractNonListeners($attrs)"
    @select="onComboboxSelect"
    @highlight="comboboxHighlight"
  >
    <template #input="{ onInput }">
      <span
        ref="inputSlotWrapper"
        class="d-combobox-multi-select__input-wrapper"
        @focusin="handleInputFocusIn"
        @focusout="handleInputFocusOut"
      >
        <span
          ref="chipsWrapper"
          :class="['d-combobox-multi-select__chip-wrapper', chipWrapperClass]"
        >
          <dt-chip
            v-for="(item, index) in selectedItems"
            ref="chips"
            :key="`${index}-${item}`"
            :interactive="true"
            :label-class="['d-chip__label--focus-always']"
            :class="[
              'd-combobox-multi-select__chip',
              { 'd-combobox-multi-select__chip--truncate': !!chipMaxWidth },
            ]"
            :style="{ maxWidth: chipMaxWidth }"
            :size="CHIP_SIZES[String(size)]"
            :disabled="disabled"
            v-on="chipListeners"
            @keydown.backspace="onChipRemove(item)"
            @close="onChipRemove(item)"
          >
            {{ item }}
          </dt-chip>
        </span>

        <dt-input
          ref="input"
          v-model="value"
          class="d-combobox-multi-select__input"
          :input-class="[
            inputClass, {
              'd-combobox-multi-select__input--hidden': hideInputText,
            }]"
          :input-wrapper-class="inputWrapperClass"
          :disabled="disabled"
          :aria-label="label"
          :aria-invalid="ariaInvalid"
          :aria-describedby="ariaDescribedBy"
          :label="showLabel ? label : ''"
          :description="description"
          :placeholder="inputPlaceHolder"
          :show-messages="showInputMessages"
          :messages="inputMessages"
          :size="size"
          v-bind="inputListeners"
          @update:model-value="onInput"
        />

        <dt-validation-messages
          :id="messagesId"
          :validation-messages="maxSelectedMessage"
          :show-messages="showValidationMessages"
        />
      </span>
    </template>

    <!-- @slot slot for popover header -->
    <template
      v-if="hasSlotContent($slots.header)"
      #header
    >
      <div
        ref="header"
        :class="headerClass"
      >
        <slot name="header" />
      </div>
    </template>

    <!-- @slot slot for popover list -->
    <template #list>
      <div
        ref="list"
        :class="['d-combobox-multi-select__list', listClass]"
        @mousedown.prevent
      >
        <slot
          v-if="!loading"
          name="list"
        />
        <div
          v-else
          class="d-combobox-multi-select__list--loading"
        >
          {{ loadingMessage }}
        </div>
      </div>
    </template>

    <!-- @slot slot for popover footer -->
    <template
      v-if="hasSlotContent($slots.footer)"
      #footer
    >
      <div
        ref="footer"
        :class="footerClass"
      >
        <slot name="footer" />
      </div>
    </template>
  </dt-combobox-with-popover>
</template>

<script>
/* eslint-disable max-lines */
import DtComboboxWithPopover from '@/components/ComboboxWithPopover/ComboboxWithPopover.vue';
import DtInput from '@/components/Input/Input.vue';
import DtChip from '@/components/Chip/Chip.vue';
import DtValidationMessages from '@/components/ValidationMessages/ValidationMessages.vue';
import { validationMessageValidator, ordinalSizeValidator } from '@/common/validators';
import { extractVueListeners, extractNonListeners, hasSlotContent, returnFirstEl, getUniqueString, getValidationState } from '@/common/utils';
import { HTML_ELEMENT_TYPE } from '@/common/constants';
import {
  POPOVER_APPEND_TO_VALUES,
} from '@/components/Popover/PopoverConstants';
import {
  CHIP_SIZES,
} from './ComboboxMultiSelectConstants';
import { COMPONENT_SIZES, VALIDATION_MESSAGE_TYPES } from '@/common/constants';

export default {
  name: 'DtComboboxMultiSelect',

  components: {
    DtComboboxWithPopover,
    DtInput,
    DtChip,
    DtValidationMessages,
  },

  inheritAttrs: false,

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
    showLabel: {
      type: Boolean,
      default: true,
    },

    /**
     * Description for the input
     */
    description: {
      type: String,
      default: '',
    },

    /**
     * Input placeholder
     */
    placeholder: {
      type: String,
      default: 'Select one or start typing',
    },

    /**
     * Input validation messages
     */
    inputMessages: {
      type: Array,
      default: () => [],
      validator: inputMessages => {
        return validationMessageValidator(inputMessages);
      },
    },

    /**
     * Show input validation message
     */
    showInputMessages: {
      type: Boolean,
      default: true,
    },

    // @TODO: https://dialpad.atlassian.net/browse/DP-52324
    // type: {
    //   type: String,
    //   values: ['input', 'select'],
    //   default: 'select',
    // },

    /**
     * Determines if the list is loading
     */
    loading: {
      type: Boolean,
      default: false,
    },

    /**
     * The message when the list is loading
     */
    loadingMessage: {
      type: String,
      default: 'loading...',
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
     * Determines maximum height for the popover before overflow.
     * Possible units rem|px|em
     */
    listMaxHeight: {
      type: String,
      default: '300px',
    },

    /**
     * The selected items
     */
    selectedItems: {
      type: Array,
      default: function () { return []; },
    },

    /**
     * Would be the maximum number of selections you can make. 0 is unlimited
     */
    maxSelected: {
      type: Number,
      default: 0,
    },

    /**
     * Max select message when the max selections is exceeded with the structure:
     * `[{"message": string, "type": VALIDATION_MESSAGE_TYPES }]`
     */
    maxSelectedMessage: {
      type: Array,
      default: function () { return []; },
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
     * Size of the chip.
     * @values 100, 200, 300
     */
    size: {
      type: [String, Number],
      default: 300,
      validator: ordinalSizeValidator(CHIP_SIZES),
    },

    /**
     * Sets the element to which the popover is going to append to.
     * 'body' will append to the nearest body (supports shadow DOM).
     * @values 'body', 'parent', HTMLElement,
     */
    appendTo: {
      type: [HTML_ELEMENT_TYPE, String],
      default: 'body',
      validator: appendTo => {
        return POPOVER_APPEND_TO_VALUES.includes(appendTo) ||
            (appendTo instanceof HTMLElement);
      },
    },

    /**
     * Named transition when the content display is toggled.
     * @see DtLazyShow
     */
    transition: {
      type: String,
      default: 'fade',
    },

    /**
     * Determines whether the combobox should collapse to a single when losing focus.
     * @type {boolean}
     */
    collapseOnFocusOut: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines maximum width for the popover before overflow.
     * Possible units rem|px|em
     */
    listMaxWidth: {
      type: String,
      default: '',
    },

    /**
    * Amount of reserved space (in px) on the right side of the input
    * before the chips and the input caret jump to the next line.
    * default is 64
    */
    reservedRightSpace: {
      type: Number,
      default: 64,
    },

    /**
     * Determines the maximum width of a single chip. If the text within this chip exceeds the value
     * it will be truncated with ellipses.
     * Possible units rem|px|em
     */
    chipMaxWidth: {
      type: String,
      default: '',
    },

    /**
     * Additional class name for the input element.
     * Can accept String, Object, and Array, i.e. has the
     * same API as Vue's built-in handling of the class attribute.
     */
    inputClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * Additional class name for the input wrapper element.
     * Can accept all of String, Object, and Array, i.e. has the
     * same api as Vue's built-in handling of the class attribute.
     */
    inputWrapperClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * When true, disables the underlying input.
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Additional class name for the header wrapper element.
     */
    headerClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the footer wrapper element.
     */
    footerClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the list wrapper element.
     */
    listClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class for the popover dialog element.
     */
    dialogClass: {
      type: [String, Object, Array],
      default: '',
    },
  },

  emits: [
    /**
     * Event fired to sync the modelValue prop with the parent component
     *
     * @event update:modelValue
     * @type {String}
     */
    'update:modelValue',

    /**
     * Event fired when item selected
     *
     * @event select
     * @type {Number}
     */
    'select',

    /**
     * Event fired when item removed
     *
     * @event remove
     * @type {String}
     */
    'remove',

    /**
     * Event fired when max selected items limit is reached
     *
     * @event max-selected
     * @type {Object}
     */
    'max-selected',

    /**
     * Native keydown event fired when a key is pressed in the text input.
     * For the common Escape and Enter cases, listen to `escape` / `enter` instead.
     *
     * @event keydown
     * @type {KeyboardEvent}
     */
    'keydown',

    /**
     * Native keydown event fired when a key is pressed while a chip is focused.
     *
     * @event chip-keydown
     * @type {KeyboardEvent}
     */
    'chip-keydown',

    /**
     * Fired when Escape is pressed in the text input.
     * Not fired when a chip is focused.
     *
     * @event escape
     * @type {KeyboardEvent}
     */
    'escape',

    /**
     * Fired when Enter is pressed in the text input.
     * Not fired when a chip is focused.
     *
     * @event enter
     * @type {KeyboardEvent}
     */
    'enter',

    /**
     * Event fired when combobox item is highlighted
     *
     * @event combobox-highlight
     * @type {Object}
     */
    'combobox-highlight',
  ],

  data () {
    return {
      value: '',
      popoverOffset: [0, 4],
      showValidationMessages: false,
      resizeWindowObserver: null,
      initialInputHeight: null,
      CHIP_SIZES,
      hasSlotContent,
      inputFocused: false,
      hideInputText: false,
      messagesId: getUniqueString(),
    };
  },

  computed: {
    inputPlaceHolder () {
      return this.selectedItems?.length > 0 ? '' : this.placeholder;
    },

    chipListeners () {
      return {
        keydown: event => {
          if (this.disabled) return;
          this.onChipKeyDown(event);
          this.$emit('chip-keydown', event);
        },
      };
    },

    inputListeners () {
      return {
        ...extractVueListeners(this.$attrs),
        onInput: event => {
          this.$emit('update:modelValue', event);
          if (this.hasSuggestionList) {
            this.showComboboxList();
          }
        },

        onKeydown: event => {
          if (this.disabled) return;
          this.onInputKeyDown(event);
          this.$emit('keydown', event);
          // Use event.key (not event.code) so NumpadEnter normalizes to 'Enter'
          // and consumers don't have to special-case the numpad.
          const key = event.key?.toLowerCase();
          if (key === 'escape') {
            this.$emit('escape', event);
          } else if (key === 'enter') {
            this.$emit('enter', event);
          }
        },

        onClick: () => {
          if (this.hasSuggestionList) {
            this.showComboboxList();
          }
        },
      };
    },

    ariaInvalid () {
      return getValidationState(this.maxSelectedMessage) === VALIDATION_MESSAGE_TYPES.CRITICAL ? 'true' : undefined;
    },

    ariaDescribedBy () {
      return this.showValidationMessages && this.maxSelectedMessage.length > 0 ? this.messagesId : undefined;
    },

    // Sizes other than xs need a height floor so the box can grow for wrapped
    // chip rows without collapsing back; xs renders correctly without one.
    inputHeightFloor () {
      return (this.initialInputHeight && this.size !== 'xs')
        ? `${this.initialInputHeight}px`
        : '';
    },

    chipWrapperClass () {
      const size = COMPONENT_SIZES[String(this.size)] || this.size;
      return [
        // Always emitted so the CSS can size the row rhythm without reaching
        // sideways into DtInput's markup to discover the size.
        `d-combobox-multi-select__chip-wrapper--${size}`,
        {
          [`d-combobox-multi-select__chip-wrapper-${size}--collapsed`]: !this.inputFocused && this.collapseOnFocusOut,
        },
      ];
    },
  },

  watch: {
    selectedItems: {
      deep: true,
      handler: async function () {
        await this.initSelectedItems();
      },
    },

    chipMaxWidth: {
      async handler () {
        await this.initSelectedItems();
      },
    },

    async label () {
      await this.$nextTick();
      // Adjust the chips position if label changed
      this.setChipsTopPosition();
    },

    async description () {
      await this.$nextTick();
      // Adjust the chips position if description changed
      this.setChipsTopPosition();
    },

    size: {
      async handler () {
        await this.$nextTick();
        const input = this.getInput();
        this.revertInputPadding(input);
        this.setInitialInputHeight();
        this.setInputPadding();
        this.setChipsTopPosition();
      },
    },
  },

  async mounted () {
    this.setInitialInputHeight();
    // Recalculate chip position and input padding when resizing window
    this.resizeWindowObserver = new ResizeObserver(async () => {
      this.setChipsTopPosition();
      this.setInputPadding();
    });
    this.resizeWindowObserver.observe(document.body);

    await this.initSelectedItems();
  },

  beforeUnmount () {
    this.resizeWindowObserver?.unobserve(document.body);
  },

  methods: {
    extractNonListeners,
    comboboxHighlight (highlightIndex) {
      this.$emit('combobox-highlight', highlightIndex);
    },

    async initSelectedItems () {
      await this.$nextTick();
      this.setInputPadding();
      this.setChipsTopPosition();
      this.setInputMinWidth();
      this.checkMaxSelected();
    },

    onChipRemove (item) {
      this.$emit('remove', item);
      this.$refs.input?.focus();
    },

    onComboboxSelect (i) {
      if (this.loading) return;
      this.value = '';
      this.$emit('select', i);
    },

    showComboboxList () {
      if (this.showList != null) { return; }
      this.$refs.comboboxWithPopover?.showComboboxList();
    },

    closeComboboxList () {
      if (this.showList != null) { return; }
      this.$refs.comboboxWithPopover?.closeComboboxList();
    },

    getChips () {
      if (!this.selectedItems.length || !this.$refs.chips) return null;

      // Use the order from selectedItems to not rely on DOM order which may be stale.
      // Track matched indices to handle duplicate item names correctly.
      const matched = new Set();
      const chips = this.selectedItems.map(item => {
        return this.$refs.chips.find((chip, index) => {
          if (matched.has(index)) return false;
          const chipLabel = returnFirstEl(chip.$el)?.querySelector('.d-chip__label')?.textContent?.trim();
          if (chipLabel === item) {
            matched.add(index);
            return true;
          }
          return false;
        });
      });
      return chips.filter(Boolean).map(chip => returnFirstEl(chip.$el));
    },

    getChipButtons () {
      const chips = this.getChips();
      return chips && chips.map(chip => returnFirstEl(chip).querySelector('button'));
    },

    getLastChipButton () {
      const chipButtons = this.getChipButtons();
      return chipButtons && chipButtons[chipButtons.length - 1];
    },

    getLastChip () {
      const chips = this.getChips();
      return chips && chips[chips.length - 1];
    },

    getFirstChip () {
      const chips = this.getChips();
      return chips && chips[0];
    },

    getInput () {
      return this.$refs.input?.$refs.input;
    },

    onChipKeyDown (event) {
      const key = event.code?.toLowerCase();
      if (key === 'arrowleft') {
        // Move to the previous chip
        this.navigateBetweenChips(event.target, true);
      } else if (key === 'arrowright') {
        if (event.target.id === this.getLastChipButton().id) {
          // Move to the input if it's the last chip
          this.moveFromChipToInput();
        } else {
          // Move to the next chip
          this.navigateBetweenChips(event.target, false);
        }
      }
    },

    onInputKeyDown (event) {
      const key = event.key?.toLowerCase();
      // If the cursor is at the start of the text,
      // press 'backspace' or 'left' focuses the last chip
      if (this.selectedItems.length > 0 && event.target.selectionStart === 0) {
        // if there is selected text, do not focus the last chip
        if (event.target.selectionEnd !== event.target.selectionStart) {
          return;
        }
        if (key === 'backspace' || key === 'arrowleft') {
          this.moveFromInputToChip();
        }
      }
    },

    moveFromInputToChip () {
      this.getLastChipButton().focus();
      this.$refs.input?.blur();
      this.closeComboboxList();
    },

    moveFromChipToInput () {
      this.getLastChipButton().blur();
      this.$refs.input?.focus();
      this.showComboboxList();
    },

    navigateBetweenChips (target, toLeft) {
      const from = this.getChipButtons().indexOf(target);
      const to = toLeft ? from - 1 : from + 1;
      if (to < 0 || to >= this.$refs.chips?.length) {
        return;
      }
      this.getChipButtons()[from].blur();
      this.getChipButtons()[to].focus();
      this.closeComboboxList();
    },

    setChipsTopPosition () {
      // Centers the first row of chips on the input box's first line.
      // Two offsets have to be measured rather than derived: the input's
      // position within the slot wrapper (label and description heights vary),
      // and the chip's position within its own wrapper (the chips are atomic
      // inline boxes, so line-box metrics — not just the chip margin — decide
      // where the row starts).
      const input = this.getInput();
      const chipsWrapper = this.$refs.chipsWrapper;
      const firstChip = this.getFirstChip();
      if (!input || !chipsWrapper || !firstChip) return;

      const inputTop = input.getBoundingClientRect().top -
                       this.$refs.inputSlotWrapper.getBoundingClientRect().top;
      // The empty-input height, so chips stay on the first line rather than
      // recentering on the whole box once it grows to fit wrapped rows.
      const inputRowHeight = this.initialInputHeight || input.getBoundingClientRect().height;
      const chipRect = firstChip.getBoundingClientRect();
      const chipOffsetInWrapper = chipRect.top - chipsWrapper.getBoundingClientRect().top;

      const top = inputTop + (inputRowHeight - chipRect.height) / 2 - chipOffsetInWrapper;
      chipsWrapper.style.top = top + 'px';
    },

    setInputPadding () {
      const lastChip = this.getLastChip();
      const input = this.getInput();
      if (!input) return;
      this.revertInputPadding(input);
      this.popoverOffset = [0, 4];
      if (!lastChip) return;
      // Avoid adding extra padding when the input is not focused if collapseOnFocusOut is true
      // This ensures the input returns to its original state when resizing
      if (this.collapseOnFocusOut && !this.inputFocused) return;

      // Read while revertInputPadding() above has the inline override cleared,
      // so this is the input's own padding rather than a previous run's value.
      const inputPaddingTop = this.getComputedPx(input, 'paddingTop');

      // Get the position of the last chip
      // The input cursor should be the same "top" as that chip and next besides it
      const left = lastChip.offsetLeft + this.getFullWidth(lastChip);
      const spaceLeft = input.getBoundingClientRect().width - left;
      const firstChip = this.getFirstChip();
      const isWrapped = firstChip && lastChip.offsetTop > firstChip.offsetTop;

      if (spaceLeft > this.reservedRightSpace) {
        input.style.paddingInlineStart = left + 'px';
      } else {
        input.style.paddingInlineStart = '4px';
      }

      const caretRowTop = this.getCaretRowTop(lastChip, firstChip, spaceLeft > this.reservedRightSpace, isWrapped);
      if (caretRowTop != null) {
        // Adding the input's own padding reproduces the single-row layout on
        // the caret's row, so the typed text keeps the same baseline relative
        // to the chips beside it no matter how many rows have accumulated.
        input.style.paddingTop = `${caretRowTop + inputPaddingTop}px`;
        this.growInputForWrappedRows(input, caretRowTop);
      }
    },

    growInputForWrappedRows (input, caretRowTop) {
      // The grown box would otherwise end at the caret line, leaving the last
      // chip row flush against the block-end border. Extend the height floor
      // so the last row keeps the same breathing room the first row gets from
      // centering: its row top plus the single-row envelope.
      if (!this.initialInputHeight) return;
      input.style.minHeight = `${caretRowTop + this.initialInputHeight}px`;
    },

    getComputedPx (el, property) {
      return parseFloat(getComputedStyle(el)[property]) || 0;
    },

    // Distance from the first chip row to the row the caret belongs on.
    getCaretRowTop (lastChip, firstChip, hasSpace, isWrapped) {
      // Chip fits beside the cursor on the first row; CSS centers it already.
      if (hasSpace && !isWrapped) return null;
      // Measured rather than offsetTop, which rounds to whole pixels and drifts
      // further out of alignment with every row added.
      const rowTop = lastChip.getBoundingClientRect().top - firstChip.getBoundingClientRect().top;
      // Chip wrapped onto a new row with space remaining; share that row.
      if (hasSpace) return rowTop;
      // No space left on that row — predict the next one. Row spacing belongs
      // to the wrapper's row-gap, not to the chip.
      const rowGap = this.getComputedPx(this.$refs.chipsWrapper, 'rowGap');
      return rowTop + lastChip.getBoundingClientRect().height + rowGap;
    },

    revertInputPadding (input) {
      input.style.paddingInlineStart = '';
      // setInputPadding writes the physical paddingTop slot, so that is the
      // slot to clear — the logical one is a different CSSOM property.
      input.style.paddingTop = '';
      // Restore the single-row height floor that setInitialInputHeight
      // applies (setInputPadding grows it while rows are wrapped).
      input.style.minHeight = this.inputHeightFloor;
    },

    getFullWidth (el) {
      const styles = window.getComputedStyle(el);
      return el.offsetWidth + parseInt(styles.marginLeft) + parseInt(styles.marginRight);
    },

    setInputMinWidth () {
      // Ensure the width of the input is "slightly bigger" than the width of a single chip
      const firstChip = this.getFirstChip();
      const input = this.getInput();
      if (!input) return;
      if (firstChip) {
        // Add 4px buffer for typing room
        input.style.minWidth = (this.getFullWidth(firstChip) + 4) + 'px';
      } else {
        input.style.minWidth = '';
      }
    },

    checkMaxSelected () {
      if (this.maxSelected === 0) return;
      if (this.selectedItems.length > this.maxSelected) {
        this.showValidationMessages = true;
        this.$emit('max-selected');
      } else {
        this.showValidationMessages = false;
      }
    },

    setInitialInputHeight () {
      const input = this.getInput();
      if (!input) return;
      input.style.minHeight = '';
      input.style.height = '';
      this.initialInputHeight = input.getBoundingClientRect().height;
      // xs renders correctly without a min-height floor; other sizes need it to grow when chips wrap.
      if (this.size !== 'xs') {
        input.style.minHeight = `${this.initialInputHeight}px`;
        input.style.height = 'auto';
      }
    },

    async handleInputFocusIn () {
      this.inputFocused = true;
      if (this.collapseOnFocusOut) {
        this.hideInputText = false;
        await this.$nextTick();
        this.setInputPadding();
      }
    },

    async handleInputFocusOut () {
      this.inputFocused = false;
      if (this.collapseOnFocusOut) {
        this.hideInputText = true;
        const input = this.getInput();
        if (!input) return;
        // Hide the input text when is not on first line
        if (!input.style.paddingTop) {
          return;
        }
        this.revertInputPadding(input);
      }
    },
  },
};
</script>
