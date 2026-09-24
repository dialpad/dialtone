import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import DtSlider from './Slider.vue';

// Matches Slider.vue's updateCollisions: nextTick() alone doesn't guarantee
// jsdom/the browser has painted the latest patch — it waits a real frame
// (twice) after each Vue flush, so tests exercising collision detection need
// to wait the same way rather than relying on microtask ticks alone.
const nextFrame = () => new Promise((resolve) => {
  requestAnimationFrame(() => requestAnimationFrame(resolve));
});
const settleCollisions = async () => {
  await nextTick();
  await nextFrame();
  await nextTick();
  await nextFrame();
};

// Mocks getComputedStyle for the control element rather than setting real
// inline style/dir and relying on jsdom to resolve it — jsdom's
// getComputedStyle doesn't compute inherited properties (a dir set on an
// ancestor never reaches a descendant's computed style) and caches its
// result per element on first call without invalidating it on a later
// direct inline-style mutation. isRtl() is the only thing that calls
// getComputedStyle(controlRef.value) in this component, so mocking it here
// is a precise, browser-CSS-engine-independent way to exercise "when
// direction resolves to rtl" without depending on jsdom's incomplete CSS
// support. Restore the spy (mockControlDirectionSpy?.mockRestore()) in an
// afterEach wherever this is used.
let mockControlDirectionSpy;
function mockControlDirection(direction) {
  const original = window.getComputedStyle.bind(window);
  mockControlDirectionSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation((el, ...rest) => {
    if (el?.dataset?.qa === 'dt-slider-control') return { direction };
    return original(el, ...rest);
  });
}

const baseProps = {
  label: 'Volume',
  modelValue: 50,
};
const baseAttrs = {};
const baseSlots = {};

let mockProps = {};
let mockAttrs = {};
let mockSlots = {};

