<template>
  <div class="d-code--sm d-fc-purple-400 d-wmx164">
    <div v-if="isCompositionToken(tokenValue)">
      <span v-for="value in tokenValue" :key="value">
        <span v-dt-tooltip="getTooltipValue(value)" :class="{ 'h:d-fc-secondary': getTooltipValue(value) }">
          {{ value }}&nbsp;
        </span>
      </span>
    </div>
    <div v-else>
      {{ tokenValue }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tokenValue: {
    type: [String, Array],
    required: true,
  },
  tokens: {
    type: Array,
    default: () => [],
  },
});

const isCompositionToken = (value) => {
  return Array.isArray(value);
};

const valueIsDivided = (value) => {
  return value.includes(' / ');
};

const getTooltipValue = (value) => {
  return props.tokens.find(token => token.name === value)?.tokenValue.toString();
};

const getCompositionTokenNumerator = (value) => {
  return value.split(' / ')[0];
};

const getCompositionTokenDenominator = (value) => {
  return value.split(' / ')[1];
};
</script>
