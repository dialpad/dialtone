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
                'd-btn--active d-fw-medium': isExactActive,
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
import { computed } from 'vue';

const itemClass = 'd-btn d-btn--muted d-bar-pill d-w100p d-jc-flex-start d-fw-normal d-fc-primary';
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
});
const subItems = computed(() => {
  return props.item?.children || [];
});
</script>
