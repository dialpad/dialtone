import DtcOptionBar from './option_bar.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

const tabSelector = '[data-qa=option-bar-tab]';
const searchButtonSelector = '[data-qa=option-bar-search-button]';
const searchInputSelector = '[data-qa=option-bar-search-input]';

const component = {};

const baseOptions = {
  props: {
    kind: 'label',
    type: 'default',
    labelClass: '',
    startIconClass: '',
  },
  slots: {
    default: '',
  },
};

function mountWrapper ({ props = [], slots = [], attributes = [], options = baseOptions } = {}) {
  return mount(DtcOptionBar, {
    props: {
      component,
      options,
      info: {
        props,
        slots,
        attributes,
        exclusions: [],
      },
    },
    global: {
      directives: {
        'dt-scrollbar': {},
        'dt-tooltip': {},
      },
      stubs: {
        DtcOptionBarMemberGroup: {
          name: 'DtcOptionBarMemberGroup',
          props: [
            'component',
            'controlSelector',
            'members',
            'values',
            'exclusionRules',
            'propValues',
            'slotValues',
            'memberGroup',
          ],
          template: `
            <div
              data-qa="option-bar-member-group"
              :data-member-group="memberGroup"
            >
              <span
                v-for="member in members"
                :key="member.name"
              >
                {{ member.name }}
              </span>
            </div>
          `,
        },
        DtButton: {
          template: '<button data-qa="option-bar-search-button"><slot /><slot name="icon" :icon-size="100" /></button>',
        },
        DtIcon: {
          template: '<span />',
        },
        DtIconSearch: {
          template: '<span />',
        },
        DtInput: {
          props: ['modelValue'],
          emits: ['update:modelValue'],
          template: `
            <div>
              <input
                data-qa="option-bar-search-input"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
              >
              <slot name="startIcon" :icon-size="100" />
              <slot name="endIcon" :clear="() => $emit('update:modelValue', '')" />
            </div>
          `,
        },
        DtStack: {
          template: '<div><slot /></div>',
        },
        DtTab: {
          props: ['id', 'panelId', 'selected'],
          template: `
            <button
              data-qa="option-bar-tab"
              :id="id"
              :data-panel-id="panelId"
              :data-selected="selected ? 'true' : undefined"
            >
              <slot />
            </button>
          `,
        },
        DtTabGroup: {
          props: ['selected'],
          template: `
            <div
              data-qa="option-bar-tab-group"
              :data-selected-panel="selected"
            >
              <slot name="tabs" />
              <slot />
            </div>
          `,
        },
        DtTabPanel: {
          props: ['id', 'tabId'],
          template: `
            <section
              data-qa="option-bar-panel"
              :id="id"
              :data-tab-id="tabId"
            >
              <slot />
            </section>
          `,
        },
      },
    },
  });
}

function getTabs (wrapper) {
  return wrapper.findAll(tabSelector).map(tab => tab.text());
}

function getMemberGroups (wrapper) {
  return wrapper.findAllComponents({ name: 'DtcOptionBarMemberGroup' });
}

function getSelectedPanel (wrapper) {
  return wrapper.find('[data-qa=option-bar-tab-group]').attributes('data-selected-panel');
}

