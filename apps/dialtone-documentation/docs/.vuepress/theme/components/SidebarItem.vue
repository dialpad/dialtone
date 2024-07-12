<template>
  <dt-collapsible
    element-type="li"
    max-width="100%"
    :open="item.link ? isOpen : true"
  >
    <template #anchor="{ attrs }">
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
              'd-bar-pill d-mb2 d-w100p d-us-none d-td-none',
              {
                'd-btn--active d-fw-medium': isActiveLink(isExactActive, item.link),
                'd-headline--eyebrow d-fw-semibold d-fc-secondary d-bgc-transparent d-c-default': !item.link,
              },
            ]"
            @click="handleAnchorClick(navigate, item.link)"
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
        class="d-pl8"
        gap="200"
      >
        <li
          v-for="subItem in subItems"
          :key="subItem.text"
        >
          <sidebar-item v-if="subItem.children" :item="subItem" />
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
              :class="[
                'd-bar-pill d-w100p d-jc-flex-start d-fw-normal d-fc-primary',
                'd-mb2 d-us-none',
                {
                  'd-btn--active d-fw-medium': isActiveLink(isExactActive, subItem.link),
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
import { computed, onMounted, ref, watch } from 'vue';
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
});
const subItems = computed(() => {
  return props.item?.children || [];
});
const route = useRoute();
const hash = ref(route.hash);
const isOpen = ref(false);

watch(route, newRoute => {
  hash.value = newRoute.hash;
});

onMounted(() => {
  if (route.path === props.item.link) {
    isOpen.value = true;
  }
});

// isExactActive from the router-link doesn't work with hashes,
// that's why we need to check for the hash if it's a single page
const isActiveLink = (isExactActive, link) => {
  if (!link) return false;
  if (props.isSinglePage) return hash.value === link;
  return isExactActive;
};

function handleAnchorClick (navigate, link) {
  isOpen.value = true;
  if (!link) return;
  navigate();
}
</script>
