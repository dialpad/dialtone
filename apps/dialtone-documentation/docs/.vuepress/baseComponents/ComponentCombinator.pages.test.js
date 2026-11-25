import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, URL as NodeURL } from 'node:url';
import matter from 'gray-matter';
import { shallowMount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import * as components from '@dialpad/dialtone-vue';
import { DtcCombinator, variantBank } from '@dialpad/dialtone-combinator';
import allDocs from '@workspaceRoot/packages/dialtone-vue/dist/component-documentation.json';
import ComponentCombinator from './ComponentCombinator.vue';
import {
  getComponentCombinatorName,
  getCombinatorPresetName,
  getCombinatorPresetSlugs,
} from '../theme/utils/componentCombinator.js';

const directory = fileURLToPath(new NodeURL('../../components/', import.meta.url));
const pages = readdirSync(directory, { recursive: true }).filter(file => file.endsWith('.md')).map(file => ({
  file,
  frontmatter: matter(readFileSync(join(directory, file), 'utf8')).data,
})).filter(page => page.frontmatter.combinator);

it('discovers pages using the shared playground', () => {
  expect(pages.length).toBeGreaterThan(0);
});

for (const { file, frontmatter } of pages) {
  it(`${file} can open its presets through the shared wrapper`, async () => {
    const componentName = getComponentCombinatorName(frontmatter);
    expect(componentName).toBeTruthy();
    expect(components[componentName]).toBeDefined();
    expect(allDocs.some(doc => doc.displayName === componentName)).toBe(true);
    const bank = variantBank()[componentName] ?? {};
    const slugs = getCombinatorPresetSlugs(bank);
    for (const [name, slug] of Object.entries(slugs)) {
      expect(getCombinatorPresetName(bank, slug)).toBe(name);
    }
    const preset = Object.keys(slugs).find(name => name !== 'default') ?? 'default';
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/:path(.*)*', component: { render: () => null } }],
    });
    await router.push({ path: `/components/${file.replace(/\.md$/, '.html')}`, query: { preset: slugs[preset] } });
    await router.isReady();
    const wrapper = shallowMount(ComponentCombinator, {
      props: { componentName },
      global: {
        plugins: [router],
        components: { DtcCombinator },
        provide: {
          dialtoneComponents: components,
          dialtoneComponentsDocumentation: allDocs,
          dialtoneIcons: {},
          dialtoneIllustrations: {},
        },
      },
    });
    try {
      expect(wrapper.findComponent(DtcCombinator).props('preset')).toBe(preset);
    } finally {
      wrapper.unmount();
    }
  });
}