describe('option_bar.vue test', function () {
  it('Should render Props, Slots, and Class tabs in order', function () {
    const wrapper = mountWrapper({
      props: [
        { name: 'kind' },
        { name: 'labelClass' },
        { name: 'type' },
        { name: 'startIconClass' },
      ],
      slots: [
        { name: 'default' },
      ],
    });

    const memberGroups = getMemberGroups(wrapper);

    expect(getTabs(wrapper)).toEqual(['Props', 'Slots', 'Class']);
    expect(memberGroups[0].props('members').map(member => member.name)).toEqual(['kind', 'type']);
    expect(memberGroups[1].props('members').map(member => member.name)).toEqual(['default']);
    expect(memberGroups[2].props('members').map(member => member.name)).toEqual(['labelClass', 'startIconClass']);
    expect(memberGroups[2].props('memberGroup')).toBe('props');
    expect(memberGroups[2].props('values')).toEqual(baseOptions.props);
  });

  it('Should render native class before class props in the Class tab', function () {
    const options = {
      ...baseOptions,
      attributes: { class: '' },
    };
    const wrapper = mountWrapper({
      props: [
        { name: 'kind' },
        { name: 'labelClass' },
        { name: 'type' },
      ],
      slots: [
        { name: 'default' },
      ],
      attributes: [
        { name: 'class' },
      ],
      options,
    });

    const memberGroups = getMemberGroups(wrapper);

    expect(getTabs(wrapper)).toEqual(['Props', 'Slots', 'Class']);
    expect(memberGroups[2].props('memberGroup')).toBe('attributes');
    expect(memberGroups[2].props('members').map(member => member.name)).toEqual(['class']);
    expect(memberGroups[2].props('values')).toEqual(options.attributes);
    expect(memberGroups[3].props('memberGroup')).toBe('props');
    expect(memberGroups[3].props('members').map(member => member.name)).toEqual(['labelClass']);
  });

  it('Should render the Class tab for native class without class props', function () {
    const wrapper = mountWrapper({
      props: [
        { name: 'kind' },
        { name: 'type' },
      ],
      slots: [
        { name: 'default' },
      ],
      attributes: [
        { name: 'class' },
      ],
      options: {
        ...baseOptions,
        attributes: { class: '' },
      },
    });

    const memberGroups = getMemberGroups(wrapper);

    expect(getTabs(wrapper)).toEqual(['Props', 'Slots', 'Class']);
    expect(memberGroups[2].props('memberGroup')).toBe('attributes');
    expect(memberGroups[2].props('members').map(member => member.name)).toEqual(['class']);
  });

  it('Should not render the Class tab when there are no class props', function () {
    const wrapper = mountWrapper({
      props: [
        { name: 'kind' },
        { name: 'type' },
      ],
      slots: [
        { name: 'default' },
      ],
    });

    expect(getTabs(wrapper)).toEqual(['Props', 'Slots']);
  });

  it('Should emit native class updates through attributes', async function () {
    const options = {
      ...baseOptions,
      attributes: { class: '' },
    };
    const wrapper = mountWrapper({
      props: [
        { name: 'kind' },
      ],
      attributes: [
        { name: 'class' },
      ],
      options,
    });
    const classAttributeGroup = getMemberGroups(wrapper)[1];

    await classAttributeGroup.vm.$emit('update:member', {
      member: 'class',
      value: 'd-w50p',
    });

    const update = wrapper.emitted('update:options')[0][0];
    const updatedOptions = structuredClone(options);
    update(updatedOptions);

    expect(updatedOptions.attributes.class).toBe('d-w50p');
    expect(updatedOptions.props.class).toBeUndefined();
  });

  it('Should emit class prop updates through props', async function () {
    const wrapper = mountWrapper({
      props: [
        { name: 'kind' },
        { name: 'labelClass' },
      ],
    });
    const classGroup = getMemberGroups(wrapper)[1];

    await classGroup.vm.$emit('update:member', {
      member: 'labelClass',
      value: 'd-p-100',
    });

    const update = wrapper.emitted('update:options')[0][0];
    const options = structuredClone(baseOptions);
    update(options);

    expect(options.props.labelClass).toBe('d-p-100');
  });

  it('Should filter class props through the Class tab', async function () {
    const wrapper = mountWrapper({
      props: [
        { name: 'kind' },
        { name: 'labelClass' },
      ],
    });

    await wrapper.find(searchButtonSelector).trigger('click');
    await wrapper.find(searchInputSelector).setValue('label class');

    expect(getTabs(wrapper)).toEqual(['Class']);
    expect(getMemberGroups(wrapper)[0].props('members').map(member => member.name)).toEqual(['labelClass']);
  });

  it('Should keep selected panel synced with filtered tabs', async function () {
    const wrapper = mountWrapper({
      props: [
        { name: 'kind' },
      ],
      slots: [
        { name: 'default' },
      ],
    });

    await wrapper.find(searchButtonSelector).trigger('click');
    await wrapper.find(searchInputSelector).setValue('default');

    expect(getTabs(wrapper)).toEqual(['Slots']);
    expect(getSelectedPanel(wrapper)).toBe('panel-slots');
  });
});
