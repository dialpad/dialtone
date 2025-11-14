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
        <router-link
          v-slot="{ navigate, isExactActive }"
          :to="item.link ?? ''"
          custom
        >
          <dt-button
            v-bind="attrs"
            importance="clear"
            kind="muted"
            label-class="d-jc-flex-start d-ta-left"
            icon-position="right"
            :size="depth === 0 ? 'lg' : undefined"
            :class="[
              'd-w100p dialtone-shell-btn',
              {
                'd-headline--eyebrow d-fw-semibold d-bgc-transparent d-c-default': !item.link,
                'd-btn--active': isActiveLink(isExactActive, item.link, true),
                'd-pr16': depth === 1,
              },
              {
                'd-pl48': depth === 1,
              },
            ]"
            @click="handleClick($event, listeners, navigate, item.link)"
          >
            <dt-icon
              v-if="depth === 0 && item.icon"
              :name="item.icon"
              size="400"
              class="d-mr12 d-fc-muted"
            />
            {{ item.text }}
            <template #icon="{ iconSize }">
              <dt-icon
                v-if="item.link"
                :name="isOpen ? 'chevron-down' : 'chevron-right'"
                :size="iconSize"
              />
            </template>
          </dt-button>
        </router-link>
      </dt-stack>
    </template>
    <template #content>
      <div v-dt-scrollbar class="d-hmx464">
        <dt-stack
          as="ul"
          gap="200"
          :class="{
            'd-pt4': depth === 0 || depth === 1,
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
            <router-link
              v-else-if="!subItem.planned"
              v-slot="{ navigate, isExactActive }"
              :to="subItem.link"
              custom
            >
              <dt-button
                importance="clear"
                kind="muted"
                label-class="d-jc-flex-start d-ta-left"
                :active="isActiveLink(isExactActive, subItem.link)"
                :class="[
                  'dialtone-shell-btn d-w100p',
                  {
                    'd-pl48': depth === 0,
                  },
                  {
                    'd-pl64': depth === 1,
                  },
                ]"
                @click="navigate"
              >
                {{ subItem.text }}
              </dt-button>
            </router-link>
            <div
              v-else
              class="d-btn d-w100p d-jc-flex-start d-ta-left d-fw-normal d-fc-disabled h:d-bgc-transparent d-c-default"
            >
              {{ subItem.text }}
              <dt-badge
                v-if="subItem.planned"
                class="d-fw-normal d-ml4"
              >
                Planned
              </dt-badge>
            </div>
          </li>
        </dt-stack>
      </div>
    </template>
  </dt-collapsible>

  <!-- Item without children - render as simple link -->
  <li
    v-else
    class="dt-sidebar-item"
  >
    <router-link
      v-slot="{ navigate, isExactActive }"
      :to="item.link ?? ''"
      custom
    >
      <dt-button
        importance="clear"
        kind="muted"
        label-class="d-jc-flex-start d-ta-left"
        :size="depth === 0 ? 'lg' : undefined"
        :active="isActiveLink(isExactActive, item.link)"
        :class="[
          'd-w100p dialtone-shell-btn',
          {
            'd-headline--eyebrow d-fw-semibold d-bgc-transparent d-c-default': !item.link,
          },
        ]"
        @click="navigate"
      >
        <dt-icon
          v-if="depth === 0 && item.icon"
          :name="item.icon"
          size="400"
          class="d-mr12 d-fc-muted"
        />
        {{ item.text }}
      </dt-button>
    </router-link>
  </li>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  isSinglePage: {
    type: Boolean,
    default: false,
  },
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

const route = useRoute();
const hash = ref(route.hash);

// Controlled component - open state comes from parent via openItems Set
const isOpen = computed(() => {
  const key = props.item.link || props.item.text;
  return props.openItems.has(key);
});

watch(route, (newRoute) => {
  hash.value = newRoute.hash;
});

// isExactActive from the router-link doesn't work with hashes,
// that's why we need to check for the hash if it's a single page
const isActiveLink = (isExactActive, link, isParentButton = false) => {
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

  return props.isSinglePage ? hash.value === link : isExactActive;
};

function handleClick (event, listeners, navigate, link) {
  const itemKey = props.item.link || props.item.text;

  // If we're already on this exact page, just toggle the collapsible
  if (link && route.path === link) {
    event.preventDefault();
    // Only emit toggle to parent - don't call listeners to avoid double toggle
    emit('toggle', itemKey, !isOpen.value);
    return;
  }

  // We're NOT on this page, so navigate
  if (link && route.path !== link) {
    navigate();
    // Don't emit toggle - route watcher in Sidebar will handle it
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
  width: var(--dt-size-100-percent);
}
</style>
