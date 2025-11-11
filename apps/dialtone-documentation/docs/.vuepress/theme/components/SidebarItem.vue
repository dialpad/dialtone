<template>
  <dt-collapsible
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
            nested
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
                  'd-mt2': (index === 0 && nested), // add margin top to first nested item
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
});
const subItems = computed(() => {
  return props.item?.children || [];
});
const route = useRoute();
const hash = ref(route.hash);

// Simple computed: is the current route inside this collapsible's tree?
const isOpen = computed(() => {
  if (!props.item.children) return false;

  // If current page IS this item's page, expand to show children
  if (route.path === props.item.link) return true;

  // Check if current page is inside children
  const hasActiveChild = (children) => {
    return children.some(child => {
      // Exact match
      if (route.path === child.link) return true;
      // Check nested children
      if (child.children) return hasActiveChild(child.children);
      return false;
    });
  };

  return hasActiveChild(props.item.children);
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
  // First, call the collapsible's click handler to toggle
  if (listeners && listeners.onClick) {
    listeners.onClick(event);
  }

  // Then, if there's a link, navigate to it
  if (link) {
    navigate();
  }
}
</script>

<style lang="less" scoped>
.dt-sidebar-item {
  width: var(--dt-size-100-percent);
}
</style>
