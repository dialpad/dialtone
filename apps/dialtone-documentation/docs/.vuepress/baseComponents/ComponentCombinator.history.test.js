import { vi } from 'vitest';
import { getPageScrollPosition } from '../theme/utils/pageToc.js';
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

// A canceled write never updated its entry's stored URL, which determines the Forward expectations.
it.each([
  ['custom edit', false, '', 'Keep this edit'],
  ['custom edit', true, 'image', 'Daniel Parker'],
  ['preset selection', false, 'image', 'Daniel Parker'],
  ['preset selection', true, 'default', 'Daniel Parker'],
])('keeps Back outcomes consistent for a %s (write pending: %s)', async (
  action, pending, forwardPreset, forwardName,
) => {
  const query = { other: 'keep', filter: ['a', 'b'], flag: null };
  await mountDocs(query);
  await router.push({ query: { ...query, preset: 'image' }, hash: '#usage' });
  await settle();
  const isEdit = action === 'custom edit';
  if (!isEdit) {
    combinator.vm.updateVariant('default');
    await settle();
  }
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let entered;
  const waiting = new Promise(resolve => { entered = resolve; });
  let heldOnce = false;
  const stop = router.beforeEach(async to => {
    const matchesWrite = isEdit ? !to.query.preset : to.query.preset === 'image';
    if (pending && matchesWrite && !heldOnce) { heldOnce = true; entered(); await held; }
  });
  try {
    if (isEdit) combinator.vm.onComponentEvent('update:fullName', 'Keep this edit');
    else combinator.vm.updateVariant('image');
    if (pending) await waiting;
    else await settle();
    const finished = new Promise(resolve => {
      const stopAfter = router.afterEach((to, from, failure) => {
        if (!failure && !to.query.preset) { stopAfter(); resolve(); }
      });
    });
    router.back();
    await finished;
    release();
    await settle();
    expect(router.currentRoute.value.query).toEqual(query);
    expect(combinator.vm.selectedVariant).toBe(isEdit ? '' : 'default');
    const options = combinator.findComponent({ name: 'DtcRenderer' }).props('options');
    expect(options.props.fullName).toBe(isEdit ? 'Keep this edit' : 'Daniel Parker');
    if (isEdit) expect(options.props.imageSrc).toBe('/assets/images/person.png');
    const forwardFinished = new Promise(resolve => {
      const stopAfter = router.afterEach((to, from, failure) => {
        if (!failure) { stopAfter(); resolve(); }
      });
    });
    router.forward();
    await forwardFinished;
    await settle();
    const forwardQuery = { ...query };
    if (forwardPreset === 'image') forwardQuery.preset = 'image';
    expect(router.currentRoute.value.query).toEqual(forwardQuery);
    expect(combinator.vm.selectedVariant).toBe(forwardPreset);
    const forwardOptions = combinator.findComponent({ name: 'DtcRenderer' }).props('options');
    expect(forwardOptions.props.fullName).toBe(forwardName);
  } finally {
    release();
    stop();
  }
});

it('keeps a deferred preset when a hash push supersedes a held page navigation', async () => {
  const query = { other: 'keep', filter: ['a', 'b'], flag: null };
  await mountDocs(query);
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let entered;
  const waiting = new Promise(resolve => { entered = resolve; });
  const stop = router.beforeEach(async to => {
    if (to.path === '/components/button.html') { entered(); await held; }
  });
  const navigating = router.push('/components/button.html');
  try {
    await waiting;
    combinator.vm.updateVariant('image');
    await router.push({ query, hash: '#props' });
    await settle();
    expect(router.currentRoute.value.query).toEqual({ ...query, preset: 'image' });
    expect(router.currentRoute.value.hash).toBe('#props');
    expect(combinator.vm.selectedVariant).toBe('image');
    expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.imageSrc)
      .toBe('/assets/images/person.png');
    release();
    await navigating;
    await settle();
    expect(router.currentRoute.value.path).toBe('/components/avatar.html');
    expect(router.currentRoute.value.query).toEqual({ ...query, preset: 'image' });
    expect(combinator.vm.selectedVariant).toBe('image');
  } finally {
    release();
    await navigating;
    stop();
  }
});

it('discards a deferred selection when Back supersedes the navigation that deferred it', async () => {
  await mountDocs({ preset: 'image', other: 'keep' });
  await router.push({ query: { preset: 'with-presence', other: 'keep' }, hash: '#props' });
  await settle();
  let releaseWrite;
  const heldWrite = new Promise(resolve => { releaseWrite = resolve; });
  let writeEntered;
  const writeWaiting = new Promise(resolve => { writeEntered = resolve; });
  let releasePush;
  const heldPush = new Promise(resolve => { releasePush = resolve; });
  let pushEntered;
  const pushWaiting = new Promise(resolve => { pushEntered = resolve; });
  const stop = router.beforeEach(async to => {
    if (to.query.preset === 'icon-avatar') { writeEntered(); await heldWrite; }
    if (to.query.extra === 'held') { pushEntered(); await heldPush; }
  });
  let pushing;
  try {
    combinator.vm.updateVariant('icon avatar');
    await writeWaiting;
    pushing = router.push({ query: { ...router.currentRoute.value.query, extra: 'held' }, hash: '#props' });
    await pushWaiting;
    const finished = new Promise(resolve => {
      const stopAfter = router.afterEach((to, from, failure) => {
        if (!failure && to.query.preset === 'image') { stopAfter(); resolve(); }
      });
    });
    router.back();
    await finished;
    releaseWrite();
    releasePush();
    await pushing;
    await settle();
    expect(router.currentRoute.value.query).toEqual({ preset: 'image', other: 'keep' });
    expect(combinator.vm.selectedVariant).toBe('image');
  } finally {
    releaseWrite();
    releasePush();
    await pushing;
    stop();
  }
});

