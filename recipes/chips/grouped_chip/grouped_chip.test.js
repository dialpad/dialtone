import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import DtRecipeGroupedChip from './grouped_chip.vue';
import { DtIcon } from '@/components/icon';

// Constants
const basePropsData = {};
const baseSlotsData = {
  leftIcon: '<dt-icon name="clock" />',
  leftContent: `<div>0.13</div>`,
  rightIcon: '<dt-icon name="pause" />',
  rightContent: `<div>0.33</div>`,
};

describe('DtRecipeGroupedChip Tests', function () {
  // Wrappers
  let wrapper;
  let rootElement;
  let leftChipIconElement;
  let rightChipIconElement;
  let leftChipContentElement;
  let rightChipContentElement;

  // Environment
  let propsData = basePropsData;
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
      propsData,
      components: { DtIcon },
      attrs,
      slots,
      provide,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  before(function () {
    this.localVue = createLocalVue();
  });

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    attrs = {};
    slots = {};
    provide = {};
  });

  describe('Presentation Tests', function () {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */

    describe('Split chip state render', function () {
      beforeEach(async function () {
        slots = baseSlotsData;
        _setWrappers();
      });

      it('Should render grouped chip component', function () {
        assert.isTrue(wrapper.exists());
        assert.isTrue(rootElement.exists());
      });

      it('Should render left side chip icon element', function () {
        assert.isTrue(leftChipIconElement.findComponent(DtIcon).exists());
      });

      it('Should render left side chip content', function () {
        assert.strictEqual(leftChipContentElement.text(), '0.13');
      });

      it('Should not render right side chip component', function () {
        assert.isTrue(rightChipIconElement.exists());
      });

      it('Should render right side chip icon element', function () {
        assert.isTrue(rightChipIconElement.findComponent(DtIcon).exists());
      });

      it('Should render right side chip content', function () {
        assert.strictEqual(rightChipContentElement.text(), '0.33');
      });
    });
  });
});
