<!-- eslint-disable max-lines -->
<template>
  <dt-recipe-combobox-with-popover
    ref="comboboxWithPopover"
    :label="label"
    :show-list="showList"
    :max-height="listMaxHeight"
    :popover-offset="popoverOffset"
    :has-suggestion-list="hasSuggestionList"
    :visually-hidden-close-label="visuallyHiddenCloseLabel"
    :visually-hidden-close="visuallyHiddenClose"
    content-width="anchor"
    :append-to="appendTo"
    @select="onComboboxSelect"
  >
    <template #input="{ onInput }">
      <span
        ref="inputSlotWrapper"
        class="d-ps-relative d-d-block"
      >
        <span
          ref="chipsWrapper"
          class="d-ps-absolute d-mx2 d-pl1"
        >
          <dt-chip
            v-for="item in selectedItems"
            ref="chips"
            :key="item"
            :label-class="['d-chip__label']"
            :class="['d-mt4', 'd-mx2', 'd-zi-base1']"
            :close-button-props="{ ariaLabel: 'close' }"
            :size="CHIP_SIZES[size]"
            v-on="chipListeners"
            @keyup.backspace="onChipRemove(item)"
            @close="onChipRemove(item)"
          >
            {{ item }}
          </dt-chip>
        </span>

        <dt-input
          ref="input"
          v-model="value"
          class="d-fl-grow1"
          :aria-label="label"
          :label="labelVisible ? label : ''"
          :description="description"
          :placeholder="inputPlaceHolder"
          :show-messages="showInputMessages"
          :messages="inputMessages"
          :size="size"
          v-on="inputListeners"
          @input="onInput"
        />

        <dt-validation-messages
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
      >
        <slot
          name="header"
        />
      </div>
    </template>

    <!-- @slot slot for popover list -->
    <template #list>
      <div
        ref="list"
        @mousedown.prevent
      >
        <slot
          v-if="!loading"
          name="list"
        />
        <div
          v-else
          class="d-ta-center d-py16"
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
      >
        <slot
          name="footer"
        />
      </div>
    </template>
  </dt-recipe-combobox-with-popover>
</template>

<script>
import DtRecipeComboboxWithPopover from '@/recipes/comboboxes/combobox_with_popover/combobox_with_popover';
import DtInput from '@/components/input/input';
import DtChip from '@/components/chip/chip';
import DtValidationMessages from '@/components/validation_messages/validation_messages';
import { validationMessageValidator } from '@/common/validators';
import { hasSlotContent } from '@/common/utils';
import {
  POPOVER_APPEND_TO_VALUES,
} from '@/components/popover/popover_constants';
import {
  MULTI_SELECT_SIZES,
  CHIP_SIZES,
  CHIP_TOP_POSITION,
} from './combobox_multi_select_story_constants';
import SrOnlyCloseButtonMixin from '@/common/mixins/sr_only_close_button';

