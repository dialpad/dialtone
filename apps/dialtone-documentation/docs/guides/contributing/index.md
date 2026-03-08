---
title: Contributing
description: Help Dialtone be even better.
keywords: ["contribute","pull request","development"]
---

## Component Contribution

### Design

TBD

### Code

To make code changes in our Design System please first read the
[CONTRIBUTING.md](https://github.com/dialpad/dialtone/blob/staging/.github/CONTRIBUTING.md#contributing)
in our Dialtone repository.

### CSS Architecture

#### Cascade Layers

Dialtone uses [CSS Cascade Layers](../css-layers/) to organize styles into a predictable hierarchy. When contributing CSS, all styles must be wrapped in the appropriate `@layer` block. Read the [CSS Layers Guide](../css-layers/) to understand where to place your styles.

#### Selector Specificity

All component selectors should target a specificity of `(0,1,0)` — a single class. BEM naming naturally achieves this. Use CSS custom properties for modifier overrides instead of increasing selector depth, and wrap bare element descendants (e.g., `th`, `td`, `a`) in `:where()` to keep specificity flat. See the [dialtone-css CONTRIBUTING guide](https://github.com/dialpad/dialtone/blob/staging/packages/dialtone-css/.github/CONTRIBUTING.md) for full details and examples.

## Adding Icons and Illustrations

If you need to add an icon into Dialtone, here’s how you would go about doing that.

### For System Icons

1. Create a new branch starting with "feat/" in the name.
2. Place the exported SVG file(s) in the appropriate folder category inside `packages/dialtone-icons/src/svg/icons/`
3. If you need to add keywords related to the icon.
   - Add the icon name to `packages/dialtone-icons/src/keywords-icons.json` into the correct category.
   - Add the keywords array as the value. e.g.

   ```json
   {
      "arrows": {
        "arrow-left": ["arrow", "left", "direction"],
        ...
      }
   }
   ```

4. Commit and push your branch.
5. Open a pull request.
6. Once approved it can be merged into staging and will go out in the next release.

### For System Illustrations

1. Create a new branch starting with "feat/" in the name.
2. Place the exported SVG file(s) in the appropriate folder category inside `packages/dialtone-icons/src/svg/illustrations/`
3. If you need to add keywords related to the illustration.
   - Add the illustration name to `packages/dialtone-icons/src/keywords-illustrations.json` into the correct category.
   - Add the keywords array as the value. e.g.

   ```json
   {
      "spot-illustrations": {
        "blank-space": ["blank", "space"],
        ...
      }
   }
   ```

4. Commit and push your branch.
5. Open a pull request.
6. Once approved it can be merged into staging and will go out in the next release.
