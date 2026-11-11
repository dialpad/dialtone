import { serializeExampleTemplate } from './code_copy';

it('retains snapshot setup responsibilities in serialized templates for clipboard and preset delivery', () => {
  const template = serializeExampleTemplate({
    info: {
      displayName: 'DtFilterPill',
      metadata: { copyNotice: 'Snapshot. Bind v-model:selected for interaction.' },
      bindings: { get: () => [] },
    },
    options: { bindings: { get: () => ({}) } },
    disabledMembers: new Set(),
  });
  expect(template).toBe('<!-- Snapshot. Bind v-model:selected for interaction. -->\n<dt-filter-pill />');
});
