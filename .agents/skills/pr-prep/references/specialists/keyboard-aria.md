# Keyboard and ARIA

Run when the diff changes interactive markup, stories or key handlers.

- `aria-label` or `aria-labelledby` on an element whose role does not allow a name (plain `span` or `div`)? Use visible or visually hidden text, or name the interactive control.
- Menus, menu buttons, toolbars, drawers and dialogs follow WAI APG:
  - Down opens a menu at the first item, Up at the last.
  - Right and Left move between menu levels.
  - Tab and Shift+Tab close the menu and continue through the page.
  - Escape closes and returns focus to the trigger.
  - A drawer is a dialog with the background inert.
- A disabled element is never the toolbar's tab stop. `defaultPrevented` is honoured before closing on a key.
- Text cut with an ellipsis can be read on keyboard focus as well as hover. `title` alone is not enough.
- `aria-pressed`, `tabindex` and similar reach the real control, not a wrapper. Only the control needs the 44px target.
- Stories show the accessible composition consumers will copy.

The reviewer cannot press keys. Add to "Do by hand": Tab, Shift+Tab, arrows, Enter, Space and Escape on each changed interactive story.
