<template>
  <div class="dialtone-wall">
    <template v-for="kit in kits" :key="kit.text">
      <a
        v-if="kit.status !== 'planned'"
        :href="kit.link"
        target="_blank"
        rel="noopener noreferrer"
        class="dialtone-wall__item"
      >
        <div class="dialtone-wall__details">
          <div class="dialtone-wall__title">
            <span class="dialtone-wall__title-text">{{ kit.text }}</span>
            <span
              v-if="kit.status"
              class="d-badge d-tt-capitalize"
              :class="badgeKindClass(kit.status)"
            >
              {{ kit.status }}
            </span>
          </div>
          <div class="dialtone-wall__description">
            {{ kit.description }}
          </div>
        </div>
      </a>
      <div v-else class="dialtone-wall__item">
        <div class="dialtone-wall__details">
          <div class="dialtone-wall__title">
            <span class="dialtone-wall__title-text">{{ kit.text }}</span>
            <span class="d-badge d-tt-capitalize">
              {{ kit.status }}
            </span>
          </div>
          <div class="dialtone-wall__description">
            {{ kit.description }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { computed } from 'vue';

const themeData = useThemeLocaleData();

const kits = computed(() => {
  return (
    themeData.value.sidebar?.topLevelGroups?.['ui-kits']?.sections?.[
      '/ui-kits/'
    ]?.[0]?.children || []
  );
});

const badgeKindClass = (status) => {
  switch (status) {
    case 'new':
      return 'd-badge--bulletin';
    case 'ready':
      return 'd-badge--success';
    case 'beta':
      return 'd-badge--info';
    default:
      return '';
  }
};
</script>
