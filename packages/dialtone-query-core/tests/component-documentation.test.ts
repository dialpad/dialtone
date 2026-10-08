import { describe, it, expect } from 'vitest';
import { components, componentDocumentation } from '../src/data.js';
import { getComponentDocumentation } from '../src/component-documentation.js';
import { getComponentDetail } from '../src/component-detail.js';
describe('canonical authored documentation joins', () => {
  it.each([
    ['DtButton', '/components/button.html', 'api'],
    ['DtText', '/components/text.html', 'api'],
    ['tabpanel', '/components/tabs.html', 'api'],
    ['textlistitem', '/components/text-list.html', 'api'],
    ['emoji_picker', '/components/emoji-picker.html', 'api'],
    ['resizable_panel', '/components/resizable.html', 'api'],
    ['DtInputGroup', '/components/input-group.html', 'api'],
    ['DtSelectMenu', '/components/select-menu.html', 'api'],
    ['DtDropdownSeparator', '/components/dropdown.html', 'companion'],
    ['DtIllustration', '/components/illustration.html', 'api'],
  ])(
    'joins %s using C1 identity and source-derived page routes',
    (name, path, relation) => {
      const selected = getComponentDetail({ component: name }, components);
      expect(selected.component).not.toBeNull();
      const result = getComponentDocumentation(
        selected.component!.identity,
        componentDocumentation,
      );
      expect(result.status).toBe('available');
      expect(result.pages[0]).toMatchObject({
        url: `https://dialtone.dialpad.com${path}`,
        relation,
        apiContentStatus: 'unverified',
      });
      expect(result.versionScope).toBe('latest');
      expect(result.installedCompatibility).toBe('not_checked');
    },
  );
  it('keeps beta and deprecated status while withholding unassociated/legacy links', () => {
    const lookup = (name: string) =>
      getComponentDocumentation(
        getComponentDetail({ component: name }, components).component?.identity,
        componentDocumentation,
      );
    expect(lookup('DtResizablePanel').pages[0].pageStatus).toBe('beta');
    expect(lookup('DtInputGroup').pages[0].pageStatus).toBe('deprecated');
    expect(lookup('DtCodeblock')).toMatchObject({
      status: 'missing',
      pages: [],
      reason: 'no_authored_component_association',
    });
    expect(
      getComponentDocumentation(undefined, componentDocumentation).status,
    ).toBe('unverified_identity');
  });
  it('preserves conflicting source candidates without asserting a primary URL', () => {
    const page = componentDocumentation.pages.find((page) =>
      page.components.some(
        (reference) => reference.canonicalName === 'DtButton',
      ),
    )!;
    const result = getComponentDocumentation(
      getComponentDetail({ component: 'DtButton' }, components).component!
        .identity,
      {
        ...componentDocumentation,
        pages: [
          page,
          { ...page, docId: 'components/conflict', pagePath: '/conflict.html' },
        ],
      },
    );
    expect(result.status).toBe('ambiguous');
    expect(result.pages).toHaveLength(2);
    expect(result).not.toHaveProperty('url');
  });
});
