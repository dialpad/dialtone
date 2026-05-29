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
              v-if="thumbImgUrl(page.fileName)"
              :src="thumbImgUrl(page.fileName)"
              :alt="page.title"
              class="dialtone-wall__thumb"
            >
            <svg-loader v-else class="dialtone-wall__thumb" :name="page.fileName" />
          </div>
          <div class="dialtone-wall__details">
            <div class="dialtone-wall__title">
              <span class="dialtone-wall__title-text">{{ pageTitle(page) }}</span>
              <span
                v-if="badgeKindClass(page.status)"
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import SvgLoader from '../baseComponents/SvgLoader.vue';

defineProps({
  pages: {
    type: Object,
    default: () => {},
  },
});

const lightPngModules = import.meta.glob(
  '../public/assets/images/components/*-light.png',
  { eager: true, query: '?url', import: 'default' },
);
const darkPngModules = import.meta.glob(
  '../public/assets/images/components/*-dark.png',
  { eager: true, query: '?url', import: 'default' },
);
const legacyPngModules = import.meta.glob(
  '../public/assets/images/*.png',
  { eager: true, query: '?url', import: 'default' },
);
const svgModules = import.meta.glob(
  '../public/assets/images/*.svg',
  { eager: true, query: '?url', import: 'default' },
);

const DEFAULT_MODE = 'dark';
const currentMode = ref(readMode());

function readMode () {
  if (typeof document === 'undefined') return DEFAULT_MODE;
  return document.documentElement.getAttribute('data-dt-mode') || DEFAULT_MODE;
}

let observer = null;
onMounted(() => {
  currentMode.value = readMode();
  observer = new MutationObserver(() => { currentMode.value = readMode(); });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-dt-mode'] });
});
onBeforeUnmount(() => observer?.disconnect());

/**
 * Resolve a thumb's image URL with this precedence:
 *   1. themed PNG for the current mode (auto-generated)
 *   2. hand-crafted SVG if it exists (returns null → template falls through to svg-loader)
 *   3. legacy non-themed PNG
 */
const thumbImgUrl = (fileName) => {
  const themedMap = currentMode.value === 'light' ? lightPngModules : darkPngModules;
  const themed = themedMap[`../public/assets/images/components/${fileName}-${currentMode.value}.png`];
  if (themed) return themed;
  if (svgModules[`../public/assets/images/${fileName}.svg`]) return null;
  return legacyPngModules[`../public/assets/images/${fileName}.png`] ?? null;
};

const BADGE_KIND_CLASSES = {
  new: 'd-badge--bulletin',
  beta: 'd-badge--info',
};
const badgeKindClass = (status) => BADGE_KIND_CLASSES[status] ?? '';
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
