import { createLocalVue, mount } from '@vue/test-utils';
import EmptyComponentFixture from '../../tests/fixtures/component.vue';
import DtChip from './chip.vue';

// Constants
const basePropsData = {
  closeButtonProps: {
    ariaLabel: 'close',
  },
};

describe('DtChip Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let chip;
  let icon;
  let avatar;
  let label;
  let remove;

  // Environment
  let propsData = basePropsData;
  let slots = {};
  let listeners;

  // Helpers
  const _setChildWrappers = () => {
    chip = wrapper.find('[data-qa="dt-chip"]');
    icon = wrapper.find('[data-qa="dt-chip-icon"]');
    avatar = wrapper.find('[data-qa="dt-chip-avatar"]');
    label = wrapper.find('[data-qa="dt-chip-label"]');
    remove = wrapper.find('[data-qa="dt-chip-close"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtChip, {
      propsData,
      slots,
      listeners,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  // Teardown
  afterEach(() => {
    propsData = basePropsData;
    slots = {};
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      const defaultText = 'TEXT';
      beforeEach(() => {
        slots = { default: defaultText };
        _setWrappers();
      });
      it(
        'should render the component',
        () => { expect(wrapper.exists()).toBe(true); },
      );
      it('should render chip', () => { expect(chip.exists()).toBeTruthy(); });
      it(
        'should render remove button',
        () => { expect(remove.exists()).toBeTruthy(); },
      );
      it('should render label', () => { expect(label.exists()).toBeTruthy(); });
      it(
        'should display the correct text',
        () => { expect(label.text()).toBe(defaultText); },
      );
      it('should not render icon', () => { expect(icon.exists()).toBe(false); });
      it(
        'should not render avatar',
        () => { expect(avatar.exists()).toBe(false); },
      );
      it('default interactive', () => {
        expect(chip.element.tagName).toBe('BUTTON');
      });
      it('chip should have aria-labelledby', () => {
        expect('aria-labelledby' in chip.attributes()).toBeTruthy();
      });
      it('button should have aria-label', () => {
        expect(remove.attributes('aria-label')).toEqual('close');
      });
    });

    describe('When interactive is false', () => {
      beforeEach(async () => {
        propsData = {
          ...basePropsData,
          interactive: false,
        };
        await _setWrappers();
      });
      it('should not be interactive', () => {
        expect(chip.element.tagName).toBe('SPAN');
      });
    });

    describe('When hide close button', () => {
      beforeEach(async () => {
        propsData = {
          ...basePropsData,
          hideClose: true,
        };
        await _setWrappers();
      });
      it(
        'should not render remove button',
        () => { expect(remove.exists()).toBe(false); },
      );
    });

    describe('When show avatar', () => {
      beforeEach(() => {
        slots = {
          avatar: EmptyComponentFixture,
        };
        _setWrappers();
      });
      it('should render avatar', () => { expect(avatar.exists()).toBeTruthy(); });
    });

    describe('With icon slot', () => {
      beforeEach(() => {
        slots = {
          icon: EmptyComponentFixture,
        };
        _setWrappers();
      });
      it('should render icon', () => { expect(icon.exists()).toBeTruthy(); });
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(() => {
      _setWrappers();
    });

    describe('When close button is clicked', () => {
      beforeEach(async () => {
        await remove.trigger('click');
      });
      it('should emit close event', () => {
        expect('close' in wrapper.emitted()).toBeTruthy();
      });
    });

    describe('When delete is pressed on a chip', () => {
      beforeEach(async () => {
        await chip.trigger('keyup', { code: 'DELETE' });
      });
      it('should emit close event', () => {
        expect('close' in wrapper.emitted()).toBeTruthy();
      });
    });
  });
});
