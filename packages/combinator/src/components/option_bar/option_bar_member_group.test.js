import DtcOptionBarMemberGroup from './option_bar_member_group.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { getSupportedComponents } from '@/src/lib/test/utils_test';
describe('option_bar_member_group.vue test', function () {
  let wrapper;

  const testComponents = getSupportedComponents();

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

  describe('Control ordering', function () {
    it('Should render class props after non-class props', function () {
      wrapper = mount(DtcOptionBarMemberGroup, {
        props: {
          component: testComponents[0],
          members: [
            { name: 'kind', label: 'kind' },
            { name: 'labelClass', label: 'label-class' },
            { name: 'startIconClass', label: 'start-icon-class' },
            { name: 'outlined', label: 'outlined', types: ['boolean'] },
            { name: 'text', label: 'text' },
            { name: 'scrollbar', label: 'scrollbar' },
            {
              name: 'scrollbarContentClass',
              label: 'scrollbar-content-class',
              description: 'Only applies when scrollbar prop is set.',
            },
          ],
          values: {},
          controlSelector: () => [['base'], 'base'],
        },
      });

      const labels = wrapper.findAllComponents({ name: 'DtcOptionBarControl' })
        .map(control => control.props('label'));

      expect(labels.indexOf('label-class')).toBeGreaterThan(labels.indexOf('text'));
      expect(labels.indexOf('start-icon-class')).toBeGreaterThan(labels.indexOf('text'));
      expect(labels.indexOf('scrollbar-content-class')).toBeGreaterThan(labels.indexOf('text'));
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

    it('Should not clear members during initial render', function () {
      wrapper = mount(DtcOptionBarMemberGroup, {
        props: {
          component: testComponents[0],
          members: [
            { name: 'kind', label: 'kind' },
            { name: 'borderColor', label: 'border-color', defaultValue: 'default' },
          ],
          values: {
            kind: 'default',
            borderColor: 'default',
          },
          controlSelector: () => [['base'], 'base'],
          exclusionRules: [
            { when: { kind: 'default' }, clear: { props: ['borderColor'] } },
          ],
          propValues: {
            kind: 'default',
            borderColor: 'default',
          },
        },
      });

      expect(wrapper.emitted('update:member')).toBeUndefined();
    });

    it('Should clear members when matching clear rules become active after mount', async function () {
      wrapper = mount(DtcOptionBarMemberGroup, {
        props: {
          component: testComponents[0],
          members: [
            { name: 'kind', label: 'kind' },
            { name: 'borderColor', label: 'border-color', defaultValue: 'default' },
          ],
          values: {
            kind: 'subtle',
            borderColor: 'default',
          },
          controlSelector: () => [['base'], 'base'],
          exclusionRules: [
            { when: { kind: 'default' }, clear: { props: ['borderColor'] } },
          ],
          propValues: {
            kind: 'subtle',
            borderColor: 'default',
          },
        },
      });

      await wrapper.setProps({
        propValues: {
          kind: 'default',
          borderColor: 'default',
        },
      });

      expect(wrapper.emitted('update:member')).toEqual([[{
        member: 'borderColor',
        value: null,
      }]]);
    });
  });
});
