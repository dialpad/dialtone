<template>
  <div
    v-if="category === 'color'"
    class="d-bar4 d-w128 d-h32"
    :style="getColorStyle"
  />
  <div
    v-if="category === 'typography'"
    class="d-w128 d-h32 d-d-flex d-jc-center d-ai-center"
  >
    <div :style="getTypographyStyle">
      Aa
    </div>
  </div>
  <div
    v-if="category === 'shadow'"
    class="d-bar4 d-w128 d-h32"
    :style="getShadowStyle"
  />
  <div
    v-if="category === 'size'"
    class="sizeRectangle"
    :style="getSizeStyle"
  />
  <div v-if="category === 'space'" class="space">
    <div v-if="displaySpaceReference" :class="[{ percentage: isPercentage }, 'spaceReference', 'spaceBefore']">
      A
    </div>
    <div
      class="spaceRectangle"
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
import { CATEGORY_MAP } from './constants';

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
    if (props.name.includes('circle')) {
      return { width: 'var(--dt-size-600)', borderRadius: props.value };
    }
    return { width: 'var(--dt-size-100-percent)', borderRadius: props.value };
  }
  if (props.name.includes('border')) {
    return {
      width: 'var(--dt-size-100-percent)',
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
.sizeRectangle {
  height: var(--dt-size-600);
  background-color: var(--dt-color-purple-400);
  border-radius: var(--dt-size-radius-300);
  width: 0;
}

.spaceRectangle {
  height: var(--dt-size-600);
  background-color: var(--dt-color-purple-400);
  width: 0;
}

.space {
  display: flex;
  position: relative;
}

.spaceReference {
  height: var(--dt-size-600);
  width: var(--dt-size-500);
  background-color: var(--dt-color-surface-moderate);
  display: flex;
  align-items: center;
  justify-content: center;
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-muted);
  padding: var(--dt-space-400) var(--dt-space-200);
  border-top-right-radius: var(--dt-size-radius-300);
  border-bottom-right-radius: var(--dt-size-radius-300);
  &.spaceBefore {
    border-radius: var(--dt-size-radius-0);
    border-top-left-radius: var(--dt-size-radius-300);
    border-bottom-left-radius: var(--dt-size-radius-300);
  }
}

.spaceReference.percentage {
  position: absolute;
  &.spaceBefore {
    right: 100%;
  }
}
</style>
