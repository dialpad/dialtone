import { mount } from '@vue/test-utils';
import DtCombobox from './combobox.vue';
import DtInput from '@/components/input/input.vue';

// Constants
const baseProps = {
  label: 'Label Text',
  labelVisible: true,
  size: 'md',
  description: '',
  listId: 'list',
  showList: true,
  loading: false,
};

describe('DtCombobox Tests', () => {
  // Wrappers
  let wrapper;
  let inputWrapper;
  let input;
  let listWrapper;
  let skeletons;
  let comboboxEmptyList;

  // Test Environment
  let props;
  let attrs;
  let slots;
  let selectStub;
  let escapeStub;
  let highlightStub;
  let openedStub;

  // Helpers
  const _setChildWrappers = () => {
    inputWrapper = wrapper.find('[data-qa="dt-combobox-input-wrapper"]');
    input = wrapper.findComponent({ name: 'dt-input' });
    listWrapper = wrapper.find('[data-qa="dt-combobox-list-wrapper"]');
    skeletons = wrapper.find('[data-qa="skeleton-text-body"]');
    comboboxEmptyList = wrapper.find('[data-qa="dt-combobox-empty-list"]');
  };

  const _mountWrapper = () => {
    wrapper = mount(DtCombobox, {
      props,
      attrs,
      slots,
      global: {
        components: {
          DtInput,
        },
      },
    });
  };

  // Test Setup
  beforeEach(() => {
    props = baseProps;
    selectStub = vi.fn();
    escapeStub = vi.fn();
    highlightStub = vi.fn();
    openedStub = vi.fn();
    attrs = { onSelect: selectStub, onEscape: escapeStub, onHighlight: highlightStub, onOpened: openedStub };
    _mountWrapper();
    _setChildWrappers();
  });

  // Test Teardown
  afterEach(() => {
    props = baseProps;
    slots = {};
  });

  describe('Presentation Tests', () => {
    it(
      'should render the component',
      () => { expect(wrapper.exists()).toBe(true); },
    );

    describe('When a input is provided', () => {
      // Test Setup
      beforeEach(async () => {
        slots = { input: '<template #input="params"><dt-input v-bind="params.inputProps" /></template>' };
        _mountWrapper();
        _setChildWrappers();
      });

      it(
        'should render the input wrapper',
        () => { expect(inputWrapper.exists()).toBe(true); },
      );
      it('should render the input', () => { expect(input.exists()).toBe(true); });
    });

    describe('When label is provided', function () {
      beforeEach(function () {
        slots = { input: '<template #input="params"><dt-input v-bind="params.inputProps" /></template>' };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should provide proper label prop to input element', () => {
        expect(input.props('label')).toEqual(baseProps.label);
      });
      it('should provide proper size prop to input element', () => {
        expect(input.props('size')).toEqual(baseProps.size);
      });
      it('should provide proper description prop to input element', () => {
        expect(input.props('description')).toEqual(baseProps.description);
      });

      describe('If label visible prop is false', () => {
        beforeEach(async () => {
          await wrapper.setProps({ labelVisible: false });
        });
        it(
          'should still set aria-label even if label visible is false',
          () => {
            expect(input.find('input').attributes('aria-label')).toEqual(baseProps.label);
          },
        );
      });
    });

    describe('When a list is provided', () => {
      // Test Setup
      beforeEach(async function () {
        slots = { list: '<ol id="list"></ol>' };
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
      beforeEach(async function () {
        slots = { input: '<template #input="params"><dt-input v-bind="params.inputProps" /></template>' };
        _mountWrapper();
        _setChildWrappers();
      });

      describe('When list is not expanded', () => {
        beforeEach(async () => {
          await wrapper.setProps({ showList: false });
        });

        it('aria-expanded should be "false"', () => {
          expect(input.find('input').attributes('aria-expanded') === 'false').toBe(true);
        });
      });

      describe('When list is expanded', () => {
        beforeEach(async () => {
          await wrapper.setProps({ showList: true });
        });

        it('aria-expanded should be "true"', () => {
          expect(input.find('input').attributes('aria-expanded') === 'true').toBe(true);
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
          console.log(wrapper.html());
          await wrapper.trigger('keydown.esc');
        });

        it('should call listener', () => { expect(escapeStub).toHaveBeenCalled(); });
        it(
          'should emit escape event',
          () => { expect(wrapper.emitted().escape.length).toBe(1); },
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
          () => { expect(wrapper.emitted().select).toBeUndefined(); },
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
          () => { expect(wrapper.emitted().highlight.length).toBe(1); },
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
          () => { expect(wrapper.emitted().highlight.length).toBe(1); },
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
          () => { expect(wrapper.emitted().highlight.length).toBe(1); },
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
          () => { expect(wrapper.emitted().highlight.length).toBe(1); },
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
          () => { expect(wrapper.emitted().escape.length).toBe(1); },
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
          () => { expect(wrapper.emitted().select).toBeUndefined(); },
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
          () => { expect(wrapper.emitted().highlight).toBeUndefined(); },
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
          () => { expect(wrapper.emitted().highlight).toBeUndefined(); },
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
          () => { expect(wrapper.emitted().highlight).toBeUndefined(); },
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
          () => { expect(wrapper.emitted().highlight).toBeUndefined(); },
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
        () => { expect(wrapper.emitted().opened.length).toBe(2); },
      );
    });

    describe('When the list is closed', () => {
      beforeEach(async () => {
        await wrapper.setProps({ showList: false });
      });

      it('should call listener', () => { expect(openedStub).toHaveBeenCalled(); });
      it(
        'should emit open event',
        () => { expect(wrapper.emitted().opened.length).toBe(1); },
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
        () => { expect(wrapper.emitted().select).toBeUndefined(); },
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
        () => { expect(wrapper.emitted().select.length).toBe(1); },
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
        () => { expect(wrapper.emitted().select).toBeUndefined(); },
      );
    });

    describe('When "Esc" key is pressed', () => {
      beforeEach(async () => {
        await wrapper.trigger('keydown.esc');
      });

      it('should call listener', () => { expect(escapeStub).toHaveBeenCalled(); });
      it(
        'should emit escape event',
        () => { expect(wrapper.emitted().escape.length).toBe(1); },
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
        () => { expect(wrapper.emitted().highlight.length).toBe(1); },
      );
    });

    describe('When mouseleave is detected on the list wrapper', () => {
      // Test Setup
      beforeEach(async () => {
        await listWrapper.trigger('mouseleave');
      });

      it(
        'should reset the highlightIndex',
        () => { expect(wrapper.vm.highlightIndex).toBe(-1); },
      );
    });

    describe('When focusout is detected on the list wrapper', () => {
      // Test Setup
      beforeEach(async () => {
        await listWrapper.trigger('focusout');
      });

      it(
        'should reset the highlightIndex',
        () => { expect(wrapper.vm.highlightIndex).toBe(-1); },
      );
    });
  });
});
