<template>
  <!-- Item with children - render as collapsible -->
  <dt-collapsible
    v-if="subItems.length > 0"
    :open="isOpen"
    element-type="li"
    class="d-w100p"
    anchor-class="d-w100p"
  >
    <template #anchor="{ attrs }">
      <dt-button
        :id="labelId"
        v-bind="attrs"
        :active="!searchActive && isActiveLink(item.link, true)"
        importance="clear"
        kind="muted"
        label-class="d-jc-flex-start d-ta-left d-fw-normal d-tw-pretty"
        :size="depth === 0 ? 'lg' : undefined"
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
        :data-sidebar-path="itemPath"
        @click.capture="handleClick"
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
            :name="isOpen ? 'chevron-down' : 'chevron-right'"
            :size="iconSize"
          />
        </template>
      </dt-button>
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
            :item-path="`${itemPath}.${index}`"
            :peer-keys="subItemKeys"
            :active-item-path="activeItemPath"
            :search-active="searchActive"
            nested
            @toggle="forwardToggle"
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
            :id="getResultId(`${itemPath}.${index}`)"
            :href="subItem.link"
            target="_blank"
            rel="noopener noreferrer"
            importance="clear"
            kind="muted"
            :active="isItemActive(subItem.link, `${itemPath}.${index}`)"
            label-class="d-jc-flex-start d-ta-left d-fw-normal d-tw-pretty"
            :class="[
              'dialtone-shell-btn d-w100p d-tw-pretty',
              { 'd-pis-600': depth === 0 },
              { 'd-pis-800': depth === 1 },
            ]"
            :data-sidebar-path="`${itemPath}.${index}`"
          >
            <dt-stack as="span" direction="row" justify="space-between" class="d-w100p">
              {{ subItem.text }}
              <dt-badge v-if="getBadge(subItem.status)" v-bind="getBadge(subItem.status)" class="d-mis-50" />
            </dt-stack>
          </dt-button>
          <dt-button
            v-else
            :id="getResultId(`${itemPath}.${index}`)"
            :to="subItem.link"
            :active="isItemActive(subItem.link, `${itemPath}.${index}`)"
            importance="clear"
            kind="muted"
            label-class="d-jc-flex-start d-tw-pretty"
            :data-sidebar-link="subItem.link"
            :data-sidebar-path="`${itemPath}.${index}`"
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
  <li v-else>
    <dt-button
      :id="getResultId(itemPath)"
      :to="item.link || undefined"
      :active="isItemActive(item.link, itemPath)"
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
      :data-sidebar-path="itemPath"
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
  itemPath: {
    type: String,
    required: true,
  },
  peerKeys: {
    type: Array,
    default: () => [],
  },
  activeItemPath: {
    type: String,
    default: null,
  },
  searchActive: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['toggle']);

const subItems = computed(() => {
  return props.item?.children || [];
});
const subItemKeys = computed(() => {
  return subItems.value
    .filter(item => item.children?.length)
    .map(item => item.link || item.text);
});
const labelId = computed(() => {
  return `sidebar-label-${props.item?.text?.toLowerCase().replace(/\s+/g, '-')}`;
});
const getResultId = (itemPath) => `dialtone-sidebar-search-result-${itemPath}`;

const route = useRoute();

// Controlled component - open state comes from parent via openItems Set
const isOpen = computed(() => {
  const key = props.item.link || props.item.text;
  return props.openItems.has(key);
});

// A parent row whose link equals its first child's link exists only to group — the child
// row highlights instead, so the parent never shows itself as active.
const isGroupingOnlyParent = (link) => {
  const children = props.item.children;
  if (!children?.length) return false;

  return link === children[0].link;
};

// Links that stay active while viewing their descendant routes. Keyed by link, because
// isActiveLink is called with sub-item links too, where props.item is still the parent.
// Add an entry here rather than another branch below.
const DESCENDANT_ACTIVE_PREFIXES = new Map([
  ['/dialtone/whats-new/', '/dialtone/whats-new/posts/'],
]);

const isActiveLink = (link, isParentButton = false) => {
  if (!link) return false;
  if (isParentButton && isGroupingOnlyParent(link)) return false;

  const descendantPrefix = DESCENDANT_ACTIVE_PREFIXES.get(link);
  if (descendantPrefix && route.path.startsWith(descendantPrefix)) return true;

  return route.path === link;
};
const isItemActive = (link, itemPath) => {
  return props.searchActive
    ? props.activeItemPath === itemPath
    : isActiveLink(link);
};

function handleClick (event) {
  const itemKey = props.item.link || props.item.text;

  event.preventDefault();
  emit('toggle', itemKey, !isOpen.value, props.peerKeys);
}

function forwardToggle (itemKey, shouldOpen, peerKeys) {
  emit('toggle', itemKey, shouldOpen, peerKeys);
}
</script>
