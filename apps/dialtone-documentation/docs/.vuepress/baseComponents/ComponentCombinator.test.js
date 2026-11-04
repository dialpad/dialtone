import { mountDocsCombinator, settleCombinator as settle } from './combinatorTestUtils.js';
import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import { vi } from 'vitest';
import { DtButton } from '@dialpad/dialtone-vue';
import { variantBank } from '@dialpad/dialtone-combinator';
import { getCombinatorPresetSlugs } from '../theme/utils/componentCombinator.js';
import { usePageTocScrollSpy } from '../theme/composables/usePageTocScrollSpy.js';
import { createRouteHashScrollGuard, writeRouteHash } from '../theme/utils/pageToc.js';

let wrapper;
let router;
let combinator;
let tocWrapper;

afterEach(() => {
  wrapper?.unmount();
  tocWrapper?.unmount();
  tocWrapper = null;
  document.querySelector('.dialtone-doc-page-scroll-container')?.remove();
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
});

async function mountDocs (query, options) {
  ({ wrapper, router, combinator } = await mountDocsCombinator(query, options));
}

it('loads a shared slug with punctuation into the named preset', async () => {
  await mountDocs({ preset: 'with-presence-no-icon' });
  expect(combinator.vm.selectedVariant).toBe('with presence, no icon');
  expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.presenceProps)
    .toEqual({ showIcon: false });
});

it('replaces the preset query while preserving unrelated query values and the live scroll-spy hash', async () => {
  await mountDocs();
  window.history.replaceState(null, '', '/components/avatar.html?preset=image&other=keep#props');
  expect(router.currentRoute.value.hash).toBe('#usage');
  combinator.vm.updateVariant('with presence, no icon');
  await settle();
  expect(router.currentRoute.value.query).toEqual({ preset: 'with-presence-no-icon', other: 'keep' });
  expect(router.currentRoute.value.hash).toBe('#props');
  expect(combinator.vm.selectedVariant).toBe('with presence, no icon');
});

it('removes the preset query on custom edits without resetting edited options', async () => {
  await mountDocs();
  combinator.vm.onComponentEvent('update:fullName', 'Custom Name');
  await settle();
  expect(router.currentRoute.value.query).toEqual({ other: 'keep' });
  expect(combinator.vm.selectedVariant).toBe('');
  const options = combinator.findComponent({ name: 'DtcRenderer' }).props('options');
  expect(options.props.fullName).toBe('Custom Name');
  expect(options.props.imageSrc).toBe('/assets/images/person.png');
});

it('removes only preset on a code-panel slot edit and preserves the live hash', async () => {
  await mountDocs({ preset: 'icon-avatar', other: 'keep', filter: ['a', 'b'], flag: null });
  const url = '/components/avatar.html?preset=icon-avatar&other=keep&filter=a&filter=b&flag#props';
  window.history.replaceState(null, '', url);
  combinator.findComponent({ name: 'DtcCodePanel' }).vm.$emit('update:options', options => {
    options.slots.icon = '<span>Edited icon</span>';
  });
  await settle();
  expect(router.currentRoute.value.query).toEqual({ other: 'keep', filter: ['a', 'b'], flag: null });
  expect(router.currentRoute.value.hash).toBe('#props');
  expect(combinator.vm.selectedVariant).toBe('');
  expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').slots.icon)
    .toBe('<span>Edited icon</span>');
});

it('preserves a cleared browser hash instead of restoring the stale route hash', async () => {
  await mountDocs();
  window.history.replaceState(null, '', '/components/avatar.html?preset=image&other=keep');
  expect(router.currentRoute.value.hash).toBe('#usage');
  combinator.vm.updateVariant('with presence');
  await settle();
  expect(router.currentRoute.value.hash).toBe('');
});

it('restores default when Back reaches a duplicate URL without a preset, then handles Forward', async () => {
  await mountDocs({});
  await router.push({ query: { preset: 'image' }, hash: '#usage' });
  await settle();
  combinator.vm.onComponentEvent('update:fullName', 'Custom Name');
  await settle();
  expect(combinator.vm.selectedVariant).toBe('');
  const backFinished = new Promise(resolve => {
    const stop = router.afterEach(() => { stop(); resolve(); });
  });
  router.back();
  await backFinished;
  await settle();
  expect(combinator.vm.selectedVariant).toBe('default');
  expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Daniel Parker');
  const forwardFinished = new Promise(resolve => {
    const stop = router.afterEach(() => { stop(); resolve(); });
  });
  router.forward();
  await forwardFinished;
  await settle();
  expect(combinator.vm.selectedVariant).toBe('default');
});

it('applies a different preset URL after custom edits', async () => {
  await mountDocs();
  combinator.vm.onComponentEvent('update:fullName', 'Custom Name');
  await settle();
  await router.push({ query: { preset: 'with-presence' }, hash: '#usage' });
  await settle();
  expect(combinator.vm.selectedVariant).toBe('with presence');
});

it.each(['hash', 'query'])('preserves custom edits on unrelated same-page %s navigation', async kind => {
  await mountDocs();
  combinator.vm.onComponentEvent('update:fullName', 'Custom Name');
  await settle();
  if (kind === 'query') {
    await router.push({ query: { other: 'changed' } });
  } else {
    await writeRouteHash(router, router.currentRoute.value, '#props', createRouteHashScrollGuard());
  }
  await settle();
  expect(combinator.vm.selectedVariant).toBe('');
  expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Custom Name');
});

