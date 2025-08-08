<template>
  <dt-stack gap="500" class="d-p16 d-bgc-secondary d-bar8">
    <dt-stack direction="row" gap="500" class="d-ai-flex-end">
      <dt-select-menu
        name="mode-select"
        label="Mode"
        select-class="d-fl1"
        :value="mode"
        :options="MODES"
        @change="updateMode"
      />
      <dt-select-menu
        name="theme-select"
        label="Theme"
        select-class="d-fl1"
        :value="theme"
        :options="THEMES"
        @change="updateTheme"
      />
    </dt-stack>
  </dt-stack>
</template>

<script setup>
defineProps({
  mode: {
    type: String,
    default: 'light',
  },
  theme: {
    type: String,
    default: 'dp',
  },
});

const emit = defineEmits(['update:mode', 'update:theme']);

// Mode options (light/dark)
const MODES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

// Theme options (brand variations)
const THEMES = [
  { value: 'dp', label: 'Dialpad' },
  { value: 'tmo', label: 'T-Mobile' },
  { value: 'expressive', label: 'Expressive' },
  { value: 'sunflower', label: 'Sunflower' },
];

const updateMode = (newMode) => {
  emit('update:mode', newMode);
};

const updateTheme = (newTheme) => {
  emit('update:theme', newTheme);
};
</script>
