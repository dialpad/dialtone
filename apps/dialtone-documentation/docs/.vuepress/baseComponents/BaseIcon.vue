<template>
  <div
    v-if="!hidden"
    :id="file"
  >
    <aside
      :data-selected="selectedStatus"
      class="dialtone-icon-card js-dialtone-icon-card"
    >
      <dt-popover
        :modal="true"
        :content-width="null"
        :show-close-button="true"
        placement="right"
        :fallback-placements="['left', 'auto']"
        dialog-class="d-w100vw dialtone-icon-popover"
        padding="large"
        @opened="onPopoverOpened"
      >
        <template #anchor>
          <dt-button :class="buttonClasses">
            <div class="dialtone-icon-card__icon--autosize">
              <svg-loader :illustration="illustration" :name="file" />
            </div>
          </dt-button>
        </template>
        <template #headerContent>
          <span
            class="d-tt-capitalize d-fc-primary"
            v-text="name"
          />
        </template>
        <template #content>
          <dt-stack gap="500">
            <div class="d-d-flex d-fd-column d-fl-grow5">
              <span class="d-label d-label--sm">Name</span>
              <div class="d-d-flex d-jc-space-between">
                <span class="d-body--md-compact">{{ name }}</span>
                <dt-link class="d-body--md-compact" :href="figmaLink" target="_blank" rel="noopener noreferrer">
                  Figma
                </dt-link>
              </div>
            </div>
            <div class="d-d-flex d-ai-center">
              <div class="d-d-flex d-fd-column d-fl-grow5">
                <span class="d-label d-label--sm">Description</span>
                <div class="d-body--md-compact">
                  {{ desc }}
                </div>
              </div>
            </div>
            <div class="d-d-flex d-ai-flex-end">
              <div class="d-fl-grow1">
                <dt-input
                  class="d-ff-mono"
                  label="SVG"
                  readonly
                  tabindex="-1"
                  size="sm"
                  :value="rawSvg"
                />
              </div>
              <copy-button
                class="d-ml8"
                :text="rawSvg"
                aria-label="Copy SVG markup"
              />
            </div>
            <div class="d-d-flex d-ai-flex-end">
              <div class="d-fl-grow1">
                <dt-input
                  class="d-ff-mono"
                  label="Vue"
                  tabindex="-1"
                  readonly
                  size="sm"
                  :value="`<${vue} />`"
                />
              </div>
              <copy-button
                class="d-ml8"
                :text="`<${vue} />`"
                aria-label="Copy Vue markup"
              />
            </div>
          </dt-stack>
        </template>
      </dt-popover>
    </aside>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { ICON_KINDS } from './constants.js';
import CopyButton from './CopyButton.vue';
import SvgLoader from './SvgLoader.vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  file: {
    type: String,
    required: true,
  },

  figmaLink: {
    type: String,
    required: true,
  },

  desc: {
    type: String,
    default: '',
  },

  code: {
    type: String,
    default: '',
  },

  hidden: {
    type: Boolean,
    default: false,
  },

  vue: {
    type: String,
    required: true,
  },

  kind: {
    type: String,
    required: true,
    validator: (kind) => {
      return ICON_KINDS.includes(kind);
    },
  },

  rawSvg: {
    type: String,
    required: true,
  },

  illustration: {
    type: Boolean,
    default: false,
  },
});

const selected = ref(false);

const buttonClasses = computed(() =>
  ['dialtone-icon-card__header', 'js-dialtone-icon-card-copy-area', getLogoClass(props.name)]);

const getLogoClass = name => {
  if (name.endsWith('white')) {
    return 'logo-white';
  }
  if (name.endsWith('black')) {
    return 'logo-black';
  }
  if (name.endsWith('inverted')) {
    return 'logo-inverted';
  }
};

const selectedStatus = computed(() => selected.value ? 'yes' : 'no');
const onPopoverOpened = (open) => {
  selected.value = open;
};
</script>

<style scoped>

</style>
