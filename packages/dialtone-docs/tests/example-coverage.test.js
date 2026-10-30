import { describe, expect, it } from 'vitest';
import { buildExampleCoverage } from '../src/generators/documentation-examples.mjs';

const fence = markup => `\`\`\`vue demo\n${markup}\n\`\`\``;
const filePath = 'apps/dialtone-documentation/docs/utilities/typography/word-wrap.md';

describe('authored example coverage', () => {
  it('accounts for live/display twins once and keeps partial coverage explicit', () => {
    for (const frontmatter of ['', '---\ntitle: Word wrap\n---\n']) {
      const rawFile = frontmatter + `## Normal\n<!-- example-id: examples/utility-word-wrap-normal -->\n${fence('<p class="d-ww-normal">Text</p>')}\n## Other\n${fence('<p>Live</p>\n<!-- @code -->\n<p>Display</p>')}`;
      const page = buildExampleCoverage({ rawFile, filePath, records: [{ id: 'examples/utility-word-wrap-normal', example: {} }] });
      expect(page.liveCandidates).toBe(2);
      expect(page.deliveredIds).toEqual(['examples/utility-word-wrap-normal']);
      expect(page.remaining).toBe(1);
      expect(page.complete).toBe(false);
      expect(page.candidates[1].displayTwin).toBe(true);
      for (const candidate of page.candidates) expect(rawFile.split('\n')[candidate.sourceLine - 1]).toBe('```vue demo');
    }
  });

  it('does not claim scratch, non-ready or MDX sources are supported', () => {
    for (const path of ['apps/dialtone-documentation/docs/scratch.md', 'packages/dialtone-vue/directives/tooltip/tooltip.mdx']) {
      const page = buildExampleCoverage({ rawFile: fence('<dt-button />'), filePath: path, records: [] });
      expect(page.complete).toBe(false);
      expect(page.exclusion).toBeTruthy();
    }
    expect(buildExampleCoverage({ rawFile: '---\nstatus: beta\n---\n' + fence('<p>Text</p>'), filePath, records: [] }).exclusion).toContain('not-ready');
  });

  it('reports code-only and referenced forms without treating them as runnable live fences', () => {
    const page = buildExampleCoverage({ rawFile: '```sh\nnpm install package\n```\n<example-vue-file name="Example" />', filePath, records: [] });
    expect(page.liveCandidates).toBe(0);
    expect(page.referenceCandidates).toBe(2);
    expect(page.complete).toBe(false);
  });

  it('classifies actual markup without treating a page-table script as example state', () => {
    const rawFile = fence('<p class="d-ww-normal">Text</p>') + '\n<script setup>const unrelatedTable = [];</script>';
    const page = buildExampleCoverage({ rawFile, filePath, records: [] });
    expect(page.candidates[0].syntax.kind).toBe('static-html-candidate');
    const dynamic = buildExampleCoverage({ rawFile: fence('<dt-toggle v-model="checked" />'), filePath: 'components/toggle.md', records: [] });
    expect(dynamic.candidates[0].syntax.kind).toBe('needs-authored-setup');
    const script = buildExampleCoverage({ rawFile: fence('<script>alert(1)</script>'), filePath: 'components/toggle.md', records: [] });
    expect(script.candidates[0].syntax.kind).toBe('unsupported-source-syntax');
  });
});
