import { serializeExampleTemplate } from './code_copy';
import filterPillVariants from '../variants/variants_filter_pill';

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
  { pattern: 'controlled-single-selection',
    presets: ['controlled default', 'controlled active', 'controlled empty options', 'controlled counts'] },
  { pattern: 'controlled-multiple-selection', presets: ['controlled multiple', 'controlled deferred'] },
])('links $pattern presets to their public pattern and owns their exclusions', ({ pattern, presets }) => {
  const destination = `https://dialtone.dialpad.com/components/filter-pill.html#${pattern}`;
  for (const preset of presets) {
    const metadata = filterPillVariants[preset].metadata;
    expect(metadata.copyNotice).toContain(destination);
    expect(metadata.lookupExclude.owner).toMatch(/\S/);
    expect(metadata.lookupExclude.reason).toMatch(/\S/);
  }
  const template = serializeExampleTemplate({
    info: {
      displayName: 'DtFilterPill',
      metadata: filterPillVariants[presets[0]].metadata,
      bindings: { get: () => [] },
    },
    options: { bindings: { get: () => ({}) } },
    disabledMembers: new Set(),
  });
  expect(template).toContain(destination);
});
