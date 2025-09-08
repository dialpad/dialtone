<template>
  <dt-stack
    direction="row"
    gap="200"
    class="d-recipe-message-input__button-stack"
  >
    <dt-recipe-message-input-button
      :aria-label="boldButtonLabel['aria-label']"
      :tooltip-text="boldButtonLabel['tooltip-text']"
      :keyboard-shortcut-text="boldButtonOptions.keyboardShortcutText"
      data-qa="bold"
      :is-active="isSelectionActive('bold')"
      @click="$emit('click', 'bold', $event)"
    >
      <template #icon>
        <dt-icon-bold
          class="d-recipe-message-input__button-stack-icon"
          size="200"
        />
      </template>
    </dt-recipe-message-input-button>
    <dt-recipe-message-input-button
      :aria-label="italicButtonLabel['aria-label']"
      :tooltip-text="italicButtonLabel['tooltip-text']"
      :keyboard-shortcut-text="italicButtonOptions.keyboardShortcutText"
      data-qa="italic"
      :is-active="isSelectionActive('italic')"
      @click="$emit('click', 'italic', $event)"
    >
      <template #icon>
        <dt-icon-italic
          class="d-recipe-message-input__button-stack-icon"
          size="200"
        />
      </template>
    </dt-recipe-message-input-button>
    <dt-recipe-message-input-button
      :aria-label="strikeButtonLabel['aria-label']"
      :tooltip-text="strikeButtonLabel['tooltip-text']"
      :keyboard-shortcut-text="strikeButtonOptions.keyboardShortcutText"
      data-qa="strikethrough"
      :is-active="isSelectionActive('strike')"
      @click="$emit('click', 'strike', $event)"
    >
      <template #icon>
        <dt-icon-strikethrough
          class="d-recipe-message-input__button-stack-icon"
          size="200"
        />
      </template>
    </dt-recipe-message-input-button>
    <div class="d-recipe-message-input--button-group-divider" />

    <!-- @slot special slot for link button, since links require a custom dialog -->
    <slot name="link" />

    <div class="d-recipe-message-input--button-group-divider" />

    <dt-recipe-message-input-button
      :aria-label="bulletListButtonLabel['aria-label']"
      :tooltip-text="bulletListButtonLabel['tooltip-text']"
      :keyboard-shortcut-text="bulletListButtonOptions.keyboardShortcutText"
      data-qa="bullet-list"
      :is-active="isSelectionActive('bulletList')"
      @click="$emit('click', 'bulletList', $event)"
    >
      <template #icon>
        <dt-icon-list-bullet
          class="d-recipe-message-input__button-stack-icon"
          size="200"
        />
      </template>
    </dt-recipe-message-input-button>
    <dt-recipe-message-input-button
      :aria-label="orderedListButtonLabel['aria-label']"
      :tooltip-text="orderedListButtonLabel['tooltip-text']"
      :keyboard-shortcut-text="orderedListButtonOptions.keyboardShortcutText"
      data-qa="ordered-list"
      :is-active="isSelectionActive('orderedList')"
      @click="$emit('click', 'orderedList', $event)"
    >
      <template #icon>
        <dt-icon-list-ordered
          class="d-recipe-message-input__button-stack-icon"
          size="200"
        />
      </template>
    </dt-recipe-message-input-button>
    <div class="d-recipe-message-input--button-group-divider" />

    <dt-recipe-message-input-button
      :aria-label="blockQuoteButtonLabel['aria-label']"
      :tooltip-text="blockQuoteButtonLabel['tooltip-text']"
      :keyboard-shortcut-text="blockQuoteButtonOptions.keyboardShortcutText"
      data-qa="blockquote"
      :is-active="isSelectionActive('blockquote')"
      @click="$emit('click', 'blockquote', $event)"
    >
      <template #icon>
        <dt-icon-quote
          class="d-recipe-message-input__button-stack-icon"
          size="200"
        />
      </template>
    </dt-recipe-message-input-button>

    <div class="d-recipe-message-input--button-group-divider" />

    <dt-recipe-message-input-button
      :aria-label="codeButtonLabel['aria-label']"
      :tooltip-text="codeButtonLabel['tooltip-text']"
      :keyboard-shortcut-text="codeButtonOptions.keyboardShortcutText"
      data-qa="code"
      :is-active="isSelectionActive('code')"
      @click="$emit('click', 'code', $event)"
    >
      <template #icon>
        <dt-icon-code
          class="d-recipe-message-input__button-stack-icon"
          size="200"
        />
      </template>
    </dt-recipe-message-input-button>
    <dt-recipe-message-input-button
      :aria-label="codeBlockButtonLabel['aria-label']"
      :tooltip-text="codeBlockButtonLabel['tooltip-text']"
      :keyboard-shortcut-text="codeBlockButtonOptions.keyboardShortcutText"
      data-qa="code-block"
      :is-active="isSelectionActive('codeBlock')"
      @click="$emit('click', 'codeBlock', $event)"
    >
      <template #icon>
        <dt-icon-code-block
          class="d-recipe-message-input__button-stack-icon"
          size="200"
        />
      </template>
    </dt-recipe-message-input-button>
  </dt-stack>
