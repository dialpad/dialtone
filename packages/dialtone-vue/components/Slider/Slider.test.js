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
      // a floating tooltip/portal), so it can't desync from its thumb while scrolling
      // — see DLT-1974 investigation notes. It's found via data-qa and shown/hidden
      // via the d-slider__readout--show / --hide modifier classes instead of an
      // `open` component prop.
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

      it('renders the formatted value as the readout content', async () => {
        mockProps = { readout: 'always' };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].text()).toBe('50');
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

    describe('When labelHidden is true', () => {
      beforeEach(() => {
        mockProps = { labelHidden: true };
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
  });

  describe('Accessibility Tests', () => {
    it('thumb input has type range', () => {
      expect(thumbInputs[0].attributes('type')).toBe('range');
    });

    it('thumb input has aria-labelledby pointing to the label', () => {
      const labelId = label.attributes('id');
      expect(thumbInputs[0].attributes('aria-labelledby')).toBe(labelId);
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

      it('adds the keyboard-focus ring class for a real keyboard (Tab) focus', async () => {
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        await thumbInputs[0].trigger('focus');
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--focused');
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

      it('swaps an inverted modelValue pushed in later via prop update', async () => {
        mockProps = { modelValue: [20, 80] };
        updateWrapper();
        await wrapper.setProps({ modelValue: [90, 10] });
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(10);
        expect(Number(thumbInputs[1].element.value)).toBe(90);
      });
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

      it('prefers getValueText over suffix for marks', async () => {
        mockProps = { suffix: '%', getValueText: (v) => `${v} units`, marks: [25] };
        updateWrapper();
        await nextTick();
        expect(wrapper.find('[data-qa="dt-slider-mark"]').text()).toBe('25 units');
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
        expect(style).toContain('left: 50%');
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
        expect(style).toContain('left: 25%');
        expect(style).toContain('width: 25%');
      });
    });

    describe('When fillOrigin is outside [min, max]', () => {
      it('clamps fillOrigin above max to max', () => {
        mockProps = { modelValue: 60, fillOrigin: 150, min: 0, max: 100 };
        updateWrapper();
        const style = indicator.attributes('style');
        expect(style).toContain('left: 60%');
        expect(style).toContain('width: 40%');
      });

      it('clamps fillOrigin below min to min', () => {
        mockProps = { modelValue: 40, fillOrigin: -50, min: 0, max: 100 };
        updateWrapper();
        const style = indicator.attributes('style');
        expect(style).toContain('left: 0%');
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
        expect(style).toContain('left: 20%');
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
