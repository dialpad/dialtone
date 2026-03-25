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
          <dt-button
            kind="muted"
            importance="clear"
            :class="buttonClasses"
          >
            <div class="dialtone-icon-card__icon--autosize">
              <svg-loader :illustration="illustration" :name="file" />
            </div>
            <div v-if="displayName" class="dialtone-icon-card__name">
              {{ name }}
            </div>
          </dt-button>
        </template>
        <template #headerContent>
          <dt-text class="d-tt-capitalize">
            {{ name }}
          </dt-text>
        </template>
        <template #content>
          <dt-stack gap="500">
            <dt-stack direction="row" gap="300">
              <dt-stack class="d-fl-grow5">
                <dt-text kind="label" size="sm">
                  Name
                </dt-text>
                <dt-stack direction="row" justify="between">
                  <dt-text kind="body" size="md" density="200">
                    {{ name }}
                  </dt-text>
                </dt-stack>
              </dt-stack>
              <dt-button
                :href="figmaLink"
                target="_blank"
                rel="noopener noreferrer"
                kind="muted"
                importance="clear"
              >
                <template #icon="{ iconSize }">
                  <dt-icon-figma :size="iconSize" />
                </template>
                Figma
              </dt-button>
            </dt-stack>
            <dt-stack direction="row" align="center">
              <dt-stack class="d-fl-grow5">
                <dt-text kind="label" size="sm">
                  Description
                </dt-text>
                <dt-text kind="body" size="md" density="200">
                  {{ desc }}
                </dt-text>
              </dt-stack>
            </dt-stack>
            <dt-stack direction="row" align="end">
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
            </dt-stack>
            <dt-stack direction="row" align="end">
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
            </dt-stack>
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
import { DtIconFigma } from '@dialpad/dialtone-icons/vue';

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

  displayName: {
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
