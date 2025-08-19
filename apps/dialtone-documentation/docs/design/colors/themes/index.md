---
title: Themes
description: Create diverse themes for projects using our simplified theming infrastructure.
no_preview: true
---

<div class="d-m32"></div>

## Overview

Dialtone's theming system is a flexible foundation for creating consistent visual experiences. It lets you adapt the user interface to different contexts, preferences, and product variations. Our approach uses semantic color tokens to easily switch between themes and modes.

Currently, the only themeable part of the application is the shell, which consists of the top and left navigation.

<themes-interactive />

### Theme List

<div class="d-bb d-bc-default">
  <table class="d-table">
    <thead>
      <tr>
        <th>Theme</th>
        <th>Light Mode</th>
        <th>Dark Mode</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <code class="d-code--sm">Dialpad</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: var(--dt-color-black-100);" title="Background"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-200);" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-300);" title="Border"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-purple-500);" title="Brand"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-400);" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: var(--dt-color-black-900);" title="Background"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-800);" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-700);" title="Border"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-purple-300);" title="Brand"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-500);" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <td>
          <code class="d-code--sm">T-Mobile</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: var(--dt-color-black-100);" title="Background"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-200);" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-300);" title="Border"></div>
            <div class="color-swatch" style="background-color: #E20074;" title="Brand"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-400);" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: var(--dt-color-black-900);" title="Background"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-800);" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-700);" title="Border"></div>
            <div class="color-swatch" style="background-color: #E20074;" title="Brand"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-500);" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <td>
          <code class="d-code--sm">Expressive</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: var(--dt-color-black-100);" title="Background"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-200);" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-300);" title="Border"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-coral-500);" title="Brand"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-400);" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: var(--dt-color-black-900);" title="Background"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-800);" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-700);" title="Border"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-coral-300);" title="Brand"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-500);" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <td>
          <code class="d-code--sm">Sunflower</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: var(--dt-color-black-100);" title="Background"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-gold-100);" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-black-300);" title="Border"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-gold-500);" title="Brand"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-gold-600);" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: var(--dt-color-black-900);" title="Background"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-gold-700);" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-gold-700);" title="Border"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-gold-300);" title="Brand"></div>
            <div class="color-swatch" style="background-color: var(--dt-color-gold-300);" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<div class="d-bgc-brand d-bar8"><svg-loader class="d-fl1" name="theme-variations" /></div>

### Mode

A mode defines a visual style that applies across all themes. It determines the overall luminosity and contrast of the interface. For example, light mode has a light background and dark text, while dark mode has a dark background and light text.

### Theme

A theme represents a specific brand or product identity. It applies a unique set of colors to the shell, and it works in conjunction with a mode. For example, Dialpad default theme uses purple accents and T-mobile uses pink accents for the shell.

## Theming with Shell Tokens

The shell tokens are a specialized set of tokens for theming the topbar and sidebar. They are designed to be easily customized while maintaining a coherent color scheme.

### Shell Base Tokens

These are the core reference colors for the shell. They are directly linked to the base tokens and determine the overall color palette of the topbar and sidebar. These base tokens are the only ones that should be modified when creating a custom theme.

<div class="d-bgc-brand d-bar8"><svg-loader class="d-fl1" name="base-tokens" /></div>

<div class="d-m32"></div>

### Shell Modifier Tokens

These tokens, such as shell-action, shell-status, shell-core, and shell-accent, inherit their values from the shell base tokens. They use modifiers to create variations and specific color states (e.g., hover, active, disabled) for interactive elements within the topbar and sidebar.

<div class="d-bgc-brand d-bar8"><svg-loader class="d-fl1" name="base-shell-token" /></div>

<div class="d-m32"></div>

This structure allows for a cascading effect: changing a shell base token automatically updates all related shell modifier tokens, making it simple to create and manage custom themes for the application's shell.
<div class="d-bgc-brand d-bar8"><svg-loader class="d-fl1" name="token-structure" /></div>

<div class="d-m32"></div>

## Accessibility

When creating a custom theme, it is important to ensure that the colors used are accessible. This means that the colors should be easy to read and contrast well with the background.

<dialtone-usage class="d-d-grid d-g24 d-g-cols2">
  <template #do>
    <div class="d-bgc-brand d-bar8">
      <svg-loader class="d-fl1" name="theme-contrast-do" />
    </div>
  </template>
  <template #dont>
    <div class="d-bgc-brand d-bar8">
      <svg-loader class="d-fl1" name="theme-contrast-dont" />
    </div>
  </template>
</dialtone-usage>

## Related

- If you need full list of all the shell tokens, [Check out our list of colors](../palette/index.md).
- [See our entire token catalog with full descriptions and values of all tokens.](../../../tokens/index.md).

<script setup>
import ThemesInteractive from '@baseComponents/ThemesInteractive.vue';
</script>

<style scoped>
.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--dt-color-black-300);
  flex-shrink: 0;
}
</style>
