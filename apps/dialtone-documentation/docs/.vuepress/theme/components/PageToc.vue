<template>
  <aside>
    <dt-text
      as="h2"
      kind="headline"
      :size="100"
      strength="semibold"
      tone="secondary"
      class="d-tt-uppercase d-px-100 d-pbe-50"
    >
      On this page
    </dt-text>
    <nav>
      <ul
        v-for="header in headers"
        :key="header.slug"
      >
        <li v-if="!header.children.length">
          <toc-item
            :active="isItemActive(header)"
            :to="header.link"
            :text="header.title"
          />
        </li>
        <dt-collapsible
          v-else
          element-type="li"
          :open="isHeaderActive(header)"
        >
          <template #anchor="{ attrs }">
            <toc-item
              v-bind="attrs"
              :active="isItemActive(header)"
              :to="header.link"
              :text="header.title"
            />
          </template>
          <template
            v-if="header.children.length"
            #content
          >
            <ul class="d-pis-100 d-mbs-25">
              <li
                v-for="child in header.children"
                :key="child.slug"
                class="lg:d-d-flex d-fw-wrap d-mbs-25"
              >
                <toc-item
                  :active="isItemActive(child)"
                  :to="child.link"
                  :text="child.title"
                />
              </li>
            </ul>
          </template>
        </dt-collapsible>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router';
import TocItem from './TocItem.vue';

defineProps({
  headers: {
    type: Array,
    default: null,
  },
});

const route = useRoute();

function isHeaderActive (header) {
  const links = [header.link, ...header.children.map(child => child.link)];
  return links.some(link => link === route.hash);
}

function isItemActive (item) {
  return item.link === route.hash;
}
</script>

<style lang="less" scoped>
.dialtone-toc {
  inline-size: var(--dt-layout-300);
  block-size: calc(100vh - var(--dt-layout-100));
  inset-block-start: var(--dt-layout-100);
}
</style>
