<template>
  <div
    v-if="category === 'color'"
    class="d-bar4 d-h32 d-d-flex d-jc-center d-ai-center colorRectangle"
    :style="getColorStyle"
  >
    <div v-if="isForeground || isLink" :class="['d-headline--lg', { 'link-example': isLink }]">
      Aa
    </div>
  </div>
  <div
    v-if="category === 'typography'"
    class="d-h32 d-d-flex d-jc-center d-ai-center"
  >
    <div :style="getTypographyStyle">
      Aa
    </div>
  </div>
  <div
    v-if="category === 'shadow'"
    class="d-bar4 d-h32"
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
  if (value.endsWith('%')) return { 'inline-size': value };
  const size = parseFloat(value.replace('rem', ''));
  if (size < 12.8 && size > -12.8) return { 'inline-size': `${Math.abs(size)}rem` };
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

  mode: {
    type: String,
    required: true,
  },
});

const isForeground = computed(() => {
  return props.name.includes('foreground');
});

const isLink = computed(() => {
  return props.name.includes('link');
});

const getColorStyle = computed(() => {
  if (props.name.includes('opacity')) {
    return { background: `rgba(0, 0, 0, ${props.value})` };
  }
  if (props.name.includes('border')) return getBorderStyle();
  if (isForeground.value || isLink.value) {
    return { backgroundColor: foregroundBackgroundColor.value, color: props.value };
  }
  return { background: props.value };
});

const getBorderStyle = () => {
  if (props.name.includes('border-ai')) {
    return {
      background: `linear-gradient(var(--dt-color-neutral-white), var(--dt-color-neutral-white)) padding-box,
      ${props.value} border-box`,
      borderWidth: 'var(--dt-size-border-200)',
      borderColor: 'transparent',
    };
  }
  return { border: `var(--dt-size-200) solid ${props.value}` };
};

const foregroundBackgroundColor = computed(() => {
  if (props.mode === 'light') {
    if (props.name.includes('inverted')) {
      return 'var(--dt-color-neutral-black)';
    }
    return 'var(--dt-color-neutral-white)';
  }
  if (props.name.includes('inverted')) {
    return 'var(--dt-color-neutral-white)';
  }
  return 'var(--dt-color-neutral-black)';
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
      return { 'inline-size': 'var(--dt-size-600)', borderRadius: props.value };
    }
    return { 'inline-size': 'var(--dt-size-100-percent)', borderRadius: props.value };
  }
  if (props.name.includes('border')) {
    return {
      'inline-size': 'var(--dt-size-100-percent)',
      backgroundColor: 'var(--dt-color-neutral-transparent)',
      border: `${props.value} solid var(--dt-color-border-brand)`,
    };
  }
  return getRectSizeStyle(props.value);
});

const displaySpaceReference = computed(() => {
  if (props.value.endsWith('%')) return true;
  const value = parseFloat(props.value.replace('rem', ''));
  return (value < 12.8 && value > -12.8);
});

const getSpaceAfterStyle = computed(() => {
  return { 'inset-inline-start': props.value };
});

const isPercentage = computed(() => props.value.endsWith('%'));
</script>

<style scoped lang="less">
.colorRectangle {
  border: var(--dt-size-border-100) dashed var(--dt-color-border-subtle)
}

.link-example {
  border-block-end: var(--dt-size-200) solid;
  line-height: initial;
}

.sizeRectangle {
  block-size: var(--dt-size-600);
  background-color: var(--dt-color-surface-brand-strong);
  border-radius: var(--dt-size-radius-300);
  inline-size: 0;
}

.spaceRectangle {
  block-size: var(--dt-size-600);
  background-color: var(--dt-color-surface-brand-strong);
  inline-size: 0;
}

.space {
  display: flex;
  position: relative;
}

.spaceReference {
  block-size: var(--dt-size-600);
  inline-size: var(--dt-size-500);
  background-color: var(--dt-color-surface-moderate);
  display: flex;
  align-items: center;
  justify-content: center;
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-muted);
  padding: var(--dt-space-400) var(--dt-space-200);
  border-start-end-radius: var(--dt-size-radius-300);
  border-end-end-radius: var(--dt-size-radius-300);
  &.spaceBefore {
    border-radius: var(--dt-size-radius-0);
    border-start-start-radius: var(--dt-size-radius-300);
    border-end-start-radius: var(--dt-size-radius-300);
  }
}

.spaceReference.percentage {
  position: absolute;
  &.spaceBefore {
    inset-inline-end: 100%;
  }
}
</style>
