import { vi } from 'vitest';
import { ref } from 'vue';
import { createWebHistory } from 'vue-router';
import { mountDocsCombinator, mountDocsToc, settleCombinator as settle } from './combinatorTestUtils.js';

let wrapper;
let router;
let combinator;
let toc;
let scroller;

afterEach(() => {
  toc?.unmount();
  wrapper?.unmount();
  router?.options.history.destroy();
  scroller?.remove();
  window.history.replaceState(null, '', '/');
  window.localStorage.clear();
  vi.restoreAllMocks();
});

async function mountAnchors (query = { other: 'keep' }, options = {}) {
  ({ wrapper, router, combinator } = await mountDocsCombinator(query, options));
  scroller = document.createElement('div');
  scroller.className = 'dialtone-doc-page-scroll-container';
  scroller.innerHTML = '<h2 id="usage" tabindex="-1">Usage</h2><a href="#image">Image</a><h3 id="image">Image</h3>';
  scroller.scrollTo = vi.fn();
  document.body.append(scroller);
  toc = mountDocsToc(router);
  await settle();
  scroller.scrollTo.mockClear();
}

it('scrolls again and updates the live URL when a repeated anchor matches the stale route hash', async () => {
  await mountAnchors();
  const anchor = scroller.querySelector('a');
  anchor.click();
  await settle();
  expect(router.currentRoute.value.hash).toBe('#image');
  window.history.replaceState(window.history.state, '', '/components/avatar.html?other=keep#usage');
  scroller.scrollTo.mockClear();
  anchor.click();
  await settle();
  expect(scroller.scrollTo).toHaveBeenCalled();
  expect(window.location.hash).toBe('#image');
  expect(router.currentRoute.value.query).toEqual({ other: 'keep' });
});

it('moves focus to the anchor target without asking focus to scroll the document', async () => {
  await mountAnchors();
  const anchor = scroller.querySelector('a');
  const target = scroller.querySelector('#image');
  const focus = vi.spyOn(target, 'focus');
  anchor.focus();
  anchor.click();
  await settle();
  expect(document.activeElement).toBe(target);
  expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  expect(target.tabIndex).toBe(-1);
});

it.each(['playground', 'content demo'])(
  'keeps %s placeholders inert without creating a pop or resetting edits', async placement => {
    await mountAnchors({ preset: 'image', other: 'keep' }, { history: createWebHistory() });
    combinator.vm.onComponentEvent('update:fullName', 'EDITED');
    await settle();
    const container = placement === 'playground' ? combinator.find('div').element : document.createElement('section');
    const anchor = document.createElement('a');
    anchor.href = '#';
    anchor.textContent = 'Demo link';
    container.append(anchor);
    scroller.append(container);
    const before = window.location.href;
    const pop = vi.fn();
    window.addEventListener('popstate', pop);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    anchor.dispatchEvent(event);
    await settle();
    await new Promise(resolve => window.setTimeout(resolve, 0));
    window.removeEventListener('popstate', pop);
    expect(event.defaultPrevented).toBe(true);
    expect(pop).not.toHaveBeenCalled();
    expect(window.location.href).toBe(before);
    expect(combinator.vm.selectedVariant).toBe('');
    expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('EDITED');
  },
);

it('keeps the pre-existing TOC focus behavior when the page has no playground', async () => {
  await mountAnchors();
  toc.unmount();
  toc = mountDocsToc(router, { interceptAnchors: false });
  await settle();
  const anchor = scroller.querySelector('a');
  const target = scroller.querySelector('#image');
  anchor.focus();
  await toc.vm.handleNavigate({ preventDefault () {} }, { link: '#image' });
  await settle();
  expect(scroller.scrollTo).toHaveBeenCalled();
  expect(document.activeElement).toBe(anchor);
  expect(target.hasAttribute('tabindex')).toBe(false);
});

it('preserves custom edits on an anchor click, Back and Forward', async () => {
  await mountAnchors({});
  combinator.vm.onComponentEvent('update:fullName', 'Edited Name');
  await settle();
  scroller.querySelector('a').click();
  await settle();
  expect(combinator.vm.selectedVariant).toBe('');
  const finished = new Promise(resolve => {
    const stop = router.afterEach(() => { stop(); resolve(); });
  });
  router.back();
  await finished;
  await settle();
  expect(combinator.vm.selectedVariant).toBe('');
  expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Edited Name');
  const forwardFinished = new Promise(resolve => {
    const stop = router.afterEach(() => { stop(); resolve(); });
  });
  router.forward();
  await forwardFinished;
  await settle();
  expect(combinator.vm.selectedVariant).toBe('');
  expect(combinator.findComponent({ name: 'DtcRenderer' }).props('options').props.fullName).toBe('Edited Name');
});

it('keeps an in-flight preset when a repeated stale anchor synchronizes and pushes its hash', async () => {
  await mountAnchors();
  const anchor = scroller.querySelector('a');
  anchor.click();
  await settle();
  window.history.replaceState(window.history.state, '', '/components/avatar.html?other=keep#usage');
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let entered;
  const waiting = new Promise(resolve => { entered = resolve; });
  let heldOnce = false;
  const stop = router.beforeEach(async to => {
    if (to.query.preset === 'image' && !heldOnce) { heldOnce = true; entered(); await held; }
  });
  combinator.vm.updateVariant('image');
  await waiting;
  anchor.click();
  await settle();
  release();
  await settle();
  stop();
  expect(router.currentRoute.value.query).toEqual({ other: 'keep', preset: 'image' });
  expect(router.currentRoute.value.hash).toBe('#image');
  expect(combinator.vm.selectedVariant).toBe('image');
});

it('removes the interceptor when the page stops having a playground or unmounts', async () => {
  await mountAnchors();
  toc.unmount();
  const enabled = ref(false);
  const add = vi.spyOn(document, 'addEventListener');
  const remove = vi.spyOn(document, 'removeEventListener');
  toc = mountDocsToc(router, { interceptAnchors: enabled });
  await settle();
  const clickCalls = mock => mock.mock.calls.filter(([name]) => name === 'click');
  expect(clickCalls(add)).toHaveLength(0);
  enabled.value = true;
  await settle();
  expect(clickCalls(add)).toHaveLength(1);
  enabled.value = false;
  await settle();
  expect(clickCalls(remove)).toHaveLength(1);
  enabled.value = true;
  await settle();
  toc.unmount();
  toc = null;
  expect(clickCalls(remove)).toHaveLength(2);
  enabled.value = false;
  await settle();
  expect(clickCalls(add)).toHaveLength(2);
});