export default {
  name: 'DtRecipeComboboxMultiSelect',

  components: {
    DtRecipeComboboxWithPopover,
    DtInput,
    DtChip,
    DtValidationMessages,
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
     * Size of the chip, one of `xs`, `sm`, `md`
     */
    size: {
      type: String,
      default: null,
      validator: (t) => Object.values(MULTI_SELECT_SIZES).includes(t),
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
     * Native input event
     *
     * @event input
     * @type {String }
     */
    'input',

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
     * Native keyup event
     *
     * @event keyup
     * @type {KeyboardEvent}
      */
    'keyup',
  ],

  data () {
    return {
      value: '',
      popoverOffset: [0, 4],
      showValidationMessages: false,
      initialInputPadding: {},
      resizeWindowObserver: null,
      originalInputSize: null,
      CHIP_SIZES,
      hasSlotContent,
    };
  },

  computed: {
    inputPlaceHolder () {
      return this.selectedItems?.length > 0 ? '' : this.placeholder;
    },

    chipListeners () {
      return {
        keyup: event => {
          this.onChipKeyup(event);
          this.$emit('keyup', event);
        },
      };
    },

    inputListeners () {
      return {
        input: event => {
          this.$emit('input', event);
          if (this.hasSuggestionList) {
            this.showComboboxList();
          }
        },

        keyup: event => {
          this.onInputKeyup(event);
          this.$emit('keyup', event);
        },

        click: event => {
          if (this.hasSuggestionList) {
            this.showComboboxList();
          }
        },
      };
    },
  },

  watch: {
    selectedItems: {
      deep: true,
      immediate: true,
      handler: async function () {
        await this.$nextTick();
        this.setInputPadding();
        this.setChipsTopPosition();
        this.setInputMinWidth();
        this.checkMaxSelected();
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
        this.originalInputSize = input.getBoundingClientRect().height;
        this.setInputPadding();
        this.setChipsTopPosition();
      },

      immediate: true,
    },
  },

  mounted () {
    // Recalculate chip position and input padding when resizing window
    this.resizeWindowObserver = new ResizeObserver(async () => {
      this.setChipsTopPosition();
      this.setInputPadding();
    });
    this.resizeWindowObserver.observe(document.body);
  },

  beforeUnmount () {
    this.resizeWindowObserver?.unobserve(document.body);
  },

  methods: {
    onChipRemove (item) {
      this.$emit('remove', item);
      this.$refs.input.focus();
    },

    onComboboxSelect (i) {
      this.value = '';
      this.$emit('select', i);
    },

    showComboboxList () {
      if (this.showList != null) { return; }
      this.$refs.comboboxWithPopover.showComboboxList();
    },

    closeComboboxList () {
      if (this.showList != null) { return; }
      this.$refs.comboboxWithPopover.closeComboboxList();
    },

    getChipButtons () {
      return this.$refs.chips && this.$refs.chips.map(chip => chip.$el.querySelector('button'));
    },

    getChips () {
      return this.$refs.chips && this.$refs.chips.map(chip => chip.$el);
    },

    getLastChipButton () {
      return this.$refs.chips && this.getChipButtons()[this.getChipButtons().length - 1];
    },

    getLastChip () {
      return this.$refs.chips && this.getChips()[this.getChips().length - 1];
    },

    getFirstChip () {
      return this.$refs.chips && this.getChips()[0];
    },

    getInput () {
      return this.$refs.input?.$refs.input;
    },

    onChipKeyup (event) {
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

    onInputKeyup (event) {
      const key = event.code?.toLowerCase();
      // If the cursor is at the start of the text,
      // press 'backspace' or 'left' focuses the last chip
      if (this.selectedItems.length > 0 && event.target.selectionStart === 0) {
        if (key === 'backspace' || key === 'arrowleft') {
          this.moveFromInputToChip();
        }
      }
    },

    moveFromInputToChip () {
      this.getLastChipButton().focus();
      this.$refs.input.blur();
      this.closeComboboxList();
    },

    moveFromChipToInput () {
      this.getLastChipButton().blur();
      this.$refs.input.focus();
      this.showComboboxList();
    },

    navigateBetweenChips (target, toLeft) {
      const from = this.getChipButtons().indexOf(target);
      const to = toLeft ? from - 1 : from + 1;
      if (to < 0 || to >= this.$refs.chips.length) {
        return;
      }
      this.getChipButtons()[from].blur();
      this.getChipButtons()[to].focus();
      this.closeComboboxList();
    },

    setChipsTopPosition () {
      // To place the chips in the input box
      // The chip "top" position should be the same line as the input box
      const input = this.getInput();
      if (!input) return;
      const inputSlotWrapper = this.$refs.inputSlotWrapper;
      const top = input.getBoundingClientRect().top -
                  inputSlotWrapper.getBoundingClientRect().top;
      const chipsWrapper = this.$refs.chipsWrapper;
      chipsWrapper.style.top = (top - CHIP_TOP_POSITION[this.size]) + 'px';
    },

    setInputPadding () {
      const lastChip = this.getLastChip();
      const input = this.getInput();
      const chipsWrapper = this.$refs.chipsWrapper;
      if (!input) return;
      this.revertInputPadding(input);
      this.popoverOffset = [0, 4];
      if (!lastChip) return;

      // Get the position of the last chip
      // The input cursor should be the same "top" as that chip and next besides it
      const left = lastChip.offsetLeft + this.getFullWidth(lastChip);
      input.style.paddingLeft = left + 'px';

      // Get the chip size minus the 4px padding
      const chipsSize = chipsWrapper.getBoundingClientRect().height - 4;

      // Get lastChip offsetTop plus 2px of the input padding.
      const top = lastChip.offsetTop + 2;

      // Add padding to Top only if the chips need more space
      if (chipsSize > this.originalInputSize) {
        input.style.paddingTop = `${top}px`;
      }
    },

    revertInputPadding (input) {
      input.style.paddingLeft = '';
      input.style.paddingTop = '';
      input.style.paddingBottom = '';
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
  },
};
</script>
