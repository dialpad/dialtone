---
title: Themes
Theme options that allow user customization of Dialpad products.
no_preview: true
---

<div class="d-m32"></div>

## Overview

Dialtone's theming system is a flexible foundation for creating consistent visual experiences. It lets you adapt the user interface to different contexts, preferences, and product variations. Our approach uses semantic color tokens to easily switch between themes and modes.

Theming is limited to the application's navigation regions, consisting of the top and left.

<div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="theme-image" /></div>

### Mode

A mode defines a visual style that applies across all themes. It determines the overall luminosity and contrast of the interface. For example, light mode has a light background and dark text, while dark mode has a dark background and light text.

### Theme

A theme represents the core color scheme. It applies a unique set of colors to themeable regions, and it works in conjunction with a mode. For example, the default "Dialpad" theme accent may be purple, while a "Sunflower" theme's is a deep yellow.

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
            <div class="color-swatch" style="background-color: #1C1C1C;" title="Background"></div>
            <div class="color-swatch" style="background-color: #252525;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #F9F9F9;" title="Border"></div>
            <div class="color-swatch" style="background-color: #7C5CF6;" title="Accent"></div>
            <div class="color-swatch" style="background-color: #999999;" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #E6E6E6;" title="Background"></div>
            <div class="color-swatch" style="background-color: #1F1F1F;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #D4D4D4;" title="Border"></div>
            <div class="color-swatch" style="background-color: #B8A6FC;" title="Accent"></div>
            <div class="color-swatch" style="background-color: #cccccc;" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <td>
          <code class="d-code--sm">T-Mobile</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #1C1C1C;" title="Background"></div>
            <div class="color-swatch" style="background-color: #252525;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #F9F9F9;" title="Border"></div>
            <div class="color-swatch" style="background-color: #E20074;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #999999;" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #E6E6E6;" title="Background"></div>
            <div class="color-swatch" style="background-color: #1F1F1F;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #D4D4D4;" title="Border"></div>
            <div class="color-swatch" style="background-color: #F8A6CB;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #cccccc;" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <td>
          <code class="d-code--sm">Sunflower</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #380010;" title="Background"></div>
            <div class="color-swatch" style="background-color: #6A652A;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #FFF9E5;" title="Border"></div>
            <div class="color-swatch" style="background-color: #93173A;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #999999;" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #1F1C00;" title="Background"></div>
            <div class="color-swatch" style="background-color: #FE1F76;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #FFF2F3;" title="Border"></div>
            <div class="color-swatch" style="background-color: #FA8D62;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #cccccc;" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <td>
          <code class="d-code--sm">Ceruleo</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #003165;" title="Background"></div>
            <div class="color-swatch" style="background-color: #98DCFF;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #E8E9E9;" title="Border"></div>
            <div class="color-swatch" style="background-color: #FF1356;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #999999;" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #052133;" title="Background"></div>
            <div class="color-swatch" style="background-color: #5FC4F9;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #F5F9FD;" title="Border"></div>
            <div class="color-swatch" style="background-color: #FF716F;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #FFFFFF;" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <td>
          <code class="d-code--sm">Melon</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #FFE6FD;" title="Background"></div>
            <div class="color-swatch" style="background-color: #190826;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #511E76;" title="Border"></div>
            <div class="color-swatch" style="background-color: #9A006A;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #321249;" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #190826;" title="Background"></div>
            <div class="color-swatch" style="background-color: #FFE6FD;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #FFF0FE;" title="Border"></div>
            <div class="color-swatch" style="background-color: #FFB1CF;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #cccccc;" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <td>
          <code class="d-code--sm">Aegean</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #D3E0F4;" title="Background"></div>
            <div class="color-swatch" style="background-color: #10022C;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #228782;" title="Border"></div>
            <div class="color-swatch" style="background-color: #651E06;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #143A52;" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #072C2A;" title="Background"></div>
            <div class="color-swatch" style="background-color: #8CBAEB;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #8CBAEB;" title="Border"></div>
            <div class="color-swatch" style="background-color: #F4B59F;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #F9F6FF;" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <td>
          <code class="d-code--sm">Verdant Haze</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #EDF0EB;" title="Background"></div>
            <div class="color-swatch" style="background-color: #1A2214;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #344626;" title="Border"></div>
            <div class="color-swatch" style="background-color: #C0CAAE;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #3F5F01;" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #C0CAAE;" title="Background"></div>
            <div class="color-swatch" style="background-color: #1A2214;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #3F5F01;" title="Border"></div>
            <div class="color-swatch" style="background-color: #EDF0EB;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #cccccc;" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <td>
          <code class="d-code--sm">Plum</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #E4E0E8;" title="Background"></div>
            <div class="color-swatch" style="background-color: #0A0029;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #1C1C1C;" title="Border"></div>
            <div class="color-swatch" style="background-color: #DE0276;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #65318E;" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #0A0029;" title="Background"></div>
            <div class="color-swatch" style="background-color: #10022C;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #65318E;" title="Border"></div>
            <div class="color-swatch" style="background-color: #E2A4E5;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #F6E6E6;" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <td>
          <code class="d-code--sm">Buttercream</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #F0E4CB;" title="Background"></div>
            <div class="color-swatch" style="background-color: #15242E;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #1B2F3B;" title="Border"></div>
            <div class="color-swatch" style="background-color: #F4CD0B;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #2B485F;" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #282317;" title="Background"></div>
            <div class="color-swatch" style="background-color: #D2E0FF;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #ECF9F8;" title="Border"></div>
            <div class="color-swatch" style="background-color: #F4CD0B;" title="Brand"></div>
            <div class="color-swatch" style="background-color: #FFF5D3;" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <td>
          <code class="d-code--sm">Botany</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #E6EBD8;" title="Background"></div>
            <div class="color-swatch" style="background-color: #022443;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #0D6D4C;" title="Border"></div>
            <div class="color-swatch" style="background-color: #6633BB;" title="Accent"></div>
            <div class="color-swatch" style="background-color: #1C1C1C;" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #072C2A;" title="Background"></div>
            <div class="color-swatch" style="background-color: #C6E4FF;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #D3BCFF;" title="Border"></div>
            <div class="color-swatch" style="background-color: #E6E6E6;" title="Accent"></div>
            <div class="color-swatch" style="background-color: #FEDFBF;" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <td>
          <code class="d-code--sm">High Desert</code>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #ECE2CE;" title="Background"></div>
            <div class="color-swatch" style="background-color: #141F00;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #223300;" title="Border"></div>
            <div class="color-swatch" style="background-color: #E45C10;" title="Accent"></div>
            <div class="color-swatch" style="background-color: #7A5608;" title="Text"></div>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="200">
            <div class="color-swatch" style="background-color: #3F3D3C;" title="Background"></div>
            <div class="color-swatch" style="background-color: #DCD138;" title="Sidebar"></div>
            <div class="color-swatch" style="background-color: #F48662;" title="Border"></div>
            <div class="color-swatch" style="background-color: #FAEBA4;" title="Accent"></div>
            <div class="color-swatch" style="background-color: #FFE89C;" title="Text"></div>
          </dt-stack>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="theme-variations" /></div>

