const postcss = require('postcss');

const plugin = require('./dialtone-generators.js');

async function run (input, output, opts = { }) {
  const result = await postcss([plugin()]).process(input, { from: undefined });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

it('appends color utilities', async () => {
  const input = '';
  const output = '';
  await run(input, output);
});
