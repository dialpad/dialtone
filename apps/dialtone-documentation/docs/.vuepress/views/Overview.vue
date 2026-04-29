<template>
  <div class="dialtone-wall">
    <template v-for="page in pages" :key="page.title">
      <template v-if="page.status !== 'deprecated'">
        <component
          :is="cardElType(page)"
          :to="page.link"
          class="dialtone-wall__item"
        >
          <div v-if="page.thumb" class="dialtone-wall__image">
            <img
              v-if="thumbPngUrl(page.fileName)"
              :src="thumbPngUrl(page.fileName)"
              :alt="page.title"
              class="dialtone-wall__thumb"
            >
            <svg-loader v-else class="dialtone-wall__thumb" :name="page.fileName" />
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
});

// Pre-resolved URL maps so thumb rendering can fall back from SVG to PNG.
const svgModules = import.meta.glob(
  '../public/assets/images/*.svg',
  { eager: true, query: '?url', import: 'default' },
);
const pngModules = import.meta.glob(
  '../public/assets/images/*.png',
  { eager: true, query: '?url', import: 'default' },
);

const thumbPngUrl = (fileName) => {
  if (svgModules[`../public/assets/images/${fileName}.svg`]) return null;
  return pngModules[`../public/assets/images/${fileName}.png`] ?? null;
};

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
