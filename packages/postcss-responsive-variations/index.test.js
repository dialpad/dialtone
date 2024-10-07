const postcss = require('postcss');

const plugin = require('./');

async function run (input, output, opts = { }) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

/* Write tests here */

it('creates small responsive variation for .foo class', async () => {
  const breakpoints = [
    { prefix: 'sm\\:', mediaQuery: '(max-width: 480px)' },
  ];
  const classes = [
    '.foo',
  ];
  const input = '.foo {background-color: red;}';
  const output = '.foo {background-color: red;}@media (max-width: 480px) {.sm\\:foo {background-color: red;}}';
  await run(input, output, { breakpoints, classes });
});

it('creates small responsive variation for .foo class but no for .bar class', async () => {
  const breakpoints = [
    { prefix: 'sm\\:', mediaQuery: '(max-width: 480px)' },
  ];
  const classes = [
    '.foo',
    '.bar',
  ];
  const input = '.foo {background-color: red;}';
  const output = '.foo {background-color: red;}@media (max-width: 480px) {.sm\\:foo {background-color: red;}}';
  await run(input, output, { breakpoints, classes });
});

it('creates all responsive variations for classes', async () => {
  const breakpoints = [
    { prefix: 'sm\\:', mediaQuery: '(max-width: 480px)' },
    { prefix: 'md\\:', mediaQuery: '(max-width: 640px)' },
    { prefix: 'lg\\:', mediaQuery: '(max-width: 960px)' },
    { prefix: 'xl\\:', mediaQuery: '(max-width: 1264px)' },
  ];
  const classes = [
    '.foo',
  ];
  const input = '.foo {background-color: red;}';
  const output = '.foo {background-color: red;}@media (max-width: 480px) {.sm\\:foo {background-color: red;}}@media (max-width: 640px) {.md\\:foo {background-color: red;}}@media (max-width: 960px) {.lg\\:foo {background-color: red;}}@media (max-width: 1264px) {.xl\\:foo {background-color: red;}}';
  await run(input, output, { breakpoints, classes });
});

it('creates responsive variations from regex expresion', async () => {
  const breakpoints = [
    { prefix: 'sm\\:', mediaQuery: '(max-width: 480px)' },
  ];
  const classes = [
    /\.foo-*/,
  ];
  const input = '.foo-1 {background-color: red;}.foo-2 {background-color: green;}';
  const output = '.foo-1 {background-color: red;}.foo-2 {background-color: green;}@media (max-width: 480px) {.sm\\:foo-1 {background-color: red;}.sm\\:foo-2 {background-color: green;}}';
  await run(input, output, { breakpoints, classes });
});

it('overrides existing media query', async () => {
  const breakpoints = [
    { prefix: 'sm\\:', mediaQuery: '(max-width: 480px)' },
  ];
  const classes = [
    '.foo',
  ];
  const input = '.foo {background-color: red;}@media (max-width: 480px) {.bar {background-color: green;}}';
  const output = '.foo {background-color: red;}@media (max-width: 480px) {.bar {background-color: green;}.sm\\:foo {background-color: red;}}';
  await run(input, output, { breakpoints, classes });
});

it('uses default breakpoints', async () => {
  const classes = ['.foo'];
  const input = '.foo {background-color: red;}';
  const output = '.foo {background-color: red;}@media (max-width: 480px) {.sm\\:foo {background-color: red;}}@media (max-width: 640px) {.md\\:foo {background-color: red;}}@media (max-width: 960px) {.lg\\:foo {background-color: red;}}@media (max-width: 1264px) {.xl\\:foo {background-color: red;}}';
  await run(input, output, { classes });
});

it('works with no arguments', async () => {
  const input = '.foo {background-color: red;}';
  const output = '.foo {background-color: red;}';
  await run(input, output);
});

it('overrides default breakpoints', async () => {
  const breakpoints = [
    { prefix: 'sm\\:', mediaQuery: '(max-width: 1000px)' },
  ];
  const classes = [
    '.foo',
  ];
  const input = '.foo {background-color: red;}';
  const output = '.foo {background-color: red;}@media (max-width: 1000px) {.sm\\:foo {background-color: red;}}';
  await run(input, output, { breakpoints, classes });
});

it('creates small responsive variation for a composed class', async () => {
  const breakpoints = [
    { prefix: 'sm\\:', mediaQuery: '(max-width: 480px)' },
  ];
  const classes = [
    '.foo',
    '.bar',
    /\.bar-[0-9]$/,
  ];
  const input = '.foo, .h\\:foo:hover, .f\\:foo:focus, .bar {background-color: red;}';
  const output = '.foo, .h\\:foo:hover, .f\\:foo:focus, .bar {background-color: red;}@media (max-width: 480px) {.sm\\:foo {background-color: red;}.sm\\:bar {background-color: red;}}';
  await run(input, output, { breakpoints, classes });
});
