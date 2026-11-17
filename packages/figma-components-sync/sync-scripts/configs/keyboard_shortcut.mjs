/**
 * DtKeyboardShortcut: a row of key caps. The one design axis is `shortcut`.
 *
 * `shortcut` is a STRING, parsed by the component into one cap per key, and a `{token}` (`{cmd}`, `{opt}`, the
 * arrows, `{plus}`) renders an ICON where a plain key renders text. So its value changes the anatomy: a short
 * form, a modifier icon and a longer chord are all swept, written WITH braces (`cmd+K` without them is just
 * the text "cmd"). A TEXT property cannot add keys or swap glyphs, which is why it is an axis.
 *
 * Left out: `inverted` (deprecated; a dark surface is a mode, not a prop) and `screenReaderText` (paints nothing).
 */
export default {
  component: 'DtKeyboardShortcut', label: '', page: 'KeyboardShortcut', family: 'Content',
  snapTokens: true,
  // Each key's text sits in an inline <span> that measures its 17px content area inside a 22.4px line: centre the
  // text on that frame, as the browser's half-leading does, or it hangs 2.7px low.
  inlineLineBox: true,

  // How the set reads in Dev Mode (see code-connect.mjs). The shortcut string is the whole content.
  codeConnect: {
    source: 'packages/dialtone-vue/components/KeyboardShortcut/KeyboardShortcut.vue',
    alwaysAxes: ['shortcut'],
    selfClosing: true,
  },

  axes: {
    shortcut: ['K', '{cmd}+K', '{cmd}+Shift+K'],
  },
  variantName: c => `shortcut=${c.shortcut}`,
  props: c => ({ shortcut: c.shortcut }),
  slots: () => [],
};
