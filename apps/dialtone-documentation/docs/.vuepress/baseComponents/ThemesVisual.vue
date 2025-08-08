<template>
  <div class="themes-visual-container d-p24 d-bar8" :class="containerClasses">
    <svg
      width="800"
      height="400"
      viewBox="0 0 800 400"
      xmlns="http://www.w3.org/2000/svg"
      class="themes-svg"
    >
      <!-- Background -->
      <rect
        width="800"
        height="400"
        :fill="colors.background"
        rx="8"
      />

      <!-- Header Bar -->
      <rect
        x="0"
        y="0"
        width="800"
        height="60"
        :fill="colors.surface"
        rx="8"
      />

      <!-- Header Text -->
      <text
        x="24"
        y="38"
        :fill="colors.text"
        font-family="Inter, system-ui, sans-serif"
        font-size="16"
        font-weight="600"
      >
        {{ currentThemeLabel }} - {{ currentModeLabel }}
      </text>

      <!-- Sidebar -->
      <rect
        x="0"
        y="60"
        width="200"
        height="340"
        :fill="colors.sidebar"
      />

      <!-- Navigation Items -->
      <g v-for="(item, index) in navItems" :key="index">
        <rect
          :x="16"
          :y="80 + (index * 40)"
          width="168"
          height="32"
          :fill="item.active ? colors.activeNav : 'transparent'"
          rx="4"
        />
        <text
          :x="24"
          :y="100 + (index * 40)"
          :fill="item.active ? colors.activeNavText : colors.navText"
          font-family="Inter, system-ui, sans-serif"
          font-size="14"
          font-weight="500"
        >
          {{ item.label }}
        </text>
      </g>

      <!-- Main Content Area -->
      <rect
        x="200"
        y="60"
        width="600"
        height="340"
        :fill="colors.background"
      />

      <!-- Content Cards -->
      <g v-for="(card, index) in contentCards" :key="index">
        <rect
          :x="220 + (index % 3) * 180"
          :y="80 + Math.floor(index / 3) * 120"
          width="160"
          height="100"
          :fill="colors.card"
          :stroke="colors.border"
          stroke-width="1"
          rx="6"
        />
        <text
          :x="230 + (index % 3) * 180"
          :y="105 + Math.floor(index / 3) * 120"
          :fill="colors.text"
          font-family="Inter, system-ui, sans-serif"
          font-size="12"
          font-weight="600"
        >
          Card {{ index + 1 }}
        </text>
        <text
          :x="230 + (index % 3) * 180"
          :y="125 + Math.floor(index / 3) * 120"
          :fill="colors.textSecondary"
          font-family="Inter, system-ui, sans-serif"
          font-size="10"
        >
          Sample content
        </text>
      </g>

      <!-- Brand Accent -->
      <rect
        x="24"
        y="320"
        width="152"
        height="4"
        :fill="colors.brand"
        rx="2"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  mode: {
    type: String,
    default: 'light',
  },
  theme: {
    type: String,
    default: 'dp',
  },
});

// Sample navigation items
const navItems = [
  { label: 'Dashboard', active: true },
  { label: 'Messages', active: false },
  { label: 'Contacts', active: false },
  { label: 'Settings', active: false },
];

// Sample content cards
const contentCards = Array.from({ length: 6 }, (_, i) => ({ id: i + 1 }));

// Theme configurations
const themeColors = {
  dp: {
    light: {
      brand: '#6c23ce',
      background: '#ffffff',
      surface: '#f5f5f5',
      sidebar: '#eaeaea',
      card: '#ffffff',
      border: '#d9d9d9',
      text: '#1c1c1c',
      textSecondary: '#686868',
      navText: '#414141',
      activeNav: '#6c23ce',
      activeNavText: '#ffffff',
    },
    dark: {
      brand: '#b28ae5',
      background: '#1c1c1c',
      surface: '#414141',
      sidebar: '#2a2a2a',
      card: '#414141',
      border: '#686868',
      text: '#ffffff',
      textSecondary: '#c0c0c0',
      navText: '#c0c0c0',
      activeNav: '#b28ae5',
      activeNavText: '#1c1c1c',
    },
  },
  tmo: {
    light: {
      brand: '#e20074',
      background: '#ffffff',
      surface: '#f5f5f5',
      sidebar: '#eaeaea',
      card: '#ffffff',
      border: '#d9d9d9',
      text: '#1c1c1c',
      textSecondary: '#686868',
      navText: '#414141',
      activeNav: '#e20074',
      activeNavText: '#ffffff',
    },
    dark: {
      brand: '#ff4da6',
      background: '#1c1c1c',
      surface: '#414141',
      sidebar: '#2a2a2a',
      card: '#414141',
      border: '#686868',
      text: '#ffffff',
      textSecondary: '#c0c0c0',
      navText: '#c0c0c0',
      activeNav: '#ff4da6',
      activeNavText: '#1c1c1c',
    },
  },
  expressive: {
    light: {
      brand: '#ff6b35',
      background: '#ffffff',
      surface: '#f5f5f5',
      sidebar: '#eaeaea',
      card: '#ffffff',
      border: '#d9d9d9',
      text: '#1c1c1c',
      textSecondary: '#686868',
      navText: '#414141',
      activeNav: '#ff6b35',
      activeNavText: '#ffffff',
    },
    dark: {
      brand: '#ff8c5a',
      background: '#1c1c1c',
      surface: '#414141',
      sidebar: '#2a2a2a',
      card: '#414141',
      border: '#686868',
      text: '#ffffff',
      textSecondary: '#c0c0c0',
      navText: '#c0c0c0',
      activeNav: '#ff8c5a',
      activeNavText: '#1c1c1c',
    },
  },
  sunflower: {
    light: {
      brand: '#ffd23f',
      background: '#ffffff',
      surface: '#f5f5f5',
      sidebar: '#eaeaea',
      card: '#ffffff',
      border: '#d9d9d9',
      text: '#1c1c1c',
      textSecondary: '#686868',
      navText: '#414141',
      activeNav: '#ffd23f',
      activeNavText: '#1c1c1c',
    },
    dark: {
      brand: '#ffe066',
      background: '#1c1c1c',
      surface: '#414141',
      sidebar: '#2a2a2a',
      card: '#414141',
      border: '#686868',
      text: '#ffffff',
      textSecondary: '#c0c0c0',
      navText: '#c0c0c0',
      activeNav: '#ffe066',
      activeNavText: '#1c1c1c',
    },
  },
};

const themeLabels = {
  dp: 'Dialpad',
  tmo: 'T-Mobile',
  expressive: 'Expressive',
  sunflower: 'Sunflower',
};

const modeLabels = {
  light: 'Light Mode',
  dark: 'Dark Mode',
};

const colors = computed(() => {
  return themeColors[props.theme]?.[props.mode] || themeColors.dp.light;
});

const containerClasses = computed(() => {
  return [
    `theme-${props.theme}`,
    `mode-${props.mode}`,
  ];
});

const currentThemeLabel = computed(() => {
  return themeLabels[props.theme] || 'Dialpad';
});

const currentModeLabel = computed(() => {
  return modeLabels[props.mode] || 'Light Mode';
});
</script>

<style scoped>
.themes-visual-container {
  transition: all 0.3s ease;
}

.themes-svg {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

/* Optional: Add subtle shadows based on mode */
.mode-light .themes-svg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.mode-dark .themes-svg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}
</style>
