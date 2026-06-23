import DtcOptionBarMemberGroup from './option_bar_member_group.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { getSupportedComponents } from '@/src/lib/test/utils_test';
import variantsFilterPill from '@/src/variants/variants_filter_pill';

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

  describe('Clearable controls', function () {
    it('Should mark members with concrete component defaults as not clearable', function () {
      wrapper = mount(DtcOptionBarMemberGroup, {
        props: {
          component: testComponents[0],
          members: [{
            name: 'role',
            label: 'role',
            defaultValue: 'status',
          }],
          values: {
            role: 'status',
          },
          controlSelector: () => [['selection'], 'selection'],
        },
      });

      expect(wrapper.findComponent({ name: 'DtcOptionBarControl' }).props('args').clearable).toBe(false);
    });

    it('Should mark members without concrete component defaults as clearable', function () {
      wrapper = mount(DtcOptionBarMemberGroup, {
        props: {
          component: testComponents[0],
          members: [{
            name: 'headerText',
            label: 'header-text',
          }],
          values: {
            headerText: 'Base title',
          },
          controlSelector: () => [['string'], 'string'],
        },
      });

      expect(wrapper.findComponent({ name: 'DtcOptionBarControl' }).props('args').clearable).toBe(true);
    });

    it('Should mark members with empty string defaults as clearable', function () {
      wrapper = mount(DtcOptionBarMemberGroup, {
        props: {
          component: testComponents[0],
          members: [{
            name: 'text',
            label: 'text',
            defaultValue: '',
          }],
          values: {
            text: 'Badge',
          },
          controlSelector: () => [['string'], 'string'],
        },
      });

      expect(wrapper.findComponent({ name: 'DtcOptionBarControl' }).props('args').clearable).toBe(true);
    });
  });

  describe('Exclusion rules', function () {
    it('Should keep members with matching hide rules visible but disabled', function () {
      wrapper = mount(DtcOptionBarMemberGroup, {
        props: {
          component: testComponents[0],
          members: [
            { name: 'kind', label: 'kind' },
            { name: 'size', label: 'size' },
          ],
          values: {
            kind: 'count',
            size: '200',
          },
          controlSelector: () => [['base'], 'base'],
          exclusionRules: [
            { when: { kind: 'count' }, hide: { props: ['size'] } },
          ],
          propValues: {
            kind: 'count',
            size: '200',
          },
        },
      });

      const controls = wrapper.findAllComponents({ name: 'DtcOptionBarControl' });
      const sizeControl = controls.find(control => control.props('label') === 'size');
      expect(controls).toHaveLength(2);
      expect(sizeControl.props('disabled')).toBe(true);
    });

    it('Should disable members with matching disable rules', function () {
      wrapper = mount(DtcOptionBarMemberGroup, {
        props: {
          component: testComponents[0],
          members: [
            { name: 'kind', label: 'kind' },
            { name: 'size', label: 'size' },
          ],
          values: {
            kind: 'count',
            size: '200',
          },
          controlSelector: () => [['base'], 'base'],
          exclusionRules: [
            { when: { kind: 'count' }, disable: { props: ['size'] } },
          ],
          propValues: {
            kind: 'count',
            size: '200',
          },
        },
      });

      const controls = wrapper.findAllComponents({ name: 'DtcOptionBarControl' });
      const sizeControl = controls.find(control => control.props('label') === 'size');
      expect(controls).toHaveLength(2);
      expect(sizeControl.props('disabled')).toBe(true);
    });

    it('Should keep FilterPill popover class controls enabled when useDropdown is true', function () {
      const members = [
        { name: 'useDropdown', label: 'use-dropdown', types: ['boolean'] },
        {
          name: 'dropdownListClass',
          label: 'dropdown-list-class',
          description: 'Only applies when useDropdown is true.',
        },
        {
          name: 'popoverContentClass',
          label: 'popover-content-class',
          description: 'Only applies when useDropdown is false.',
        },
        {
          name: 'popoverDialogClass',
          label: 'popover-dialog-class',
          description: 'Only applies when useDropdown is false.',
        },
        {
          name: 'popoverFooterClass',
          label: 'popover-footer-class',
          description: 'Only applies when useDropdown is false.',
        },
        {
          name: 'popoverHeaderClass',
          label: 'popover-header-class',
          description: 'Only applies when useDropdown is false.',
        },
      ];
      const values = {
        useDropdown: true,
        dropdownListClass: '',
        popoverContentClass: '',
        popoverDialogClass: '',
        popoverFooterClass: '',
        popoverHeaderClass: '',
      };

      wrapper = mount(DtcOptionBarMemberGroup, {
        props: {
          component: testComponents[0],
          members,
          values,
          controlSelector: () => [['base'], 'base'],
          exclusionRules: variantsFilterPill.exclusions,
          propValues: values,
        },
      });

      const controls = wrapper.findAllComponents({ name: 'DtcOptionBarControl' });
      const getControl = label => controls.find(control => control.props('label') === label);

      expect(getControl('dropdown-list-class').props('disabled')).toBe(false);
      expect(getControl('popover-content-class').props('disabled')).toBe(false);
      expect(getControl('popover-dialog-class').props('disabled')).toBe(false);
      expect(getControl('popover-footer-class').props('disabled')).toBe(false);
      expect(getControl('popover-header-class').props('disabled')).toBe(false);
    });
  });
});
