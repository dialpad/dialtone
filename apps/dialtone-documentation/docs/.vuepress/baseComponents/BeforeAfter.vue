<template>
  <dt-box class="d-my-500">
    <!-- Same container treatment as the guide's single-image dt-boxes:
         secondary surface, subtle 1px border, radius 400, no shadow. -->
    <dt-box
      surface="secondary"
      border-width="100"
      border-color="subtle"
      border-radius="400"
      padding="400"
    >
      <before-after-body
        v-model:mode="mode"
        v-model:blend="blend"
        v-model:split="split"
        :before="before"
        :after="after"
        :alt="alt"
        :before-label="beforeLabel"
        :after-label="afterLabel"
      >
        <template #actions>
          <dt-button
            importance="clear"
            kind="muted"
            size="200"
            aria-label="Expand comparison"
            @click="expanded = true"
          >
            <template #icon>
              <dt-icon
                name="maximize"
                size="200"
              />
            </template>
          </dt-button>
        </template>
      </before-after-body>
    </dt-box>

    <!-- d-wmx-unset lifts .d-modal__content's 75ch cap, which size="full"
         doesn't override — without it the comparison can't use the width.
         d-pie-400 restores the right padding that d-modal--full zeroes out
         (it assumes a scrollbar gutter), matching the 32px left padding. -->
    <dt-modal
      :open="expanded"
      size="full"
      :header-text="alt"
      content-class="d-wmx-unset d-pie-400"
      @update:open="expanded = $event"
    >
      <before-after-body
        v-model:mode="mode"
        v-model:blend="blend"
        v-model:split="split"
        :before="before"
        :after="after"
        :alt="alt"
        :before-label="beforeLabel"
        :after-label="afterLabel"
      />
    </dt-modal>
  </dt-box>
</template>

<script setup>
import { ref } from 'vue';
import BeforeAfterBody from './BeforeAfterBody.vue';

// Neutral before/after image comparison for the visual migration guide.
// Unlike DialtoneUsage this carries no do/don't semantics — both panels are
// equally valid renders of the same scene against two Dialtone versions.
// One segmented control drives every view: instant single-image Before and
// After modes (Before is the default), side-by-side, split-wipe, and
// onion-skin (blend slider), plus a fullscreen modal; comparison state
// persists between the inline container and the expanded view.
defineProps({
  before: {
    type: String,
    required: true,
  },
  after: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  beforeLabel: {
    type: String,
    default: 'Before — current Dialtone',
  },
  afterLabel: {
    type: String,
    default: 'After — Dialtone Next',
  },
});

const mode = ref('before');
const blend = ref(50);
const split = ref(50);
const expanded = ref(false);
</script>
