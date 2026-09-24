import DtcOptionBarControl from './option_bar_control.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { controlMap } from '@/src/lib/control';

const labelSelector = '[data-qa=dtc-option-bar-control-label]';

const testControls = Object.keys(controlMap);

describe('option_bar_control.vue test', function () {
  let wrapper;

  testControls.forEach((control) => {
    const testLabel = `${control} label`;
    const testDescription = `${control} description`;

    describe(`When mounted with control '${control}'`, function () {
      beforeAll(function () {
        const member = {
          validControls: [control],
          label: testLabel,
          description: testDescription,
          values: ['test1', 'test2'],
        };
        member.controlData = controlMap[control];
        member.value = member.controlData.default(member);
        wrapper = mount(DtcOptionBarControl, {
          props: member,
        });
      });

      it('Should display label text', function () {
        expect(wrapper.find(labelSelector).text()).toBe(testLabel.replaceAll('-', ' '));
      });
    });
  });

  it('Should pass the formatted label to the fallback string control', function () {
    wrapper = mount(DtcOptionBarControl, {
      props: {
        controlData: controlMap.base,
        validControls: ['base'],
        value: 'fallback value',
        label: 'fallback-label',
      },
      global: {
        stubs: {
          DtcControlString: {
            name: 'DtcControlString',
            props: {
              label: {
                type: String,
                default: '',
              },
              value: {
                type: String,
                default: '',
              },
            },
            template: '<div />',
          },
        },
      },
    });

    expect(wrapper.findComponent({ name: 'DtcControlString' }).props('label')).toBe('fallback label');
  });

  describe('RAW JSON toggle', function () {
    const textareaSelector = 'textarea[data-qa=dt-input-input]';

    // Simulates a member like Slider's modelValue: Number | Number[] — the
    // active control is scalar (number), but validControls also lists
    // 'array' so a consumer can switch representations via raw JSON.
    const numberOrArrayMember = {
      controlData: controlMap.number,
      validControls: ['number', 'array'],
      label: 'range',
      description: 'range description',
      value: 50,
    };

    // Scalar controls (e.g. DtcControlNumber's clearable shell) render their
    // own <button> too, so a bare `find('button')` can pick up the wrong
    // one — filter by the RAW toggle's own text instead.
    function findRawButton (w) {
      return w.findAll('button').find((b) => b.text().trim() === 'RAW');
    }

    it('shows the RAW toggle when validControls includes array, even though the active control is scalar', function () {
      wrapper = mount(DtcOptionBarControl, { props: numberOrArrayMember });
      expect(findRawButton(wrapper)).toBeTruthy();
    });

    it('hides the RAW toggle when validControls has neither array nor object and the control is scalar', function () {
      wrapper = mount(DtcOptionBarControl, {
        props: { ...numberOrArrayMember, validControls: ['number'] },
      });
      expect(findRawButton(wrapper)).toBeUndefined();
    });

    it('hides the RAW toggle for a string|array|object union (e.g. any *Class prop)', function () {
      // Every *Class prop across the library (labelClass, iconClass, etc.) is
      // typed [String, Array, Object] — validControls always includes
      // 'string' for these. Without excluding 'string', the toggle would
      // show up on virtually every class-override control, not just
      // genuinely array/object-shaped props like Slider's modelValue.
      wrapper = mount(DtcOptionBarControl, {
        props: { ...numberOrArrayMember, validControls: ['string', 'array', 'object'], value: '' },
      });
      expect(findRawButton(wrapper)).toBeUndefined();
    });

    it('shows the RAW toggle for an array control component regardless of validControls', function () {
      wrapper = mount(DtcOptionBarControl, {
        props: {
          controlData: controlMap.array,
          validControls: ['array'],
          label: 'list',
          value: [1, 2, 3],
        },
      });
      expect(findRawButton(wrapper)).toBeTruthy();
    });

    it('enters raw mode and seeds the textarea with the JSON5-serialized current value', async function () {
      wrapper = mount(DtcOptionBarControl, { props: numberOrArrayMember });
      await findRawButton(wrapper).trigger('click');
      const textarea = wrapper.find(textareaSelector);
      expect(textarea.exists()).toBe(true);
      expect(textarea.element.value).toBe('50');
    });

    it('emits the parsed value as the user edits valid JSON5, switching a scalar to an array', async function () {
      wrapper = mount(DtcOptionBarControl, { props: numberOrArrayMember });
      await findRawButton(wrapper).trigger('click');
      await wrapper.find(textareaSelector).setValue('[20, 70]');
      const emitted = wrapper.emitted('update:value');
      expect(emitted).toBeTruthy();
      expect(emitted[emitted.length - 1][0]).toEqual([20, 70]);
    });

    it('does not emit while the raw text is invalid JSON5', async function () {
      wrapper = mount(DtcOptionBarControl, { props: numberOrArrayMember });
      await findRawButton(wrapper).trigger('click');
      const beforeCount = (wrapper.emitted('update:value') || []).length;
      await wrapper.find(textareaSelector).setValue('[20, 70'); // unclosed bracket
      const after = wrapper.emitted('update:value') || [];
      expect(after.length).toBe(beforeCount);
    });

    it('switches back out of raw mode when toggled again, hiding the textarea', async function () {
      // The RAW button sits under the same dynamic <component :is="rawMode
      // ? 'dt-text' : controlComponent"> that swaps between the scalar
      // control and dt-text, so it's remounted on every toggle — a wrapper
      // reference found before the toggle points at a detached node
      // afterward. Re-find it fresh each time rather than caching it.
      wrapper = mount(DtcOptionBarControl, { props: numberOrArrayMember });
      await findRawButton(wrapper).trigger('click');
      expect(wrapper.find(textareaSelector).exists()).toBe(true);
      await findRawButton(wrapper).trigger('click');
      expect(wrapper.find(textareaSelector).exists()).toBe(false);
    });

    it('re-seeds the textarea from the latest value when re-entering raw mode', async function () {
      wrapper = mount(DtcOptionBarControl, { props: numberOrArrayMember });
      await findRawButton(wrapper).trigger('click');
      await findRawButton(wrapper).trigger('click'); // back to the scalar control
      await wrapper.setProps({ value: 75 });
      await findRawButton(wrapper).trigger('click'); // re-enter raw mode
      expect(wrapper.find(textareaSelector).element.value).toBe('75');
    });
  });
});
