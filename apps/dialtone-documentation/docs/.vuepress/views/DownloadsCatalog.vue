<template>
  <dt-stack gap="600">
    <dt-stack
      v-for="section in orderedSections"
      :key="section.slug"
      gap="300"
      class="d-mbs-200"
    >
      <dt-stack gap="200" justify="space-between" direction="row" align="baseline">
        <dt-text :id="section.slug" as="h2" kind="headline" size="600" strength="medium">
          <a :href="`#${section.slug}`" class="header-anchor d-link" aria-hidden="true">#</a>
          {{ section.title }}
        </dt-text>
        <dt-stack direction="row" gap="150">
          <dt-button
            v-if="section.relatedLink"
            kind="muted"
            importance="clear"
            :to="section.relatedLink"
          >
            {{ section.relatedLabel }}
          </dt-button>
          <dt-button
            :href="section.downloadAllUrl"
            :disabled="!section.downloadAllUrl"
            target="_blank"
            rel="noopener noreferrer"
            kind="muted"
            importance="outlined"
          >
            {{ section.downloadAllLabel }}
            <template #startIcon="{ iconSize }">
              <dt-icon name="google-drive" :size="iconSize" />
            </template>
          </dt-button>
        </dt-stack>
      </dt-stack>
      <dt-box :class="gridClass(section.items.length)">
        <dt-stack
          v-for="item in section.items"
          :key="item.svg"
          gap="200"
        >
          <svg-loader class="d-d-block d-w100p d-bar-500" :name="item.svg" />
          <dt-stack
            v-if="item.label || item.downloadUrl"
            direction="row"
            justify="space-between"
            gap="200"
          >
            <dt-text v-if="item.label" kind="body" size="300" tone="secondary">
              {{ item.label }}
            </dt-text>
            <dt-button
              v-if="item.downloadUrl"
              kind="muted"
              importance="outlined"
              size="200"
              :href="item.downloadUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
              <template #startIcon="{ iconSize }">
                <dt-icon name="google-drive" :size="iconSize" />
              </template>
            </dt-button>
          </dt-stack>
        </dt-stack>
      </dt-box>
    </dt-stack>
  </dt-stack>
</template>

<script setup>
import { computed, inject, onBeforeMount } from 'vue';
import downloads from '../../_data/downloads.json';

const { order, sections } = downloads;

const orderedSections = computed(() =>
  order
    .map(slug => sections[slug] && { slug, ...sections[slug] })
    .filter(Boolean),
);

// Populate the "On this Page" right-rail with one entry per section.
// Matches the inject('headers') pattern used by AllTokens.vue on /tokens/.
const { headers } = inject('headers');

onBeforeMount(() => {
  headers.value = orderedSections.value.map(s => ({
    title: s.title,
    level: 2,
    slug: s.slug,
    link: `#${s.slug}`,
    children: [],
  }));
});

const gridClass = (itemCount) => {
  const base = 'd-d-grid d-g-300 d-rg-400';
  return itemCount > 1 ? `${base} d-g-cols1 md:d-g-cols2` : `${base} d-g-cols1`;
};
</script>
