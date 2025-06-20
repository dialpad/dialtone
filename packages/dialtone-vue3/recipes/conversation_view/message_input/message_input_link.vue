<template>
  <dt-popover
    :open="isOpen"
    placement="bottom-start"
    content-class="d-recipe-message-input__link-popover"
    :visually-hidden-close="true"
    :visually-hidden-close-label="linkButtonOptions.visuallyHiddenCloseText"
    data-qa="dt-message-input-link-popover"
    :show-close-button="false"
    @opened="$emit('opened', $event)"
  >
    <template #anchor>
      <dt-recipe-message-input-button
        :aria-label="linkButtonOptions.ariaLabel"
        :tooltip-text="linkButtonOptions.tooltipText"
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
          v-if="linkButtonOptions.dialogTitle.length > 0"
          class="d-recipe-message-input__link-dialog-title"
        >
          {{ linkButtonOptions.dialogTitle }}
        </div>
        <dt-input
          v-model="linkText"
          :input-aria-label="linkButtonOptions.textLabel"
          size="xs"
          data-qa="dt-message-input-link-text-input"
          :label="linkButtonOptions.textLabel"
          input-wrapper-class="d-recipe-message-input__link-input"
          @click.stop
          @focus.stop
          @keydown.enter="$emit('set-link', linkText, linkInput)"
        />
        <dt-input
          v-model="linkInput"
          :input-aria-label="linkButtonOptions.linkLabel"
          size="xs"
          data-qa="dt-message-input-link-input"
          :placeholder="linkButtonOptions.linkPlaceholder"
          :label="linkButtonOptions.linkLabel"
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
            :aria-label="linkButtonOptions.removeLabel"
            importance="clear"
            kind="danger"
            size="md"
            data-qa="dt-message-input-link-remove-btn"
            @click="$emit('remove-link', linkText, linkInput)"
          >
            {{ linkButtonOptions.removeLabel }}
          </dt-button>
          <dt-stack
            direction="row"
            gap="400"
          >
            <dt-button
              :aria-label="linkButtonOptions.cancelLabel"
              importance="clear"
              kind="muted"
              size="md"
              data-qa="dt-message-input-link-cancel-btn"
              @click="isOpen = false"
            >
              {{ linkButtonOptions.cancelLabel }}
            </dt-button>
            <dt-button
              size="md"
              :aria-label="linkButtonOptions.confirmLabel"
              data-qa="dt-message-input-link-confirm-btn"
              @click="$emit('set-link', linkText, linkInput)"
            >
              {{ linkButtonOptions.confirmLabel }}
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
