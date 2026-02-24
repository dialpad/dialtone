<template>
  <dt-stack as="aside" gap="300">
    <dt-stack v-if="stops.length" as="header" direction="row" justify="between" align="baseline">
      <dt-text
        as="h4"
        kind="headline"
        size="lg"
        class="d-tt-capitalize"
        tabindex="-1"
      >
        {{ colorName }}
      </dt-text>
      <dt-text
        v-dt-tooltip="`Lightness Contrast (APCA) against either pure white or black. 60 is considered AA accessible.`"
        as="abbr"
        tabindex="0"
        class="d-px12 d-td-dotted d-c-help"
      >
        LC
      </dt-text>
    </dt-stack>
    <dt-stack>
      <dt-stack
        v-for="(stop, index) in stops"
        :key="`${colorName}-${index}`"
        direction="row"
        align="center"
        justify="space-between"
        :class="[
          'd-px12 d-py8 d-text-code--xs',
          {
            'd-btr4': index === 0,
            'd-bbr4': index === (stops.length - 1),
          },
        ]"
        :style="`background-color: ${stop.value}`"
      >
        <dt-stack gap="300" :class="fontColorClass(stop.lightness)">
          <dt-text as="strong" class="d-us-all">
            {{ `var(--dt-color-${colorName}-${stop.stop})` }}
          </dt-text>
          <dt-text class="d-o75 d-us-all">
            {{ stop.value }}
          </dt-text>
        </dt-stack>
        <dt-text
          strength="bold"
          :class="fontColorClass(stop.lightness)"
        >
          {{ formattedContrast(activeContrast(stop)) }}
        </dt-text>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</template>

<script setup>
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

const LIGHTNESS_THRESHOLD = 0.65;

function fontColorClass (lightness) {
  return lightness >= LIGHTNESS_THRESHOLD
    ? 'd-fc-neutral-black'
    : 'd-fc-neutral-white';
}
function activeContrast (stop) {
  const useBlackText = stop.lightness >= LIGHTNESS_THRESHOLD;
  // In light mode: primary = black contrast, inverted = white contrast
  // In dark mode: primary = white contrast, inverted = black contrast
  if (props.mode === 'light') {
    return useBlackText ? stop.primaryContrast : stop.invertedContrast;
  }
  return useBlackText ? stop.invertedContrast : stop.primaryContrast;
}
function formattedContrast (contrast) {
  return `${Math.ceil(contrast)}`;
}
</script>
