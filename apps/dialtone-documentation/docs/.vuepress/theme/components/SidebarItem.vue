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
            label-class="d-jc-flex-start"
            icon-position="right"
            :size="depth === 0 ? 'lg' : undefined"
            :class="[
              'd-w100p dialtone-shell-btn',
              {
                'd-headline--eyebrow d-fw-semibold d-bgc-transparent d-c-default': !item.link,
                'd-btn--active': isActiveLink(isExactActive, item.link),
              },
            ]"
            @click="handleClick($event, listeners, navigate, item.link)"
          >
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
      <dt-stack
        as="ul"
        class="d-pl12"
        gap="200"
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
              label-class="d-jc-flex-start"
              :active="isActiveLink(isExactActive, subItem.link)"
              :class="[
                'dialtone-shell-btn d-w100p',
                {
                  'd-mt8': (index === 0), // add margin top to first nested item
                },
              ]"
              @click="navigate"
            >
              {{ subItem.text }}
            </dt-button>
          </router-link>
          <div
            v-else
            class="d-btn d-w100p d-jc-flex-start d-fw-normal d-fc-disabled h:d-bgc-transparent d-c-default"
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
        label-class="d-jc-flex-start"
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
const isActiveLink = (isExactActive, link) => {
  if (!link) return false;
  return props.isSinglePage ? hash.value === link : isExactActive;
};

function handleClick (event, listeners, navigate, link) {
  const itemKey = props.item.link || props.item.text;

  // If we're already on this exact page, just toggle the collapsible
  if (link && route.path === link) {
    // Toggle the collapsible manually
    if (listeners && listeners.onClick) {
      listeners.onClick(event);
    }
    // Emit toggle to parent
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
  if (!link && listeners && listeners.onClick) {
    listeners.onClick(event);
    emit('toggle', itemKey, !isOpen.value);
  }
}
</script>

<style lang="less" scoped>
.dt-sidebar-item {
  width: var(--dt-size-100-percent);
}
</style>
