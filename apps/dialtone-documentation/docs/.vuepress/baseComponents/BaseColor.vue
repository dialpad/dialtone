<template>
  <dt-stack as="aside" data-migrate-outline>
    <dt-stack v-if="stops.length" as="header" direction="row" justify="between" class="d-ai-end" data-migrate-outline>
      <h4
        class="d-docsite--header-3 d-tt-capitalize"
        tabindex="-1"
        v-text="colorName"
      />
    </dt-stack>
    <div
      v-for="(stop, index) in stops"
      :key="`${colorName}-${index}`"
      :class="[
        'd-d-flex d-jc-space-between d-ai-center d-px12 d-py8 d-code--sm',
        {
          'd-btr4': index === 0,
          'd-bbr4': index === (stops.length - 1),
        },
      ]"
      :style="`background-color: ${stop.value}`"
    >
      <div :class="fontColorClass(stop.primaryContrast, stop.invertedContrast)">
        <strong v-text="`var(--dt-color-${colorName}-${stop.stop})`" />
        <br>
        <span v-text="stop.value" />
      </div>
      <dt-stack class="d-fs-100 d-lh2 d-fw-bold d-bar-sm d-px4 py2" data-migrate-outline>
        <span
          v-if="stop.primaryContrast >= minAAContrastRatio"
          :class="fontColorMap[mode].primary"
          v-text="formattedContrast(stop.primaryContrast)"
        />
        <span
          v-if="stop.invertedContrast >= minAAContrastRatio"
          :class="fontColorMap[mode].inverted"
          v-text="formattedContrast(stop.invertedContrast)"
        />
      </dt-stack>
    </div>
  </dt-stack>
</template>

<script setup>
const minAAContrastRatio = 4;
const minAAAContrastRatio = 7;

// Using neutral colors instead of primary, primary-inverted to make it easier to
// implement this, as the primary color change based on theme, it was being pretty complex
// to keep the text colors matching.
const fontColorMap = {
  light: {
    primary: 'd-fc-neutral-black',
    inverted: 'd-fc-neutral-white',
  },
  dark: {
    primary: 'd-fc-neutral-white',
    inverted: 'd-fc-neutral-black',
  },
};

const props = defineProps({
  stops: {
    type: Array,
    required: true,
  },
  colorName: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
});

function fontColorClass (primaryContrast, invertedContrast) {
  return primaryContrast > invertedContrast
    ? fontColorMap[props.mode].primary
    : fontColorMap[props.mode].inverted;
}
function formattedContrast (contrast) {
  const contrastGrade = contrast >= minAAAContrastRatio ? 'AAA' : (contrast >= minAAContrastRatio ? 'AA' : 'A');
  return `${contrastGrade} ${contrast}`;
}
</script>
