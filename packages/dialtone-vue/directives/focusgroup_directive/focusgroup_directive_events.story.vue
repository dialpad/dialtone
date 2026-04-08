<template>
  <dt-stack
    gap="200"
    class="d-p-100"
  >
    <!-- ── Tab list with selection follows focus ──────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Tab list — selection follows focus
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Left/Right cycles tabs. <code>@dt-focusgroup-move</code> drives selection.
      Click also selects. Disabled tab remains focusable (tablist default).
      <code>v-dt-focusgroup="'horizontal nomemory'"</code>
    </dt-text>
    <!-- v-dt-focusgroup manages focus on child tabs, not the container -->
    <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -->
    <dt-stack
      v-dt-focusgroup="'horizontal nomemory'"
      direction="row"
      gap="100"
      role="tablist"
      aria-label="Operating system"
      @dt-focusgroup-move="selectedTab = $event.detail.index"
      @click="selectTabByClick"
      @keydown.enter="selectTabByClick"
    >
      <dt-button
        v-for="(tab, index) in tabs"
        :key="tab.label"
        role="tab"
        kind="muted"
        importance="outlined"
        :active="selectedTab === index"
        :aria-selected="selectedTab === index ? 'true' : 'false'"
        :aria-disabled="tab.disabled ? 'true' : undefined"
        :class="tab.disabled ? 'd-btn--disabled' : ''"
      >
        {{ tab.label }}
      </dt-button>
    </dt-stack>
    <div
      class="d-p-300 d-ba d-bc-subtle d-bar8"
      role="tabpanel"
    >
      <dt-text kind="body">
        Selected: {{ tabs[selectedTab].label }}
      </dt-text>
    </div>

    <!-- ── Listbox with click selection ──────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Listbox — vertical, noloop
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Up/Down navigates. Does not loop. Disabled item skipped. Click to select.
      <code>v-dt-focusgroup="'vertical noloop'"</code>
    </dt-text>
    <dt-stack
      v-dt-focusgroup="'vertical noloop'"
      role="listbox"
      aria-label="Fruits"
      class="d-w-400"
    >
      <dt-button
        v-for="fruit in fruits"
        :key="fruit.label"
        role="option"
        kind="muted"
        importance="clear"
        :active="selectedFruit === fruit.label"
        :aria-selected="selectedFruit === fruit.label ? 'true' : 'false'"
        :aria-disabled="fruit.disabled ? 'true' : undefined"
        :disabled="fruit.disabled"
        @click="!fruit.disabled && (selectedFruit = fruit.label)"
      >
        {{ fruit.label }}{{ fruit.disabled ? ' (sold out)' : '' }}
        <template #startIcon>
          <dt-icon
            name="check"
            :size="200"
            :class="selectedFruit !== fruit.label ? 'd-o0' : ''"
          />
        </template>
      </dt-button>
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtStack from '@/components/stack/stack.vue';
import DtText from '@/components/text/text.vue';
import DtButton from '@/components/button/button.vue';
import DtIcon from '@/components/icon/icon.vue';
export default {
  name: 'DtFocusgroupDirectiveEvents',
  components: { DtStack, DtText, DtButton, DtIcon },

  data () {
    return {
      selectedTab: 0,
      tabs: [
        { label: 'Mac' },
        { label: 'Windows (disabled)', disabled: true },
        { label: 'Linux' },
      ],

      selectedFruit: 'Apple',
      fruits: [
        { label: 'Apple' },
        { label: 'Banana' },
        { label: 'Cherry', disabled: true },
        { label: 'Date' },
        { label: 'Elderberry' },
      ],
    };
  },

  methods: {
    selectTabByClick (event) {
      const tab = event.target.closest('[role="tab"]');
      if (!tab) return;
      const tablist = tab.closest('[role="tablist"]');
      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
      const index = tabs.indexOf(tab);
      if (index !== -1 && !this.tabs[index].disabled) {
        this.selectedTab = index;
      }
    },
  },
};
</script>
