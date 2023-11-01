<template>
  <div class="d-d-flex d-fd-column d-w100p d-stack16">
    <div
      ref="tabs"
      class="d-tablist"
      :class="{
        'd-tablist--sm': size === 'small',
        'd-tablist--no-border': borderless,
        'd-tablist--inverted': inverted,
      }"
      role="tablist"
      aria-label="Label Example Group"
      tabindex="0"
      @keydown.left="tabLeft"
      @keydown.right="tabRight"
      @keydown.enter="selectTab(focusId)"
      @keydown.space="selectTab(focusId)"
      @keydown.home.prevent="onHomeButton"
      @keydown.end.prevent="onEndButton"
    >
      <button
        v-for="(name, index) in tabNames"
        :id="`base-tab-${index}`"
        :key="name"
        class="d-tab"
        :class="{ 'd-tab--selected': selected === index }"
        role="tab"
        :aria-selected="selected === index"
        :aria-controls="`base-panel-${index}`"
        :tabindex="selected === index ? 0 : -1"
        @click="selectTab(index)"
      >
        {{ name }} tab
      </button>
    </div>
    <div v-if="!hideContent">
      <div
        v-for="(name, index) in tabNames"
        :id="`base-panel-${index}`"
        :key="name"
        role="tabpanel"
        tabindex="0"
        :aria-labelledby="`base-tab-${index}`"
        :hidden="selected !== index"
      >
        <p :class="{ 'd-fc-primary-inverted': inverted }">
          {{ name }} tab content panel
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExampleTabs',

  props: {
    size: {
      type: String,
      default: '',
    },

    borderless: {
      type: Boolean,
      default: false,
    },

    inverted: {
      type: Boolean,
      default: false,
    },

    hideContent: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      focusId: null,
      selected: 0,
      tabNames: ['First', 'Second', 'Third'],
      tabs: [],
    };
  },

  mounted () {
    this.tabs = this.getTabChildren();
  },

  methods: {
    getTabChildren () {
      const tabs = Array.from(this.$refs.tabs.children);
      return tabs.map(el => ({ context: el }));
    },

    focusTab (tabIndex) {
      this.focusId = tabIndex;
      this.tabs[tabIndex].context.focus();
    },

    selectTab (tabIndex) {
      this.selected = tabIndex;
    },

    tabLeft () {
      if (this.focusId === 0) return;
      this.focusTab(this.focusId - 1);
    },

    tabRight () {
      if (this.focusId === this.tabs.length - 1) return;
      this.focusTab(this.focusId + 1);
    },

    onHomeButton () {
      this.focusTab(0);
    },

    onEndButton () {
      this.focusTab(this.tabs.length - 1);
    },
  },
};
</script>
