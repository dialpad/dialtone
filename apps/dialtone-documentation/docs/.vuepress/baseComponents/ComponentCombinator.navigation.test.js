import { vi } from 'vitest';
import { createRouteHashScrollGuard, getPageScrollPosition, writeRouteHash } from '../theme/utils/pageToc.js';
import { mountDocsCombinator, settleCombinator as settle } from './combinatorTestUtils.js';

let wrapper;
let router;
let combinator;

afterEach(() => {
  wrapper?.unmount();
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
  vi.restoreAllMocks();
});

async function mountDocs (query, options) {
  ({ wrapper, router, combinator } = await mountDocsCombinator(query, options));
}

it('continues writing presets after an external navigation throws', async () => {
  await mountDocs({});
  const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
  const error = new Error('Failed to load a page chunk');
  const stopError = router.onError(() => {});
  const stopGuard = router.beforeEach(to => {
    if (to.path === '/components/button.html') throw error;
  });
  await expect(router.push('/components/button.html')).rejects.toBe(error);
  combinator.vm.updateVariant('with presence');
  await settle();
  stopGuard();
  stopError();
  expect(router.currentRoute.value.query.preset).toBe('with-presence');
  expect(combinator.vm.selectedVariant).toBe('with presence');
  expect(logged).toHaveBeenCalledWith(error);
});

it('flushes a deferred preset after an in-flight page navigation throws', async () => {
  await mountDocs({});
  const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let entered;
  const waiting = new Promise(resolve => { entered = resolve; });
  const error = new Error('Failed to load a page chunk');
  const stopError = router.onError(() => {});
  const stopGuard = router.beforeEach(async to => {
    if (to.path === '/components/button.html') { entered(); await held; throw error; }
  });
  const navigating = router.push('/components/button.html');
  const failure = expect(navigating).rejects.toBe(error);
  await waiting;
  combinator.vm.updateVariant('image');
  release();
  await failure;
  await settle();
  stopGuard();
  stopError();
  expect(router.currentRoute.value.query.preset).toBe('image');
  expect(combinator.vm.selectedVariant).toBe('image');
  expect(logged).toHaveBeenCalledWith(error);
});

it('recovers from a thrown preset write without leaving an unhandled rejection', async () => {
  await mountDocs({});
  const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
  const error = new Error('Preset navigation failed');
  const stopError = router.onError(() => {});
  const stopGuard = router.beforeEach(to => {
    if (to.query.preset === 'image') throw error;
  });
  combinator.vm.updateVariant('image');
  await settle();
  expect(combinator.vm.selectedVariant).toBe('default');
  expect(logged).toHaveBeenCalledWith(error);
  stopGuard();
  stopError();
  combinator.vm.updateVariant('with presence');
  await settle();
  expect(router.currentRoute.value.query.preset).toBe('with-presence');
});

it('preserves typed edits when removing the preset from the URL throws', async () => {
  await mountDocs({ preset: 'image', other: 'keep' });
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const stop = router.beforeEach(to => {
    if (!to.query.preset) throw new Error('Custom URL write failed');
  });
  combinator.vm.onComponentEvent('update:fullName', 'Keep this edit');
  await settle();
  stop();
  expect(combinator.vm.selectedVariant).toBe('');
  const options = combinator.findComponent({ name: 'DtcRenderer' }).props('options');
  expect(options.props.fullName).toBe('Keep this edit');
  expect(options.props.imageSrc).toBe('/assets/images/person.png');
  combinator.vm.onComponentEvent('update:fullName', 'Keep the next edit too');
  await settle();
  expect(options.props.fullName).toBe('Keep the next edit too');
});

it.each([false, true])('recovers from a redirect to the current URL (deferred selection: %s)', async deferred => {
  await mountDocs({});
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let entered;
  const waiting = new Promise(resolve => { entered = resolve; });
  const stop = router.beforeEach(async to => {
    if (to.path === '/components/button.html') {
      entered();
      if (deferred) await held;
      return router.currentRoute.value.fullPath;
    }
  });
  const navigating = router.push('/components/button.html');
  await waiting;
  if (deferred) combinator.vm.updateVariant('image');
  release();
  await navigating;
  await settle();
  if (!deferred) combinator.vm.updateVariant('image');
  await settle();
  stop();
  expect(router.currentRoute.value.query.preset).toBe('image');
  expect(combinator.vm.selectedVariant).toBe('image');
  expect(wrapper.vm.externalNavigation).toBeNull();
});

it('keeps a pending preset when a TOC push uses the previously committed query', async () => {
  await mountDocs({ other: 'keep' });
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let entered;
  const waiting = new Promise(resolve => { entered = resolve; });
  let heldOnce = false;
  const stop = router.beforeEach(async to => {
    if (to.query.preset === 'image' && !heldOnce) {
      heldOnce = true;
      entered();
      await held;
    }
  });
  combinator.vm.updateVariant('image');
  await waiting;
  await writeRouteHash(router, router.currentRoute.value, '#props', createRouteHashScrollGuard());
  release();
  await settle();
  stop();
  expect(router.currentRoute.value.query).toEqual({ other: 'keep', preset: 'image' });
  expect(router.currentRoute.value.hash).toBe('#props');
  expect(combinator.vm.selectedVariant).toBe('image');
});

it('restores a preset on a legacy native-anchor pop with an empty direction', async () => {
  await mountDocs({});
  combinator.vm.onComponentEvent('update:fullName', 'Edited Name');
  await settle();
  wrapper.vm.onHistoryNavigation('/components/avatar.html#props', '', { type: 'pop', direction: '' });
  await router.push('/components/avatar.html#props');
  await settle();
  expect(combinator.vm.selectedVariant).toBe('default');
});

it('does not invoke document scrolling for a hash-less preset write', async () => {
  const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  await mountDocs({}, { scrollBehavior: getPageScrollPosition });
  await settle();
  window.history.replaceState(null, '', '/components/avatar.html');
  scroll.mockClear();
  combinator.vm.updateVariant('image');
  await settle();
  expect(router.currentRoute.value.hash).toBe('');
  expect(scroll).not.toHaveBeenCalled();
  await router.push('/components/button.html');
  await settle();
  expect(scroll).toHaveBeenCalledWith({ top: 0 });
  scroll.mockRestore();
});
