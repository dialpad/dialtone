<template>
  <aside>
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
            @navigate="handleNavigate($event, header)"
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
              @navigate="handleNavigate($event, header)"
            />
          </template>
          <template
            v-if="header.children.length"
            #content
          >
            <ul class="d-pis-100 ">
              <li
                v-for="child in header.children"
                :key="child.slug"
                class="d-fw-wrap "
              >
                <toc-item
                  :active="isItemActive(child)"
                  :to="child.link"
                  :text="child.title"
                  @navigate="handleNavigate($event, child)"
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
import TocItem from './TocItem.vue';

const props = defineProps({
  headers: {
    type: Array,
    default: () => [],
  },
  activeHash: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['navigate']);

function isHeaderActive (header) {
  const links = [header.link, ...(header.children || []).map(child => child.link)];
  return links.some(link => link === props.activeHash);
}

function isItemActive (item) {
  return item.link === props.activeHash;
}

function handleNavigate (event, item) {
  emit('navigate', event, item);
}
</script>
