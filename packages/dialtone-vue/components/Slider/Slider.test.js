import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import DtSlider from './Slider.vue';
import { DtTooltip } from '@/components/Tooltip';

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
      // DtTooltip's real mounted() hook drives tippy.js, which relies on
      // layout APIs jsdom doesn't implement. Stub it so the open prop is
      // still observable without instantiating the real tooltip engine.
      global: { stubs: { DtTooltip: true } },
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

    describe('Tooltip', () => {
      it('renders no tooltip by default (never)', async () => {
        await nextTick();
        expect(wrapper.findComponent(DtTooltip).exists()).toBe(false);
      });

      it('renders an always-open tooltip when tooltip is "always"', async () => {
        mockProps = { tooltip: 'always' };
        updateWrapper();
        await nextTick();
        const tooltip = wrapper.findComponent(DtTooltip);
        expect(tooltip.exists()).toBe(true);
        expect(tooltip.props('open')).toBe(true);
      });

      it('keeps the tooltip closed at rest when tooltip is "interaction"', async () => {
        mockProps = { tooltip: 'interaction' };
        updateWrapper();
        await nextTick();
        expect(wrapper.findComponent(DtTooltip).props('open')).toBe(false);
      });

      it('opens the tooltip while the thumb is focused when tooltip is "interaction"', async () => {
        mockProps = { tooltip: 'interaction' };
        updateWrapper();
        await nextTick();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        await thumbInputs[0].trigger('focus');
        expect(wrapper.findComponent(DtTooltip).props('open')).toBe(true);
      });

      it('closes the tooltip again once the thumb blurs when tooltip is "interaction"', async () => {
        mockProps = { tooltip: 'interaction' };
        updateWrapper();
        await nextTick();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        await thumbInputs[0].trigger('focus');
        await thumbInputs[0].trigger('blur');
        expect(wrapper.findComponent(DtTooltip).props('open')).toBe(false);
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

    it('applies getAriaValueText result to aria-valuetext', () => {
      mockProps = { getAriaValueText: (v) => `Volume: ${v}%` };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-valuetext')).toBe('Volume: 50%');
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

    describe('Keyboard: PageUp / PageDown', () => {
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
