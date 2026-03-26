<template>
  <dt-text as="div" kind="code" :size="100" class="d-docsite-code">
    <div v-if="isCompositionToken(tokenValue)">
      <span v-for="value in tokenValue" :key="value">
        <span
          v-dt-tooltip="getTooltipValue(value)"
          :class="{ 'd-d-block h:d-fc-primary d-c-default': getTooltipValue(value) }"
        >
          {{ value }}&nbsp;
        </span>
      </span>
    </div>
    <div v-else>
      {{ tokenValue }}
    </div>
  </dt-text>
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

const getTooltipValue = (value) => {
  return props.tokens.find(token => token.name === value)?.tokenValue.toString();
};
</script>
