<template>
  <!-- Item with children - render as collapsible -->
  <dt-collapsible
    v-if="subItems.length > 0"
    v-model:open="isOpen"
    element-type="li"
    class="dt-sidebar-item"
  >
    <template #anchor="{ attrs, listeners }">
      <dt-stack
        direction="row"
        class="d-ps-relative"
      >
        <dt-button
          :id="labelId"
          v-bind="attrs"
          :to="item.link || undefined"
          :active="isActiveLink(item.link, true)"
          importance="clear"
          kind="muted"
          label-class="d-jc-flex-start d-ta-left d-fw-normal d-tw-pretty"
          :size="depth === 0 ? 'lg' : undefined"
          :tabindex="actionableTabIndex"
          :class="[
            'd-w100p dialtone-shell-btn',
            {
              'd-headline--eyebrow d-fw-semibold d-bgc-transparent d-c-default': !item.link,
              'd-pie-200': depth === 1,
            },
            {
              'd-pis-600': depth === 1,
            },
          ]"
          :data-sidebar-link="item.link"
          @click="handleClick($event, listeners, item.link)"
        >
          <dt-icon
            v-if="depth === 0 && item.icon"
            :name="item.icon"
            size="400"
            class="d-mie-150 d-fc-muted"
          />
          {{ item.text }}
          <template #endIcon="{ iconSize }">
            <dt-icon
              v-if="item.link"
              :name="isOpen ? 'chevron-down' : 'chevron-right'"
              :size="iconSize"
            />
          </template>
        </dt-button>
      </dt-stack>
    </template>
    <template #content>
      <dt-stack
        as="ul"
        :aria-labelledby="labelId"
        gap="25"
        :class="{
          'd-pbs-50': depth === 0 || depth === 1,
        }"
      >
        <li
          v-for="(subItem, index) in subItems"
          :key="subItem.text"
        >
          <sidebar-item
            v-if="subItem.children"
            :item="subItem"
            :depth="depth + 1"
            :open-items="openItems"
            nested
            @toggle="(itemKey, shouldOpen) => $emit('toggle', itemKey, shouldOpen)"
          />
          <div
            v-else-if="subItem.status === 'planned'"
            class="d-btn d-w100p d-jc-flex-start d-ta-left d-fw-normal d-fc-muted h:d-bgc-transparent d-c-default"
            :class="[{ 'd-pis-600': depth === 0 }, { 'd-pis-800': depth === 1 }]"
          >
            <dt-stack as="span" direction="row" justify="space-between" class="d-w100p">
              {{ subItem.text }}
              <dt-badge v-bind="getBadge(subItem.status)" class="d-mis-50" />
            </dt-stack>
          </div>
          <dt-button
            v-else-if="isExternalUrl(subItem.link)"
            :href="subItem.link"
            target="_blank"
            rel="noopener noreferrer"
            importance="clear"
            kind="muted"
            label-class="d-jc-flex-start d-ta-left d-fw-normal d-tw-pretty"
            :class="[
              'dialtone-shell-btn d-w100p d-tw-pretty',
              { 'd-pis-600': depth === 0 },
              { 'd-pis-800': depth === 1 },
            ]"
          >
            <dt-stack as="span" direction="row" justify="space-between" class="d-w100p">
              {{ subItem.text }}
              <dt-badge v-if="getBadge(subItem.status)" v-bind="getBadge(subItem.status)" class="d-mis-50" />
            </dt-stack>
          </dt-button>
          <dt-button
            v-else
            :to="subItem.link"
            :active="isActiveLink(subItem.link)"
            importance="clear"
            kind="muted"
            label-class="d-jc-flex-start d-tw-pretty"
            :data-sidebar-link="subItem.link"
            :class="[
              'd-w100p d-fw-normal dialtone-shell-btn',
              { 'd-pis-600': depth === 0 },
              { 'd-pis-800': depth === 1 },
              {
                'd-mbs-25': (index === 0 && nested), // add margin top to first nested item
              },
            ]"
          >
            <dt-stack
              v-if="getBadge(subItem.status)"
              as="span"
              direction="row"
              justify="space-between"
              class="d-w100p"
            >
              {{ subItem.text }}
              <dt-badge v-bind="getBadge(subItem.status)" class="d-mis-50" />
            </dt-stack>
            <template v-else>
              {{ subItem.text }}
            </template>
          </dt-button>
        </li>
      </dt-stack>
    </template>
  </dt-collapsible>

  <!-- Item without children - render as simple link -->
  <li
    v-else
    class="dt-sidebar-item"
  >
    <dt-button
      :to="item.link || undefined"
      :active="isActiveLink(item.link)"
      importance="clear"
      kind="muted"
      label-class="d-jc-flex-start d-ta-left d-fw-normal d-tw-pretty"
      :size="depth === 0 ? 'lg' : undefined"
      :class="[
        'd-w100p dialtone-shell-btn',
        {
          'd-headline--eyebrow d-fw-semibold d-bgc-transparent d-c-default': !item.link,
        },
      ]"
      :data-sidebar-link="item.link"
    >
      <dt-icon
        v-if="depth === 0 && item.icon"
        :name="item.icon"
        size="400"
        class="d-mie-150 d-fc-muted"
      />
      <dt-stack
        v-if="getBadge(item.status)"
        as="span"
        direction="row"
        justify="space-between"
        class="d-w100p"
      >
        {{ item.text }}
        <dt-badge v-bind="getBadge(item.status)" class="d-mis-50" />
      </dt-stack>
      <template v-else>
        {{ item.text }}
      </template>
    </dt-button>
  </li>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { isExternalUrl } from '../utils/isExternalUrl';

