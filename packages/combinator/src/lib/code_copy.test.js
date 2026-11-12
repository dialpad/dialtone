import { serializeExampleTemplate } from './code_copy';
import filterPillVariants from '../variants/variants_filter_pill';

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

it.each(['-->', '--!>'])('keeps copy notices containing %s inside one template comment', terminator => {
  const template = serializeExampleTemplate({
    info: {
      displayName: 'DtButton',
      metadata: { copyNotice: `Snapshot ${terminator} <script>bad()</script>` },
      bindings: { get: () => [] },
    },
    options: { bindings: { get: () => ({}) } },
    disabledMembers: new Set(),
  });
  const container = document.createElement('div');
  container.innerHTML = template;
  expect([...container.childNodes].map(node => node.nodeName)).toEqual(['#comment', '#text', 'DT-BUTTON']);
  expect(container.firstChild.textContent).toContain('<script>bad()</script>');
});

it.each([
  ['controlled default', 'controlled-single-selection'],
  ['controlled active', 'controlled-single-selection'],
  ['controlled empty options', 'controlled-single-selection'],
  ['controlled counts', 'controlled-single-selection'],
  ['controlled multiple', 'controlled-multiple-selection'],
  ['controlled deferred', 'controlled-multiple-selection'],
])('links the %s copied snapshot to its interactive public pattern', (preset, anchor) => {
  const template = serializeExampleTemplate({
    info: {
      displayName: 'DtFilterPill',
      metadata: filterPillVariants[preset].metadata,
      bindings: { get: () => [] },
    },
    options: { bindings: { get: () => ({}) } },
    disabledMembers: new Set(),
  });
  expect(template).toContain(`https://dialtone.dialpad.com/components/filter-pill.html#${anchor}.`);
  expect(template).toContain('Configuration snapshot. Bind selected with v-model:selected for interaction');
  expect(template).toContain('unreleased');
  expect(template).not.toContain('10.5.1');
  expect(template).not.toContain('lookup profile');
});
