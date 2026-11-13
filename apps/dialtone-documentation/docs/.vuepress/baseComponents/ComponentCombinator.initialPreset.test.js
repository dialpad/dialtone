import { mountDocsCombinator, settleCombinator as settle } from './combinatorTestUtils.js';

let wrapper;
let router;
let combinator;

afterEach(() => {
  wrapper?.unmount();
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
});

describe('bank-preferred initial presets', () => {
  const otherQuery = { other: 'keep', filter: ['a', 'b'], flag: null };

  async function mountFilterPill (query = {}) {
    ({ wrapper, router, combinator } = await mountDocsCombinator({ ...otherQuery, ...query }));
    await router.push({ path: '/components/filter-pill.html', query: { ...otherQuery, ...query }, hash: '#usage' });
    await wrapper.setProps({ componentName: 'DtFilterPill' });
    await settle();
  }

  it.each([undefined, 'unknown', ['default', 'controlled-active']])(
    'loads the preferred initial preset for missing or invalid query %s', async preset => {
      await mountFilterPill(preset === undefined ? {} : { preset });
      expect(combinator.vm.selectedVariant).toBe('controlled default');
      expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.options).toEqual([
        { value: 'all', label: 'All Messages', shortLabel: 'All' },
        { value: 'unread', label: 'Unread' },
        { value: 'mentions', label: 'Mentions & Reactions', shortLabel: 'Mentions' },
      ]);
    },
  );

  it('keeps legacy default shareable and removes only preset when returning to the preferred baseline', async () => {
    await mountFilterPill();
    expect(combinator.vm.selectedVariant).toBe('controlled default');
    combinator.vm.updateVariant('default');
    await settle();
    expect(combinator.vm.selectedVariant).toBe('default');
    expect(router.currentRoute.value.query).toEqual({ ...otherQuery, preset: 'default' });
    window.history.replaceState(null, '', router.currentRoute.value.fullPath.replace('#usage', '#props'));
    combinator.vm.updateVariant('controlled default');
    await settle();
    expect(router.currentRoute.value.query).toEqual(otherQuery);
    expect(router.currentRoute.value.hash).toBe('#props');
    expect(combinator.vm.selectedVariant).toBe('controlled default');
    combinator.vm.updateVariant('default');
    await settle();
    combinator.vm.resetOptions();
    await settle();
    expect(router.currentRoute.value.query).toEqual(otherQuery);
    expect(combinator.vm.selectedVariant).toBe('controlled default');
  });

  it('restores legacy and preferred presets through Back and Forward', async () => {
    await mountFilterPill();
    await router.push({ query: { ...otherQuery, preset: 'default' }, hash: '#usage' });
    await settle();
    expect(combinator.vm.selectedVariant).toBe('default');
    router.back();
    await settle();
    expect(combinator.vm.selectedVariant).toBe('controlled default');
    expect(router.currentRoute.value.query).toEqual(otherQuery);
    router.forward();
    await settle();
    expect(combinator.vm.selectedVariant).toBe('default');
    expect(router.currentRoute.value.query).toEqual({ ...otherQuery, preset: 'default' });
  });

  it('keeps custom edits after removing a preferred-bank preset query', async () => {
    await mountFilterPill({ preset: 'controlled-active' });
    expect(combinator.vm.selectedVariant).toBe('controlled active');
    combinator.vm.onComponentEvent('update:label', 'Keep this label');
    await settle();
    expect(combinator.vm.selectedVariant).toBe('');
    expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.label).toBe('Keep this label');
    expect(router.currentRoute.value.query).toEqual(otherQuery);
  });
});
