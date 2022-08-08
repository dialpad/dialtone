import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import DtRecipeComboboxWithPopover from './combobox_with_popover.vue';
import DtInput from '@/components/input/input';
import sinon from 'sinon';

// Constants
const basePropsData = {
  listAriaLabel: '',
  listId: 'list',
  loading: false,
  showList: null,
};

describe('DtRecipeComboboxWithPopover Tests', function () {
  // Wrappers
  let wrapper;
  let combobox;
  let inputWrapper;
  let listWrapper;
  let skeletons;
  let comboboxEmptyList;

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
    combobox = wrapper.findComponent('[data-qa="dt-combobox"]');
    inputWrapper = wrapper.find('[data-qa="dt-combobox-input-wrapper"]');
    listWrapper = wrapper.find('[data-qa="dt-combobox-list-wrapper"]');
    skeletons = wrapper.find('[data-qa="skeleton-text-body"]');
    comboboxEmptyList = wrapper.find('[data-qa="dt-combobox-empty-list"]');
  };

  const _openComboboxPopover = async (_emptyList = undefined) => {
    await wrapper.find('#input').trigger('focus');
    wrapper.vm.$refs.combobox.isListEmpty = _emptyList;
    await wrapper.vm.$refs.combobox.setInitialHighlightIndex();
    wrapper.vm.$refs.combobox.outsideRenderedListRef = wrapper.vm.$refs.listWrapper;
  };

  const _mountWrapper = () => {
    wrapper = mount(DtRecipeComboboxWithPopover, {
      propsData,
      slots,
      scopedSlots,
      listeners,
      localVue: this.localVue,
      attachTo: document.body,
    });
  };

  // Setup
  before(function () {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = sinon.spy();
    global.cancelAnimationFrame = sinon.spy();
    this.localVue = createLocalVue();
  });

  beforeEach(function () {
    selectStub = sinon.stub();
    escapeStub = sinon.stub();
    highlightStub = sinon.stub();
    openedStub = sinon.stub();
    listeners = { select: selectStub, escape: escapeStub, highlight: highlightStub, opened: openedStub };
    _mountWrapper();
    _setChildWrappers();
  });

  // Teardown
  afterEach(async function () {
    propsData = basePropsData;
    slots = {};
    scopedSlots = {};
    // The destroy method is not removing the comboboxes from the document.body
    // TODO: Check this behavior as is leads to a memory leak when test:watch
    wrapper.destroy();
  });

  after(function () {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', function () {
    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });

    describe('When a input is provided', function () {
      // Test Setup
      beforeEach(async function () {
        slots = { input: DtInput };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should render the input wrapper', function () { assert.isTrue(inputWrapper.exists()); });
      it('should render the input', function () { assert.isTrue(wrapper.findComponent(DtInput).exists()); });
    });

    describe('When a list is provided', function () {
      // Test Setup
      beforeEach(async function () {
        propsData = { ...propsData, showList: true };
        scopedSlots = { list: '<ol id="list"></ol>' };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should render the list wrapper', function () { assert.isTrue(listWrapper.exists()); });
      it('should render the list', function () { assert.isTrue(wrapper.find('#list').exists()); });
    });

    describe('When it is loading', function () {
      // Test Setup
      beforeEach(async function () {
        propsData = { ...propsData, loading: true };
        scopedSlots = {
          input: '<input id="input" v-bind="props.inputProps" />',
          list: '<ol id="list" v-bind="props.listProps"><li role="option">item1</li><li role="option">item2</li></ol>',
        };
        _mountWrapper();
        await _openComboboxPopover();
        _setChildWrappers();
      });

      it('should render the loading skeletons', function () { assert.isTrue(skeletons.exists()); });
    });

    describe('When list is empty', function () {
      // Test Setup
      beforeEach(async function () {
        scopedSlots = {
          input: '<input id="input" v-bind="props.inputProps" />',
          list: '<ol id="list" v-bind="props.listProps"><li role="option">item1</li><li role="option">item2</li></ol>',
        };
        _mountWrapper();
        await _openComboboxPopover(true);
        _setChildWrappers();
      });

      it('should render the empty list component', function () { assert.isTrue(comboboxEmptyList.exists()); });
    });
  });

  describe('Accessibility Tests', function () {
    // Test Setup
    beforeEach(async function () {
      scopedSlots = {
        input: '<input id="input" v-bind="props.inputProps" />',
      };
      _mountWrapper();
      _setChildWrappers();
    });

    describe('When list is not expanded', function () {
      it('aria-expanded should be "false"', function () {
        assert.isTrue(wrapper.find('#input').attributes('aria-expanded') === 'false');
      });
    });

    describe('When list is expanded', function () {
      beforeEach(async function () {
        await wrapper.setProps({ showList: true });
      });

      it('aria-expanded should be "true"', function () {
        assert.isTrue(wrapper.find('#input').attributes('aria-expanded') === 'true');
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

  describe('Interactivity Tests', function () {
    // Test Setup
    beforeEach(async function () {
      scopedSlots = {
        input: '<input id="input" v-bind="props.inputProps" />',
        list: '<ol id="list" v-bind="props.listProps"><li role="option">item1</li><li role="option">item2</li></ol>',
      };
      _mountWrapper();
      _setChildWrappers();
    });

    describe('When the list is loading', function () {
      beforeEach(async function () {
        propsData = { ...propsData, loading: true };
        _mountWrapper();
        await _openComboboxPopover();
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

    describe('When the list is empty', function () {
      beforeEach(async function () {
        scopedSlots = {
          input: '<input id="input" v-bind="props.inputProps" />',
          list: '<ol id="list" v-bind="props.listProps"></ol>',
        };
        _mountWrapper();
        await _openComboboxPopover(true);
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

    describe('When the list is shown', function () {
      beforeEach(async function () {
        await wrapper.setProps({ showList: true });
      });

      it('should call listener', function () { assert.isTrue(openedStub.called); });
      it('should emit open event', function () { assert.equal(wrapper.emitted().opened.length, 1); });
    });

    describe('When the list is closed', function () {
      beforeEach(async function () {
        await wrapper.setProps({ showList: true });
        await wrapper.setProps({ showList: false });
      });

      it('should call listener', function () { assert.isTrue(openedStub.called); });
      it('should emit open event', function () { assert.equal(wrapper.emitted().opened.length, 2); });
    });

    describe('When "Enter" key is pressed but the combobox is not open', function () {
      beforeEach(async function () {
        await wrapper.trigger('keydown.enter');
      });

      it('should not call listener', function () { assert.isFalse(selectStub.called); });
      it('should not emit select event', function () { assert.isUndefined(wrapper.emitted().select); });
    });

    describe('When "Enter" key is pressed and the first item is highlighted', function () {
      beforeEach(async function () {
        await _openComboboxPopover();
        await combobox.trigger('keydown.enter');
      });

      it('should emit select event', function () { assert.equal(wrapper.emitted().select.length, 1); });
    });

    describe('When "Esc" key is pressed', function () {
      beforeEach(async function () {
        await _openComboboxPopover();
        await wrapper.trigger('keydown.esc');
      });

      it('should call listener', function () { assert.isTrue(escapeStub.called); });
      it('should emit escape event', function () { assert.equal(wrapper.emitted().escape.length, 1); });
    });
  });
});
