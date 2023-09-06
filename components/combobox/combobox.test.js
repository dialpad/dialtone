import { mount, createLocalVue } from '@vue/test-utils';
import DtCombobox from './combobox.vue';

const MOCK_SELECT_STUB = vi.fn();
const MOCK_ESCAPE_STUB = vi.fn();
const MOCK_HIGHLIGHT_STUB = vi.fn();
const MOCK_OPENED_STUB = vi.fn();

const baseProps = {
  label: 'Label Text',
  labelVisible: true,
  size: 'md',
  description: '',
  listId: 'list',
  showList: true,
  loading: false,
};
const baseAttrs = {};
const baseScopedSlots = {};
const baseSlots = {};
const baseListeners = {
  select: MOCK_SELECT_STUB,
  escape: MOCK_ESCAPE_STUB,
  highlight: MOCK_HIGHLIGHT_STUB,
  opened: MOCK_OPENED_STUB,
};

let mockProps = {};
let mockSlots = {};
let mockAttrs = {};
let mockScopedSlots = {};
let mockListeners = {};
const testContext = {};

describe('DtCombobox Tests', () => {
  let wrapper;
  let inputWrapper;
  let input;
  let listWrapper;
  let skeletons;
  let comboboxEmptyList;

  const updateWrapper = () => {
    wrapper = mount(DtCombobox, {
      propsData: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
      scopedSlots: { ...baseScopedSlots, ...mockScopedSlots },
      listeners: { ...baseListeners, ...mockListeners },
      localVue: testContext.localVue,
    });

    inputWrapper = wrapper.find('[data-qa="dt-combobox-input-wrapper"]');
    input = wrapper.find('input');
    listWrapper = wrapper.find('[data-qa="dt-combobox-list-wrapper"]');
    skeletons = wrapper.find('[data-qa="skeleton-text-body"]');
    comboboxEmptyList = wrapper.find('[data-qa="dt-combobox-empty-list"]');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockAttrs = {};
    mockProps = {};
    mockSlots = {};
    mockScopedSlots = {};
    mockListeners = {};
    vi.restoreAllMocks();
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe('When a input is provided', () => {
      beforeEach(() => {
        mockScopedSlots = { input: '<input v-bind="props.inputProps" />' };

        updateWrapper();
      });

      it('should render the input wrapper', () => {
        expect(inputWrapper.exists()).toBe(true);
      });

      it('should render the input', () => {
        expect(input.exists()).toBe(true);
      });
    });

    describe('When label is provided', () => {
      beforeEach(() => {
        mockScopedSlots = { input: '<input v-bind="props.inputProps" />' };

        updateWrapper();
      });

      it('should provide proper label prop to input element', () => {
        expect(input.attributes('label')).toEqual(baseProps.label);
      });

      it('should provide proper size prop to input element', () => {
        expect(input.attributes('size')).toEqual(baseProps.size);
      });

      it('should provide proper description prop to input element', () => {
        expect(input.attributes('description')).toEqual(baseProps.description);
      });

      describe('If label visible prop is false', () => {
        it('should still set aria-label even if label visible is false', async () => {
          await wrapper.setProps({ labelVisible: false });

          expect(input.attributes('aria-label')).toEqual(baseProps.label);
        });
      });
    });

    describe('When a list is provided', () => {
      beforeEach(() => {
        mockScopedSlots = { list: '<ol id="list"></ol>' };

        updateWrapper();
      });

      it('should render the list wrapper', () => {
        expect(listWrapper.exists()).toBe(true);
      });

      it('should render the list', () => {
        expect(wrapper.find('#list').exists()).toBe(true);
      });
    });

    describe('When the list is empty', () => {
      beforeEach(() => {
        mockSlots = { list: '<ol id="list"></ol>' };
        mockProps = {
          showList: true,
          emptyList: true,
          emptyStateMessage: 'empty',
          emptyStateClass: 'class',
        };

        updateWrapper();
      });

      it('should render the empty list', () => {
        expect(comboboxEmptyList.exists()).toBe(true);
      });

      it('should apply the class to the empty list element', () => {
        expect(comboboxEmptyList.find('.dt-empty-list-item').classes().includes('class')).toBe(true);
      });
    });

    describe('When it is loading', () => {
      it('should render the loading skeletons', () => {
        mockSlots = { list: '<ol id="list"><li role="option">item1</li><li role="option">item2</li></ol>' };
        mockProps = { loading: true };

        updateWrapper();

        expect(skeletons.exists()).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When a input is provided', () => {
      beforeEach(() => {
        mockScopedSlots = { input: '<input v-bind="props.inputProps" />' };

        updateWrapper();
      });

      describe('When list is not expanded', () => {
        it('aria-expanded should be "false"', async () => {
          await wrapper.setProps({ showList: false });

          expect(input.attributes('aria-expanded') === 'false').toBe(true);
        });
      });

      describe('When list is expanded', () => {
        it('aria-expanded should be "true"', async () => {
          await wrapper.setProps({ showList: true });

          input = wrapper.find('input');

          expect(input.attributes('aria-expanded') === 'true').toBe(true);
        });

        describe('When list is loading', () => {
          it('aria-busy should be "true"', async () => {
            await wrapper.setProps({ loading: true });

            listWrapper = wrapper.find('[data-qa="dt-combobox-list-wrapper"]');

            expect(listWrapper.find('ol').attributes('aria-busy') === 'true').toBe(true);
          });
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(() => {
      mockSlots = { list: '<ol id="list"><li role="option">item1</li><li role="option">item2</li></ol>' };

      updateWrapper();
    });

    describe('When the list is empty', () => {
      beforeEach(() => {
        mockSlots = { list: '<ol id="list"></ol>' };

        updateWrapper();
      });

      describe('When "Esc" key is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.esc');
        });

        it('should call listener', () => {
          expect(MOCK_ESCAPE_STUB).toHaveBeenCalled();
        });

        it('should emit escape event', () => {
          expect(wrapper.emitted().escape.length).toBe(1);
        });
      });

      describe('When "Enter" key is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.enter');
        });

        it('should not call listener', () => {
          expect(MOCK_SELECT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit select event', () => {
          expect(wrapper.emitted().select).toBeUndefined();
        });
      });

      describe('When down arrow button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.down');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(wrapper.emitted().highlight).toBeUndefined();
        });
      });

      describe('When up arrow button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.up');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(wrapper.emitted().highlight).toBeUndefined();
        });
      });

      describe('When home button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.home');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(wrapper.emitted().highlight).toBeUndefined();
        });
      });

      describe('When end button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.end');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(wrapper.emitted().highlight).toBeUndefined();
        });
      });
    });

    describe('When the list is loading', () => {
      beforeEach(async () => {
        mockProps = { loading: true };

        updateWrapper();
      });

      describe('When "Esc" key is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.esc');
        });

        it('should call listener', () => {
          expect(MOCK_ESCAPE_STUB).toHaveBeenCalled();
        });

        it('should emit escape event', () => {
          expect(wrapper.emitted().escape.length).toBe(1);
        });
      });

      describe('When "Enter" key is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.enter');
        });

        it('should not call listener', () => {
          expect(MOCK_SELECT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit select event', () => {
          expect(wrapper.emitted().select).toBeUndefined();
        });
      });

      describe('When down arrow button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.down');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(wrapper.emitted().highlight).toBeUndefined();
        });
      });

      describe('When up arrow button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.up');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(wrapper.emitted().highlight).toBeUndefined();
        });
      });

      describe('When home button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.home');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(wrapper.emitted().highlight).toBeUndefined();
        });
      });

      describe('When end button is pressed', () => {
        beforeEach(async () => {
          await wrapper.trigger('keydown.end');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(wrapper.emitted().highlight).toBeUndefined();
        });
      });
    });

    describe('When the list is shown', () => {
      beforeEach(async () => {
        await wrapper.setProps({ showList: false });
        await wrapper.setProps({ showList: true });
      });

      it('should call listener', () => {
        expect(MOCK_OPENED_STUB).toHaveBeenCalled();
      });

      it('should emit open event', () => {
        expect(wrapper.emitted().opened.length).toBe(2);
      });
    });

    describe('When the list is closed', () => {
      beforeEach(async () => {
        await wrapper.setProps({ showList: false });
      });

      it('should call listener', () => {
        expect(MOCK_OPENED_STUB).toHaveBeenCalled();
      });

      it('should emit open event', () => {
        expect(wrapper.emitted().opened.length).toBe(1);
      });
    });

    describe('When "Enter" key is pressed but no item is highlighted', () => {
      beforeEach(async () => {
        await wrapper.setData({ highlightIndex: -1 });
        await wrapper.trigger('keydown.enter');
      });

      it('should not call listener', () => {
        expect(MOCK_SELECT_STUB).toHaveBeenCalledTimes(0);
      });

      it('should not emit select event', () => {
        expect(wrapper.emitted().select).toBeUndefined();
      });
    });

    describe('When "Enter" key is pressed and item is highlighted', () => {
      beforeEach(async () => {
        await wrapper.setData({ highlightIndex: 1 });
        await wrapper.trigger('keydown.enter');
      });

      it('should call listener', () => {
        expect(MOCK_SELECT_STUB).toHaveBeenCalled();
      });

      it('should emit select event', () => {
        expect(wrapper.emitted().select.length).toBe(1);
      });
    });

    describe('When "Enter" key is pressed with another key and item is highlighted', () => {
      beforeEach(async () => {
        await wrapper.setData({ highlightIndex: 1 });
        await wrapper.trigger('keydown.shift.enter');
      });

      it('should not call listener', () => {
        expect(MOCK_SELECT_STUB).toHaveBeenCalledTimes(0);
      });

      it('should not emit select event', () => {
        expect(wrapper.emitted().select).toBeUndefined();
      });
    });

    describe('When "Esc" key is pressed', () => {
      beforeEach(async () => {
        await wrapper.trigger('keydown.esc');
      });

      it('should call listener', () => {
        expect(MOCK_ESCAPE_STUB).toHaveBeenCalled();
      });

      it('should emit escape event', () => {
        expect(wrapper.emitted().escape.length).toBe(1);
      });
    });

    describe('When the highlightIndex changes', () => {
      beforeEach(async () => {
        wrapper.vm.setHighlightIndex(1);
        await wrapper.vm.$nextTick();
      });

      it('should call listener', () => {
        expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalled();
      });

      it('should emit highlight event', () => {
        expect(wrapper.emitted().highlight.length).toBe(1);
      });
    });

    describe('When mouseleave is detected on the list wrapper', () => {
      beforeEach(async () => {
        await listWrapper.trigger('mouseleave');
      });

      it('should reset the highlightIndex', () => {
        expect(wrapper.vm.highlightIndex).toBe(-1);
      });
    });

    describe('When focusout is detected on the list wrapper', () => {
      it('should reset the highlightIndex', async () => {
        await listWrapper.trigger('focusout');

        expect(wrapper.vm.highlightIndex).toBe(-1);
      });
    });
  });
});