const STATUS_BADGES = {
  beta: { type: 'info', text: 'Beta' },
  new: { type: 'bulletin', text: 'New' },
  planned: { text: 'Planned' },
};
const getBadge = (status) => STATUS_BADGES[status];

const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  nested: {
    type: Boolean,
    default: false,
  },
  depth: {
    type: Number,
    default: 0,
  },
  openItems: {
    type: Set,
    required: true,
  },
});

const emit = defineEmits(['toggle']);

const subItems = computed(() => {
  return props.item?.children || [];
});
const labelId = computed(() => {
  return `sidebar-label-${props.item?.text?.toLowerCase().replace(/\s+/g, '-')}`;
});
const actionableTabIndex = computed(() => {
  // Items without links are not actionable and should be removed from tab order
  return props.item.link ? undefined : -1;
});

const route = useRoute();

// Controlled component - open state comes from parent via openItems Set
const isOpen = computed(() => {
  const key = props.item.link || props.item.text;
  return props.openItems.has(key);
});

const isActiveLink = (link, isParentButton = false) => {
  if (!link) return false;

  // Check if this is a grouping-only parent (link matches first child)
  // Only apply this check when evaluating the parent button itself, not child buttons
  if (isParentButton && props.item.children && props.item.children.length > 0) {
    const firstChildLink = props.item.children[0].link;
    if (link === firstChildLink) {
      // This is a grouping-only parent - don't show as active
      return false;
    }
  }

  // Special case: Highlight What's New when viewing blog posts
  if (link === '/dialtone/whats-new/' && route.path.startsWith('/dialtone/whats-new/posts/')) {
    return true;
  }

  return route.path === link;
};

function handleClick (event, listeners, link) {
  const itemKey = props.item.link || props.item.text;

  // If we're already on this exact page, just toggle the collapsible
  if (link && route.path === link) {
    event.preventDefault();
    // Only emit toggle to parent - don't call listeners to avoid double toggle
    emit('toggle', itemKey, !isOpen.value);
    return;
  }

  // If no link, just toggle
  if (!link) {
    event.preventDefault();
    emit('toggle', itemKey, !isOpen.value);
  }
}
</script>

<style lang="less" scoped>
.dt-sidebar-item {
  inline-size: var(--dt-layout-100-percent);
}
</style>
