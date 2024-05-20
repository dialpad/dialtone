---
title: Contributing
description: Help Dialtone be even better.
---

## Component contribution

### Design

TBD

### Code

To make code changes in our Design System please first read the
[CONTRIBUTING.md](https://github.com/dialpad/dialtone/blob/staging/.github/CONTRIBUTING.md#contributing)
in our Dialtone repository.

## Adding icons and illustrations

If you need to add an icon into Dialtone, here’s how you would go about doing that.

### For system icons

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

### For system illustrations

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
