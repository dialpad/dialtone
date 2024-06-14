<template>
  <div class="d-code--sm d-fc-purple-400 d-wmx164">
    <div v-if="isCompositionToken(tokenValue)">
      <span v-for="value in tokenValue" :key="value">
        <span v-if="valueIsDivided(value)">
          <span v-dt-tooltip="getTooltipValue(getFirstValue(value))" class="h:d-fc-secondary">
            {{ getFirstValue(value) }}
          </span>
          /
          <span v-dt-tooltip="getTooltipValue(getSecondValue(value))" class="h:d-fc-secondary">
            {{ getSecondValue(value) }}&nbsp;
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

const getFirstValue = (value) => {
  return value.split(' / ')[0];
};

const getSecondValue = (value) => {
  return value.split(' / ')[1];
};
</script>
