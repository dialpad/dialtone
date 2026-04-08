<template>
  <dt-stack
    gap="200"
    class="d-p-100"
  >
    <!-- ── Item opt-out ──────────────────────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Item opt-out
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Add <code>data-dt-focusgroup-skip</code> to exclude an element from
      arrow-key navigation (e.g., text inputs that need their own arrow keys).
    </dt-text>
    <dt-stack
      v-dt-focusgroup="'horizontal'"
      direction="row"
      gap="100"
      role="toolbar"
      aria-label="Formatting with opt-out"
    >
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Bold
      </dt-button>
      <dt-input
        data-dt-focusgroup-skip
        placeholder="This will be skipped"
      />
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Code
      </dt-button>
      <dt-link data-dt-focusgroup-skip>
        Skipped Text link
      </dt-link>
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Code
      </dt-button>
    </dt-stack>

    <!-- ── Mixed focusable elements ──────────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Mixed focusable elements
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      The directive cycles through any focusable element matched by the selector,
      regardless of element type.
    </dt-text>
    <dt-stack
      v-dt-focusgroup="'horizontal'"
      direction="row"
      gap="100"
      role="toolbar"
      aria-label="Mixed elements"
    >
      <dt-button
        kind="muted"
        importance="outlined"
      >
        Button
      </dt-button>
      <dt-link>Link</dt-link>
      <dt-select-menu
        :options="[
          { value: '', label: 'Please select one' },
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
        ]"
        label="Default"
        :label-visible="false"
      />
    </dt-stack>

    <!-- ── Nesting depth ─────────────────────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Nesting depth
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Items do not need to be direct children. The directive uses
      <code>querySelectorAll</code> on the container, finding items at any
      nesting depth in DOM order.
    </dt-text>
    <dt-stack
      v-dt-focusgroup="'horizontal'"
      direction="row"
      gap="100"
      role="toolbar"
      aria-label="Nested groups"
    >
      <dt-stack
        direction="row"
        gap="100"
        class="d-bgc-moderate-opaque d-p-100"
      >
        <dt-button
          kind="muted"
          importance="outlined"
        >
          btn
        </dt-button>
        <dt-button
          kind="muted"
          importance="outlined"
        >
          btn
        </dt-button>
        <dt-button
          kind="muted"
          importance="outlined"
        >
          btn
        </dt-button>
      </dt-stack>
      <dt-stack
        direction="row"
        gap="100"
        class="d-bgc-moderate-opaque d-p-100"
      >
        <dt-button
          kind="muted"
          importance="outlined"
        >
          btn
        </dt-button>
        <dt-button
          kind="muted"
          importance="outlined"
        >
          btn
        </dt-button>
      </dt-stack>
      <dt-stack
        direction="row"
        gap="100"
        class="d-bgc-moderate-opaque d-p-100"
      >
        <dt-link>text link a</dt-link>
        <dt-link>text link b</dt-link>
      </dt-stack>
    </dt-stack>

    <!-- ── Object syntax ─────────────────────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Object syntax
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Use object syntax for properties without token equivalents like
      <code>selector</code>.
      <code>v-dt-focusgroup="{ axis: 'vertical', loop: false }"</code>
    </dt-text>
    <dt-stack
      v-dt-focusgroup="{ axis: 'vertical', loop: false }"
      gap="100"
      role="listbox"
      aria-label="Fruits"
    >
      <dt-button
        role="option"
        kind="muted"
        importance="outlined"
      >
        Apple
      </dt-button>
      <dt-button
        role="option"
        kind="muted"
        importance="outlined"
      >
        Banana
      </dt-button>
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtStack from '@/components/stack/stack.vue';
import DtText from '@/components/text/text.vue';
import DtButton from '@/components/button/button.vue';
import DtLink from '@/components/link/link.vue';
import DtInput from '@/components/input/input.vue';
import DtSelectMenu from '@/components/select_menu/select_menu.vue';

export default {
  name: 'DtFocusgroupDirectiveAdvanced',
  components: { DtStack, DtText, DtButton, DtLink, DtInput, DtSelectMenu },
};
</script>
