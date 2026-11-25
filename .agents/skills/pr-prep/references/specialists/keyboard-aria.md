# Keyboard and ARIA

Run when the diff changes interactive markup, stories or key handlers.

- Start with the widget's actual pattern in the WAI-ARIA Authoring Practices and the Dialtone accessibility checklist (`packages/dialtone-docs/src/content/reference/reference-accessibility-checklist.md`). Do not carry one widget's keys to another: menus, toolbars and modals differ. Enter and Space are the menu-button defaults, arrow-key opening is optional, and some `aria-disabled` items stay focusable.
- Check the real control's accessible name and state, not a wrapper's.
- Cover focus entry, movement, dismissal and return where they apply, including nested and portaled overlays.
- For status changes, check what gets announced, even if the diff only changes logic.
- Use the existing interaction tests, and call out what still needs a keyboard or screen-reader pass.

The reviewer cannot press keys. Add that pass to "Do by hand" for each changed interactive story.
