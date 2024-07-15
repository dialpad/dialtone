<template>
  <div class="d-code--sm d-fc-purple-400 d-wmx164">
    <div v-if="isCompositionToken(tokenValue)">
      <span v-for="value in tokenValue" :key="value">
        <span v-if="valueIsDivided(value)">
          <span v-dt-tooltip="getTooltipValue(getCompositionTokenNumerator(value))" class="h:d-fc-secondary">
            {{ getCompositionTokenNumerator(value) }}
          </span>
          /
          <span v-dt-tooltip="getTooltipValue(getCompositionTokenDenominator(value))" class="h:d-fc-secondary">
            {{ getCompositionTokenDenominator(value) }}&nbsp;
          </span>
        </span>
        <span v-else v-dt-tooltip="getTooltipValue(value)" class="h:d-fc-secondary">
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
  return props.tokens.find(token => token.name === value.replace(/,$/, ''))?.tokenValue.toString();
};

const getCompositionTokenNumerator = (value) => {
  return value.split(' / ')[0];
};

const getCompositionTokenDenominator = (value) => {
  return value.split(' / ')[1];
};
</script>
