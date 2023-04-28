import { mount } from '@vue/test-utils';
import DtRecipeGroupedChip from './grouped_chip.vue';
import { DtIcon } from '@/components/icon';

// Constants
const baseProps = {};
const baseSlotsData = {
  leftIcon: '<dt-icon name="clock" />',
  leftContent: `<div>0.13</div>`,
  rightIcon: '<dt-icon name="pause" />',
  rightContent: `<div>0.33</div>`,
};

describe('DtRecipeGroupedChip Tests', () => {
  // Wrappers
  let wrapper;
  let rootElement;
  let leftChipIconElement;
  let rightChipIconElement;
  let leftChipContentElement;
  let rightChipContentElement;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    rootElement = wrapper.find('[data-qa="grouped-chip"]');

    leftChipIconElement = wrapper.find('[data-qa="left-grouped-chip-icon"]');
    rightChipIconElement = wrapper.find('[data-qa="right-grouped-chip-icon"]');

    leftChipContentElement = wrapper.find('[data-qa="left-grouped-chip-content"]');
    rightChipContentElement = wrapper.find('[data-qa="right-grouped-chip-content"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeGroupedChip, {
      props,
      global: { components: { 'dt-icon': DtIcon } },
      attrs,
      slots,
      provide,
    });
    _setChildWrappers();
  };

  // Teardown
  afterEach(() => {
    props = baseProps;
    attrs = {};
    slots = {};
    provide = {};
  });

  describe('Presentation Tests', () => {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */

    describe('Split chip state render', () => {
      beforeEach(async () => {
        slots = baseSlotsData;
        _setWrappers();
      });

      it('Should render grouped chip component', () => {
        expect(wrapper.exists()).toBe(true);
        expect(rootElement.exists()).toBe(true);
      });

      it('Should render left side chip icon element', () => {
        expect(leftChipIconElement.findComponent(DtIcon).exists()).toBe(true);
      });

      it('Should render left side chip content', () => {
        expect(leftChipContentElement.text()).toBe('0.13');
      });

      it('Should not render right side chip component', () => {
        expect(rightChipIconElement.exists()).toBe(true);
      });

      it('Should render right side chip icon element', () => {
        expect(rightChipIconElement.findComponent(DtIcon).exists()).toBe(true);
      });

      it('Should render right side chip content', () => {
        expect(rightChipContentElement.text()).toBe('0.33');
      });
    });
  });
});
