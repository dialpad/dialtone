<template>
  <dt-stack
    gap="200"
    class="d-p-100"
  >
    <dt-stack>
      <dt-text
        as="h2"
        kind="headline"
        :size="600"
      >
        Default Example
      </dt-text>
    </dt-stack>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Horizontal toolbar with looping. Left/Right cycles buttons. Home/End jump to first/last.
      Disabled item is skipped.
      <code>v-dt-focusgroup="'horizontal'"</code>
    </dt-text>
    <dt-stack
      v-dt-focusgroup="'horizontal'"
      direction="row"
      gap="100"
      role="toolbar"
      aria-label="Text formatting"
    >
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Bold
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Italic
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Underline
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
        aria-disabled="true"
        class="d-btn--disabled"
      >
        Strikethrough (disabled)
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Code
      </dt-button>
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtStack from '@/components/stack/stack.vue';
import DtText from '@/components/text/text.vue';
import DtButton from '@/components/button/button.vue';

export default {
  name: 'DtFocusgroupDirectiveDefault',
  components: { DtStack, DtText, DtButton },
};
</script>
