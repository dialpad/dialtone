/**
 * DtCodeblock.
 *
 * The one container in this batch that needs no child components: its content is a `text`
 * PROP, not a slot, so it measured fine the whole time and was only ever blocked by being
 * grouped with the four that do.
 *
 * `text` is deliberately two lines with one long enough to exceed the narrow sizes. A
 * single short line makes every size variant hug to the same width, and a set where four
 * sizes are pixel-identical says nothing about the sizes.
 */
const SAMPLE = 'const tokens = await build();\nexport default tokens;';

export default {
  component: 'DtCodeblock', label: '', page: 'Codeblock',
  figmaSetId: '286:5331',

  axes: {
    // `codeblock.less` keys padding and font-size off the size modifier.
    size: [100, 200, 300, 400],
    // Draws a border and, with it, a different box.
    bordered: [false, true],
  },

  props: c => ({ text: SAMPLE, size: c.size, bordered: c.bordered }),

  variantName: c => `size=${c.size}, bordered=${c.bordered}`,
};
