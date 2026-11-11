// Transition scenarios run against Vue's <Transition> (parity/vue/transition-traces.test.js records them in
// transition-traces.json) and against DtTransition (common/transition/DtTransition.test.tsx compares). A trace is
// the element's classes and display after each step, and every hook call with the element's state at that moment.
// Steps: show, hide, f (one 16ms frame), t<ms> (advance the clock), end / aend (transitionend / animationend).
// jsdom's getComputedStyle ignores transitions, so both sides read them from the inline style the scenario sets.
/* global document, window */
const FRAME = 16;

/**
 * @typedef {object} Scenario
 * @property {Record<string, unknown>} props the transition's props (hooks are added by run)
 * @property {string} style the element's inline style
 * @property {string[]} steps
 * @property {boolean} [initial] mount shown
 * @property {boolean} [vif] v-if rather than v-show
 * @property {boolean} [explicitDone] onEnter and onLeave take `done` and call it 100ms later
 */

/** @type {Record<string, Scenario>} */
export const SCENARIOS = {
  'v-show, transition 1s': { props: { name: 'fade' }, style: 'transition-property: opacity; transition-duration: 1s', steps: ['show', 'f', 'f', 'end', 'hide', 'f', 'f', 'end'] },
  'v-show, no duration': { props: { name: 'fade' }, style: '', steps: ['show', 'f', 'f', 'hide', 'f', 'f'] },
  'v-show, timeout fallback': { props: { name: 'fade' }, style: 'transition-property: opacity; transition-duration: 0.2s; transition-delay: 0.1s', steps: ['show', 'f', 'f', 't300', 't1', 'hide', 'f', 'f', 't301'] },
  'appear': { props: { name: 'pop', appear: true }, initial: true, style: 'animation-name: pop; animation-duration: 0.5s', steps: ['f', 'f', 'aend', 'hide', 'f', 'f', 'aend'] },
  'appear without appear prop': { props: { name: 'pop' }, initial: true, style: 'transition-property: opacity; transition-duration: 1s', steps: ['f', 'f', 'hide', 'f', 'f', 'end'] },
  'css false': { props: { name: 'fade', css: false }, style: 'transition-property: opacity; transition-duration: 1s', steps: ['show', 'f', 'f', 'hide', 'f', 'f'] },
  'explicit duration': { props: { name: 'fade', duration: { enter: 300, leave: 500 } }, style: 'transition-property: opacity; transition-duration: 1s', steps: ['show', 'f', 'f', 't299', 't1', 'hide', 'f', 'f', 't500'] },
  'cancel enter': { props: { name: 'fade' }, style: 'transition-property: opacity; transition-duration: 1s', steps: ['show', 'f', 'hide', 'f', 'f', 'end'] },
  'cancel leave': { props: { name: 'fade' }, style: 'transition-property: opacity; transition-duration: 1s', initial: true, steps: ['hide', 'f', 'f', 'show', 'f', 'f', 'end'] },
  'v-if': { props: { name: 'fade' }, vif: true, style: 'transition-property: opacity; transition-duration: 1s', steps: ['show', 'f', 'f', 'end', 'hide', 'f', 'f', 'end'] },
  'custom classes': { props: { enterActiveClass: 'd-collapsible__enter-active', leaveActiveClass: 'd-collapsible__leave-active' }, style: 'transition-property: height; transition-duration: 1s', steps: ['show', 'f', 'f', 'end', 'hide', 'f', 'f', 'end'] },
  'explicit done': { props: { name: 'fade' }, explicitDone: true, style: 'transition-property: opacity; transition-duration: 1s', steps: ['show', 'f', 'f', 'end', 't100', 'hide', 'f', 'f', 't100'] },
  'type transition with animation': { props: { name: 'fade', type: 'transition' }, style: 'transition-property: opacity; transition-duration: 0.3s; animation-name: pop; animation-duration: 1s', steps: ['show', 'f', 'f', 'aend', 'end'] },
  'v-if cancel leave': { props: { name: 'fade' }, vif: true, initial: true, style: 'transition-property: opacity; transition-duration: 1s', steps: ['hide', 'f', 'f', 'show', 'f', 'f', 'end'] },
  'cancel leave before frame': { props: { name: 'fade' }, initial: true, style: 'transition-property: opacity; transition-duration: 1s', steps: ['hide', 'show', 'f', 'f', 'end'] },
  'two properties': { props: { name: 'fade' }, style: 'transition-property: opacity, transform; transition-duration: 1s, 1s', steps: ['show', 'f', 'f', 'end', 'end'] },
};

// jsdom's getComputedStyle ignores transitions, so read them from the inline style, which both sides set.
function stubComputedStyle () {
  const original = window.getComputedStyle;
  window.getComputedStyle = (el) => {
    const s = el.style;
    return {
      transitionDelay: s.transitionDelay,
      transitionDuration: s.transitionDuration,
      transitionProperty: s.transitionProperty,
      animationDelay: s.animationDelay,
      animationDuration: s.animationDuration,
    };
  };
  return () => { window.getComputedStyle = original; };
}

/**
 * @param {{ mount: Function, set: Function, advance: Function, fire: Function, unmount: Function }} adapter
 * @param {Scenario} scenario
 * @returns {Promise<[string, string][]>}
 */
export async function run (adapter, scenario) {
  const restore = stubComputedStyle();
  const trace = [];
  const el = () => document.querySelector('[data-qa="x"]');
  const snap = (step) => {
    const e = el();
    trace.push([step, e ? `${e.className}|${e.style.display}` : 'absent']);
  };
  const hook = (name) => (e) => { trace.push([`hook:${name}`, `${e.className}|${e.style.display}|${e.isConnected}`]); };
  const hooks = {};
  for (const n of ['BeforeEnter', 'Enter', 'AfterEnter', 'EnterCancelled', 'BeforeLeave', 'Leave', 'AfterLeave', 'LeaveCancelled']) hooks[`on${n}`] = hook(n);
  if (scenario.explicitDone) {
    hooks.onEnter = (e, done) => { hook('Enter')(e); setTimeout(done, 100); };
    hooks.onLeave = (e, done) => { hook('Leave')(e); setTimeout(done, 100); };
  }
  await adapter.mount({ ...scenario.props, ...hooks }, !!scenario.initial, scenario.style, !!scenario.vif);
  snap('mount');
  for (const step of scenario.steps) {
    if (step === 'show') await adapter.set(true);
    else if (step === 'hide') await adapter.set(false);
    else if (step === 'f') await adapter.advance(FRAME);
    else if (step.startsWith('t')) await adapter.advance(Number(step.slice(1)));
    else if (step === 'end') await adapter.fire(el(), 'transitionend');
    else if (step === 'aend') await adapter.fire(el(), 'animationend');
    snap(step);
  }
  await adapter.unmount();
  restore();
  return trace;
}
