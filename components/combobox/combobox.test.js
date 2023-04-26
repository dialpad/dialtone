import { mount, createLocalVue } from '@vue/test-utils';
import DtCombobox from './combobox.vue';

// Constants
const basePropsData = {
  label: 'Label Text',
  labelVisible: true,
  size: 'md',
  description: '',
  listId: 'list',
  showList: true,
  loading: false,
};

describe('DtCombobox Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let inputWrapper;
  let input;
  let listWrapper;
  let skeletons;
  let comboboxEmptyList;

  // Test Environment
  let propsData;
  let attrs;
  let scopedSlots;
  let slots;
  let listeners;
  let selectStub;
  let escapeStub;
  let highlightStub;
  let openedStub;

  // Helpers
  const _setChildWrappers = () => {
    inputWrapper = wrapper.find('[data-qa="dt-combobox-input-wrapper"]');
    input = wrapper.find('input');
    listWrapper = wrapper.find('[data-qa="dt-combobox-list-wrapper"]');
    skeletons = wrapper.find('[data-qa="skeleton-text-body"]');
    comboboxEmptyList = wrapper.find('[data-qa="dt-combobox-empty-list"]');
  };

  const _mountWrapper = () => {
    wrapper = mount(DtCombobox, {
      propsData,
      attrs,
      slots,
      scopedSlots,
      listeners,
      localVue: testContext.localVue,
    });
  };

  // Test Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    propsData = basePropsData;
    selectStub = jest.fn();
    escapeStub = jest.fn();
    highlightStub = jest.fn();
    openedStub = jest.fn();
    listeners = { select: selectStub, escape: escapeStub, highlight: highlightStub, opened: openedStub };
    _mountWrapper();
    _setChildWrappers();
  });

  // Test Teardown
  afterEach(() => {
    propsData = basePropsData;
    slots = {};
    scopedSlots = {};
  });

  describe('Presentation Tests', () => {
    it(
      'should render the component',
      () => { expect(wrapper.exists()).toBe(true); },
    );

    describe('When a input is provided', () => {
      // Test Setup
      beforeEach(async () => {
        scopedSlots = { input: '<input v-bind="props.inputProps" />' };
        _mountWrapper();
        _setChildWrappers();
      });

      it(
        'should render the input wrapper',
        () => { expect(inputWrapper.exists()).toBe(true); },
      );
      it('should render the input', () => { expect(input.exists()).toBe(true); });
    });

    describe('When label is provided', () => {
      beforeEach(async () => {
        scopedSlots = { input: '<input v-bind="props.inputProps" />' };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should provide proper label prop to input element', () => {
        expect(input.attributes('label')).toEqual(basePropsData.label);
      });
      it('should provide proper size prop to input element', () => {
        expect(input.attributes('size')).toEqual(basePropsData.size);
      });
      it('should provide proper description prop to input element', () => {
        expect(input.attributes('description')).toEqual(basePropsData.description);
      });

      describe('If label visible prop is false', () => {
        beforeEach(async () => {
          await wrapper.setProps({ labelVisible: false });
        });
        it(
          'should still set aria-label even if label visible is false',
          () => {
            expect(input.attributes('aria-label')).toEqual(basePropsData.label);
          },
        );
      });
    });

    describe('When a list is provided', () => {
      // Test Setup
      beforeEach(async () => {
        scopedSlots = { list: '<ol id="list"></ol>' };
        _mountWrapper();
        _setChildWrappers();
      });

      it(
        'should render the list wrapper',
        () => { expect(listWrapper.exists()).toBe(true); },
      );
      it(
        'should render the list',
        () => { expect(wrapper.find('#list').exists()).toBe(true); },
      );
    });

    describe('When the list is empty', () => {
      // Test Setup
      beforeEach(async () => {
        slots = { list: '<ol id="list"></ol>' };
        _mountWrapper();
        await wrapper.setProps({
          showList: true,
          emptyList: true,
          emptyStateMessage: 'empty',
          emptyStateClass: 'class',
        });
        await wrapper.vm.$nextTick();
        _setChildWrappers();
      });

      it('should render the empty list', () => {
        expect(comboboxEmptyList.exists()).toBe(true);
      });

      it('should apply the class to the empty list element', () => {
        expect(comboboxEmptyList.find('.dt-empty-list-item').classes().includes('class')).toBe(true);
      });
    });

    describe('When it is loading', () => {
      // Test Setup
      beforeEach(async () => {
        slots = { list: '<ol id="list"><li role="option">item1</li><li role="option">item2</li></ol>' };
        await wrapper.setProps({ loading: true });
        _setChildWrappers();
      });

      it(
        'should render the loading skeletons',
        () => { expect(skeletons.exists()).toBe(true); },
      );
    });
  });

  describe('Accessibility Tests', () => {
    describe('When a input is provided', () => {
      // Test Setup
      beforeEach(async () => {
        scopedSlots = { input: '<input v-bind="props.inputProps" />' };
        _mountWrapper();
        _setChildWrappers();
      });

      describe('When list is not expanded', () => {
        beforeEach(async () => {
          await wrapper.setProps({ showList: false });
        });

        it('aria-expanded should be "false"', () => {
          expect(input.attributes('aria-expanded') === 'false').toBe(true);
        });
      });

      describe('When list is expanded', () => {
        beforeEach(async () => {
          await wrapper.setProps({ showList: true });
        });

        it('aria-expanded should be "true"', () => {
          expect(input.attributes('aria-expanded') === 'true').toBe(true);
        });

        describe('When list is loading', () => {
          beforeEach(async () => {
            await wrapper.setProps({ loading: true });
            _setChildWrappers();
          });

          it('aria-busy should be "true"', () => {
            expect(listWrapper.find('ol').attributes('aria-busy') === 'true').toBe(true);
          });
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    // Test Setup
    beforeEach(async () => {
      slots = { list: '<ol id="list"><li role="option">item1</li><li role="option">item2</li></ol>' };
      _mountWrapper();
      _setChildWrappers();
    });

    describe('When the list is empty', () => {
      beforeEach(async () => {
        slots = { list: '<ol id="list"></ol>' };
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
          () => { expect(selectStub).toHaveBeenCalledTimes(0); },
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
          () => { expect(wrapper.emitted().highlight.length).toEqual(1); },
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
          () => { expect(wrapper.emitted().highlight.length).toEqual(1); },
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
          () => { expect(wrapper.emitted().highlight.length).toEqual(1); },
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
          () => { expect(wrapper.emitted().highlight.length).toEqual(1); },
        );
      });
    });

    describe('When the list is loading', () => {
      beforeEach(async () => {
        await wrapper.setProps({ loading: true });
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
          () => { expect(selectStub).toHaveBeenCalledTimes(0); },
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
          () => { expect(highlightStub).toHaveBeenCalledTimes(0); },
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
          () => { expect(highlightStub).toHaveBeenCalledTimes(0); },
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
          () => { expect(highlightStub).toHaveBeenCalledTimes(0); },
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
          () => { expect(highlightStub).toHaveBeenCalledTimes(0); },
        );
        it(
          'should not emit highlight event',
          () => { expect(wrapper.emitted().highlight).not.toBeDefined(); },
        );
      });
    });

    describe('When the list is shown', () => {
      beforeEach(async () => {
        await wrapper.setProps({ showList: false });
        await wrapper.setProps({ showList: true });
      });

      it('should call listener', () => { expect(openedStub).toHaveBeenCalled(); });
      it(
        'should emit open event',
        () => { expect(wrapper.emitted().opened.length).toEqual(2); },
      );
    });

    describe('When the list is closed', () => {
      beforeEach(async () => {
        await wrapper.setProps({ showList: false });
      });

      it('should call listener', () => { expect(openedStub).toHaveBeenCalled(); });
      it(
        'should emit open event',
        () => { expect(wrapper.emitted().opened.length).toEqual(1); },
      );
    });

    describe('When "Enter" key is pressed but no item is highlighted', () => {
      beforeEach(async () => {
        await wrapper.setData({ highlightIndex: -1 });
        await wrapper.trigger('keydown.enter');
      });

      it(
        'should not call listener',
        () => { expect(selectStub).toHaveBeenCalledTimes(0); },
      );
      it(
        'should not emit select event',
        () => { expect(wrapper.emitted().select).not.toBeDefined(); },
      );
    });

    describe('When "Enter" key is pressed and item is highlighted', () => {
      beforeEach(async () => {
        await wrapper.setData({ highlightIndex: 1 });
        await wrapper.trigger('keydown.enter');
      });

      it('should call listener', () => { expect(selectStub).toHaveBeenCalled(); });
      it(
        'should emit select event',
        () => { expect(wrapper.emitted().select.length).toEqual(1); },
      );
    });

    describe('When "Enter" key is pressed with another key and item is highlighted', () => {
      beforeEach(async () => {
        await wrapper.setData({ highlightIndex: 1 });
        await wrapper.trigger('keydown.shift.enter');
      });

      it(
        'should not call listener',
        () => { expect(selectStub).toHaveBeenCalledTimes(0); },
      );
      it(
        'should not emit select event',
        () => { expect(wrapper.emitted().select).not.toBeDefined(); },
      );
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

    describe('When the highlightIndex changes', () => {
      beforeEach(async () => {
        wrapper.vm.setHighlightIndex(1);
        await wrapper.vm.$nextTick();
      });

      it(
        'should call listener',
        () => { expect(highlightStub).toHaveBeenCalled(); },
      );
      it(
        'should emit highlight event',
        () => { expect(wrapper.emitted().highlight.length).toEqual(1); },
      );
    });

    describe('When mouseleave is detected on the list wrapper', () => {
      // Test Setup
      beforeEach(async () => {
        await listWrapper.trigger('mouseleave');
      });

      it(
        'should reset the highlightIndex',
        () => { expect(wrapper.vm.highlightIndex).toEqual(-1); },
      );
    });

    describe('When focusout is detected on the list wrapper', () => {
      // Test Setup
      beforeEach(async () => {
        await listWrapper.trigger('focusout');
      });

      it(
        'should reset the highlightIndex',
        () => { expect(wrapper.vm.highlightIndex).toEqual(-1); },
      );
    });
  });
});
