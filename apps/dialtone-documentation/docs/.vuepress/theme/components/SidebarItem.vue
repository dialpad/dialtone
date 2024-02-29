<template>
  <li>
    <h3
      class="d-headline-eyebrow d-fw-semibold d-pl12 d-pt8 d-pb8 d-fc-secondary"
      v-text="item.text"
    />
    <dt-stack
      as="ul"
      class="d-pl0"
      gap="200"
    >
      <li
        v-for="subItem in subItems"
        :key="subItem.text"
      >
        <router-link
          v-if="!subItem.planned"
          v-slot="{ href, navigate, isExactActive }"
          :to="subItem.link"
          custom
        >
          <a
            :href="href"
            :class="[
              itemClass,
              {
                'd-btn--active d-fw-medium': isActiveLink(isExactActive, subItem.link),
              },
            ]"
            @click="navigate"
          >
            {{ subItem.text }}
          </a>
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
  </li>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const itemClass = 'd-btn d-btn--muted d-bar-pill d-w100p d-jc-flex-start d-fw-normal d-fc-primary';
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

watch(route, newRoute => {
  hash.value = newRoute.hash;
});

// isExactActive from the router-link doesn't work with hashes,
// that's why we need to check for the hash if it's a single page
const isActiveLink = (isExactActive, link) => {
  if (props.isSinglePage) return hash.value === link;
  return isExactActive;
};
</script>
