---
title: Dialtone VS Code Extension
description: Get Dialtone completions and documentation while working in Vue, CSS, and Less files.
keywords:
  [
    "visual studio code",
    "vscode",
    "extension",
    "autocomplete",
    "components",
    "design tokens",
    "utility classes",
  ]
---

The Dialtone extension adds component, prop, design token, and CSS utility guidance to Visual Studio Code. It keeps the most common lookups in your editor, close to the code you are writing.

## Installation

The extension is currently distributed as a VS Code extension package (`.vsix`).

1. Open the [Dialtone VS Code extension releases](https://github.com/dialpad/dialtone/releases?q=vscode-extension&expanded=true).
2. Download the `.vsix` file from the latest release.
3. In VS Code, open the Extensions view.
4. Open the **More Actions** menu, then select **Install from VSIX...**.
5. Select the file you downloaded and reload VS Code if prompted.

The language server is included in the extension. You do not need to install it separately.

### VS Code-based editors

The extension is highly likely to work in VS Code-derived IDEs, such as Cursor and the Devin IDE, but compatibility is not guaranteed. Dialtone currently validates it in VS Code only.

## Component completions

In a Vue template, start typing a Dialtone component to see matching components:

```vue
<dt-
```

After choosing a component, completions are available for its props:

```vue
<dt-button
```

Move the cursor inside a prop value to see its accepted values:

```vue
<dt-button kind=""></dt-button>
```

Hover over a Dialtone component or prop to read its documentation without leaving the file.

## Design token completions

Start typing a Dialtone custom property in a Vue style block, CSS file, or Less file:

```css
.example {
  color: var(--dt-color-);
}
```

The extension suggests matching tokens. Hover over a token to see its documentation and value.

## CSS utility completions

Completions are available inside static `class` attributes in Vue templates:

```vue
<div class="d-p-"></div>
```

Hover over a Dialtone utility class to see the CSS declaration it applies.

The extension does not currently inspect utility classes assembled inside dynamic `:class` arrays or objects.

## Supported files

The extension runs in:

- Vue files (`.vue`)
- CSS files (`.css`)
- Less files (`.less`)

Component, prop, and utility class support applies to Vue templates. Design token support applies to Vue style blocks, CSS, and Less.

## Troubleshooting

### Suggestions do not open automatically

Run **Trigger Suggest** from the Command Palette. VS Code may also have a keyboard shortcut assigned to that command.

### The extension does not respond

Run **Dialtone: Show Output** from the Command Palette. The Dialtone output channel reports language server startup and processing errors.

The command is available while the Dialtone language server is running. If it is missing, confirm that you opened a `.vue`, `.css`, or `.less` file, then reload the VS Code window.

### A utility class is not suggested

Confirm that the class is inside a static `class` attribute. Dynamic `:class` expressions are not currently supported.
