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
          <span
            class="d-tt-capitalize d-fc-primary"
            v-text="name"
          />
        </template>
        <template #content>
          <dt-stack gap="500">
            <dt-stack direction="row" gap="300">
              <dt-stack class="d-fl-grow5">
                <span class="d-label d-label--sm">Name</span>
                <dt-stack direction="row" justify="between">
                  <span class="d-body--md-compact">{{ name }}</span>
                </dt-stack>
              </dt-stack>
              <a
                class="d-btn d-btn--muted"
                :href="figmaLink"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="d-btn__icon d-btn__icon--left">
                  <svg
                    class="d-icon d-icon--size-300"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="
                        M12.3333 12C12.3333 11.0275 12.7196 10.0949 13.4073 9.40729C14.0949 8.71965 15.0275 8.33334
                        16 8.33334C16.9724 8.33334 17.9051 8.71965 18.5927 9.40729C19.2803 10.0949 19.6666 11.0275
                        19.6666 12C19.6666 12.9725 19.2803 13.9051 18.5927 14.5927C17.9051 15.2804 16.9724 15.6667
                        16 15.6667C15.0275 15.6667 14.0949 15.2804 13.4073 14.5927C12.7196 13.9051 12.3333 12.9725
                        12.3333 12V12Z
                      "
                      fill="#1ABCFE"
                    />
                    <path
                      d="
                        M5 19.3333C5 18.3609 5.38631 17.4282 6.07394 16.7406C6.76158 16.053 7.69421 15.6667 8.66667
                        15.6667H12.3333V19.3333C12.3333 20.3058 11.947 21.2384 11.2594 21.926C10.5718 22.6137
                        9.63913 23 8.66667 23C7.69421 23 6.76158 22.6137 6.07394 21.926C5.38631 21.2384 5 20.3058 5
                        19.3333V19.3333Z
                      "
                      fill="#0ACF83"
                    />
                    <path
                      d="
                        M12.3333 1V8.33333H16C16.9724 8.33333 17.9051 7.94703 18.5927 7.25939C19.2803 6.57176
                        19.6666 5.63913 19.6666 4.66667C19.6666 3.69421 19.2803 2.76158 18.5927 2.07394C17.9051
                        1.38631 16.9724 1 16 1L12.3333 1Z"
                      fill="#FF7262"
                    />
                    <path
                      d="
                        M5 4.66667C5 5.63913 5.38631 6.57176 6.07394 7.25939C6.76158 7.94703 7.69421 8.33333
                        8.66667 8.33333H12.3333V1H8.66667C7.69421 1 6.76158 1.38631 6.07394 2.07394C5.38631
                        2.76158 5 3.69421 5 4.66667V4.66667Z
                      "
                      fill="#F24E1E"
                    />
                    <path
                      d="
                        M5 12C5 12.9725 5.38631 13.9051 6.07394 14.5927C6.76158 15.2804 7.69421 15.6667
                        8.66667 15.6667H12.3333V8.33334H8.66667C7.69421 8.33334 6.76158 8.71965 6.07394
                        9.40729C5.38631 10.0949 5 11.0275 5 12V12Z
                      "
                      fill="#A259FF"
                    />
                  </svg>
                </span>
                <span class="d-btn__label">Figma</span>
              </a>
            </dt-stack>
            <dt-stack direction="row" align="center">
              <dt-stack class="d-fl-grow5">
                <span class="d-label d-label--sm">Description</span>
                <div class="d-body--md-compact">
                  {{ desc }}
                </div>
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
