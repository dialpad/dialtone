<template>
  <dt-stack
    gap="500"
    class="d-p-100"
  >
    <!-- ── Toolbar (inline loop) ─────────────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Toolbar — inline loop
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Left/Right cycles buttons. Home/End jump to first/last.
      <code>v-dt-focusgroup="'horizontal'"</code>
    </dt-text>
    <div
      v-dt-focusgroup="'horizontal'"
      role="toolbar"
      aria-label="Text formatting"
      class="d-d-flex d-gg-300"
    >
      <dt-button
        importance="outlined"
        :size="200"
      >
        Bold
      </dt-button>
      <dt-button
        importance="outlined"
        :size="200"
      >
        Italic
      </dt-button>
      <dt-button
        importance="outlined"
        :size="200"
      >
        Underline
      </dt-button>
      <dt-button
        importance="outlined"
        :size="200"
        aria-disabled="true"
      >
        Strikethrough (disabled)
      </dt-button>
      <dt-button
        importance="outlined"
        :size="200"
      >
        Code
      </dt-button>
    </div>

    <!-- ── Tab list (inline loop nomemory) ────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Tab list — inline loop nomemory
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Left/Right cycles tabs. <code>@dt-focusgroup-move</code> for selection-follows-focus.
      <code>v-dt-focusgroup="'horizontal nomemory'"</code>
    </dt-text>
    <!-- v-dt-focusgroup manages focus on child tabs, not the container -->
    <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -->
    <div
      v-dt-focusgroup="'horizontal nomemory'"
      role="tablist"
      aria-label="Operating system"
      class="d-d-flex d-gg-300"
      @dt-focusgroup-move="selectedTab = $event.detail.index"
      @click="selectTabByClick"
      @keydown.enter="selectTabByClick"
    >
      <dt-button
        v-for="(tab, index) in tabs"
        :key="tab.label"
        role="tab"
        :active="selectedTab === index"
        :importance="selectedTab === index ? 'outlined' : 'clear'"
        :size="200"
        :aria-selected="selectedTab === index ? 'true' : 'false'"
        :aria-disabled="tab.disabled ? 'true' : undefined"
      >
        {{ tab.label }}
      </dt-button>
    </div>
    <div
      class="d-p-300 d-ba d-bc-subtle d-bar8"
      role="tabpanel"
    >
      <dt-text kind="body">
        Selected: {{ tabs[selectedTab].label }}
      </dt-text>
    </div>

    <!-- ── Listbox (block, noloop, disabled items) ────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Listbox — block, noloop
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Up/Down navigates. No loop. Disabled item skipped.
      <code>v-dt-focusgroup="'vertical noloop'"</code>
    </dt-text>
    <div
      v-dt-focusgroup="'vertical noloop'"
      role="listbox"
      aria-label="Fruits"
      class="d-ba d-bc-subtle d-bar8 d-of-hidden"
    >
      <dt-list-item
        v-for="fruit in fruits"
        :key="fruit.label"
        role="option"
        :aria-selected="selectedFruit === fruit.label ? 'true' : 'false'"
        :aria-disabled="fruit.disabled ? 'true' : undefined"
        :class="selectedFruit === fruit.label ? 'd-bgc-secondary' : ''"
        @click="!fruit.disabled && (selectedFruit = fruit.label)"
      >
        {{ fruit.label }}{{ fruit.disabled ? ' (sold out)' : '' }}
      </dt-list-item>
    </div>

    <!-- ── Treeview sidebar (block, consumer Left/Right) ──── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Treeview sidebar — block
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Up/Down cycles visible items. Right expands, Left collapses/goes to parent.
      <code>v-dt-focusgroup="'vertical'"</code>
    </dt-text>
    <div
      v-dt-focusgroup="'vertical'"
      role="tree"
      tabindex="0"
      aria-label="Sidebar navigation"
      class="d-ba d-bc-subtle d-bar8 d-w264 d-of-hidden"
      @keydown.right.prevent="expandOrEnter"
      @keydown.left.prevent="collapseOrParent"
    >
      <dt-list-item
        role="treeitem"
        class="d-fw-semibold"
      >
        Inbox
      </dt-list-item>
      <dt-list-item role="treeitem">
        Launchpad
      </dt-list-item>
      <dt-list-item
        role="treeitem"
        :aria-expanded="groupExpanded ? 'true' : 'false'"
        data-tree-group="ops"
        @click="groupExpanded = !groupExpanded"
      >
        {{ groupExpanded ? '▾' : '▸' }} Operations & Planning
      </dt-list-item>
      <template v-if="groupExpanded">
        <dt-list-item
          role="treeitem"
          class="d-pis-500"
          data-tree-parent="ops"
        >
          # company-announcements
        </dt-list-item>
        <dt-list-item
          role="treeitem"
          class="d-pis-500"
          data-tree-parent="ops"
        >
          # fun-travel-stories
        </dt-list-item>
      </template>
      <dt-list-item role="treeitem">
        Channels
      </dt-list-item>
      <dt-list-item role="treeitem">
        Recents
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
  name: 'DtFocusgroupDirectiveDefault',
  components: { DtStack, DtText, DtButton, DtListItem },

  data () {
    return {
      // Tab list
      selectedTab: 0,
      tabs: [
        { label: 'Mac' },
        { label: 'Windows', disabled: true },
        { label: 'Linux' },
      ],

      // Listbox
      selectedFruit: 'Apple',
      fruits: [
        { label: 'Apple' },
        { label: 'Banana' },
        { label: 'Cherry', disabled: true },
        { label: 'Date' },
        { label: 'Elderberry' },
      ],

      // Treeview
      groupExpanded: true,
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

    expandOrEnter () {
      const el = document.activeElement;
      if (!el) return;

      // If on a collapsed group, expand it
      if (el.getAttribute('aria-expanded') === 'false') {
        this.groupExpanded = true;
        return;
      }

      // If on an expanded group, move focus to first child
      if (el.getAttribute('aria-expanded') === 'true') {
        const groupId = el.dataset.treeGroup;
        const firstChild = el.closest('[role="tree"]')
          ?.querySelector(`[data-tree-parent="${groupId}"]`);
        if (firstChild) firstChild.focus();
      }
    },

    collapseOrParent () {
      const el = document.activeElement;
      if (!el) return;

      // If on an expanded group, collapse it
      if (el.getAttribute('aria-expanded') === 'true') {
        this.groupExpanded = false;
        return;
      }

      // If on a child item, move focus to parent group
      const parentId = el.dataset.treeParent;
      if (parentId) {
        const parent = el.closest('[role="tree"]')
          ?.querySelector(`[data-tree-group="${parentId}"]`);
        if (parent) parent.focus();
        return;
      }

      // If on a collapsed group, do nothing
    },
  },
};
</script>