describe('DtSlider Tests', () => {
  let wrapper;
  let root;
  let track;
  let indicator;
  let label;
  let thumbVisuals;
  let thumbInputs;

  const updateWrapper = () => {
    wrapper = mount(DtSlider, {
      props: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
    });

    root = wrapper.find('[data-qa="dt-slider"]');
    track = wrapper.find('[data-qa="dt-slider-track"]');
    indicator = wrapper.find('[data-qa="dt-slider-indicator"]');
    label = wrapper.find('[data-qa="dt-slider-label"]');
    thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
    thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
    wrapper?.unmount();
  });

  describe('Presentation Tests', () => {
    it('renders the component', () => {
      expect(wrapper).toBeDefined();
      expect(root.exists()).toBe(true);
    });

    it('has the d-slider root class', () => {
      expect(root.classes()).toContain('d-slider');
    });

    it('renders a track element', () => {
      expect(track.exists()).toBe(true);
    });

    it('renders an indicator element', () => {
      expect(indicator.exists()).toBe(true);
    });

    it('renders the label text', () => {
      expect(label.text()).toBe(baseProps.label);
    });

    it('renders one thumb in single mode', () => {
      expect(thumbInputs).toHaveLength(1);
    });

    it('renders one visual thumb in single mode', () => {
      expect(thumbVisuals).toHaveLength(1);
    });

    it('sets data-orientation to horizontal by default', () => {
      expect(root.attributes('data-orientation')).toBe('horizontal');
    });

    describe('Range mode', () => {
      beforeEach(() => {
        mockProps = { modelValue: [20, 70] };
        updateWrapper();
      });

      it('renders two thumb inputs', () => {
        expect(thumbInputs).toHaveLength(2);
      });

      it('renders two visual thumbs', () => {
        expect(thumbVisuals).toHaveLength(2);
      });

      it('sets the first input value to the low bound', () => {
        expect(thumbInputs[0].element.value).toBe('20');
      });

      it('sets the second input value to the high bound', () => {
        expect(thumbInputs[1].element.value).toBe('70');
      });

      it('warns via prop validator when modelValue is an array with a length other than 2', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mockProps = { modelValue: [10, 20, 30] };
        updateWrapper();
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
      });
    });

    describe('When min equals max (degenerate range)', () => {
      beforeEach(() => {
        mockProps = { modelValue: 50, min: 50, max: 50 };
        updateWrapper();
      });

      it('does not produce NaN positioning for the thumb', () => {
        // insetInlineStart (not left) is the actual CSS property the
        // component sets — see positionStyle in Slider.vue. Asserting on
        // .style.left here would pass unconditionally regardless of the
        // NaN guard, since the component never touches that property at all.
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].element.style.insetInlineStart).not.toContain('NaN');
      });

      it('does not produce NaN positioning for default marks', () => {
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        marks.forEach((mark) => {
          expect(mark.element.style.insetInlineStart).not.toContain('NaN');
        });
      });
    });

    describe('When disabled', () => {
      beforeEach(() => {
        mockProps = { disabled: true };
        updateWrapper();
      });

      it('adds d-slider--disabled class', () => {
        expect(root.classes()).toContain('d-slider--disabled');
      });

      it('sets data-disabled attribute', () => {
        expect(root.attributes('data-disabled')).toBeDefined();
      });

      it('sets disabled on the input', () => {
        expect(thumbInputs[0].attributes('disabled')).toBeDefined();
      });
    });

    describe('When orientation is vertical', () => {
      beforeEach(() => {
        mockProps = { orientation: 'vertical' };
        updateWrapper();
      });

      it('adds d-slider--vertical class', () => {
        expect(root.classes()).toContain('d-slider--vertical');
      });

      it('sets data-orientation to vertical', () => {
        expect(root.attributes('data-orientation')).toBe('vertical');
      });

      it('sets aria-orientation to vertical on the thumb input, since the native default is horizontal', () => {
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].attributes('aria-orientation')).toBe('vertical');
      });
    });

    describe('When inverted', () => {
      beforeEach(() => {
        mockProps = { inverted: true };
        updateWrapper();
      });

      it('adds d-slider--inverted class', () => {
        expect(root.classes()).toContain('d-slider--inverted');
      });
    });

    describe('Readout', () => {
      // The readout is a plain CSS-positioned element in the same row as marks (not
      // a floating tooltip/portal), so it can't desync from its thumb while scrolling.
      // It's found via data-qa and shown/hidden via the d-slider__readout--show /
      // --hide modifier classes instead of an `open` component prop.
      const readouts = () => wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');

      it('renders an always-shown readout by default', async () => {
        await nextTick();
        const els = readouts();
        expect(els).toHaveLength(1);
        expect(els[0].classes()).toContain('d-slider__readout--show');
      });

      it('renders no readout when readout is "never"', async () => {
        mockProps = { readout: 'never' };
        updateWrapper();
        await nextTick();
        expect(readouts()).toHaveLength(0);
      });

      it('renders an always-shown readout when readout is "always"', async () => {
        mockProps = { readout: 'always' };
        updateWrapper();
        await nextTick();
        const els = readouts();
        expect(els).toHaveLength(1);
        expect(els[0].classes()).toContain('d-slider__readout--show');
      });

      it('keeps the readout hidden at rest when readout is "interaction"', async () => {
        mockProps = { readout: 'interaction' };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].classes()).toContain('d-slider__readout--hide');
      });

      it('shows the readout when the thumb receives keyboard focus, readout "interaction"', async () => {
        mockProps = { readout: 'interaction' };
        updateWrapper();
        await nextTick();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        await thumbInputs[0].trigger('focus');
        expect(readouts()[0].classes()).toContain('d-slider__readout--show');
      });

      it('hides the readout again once the thumb blurs when readout is "interaction"', async () => {
        mockProps = { readout: 'interaction' };
        updateWrapper();
        await nextTick();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        await thumbInputs[0].trigger('focus');
        await thumbInputs[0].trigger('blur');
        expect(readouts()[0].classes()).toContain('d-slider__readout--hide');
      });

      it('shows the readout on thumb-hit hover, independent of focus, when readout is "interaction"', async () => {
        mockProps = { readout: 'interaction' };
        updateWrapper();
        await nextTick();
        const hitTarget = wrapper.findAll('[data-qa="dt-slider-thumb-hit"]')[0];
        await hitTarget.trigger('pointerenter');
        expect(readouts()[0].classes()).toContain('d-slider__readout--show');
        await hitTarget.trigger('pointerleave');
        expect(readouts()[0].classes()).toContain('d-slider__readout--hide');
      });

      it('keeps the readout open on hover-leave if that thumb is still keyboard-focused', async () => {
        mockProps = { readout: 'interaction' };
        updateWrapper();
        await nextTick();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        const hitTarget = wrapper.findAll('[data-qa="dt-slider-thumb-hit"]')[0];
        await thumbInputs[0].trigger('focus');
        await hitTarget.trigger('pointerenter');
        await hitTarget.trigger('pointerleave');
        expect(readouts()[0].classes()).toContain('d-slider__readout--show');
      });

      it('renders the formatted value as the readout content', async () => {
        mockProps = { readout: 'always' };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].text()).toBe('50');
      });

      it('hides the readout from the accessibility tree, since it duplicates the thumb input\'s own aria-valuetext', async () => {
        mockProps = { readout: 'always' };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].attributes('aria-hidden')).toBe('true');
      });

      it('renders one readout per thumb in range mode', async () => {
        mockProps = { readout: 'always', modelValue: [20, 70] };
        updateWrapper();
        await nextTick();
        const els = readouts();
        expect(els).toHaveLength(2);
        expect(els[0].text()).toBe('20');
        expect(els[1].text()).toBe('70');
      });

      it('applies suffix to the readout content', async () => {
        mockProps = { readout: 'always', suffix: '%' };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].text()).toBe('50%');
      });

      it('applies prefix to the readout content', async () => {
        mockProps = { readout: 'always', prefix: '$' };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].text()).toBe('$50');
      });

      it('prefers getValueText over suffix for the readout content', async () => {
        mockProps = { readout: 'always', suffix: '%', getValueText: (v) => `${v} units` };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].text()).toBe('50 units');
      });
    });

    describe('When showLabel is false', () => {
      beforeEach(() => {
        mockProps = { showLabel: false };
        updateWrapper();
      });

      it('keeps the label in the DOM', () => {
        expect(label.exists()).toBe(true);
      });

      it('applies sr-only class to hide it visually', () => {
        expect(label.classes()).toContain('sr-only');
      });
    });

    describe('When showTicks is true', () => {
      beforeEach(() => {
        mockProps = { showTicks: true, tickInterval: 10, min: 0, max: 100, step: 10 };
        updateWrapper();
      });

      it('renders tick marks', () => {
        const ticks = wrapper.findAll('[data-qa="dt-slider-tick"]');
        expect(ticks.length).toBeGreaterThan(0);
      });

      it('renders 11 ticks for tickInterval=10 over 0–100', () => {
        const ticks = wrapper.findAll('[data-qa="dt-slider-tick"]');
        expect(ticks).toHaveLength(11);
      });
    });

    describe('Dense generated points are capped', () => {
      let warnSpy;

      beforeEach(() => {
        warnSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      });

      afterEach(() => {
        warnSpy.mockRestore();
      });

      it('caps tick generation instead of hanging on a too-small tickInterval', () => {
        mockProps = { showTicks: true, tickInterval: 0.001, min: 0, max: 100 };
        updateWrapper();
        const ticks = wrapper.findAll('[data-qa="dt-slider-tick"]');
        expect(ticks.length).toBeLessThanOrEqual(1001); // +1 for the guaranteed end-of-domain point
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('tickInterval'));
      });

      it('still covers the FULL domain when capped, not just the beginning of it', () => {
        // The cap used to generate points sequentially from `min` and
        // truncate at 1000 — for tickInterval=0.001 over 0–100 that covered
        // only 0 through 0.999 (the first ~1% of the range): a plausible-
        // looking but materially false representation of the range, with
        // no ticks or snap targets anywhere past it.
        mockProps = { showTicks: true, tickInterval: 0.001, min: 0, max: 100 };
        updateWrapper();
        const tickPositions = wrapper.findAll('[data-qa="dt-slider-tick"]').map((t) => t.attributes('style'));
        const lastTickStyle = tickPositions.at(-1);
        expect(lastTickStyle).toMatch(/inset-inline-start:\s*(99\.\d+|100)%/);
      });

      it('caps snapPoints generation instead of hanging on a too-small interval', async () => {
        // computedSnapPoints is lazily evaluated — only findMagneticSnapPoint
        // (a pointer drag with allowSnap) actually reads it, so mounting
        // alone never triggers the warning; a drag start is required.
        mockProps = { snapPoints: 0.001, min: 0, max: 100 };
        updateWrapper();
        const control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('snapPoints'));
      });
    });

    describe('Dense generated points, production mode', () => {
      let warnSpy;
      let originalNodeEnv;

      beforeEach(() => {
        warnSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
      });

      afterEach(() => {
        warnSpy.mockRestore();
        process.env.NODE_ENV = originalNodeEnv;
      });

      it('does not log the interval-cap notice in production', () => {
        mockProps = { showTicks: true, tickInterval: 0.001, min: 0, max: 100 };
        updateWrapper();
        expect(warnSpy).not.toHaveBeenCalled();
      });
    });

    describe('Slots', () => {
      it('renders the start slot', () => {
        mockSlots = { start: '<span data-testid="start-slot">Low</span>' };
        updateWrapper();
        const startWrapper = wrapper.find('[data-qa="dt-slider-start"]');
        expect(startWrapper.find('[data-testid="start-slot"]').exists()).toBe(true);
      });

      it('renders the end slot', () => {
        mockSlots = { end: '<span data-testid="end-slot">High</span>' };
        updateWrapper();
        const endWrapper = wrapper.find('[data-qa="dt-slider-end"]');
        expect(endWrapper.find('[data-testid="end-slot"]').exists()).toBe(true);
      });

      it('renders the label slot', () => {
        mockSlots = { label: '<span data-testid="custom-label">Custom</span>' };
        updateWrapper();
        expect(label.find('[data-testid="custom-label"]').exists()).toBe(true);
      });

      it('exposes the live value via the label slot scope, updating as the thumb moves', async () => {
        mockSlots = {
          label: (scope) => h('span', { 'data-testid': 'live-label' }, String(scope.value)),
        };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(label.find('[data-testid="live-label"]').text()).toBe('50');

        thumbInputs[0].element.value = '75';
        await thumbInputs[0].trigger('input');
        expect(label.find('[data-testid="live-label"]').text()).toBe('75');
      });

      it('exposes the value as an array via the label slot scope in range mode', () => {
        mockProps = { modelValue: [20, 70] };
        mockSlots = {
          label: (scope) => h('span', { 'data-testid': 'live-label' }, scope.value.join('-')),
        };
        updateWrapper();
        expect(label.find('[data-testid="live-label"]').text()).toBe('20-70');
      });
    });

    describe('Slot class props', () => {
      it('applies labelClass to the label wrapper', () => {
        mockProps = { labelClass: 'custom-label-class' };
        updateWrapper();
        expect(label.classes()).toContain('custom-label-class');
      });

      it('applies startClass to the start slot wrapper', () => {
        mockProps = { startClass: 'custom-start-class' };
        updateWrapper();
        expect(wrapper.find('[data-qa="dt-slider-start"]').classes()).toContain('custom-start-class');
      });

      it('applies endClass to the end slot wrapper', () => {
        mockProps = { endClass: 'custom-end-class' };
        updateWrapper();
        expect(wrapper.find('[data-qa="dt-slider-end"]').classes()).toContain('custom-end-class');
      });
    });

    describe('size prop', () => {
      it('applies no size modifier class for the default size (300)', () => {
        mockProps = { size: 300 };
        updateWrapper();
        expect(root.classes()).not.toContain('d-slider--sm');
        expect(root.classes()).not.toContain('d-slider--lg');
      });

      it('applies d-slider--sm for size 200', () => {
        mockProps = { size: 200 };
        updateWrapper();
        expect(root.classes()).toContain('d-slider--sm');
      });

      it('applies d-slider--lg for size 400', () => {
        mockProps = { size: 400 };
        updateWrapper();
        expect(root.classes()).toContain('d-slider--lg');
      });
    });

    describe('name prop', () => {
      it('forwards name to each thumb input, so range mode values can be retrieved together via FormData.getAll', () => {
        mockProps = { name: 'volume', modelValue: [20, 70] };
        updateWrapper();
        expect(thumbInputs[0].attributes('name')).toBe('volume');
        expect(thumbInputs[1].attributes('name')).toBe('volume');
      });

      it('omits the name attribute entirely when unset, rather than rendering name=""', () => {
        expect(thumbInputs[0].attributes('name')).toBeUndefined();
      });
    });

    describe('Attrs passthrough (inheritAttrs: false)', () => {
      it('forwards a consumer class onto the root element, merged with the component\'s own classes', () => {
        mockAttrs = { class: 'consumer-class' };
        updateWrapper();
        expect(root.classes()).toContain('consumer-class');
        expect(root.classes()).toContain('d-slider');
      });

      it('forwards consumer style onto the root element', () => {
        mockAttrs = { style: 'margin-top: 8px;' };
        updateWrapper();
        expect(root.attributes('style')).toContain('margin-top');
      });

      it('forwards non-class/style attrs like data-testid onto the root element', () => {
        mockAttrs = { 'data-testid': 'volume-slider' };
        updateWrapper();
        expect(root.attributes('data-testid')).toBe('volume-slider');
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('thumb input has type range', () => {
      expect(thumbInputs[0].attributes('type')).toBe('range');
    });

    it('thumb input has aria-labelledby pointing to the label', () => {
      const labelId = label.attributes('id');
      expect(thumbInputs[0].attributes('aria-labelledby')).toBe(labelId);
    });

    it('falls back to aria-label, not aria-labelledby to an empty node, when the label slot renders nothing', () => {
      mockProps = { label: undefined };
      mockAttrs = { 'aria-label': 'Volume' };
      mockSlots = { label: '' };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-labelledby')).toBeUndefined();
      expect(thumbInputs[0].attributes('aria-label')).toBe('Volume');
    });

    it('forwards a consumer-supplied aria-labelledby to each thumb when there is no visible label', () => {
      // Standard "label via an external heading" pattern — before this fix,
      // removeClassStyleAttrs only stripped class/style, so aria-labelledby
      // landed on the inert wrapper div and never reached the actual
      // role="slider" inputs, leaving them with no accessible name at all.
      mockProps = { label: undefined };
      mockAttrs = { 'aria-labelledby': 'external-heading' };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-labelledby')).toBe('external-heading');
      expect(thumbInputs[0].attributes('aria-label')).toBeUndefined();
    });

    it('prefers the internal label over a consumer-supplied aria-labelledby when both are present', () => {
      mockProps = { label: 'Volume' };
      mockAttrs = { 'aria-labelledby': 'external-heading' };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      const labelId = wrapper.find('[data-qa="dt-slider-label"]').attributes('id');
      expect(thumbInputs[0].attributes('aria-labelledby')).toBe(labelId);
    });

    it('does not duplicate aria-label/aria-labelledby onto the root wrapper — only the thumb inputs get them', () => {
      mockProps = { label: undefined };
      mockAttrs = { 'aria-label': 'Volume', 'aria-labelledby': 'external-heading' };
      updateWrapper();
      expect(root.attributes('aria-label')).toBeUndefined();
      expect(root.attributes('aria-labelledby')).toBeUndefined();
    });

    it('forwards aria-describedby, aria-errormessage, aria-details, and aria-invalid to each thumb input', () => {
      mockAttrs = {
        'aria-describedby': 'hint-id',
        'aria-errormessage': 'error-id',
        'aria-details': 'details-id',
        'aria-invalid': 'true',
      };
      mockProps = { modelValue: [20, 70] };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      for (const input of thumbInputs) {
        expect(input.attributes('aria-describedby')).toBe('hint-id');
        expect(input.attributes('aria-errormessage')).toBe('error-id');
        expect(input.attributes('aria-details')).toBe('details-id');
        expect(input.attributes('aria-invalid')).toBe('true');
      }
    });

    it('does not leave aria-describedby/aria-errormessage/aria-details/aria-invalid on the root wrapper', () => {
      // Before this fix, only class/style were stripped from $attrs before
      // binding the rest to the root <div> — these form-control relationship
      // attributes stayed on that inert wrapper and never reached the actual
      // role="slider" inputs at all.
      mockAttrs = {
        'aria-describedby': 'hint-id',
        'aria-errormessage': 'error-id',
        'aria-details': 'details-id',
        'aria-invalid': 'true',
      };
      updateWrapper();
      expect(root.attributes('aria-describedby')).toBeUndefined();
      expect(root.attributes('aria-errormessage')).toBeUndefined();
      expect(root.attributes('aria-details')).toBeUndefined();
      expect(root.attributes('aria-invalid')).toBeUndefined();
    });

    it('sets aria-valuemin from min prop', () => {
      expect(thumbInputs[0].attributes('min')).toBe('0');
    });

    it('sets aria-valuemax from max prop', () => {
      expect(thumbInputs[0].attributes('max')).toBe('100');
    });

    it('sets aria-valuenow from modelValue', () => {
      expect(thumbInputs[0].element.value).toBe('50');
    });

    it('applies getValueText result to aria-valuetext', () => {
      mockProps = { getValueText: (v) => `Volume: ${v}%` };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-valuetext')).toBe('Volume: 50%');
    });

    it('applies prefix/suffix to aria-valuetext when getValueText is not set', () => {
      mockProps = { prefix: '$', suffix: ' USD' };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-valuetext')).toBe('$50 USD');
    });

    it('prefers getValueText over prefix/suffix when both are set', () => {
      mockProps = { getValueText: (v) => `${v}%`, prefix: '$', suffix: ' USD' };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-valuetext')).toBe('50%');
    });
  });

  describe('Dev-only accessibility warnings (console.info)', () => {
    let infoSpy;

    beforeEach(() => {
      infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    });

    afterEach(() => {
      infoSpy.mockRestore();
    });

    it('warns when neither label nor showLabel is set — the one case actually missing an accessible name', () => {
      mockProps = { label: undefined };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('does not warn at all in production — a library cannot assume every consumer strips console calls', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        mockProps = { label: undefined, modelValue: [20, 70] }; // range mode + no label: would normally warn twice
        updateWrapper();
        expect(infoSpy).not.toHaveBeenCalled();
      } finally {
        process.env.NODE_ENV = originalNodeEnv;
      }
    });

    it('does not warn about a missing label when label is set', () => {
      mockProps = { label: 'Volume' };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('warns when only showLabel is set without a label — showLabel alone does not create an accessible name', () => {
      mockProps = { label: undefined, showLabel: false };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('does not warn when aria-label is provided, even without label or showLabel', () => {
      mockProps = { label: undefined };
      mockAttrs = { 'aria-label': 'Volume' };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('does not warn when the label slot supplies content, even without the label prop', () => {
      mockProps = { label: undefined };
      mockSlots = { label: '<span>Custom label</span>' };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('still warns when the label slot exists but renders nothing — an empty slot provides no accessible name', () => {
      mockProps = { label: undefined };
      mockSlots = { label: '' };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('does not crash mounting with a scoped #label slot that indexes into value, in range mode', () => {
      // The #label slot is documented as scoped with :value — a range-mode
      // consumer destructuring it (e.g. the shipped 'call duration filter'
      // Combinator preset: {{ value[0] }}–{{ value[1] }}) used to throw
      // during hasVisibleLabel's hasSlotContent probe, which called the slot
      // with no props at all, leaving `value` undefined.
      mockProps = { label: undefined, modelValue: [20, 70] };
      mockSlots = { label: '<template #label="{ value }">{{ value[0] }}-{{ value[1] }}</template>' };
      expect(() => updateWrapper()).not.toThrow();
    });

    it('warns about missing getValueText in range mode, independent of whether a label is set', () => {
      mockProps = { label: 'Price range', modelValue: [20, 70] };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide getValueText'));
    });

    it('does not warn about getValueText when it is provided', () => {
      mockProps = { label: 'Price range', modelValue: [20, 70], getValueText: (v) => `${v}` };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide getValueText'));
    });

    it('does not warn when aria-labelledby is provided, even without label or aria-label', () => {
      mockProps = { label: undefined };
      mockAttrs = { 'aria-labelledby': 'external-heading' };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('warns for a whitespace-only label — it has no non-whitespace content, same as an empty one', () => {
      mockProps = { label: '   ' };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('warns as soon as a reactively-cleared label removes the accessible name after mount, not just at mount time', async () => {
      mockProps = { label: 'Volume' };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));

      await wrapper.setProps({ label: '' });
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });
  });

  describe('Interactivity Tests', () => {
    it('emits update:modelValue when thumb input event fires', async () => {
      const input = thumbInputs[0].element;
      input.value = '75';
      await thumbInputs[0].trigger('input');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted).toBeTruthy();
      expect(emitted[emitted.length - 1][0]).toBe(75);
    });

    it('emits change on blur when value has changed', async () => {
      const input = thumbInputs[0].element;
      input.value = '80';
      await thumbInputs[0].trigger('input');
      await thumbInputs[0].trigger('blur');
      expect(wrapper.emitted('change')).toBeTruthy();
    });

    it('does not emit change on blur when value is unchanged', async () => {
      await thumbInputs[0].trigger('blur');
      expect(wrapper.emitted('change')).toBeFalsy();
    });

    it('does not emit a false change on blur after an external modelValue update with no user interaction', async () => {
      await wrapper.setProps({ modelValue: 60 });
      await thumbInputs[0].trigger('blur');
      expect(wrapper.emitted('change')).toBeFalsy();
    });

    it('still emits change on blur when the user interacts after an external modelValue update', async () => {
      await wrapper.setProps({ modelValue: 60 });
      thumbInputs[0].element.value = '65';
      await thumbInputs[0].trigger('input');
      await thumbInputs[0].trigger('blur');
      const emitted = wrapper.emitted('change');
      expect(emitted).toBeTruthy();
      expect(emitted[emitted.length - 1][0]).toBe(65);
    });

    it('does not interact when disabled', async () => {
      mockProps = { disabled: true };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('disabled')).toBeDefined();
    });

    it('emits focus on thumb focus', async () => {
      await thumbInputs[0].trigger('focus');
      expect(wrapper.emitted('focus')).toBeTruthy();
    });

    it('emits blur on thumb blur', async () => {
      await thumbInputs[0].trigger('blur');
      expect(wrapper.emitted('blur')).toBeTruthy();
    });

    describe('Exposed public API', () => {
      // document.activeElement only tracks elements actually attached to the
      // document — the shared `wrapper` from the outer beforeEach isn't, so
      // these mount their own instance with attachTo instead.
      let attachedWrapper;

      afterEach(() => {
        attachedWrapper?.unmount();
      });

      it('focus() focuses the first thumb input', () => {
        attachedWrapper = mount(DtSlider, { props: baseProps, attachTo: document.body });
        const input = attachedWrapper.find('[data-qa="dt-slider-thumb"]').element;
        attachedWrapper.vm.focus();
        expect(document.activeElement).toBe(input);
      });

      it('blur() blurs the first thumb input', () => {
        attachedWrapper = mount(DtSlider, { props: baseProps, attachTo: document.body });
        const input = attachedWrapper.find('[data-qa="dt-slider-thumb"]').element;
        input.focus();
        expect(document.activeElement).toBe(input);
        attachedWrapper.vm.blur();
        expect(document.activeElement).not.toBe(input);
      });
    });

    describe('Pointer drag', () => {
      let control;

      beforeEach(() => {
        control = wrapper.find('[data-qa="dt-slider-control"]');
        // jsdom does not implement the Pointer Capture API.
        control.element.setPointerCapture = () => {};
      });

      it('adds the active class to the thumb on pointerdown', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--active');
      });

      it('focuses the nearest thumb input on pointerdown, so a keyboard nudge works immediately after', async () => {
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        const focusSpy = vi.spyOn(thumbInputs[0].element, 'focus');
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        expect(focusSpy).toHaveBeenCalled();
      });

      it('does not add the keyboard-focus ring class for a pointer-driven focus', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).not.toContain('d-slider__thumb-visual--focused');
      });

      it('adds the keyboard-focus ring once the user arrow-navigates after a pointer-driven focus', async () => {
        // A click-to-focus never fires a second 'focus' event just because the
        // user starts using the keyboard afterward — the ring must still
        // appear once a keydown proves keyboard interaction is happening.
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        await thumbInputs[0].trigger('keydown', { key: 'ArrowRight' });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--focused');
      });

      it('adds the keyboard-focus ring class for a real keyboard (Tab) focus', async () => {
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        await thumbInputs[0].trigger('focus');
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--focused');
      });

      it('does not corrupt the next real focus after a pointerdown on an already-focused thumb', async () => {
        // Attached to document.body (unlike the shared wrapper) so real
        // .focus()/.blur() genuinely move document.activeElement — the fix
        // checks that, and .trigger('focus') alone never touches it.
        const attached = mount(DtSlider, { props: baseProps, attachTo: document.body });
        try {
          const attachedControl = attached.find('[data-qa="dt-slider-control"]');
          attachedControl.element.setPointerCapture = () => {};
          const attachedInput = attached.find('[data-qa="dt-slider-thumb"]');

          attachedInput.element.focus();
          await nextTick();
          expect(document.activeElement).toBe(attachedInput.element);

          // .focus() on an already-focused element fires no focus event, so
          // if onPointerDown still called it unconditionally, isPointerFocus
          // would leak into the next real focus below and suppress its ring.
          await attachedControl.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
          await attachedControl.trigger('pointerup', { pointerId: 1 });

          attachedInput.element.blur();
          await nextTick();
          attachedInput.element.focus();
          await nextTick();

          expect(attached.find('[data-qa="dt-slider-thumb-visual"]').classes()).toContain('d-slider__thumb-visual--focused');
        } finally {
          attached.unmount();
        }
      });

      it('clears the keyboard-focus ring when a pointer drag starts on an already keyboard-focused thumb', async () => {
        // onPointerDown skips focus() entirely for an already-focused thumb
        // (see the test above), so onThumbFocus never runs and never clears
        // focusedThumbIndex through the normal path — without an explicit
        // clear, the keyboard-only ring stayed visually combined with the
        // --active drag style for the whole drag, even though the input
        // modality had switched to pointer. Attached to document.body (like
        // the sibling test above) so document.activeElement genuinely
        // reflects the focused thumb — onPointerDown's own already-focused
        // check depends on it.
        const attached = mount(DtSlider, { props: baseProps, attachTo: document.body });
        try {
          const attachedControl = attached.find('[data-qa="dt-slider-control"]');
          attachedControl.element.setPointerCapture = () => {};
          const attachedInput = attached.find('[data-qa="dt-slider-thumb"]');

          attachedInput.element.focus();
          await nextTick();
          expect(attached.find('[data-qa="dt-slider-thumb-visual"]').classes()).toContain('d-slider__thumb-visual--focused');

          await attachedControl.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
          const thumbVisual = attached.find('[data-qa="dt-slider-thumb-visual"]');
          expect(thumbVisual.classes()).not.toContain('d-slider__thumb-visual--focused');
          expect(thumbVisual.classes()).toContain('d-slider__thumb-visual--active');
        } finally {
          attached.unmount();
        }
      });

      it('prevents the default browser action on pointerdown, which would otherwise steal focus back after our own .focus() call', async () => {
        const event = new Event('pointerdown', { bubbles: true, cancelable: true });
        Object.assign(event, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        control.element.dispatchEvent(event);
        await nextTick();
        expect(event.defaultPrevented).toBe(true);
      });

      it('removes the active class on pointerup', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        await control.trigger('pointerup', { pointerId: 1 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).not.toContain('d-slider__thumb-visual--active');
      });

      it('keeps dragging while a pointermove still reports the button held', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        await control.trigger('pointermove', { pointerId: 1, clientX: 10, buttons: 1 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--active');
      });

      it('stops dragging when a pointermove reports the button released, even without a matching pointerup', async () => {
        // Simulates the button being released outside this document (e.g. a
        // parent frame, or outside the OS window), where no pointerup ever
        // reaches us.
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        await control.trigger('pointermove', { pointerId: 1, clientX: 10, buttons: 0 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).not.toContain('d-slider__thumb-visual--active');
      });

      it('ignores a non-primary mouse button, so the native context menu still works', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 2, clientX: 0, buttons: 2 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).not.toContain('d-slider__thumb-visual--active');
      });

      it('adds d-slider--dragging while a pointer drag is active, and removes it on release', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        expect(wrapper.find('[data-qa="dt-slider"]').classes()).toContain('d-slider--dragging');
        await control.trigger('pointerup', { pointerId: 1 });
        expect(wrapper.find('[data-qa="dt-slider"]').classes()).not.toContain('d-slider--dragging');
      });

      it('does not start or continue a drag on a disabled slider', async () => {
        mockProps = { disabled: true };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};

        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        await control.trigger('pointermove', { pointerId: 1, clientX: 50, buttons: 1 });
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      });

      it('stops accepting drag input the moment disabled flips true mid-drag', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        await wrapper.setProps({ disabled: true });
        const emittedBefore = (wrapper.emitted('update:modelValue') || []).length;
        await control.trigger('pointermove', { pointerId: 1, clientX: 90, buttons: 1 });
        const emittedAfter = (wrapper.emitted('update:modelValue') || []).length;
        expect(emittedAfter).toBe(emittedBefore);
      });

      it('clears the keyboard-focus ring when disabled flips true while a thumb is focused', async () => {
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        await thumbInputs[0].trigger('focus');
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--focused');

        await wrapper.setProps({ disabled: true });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).not.toContain('d-slider__thumb-visual--focused');
      });

      it('routes a pointerdown to the thumb opposite the one last dragged, when both thumbs coincide', async () => {
        mockProps = { modelValue: [50, 50] };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};

        // First drag: neither thumb has been active yet, so it grabs thumb 0.
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--active');
        await control.trigger('pointerup', { pointerId: 1 });

        // Thumbs are still coincident — a fresh pointerdown must route to the
        // OTHER thumb, not fall back to thumb 0 again (the regression this
        // guards: activeThumbIndex resets to null on every pointerup, which
        // would make this always route to thumb 0).
        await control.trigger('pointerdown', { pointerId: 2, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[1].classes()).toContain('d-slider__thumb-visual--active');
      });
    });

    describe('Magnetic snapping (snapPoints / snapThreshold)', () => {
      let control;

      // A 100px-wide control with the default min/max of [0, 100] makes the
      // pixel threshold and the value threshold numerically identical, which
      // keeps the expected values in each test easy to verify by hand.
      const controlRect = { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 };

      const dragTo = async (clientX) => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX, buttons: 1 });
      };

      const moveTo = async (clientX) => {
        await control.trigger('pointermove', { pointerId: 1, clientX, buttons: 1 });
      };

      beforeEach(() => {
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;
      });

      it('pulls a dragged value within snapThreshold to the nearest interval snap point', async () => {
        mockProps = { snapPoints: 25, snapThreshold: 5 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(23); // distance 2 from the 25 snap point, within threshold 5
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(25);
      });

      it('leaves a value outside snapThreshold freely selectable', async () => {
        mockProps = { snapPoints: 25, snapThreshold: 2 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(20); // distance 5 from the 25 snap point, outside threshold 2
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(20);
      });

      it('pulls a dragged value within snapThreshold to the nearest arbitrary snap point', async () => {
        mockProps = { snapPoints: [10, 42, 90], snapThreshold: 5 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(41); // distance 1 from the 42 snap point
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(42);
      });

      it('uses normal step quantization, unaffected, for values far from any snap point', async () => {
        mockProps = { snapPoints: [10, 42, 90], snapThreshold: 5, step: 1 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(65);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(65);
      });

      it('does not snap keyboard-driven input, even near a snap point with a large threshold', async () => {
        mockProps = { snapPoints: 25, snapThreshold: 50 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');

        thumbInputs[0].element.value = '23';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(23);
      });

      it('leaves default behavior unchanged when snapPoints is not set', async () => {
        await dragTo(37);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(37);
      });

      it('holds a snapped thumb through hysteresis, past the entry radius, until it clears the wider release radius', async () => {
        // snapThreshold 3 → entry radius 3, release radius 3 * SNAP_RELEASE_MULTIPLIER (2) = 6.
        mockProps = { snapPoints: 25, snapThreshold: 3 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(23); // distance 2, within entry radius 3 — snaps to 25
        let emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(25);

        await moveTo(21); // distance 4 from 25 — past entry radius, but within release radius 6
        emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(25); // stays pinned via hysteresis

        await moveTo(15); // distance 10 — past the release radius, breaks free
        emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(15);
      });

      it('snaps each thumb independently in range mode while still respecting the no-crossing clamp', async () => {
        mockProps = { modelValue: [40, 60], snapPoints: 25, snapThreshold: 5 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(23); // routes to the low thumb, snaps to 25 — well clear of the high thumb at 60
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([25, 60]);
      });

      it('snaps exactly at the threshold boundary (inclusive)', async () => {
        mockProps = { snapPoints: 25, snapThreshold: 5 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(20); // distance exactly 5 from the 25 snap point, equal to the threshold
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(25);
      });

      it('never offers a snap point outside [min, max] as a target, so the emitted value can never leave the documented range', async () => {
        mockProps = { min: 0, max: 100, snapPoints: [105], snapThreshold: 10 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(98); // distance 7 from the out-of-range 105 "snap point" — must not pull toward it
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(98);
      });

      it('snaps correctly for a vertical slider, using the control height rather than width', async () => {
        const verticalRect = { top: 0, left: 0, right: 20, bottom: 100, width: 20, height: 100 };
        mockProps = { orientation: 'vertical', snapPoints: 25, snapThreshold: 5 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => verticalRect;

        // Vertical value = min + (1 - (clientY - top) / height) * (max - min); clientY 77 -> value 23,
        // distance 2 from the 25 snap point, within the threshold.
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientY: 77, buttons: 1 });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(25);
      });

      it('releases hysteresis when the range-crossing clamp blocks the snap point, instead of freezing the thumb at the other thumb\'s boundary', async () => {
        // A snap point beyond the high thumb can pull the low thumb toward
        // it, but the crossing clamp then stops it short — hysteresis must
        // not keep comparing later drag positions against that unreachable
        // point, or the thumb stays stuck at 60 across a wide swath of the
        // drag that has nothing to do with the 90 snap point.
        mockProps = { modelValue: [40, 60], snapPoints: [90], snapThreshold: 25 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(41); // grabs the low thumb (nearer to 40 than 60)
        await moveTo(85); // distance 5 from 90, within entry radius 25 — snaps to 90, crossing-clamped to 60
        let emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([60, 60]);

        await moveTo(45); // distance 45 from 90 — past entry radius; would still be inside the OLD, un-reconciled
        // release radius (25 * SNAP_RELEASE_MULTIPLIER), but the thumb is no longer near the point it's
        // ostensibly "holding," and 45 is not blocked by the high thumb at 60, so it must move freely.
        emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([45, 60]);
      });
    });

    describe('Keyboard: PageUp / PageDown / Shift+Arrow', () => {
      it('increases value by largeStep on PageUp', async () => {
        await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toBe(60); // 50 + 10
      });

      it('decreases value by largeStep on PageDown', async () => {
        await thumbInputs[0].trigger('keydown', { key: 'PageDown' });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toBe(40); // 50 - 10
      });

      it.each(['ArrowRight', 'ArrowUp'])('increases value by largeStep on Shift+%s', async (key) => {
        await thumbInputs[0].trigger('keydown', { key, shiftKey: true });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toBe(60); // 50 + 10
      });

      it.each(['ArrowLeft', 'ArrowDown'])('decreases value by largeStep on Shift+%s', async (key) => {
        await thumbInputs[0].trigger('keydown', { key, shiftKey: true });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toBe(40); // 50 - 10
      });

      it('does not apply largeStep on a plain, non-shifted ArrowRight', async () => {
        await thumbInputs[0].trigger('keydown', { key: 'ArrowRight' });
        // Plain arrows are handled natively by <input type="range">, not by this
        // handler — no update should be emitted from the keydown handler itself.
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      });
    });

    describe('Range: minStepsBetweenValues', () => {
      beforeEach(() => {
        mockProps = { modelValue: [40, 60], minStepsBetweenValues: 10 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      });

      it('clamps lower thumb when it would violate min gap', async () => {
        // Try to move lower thumb to 55 (would violate gap of 10 with upper at 60)
        thumbInputs[0].element.value = '55';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        // Should be clamped to 50 (60 - 10*1)
        expect(emitted[emitted.length - 1][0][0]).toBe(50);
      });
    });

    describe('Range: thumbs cannot cross (no minStepsBetweenValues set)', () => {
      beforeEach(() => {
        mockProps = { modelValue: [40, 60] };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      });

      it('stops the lower thumb at the upper thumb\'s value instead of crossing it', async () => {
        thumbInputs[0].element.value = '90';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([60, 60]);
      });

      it('stops the upper thumb at the lower thumb\'s value instead of crossing it', async () => {
        thumbInputs[1].element.value = '10';
        await thumbInputs[1].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([40, 40]);
      });

      it('lets the two thumbs meet exactly (equal values are allowed)', async () => {
        thumbInputs[0].element.value = '60';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([60, 60]);
      });

      it('enforces the same constraint via PageUp/PageDown (largeStep)', async () => {
        // Lower thumb PageUp by the default largeStep (10) from 40 would reach 50 — fine —
        // but repeated presses should still stop it at the upper thumb's value.
        await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
        await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
        await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([60, 60]);
      });
    });

    it('corrects the native input DOM value when the crossing clamp leaves internalValues unchanged', async () => {
      // Native plain-arrow keyboard stepping is handled entirely by the
      // browser itself (see onThumbKeydown) — it writes straight into the
      // input's own DOM .value before Vue's 'input' handler ever runs, and
      // it isn't constrained to the sibling thumb's position the way this
      // range-mode crossing clamp is. Simulate exactly that: the low thumb
      // is already at 60 (touching the high thumb), and the native element
      // has already stepped itself one further, to 61.
      mockProps = { modelValue: [60, 60] };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      // Let mount fully settle first — pending post-mount reactive effects
      // (e.g. the collision-detection watcher's own nextTick) can otherwise
      // land on the same tick as the manual DOM write below and coincidentally
      // force-resync every input's value as an unrelated side effect of
      // Vue's own value-binding patch, masking whether THIS fix is what
      // actually corrected it.
      await settleCollisions();

      thumbInputs[0].element.value = '61';
      await thumbInputs[0].trigger('input');

      // The crossing clamp reduces 61 back to 60 — already the thumb's
      // current logical value — so internalValues never changes and no
      // update:modelValue fires. Without the fix, the native input's own
      // DOM value would be left at the wrong '61' anyway.
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(thumbInputs[0].element.value).toBe('60');
    });

    describe('Range: an inverted modelValue is normalized, not left crossed', () => {
      it('swaps an inverted initial modelValue on mount', () => {
        mockProps = { modelValue: [70, 30] };
        updateWrapper();
        expect(wrapper.props('modelValue')).toEqual([70, 30]); // prop itself is untouched
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        // internal rendering is swapped to [30, 70] so low <= high internally
        expect(Number(thumbInputs[0].element.value)).toBe(30);
        expect(Number(thumbInputs[1].element.value)).toBe(70);
      });

      it('emits the corrected pair on mount so a v-model source stays in sync, not just the render', () => {
        mockProps = { modelValue: [70, 30] };
        updateWrapper();
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toEqual([30, 70]);
      });

      it('swaps an inverted modelValue pushed in later via prop update', async () => {
        mockProps = { modelValue: [20, 80] };
        updateWrapper();
        await wrapper.setProps({ modelValue: [90, 10] });
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(10);
        expect(Number(thumbInputs[1].element.value)).toBe(90);
      });

      it('emits the corrected pair when a later prop update arrives inverted', async () => {
        mockProps = { modelValue: [20, 80] };
        updateWrapper();
        await wrapper.setProps({ modelValue: [90, 10] });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toEqual([10, 90]);
      });

      it('does not re-emit when a later prop update is already in order', async () => {
        mockProps = { modelValue: [20, 80] };
        updateWrapper();
        await wrapper.setProps({ modelValue: [25, 75] });
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      });
    });

    describe('RTL (dir="rtl")', () => {
      // See mockControlDirection's own comment near the top of the file.
      afterEach(() => {
        mockControlDirectionSpy?.mockRestore();
      });

      it('mirrors pointer-to-value mapping — a physically-left position maps toward max, not min', async () => {
        mockControlDirection('rtl');
        const controlRect = { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 };
        const control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        // 10% across from the physical left edge is 90% under RTL (min renders
        // on the physical right), not 10% as it would under LTR.
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(90);
      });

      it('does not mirror pointer mapping when direction is (explicitly or by default) ltr', async () => {
        mockControlDirection('ltr');
        const controlRect = { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 };
        const control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(10);
      });

      it('swaps Shift+ArrowRight to decrease (matching the native RTL-flipped arrow keys)', async () => {
        mockControlDirection('rtl');
        await thumbInputs[0].trigger('keydown', { key: 'ArrowRight', shiftKey: true });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(40); // 50 - largeStep(10), flipped under rtl
      });

      it('swaps Shift+ArrowLeft to increase (matching the native RTL-flipped arrow keys)', async () => {
        mockControlDirection('rtl');
        await thumbInputs[0].trigger('keydown', { key: 'ArrowLeft', shiftKey: true });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(60); // 50 + largeStep(10), flipped under rtl
      });

      it('does not swap Shift+ArrowUp/ArrowDown or PageUp/PageDown under rtl — only Left/Right are direction-relative', async () => {
        mockControlDirection('rtl');
        await thumbInputs[0].trigger('keydown', { key: 'ArrowUp', shiftKey: true });
        let emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(60); // still increases

        await thumbInputs[0].trigger('keydown', { key: 'PageDown' });
        emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(50); // still decreases, from 60
      });

      it('does not swap Shift+ArrowRight/ArrowLeft for a vertical slider even under rtl', async () => {
        mockProps = { orientation: 'vertical' };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        mockControlDirection('rtl');

        await thumbInputs[0].trigger('keydown', { key: 'ArrowRight', shiftKey: true });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(60); // unaffected by rtl — vertical never uses Left/Right
      });

      it('centers the thumb on its actual anchor point under rtl, not one thumb-width off', async () => {
        // translateX(-50%) is a PHYSICAL shift that never mirrors under
        // dir="rtl" the way insetInlineStart does — the compensating shift
        // has to flip sign too (+50%) or the thumb renders centered a full
        // width away from where insetInlineStart actually anchored it. This
        // is exactly the bug that produced a visible gap between the thumb
        // and the indicator's edge. controlRef isn't bound yet during the
        // very first render (arming the mock before mount would never be
        // consulted), so mount normally first, then arm the mock and force
        // a re-render via a prop update.
        mockControlDirection('rtl');
        await wrapper.setProps({ modelValue: 51 });
        const thumbVisual = wrapper.find('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisual.attributes('style')).toContain('translate(50%, -50%)');
      });

      it('keeps the ltr centering transform when direction is ltr', async () => {
        mockControlDirection('ltr');
        await wrapper.setProps({ modelValue: 51 });
        const thumbVisual = wrapper.find('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisual.attributes('style')).toContain('translate(-50%, -50%)');
      });

      it('centers ticks on their anchor point under rtl too', async () => {
        mockProps = { showTicks: true, tickInterval: 25 };
        updateWrapper();
        mockControlDirection('rtl');
        await wrapper.setProps({ modelValue: 51 });
        const tick = wrapper.find('[data-qa="dt-slider-tick"]');
        expect(tick.attributes('style')).toContain('translateX(50%)');
      });
    });

    describe('modelValue bounds and shape validation', () => {
      it('clamps an initial modelValue above max down to max', () => {
        mockProps = { modelValue: 150, min: 0, max: 100 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(100);
      });

      it('clamps an initial modelValue below min up to min', () => {
        mockProps = { modelValue: -50, min: 0, max: 100 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(0);
      });

      it('emits the clamped correction on mount so v-model does not disagree with what is rendered', () => {
        mockProps = { modelValue: 150, min: 0, max: 100 };
        updateWrapper();
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toBe(100);
      });

      it('clamps a later out-of-bounds modelValue prop update', async () => {
        mockProps = { modelValue: 50, min: 0, max: 100 };
        updateWrapper();
        await wrapper.setProps({ modelValue: 500 });
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(100);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(100);
      });

      it('re-clamps the current value when max shrinks below it, without modelValue itself changing', async () => {
        mockProps = { modelValue: 90, min: 0, max: 100 };
        updateWrapper();
        await wrapper.setProps({ max: 50 });
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(50);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(50);
      });

      it('re-clamps the current value when min rises above it, without modelValue itself changing', async () => {
        mockProps = { modelValue: 10, min: 0, max: 100 };
        updateWrapper();
        await wrapper.setProps({ min: 30 });
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(30);
      });

      it('truncates a modelValue array longer than 2 to the first two entries instead of rendering extra thumbs', () => {
        mockProps = { modelValue: [10, 50, 90] };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs).toHaveLength(2);
        expect(Number(thumbInputs[0].element.value)).toBe(10);
        expect(Number(thumbInputs[1].element.value)).toBe(50);
      });

      it('degrades a single-entry modelValue array to that one clamped value rather than an unmanaged partial thumb', () => {
        mockProps = { modelValue: [150], min: 0, max: 100 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs).toHaveLength(1);
        expect(Number(thumbInputs[0].element.value)).toBe(100);
      });
    });
  });

  describe('step edge cases', () => {
    it('does not produce NaN when step is 0 — falls back to the clamped raw value', async () => {
      mockProps = { modelValue: 50, min: 0, max: 100, step: 0 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      thumbInputs[0].element.value = '73';
      await thumbInputs[0].trigger('input');
      expect(wrapper.emitted('update:modelValue')?.at(-1)[0]).toBe(73);
    });

    it('does not produce NaN when step is negative — falls back to the clamped raw value', async () => {
      mockProps = { modelValue: 50, min: 0, max: 100, step: -5 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      thumbInputs[0].element.value = '40';
      await thumbInputs[0].trigger('input');
      expect(wrapper.emitted('update:modelValue')?.at(-1)[0]).toBe(40);
    });
  });

  describe('Controlled values stay on the native step grid', () => {
    it('snaps a controlled modelValue that does not land on the step grid, correcting the parent', () => {
      // The HTML range-state algorithm silently rounds any value assigned to
      // a step mismatch relative to the native input's own min — without
      // snapping this on mount, Vue's internal state (visual thumb, readout,
      // aria-valuetext, emitted modelValue) would say 42 while the browser's
      // own .value, implicit aria-valuenow, and form data would say 50.
      mockProps = { modelValue: 42, min: 0, max: 100, step: 25 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].element.value).toBe('50');
      expect(wrapper.emitted('update:modelValue')?.at(-1)[0]).toBe(50);
    });

    it('sets step="any" on a thumb whose value is off-grid from an active magnetic snap point', async () => {
      // snapPoints is documented to intentionally allow off-grid values
      // ("unlike step, this doesn't restrict which values are selectable")
      // — the real `step` attribute would otherwise let the browser silently
      // round that intentional value away the moment it's applied.
      mockProps = { modelValue: 50, min: 0, max: 100, step: 25, snapPoints: [42], snapThreshold: 1000 };
      updateWrapper();
      const control = wrapper.find('[data-qa="dt-slider-control"]');
      control.element.setPointerCapture = () => {};
      control.element.getBoundingClientRect = () => (
        { left: 0, top: 0, right: 100, bottom: 20, width: 100, height: 20 }
      );
      await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 42, buttons: 1 });
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].element.value).toBe('42');
      expect(thumbInputs[0].attributes('step')).toBe('any');
    });

    it('uses the real step attribute for an on-grid value (the common case)', () => {
      mockProps = { modelValue: 50, min: 0, max: 100, step: 25 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('step')).toBe('25');
    });

    it('uses step="any" for any thumb when step itself is non-positive', () => {
      mockProps = { modelValue: 50, min: 0, max: 100, step: 0 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('step')).toBe('any');
    });
  });

  describe('Range: dependent per-thumb native bounds', () => {
    it('enforces minStepsBetweenValues on a controlled modelValue at mount, not just during interaction', () => {
      mockProps = { modelValue: [40, 60], min: 0, max: 100, step: 1, minStepsBetweenValues: 30 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      const [lo, hi] = [Number(thumbInputs[0].element.value), Number(thumbInputs[1].element.value)];
      expect(hi - lo).toBeGreaterThanOrEqual(30);
      expect(wrapper.emitted('update:modelValue')?.at(-1)[0]).toEqual([lo, hi]);
    });

    it('re-enforces the gap reactively when minStepsBetweenValues changes after mount', async () => {
      mockProps = { modelValue: [40, 60], min: 0, max: 100, step: 1 };
      updateWrapper();
      await wrapper.setProps({ minStepsBetweenValues: 30 });
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      const [lo, hi] = [Number(thumbInputs[0].element.value), Number(thumbInputs[1].element.value)];
      expect(hi - lo).toBeGreaterThanOrEqual(30);
    });

    it('binds each thumb\'s native min/max to the sibling-dependent range, not the full [min, max]', () => {
      // WAI-ARIA's multi-thumb slider pattern requires each thumb's
      // aria-valuemin/aria-valuemax (native min/max on a range input) to
      // reflect the OTHER thumb's current position, not the full domain.
      mockProps = { modelValue: [40, 60], min: 0, max: 100, step: 1, minStepsBetweenValues: 5 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('min')).toBe('0');
      expect(thumbInputs[0].attributes('max')).toBe('55'); // 60 - gap(5)
      expect(thumbInputs[1].attributes('min')).toBe('45'); // 40 + gap(5)
      expect(thumbInputs[1].attributes('max')).toBe('100');
    });

    it('single-thumb mode is unaffected — each thumb still uses the full [min, max]', () => {
      mockProps = { modelValue: 50, min: 0, max: 100 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('min')).toBe('0');
      expect(thumbInputs[0].attributes('max')).toBe('100');
    });
  });

  describe('largeStep always moves when step is coarser than largeStep', () => {
    it('moves by a full step instead of no-op-ing when step > 2 * largeStep', async () => {
      // Rounding largeStep's raw sum to the NEAREST step-grid point could
      // round backward to the starting value (e.g. step=25, largeStep=10:
      // 100 + 10 = 110 rounds back to 100) — a silent no-op on a documented
      // keyboard operation. This is exactly the shipped playback/zoom demo
      // configuration (step=25, largeStep left at its default of 10).
      mockProps = { modelValue: 100, min: 0, max: 200, step: 25 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue').at(-1)[0]).toBe(125);
    });

    it('still moves by exactly one step when even one step would overshoot largeStep by a lot', async () => {
      mockProps = { modelValue: 100, min: 0, max: 105, step: 25, largeStep: 1 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      await thumbInputs[0].trigger('keydown', { key: 'PageDown' });
      expect(wrapper.emitted('update:modelValue').at(-1)[0]).toBe(75);
    });

    it('keeps exact backward-compatible behavior for the common case (step=1, default largeStep=10)', async () => {
      mockProps = { modelValue: 50 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
      expect(wrapper.emitted('update:modelValue').at(-1)[0]).toBe(60);
    });
  });

  describe('Fractional step precision', () => {
    describe('Decimal modelValue rendering', () => {
      it('renders a fractional modelValue on the native input', () => {
        mockProps = { modelValue: 3.141, min: 0, max: 10, step: 0.001 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].element.value).toBe('3.141');
      });

      it('renders a fractional min on the native input attribute', () => {
        mockProps = { modelValue: 1.5, min: 0.5, max: 2.5, step: 0.25 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].attributes('min')).toBe('0.5');
      });

      it('renders a fractional max on the native input attribute', () => {
        mockProps = { modelValue: 1.5, min: 0.5, max: 2.5, step: 0.25 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].attributes('max')).toBe('2.5');
      });

      it('renders a fractional step on the native input attribute', () => {
        mockProps = { modelValue: 0.5, min: 0, max: 1, step: 0.1 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].attributes('step')).toBe('0.1');
      });
    });

    describe('Snap precision (no IEEE 754 drift)', () => {
      it('emits exact value for step=0.1 — avoids 3×0.1 = 0.30000000000000004', async () => {
        mockProps = { modelValue: 0, min: 0, max: 1, step: 0.1 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '0.3';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(0.3);
      });

      it('emits exact value for step=0.001 — avoids 3141×0.001 = 3.1410000000000004', async () => {
        mockProps = { modelValue: 0, min: 0, max: 10, step: 0.001 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '3.141';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(3.141);
      });

      it('emits exact value for step=0.05', async () => {
        mockProps = { modelValue: 0, min: 0, max: 1, step: 0.05 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '0.15';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(0.15);
      });

      it('emits exact value for step=0.25 with non-zero min', async () => {
        mockProps = { modelValue: 0.25, min: 0.25, max: 2.0, step: 0.25 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '1.25';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(1.25);
      });

      it('emits exact integer for integer step (no regression)', async () => {
        mockProps = { modelValue: 0, min: 0, max: 100, step: 1 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '73';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(73);
      });

      it('clamps to max without drift for fractional step', async () => {
        mockProps = { modelValue: 0, min: 0, max: 1, step: 0.1 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '1.5';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(1);
      });

      it('clamps to min without drift for fractional step', async () => {
        mockProps = { modelValue: 0.5, min: 0, max: 1, step: 0.1 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '-0.5';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(0);
      });
    });

    describe('Tick generation with fractional interval', () => {
      it('generates 5 ticks for tickInterval=0.25 over 0–1', () => {
        mockProps = { showTicks: true, tickInterval: 0.25, min: 0, max: 1, step: 0.25 };
        updateWrapper();
        expect(wrapper.findAll('[data-qa="dt-slider-tick"]')).toHaveLength(5);
      });

      it('generates 11 ticks for tickInterval=0.1 over 0–1', () => {
        mockProps = { showTicks: true, tickInterval: 0.1, min: 0, max: 1, step: 0.1 };
        updateWrapper();
        expect(wrapper.findAll('[data-qa="dt-slider-tick"]')).toHaveLength(11);
      });

      it('generates 5 ticks for tickInterval=2.5 over 0–10', () => {
        mockProps = { showTicks: true, tickInterval: 2.5, min: 0, max: 10, step: 2.5 };
        updateWrapper();
        expect(wrapper.findAll('[data-qa="dt-slider-tick"]')).toHaveLength(5);
      });

      it('generates exactly 11 ticks for step=0.1 over 0–1 — no extra tick from loop drift', () => {
        mockProps = { showTicks: true, step: 0.1, min: 0, max: 1 };
        updateWrapper();
        expect(wrapper.findAll('[data-qa="dt-slider-tick"]')).toHaveLength(11);
      });
    });

    describe('Marks default', () => {
      it('renders start and end marks by default', async () => {
        await nextTick();
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marks).toHaveLength(2);
        expect(marks[0].text()).toBe(String(baseProps.min ?? 0));
        expect(marks[1].text()).toBe(String(baseProps.max ?? 100));
      });

      it('renders no marks when marks is explicitly false', async () => {
        mockProps = { marks: false };
        updateWrapper();
        await nextTick();
        expect(wrapper.findAll('[data-qa="dt-slider-mark"]')).toHaveLength(0);
      });

      it('applies suffix to default and bare-number marks, but not explicit text', async () => {
        mockProps = { suffix: '%', marks: [25, { value: 75, text: 'Cap' }] };
        updateWrapper();
        await nextTick();
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marks[0].text()).toBe('25%');
        expect(marks[1].text()).toBe('Cap');
      });

      it('ignores getValueText for a bare-number mark and falls back to suffix — a mark has no thumb index for getValueText to differentiate on', async () => {
        mockProps = { suffix: '%', getValueText: (v, i) => i === 0 ? `${v} low` : `${v} high`, marks: [25] };
        updateWrapper();
        await nextTick();
        expect(wrapper.find('[data-qa="dt-slider-mark"]').text()).toBe('25%');
      });

      it('ignores getValueText for the default min/max marks too', async () => {
        mockProps = { suffix: '%', getValueText: (v, i) => i === 0 ? `Minimum: ${v}` : `Maximum: ${v}` };
        updateWrapper();
        await nextTick();
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marks[0].text()).toBe(`${baseProps.min ?? 0}%`);
        expect(marks[1].text()).toBe(`${baseProps.max ?? 100}%`);
      });

      it('still uses an explicit mark text override even when getValueText is set', async () => {
        mockProps = { getValueText: (v) => `${v} units`, marks: [{ value: 25, text: 'Cap' }] };
        updateWrapper();
        await nextTick();
        expect(wrapper.find('[data-qa="dt-slider-mark"]').text()).toBe('Cap');
      });
    });

    describe('Mark / readout collision avoidance', () => {
      // jsdom has no real layout engine — getBoundingClientRect() returns an
      // all-zero rect for every element by default. Marks are still measured
      // directly (their position doesn't animate, so no analytical treatment
      // needed), but the readout's position is now computed analytically from
      // pct + the control's own rect (see analyticalReadoutRect in Slider.vue),
      // so the control needs a stub too — the readout's stubbed rect only
      // contributes its width to that calculation.
      const controlRect = { top: 0, left: 0, right: 300, bottom: 20 };
      const readoutSize = { top: 0, left: 0, right: 20, bottom: 20 }; // 20px wide
      const nearReadoutRect = { top: 0, left: 150, right: 170, bottom: 20 }; // overlaps a readout at pct 51
      const farRect = { top: 0, left: 500, right: 520, bottom: 20 };

      afterEach(() => {
        mockControlDirectionSpy?.mockRestore();
      });

      it('hides a mark once it overlaps the visible readout', async () => {
        mockProps = { readout: 'always', marks: [0, 100], modelValue: 50 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        marks[0].element.getBoundingClientRect = () => nearReadoutRect;
        marks[1].element.getBoundingClientRect = () => farRect;
        readouts[0].element.getBoundingClientRect = () => readoutSize;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const marksAfter = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksAfter[0].classes()).toContain('d-slider__mark--collision-hidden');
        expect(marksAfter[1].classes()).not.toContain('d-slider__mark--collision-hidden');
      });

      it('keeps a mark visible when it does not overlap the readout', async () => {
        mockProps = { readout: 'always', marks: [0, 100], modelValue: 50 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        marks[0].element.getBoundingClientRect = () => farRect;
        marks[1].element.getBoundingClientRect = () => farRect;
        readouts[0].element.getBoundingClientRect = () => readoutSize;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const marksAfter = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksAfter[0].classes()).not.toContain('d-slider__mark--collision-hidden');
        expect(marksAfter[1].classes()).not.toContain('d-slider__mark--collision-hidden');
      });

      it('never hides a mark for a readout that is not currently shown', async () => {
        mockProps = { readout: 'interaction', marks: [0, 100], modelValue: 50 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        marks[0].element.getBoundingClientRect = () => nearReadoutRect;
        readouts[0].element.getBoundingClientRect = () => readoutSize;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const marksAfter = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksAfter[0].classes()).not.toContain('d-slider__mark--collision-hidden');
      });

      it('re-checks collisions when getValueText changes the readout text, even though the value itself did not change', async () => {
        mockProps = { readout: 'always', marks: [0, 100], modelValue: 50, getValueText: (v) => `${v}` };
        updateWrapper();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        marks[0].element.getBoundingClientRect = () => farRect;
        marks[1].element.getBoundingClientRect = () => farRect;
        readouts[0].element.getBoundingClientRect = () => readoutSize;
        // Let the mount-triggered check settle FIRST, on a non-colliding
        // baseline — otherwise that initial check (not the getValueText
        // change below) could be the one that picks up an already-stubbed
        // colliding rect, making this test pass for the wrong reason.
        await settleCollisions();
        let marksNow = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksNow[0].classes()).not.toContain('d-slider__mark--collision-hidden');

        // Now make the mark's rect overlap the readout's, but touch nothing
        // except getValueText — modelValue is untouched, so internalValues
        // never changes; only the collision watcher's getValueText
        // dependency can be what triggers a recheck from here.
        marks[0].element.getBoundingClientRect = () => nearReadoutRect;
        await wrapper.setProps({ getValueText: (v) => `Volume: ${v}` });
        await settleCollisions();

        marksNow = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksNow[0].classes()).toContain('d-slider__mark--collision-hidden');
        expect(marksNow[1].classes()).not.toContain('d-slider__mark--collision-hidden');
      });

      it('detects a readout/mark collision correctly under rtl, where pct mirrors to the physical right', async () => {
        // analyticalReadoutRect computes the readout's collision rect from
        // pct + the control's own rect — under RTL that pct is measured
        // from the physical right (insetInlineStart mirrors), so the
        // calculation has to mirror too, or it places the readout on the
        // wrong side entirely and the system ends up hiding the wrong mark
        // (or missing/inventing a collision) rather than the one that's
        // actually overlapping on screen.
        mockProps = { readout: 'always', marks: [0, 100], modelValue: 50 };
        updateWrapper();
        await nextTick();

        mockControlDirection('rtl');
        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        readouts[0].element.getBoundingClientRect = () => readoutSize;

        // At modelValue 90 under RTL, the readout's correctly-mirrored
        // analytical center sits near the physical LEFT (effective pct
        // 100-90=10 -> ~30px on this 300px-wide control), not near the
        // physical right (~270px) an un-mirrored calculation would place
        // it. Stub a mark's rect exactly where the mirrored readout should
        // land, and the far mark well outside either candidate position.
        const nearMirroredReadoutRect = { top: 0, left: 20, right: 40, bottom: 20 };
        marks[0].element.getBoundingClientRect = () => nearMirroredReadoutRect;
        marks[1].element.getBoundingClientRect = () => farRect;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '90';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const marksAfter = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksAfter[0].classes()).toContain('d-slider__mark--collision-hidden');
        expect(marksAfter[1].classes()).not.toContain('d-slider__mark--collision-hidden');
      });
    });

    describe('Range readout collision merge', () => {
      // Position is now computed analytically from pct + the control's rect
      // (not read off the readout element directly — see analyticalReadoutRect
      // in Slider.vue), so the control needs a stub too; the readout's own
      // stubbed rect only contributes its width to the calculation.
      const controlRect = { top: 0, left: 0, right: 300, bottom: 20 };
      const readoutSize = { top: 0, left: 0, right: 20, bottom: 20 }; // 20px wide

      it('merges both readouts into a single centered pill once they overlap', async () => {
        mockProps = { readout: 'always', modelValue: [40, 60], min: 0, max: 100 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        let readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        readouts[0].element.getBoundingClientRect = () => readoutSize;
        readouts[1].element.getBoundingClientRect = () => readoutSize;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        // 55 vs 60: 5% apart on a 300px control (15px), well inside the
        // combined 20px of half-widths (10px each) — genuinely overlaps.
        thumbInputs[0].element.value = '55';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        expect(readouts[0].classes()).toContain('d-slider__readout--hide');
        expect(readouts[1].classes()).toContain('d-slider__readout--hide');

        const merged = wrapper.find('[data-qa="dt-slider-thumb-readout-merged"]');
        expect(merged.exists()).toBe(true);
        expect(merged.text()).toBe('55–60');
      });

      it('keeps both readouts separate when they do not overlap', async () => {
        mockProps = { readout: 'always', modelValue: [20, 80], min: 0, max: 100 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        readouts[0].element.getBoundingClientRect = () => readoutSize;
        readouts[1].element.getBoundingClientRect = () => readoutSize;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        // 21 vs 80: nowhere close on a 300px control.
        thumbInputs[0].element.value = '21';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const readoutsAfter = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        expect(readoutsAfter[0].classes()).toContain('d-slider__readout--show');
        expect(readoutsAfter[1].classes()).toContain('d-slider__readout--show');
        expect(wrapper.find('[data-qa="dt-slider-thumb-readout-merged"]').exists()).toBe(false);
      });

      it('does not merge outside range mode', async () => {
        mockProps = { readout: 'always', modelValue: 50, min: 0, max: 100 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const readout = wrapper.find('[data-qa="dt-slider-thumb-readout"]');
        readout.element.getBoundingClientRect = () => readoutSize;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        expect(wrapper.find('[data-qa="dt-slider-thumb-readout-merged"]').exists()).toBe(false);
      });
    });

    describe('Marks with fractional positions', () => {
      it('renders the correct number of marks for a fractional marks array', () => {
        mockProps = { marks: [0.25, 0.5, 0.75], min: 0, max: 1, step: 0.25 };
        updateWrapper();
        expect(wrapper.findAll('[data-qa="dt-slider-mark"]')).toHaveLength(3);
      });

      it('renders mark text for a fractional number entry', () => {
        mockProps = { marks: [0.5], min: 0, max: 1, step: 0.1 };
        updateWrapper();
        const mark = wrapper.find('[data-qa="dt-slider-mark"]');
        expect(mark.text()).toBe('0.5');
      });

      it('renders mark text from an object entry at a fractional position', () => {
        mockProps = { marks: [{ value: 0.5, text: 'Halfway' }], min: 0, max: 1, step: 0.1 };
        updateWrapper();
        expect(wrapper.find('[data-qa="dt-slider-mark"]').text()).toBe('Halfway');
      });

      it('renders marks:true following fractional tick positions', () => {
        mockProps = { marks: true, step: 0.25, min: 0, max: 1 };
        updateWrapper();
        expect(wrapper.findAll('[data-qa="dt-slider-mark"]')).toHaveLength(5);
      });
    });

    describe('Range mode with fractional step', () => {
      beforeEach(() => {
        mockProps = { modelValue: [0.2, 0.8], min: 0, max: 1, step: 0.1 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      });

      it('renders the lower bound on the first input', () => {
        expect(thumbInputs[0].element.value).toBe('0.2');
      });

      it('renders the upper bound on the second input', () => {
        expect(thumbInputs[1].element.value).toBe('0.8');
      });

      it('emits exact fractional values for range mode update', async () => {
        thumbInputs[0].element.value = '0.3';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0][0]).toBe(0.3);
      });

      it('enforces minStepsBetweenValues gap with fractional step', async () => {
        mockProps = { modelValue: [1.0, 3.0], min: 0, max: 10, step: 0.5, minStepsBetweenValues: 2 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        // gap = 2 × 0.5 = 1.0; lower thumb max = 3.0 − 1.0 = 2.0
        thumbInputs[0].element.value = '2.5';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0][0]).toBe(2);
      });

      it('rounds out IEEE-754 drift in the minStepsBetweenValues gap (3 * 0.1 !== 0.3 in raw JS)', async () => {
        mockProps = { modelValue: [0.3, 0.9], min: 0, max: 1, step: 0.1, minStepsBetweenValues: 3 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        // High thumb (index 1) nudged toward the low thumb: gap = 3 * 0.1, which is
        // 0.30000000000000004 in raw JS float math — the emitted value must be the
        // clean 0.6, not that literal.
        thumbInputs[1].element.value = '0.31';
        await thumbInputs[1].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0][1]).toBe(0.6);
      });
    });

    describe('PageUp / PageDown with fractional largeStep', () => {
      beforeEach(() => {
        mockProps = { modelValue: 0.5, min: 0, max: 10, step: 0.1, largeStep: 0.5 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      });

      it('increases value by fractional largeStep on PageUp', async () => {
        await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(1);
      });

      it('decreases value by fractional largeStep on PageDown', async () => {
        await thumbInputs[0].trigger('keydown', { key: 'PageDown' });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(0);
      });
    });
  });

  describe('fillOrigin', () => {
    describe('When fillOrigin is set and value equals fillOrigin', () => {
      beforeEach(() => {
        mockProps = { modelValue: 50, fillOrigin: 50 };
        updateWrapper();
      });

      it('renders the indicator with zero width', () => {
        expect(indicator.attributes('style')).toContain('width: 0%');
      });
    });

    describe('When value is above fillOrigin', () => {
      beforeEach(() => {
        mockProps = { modelValue: 75, fillOrigin: 50, min: 0, max: 100 };
        updateWrapper();
      });

      it('fills from the origin toward the thumb', () => {
        const style = indicator.attributes('style');
        expect(style).toContain('inset-inline-start: 50%');
        expect(style).toContain('width: 25%');
      });
    });

    describe('When value is below fillOrigin', () => {
      beforeEach(() => {
        mockProps = { modelValue: 25, fillOrigin: 50, min: 0, max: 100 };
        updateWrapper();
      });

      it('fills from the thumb back toward the origin', () => {
        const style = indicator.attributes('style');
        expect(style).toContain('inset-inline-start: 25%');
        expect(style).toContain('width: 25%');
      });
    });

    describe('When fillOrigin is outside [min, max]', () => {
      it('clamps fillOrigin above max to max', () => {
        mockProps = { modelValue: 60, fillOrigin: 150, min: 0, max: 100 };
        updateWrapper();
        const style = indicator.attributes('style');
        expect(style).toContain('inset-inline-start: 60%');
        expect(style).toContain('width: 40%');
      });

      it('clamps fillOrigin below min to min', () => {
        mockProps = { modelValue: 40, fillOrigin: -50, min: 0, max: 100 };
        updateWrapper();
        const style = indicator.attributes('style');
        expect(style).toContain('inset-inline-start: 0%');
        expect(style).toContain('width: 40%');
      });
    });

    describe('When fillOrigin is set in range mode', () => {
      beforeEach(() => {
        mockProps = { modelValue: [20, 80], fillOrigin: 50, min: 0, max: 100 };
        updateWrapper();
      });

      it('ignores fillOrigin and fills between the two thumbs', () => {
        const style = indicator.attributes('style');
        expect(style).toContain('inset-inline-start: 20%');
        expect(style).toContain('width: 60%');
      });
    });

    describe('When fillOrigin is set with vertical orientation', () => {
      beforeEach(() => {
        mockProps = { modelValue: 75, fillOrigin: 50, min: 0, max: 100, orientation: 'vertical' };
        updateWrapper();
      });

      it('fills from origin toward thumb along the block axis', () => {
        const style = indicator.attributes('style');
        expect(style).toContain('bottom: 50%');
        expect(style).toContain('height: 25%');
      });
    });
  });
});