## Theming with Shell Tokens

The shell tokens are a specialized set of tokens for theming the topbar and sidebar. They are designed to be easily customized while maintaining a coherent color scheme.

### Shell Base Tokens

These are the core reference colors for the shell. They are directly linked to the base tokens and determine the overall color palette of the topbar and sidebar. These base tokens are the only ones that should be modified when creating a custom theme.

<div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="base-tokens" /></div>

<div class="d-m32"></div>

### Shell Modifier Tokens

These tokens, such as `shell-action...`, `shell-status...` `shell-mention...`, inherit their values from the shell base tokens. For example, they use modifiers to create variations or color states (e.g., `hover`, `active`, `disabled`).

<div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="base-shell-token" /></div>

<div class="d-m32"></div>

This structure allows for a cascading effect: changing a shell base token automatically updates all related shell modifier tokens, making it simple to create and manage custom themes for the application's shell.
<div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="token-structure" /></div>

<div class="d-m32"></div>

## Accessibility

When creating a custom theme, it is important to ensure that the colors used are accessible. This means that the colors should be easy to read and contrast well with the background.

<dialtone-usage class="d-d-grid d-g24 d-g-cols2">
  <template #do>
    <div class="d-bgc-secondary d-bar8">
      <svg-loader class="d-fl1" name="theme-contrast-do" />
    </div>
  </template>
  <template #dont>
    <div class="d-bgc-secondary d-bar8">
      <svg-loader class="d-fl1" name="theme-contrast-dont" />
    </div>
  </template>
</dialtone-usage>

## Related

- If you need full list of all the shell tokens, [Check out our list of colors](../palette/index.md).
- [See our entire token catalog with full descriptions and values of all tokens.](../../../tokens/index.md).

<style scoped>
.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--dt-color-black-300);
  flex-shrink: 0;
}
</style>
