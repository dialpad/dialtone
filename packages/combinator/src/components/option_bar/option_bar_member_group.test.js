import DtcOptionBarMemberGroup from './option_bar_member_group.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { getSupportedComponents } from '@/src/lib/test/utils_test';

const controlWrapperSelector = '[data-qa=dtc-option-bar-member-group-control]';

const stringMemberKey = 'stringMember';
const numberMemberKey = 'numberMember';
const booleanMemberKey = 'booleanMember';

function createTestMember (key) {
  return {
    name: key,
    label: key,
  };
}

const testMembers = [
  createTestMember(stringMemberKey),
  createTestMember(numberMemberKey),
  createTestMember(booleanMemberKey),
];

const testValues = {
  [stringMemberKey]: 'string test',
  [numberMemberKey]: 123,
  [booleanMemberKey]: true,
};

describe('option_bar_member_group.vue test', function () {
  let wrapper;
  let controlWrappers;

  const testComponents = getSupportedComponents();
  testComponents.forEach((component) => {
    beforeAll(function () {
      wrapper = mount(DtcOptionBarMemberGroup, {
        props: {
          component,
          members: testMembers,
          values: testValues,
          controlSelector: () => [['base'], 'base'],
        },
      });
      controlWrappers = wrapper.findAll(controlWrapperSelector);
    });

    describe(`When mounted with component '${component.name}'`, function () {
      it('Should render successfully', function () {
        expect(wrapper).toBeTruthy();
      });

      it('Should render a control for each member', function () {
        expect(Object.keys(testMembers).length).toBe(controlWrappers.length);
      });
    });
  });
});
