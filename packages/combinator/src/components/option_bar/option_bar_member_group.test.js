import DtcOptionBarMemberGroup from './option_bar_member_group';

import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import { getSupportedComponents } from '@/src/lib/test/utils_test';

const controlWrapperSelector = '[data-qa=dtc-option-bar-member-group-control]';

const stringMemberKey = 'stringMember';
const numberMemberKey = 'numberMember';
const booleanMemberKey = 'booleanMember';

function createTestMember (key) {
  return {
    name: key,
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
    before(function () {
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
        assert.exists(wrapper);
      });

      it('Should render a control for each member', function () {
        assert.equal(Object.keys(testMembers).length, controlWrappers.length);
      });
    });
  });
});
