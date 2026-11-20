import { flushPromises, mount, shallowMount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { DtAvatar, DtButton, DtFilterPill } from '@dialpad/dialtone-vue';
import { DtcCombinator } from '@dialpad/dialtone-combinator';
import allDocs from '@workspaceRoot/packages/dialtone-vue/dist/component-documentation.json';
import ComponentCombinator from './ComponentCombinator.vue';
import { usePageTocScrollSpy } from '../theme/composables/usePageTocScrollSpy.js';

export async function mountDocsCombinator (query = { preset: 'image', other: 'keep' }, options = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/components/:component.html', component: { render: () => null } }],
    ...options,
  });
  await router.push({ path: '/components/avatar.html', query, hash: '#usage' });
  await router.isReady();
  window.history.replaceState(null, '', router.currentRoute.value.fullPath);
  // Keep memory-router navigations and the live browser URL aligned, as web history does.
  router.afterEach((to, from, failure) => {
    if (!failure) window.history.replaceState(window.history.state, '', to.fullPath);
  });
  const wrapper = shallowMount(ComponentCombinator, {
    props: { componentName: 'DtAvatar' },
    global: {
      plugins: [router],
      components: { DtcCombinator },
      stubs: { DtcCombinator: false, teleport: false },
      directives: { 'dt-scrollbar': {}, 'dt-focustrap': {} },
      provide: {
        dialtoneComponents: { DtAvatar, DtButton, DtFilterPill },
        dialtoneComponentsDocumentation: allDocs,
        dialtoneIcons: {},
        dialtoneIllustrations: {},
      },
    },
  });
  await nextTick();
  return { router, wrapper, combinator: wrapper.findComponent(DtcCombinator) };
}

export async function settleCombinator () {
  await flushPromises();
  await nextTick();
}

export function mountDocsToc (router, options = {}) {
  return mount({
    setup () {
      return usePageTocScrollSpy(ref([]), { interceptAnchors: true, ...options });
    },
    render: () => null,
  }, { global: { plugins: [router] } });
}
