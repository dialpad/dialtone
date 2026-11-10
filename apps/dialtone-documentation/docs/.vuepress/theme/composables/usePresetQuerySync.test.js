import { mount, flushPromises } from '@vue/test-utils';
import { computed, h, nextTick, ref } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { vi } from 'vitest';
import { variantBank } from '@dialpad/dialtone-combinator';
import { usePresetQuerySync } from './usePresetQuerySync.js';

let wrapper;

afterEach(() => {
  wrapper?.unmount();
  window.history.replaceState(null, '', '/');
  vi.restoreAllMocks();
});

function trackStops (target, name) {
  const register = target[name].bind(target);
  const stops = [];
  vi.spyOn(target, name).mockImplementation((...args) => {
    const stop = vi.fn(register(...args));
    stops.push(stop);
    return stop;
  });
  return stops;
}

async function mountPresetSync (variants = ref({ default: {}, image: {} })) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/components/:component.html', component: { render: () => null } }],
  });
  await router.push('/components/avatar.html?other=keep');
  await router.isReady();
  window.history.replaceState(null, '', router.currentRoute.value.fullPath);
  // Memory history needs an explicit live URL for the same hash capture used in the browser.
  router.afterEach((to, from, failure) => {
    if (!failure) window.history.replaceState(window.history.state, '', to.fullPath);
  });
  let sync;
  wrapper = mount({
    setup () {
      sync = usePresetQuerySync(() => 'DtAvatar', variants);
      return () => null;
    },
  }, { global: { plugins: [router] } });
  return { router, sync };
}

function createNavigationGate () {
  let enter;
  let release;
  const entered = new Promise(resolve => { enter = resolve; });
  const held = new Promise(resolve => { release = resolve; });
  return { entered, release, hold: async () => { enter(); await held; } };
}

it('derives a settled named selection from the URL and current bank', async () => {
  const variants = ref({ default: {}, image: {} });
  const { router, sync } = await mountPresetSync(variants);
  await sync.updatePreset('image');
  expect(sync.preset.value).toBe('image');
  variants.value = { default: {} };
  await nextTick();
  expect(sync.preset.value).toBe('default');
  expect(router.currentRoute.value.query).toEqual({ other: 'keep', preset: 'image' });
  variants.value = { default: {}, image: {} };
  await nextTick();
  expect(sync.preset.value).toBe('image');
});

it('returns a cancelled named selection to the committed URL', async () => {
  const { router, sync } = await mountPresetSync();
  const stop = router.beforeEach(to => to.query.preset === 'image' ? false : undefined);
  try {
    await sync.updatePreset('image');
    expect(router.currentRoute.value.query).toEqual({ other: 'keep' });
    expect(sync.preset.value).toBe('default');
  } finally {
    stop();
  }
});

it('keeps a queued selection when its cancelled older write settles', async () => {
  const { router, sync } = await mountPresetSync();
  const write = createNavigationGate();
  const push = createNavigationGate();
  let heldWrite = false;
  const stop = router.beforeEach(async to => {
    if (to.query.preset === 'image' && !heldWrite) {
      heldWrite = true;
      await write.hold();
    }
    if (to.query.extra === 'held') await push.hold();
  });
  let writing;
  let navigating;
  try {
    writing = sync.updatePreset('image');
    await write.entered;
    navigating = router.push({ query: { other: 'keep', extra: 'held' }, hash: '#props' });
    await push.entered;
    write.release();
    await writing;
    expect(sync.preset.value).toBe('image');
    push.release();
    await navigating;
    await flushPromises();
    expect(router.currentRoute.value.query).toEqual({ other: 'keep', extra: 'held', preset: 'image' });
    expect(router.currentRoute.value.hash).toBe('#props');
    expect(sync.preset.value).toBe('image');
  } finally {
    write.release();
    push.release();
    await writing;
    await navigating;
    stop();
  }
});

it('owns and releases its router hooks and watcher across mount cycles', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/components/:component.html', component: { render: () => null } }],
  });
  await router.push('/components/avatar.html?preset=image');
  await router.isReady();
  const active = ref(false);
  const componentName = ref('DtAvatar');
  const variants = computed(() => variantBank()[componentName.value] ?? {});
  const instances = [];
  const child = {
    setup () {
      instances.push(usePresetQuerySync(() => componentName.value, variants));
      return () => null;
    },
  };
  // Keep the router app installed while the composable's owner mounts and unmounts.
  wrapper = mount({ render: () => active.value ? h(child) : null }, { global: { plugins: [router] } });
  await flushPromises();
  const subscriptions = [
    trackStops(router, 'beforeEach'),
    trackStops(router, 'afterEach'),
    trackStops(router, 'onError'),
    trackStops(router.options.history, 'listen'),
  ];

  active.value = true;
  await nextTick();
  expect(instances[0].preset.value).toBe('image');
  await router.push('/components/avatar.html?preset=with-presence');
  expect(instances[0].preset.value).toBe('with presence');
  await instances[0].updatePreset('image');
  expect(router.currentRoute.value.query.preset).toBe('image');
  // A retained local draft lets us detect leaked handlers/watchers without freezing a computed URL value.
  await instances[0].updatePreset('');
  expect(instances[0].preset.value).toBe('');
  active.value = false;
  await nextTick();
  for (const stops of subscriptions) {
    expect(stops).toHaveLength(1);
    expect(stops[0]).toHaveBeenCalledTimes(1);
  }
  await router.push('/components/avatar.html?preset=with-presence');
  expect(instances[0].preset.value).toBe('');

  active.value = true;
  await nextTick();
  expect(instances[1].preset.value).toBe('with presence');
  await instances[1].updatePreset('default');
  expect(router.currentRoute.value.query.preset).toBeUndefined();
  active.value = false;
  await nextTick();
  for (const stops of subscriptions) {
    expect(stops).toHaveLength(2);
    expect(stops[1]).toHaveBeenCalledTimes(1);
  }
  componentName.value = 'DtButton';
  await nextTick();
  expect(instances[0].preset.value).toBe('');
});
