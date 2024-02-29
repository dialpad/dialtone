<template>
  <dt-stack :direction="{ default: 'row' }" gap="400">
    <dt-select-menu
      name="format-select"
      label="Select Format"
      select-class="d-w128"
      :options="formatSelectMenuOptions"
      @change="setFormat"
    />
    <dt-select-menu
      name="theme-select"
      label="Select Theme"
      select-class="d-w128"
      :options="THEMES"
      @change="setTheme"
    />
  </dt-stack>
  <div v-for="category in categories" :key="category">
    <slot :name="category">
      <!-- slot for anchor header -->
    </slot>
    <token-table :category="category" :format="format" :theme="theme" />
  </div>
</template>

<script>
import TokenTable, { CATEGORY_MAP, FORMAT_MAP, THEMES } from '@baseComponents/TokenTable.vue';

export default {
  name: 'AllTokens',

  components: {
    TokenTable,
  },

  data () {
    return {
      format: 'CSS',
      theme: 'light',
      THEMES,
      categories: Object.keys(CATEGORY_MAP),
    };
  },

  computed: {
    formatSelectMenuOptions () {
      return Object.keys(FORMAT_MAP).map((item) => {
        return { value: item, label: item };
      });
    },
  },

  methods: {
    setFormat (newFormat) {
      this.format = newFormat;
    },

    setTheme (newTheme) {
      this.theme = newTheme;
    },
  },
};
</script>
