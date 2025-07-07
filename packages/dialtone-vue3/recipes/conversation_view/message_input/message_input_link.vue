<template>
  <dt-popover
    :open="isOpen"
    placement="bottom-start"
    content-class="d-recipe-message-input__link-popover"
    data-qa="dt-message-input-link-popover"
    :show-close-button="false"
    @opened="$emit('opened', $event)"
  >
    <template #anchor>
      <dt-recipe-message-input-button
        :aria-label="anchorButtonLabel['aria-label']"
        :tooltip-text="anchorButtonLabel['tooltip-text']"
        :keyboard-shortcut-text="linkButtonOptions.keyboardShortcutText"
        data-qa="message-input-link-btn"
        :is-active="isSelectionActive('link')"
        @click="isOpen = true"
      >
        <template #icon>
          <dt-icon-link2
            class="d-recipe-message-input__button-stack-icon"
            size="200"
          />
        </template>
      </dt-recipe-message-input-button>
    </template>

    <template #content>
      <dt-stack gap="500">
        <div
          class="d-recipe-message-input__link-dialog-title"
        >
          {{ i18n.$t('DIALTONE_MESSAGE_INPUT_LINK_DIALOG_TITLE') }}
        </div>
        <dt-input
          v-model="linkText"
          :input-aria-label="textInputLabel"
          size="xs"
          data-qa="dt-message-input-link-text-input"
          :label="textInputLabel"
          input-wrapper-class="d-recipe-message-input__link-input"
          @click.stop
          @focus.stop
          @keydown.enter="$emit('set-link', linkText, linkInput)"
        />
        <dt-input
          v-model="linkInput"
          :input-aria-label="linkInputLabel"
          size="xs"
          data-qa="dt-message-input-link-input"
          :placeholder="linkInputPlaceHolder"
          :label="linkInputLabel"
          input-wrapper-class="d-recipe-message-input__link-input"
          @click.stop
          @focus.stop
          @keydown.enter="$emit('set-link', linkText, linkInput)"
        />
        <dt-stack
          direction="row"
          class="d-recipe-message-input__link-dialog-buttons"
        >
          <dt-button
            :aria-label="removeButtonLabel"
            :title="removeButtonLabel"
            importance="clear"
            kind="danger"
            size="md"
            data-qa="dt-message-input-link-remove-btn"
            @click="$emit('remove-link', linkText, linkInput)"
          >
            {{ removeButtonLabel }}
          </dt-button>
          <dt-stack
            direction="row"
            gap="400"
          >
            <dt-button
              :aria-label="cancelButtonLabel"
              :title="cancelButtonLabel"
              importance="clear"
              kind="muted"
              size="md"
              data-qa="dt-message-input-link-cancel-btn"
              @click="isOpen = false"
            >
              {{ cancelButtonLabel }}
            </dt-button>
            <dt-button
              size="md"
              :aria-label="confirmButtonLabel"
              :title="confirmButtonLabel"
              data-qa="dt-message-input-link-confirm-btn"
              @click="$emit('set-link', linkText, linkInput)"
            >
              {{ confirmButtonLabel }}
            </dt-button>
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </template>
  </dt-popover>
</template>

<script>
import { DtPopover } from '@/components/popover';
import { DtInput } from '@/components/input';
import { DtButton } from '@/components/button';
import { DtStack } from '@/components/stack';
import { DtIconLink2 } from '@dialpad/dialtone-icons/vue3';
import DtRecipeMessageInputButton from './message_input_button.vue';
import { DtLocalizationMixin } from '@/common/mixins';

export default {
  compatConfig: { MODE: 3 },
  name: 'MessageInputLink',

  components: {
    DtPopover,
    DtInput,
    DtButton,
    DtStack,
    DtIconLink2,
    DtRecipeMessageInputButton,
  },

  mixins: [DtLocalizationMixin],

  props: {
    open: {
      type: Boolean,
      default: false,
    },

    linkButtonOptions: {
      type: Object,
      required: true,
    },

    isSelectionActive: {
      type: Function,
      default: () => {},
    },
  },

  emits: ['set-link', 'remove-link', 'opened'],

  data () {
    return {
      linkText: '',
      linkInput: '',
      isOpen: false,
    };
  },

  computed: {
    anchorButtonLabel () { return this.i18n.$ta('DIALTONE_MESSAGE_INPUT_LINK_BUTTON_LABEL'); },
    textInputLabel () { return this.i18n.$t('DIALTONE_MESSAGE_INPUT_LINK_TEXT_LABEL'); },
    linkInputLabel () { return this.i18n.$t('DIALTONE_MESSAGE_INPUT_LINK_LINK_LABEL'); },
    linkInputPlaceHolder () { return this.i18n.$t('DIALTONE_MESSAGE_INPUT_LINK_LINK_PLACEHOLDER'); },
    removeButtonLabel () { return this.i18n.$t('DIALTONE_MESSAGE_INPUT_LINK_REMOVE_LABEL'); },
    cancelButtonLabel () { return this.i18n.$t('DIALTONE_MESSAGE_INPUT_LINK_CANCEL_LABEL'); },
    confirmButtonLabel () { return this.i18n.$t('DIALTONE_MESSAGE_INPUT_LINK_CONFIRM_LABEL'); },
  },

  watch: {
    open: {
      immediate: true,
      handler (value) {
        this.isOpen = value;
      },
    },
  },

  methods: {
    setInitialValues (linkText, linkInput) {
      this.linkText = linkText;
      this.linkInput = linkInput;
    },
  },
};
</script>
