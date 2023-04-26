import { createLocalVue, mount } from '@vue/test-utils';
import DtRecipeComboboxWithPopover from './combobox_with_popover.vue';
import DtInput from '@/components/input/input';
import DtPopover from '@/components/popover/popover';
import { cleanSpy, initializeSpy } from '@/tests/shared_examples/validation';
import { itBehavesLikeVisuallyHiddenCloseLabelIsNull } from '@/tests/shared_examples/sr_only_close_button';

// Constants
const basePropsData = {
  label: 'Label Text',
  labelVisible: true,
  size: 'md',
  description: '',
  listId: 'list',
  loading: false,
  showList: null,
  visuallyHiddenCloseLabel: 'Close combobox',
};

describe('DtRecipeComboboxWithPopover Tests', () => {
  let testContext;

  // Wrappers
  let wrapper;
  let inputWrapper;
  let listWrapper;

  // Environment
  let propsData = basePropsData;
  let slots;
  let scopedSlots;
  let listeners;
  let selectStub;
  let escapeStub;
  let highlightStub;
  let openedStub;

  // Helpers
  const _setChildWrappers = () => {
    inputWrapper = wrapper.find('[data-qa="dt-combobox-input-wrapper"]');
    listWrapper = wrapper.find('[data-qa="dt-combobox-list-wrapper"]');
  };

  const _openComboboxPopover = async () => {
    await wrapper.setProps({ showList: true });
    wrapper.vm.$refs.combobox.onOpen(true, wrapper.vm.$refs.listWrapper);
    await wrapper.vm.$nextTick();
  };

  const _mountWrapper = () => {
    wrapper = mount(DtRecipeComboboxWithPopover, {
      propsData,
      slots,
      scopedSlots,
      listeners,
      localVue: testContext.localVue,
      global: {
        stubs: {
          transition: false,
        },
      },
      attachTo: document.body,
    });
  };

  // Setup
  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = jest.fn();
    global.cancelAnimationFrame = jest.fn();
    testContext = {};
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    selectStub = jest.fn();
    escapeStub = jest.fn();
    highlightStub = jest.fn();
    openedStub = jest.fn();
    listeners = { select: selectStub, escape: escapeStub, highlight: highlightStub, opened: openedStub };
    _mountWrapper();
  });

  // Teardown
  afterEach(async () => {
    propsData = basePropsData;
    slots = {};
    scopedSlots = null;
    wrapper.destroy();
    document.body.innerHTML = '';
  });

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', () => {
    it(
      'should render the component',
      () => { expect(wrapper.exists()).toBe(true); },
    );
    it('should not render the visually hidden close button', async () => {
      await _openComboboxPopover();
      expect(wrapper
        .findComponent(DtPopover)
        .findComponent({ ref: 'content' })
        .find('[data-qa="dt-sr-only-close-button"]')
        .exists()).toBe(false);
    });

    describe('When a input is provided', () => {
      // Test Setup
      beforeEach(async () => {
        slots = { input: DtInput };
        _mountWrapper();
        _setChildWrappers();
      });

      it(
        'should render the input wrapper',
        () => { expect(inputWrapper.exists()).toBe(true); },
      );
      it(
        'should render the input',
        () => { expect(wrapper.findComponent(DtInput).exists()).toBe(true); },
      );
    });

    describe('When label is provided', () => {
      beforeEach(async () => {
        scopedSlots = { input: '<input v-bind="props.inputProps" />' };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should provide proper label prop to input element', () => {
        expect(wrapper.find('input').attributes('label')).toEqual(basePropsData.label);
      });
      it('should provide proper size prop to input element', () => {
        expect(wrapper.find('input').attributes('size')).toEqual(basePropsData.size);
      });
      it('should provide proper description prop to input element', () => {
        expect(wrapper.find('input').attributes('description')).toEqual(basePropsData.description);
      });
      it('should provide proper aria-label prop to input element', () => {
        expect(wrapper.find('input').attributes('aria-label')).toEqual(basePropsData.label);
      });
    });

    describe('When a list is provided', () => {
      // Test Setup
      beforeEach(async () => {
        scopedSlots = {
          list: '<ol id="list"></ol>',
        };
        _mountWrapper();
        await _openComboboxPopover();
        _setChildWrappers();
      });

      it(
        'should render the list wrapper',
        () => { expect(listWrapper.exists()).toBe(true); },
      );
      it('should render the list', () => {
        expect(
          wrapper.findComponent(DtPopover).findComponent({ ref: 'content' }).find('#list').exists(),
        ).toBe(true);
      });
    });

    describe('When it is loading', () => {
      // Test Setup
      beforeEach(async () => {
        propsData = { ...propsData, loading: true };
        scopedSlots = {
          input: '<input id="input" v-bind="props.inputProps" />',
          list: '<ol id="list" v-bind="props.listProps"><li role="option">Item 1</li></ol>',
        };
        _mountWrapper();
        await _openComboboxPopover();
        _setChildWrappers();
      });

      it('should render the loading skeletons', () => {
        expect(wrapper
          .findComponent(DtPopover)
          .findComponent({ ref: 'content' })
          .find('[data-qa="skeleton-text-body"]')
          .exists()).toBe(true);
      });
    });

    describe('When list is empty', () => {
      // Test Setup
      beforeEach(async () => {
        scopedSlots = {
          input: '<input id="input" v-bind="props.inputProps" />',
          list: '<ol id="list" v-bind="props.listProps"></ol>',
        };
        _mountWrapper();
        await wrapper.setProps({ showList: true, emptyList: true, emptyStateMessage: 'empty' });
        await wrapper.vm.$nextTick();
        await _openComboboxPopover();
        _setChildWrappers();
      });

      it('should render the empty list component', () => {
        expect(wrapper
          .findComponent(DtPopover)
          .findComponent({ ref: 'content' })
          .find('[data-qa="dt-combobox-empty-list"]')
          .exists()).toBe(true);
      });
    });

    describe('When visuallyHiddenClose is true', () => {
      beforeEach(async () => {
        scopedSlots = {
          input: '<input id="input" v-bind="props.inputProps" />',
          list: '<ol id="list" v-bind="props.listProps"><li role="option">Item 1</li></ol>',
        };
        _mountWrapper();
        await wrapper.setProps({ visuallyHiddenClose: true });
        await _openComboboxPopover();
        _setChildWrappers();
      });

      it('should contain a visually hidden close button', async () => {
        expect(wrapper
          .findComponent(DtPopover)
          .findComponent({ ref: 'content' })
          .find('[data-qa="dt-sr-only-close-button"]')
          .exists()).toBe(true)
        ;
      });

      describe('When visuallyHiddenCloseLabel is null', () => {
        beforeEach(async () => {
          initializeSpy();
          await wrapper.setProps({ visuallyHiddenCloseLabel: null });
        });

        afterEach(() => {
          cleanSpy();
        });

        itBehavesLikeVisuallyHiddenCloseLabelIsNull();
      });
    });
  });

  describe('Accessibility Tests', () => {
    // Test Setup
    beforeEach(async () => {
      scopedSlots = {
        input: '<input id="input" v-bind="props.inputProps" />',
        list: '<ol id="list" v-bind="props.listProps"><li role="option">Item 1</li></ol>',
      };
      _mountWrapper();
      _setChildWrappers();
    });

    describe('When list is not expanded', () => {
      it('aria-expanded should be "false"', () => {
        expect(wrapper.find('#input').attributes('aria-expanded') === 'false').toBe(true);
      });
    });

    describe('When list is expanded', () => {
      beforeEach(async () => {
        await _openComboboxPopover();
      });

      it('aria-expanded should be "true"', () => {
        expect(wrapper.find('#input').attributes('aria-expanded') === 'true').toBe(true);
      });

      describe('When list is loading', () => {
        beforeEach(async () => {
          await wrapper.setProps({ loading: true });
        });

        it('aria-busy should be "true"', () => {
          expect(wrapper
            .findComponent(DtPopover)
            .findComponent({ ref: 'content' })
            .find('ol').attributes('aria-busy') === 'true').toBe(true);
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    // Test Setup
    beforeEach(async () => {
      scopedSlots = {
        input: '<input id="input" v-bind="props.inputProps" />',
        list: '<ol id="list" v-bind="props.listProps"><li role="option">Item 1</li></ol>',
      };
      _mountWrapper();
      _setChildWrappers();
    });

    describe('When the list is loading', () => {
      beforeEach(async () => {
        propsData = { ...propsData, loading: true };
        _mountWrapper();
        await _openComboboxPopover();
        _setChildWrappers();
      });

      describe('When "Esc" key is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.esc');
        });

        it('should call listener', () => { expect(escapeStub).toHaveBeenCalled(); });
        it(
          'should emit escape event',
          () => { expect(wrapper.emitted().escape.length).toEqual(1); },
        );
      });

      describe('When "Enter" key is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.enter');
        });

        it(
          'should not call listener',
          () => { expect(selectStub).not.toHaveBeenCalled(); },
        );
        it(
          'should not emit select event',
          () => { expect(wrapper.emitted().select).not.toBeDefined(); },
        );
      });

      describe('When down arrow button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.down');
        });

        it(
          'should not call listener',
          () => { expect(highlightStub).not.toHaveBeenCalled(); },
        );
        it(
          'should not emit highlight event',
          () => { expect(wrapper.emitted().highlight).not.toBeDefined(); },
        );
      });

      describe('When up arrow button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.up');
        });

        it(
          'should not call listener',
          () => { expect(highlightStub).not.toHaveBeenCalled(); },
        );
        it(
          'should not emit highlight event',
          () => { expect(wrapper.emitted().highlight).not.toBeDefined(); },
        );
      });

      describe('When home button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.home');
        });

        it(
          'should not call listener',
          () => { expect(highlightStub).not.toHaveBeenCalled(); },
        );
        it(
          'should not emit highlight event',
          () => { expect(wrapper.emitted().highlight).not.toBeDefined(); },
        );
      });

      describe('When end button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.end');
        });

        it(
          'should not call listener',
          () => { expect(highlightStub).not.toHaveBeenCalled(); },
        );
        it(
          'should not emit highlight event',
          () => { expect(wrapper.emitted().highlight).not.toBeDefined(); },
        );
      });
    });

    describe('When the list is empty', () => {
      beforeEach(async () => {
        scopedSlots = {
          input: '<input id="input" v-bind="props.inputProps" />',
          list: '<ol id="list" v-bind="props.listProps"/>',
        };
        _mountWrapper();
        await wrapper.setProps({ showList: true, emptyList: true, emptyStateMessage: 'empty' });
        await _openComboboxPopover();
        _setChildWrappers();
      });

      describe('When "Esc" key is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.esc');
        });

        it('should call listener', () => { expect(escapeStub).toHaveBeenCalled(); });
        it(
          'should emit escape event',
          () => { expect(wrapper.emitted().escape.length).toEqual(1); },
        );
      });

      describe('When "Enter" key is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.enter');
        });

        it(
          'should not call listener',
          () => { expect(selectStub).not.toHaveBeenCalled(); },
        );
        it(
          'should not emit select event',
          () => { expect(wrapper.emitted().select).not.toBeDefined(); },
        );
      });

      describe('When down arrow button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.down');
        });

        it(
          'should call listener',
          () => { expect(highlightStub).toHaveBeenCalled(); },
        );
        it(
          'should emit highlight event',
          () => { expect(wrapper.emitted().highlight.length).toEqual(2); },
        );
      });

      describe('When up arrow button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.up');
        });

        it(
          'should call listener',
          () => { expect(highlightStub).toHaveBeenCalled(); },
        );
        it(
          'should emit highlight event',
          () => { expect(wrapper.emitted().highlight.length).toEqual(2); },
        );
      });

      describe('When home button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.home');
        });

        it(
          'should call listener',
          () => { expect(highlightStub).toHaveBeenCalled(); },
        );
        it(
          'should emit highlight event',
          () => { expect(wrapper.emitted().highlight.length).toEqual(2); },
        );
      });

      describe('When end button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.end');
        });

        it(
          'should call listener',
          () => { expect(highlightStub).toHaveBeenCalled(); },
        );
        it(
          'should emit highlight event',
          () => { expect(wrapper.emitted().highlight.length).toEqual(2); },
        );
      });
    });

    describe('When the list is shown', () => {
      beforeEach(async () => {
        await _openComboboxPopover();
      });

      it('should call listener', () => { expect(openedStub).toHaveBeenCalled(); });
      it(
        'should emit open event',
        () => { expect(wrapper.emitted().opened.length).toEqual(1); },
      );
    });

    describe('When the list is closed', () => {
      beforeEach(async () => {
        await _openComboboxPopover();
        await wrapper.setProps({ showList: false });
      });

      it('should call listener', () => { expect(openedStub).toHaveBeenCalled(); });
      it(
        'should emit open event',
        () => { expect(wrapper.emitted().opened.length).toEqual(2); },
      );
    });

    describe('When "Enter" key is pressed but the combobox is not open', () => {
      beforeEach(async () => {
        await wrapper.trigger('keydown.enter');
      });

      it(
        'should not call listener',
        () => { expect(selectStub).not.toHaveBeenCalled(); },
      );
      it(
        'should not emit select event',
        () => { expect(wrapper.emitted().select).not.toBeDefined(); },
      );
    });

    describe('When "Enter" key is pressed and the first item is highlighted', () => {
      beforeEach(async () => {
        await _openComboboxPopover();
        await wrapper.trigger('keydown.enter');
      });

      it('should call listener', () => { expect(selectStub).toHaveBeenCalled(); });
      it(
        'should emit select event',
        () => { expect(wrapper.emitted().select.length).toEqual(1); },
      );
    });

    describe('When "Esc" key is pressed', () => {
      beforeEach(async () => {
        await _openComboboxPopover();
        await wrapper.trigger('keydown.esc');
      });

      it('should call listener', () => { expect(escapeStub).toHaveBeenCalled(); });
      it(
        'should emit escape event',
        () => { expect(wrapper.emitted().escape.length).toEqual(1); },
      );
    });

    describe('When sr-only close button is enabled and activated', () => {
      beforeEach(async () => {
        await _openComboboxPopover();
        await wrapper.setProps({ visuallyHiddenClose: true });
        await wrapper
          .findComponent(DtPopover)
          .findComponent({ ref: 'content' })
          .find('[data-qa="dt-sr-only-close-button"]')
          .trigger('click');
      });

      it('should call listener', () => { expect(openedStub).toHaveBeenCalled(); });
      it(
        'should emit open event',
        () => { expect(wrapper.emitted().opened.length).toEqual(1); },
      );
    });
  });
});
