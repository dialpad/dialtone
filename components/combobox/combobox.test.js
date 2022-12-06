import sinon from 'sinon';
import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtCombobox from './combobox.vue';

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

describe('DtCombobox Tests', function () {
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
    input = wrapper.find('input');
    listWrapper = wrapper.find('[data-qa="dt-combobox-list-wrapper"]');
    skeletons = wrapper.find('[data-qa="skeleton-text-body"]');
    comboboxEmptyList = wrapper.find('[data-qa="dt-combobox-empty-list"]');
  };

  const _mountWrapper = () => {
    wrapper = mount(DtCombobox, {
      props,
      attrs,
      slots,
    });
  };

  // Test Setup
  beforeEach(function () {
    props = baseProps;
    selectStub = sinon.stub();
    escapeStub = sinon.stub();
    highlightStub = sinon.stub();
    openedStub = sinon.stub();
    attrs = { onSelect: selectStub, onEscape: escapeStub, onHighlight: highlightStub, onOpened: openedStub };
    _mountWrapper();
    _setChildWrappers();
  });

  // Test Teardown
  afterEach(function () {
    props = baseProps;
    slots = {};
  });

  describe('Presentation Tests', function () {
    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });

    describe('When a input is provided', function () {
      // Test Setup
      beforeEach(async function () {
        slots = { input: '<template #input="params"><input v-bind="params.inputProps" /></template>' };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should render the input wrapper', function () { assert.isTrue(inputWrapper.exists()); });
      it('should render the input', function () { assert.isTrue(input.exists()); });
    });

    describe('When label is provided', function () {
      beforeEach(async function () {
        slots = { input: '<input v-bind="props.inputProps" />' };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should provide proper label prop to input element', function () {
        assert.equal(input.attributes('label'), baseProps.label);
      });
      it('should provide proper size prop to input element', function () {
        assert.equal(input.attributes('size'), baseProps.size);
      });
      it('should provide proper description prop to input element', function () {
        assert.equal(input.attributes('description'), baseProps.description);
      });

      describe('If label visible prop is false', function () {
        beforeEach(async function () {
          await wrapper.setProps({ labelVisible: false });
        });
        it('should still set aria-label even if label visible is false', function () {
          assert.equal(input.attributes('aria-label'), baseProps.label);
        });
      });
    });

    describe('When a list is provided', function () {
      // Test Setup
      beforeEach(async function () {
        slots = { list: '<ol id="list"></ol>' };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should render the list wrapper', function () { assert.isTrue(listWrapper.exists()); });
      it('should render the list', function () { assert.isTrue(wrapper.find('#list').exists()); });
    });

    describe('When the list is empty', function () {
      // Test Setup
      beforeEach(async function () {
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

      it('should render the empty list', function () {
        assert.isTrue(comboboxEmptyList.exists());
      });

      it('should apply the class to the empty list element', function () {
        assert.isTrue(comboboxEmptyList.find('.dt-empty-list-item').classes().includes('class'));
      });
    });

    describe('When it is loading', function () {
      // Test Setup
      beforeEach(async function () {
        slots = { list: '<ol id="list"><li role="option">item1</li><li role="option">item2</li></ol>' };
        await wrapper.setProps({ loading: true });
        _setChildWrappers();
      });

      it('should render the loading skeletons', function () { assert.isTrue(skeletons.exists()); });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When a input is provided', function () {
      // Test Setup
      beforeEach(async function () {
        slots = { input: '<template #input="params"><input v-bind="params.inputProps" /></template>' };
        _mountWrapper();
        _setChildWrappers();
      });

      describe('When list is not expanded', function () {
        beforeEach(async function () {
          await wrapper.setProps({ showList: false });
        });

        it('aria-expanded should be "false"', function () {
          assert.isTrue(input.attributes('aria-expanded') === 'false');
        });
      });

      describe('When list is expanded', function () {
        beforeEach(async function () {
          await wrapper.setProps({ showList: true });
        });

        it('aria-expanded should be "true"', function () {
          assert.isTrue(input.attributes('aria-expanded') === 'true');
        });

        describe('When list is loading', function () {
          beforeEach(async function () {
            await wrapper.setProps({ loading: true });
            _setChildWrappers();
          });

          it('aria-busy should be "true"', function () {
            assert.isTrue(listWrapper.find('ol').attributes('aria-busy') === 'true');
          });
        });
      });
    });
  });

  describe('Interactivity Tests', function () {
    // Test Setup
    beforeEach(async function () {
      slots = { list: '<ol id="list"><li role="option">item1</li><li role="option">item2</li></ol>' };
      _mountWrapper();
      _setChildWrappers();
    });

    describe('When the list is empty', function () {
      beforeEach(async function () {
        slots = { list: '<ol id="list"></ol>' };
        _setChildWrappers();
      });

      describe('When "Esc" key is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.esc');
        });

        it('should call listener', function () { assert.isTrue(escapeStub.called); });
        it('should emit escape event', function () { assert.equal(wrapper.emitted().escape.length, 1); });
      });

      describe('When "Enter" key is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.enter');
        });

        it('should not call listener', function () { assert.isFalse(selectStub.called); });
        it('should not emit select event', function () { assert.isUndefined(wrapper.emitted().select); });
      });

      describe('When down arrow button is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.down');
        });

        it('should call listener', function () { assert.isTrue(highlightStub.called); });
        it('should emit highlight event', function () { assert.equal(wrapper.emitted().highlight.length, 1); });
      });

      describe('When up arrow button is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.up');
        });

        it('should call listener', function () { assert.isTrue(highlightStub.called); });
        it('should emit highlight event', function () { assert.equal(wrapper.emitted().highlight.length, 1); });
      });

      describe('When home button is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.home');
        });

        it('should call listener', function () { assert.isTrue(highlightStub.called); });
        it('should emit highlight event', function () { assert.equal(wrapper.emitted().highlight.length, 1); });
      });

      describe('When end button is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.end');
        });

        it('should call listener', function () { assert.isTrue(highlightStub.called); });
        it('should emit highlight event', function () { assert.equal(wrapper.emitted().highlight.length, 1); });
      });
    });

    describe('When the list is loading', function () {
      beforeEach(async function () {
        await wrapper.setProps({ loading: true });
        _setChildWrappers();
      });

      describe('When "Esc" key is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.esc');
        });

        it('should call listener', function () { assert.isTrue(escapeStub.called); });
        it('should emit escape event', function () { assert.equal(wrapper.emitted().escape.length, 1); });
      });

      describe('When "Enter" key is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.enter');
        });

        it('should not call listener', function () { assert.isFalse(selectStub.called); });
        it('should not emit select event', function () { assert.isUndefined(wrapper.emitted().select); });
      });

      describe('When down arrow button is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.down');
        });

        it('should not call listener', function () { assert.isFalse(highlightStub.called); });
        it('should not emit highlight event', function () { assert.isUndefined(wrapper.emitted().highlight); });
      });

      describe('When up arrow button is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.up');
        });

        it('should not call listener', function () { assert.isFalse(highlightStub.called); });
        it('should not emit highlight event', function () { assert.isUndefined(wrapper.emitted().highlight); });
      });

      describe('When home button is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.home');
        });

        it('should not call listener', function () { assert.isFalse(highlightStub.called); });
        it('should not emit highlight event', function () { assert.isUndefined(wrapper.emitted().highlight); });
      });

      describe('When end button is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.end');
        });

        it('should not call listener', function () { assert.isFalse(highlightStub.called); });
        it('should not emit highlight event', function () { assert.isUndefined(wrapper.emitted().highlight); });
      });
    });

    describe('When the list is shown', function () {
      beforeEach(async function () {
        await wrapper.setProps({ showList: false });
        await wrapper.setProps({ showList: true });
      });

      it('should call listener', function () { assert.isTrue(openedStub.called); });
      it('should emit open event', function () { assert.equal(wrapper.emitted().opened.length, 2); });
    });

    describe('When the list is closed', function () {
      beforeEach(async function () {
        await wrapper.setProps({ showList: false });
      });

      it('should call listener', function () { assert.isTrue(openedStub.called); });
      it('should emit open event', function () { assert.equal(wrapper.emitted().opened.length, 1); });
    });

    describe('When "Enter" key is pressed but no item is highlighted', function () {
      beforeEach(async function () {
        await wrapper.setData({ highlightIndex: -1 });
        await wrapper.trigger('keydown.enter');
      });

      it('should not call listener', function () { assert.isFalse(selectStub.called); });
      it('should not emit select event', function () { assert.isUndefined(wrapper.emitted().select); });
    });

    describe('When "Enter" key is pressed and item is highlighted', function () {
      beforeEach(async function () {
        await wrapper.setData({ highlightIndex: 1 });
        await wrapper.trigger('keydown.enter');
      });

      it('should call listener', function () { assert.isTrue(selectStub.called); });
      it('should emit select event', function () { assert.equal(wrapper.emitted().select.length, 1); });
    });

    describe('When "Enter" key is pressed with another key and item is highlighted', function () {
      beforeEach(async function () {
        await wrapper.setData({ highlightIndex: 1 });
        await wrapper.trigger('keydown.shift.enter');
      });

      it('should not call listener', function () { assert.isFalse(selectStub.called); });
      it('should not emit select event', function () { assert.isUndefined(wrapper.emitted().select); });
    });

    describe('When "Esc" key is pressed', function () {
      beforeEach(async function () {
        await wrapper.trigger('keydown.esc');
      });

      it('should call listener', function () { assert.isTrue(escapeStub.called); });
      it('should emit escape event', function () { assert.equal(wrapper.emitted().escape.length, 1); });
    });

    describe('When the highlightIndex changes', function () {
      beforeEach(async function () {
        wrapper.vm.setHighlightIndex(1);
        await wrapper.vm.$nextTick();
      });

      it('should call listener', function () { assert.isTrue(highlightStub.called); });
      it('should emit highlight event', function () { assert.equal(wrapper.emitted().highlight.length, 1); });
    });

    describe('When mouseleave is detected on the list wrapper', function () {
      // Test Setup
      beforeEach(async function () {
        await listWrapper.trigger('mouseleave');
      });

      it('should reset the highlightIndex', function () { assert.equal(wrapper.vm.highlightIndex, -1); });
    });

    describe('When focusout is detected on the list wrapper', function () {
      // Test Setup
      beforeEach(async function () {
        await listWrapper.trigger('focusout');
      });

      it('should reset the highlightIndex', function () { assert.equal(wrapper.vm.highlightIndex, -1); });
    });
  });
});
