<template>
  <dt-stack as="aside" gap="100">
    <dt-stack v-if="stops.length" as="header" direction="row" justify="between" align="baseline">
      <dt-box padding-inline="150">
        <dt-text
          as="h4"
          kind="headline"
          :size="300"
          class="d-tt-capitalize"
          text-box-trim="start"
          tabindex="-1"
        >
          {{ colorName }}
        </dt-text>
      </dt-box>
      <dt-text
        v-dt-tooltip="`Lightness Contrast (APCA) against either pure white or black. 60 is considered AA accessible.`"
        as="abbr"
        tabindex="0"
        text-box-trim="start"
        class="d-px-150 d-td-dotted d-c-help"
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
          'color-stop d-px-150 d-py-100 d-text-code--xs',
          {
            'd-bbsr-300': index === 0,
            'd-bber-300': index === (stops.length - 1),
          },
        ]"
        :style="`background-color: ${stop.value}`"
      >
        <dt-stack gap="50" :class="['color-stop__meta', fontColorClass(stop.lightness)]">
          <dt-text as="strong" class="d-us-all">
            {{ tokenName(stop.stop) }}
          </dt-text>
          <dt-text class="d-o75 d-us-all">
            {{ stop.value }}
          </dt-text>
        </dt-stack>
        <dt-text
          strength="bold"
          :class="['color-stop__lc', fontColorClass(stop.lightness)]"
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
  // Token-name display format. 'color' (default) renders `var(--dt-color-{name}-{stop})`
  // since named ramps are CSS variables. Any other value renders the source-path
  // form `{namespace}.{name}.{stop}` — used by `material` since material ramps
  // don't emit CSS variables.
  namespace: {
    type: String,
    default: 'color',
  },
});

const LIGHTNESS_THRESHOLD = 0.65;

function tokenName (stop) {
  return props.namespace === 'color'
    ? `var(--dt-color-${props.colorName}-${stop})`
    : `${props.namespace}.${props.colorName}.${stop}`;
}
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
