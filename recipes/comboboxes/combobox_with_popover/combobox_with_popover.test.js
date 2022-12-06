import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtRecipeComboboxWithPopover from './combobox_with_popover.vue';
import DtInput from '@/components/input/input';
import sinon from 'sinon';
import DtPopover from '@/components/popover/popover';
import { cleanSpy, initializeSpy } from '@/tests/shared_examples/validation';
import { itBehavesLikeVisuallyHiddenCloseLabelIsNull } from '@/tests/shared_examples/sr_only_close_button';

// Constants
const baseProps = {
  label: 'Label Text',
  labelVisible: true,
  size: 'md',
  description: '',
  listId: 'list',
  loading: false,
  showList: null,
  visuallyHiddenCloseLabel: 'Close combobox',
};

describe('DtRecipeComboboxWithPopover Tests', function () {
  // Wrappers
  let wrapper;
  let inputWrapper;
  let listWrapper;

  // Environment
  let props = baseProps;
  let slots;
  let attrs;
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
      props,
      slots,
      attrs,
      global: {
        stubs: {
          transition: false,
        },
      },
      attachTo: document.body,
    });
  };

  // Setup
  before(function () {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = sinon.spy();
    global.cancelAnimationFrame = sinon.spy();
  });

  beforeEach(function () {
    selectStub = sinon.stub();
    escapeStub = sinon.stub();
    highlightStub = sinon.stub();
    openedStub = sinon.stub();
    attrs = { onSelect: selectStub, onEscape: escapeStub, onHighlight: highlightStub, onOpened: openedStub };
    _mountWrapper();
  });

  // Teardown
  afterEach(function () {
    props = baseProps;
    slots = {};
    wrapper.unmount();
    document.body.innerHTML = '';
  });

  after(function () {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', function () {
    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });
    it('should not render the visually hidden close button', async function () {
      await _openComboboxPopover();
      assert.isFalse(wrapper
        .findComponent(DtPopover)
        .findComponent({ ref: 'content' })
        .find('[data-qa="dt-sr-only-close-button"]')
        .exists(),
      );
    });

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

    describe('When label is provided', function () {
      beforeEach(async function () {
        slots = { input: '<input v-bind="props.inputProps" />' };
        _mountWrapper();
        _setChildWrappers();
      });

      it('should provide proper label prop to input element', function () {
        assert.equal(wrapper.find('input').attributes('label'), baseProps.label);
      });
      it('should provide proper size prop to input element', function () {
        assert.equal(wrapper.find('input').attributes('size'), baseProps.size);
      });
      it('should provide proper description prop to input element', function () {
        assert.equal(wrapper.find('input').attributes('description'), baseProps.description);
      });
      it('should provide proper aria-label prop to input element', function () {
        assert.equal(wrapper.find('input').attributes('aria-label'), baseProps.label);
      });
    });

    describe('When a list is provided', function () {
      // Test Setup
      beforeEach(async function () {
        slots = {
          list: '<ol id="list"></ol>',
        };
        _mountWrapper();
        await _openComboboxPopover();
        _setChildWrappers();
      });

      it('should render the list wrapper', function () { assert.isTrue(listWrapper.exists()); });
      it('should render the list', function () {
        assert.isTrue(wrapper.findComponent(DtPopover).findComponent({ ref: 'content' }).find('#list').exists());
      });
    });

    describe('When it is loading', function () {
      // Test Setup
      beforeEach(async function () {
        props = { ...props, loading: true };
        slots = {
          input: '<template #input="{ inputProps }"><input id="input" v-bind="inputProps" /></template>',
          list: `<template #list="{ listProps }">
                  <ol id="list" v-bind="listProps">
                    <li role="option">Item 1</li>
                  </ol>
                </template>`,
        };
        _mountWrapper();
        await _openComboboxPopover();
        _setChildWrappers();
      });

      it('should render the loading skeletons', function () {
        assert.isTrue(wrapper
          .findComponent(DtPopover)
          .findComponent({ ref: 'content' })
          .find('[data-qa="skeleton-text-body"]')
          .exists());
      });
    });

    describe('When list is empty', function () {
      // Test Setup
      beforeEach(async function () {
        slots = {
          input: '<template #input="{ inputProps }"><input id="input" v-bind="inputProps" /></template>',
          list: '<template #list="{ listProps }"><ol id="list" v-bind="listProps"></ol></template>',
        };
        _mountWrapper();
        await wrapper.setProps({ showList: true, emptyList: true, emptyStateMessage: 'empty' });
        await wrapper.vm.$nextTick();
        await _openComboboxPopover();
        _setChildWrappers();
      });

      it('should render the empty list component', function () {
        assert.isTrue(wrapper
          .findComponent(DtPopover)
          .findComponent({ ref: 'content' })
          .find('[data-qa="dt-combobox-empty-list"]')
          .exists());
      });
    });

    describe('When visuallyHiddenClose is true', function () {
      beforeEach(async function () {
        slots = {
          input: '<template #input="{ inputProps }"><input id="input" v-bind="inputProps" /></template>',
          list: '<template #list="{ listProps }"><ol id="list" v-bind="listProps"></ol></template>',
        };
        _mountWrapper();
        await wrapper.setProps({ visuallyHiddenClose: true });
        await _openComboboxPopover();
        _setChildWrappers();
      });

      it('should contain a visually hidden close button', async function () {
        assert.isTrue(wrapper
          .findComponent(DtPopover)
          .findComponent({ ref: 'content' })
          .find('[data-qa="dt-sr-only-close-button"]')
          .exists())
        ;
      });

      describe('When visuallyHiddenCloseLabel is null', function () {
        beforeEach(async function () {
          initializeSpy();
          await wrapper.setProps({ visuallyHiddenCloseLabel: null });
        });

        afterEach(function () {
          cleanSpy();
        });

        itBehavesLikeVisuallyHiddenCloseLabelIsNull();
      });
    });
  });

  describe('Accessibility Tests', function () {
    // Test Setup
    beforeEach(async function () {
      slots = {
        input: '<template #input="{ inputProps }"><input id="input" v-bind="inputProps" /></template>',
        list: `<template #list="{ listProps }">
                <ol id="list" v-bind="listProps">
                  <li role="option">Item 1</li>
                </ol>
               </template>`,
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
        await _openComboboxPopover();
      });

      it('aria-expanded should be "true"', function () {
        assert.isTrue(wrapper.find('#input').attributes('aria-expanded') === 'true');
      });

      describe('When list is loading', function () {
        beforeEach(async function () {
          await wrapper.setProps({ loading: true });
        });

        it('aria-busy should be "true"', function () {
          assert.isTrue(wrapper
            .findComponent(DtPopover)
            .findComponent({ ref: 'content' })
            .find('ol').attributes('aria-busy') === 'true');
        });
      });
    });
  });

  describe('Interactivity Tests', function () {
    // Test Setup
    beforeEach(async function () {
      slots = {
        input: '<template #input="{ inputProps }"><input id="input" v-bind="inputProps" /></template>',
        list: `<template #list="{ listProps }">
                <ol id="list" v-bind="listProps">
                  <li role="option">Item 1</li>  
                </ol>
               </template>`,
      };
      _mountWrapper();
      _setChildWrappers();
    });

    describe('When the list is loading', function () {
      beforeEach(async function () {
        props = { ...props, loading: true };
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
        slots = {
          input: '<template #input="{ inputProps }"><input id="input" v-bind="inputProps" /></template>',
          list: '<template #list="{ listProps }"><ol id="list" v-bind="listProps" /></template>',
        };
        _mountWrapper();
        await wrapper.setProps({ showList: true, emptyList: true, emptyStateMessage: 'empty' });
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

        it('should call listener', function () { assert.isTrue(highlightStub.called); });
        it('should emit highlight event', function () { assert.equal(wrapper.emitted().highlight.length, 2); });
      });

      describe('When up arrow button is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.up');
        });

        it('should call listener', function () { assert.isTrue(highlightStub.called); });
        it('should emit highlight event', function () { assert.equal(wrapper.emitted().highlight.length, 2); });
      });

      describe('When home button is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.home');
        });

        it('should call listener', function () { assert.isTrue(highlightStub.called); });
        it('should emit highlight event', function () { assert.equal(wrapper.emitted().highlight.length, 2); });
      });

      describe('When end button is pressed', function () {
        beforeEach(async function () {
          await wrapper.trigger('keydown.end');
        });

        it('should call listener', function () { assert.isTrue(highlightStub.called); });
        it('should emit highlight event', function () { assert.equal(wrapper.emitted().highlight.length, 2); });
      });
    });

    describe('When the list is shown', function () {
      beforeEach(async function () {
        await _openComboboxPopover();
      });

      it('should call listener', function () { assert.isTrue(openedStub.called); });
      it('should emit open event', function () { assert.equal(wrapper.emitted().opened.length, 1); });
    });

    describe('When the list is closed', function () {
      beforeEach(async function () {
        await _openComboboxPopover();
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
        await wrapper.trigger('keydown.enter');
      });

      it('should call listener', function () { assert.isTrue(selectStub.called); });
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

    describe('When sr-only close button is enabled and activated', function () {
      beforeEach(async function () {
        await _openComboboxPopover();
        await wrapper.setProps({ visuallyHiddenClose: true });
        await wrapper
          .findComponent(DtPopover)
          .findComponent({ ref: 'content' })
          .find('[data-qa="dt-sr-only-close-button"]')
          .trigger('click');
      });

      it('should call listener', function () { assert.isTrue(openedStub.called); });
      it('should emit open event', function () { assert.equal(wrapper.emitted().opened.length, 1); });
    });
  });
});
