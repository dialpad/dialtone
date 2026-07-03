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
});
