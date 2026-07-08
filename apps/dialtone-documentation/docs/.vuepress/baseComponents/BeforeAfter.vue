<template>
  <dt-box class="d-my-500">
    <dt-card
      content-class="d-p-400"
      class="d-w100p"
    >
      <template #content>
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
      </template>
    </dt-card>

    <dt-modal
      :open="expanded"
      size="full"
      :header-text="alt"
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
// Offers side-by-side, split-wipe, and onion-skin (blend slider) modes plus
// a fullscreen modal; comparison state persists between the inline card and
// the expanded view.
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

const mode = ref('side');
const blend = ref(50);
const split = ref(50);
const expanded = ref(false);
</script>
