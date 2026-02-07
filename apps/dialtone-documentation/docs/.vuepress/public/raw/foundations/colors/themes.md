# Themes

Theme options that allow user customization of Dialpad products.

- **Keywords**: dark mode,light mode,color scheme

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
| Theme | Light Mode | Dark Mode |
| --- | --- | --- |
| Dialpad |  |  |
| T-Mobile |  |  |
| Sunflower |  |  |
| Ceruleo |  |  |
| Melon |  |  |
| Aegean |  |  |
| Verdant Haze |  |  |
| Plum |  |  |
| Buttercream |  |  |
| Botany |  |  |
| High Desert |  |  |

</div>

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

**Do:**

<div class="d-bgc-secondary d-bar8">
      <svg-loader class="d-fl1" name="theme-contrast-do" />
    </div>

**Don't:**

<div class="d-bgc-secondary d-bar8">
      <svg-loader class="d-fl1" name="theme-contrast-dont" />
    </div>

## Related

- If you need full list of all the shell tokens, [Check out our list of colors](../palette/index.md).
- [See our entire token catalog with full descriptions and values of all tokens.](../../../tokens/index.md).
