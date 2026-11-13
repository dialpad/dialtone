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

it.each([false, true])('focuses the TOC target regardless of playground interception (%s)', async interceptAnchors => {
  await mountAnchors();
  toc.unmount();
  toc = mountDocsToc(router, { interceptAnchors });
  await settle();
  const anchor = scroller.querySelector('a');
  const target = scroller.querySelector('#image');
  const focus = vi.spyOn(target, 'focus');
  anchor.focus();
  await toc.vm.handleNavigate({ preventDefault () {} }, { link: '#image' });
  await settle();
  expect(scroller.scrollTo).toHaveBeenCalled();
  expect(toc.vm.activeHash).toBe('#image');
  expect(document.activeElement).toBe(target);
  expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  expect(target.getAttribute('tabindex')).toBe('-1');
  expect(router.currentRoute.value.query).toEqual({ other: 'keep' });
});

it.each(['-1', '0', '2'])('preserves an existing TOC target tabindex of %s when moving focus', async tabindex => {
  await mountAnchors();
  const target = scroller.querySelector('#image');
  target.setAttribute('tabindex', tabindex);
  await toc.vm.handleNavigate({ preventDefault () {} }, { link: '#image' });
  await settle();
  expect(document.activeElement).toBe(target);
  expect(target.getAttribute('tabindex')).toBe(tabindex);
});

it.each([
  ['button', '<button>Action</button>'],
  ['link', '<a href="#usage">Target</a>'],
  ['input', '<input aria-label="Target">'],
  ['textarea', '<textarea aria-label="Target"></textarea>'],
  ['select', '<select aria-label="Target"><option>Option</option></select>'],
  ['editable content', '<div contenteditable="true">Edit</div>'],
  ['implicitly editable content', '<div contenteditable>Edit</div>'],
  ['uppercase editable content', '<div contenteditable="TRUE">Edit</div>'],
  ['plaintext editable content', '<div contenteditable="plaintext-only">Edit</div>'],
  ['noneditable content', '<div contenteditable="false">Read</div>', '-1'],
])('focuses a fragment target without changing its Tab stops (%s)', async (name, markup, tabindex = null) => {
  await mountAnchors();
  const fixture = document.createElement('div');
  fixture.innerHTML = markup;
  const target = fixture.firstElementChild;
  target.id = 'image';
  scroller.querySelector('#image').replaceWith(target);
  const originalTabIndex = target.tabIndex;
  const focus = vi.spyOn(target, 'focus');
  scroller.querySelector('a').click();
  await settle();
  expect(document.activeElement).toBe(target);
  expect(target.getAttribute('tabindex')).toBe(tabindex);
  expect(target.tabIndex).toBe(originalTabIndex);
  expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  expect(router.currentRoute.value.query).toEqual({ other: 'keep' });
});

it.each(['missing target', 'cancelled navigation'])('keeps focus on the TOC link after a %s', async outcome => {
  await mountAnchors();
  const anchor = scroller.querySelector('a');
  const target = scroller.querySelector('#image');
  if (outcome === 'missing target') target.remove();
  const stop = router.beforeEach(() => outcome !== 'cancelled navigation');
  anchor.focus();
  try {
    await toc.vm.handleNavigate({ preventDefault () {} }, { link: '#image' });
    await settle();
  } finally {
    stop();
  }
  expect(document.activeElement).toBe(anchor);
});

it.each(['aborted', 'thrown'])('preserves the TOC heading when navigation fails (%s)', async outcome => {
  await mountAnchors();
  const anchor = scroller.querySelector('a');
  const previousHash = toc.vm.activeHash;
  const previousUrl = window.location.href;
  const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
  const error = new Error('TOC navigation failed');
  const stop = router.beforeEach(() => {
    if (outcome === 'thrown') throw error;
    return false;
  });
  anchor.focus();
  let failure;
  try {
    failure = await toc.vm.handleNavigate({ preventDefault () {} }, { link: '#image' }).catch(caught => caught);
    await settle();
  } finally {
    stop();
  }
  expect(failure).toBe(outcome === 'thrown' ? error : undefined);
  expect(toc.vm.activeHash).toBe(previousHash);
  expect(window.location.href).toBe(previousUrl);
  expect(scroller.scrollTo).not.toHaveBeenCalled();
  expect(document.activeElement).toBe(anchor);
  expect(logged).toHaveBeenCalledTimes(outcome === 'thrown' ? 1 : 0);
  if (outcome === 'thrown') expect(logged).toHaveBeenCalledWith(error);
});

it.each(['aborted', 'thrown'])(
  'preserves a newer TOC heading when an older navigation fails (%s)',
  async outcome => {
    await mountAnchors();
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Older TOC navigation failed');
    let release;
    const held = new Promise(resolve => { release = resolve; });
    let entered;
    const waiting = new Promise(resolve => { entered = resolve; });
    let heldOnce = false;
    const stop = router.beforeEach(async () => {
      if (heldOnce) return;
      heldOnce = true;
      entered();
      await held;
      if (outcome === 'thrown') throw error;
      return false;
    });
    const olderNavigation = toc.vm.handleNavigate({ preventDefault () {} }, { link: '#image' }).catch(caught => caught);
    let failure;
    try {
      await waiting;
      // The same destination distinguishes a newer success from the older request's optimistic highlight.
      await toc.vm.handleNavigate({ preventDefault () {} }, { link: '#image' });
      await settle();
      expect(toc.vm.activeHash).toBe('#image');
      expect(window.location.hash).toBe('#image');
      scroller.scrollTo.mockClear();
    } finally {
      release();
      failure = await olderNavigation;
      stop();
    }
    await settle();
    expect(failure).toBe(outcome === 'thrown' ? error : undefined);
    expect(toc.vm.activeHash).toBe('#image');
    expect(window.location.hash).toBe('#image');
    expect(scroller.scrollTo).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(scroller.querySelector('#image'));
    expect(logged).toHaveBeenCalledTimes(outcome === 'thrown' ? 1 : 0);
    if (outcome === 'thrown') expect(logged).toHaveBeenCalledWith(error);
  },
);

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
