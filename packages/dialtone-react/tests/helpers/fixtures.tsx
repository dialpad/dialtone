// dialtone-vue's tests/fixtures/component.vue: a component that renders nothing, passed where a test only needs
// some slot content (Button's and Chip's icon slots). In React it's an element: `icon: <EmptyComponentFixture />`.
// Vue's radios.vue fixture needs DtRadio, so RadioGroup's port builds it in its own test.
export function EmptyComponentFixture () {
  return null;
}
