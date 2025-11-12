<template>
  <aside class="dialtone-toc d-of-auto d-py32 d-ps-fixed d-d-none xl:d-d-block">
    <h2 class="dialtone-toc__headline d-fw-semibold d-fc-secondary d-px12 d-pb2">
      On this page
    </h2>
    <nav>
      <ul
        v-for="header in headers"
        :key="header.slug"
        class="d-mt2"
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
            <ul class="d-pl8 d-mt2">
              <li
                v-for="child in header.children"
                :key="child.slug"
                class="lg:d-d-flex d-fw-wrap d-mt2"
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
  width: var(--dt-size-850);
  height: calc(100vh - var(--dt-size-700));
  top: 113px;

  &__headline {
    font-family: "Season Sans";
    font-size: 16px;
  }
}
</style>