it('does not cancel an external page navigation when a preset is selected', async () => {
  await mountDocs({});
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let entered;
  const waiting = new Promise(resolve => { entered = resolve; });
  const stop = router.beforeEach(async to => {
    if (to.path === '/components/button.html') { entered(); await held; }
  });
  const navigating = router.push('/components/button.html');
  await waiting;
  combinator.vm.updateVariant('image');
  release();
  expect(await navigating).toBeUndefined();
  await settle();
  stop();
  expect(router.currentRoute.value.path).toBe('/components/button.html');
  expect(router.currentRoute.value.query.preset).toBeUndefined();
});

it('applies a deferred preset if the external page navigation is aborted', async () => {
  await mountDocs({});
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let entered;
  const waiting = new Promise(resolve => { entered = resolve; });
  const stop = router.beforeEach(async to => {
    if (to.path === '/components/button.html') { entered(); await held; return false; }
  });
  const navigating = router.push('/components/button.html');
  await waiting;
  combinator.vm.updateVariant('image');
  release();
  await navigating;
  await settle();
  stop();
  expect(router.currentRoute.value.path).toBe('/components/avatar.html');
  expect(router.currentRoute.value.query.preset).toBe('image');
  expect(combinator.vm.selectedVariant).toBe('image');
});

it('synchronizes a stale hash without scrolling the mounted TOC, then allows a real TOC click', async () => {
  await mountDocs();
  const scroller = document.createElement('div');
  scroller.className = 'dialtone-doc-page-scroll-container';
  scroller.innerHTML = '<h2 id="usage">Usage</h2><h2 id="props">Props</h2>';
  scroller.scrollTo = vi.fn();
  document.body.append(scroller);
  let toc;
  tocWrapper = mount({
    setup () {
      toc = usePageTocScrollSpy(ref([{ link: '#usage' }, { link: '#props' }]));
      return () => null;
    },
  }, { global: { plugins: [router] } });
  await settle();
  scroller.scrollTo.mockClear();
  window.history.replaceState(null, '', '/components/avatar.html?preset=image&other=keep#props');
  combinator.vm.updateVariant('with presence');
  await settle();
  expect(router.currentRoute.value.hash).toBe('#props');
  expect(toc.activeHash.value).toBe('#props');
  expect(scroller.scrollTo).not.toHaveBeenCalled();

  await toc.handleNavigate({ preventDefault () {} }, { link: '#usage' });
  await settle();
  expect(scroller.scrollTo).toHaveBeenCalled();
});

it('resets custom state when the docs host navigates to another component', async () => {
  await mountDocs();
  combinator.vm.onComponentEvent('update:fullName', 'Custom Name');
  await settle();
  await router.push({ path: '/components/button.html' });
  await wrapper.setProps({ componentName: 'DtButton' });
  await settle();
  expect(combinator.vm.selectedVariant).toBe('default');
  expect(combinator.props('component')).toBe(DtButton);
});

it('updates the URL on spec-sheet selection and returns to single view', async () => {
  await mountDocs();
  combinator.vm.toggleViewMode();
  combinator.vm.onSelectVariant('with presence, no icon');
  await settle();
  expect(router.currentRoute.value.query.preset).toBe('with-presence-no-icon');
  expect(combinator.vm.viewMode).toBe('single');
});

it('keeps a rapid edit when a preset replacement is still pending', async () => {
  await mountDocs({});
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let entered;
  const waiting = new Promise(resolve => { entered = resolve; });
  const stop = router.beforeEach(async to => {
    if (to.query.preset === 'image') { entered(); await held; }
  });
  combinator.vm.updateVariant('image');
  await waiting;
  await nextTick();
  combinator.vm.onComponentEvent('update:fullName', 'Rapid edit');
  release();
  await settle();
  stop();
  expect(router.currentRoute.value.query.preset).toBeUndefined();
  expect(combinator.vm.selectedVariant).toBe('');
  expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Rapid edit');
});

it.each(['updateVariant', 'resetOptions', 'onSelectVariant'])(
  '%s clears only the preset parameter when returning to default', async action => {
    await mountDocs({ preset: 'image', other: 'keep', filter: ['a', 'b'], flag: null });
    window.history.replaceState(null, '', '/components/avatar.html?preset=image&other=keep&filter=a&filter=b&flag#props');
    combinator.vm[action]('default');
    await settle();
    expect(router.currentRoute.value.query).toEqual({ other: 'keep', filter: ['a', 'b'], flag: null });
    expect(router.currentRoute.value.hash).toBe('#props');
    expect(combinator.vm.selectedVariant).toBe('default');
  },
);

it('leaves no query separator when default is selected without other query parameters', async () => {
  await mountDocs({ preset: 'image' });
  combinator.vm.updateVariant('default');
  await settle();
  expect(router.currentRoute.value.fullPath).toBe('/components/avatar.html#usage');
});

it('clears an explicit default query without removing other parameters', async () => {
  await mountDocs({ preset: 'default', other: 'keep' });
  combinator.vm.resetOptions();
  await settle();
  expect(router.currentRoute.value.query).toEqual({ other: 'keep' });
  expect(combinator.vm.selectedVariant).toBe('default');
});

it('accepts case-insensitive slugs and defaults unknown, reserved, and repeated queries', async () => {
  await mountDocs({ preset: 'With-Presence' });
  expect(combinator.vm.selectedVariant).toBe('with presence');
  for (const preset of ['unknown', 'defaults', 'exclusions', ['image', 'default']]) {
    await router.push({ query: { preset } });
    await settle();
    expect(combinator.vm.selectedVariant).toBe('default');
  }
});

it('requires clean unambiguous slugs in all shipped component preset banks', () => {
  for (const [component, bank] of Object.entries(variantBank())) {
    const slugs = Object.values(getCombinatorPresetSlugs(bank));
    expect(slugs.filter(slug => slug.includes('~')), component).toEqual([]);
  }
});
