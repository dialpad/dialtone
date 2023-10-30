<template>
  <div class="dialtone-wall">
    <template v-for="page in pages" :key="page.title">
      <component
        :is="cardElType(page)"
        :to="`/${basePath}/${page.link}/`"
        class="dialtone-wall__item"
      >
        <div v-if="page.thumb" class="dialtone-wall__image">
          <svg-loader class="dialtone-wall__thumb" :name="page.fileName" />
        </div>
        <div class="dialtone-wall__details">
          <div class="dialtone-wall__title">
            <span class="dialtone-wall__title-text">{{ pageTitle(page) }}</span>
            <span
              v-if="page.status"
              class="d-badge d-tt-capitalize"
              :class="badgeKindClass(page.status)"
            >
              {{ page.status }}
            </span>
          </div>
          <div class="dialtone-wall__description">
            {{ page.description }}
          </div>
        </div>
      </component>
    </template>
  </div>
</template>

<script setup>
import SvgLoader from '../baseComponents/SvgLoader.vue';
defineProps({
  pages: {
    type: Object,
    default: () => {},
  },
  basePath: {
    type: String,
    default: '/',
  },
});

const badgeKindClass = (status) => {
  switch (status) {
    case 'new':
      return 'd-badge--bulletin';
    case 'ready':
      return 'd-badge--success';
    default:
      return '';
  }
};
const pageTitle = (page) => {
  const shortTitle = page.shortTitle
    ? page.shortTitle[0].toUpperCase() + page.shortTitle.slice(1)
    : undefined;
  return shortTitle || page.title;
};
const cardElType = (page) => {
  if (
    page.status !== 'planned' ||
    (page.storybook && page.storybook !== 'planned')
  ) { return 'router-link'; }
  return 'div';
};
</script>
