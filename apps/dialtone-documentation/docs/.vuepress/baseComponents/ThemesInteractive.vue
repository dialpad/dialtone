<template>
  <div class="themes-interactive">
    <!-- Theme Controls Bar -->
    <dt-stack gap="500" class="d-p16 d-bgc-secondary d-bar8">
      <dt-stack direction="row" gap="500" class="d-ai-flex-end">
        <dt-select-menu
          name="mode-select"
          label="Mode"
          select-class="d-fl1"
          :value="selectedMode"
          :options="MODES"
          @change="updateMode"
        />
        <dt-select-menu
          name="theme-select"
          label="Theme"
          select-class="d-fl1"
          :value="selectedTheme"
          :options="THEMES"
          @change="updateTheme"
        />
      </dt-stack>
    </dt-stack>

    <!-- Theme Visual Preview -->
    <div class="d-mt16">
      <div :class="containerClasses" class="themes-container">
        <div class="themes-mockup" :style="{ backgroundColor: colors.background }">
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
                <span class="nav-item" />
                <span class="nav-item inactive" />
                <span class="nav-item inactive" />
              </div>
              <div class="search-bar" :style="{ backgroundColor: `${colors.text}0D` }" />
              <div class="header-actions">
                <span class="action-btn" />
                <span class="action-btn" />
              </div>
            </div>
          </div>

          <!-- Content Area -->
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
                  :style="{ backgroundColor: item.toggleColor }"
                />
              </div>
            </div>

            <!-- Main Area -->
            <div class="main-area" :style="{ backgroundColor: colors.background }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Reactive state for the selected options
const selectedMode = ref('light');
const selectedTheme = ref('dp');

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
  selectedMode.value = newMode;
};

const updateTheme = (newTheme) => {
  selectedTheme.value = newTheme;
};

// Theme color configurations
const themeColors = {
  dp: {
    light: {
      background: '#ffffff',
      surface: '#f5f5f5',
      sidebar: '#eaeaea',
      text: '#1c1c1c',
      brand: '#6c23ce',
    },
    dark: {
      background: '#1c1c1c',
      surface: '#414141',
      sidebar: '#686868',
      text: '#ffffff',
      brand: '#b28ae5',
    },
  },
  tmo: {
    light: {
      background: '#ffffff',
      surface: '#f5f5f5',
      sidebar: '#eaeaea',
      text: '#1c1c1c',
      brand: '#e20074',
    },
    dark: {
      background: '#1c1c1c',
      surface: '#414141',
      sidebar: '#686868',
      text: '#ffffff',
      brand: '#ff6bb3',
    },
  },
  expressive: {
    light: {
      background: '#ffffff',
      surface: '#f5f5f5',
      sidebar: '#eaeaea',
      text: '#1c1c1c',
      brand: '#ff6900',
    },
    dark: {
      background: '#1c1c1c',
      surface: '#414141',
      sidebar: '#686868',
      text: '#ffffff',
      brand: '#ff9500',
    },
  },
  sunflower: {
    light: {
      background: '#ffffff',
      surface: '#f5f5f5',
      sidebar: '#eaeaea',
      text: '#1c1c1c',
      brand: '#ffbe41',
    },
    dark: {
      background: '#1c1c1c',
      surface: '#414141',
      sidebar: '#686868',
      text: '#ffffff',
      brand: '#ffd700',
    },
  },
};

const colors = computed(() => {
  return themeColors[selectedTheme.value]?.[selectedMode.value] || themeColors.dp.light;
});

const containerClasses = computed(() => {
  return [
    `theme-${selectedTheme.value}`,
    `mode-${selectedMode.value}`,
  ];
});

const navItems = computed(() => {
  return [
    {
      avatarColor: '#FFBE41',
      hasToggle: true,
      toggleColor: colors.value.brand,
    },
    {
      avatarColor: '#7C52FF',
      hasToggle: false,
    },
    {
      avatarColor: '#FF6B9D',
      hasToggle: true,
      toggleColor: colors.value.brand,
    },
    {
      avatarColor: '#4ECDC4',
      hasToggle: false,
    },
  ];
});
</script>

<style scoped>
.themes-interactive {
  margin: 2rem 0;
  transition: all 0.3s ease;
}

.themes-container {
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
