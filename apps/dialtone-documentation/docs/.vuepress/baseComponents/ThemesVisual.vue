<template>
  <div class="themes-visual-container d-p24 d-bar8" :class="containerClasses">
    <div class="themes-mockup">
      <!-- Header -->
      <div class="mockup-header" :style="{ backgroundColor: colors.surface }">
        <div class="header-controls">
          <div class="window-controls">
            <span class="control" />
            <span class="control" />
            <span class="control" />
          </div>
          <div class="dialpad-logo">
            <div class="logo-gradient" />
          </div>
          <div class="header-nav">
            <span class="nav-item inactive" />
            <span class="nav-item" />
            <span class="nav-item" />
          </div>
          <div class="search-bar" :style="{ backgroundColor: `${colors.text}0D` }" />
          <div class="header-actions">
            <span class="action-btn" />
            <span class="action-btn" />
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="mockup-content">
        <!-- Sidebar -->
        <div class="sidebar" :style="{ backgroundColor: colors.sidebar }">
          <div
            v-for="(item, index) in navItems"
            :key="index"
            class="nav-item-row"
          >
            <div
              class="avatar"
              :style="{ backgroundColor: item.avatarColor }"
            />
            <div class="nav-text">
              <div class="text-primary" :style="{ backgroundColor: `${colors.text}99` }" />
              <div class="text-secondary" :style="{ backgroundColor: `${colors.text}2B` }" />
            </div>
            <div
              v-if="item.hasToggle"
              class="toggle"
              :style="{ backgroundColor: colors.brand }"
            />
          </div>
        </div>

        <!-- Main Area -->
        <div class="main-area" :style="{ backgroundColor: colors.background }" />
      </div>
    </div>
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

// Navigation items with avatar colors and toggle states
const navItems = [
  { avatarColor: '#FFBE41', hasToggle: true },
  { avatarColor: '#6497DE', hasToggle: true },
  { avatarColor: '#41FF77', hasToggle: false },
  { avatarColor: '#FF41BD', hasToggle: true },
  { avatarColor: '#41FF77', hasToggle: false },
];

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

const colors = computed(() => {
  return themeColors[props.theme]?.[props.mode] || themeColors.dp.light;
});

const containerClasses = computed(() => {
  return [
    `theme-${props.theme}`,
    `mode-${props.mode}`,
  ];
});
</script>

<style scoped>
.themes-visual-container {
  transition: all 0.3s ease;
}

.themes-mockup {
  width: 100%;
  max-width: 844px;
  height: 380px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.mockup-header {
  height: 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.header-controls {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  gap: 16px;
}

.window-controls {
  display: flex;
  gap: 8px;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
}

.dialpad-logo {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  overflow: hidden;
}

.logo-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #10022C 0%, #611F93 20%, #C52599 46%, #EA2F6F 66%, #FD6D2D 90%, #FF9E0E 100%);
}

.header-nav {
  display: flex;
  gap: 8px;
}

.nav-item {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.6);
}

.nav-item.inactive {
  opacity: 0.4;
}

.search-bar {
  flex: 1;
  height: 32px;
  border-radius: 16px;
  margin: 0 16px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.6);
}

.mockup-content {
  display: flex;
  height: 320px;
}

.sidebar {
  width: 314px;
  padding: 20px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-item-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
}

.text-primary {
  height: 11px;
  width: 105px;
  border-radius: 5px;
  margin-bottom: 6px;
}

.text-secondary {
  height: 10px;
  width: 173px;
  border-radius: 5px;
}

.toggle {
  width: 18px;
  height: 12px;
  border-radius: 6px;
  flex-shrink: 0;
}

.main-area {
  flex: 1;
}

/* Mode-based shadows */
.mode-light .themes-mockup {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mode-dark .themes-mockup {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
