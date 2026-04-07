<template>
  <dt-stack
    gap="500"
    class="d-p-100"
  >
    <!-- ── Radio group (both axes, default) ──────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Radio group — both axes (default)
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      All four arrow keys cycle options. Disabled option skipped.
      Uses <code>@dt-focusgroup-move</code> for selection-follows-focus.
      <code>v-dt-focusgroup</code>
    </dt-text>
    <div
      v-dt-focusgroup
      role="radiogroup"
      aria-label="Favorite color"
      class="d-d-flex d-fd-column d-gg-200"
      @dt-focusgroup-move="selectedColor = $event.detail.item.dataset.value"
    >
      <dt-button
        v-for="color in colors"
        :key="color.value"
        role="radio"
        :importance="selectedColor === color.value ? 'outlined' : 'clear'"
        :size="200"
        :data-value="color.value"
        :aria-checked="selectedColor === color.value ? 'true' : 'false'"
        :aria-disabled="color.disabled ? 'true' : undefined"
        class="d-as-start"
      >
        {{ color.label }}
      </dt-button>
    </div>

    <!-- ── Vertical menu (block wrap) ────────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Vertical menu — block wrap
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Up/Down cycles menu items. Wraps around.
      <code>v-dt-focusgroup="'block wrap'"</code>
    </dt-text>
    <div
      v-dt-focusgroup="'block wrap'"
      role="menu"
      aria-label="File actions"
      class="d-ba d-bc-subtle d-bar8 d-w264 d-of-hidden"
    >
      <dt-list-item
        role="menuitem"
      >
        New File
      </dt-list-item>
      <dt-list-item
        role="menuitem"
      >
        Open
      </dt-list-item>
      <dt-list-item
        role="menuitem"
        aria-disabled="true"
      >
        Save (disabled)
      </dt-list-item>
      <dt-list-item
        role="menuitem"
      >
        Export
      </dt-list-item>
    </div>
  </dt-stack>
</template>

<script>
import DtStack from '@/components/stack/stack.vue';
import DtText from '@/components/text/text.vue';
import DtButton from '@/components/button/button.vue';
import DtListItem from '@/components/list_item/list_item.vue';

export default {
  name: 'DtFocusgroupDirectiveVariants',
  components: { DtStack, DtText, DtButton, DtListItem },

  data () {
    return {
      selectedColor: 'blue',
      colors: [
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green', disabled: true },
        { value: 'yellow', label: 'Yellow' },
      ],
    };
  },
};
</script>
