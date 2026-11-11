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

it('keeps copy notices inside one template comment', () => {
  const template = serializeExampleTemplate({
    info: {
      displayName: 'DtButton',
      metadata: { copyNotice: 'Snapshot --> <script>bad()</script>' },
      bindings: { get: () => [] },
    },
    options: { bindings: { get: () => ({}) } },
    disabledMembers: new Set(),
  });
  expect(template.match(/-->/g)).toHaveLength(1);
  expect(template).toContain('Snapshot --&gt; <script>bad()</script>');
});
