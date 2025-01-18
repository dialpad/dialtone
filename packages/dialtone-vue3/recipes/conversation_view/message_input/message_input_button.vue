<template>
  <dt-tooltip>
    <template #anchor>
      <dt-button
        :data-qa="dataQa"
        importance="clear"
        kind="muted"
        :aria-label="ariaLabel"
        size="xs"
        :active="isActive"
        @click="$emit('click', $event)"
      >
        <template #icon>
          <slot name="icon" />
        </template>
      </dt-button>
    </template>
    <dt-stack gap="200">
      <p>{{ tooltipText }}</p>
      <dt-keyboard-shortcut
        inverted
        :shortcut="keyboardShortcutText"
      />
    </dt-stack>
  </dt-tooltip>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtTooltip } from '@/components/tooltip';
import { DtStack } from '@/components/stack';
import { DtKeyboardShortcut } from '@/components/keyboard_shortcut';
export default {
  name: 'DtRecipeMessageInputButton',
  components: {
    DtButton,
    DtTooltip,
    DtStack,
    DtKeyboardShortcut,
  },

  props: {
    ariaLabel: {
      type: String,
      required: true,
    },

    tooltipText: {
      type: String,
      required: true,
    },

    keyboardShortcutText: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      required: true,
    },

    dataQa: {
      type: String,
      required: true,
    },
  },

  emits: ['click'],
};
</script>