it('keeps edits when a repeated-preset query push supersedes the pending removal', async () => {
  const query = { preset: ['image', 'default'], filter: ['a', 'b'], flag: null };
  await mountDocs(query);
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let entered;
  const waiting = new Promise(resolve => { entered = resolve; });
  let heldOnce = false;
  const stop = router.beforeEach(async to => {
    if (!to.query.preset && !heldOnce) { heldOnce = true; entered(); await held; }
  });
  try {
    combinator.vm.onComponentEvent('update:fullName', 'Keep this edit');
    await waiting;
    await router.push({ query: { ...query, other: 'changed' }, hash: '#props' });
    release();
    await settle();
    expect(router.currentRoute.value.query).toEqual({ filter: ['a', 'b'], flag: null, other: 'changed' });
    expect(router.currentRoute.value.hash).toBe('#props');
    expect(combinator.vm.selectedVariant).toBe('');
    expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Keep this edit');
  } finally {
    release();
    stop();
  }
});

it('retires a canceled edit write before its held guard returns', async () => {
  const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  await mountDocs({ other: 'keep' }, { scrollBehavior: getPageScrollPosition });
  await router.replace({ query: { other: 'keep' }, hash: '' });
  await router.push({ query: { other: 'keep', preset: 'image' }, hash: '#props' });
  await settle();
  scroll.mockClear();
  const replace = vi.spyOn(router, 'replace');
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let entered;
  const waiting = new Promise(resolve => { entered = resolve; });
  let heldOnce = false;
  const stop = router.beforeEach(async to => {
    if (!to.query.preset && !heldOnce) { heldOnce = true; entered(); await held; }
  });
  try {
    combinator.vm.onComponentEvent('update:fullName', 'Keep this edit');
    await waiting;
    const finished = new Promise(resolve => {
      const stopAfter = router.afterEach((to, from, failure) => {
        if (!failure && !to.query.preset) { stopAfter(); resolve(); }
      });
    });
    router.back();
    await finished;
    await settle();
    expect(router.currentRoute.value.query).toEqual({ other: 'keep' });
    expect(router.currentRoute.value.hash).toBe('');
    expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Keep this edit');
    expect(combinator.vm.selectedVariant).toBe('');
    // Back itself keeps normal scrolling; it must not trigger a redundant preset replacement.
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(scroll).toHaveBeenCalledWith({ top: 0 });
    expect(replace).toHaveBeenCalledTimes(1);
    // Reset while the canceled guard is still held: the URL already represents default.
    combinator.vm.updateVariant('default');
    await settle();
    expect(combinator.vm.selectedVariant).toBe('default');
    expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Daniel Parker');
    expect(replace).toHaveBeenCalledTimes(1);
    expect(scroll).toHaveBeenCalledTimes(1);
    release();
    await settle();
    expect(replace).toHaveBeenCalledTimes(1);
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(router.currentRoute.value.query).toEqual({ other: 'keep' });
    expect(combinator.vm.selectedVariant).toBe('default');
  } finally {
    release();
    stop();
  }
});

it('preserves the pending edit comparison when Back redirects to another hash', async () => {
  await mountDocs({ other: 'keep' });
  await router.push({ query: { other: 'keep', preset: 'image' }, hash: '#props' });
  await settle();
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let entered;
  const waiting = new Promise(resolve => { entered = resolve; });
  let heldOnce = false;
  const stop = router.beforeEach(async to => {
    if (!to.query.preset && to.hash === '#props' && !heldOnce) {
      heldOnce = true; entered(); await held;
    }
    if (!to.query.preset && to.hash === '#usage') return { ...to, hash: '#redirected' };
  });
  try {
    combinator.vm.onComponentEvent('update:fullName', 'Keep this edit');
    await waiting;
    const finished = new Promise(resolve => {
      const stopAfter = router.afterEach((to, from, failure) => {
        if (!failure && to.hash === '#redirected') { stopAfter(); resolve(); }
      });
    });
    router.back();
    await finished;
    release();
    await settle();
    expect(router.currentRoute.value.query).toEqual({ other: 'keep' });
    expect(router.currentRoute.value.hash).toBe('#redirected');
    expect(combinator.vm.selectedVariant).toBe('');
    expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Keep this edit');
  } finally {
    release();
    stop();
  }
});