</template>

<script>
import { DtStack } from '@/components/stack';
import {
  DtIconListBullet,
  DtIconBold,
  DtIconItalic,
  DtIconStrikethrough,
  DtIconListOrdered,
  DtIconQuote,
  DtIconCode,
  DtIconCodeBlock,
} from '@dialpad/dialtone-icons/vue3';
import DtRecipeMessageInputButton from './message_input_button.vue';
import { DialtoneLocalization } from '@/localization';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeMessageInputTopbar',
  components: {
    DtStack,
    DtIconListBullet,
    DtIconBold,
    DtIconItalic,
    DtIconStrikethrough,
    DtIconListOrdered,
    DtIconQuote,
    DtIconCode,
    DtIconCodeBlock,
    DtRecipeMessageInputButton,
  },

  props: {
    boldButtonOptions: {
      type: Object,
      default: () => ({}),
    },

    italicButtonOptions: {
      type: Object,
      default: () => ({}),
    },

    strikeButtonOptions: {
      type: Object,
      default: () => ({}),
    },

    bulletListButtonOptions: {
      type: Object,
      default: () => ({}),
    },

    orderedListButtonOptions: {
      type: Object,
      default: () => ({}),
    },

    blockQuoteButtonOptions: {
      type: Object,
      default: () => ({}),
    },

    codeButtonOptions: {
      type: Object,
      default: () => ({}),
    },

    codeBlockButtonOptions: {
      type: Object,
      default: () => ({}),
    },

    isSelectionActive: {
      type: Function,
      default: () => {},
    },
  },

  emits: ['click'],

  data () {
    return {
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    boldButtonLabel () { return this.i18n.$ta('DIALTONE_MESSAGE_INPUT_BOLD_BUTTON_LABEL'); },
    italicButtonLabel () { return this.i18n.$ta('DIALTONE_MESSAGE_INPUT_ITALIC_BUTTON_LABEL'); },
    strikeButtonLabel () { return this.i18n.$ta('DIALTONE_MESSAGE_INPUT_STRIKETHROUGH_BUTTON_LABEL'); },
    bulletListButtonLabel () { return this.i18n.$ta('DIALTONE_MESSAGE_INPUT_BULLET_LIST_BUTTON_LABEL'); },
    orderedListButtonLabel () { return this.i18n.$ta('DIALTONE_MESSAGE_INPUT_ORDERED_LIST_BUTTON_LABEL'); },
    blockQuoteButtonLabel () { return this.i18n.$ta('DIALTONE_MESSAGE_INPUT_BLOCK_QUOTE_BUTTON_LABEL'); },
    codeButtonLabel () { return this.i18n.$ta('DIALTONE_MESSAGE_INPUT_CODE_BUTTON_LABEL'); },
    codeBlockButtonLabel () { return this.i18n.$ta('DIALTONE_MESSAGE_INPUT_CODE_BLOCK_BUTTON_LABEL'); },
  },
};
</script>
