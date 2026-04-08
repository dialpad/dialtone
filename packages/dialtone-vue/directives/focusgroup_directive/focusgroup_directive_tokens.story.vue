<template>
  <dt-stack
    gap="200"
    class="d-p-100"
  >
    <!-- ── vertical ──────────────────────────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      vertical
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Up/Down only. <code>v-dt-focusgroup="'vertical'"</code>
    </dt-text>
    <dt-stack
      v-dt-focusgroup="'vertical'"
      gap="100"
      role="toolbar"
      aria-orientation="vertical"
      aria-label="Formatting"
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
    </dt-stack>

    <!-- ── noloop ────────────────────────────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      noloop
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Focus stops at boundaries. <code>v-dt-focusgroup="'horizontal noloop'"</code>
    </dt-text>
    <dt-stack
      v-dt-focusgroup="'horizontal noloop'"
      direction="row"
      gap="100"
      role="toolbar"
      aria-label="Pagination"
    >
      <dt-button
        kind="muted"
        importance="outlined"
      >
        First
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Previous
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Next
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Last
      </dt-button>
    </dt-stack>

    <!-- ── nomemory ──────────────────────────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      nomemory
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Tab out and back in — focus always returns to first item.
      <code>v-dt-focusgroup="'horizontal nomemory'"</code>
    </dt-text>
    <dt-stack
      v-dt-focusgroup="'horizontal nomemory'"
      direction="row"
      gap="100"
      role="toolbar"
      aria-label="Actions"
    >
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Cut
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Copy
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Paste
      </dt-button>
    </dt-stack>

    <!-- ── disabled items (skipped by default) ───────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Disabled items — skipped by default
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Arrow keys skip the disabled item.
    </dt-text>
    <dt-stack
      v-dt-focusgroup="'horizontal'"
      direction="row"
      gap="100"
      role="toolbar"
      aria-label="Tools"
    >
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Pen
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
        aria-disabled="true"
        class="d-btn--disabled"
      >
        Eraser (disabled)
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Highlighter
      </dt-button>
    </dt-stack>

    <!-- ── noskipdisabled (tablist) ──────────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      noskipdisabled — tablist default
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Disabled tab remains focusable (WAI-ARIA Tabs convention).
      <code>role="tablist"</code> defaults to <code>noskipdisabled</code>.
    </dt-text>
    <dt-stack
      v-dt-focusgroup="'horizontal nomemory'"
      direction="row"
      gap="100"
      role="tablist"
      aria-label="Platforms"
    >
      <dt-button
        role="tab"
        kind="muted"
        importance="outlined"
      >
        Mac
      </dt-button>
      <dt-button
        role="tab"
        kind="muted"
        importance="outlined"
        aria-disabled="true"
        class="d-btn--disabled"
      >
        Windows (disabled)
      </dt-button>
      <dt-button
        role="tab"
        kind="muted"
        importance="outlined"
      >
        Linux
      </dt-button>
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtStack from '@/components/stack/stack.vue';
import DtText from '@/components/text/text.vue';
import DtButton from '@/components/button/button.vue';

export default {
  name: 'DtFocusgroupDirectiveTokens',
  components: { DtStack, DtText, DtButton },
};
</script>
