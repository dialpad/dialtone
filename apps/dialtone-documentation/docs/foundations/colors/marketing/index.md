---
title: Color in Marketing
description: Guidelines for using Dialpad's color palette in marketing materials and brand communications.
keywords: ["brand colors","marketing colors","purple"]
---

<dt-stack gap="600" class="d-mbs-600">
  <div>
    <div class="d-d-grid d-g-600 d-g-cols1 md:d-g-cols3 d-ai-center">
      <div>
        <h2 class="d-docsite--header-3 d-mbs-0 d-mbs-0">Core Color</h2>
        <p class="d-docsite--paragraph">Dialpad’s color theory is organized into three schemes depending on usage.</p>
        <h3 class="d-docsite--header-4 d-mbs-0 d-mbs-0">Primary</h3>
        <p class="d-docsite--paragraph">For most general brand communications use light and dark neutrals for backgrounds with purple and a warm gradient tone used for accents.</p>
        <h3 class="d-docsite--header-4 d-mbs-0 d-mbs-0">Secondary</h3>
        <p class="d-docsite--paragraph">For specialty brand communications use one of the Dialpad brand purples for backgrounds.</p>
      </div>
      <div class="d-gc2">
        <img src="/assets/images/color-marketing--01.png" alt="" class="d-bar-500 d-d-block d-w100p" />
      </div>
    </div>
  </div>

  <div class="d-d-grid d-g-600 d-g-cols2 lg:d-g-cols4">
    <dt-stack v-for="color in marketingColors" :key="color.hex" gap="200">
      <dt-box
        v-dt-mode:light
        padding="200"
        border-radius="500"
        inline-size="100p"
        class="d-d-grid d-pli-end-stretch"
        :class="{ 'd-ba d-bc-subtle': color.outlined }"
        :style="{ backgroundColor: color.hex, aspectRatio: '1 / 1' }"
      >
        <dt-stack direction="row" gap="200" justify="space-between" align="center">
          <dt-text
            v-dt-mode:dark="!!color.inverted"
            as="p"
            tone="primary"
          >
            {{ color.hex }}
          </dt-text>
          <dt-button
            v-dt-tooltip="isCopied(color.hex) ? 'Copied!' : 'Copy'"
            :aria-label="`Copy ${color.hex}`"
            kind="muted"
            importance="outlined"
            size="200"
            class="d-bgc-neutral-white h:d-bgc-moderate"
            @click="copyHex(color.hex)"
          >
            <template #icon="{ iconSize }">
              <dt-icon
                :name="isCopied(color.hex) ? 'check' : 'copy'"
                :size="iconSize"
                :class="{ 'd-fc-positive': isCopied(color.hex) }"
              />
            </template>
          </dt-button>
        </dt-stack>
      </dt-box>
      <dt-stack>
        <h3 class="d-docsite--header-4 d-mbs-0 d-mbs-0">{{ color.name }}</h3>
        <p class="d-docsite--paragraph">{{ color.description }}</p>
      </dt-stack>
    </dt-stack>
  </div>

  <div class="d-d-grid d-g-600 d-g-cols1 md:d-g-cols3 d-ai-center">
    <div>
      <p class="d-docsite--paragraph">When creating attract and engage level communications, especially when using an increased amount of text, use the light background.</p>
    </div>
    <div class="d-gc2">
      <img src="/assets/images/color-marketing--02.png" alt="" class="d-bar-500 d-d-block d-w100p" />
    </div>
  </div>

  <div class="d-d-grid d-g-600 d-g-cols1 md:d-g-cols3 d-ai-center">
    <div>
      <p class="d-docsite--paragraph">When creating attract and engage level communications, especially when using limited amount of text or featuring the Ai sub-brand, use the dark background.</p>
    </div>
    <div class="d-gc2">
      <img src="/assets/images/color-marketing--03.png" alt="" class="d-bar-500 d-d-block d-w100p" />
    </div>
  </div>

  <figure>
    <img src="/assets/images/color-marketing--04.png" alt="" class="d-bar-500 d-d-block d-w100p" />
  </figure>

  <div class="d-d-grid d-g-600 d-g-cols1 md:d-g-cols2 d-ai-center">
    <figure>
      <img src="/assets/images/color-marketing--05.png" alt="" class="d-bar-500 d-d-block d-w100p" />
    </figure>
    <figure>
      <img src="/assets/images/color-marketing--06.png" alt="" class="d-bar-500 d-d-block d-w100p" />
    </figure>
  </div>

</dt-stack>

<script setup>
import { ref } from 'vue';

const copiedHex = ref(null);
const isCopied = (hex) => copiedHex.value === hex;
const copyHex = async (hex) => {
  try {
    await navigator.clipboard.writeText(hex);
    copiedHex.value = hex;
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (copiedHex.value === hex) copiedHex.value = null;
  } catch {
    console.error('Error copying to clipboard', hex);
  }
};

const marketingColors = [
  { hex: '#F8F7F6', name: 'Primary Light', description: 'Use for most light backgrounds and light text on dark backgrounds.' },
  { hex: '#F2F0EE', name: 'Secondary Light', description: 'Use as a background for variety or as contrast with primary light.' },
  { hex: '#CEC8C4', name: 'Tertiary Light', description: 'Use in graphics, or as a background for UI.' },
  { hex: '#FFFFFF', name: 'Contrast Light', description: 'Use as a background for variety or contrast with primary light.', outlined: true },
  { hex: '#10022C', name: 'Primary Dark', description: 'Use for most dark backgrounds and dark text on light backgrounds.', inverted: true },
  { hex: '#1D0155', name: 'Secondary / Contrast Dark', description: 'Use as a background for variety or as contrast with primary dark.', inverted: true },
  { hex: '#7C52FF', name: 'Purple', description: 'Use as an accent or highlight color for text or graphics on light backgrounds.', inverted: true },
  { hex: '#D3BCFF', name: 'Light Purple', description: 'Use as an accent or highlight color for text or graphics on dark backgrounds.' },
];
</script>
