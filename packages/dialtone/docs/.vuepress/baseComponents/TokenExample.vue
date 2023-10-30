<template>
  <div
    v-if="category === 'color'"
    class="d-bar-circle d-w42 d-h42"
    :style="getColorStyle"
  />
  <p
    v-if="category === 'typography'"
    :style="getTypographyStyle"
  >
    Aa
  </p>
  <div
    v-if="category === 'shadow'"
    class="d-bar2 d-w42 d-h42"
    :style="getShadowStyle"
  />
  <div
    v-if="category === 'size'"
    class="rectangle"
    :style="getSizeStyle"
  />
  <div v-if="category === 'space'" class="space">
    <div v-if="displaySpaceReference" :class="[{ percentage: isPercentage }, 'spaceReference', 'spaceBefore']">
      A
    </div>
    <div
      class="rectangle"
      :style="getSizeStyle"
    />
    <div
      v-if="displaySpaceReference"
      :class="[{ percentage: isPercentage }, 'spaceReference']"
      :style="getSpaceAfterStyle"
    >
      B
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { CATEGORY_MAP } from './TokenTable.vue';

const TYPOGRAPHY_KEY_MAP = {
  family: 'font-family',
  size: 'font-size',
  'line-height': 'line-height',
  weight: 'font-weight',
  'text-case': 'text-transform',
};

const SHADOW_COMPOSITION_TOKENS = ['small', 'medium', 'large', 'extra-large', 'card', 'focus', 'focus-inset'];

const isTypography = (name, key) => name.includes('--dt-typography') && name.includes(key);
const isFont = (name, key) => name.includes(`--dt-font-${key}`);
const getRectSizeStyle = (value) => {
  if (value.endsWith('%')) return { width: value };
  const size = parseFloat(value.replace('rem', ''));
  if (size < 12.8 && size >= 0) return { width: value };
  return null;
};

const props = defineProps({
  category: {
    type: String,
    default: 'color',
    validator: (v) => Object.keys(CATEGORY_MAP).includes(v),
  },

  name: {
    type: String,
    default: '',
  },

  value: {
    type: String,
    default: '',
  },
});

const getColorStyle = computed(() => {
  const property = props.name.split('--dt-')[1]?.split('-')[0];
  switch (property) {
    case 'color':
    case 'theme':
      return { background: props.value };

    case 'opacity':
      return { background: `rgba(0, 0, 0, ${props.value})` };

    default:
      return null;
  }
});

const getTypographyStyle = computed(() => {
  for (const key in TYPOGRAPHY_KEY_MAP) {
    if (isFont(props.name, key) || isTypography(props.name, key)) {
      return { [TYPOGRAPHY_KEY_MAP[key]]: props.value };
    }
  }
  if (props.name.startsWith('var(--dt-typography')) {
    return `font: ${props.value}`;
  }
  return null;
});

const getShadowStyle = computed(() => {
  if (SHADOW_COMPOSITION_TOKENS.some(name => props.name.endsWith(`${name})`))) {
    return { 'box-shadow': props.value };
  }
  return null;
});

const getSizeStyle = computed(() => {
  if (props.name.includes('radius')) {
    return { width: 'var(--dt-size-625)', borderRadius: props.value };
  }
  if (props.name.includes('border')) {
    return {
      width: 'var(--dt-size-625)',
      backgroundColor: 'var(--dt-color-neutral-transparent)',
      border: `${props.value} solid var(--dt-color-border-brand)`,
    };
  }
  return getRectSizeStyle(props.value);
});

const displaySpaceReference = computed(() => {
  if (props.value.endsWith('%')) return true;
  const value = parseFloat(props.value.replace('rem', ''));
  return (value < 12.8 && value >= 0);
});

const getSpaceAfterStyle = computed(() => {
  return { left: props.value };
});

const isPercentage = computed(() => props.value.endsWith('%'));
</script>

<style scoped lang="less">
.rectangle {
  height: var(--dt-size-625);
  background-color: var(--dt-color-brand-purple);
  width: 0;
}
.space {
  display: flex;
  position: relative;
}
.spaceReference {
  height: var(--dt-size-625);
  width: var(--dt-size-500);
  background-color: var(--dt-color-black-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-black-500);
}

.spaceReference.percentage {
  position: absolute;
  &.spaceBefore {
    right: 100%;
  }
}
</style>
