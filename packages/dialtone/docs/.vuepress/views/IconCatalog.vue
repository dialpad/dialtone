<template>
  <div class="d-d-grid d-gg16 d-g-cols6 d-mt8 d-mb16">
    <div class="d-gc4">
      <dt-input
        id="search-input"
        ref="searchRef"
        v-model="search"
        aria-label="Search icon"
        placeholder="Search for an icon"
        class="d-input d-input-icon--left d-input-icon--right"
        type="text"
        autocomplete="off"
        @keyup="searchIcon"
      >
        <template #leftIcon>
          <dt-icon name="search" />
        </template>
        <template #rightIcon>
          <dt-button
            id="search-input-button-close"
            kind="muted"
            importance="clear"
            circle
            aria-label="Clear filters"
            @click="resetSearch"
          >
            <template #icon>
              <dt-icon name="close" />
            </template>
          </dt-button>
        </template>
      </dt-input>
    </div>
    <div class="d-gc2 d-select">
      <label
        class="d-vi-visible-sr"
        for="Dialtone--SelectCategory"
      >
        Categories
      </label>
      <select
        id="Dialtone--SelectCategory"
        v-model="selectedCategory"
        class="d-select__input d-tt-capitalize"
      >
        <option
          value=""
          selected
        >
          All categories
        </option>
        <option
          v-for="(_, category) in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
    </div>
  </div>
  <div
    v-for="(icons, category) in filteredIconsList"
    :key="category"
    class="d-mb16"
  >
    <span
      class="d-headline-medium d-tt-capitalize"
      v-text="category"
    />
    <div class="d-gl-docsite-icons">
      <icon-popover
        v-for="(keywords, name) in icons"
        :key="name"
        v-model="isPopoverOpen[name]"
        :icon-name="name"
        :category="category"
        :keywords="keywords"
        @click="selectIcon({ name, keywords, category })"
      />
    </div>
  </div>
  <div
    v-if="!hasSearchResults"
    class="d-d-flex d-fl-center d-p16 d-gg4 d-fc-tertiary d-fs-300"
  >
    <span>No results found for</span>
    <strong class="d-fw-semibold">
      &OpenCurlyDoubleQuote;{{ search }}&CloseCurlyDoubleQuote;
    </strong>
  </div>
  <dt-modal
    :show="isModalOpen"
    :close-button-props="{ ariaLabel: 'Close' }"
    size="full"
    content-class="d-wmx100p d-pr32"
    @update:show="isModalOpen = false"
  >
    <template #header>
      <span
        class="d-tt-capitalize"
        v-text="selectedIcon.name"
      />
    </template>
    <icon-popover-content
      :icon-name="selectedIcon.name"
      :keywords="selectedIcon.keywords"
      :category="selectedIcon.category"
    />
  </dt-modal>
</template>

<script setup>
// Whyyy oh why do I have to do this...
import { categories } from '../../../node_modules/@dialpad/dialtone-icons/dist/icons.json';
import { computed, onMounted, ref, watch } from 'vue';
import IconPopover from '../baseComponents/IconPopover.vue';
import IconPopoverContent from '../baseComponents/IconPopoverContent.vue';
import { debounce } from '../common/utilities';

const selectedCategory = ref('');
const search = ref(null);
const searching = ref(false);
const searchRef = ref(null);
const isMobile = ref(false);
const isModalOpen = ref(false);
const isPopoverOpen = ref({});
const filteredIconsList = ref({});
const selectedIcon = ref(undefined);

const searchIcon = () => {
  debounce(() => {
    searching.value = true;
    resetCategory();
    filterIconList();
  });
};

const resetSearch = () => {
  searching.value = false;
  search.value = null;
  resetCategory();
  searchRef.value.focus();
  filterIconList();
};

const resetCategory = () => {
  selectedCategory.value = '';
};

const hasSearchResults = computed(() => Object.keys(filteredIconsList.value).length > 0);

/**
 * Filters the icon list coming from @dialpad/dialtone-icons
 * Iterates over the categories and filter's by the selected category or bypass it by selecting
 * 'All categories' option.
 * In each category, iterate over the icons and filter by the search text or bypass it if the search in empty
 * If category has icons after filter, gets added to the categories Object.
 *
 * The filteredIconsList gets updated with a freezed object to improve performance.
 * @returns void
 */
const filterIconList = () => {
  const regex = new RegExp(search.value, 'i');
  const filteredIcons = Object.keys(categories)
    .filter(category => category.includes(selectedCategory.value))
    .reduce((acc, category) => {
      const filteredCategory = Object.entries(categories[category])
        .filter(([name, keywords]) => {
          if (!search.value) return true;
          return regex.test(name) || regex.test(keywords.join(' '));
        })
        .reduce((acc, [name, _]) => Object.assign(acc, { [name]: Object.freeze(categories[category][name]) }), {});

      if (Object.keys(filteredCategory).length) {
        Object.assign(acc, { [category]: Object.freeze(filteredCategory) });
      }
      return acc;
    }, {});

  filteredIconsList.value = Object.freeze(filteredIcons);
};

const selectIcon = (icon) => {
  selectedIcon.value = icon;
  if (isMobile.value) isModalOpen.value = true;
  else isPopoverOpen.value[icon.name] = !isPopoverOpen.value[icon.name];
};

watch(selectedCategory, (newCategory) => {
  if (newCategory === 'all' && searching.value) return;
  searching.value = false;
  filterIconList();
});
onMounted(() => {
  isMobile.value = window.outerWidth <= 980;
  filterIconList();
});
</script>

<style scoped>
  /* more or less a hack, 🤷‍♂️ */
  #search-input-button-close {
    margin-right: var(--dt-size-300-negative);
  }
</style>
