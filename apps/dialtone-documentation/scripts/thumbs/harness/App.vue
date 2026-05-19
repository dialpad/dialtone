<template>
  <div v-if="isUnknown">
    <dt-validation-messages
      id="sample--03"
      :validation-messages="[
        {
          message: `<strong>${requestedThumb}</strong> is not a component`,
          type: 'critical',
        },
      ]"
    />
  </div>
  <component :is="ThumbRoot" v-else-if="isThumb" />
  <gallery-app
    v-else
    :cells="galleryCells"
    :mode="mode"
    :slug-count="galleryCells.length"
    @update:mode="changeMode"
  />
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue';
import * as dialtoneVue from '@dialpad/dialtone-vue';
import { initDialtoneTheme, setMode } from '@dialpad/dialtone-tokens/themes/config';
import Dp from '@dialpad/dialtone-tokens/themes/dp';
import variantsFactory from '@variants/variants.js';
import { exportNameToSlug, slugToExportName, frontmatterToSlug, wallSlugToComponentSlug } from '../wall.mjs';
import GalleryApp from './GalleryApp.vue';

const variants = variantsFactory();
function getDefaultConfig (exportName) {
  const variant = variants[exportName]?.default;
  if (!variant) return { props: {}, slots: { default: () => 'Label' } };
  const props = {};
  for (const [name, cfg] of Object.entries(variant.props || {})) {
    if (cfg?.initialValue !== undefined) props[name] = cfg.initialValue;
  }
  const slots = {};
  for (const [name, cfg] of Object.entries(variant.slots || {})) {
    // Slot values may be plain text or markup — always compile via runtime
    // template so the same path handles both.
    if (typeof cfg?.initialValue === 'string' && cfg.initialValue !== '') {
      slots[name] = () => h(defineComponent({ name: 'SlotContent', template: cfg.initialValue }));
    }
  }
  return { props, slots };
}

const wallPageContents = import.meta.glob('../../../docs/components/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const wallSlugs = new Set(
  Object.entries(wallPageContents)
    .filter(([path]) => !path.endsWith('/index.md'))
    .map(([, content]) => frontmatterToSlug(content))
    .filter(Boolean),
);

const overrideComponents = import.meta.glob('../../../thumbs/*.vue', {
  eager: true,
  import: 'default',
});

function getOverride (exportName) {
  return overrideComponents[`../../../thumbs/${exportNameToSlug(exportName)}.vue`] ?? null;
}

const params = new URLSearchParams(window.location.search);
const requestedThumb = params.get('thumb');
const mode = ref(params.get('mode') || 'dark');

initDialtoneTheme(Dp, mode.value);
document.documentElement.style.background = 'transparent';
document.body.style.background = 'transparent';

const isThumb = !!requestedThumb;

if (!isThumb) document.body.classList.add('gallery-mode');

const galleryCells = computed(() => [...wallSlugs].sort().map(slug => ({
  slug,
  href: `?thumb=${slugToExportName(wallSlugToComponentSlug(slug))}&mode=${mode.value}`,
  src: `/assets/images/components/${slug}-${mode.value}.png`,
  hasOverride: !!overrideComponents[`../../../thumbs/${slug}.vue`],
})));

function changeMode (newMode) {
  mode.value = newMode;
  setMode(newMode);
  const url = new URL(window.location.href);
  url.searchParams.set('mode', newMode);
  history.replaceState(null, '', url);
}

const Override = isThumb ? getOverride(requestedThumb) : null;
const ComponentClass = isThumb ? dialtoneVue[requestedThumb] : null;
const isUnknown = isThumb && !ComponentClass && !Override;

const ThumbRoot = (isThumb && !isUnknown)
  ? defineComponent({
      name: 'ThumbRoot',
      render () {
        if (Override) return h(Override);
        const cfg = getDefaultConfig(requestedThumb);
        return h(ComponentClass, cfg.props ?? {}, cfg.slots ?? {});
      },
    })
  : null;
</script>
