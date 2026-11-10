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
  active.value = false;
  await nextTick();
  for (const stops of subscriptions) {
    expect(stops).toHaveLength(1);
    expect(stops[0]).toHaveBeenCalledTimes(1);
  }
  await router.push('/components/avatar.html?preset=with-presence');
  expect(instances[0].preset.value).toBe('image');

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
  expect(instances[0].preset.value).toBe('image');
});
