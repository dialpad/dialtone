import { DtListItem } from '@/components/ListItem';
import { h } from 'vue';
import keyboardNavigation from './keyboard_list_navigation';
import { mount } from '@vue/test-utils';
import KeyboardListNavigation, {
  KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS,
  KEYBOARD_LIST_NAVIGATION_TESTER_KEY,
} from './keyboard_list_navigation_tester.vue';

// Since we are testing a mixin here we use a mock vue tester component to
// render what we need to test.

describe('Keyboard Navigation Mixin Tests', () => {
  // Wrappers
  let wrapper;

  // Test Environment
  let props;
  let attrs;
  let slots;
  let listeners;
  let afterHighlightSpy;
  let beginningOfListSpy;
  let endOfListSpy;

  const _mountWrapper = () => {
    wrapper = mount(KeyboardListNavigation, {
      props,
      attrs,
      slots,
      listeners,
    });
  };

  // Test Setup
  beforeAll(() => {
    afterHighlightSpy = vi.spyOn(KeyboardListNavigation.methods, 'afterHighlightMethod').mockClear();
    beginningOfListSpy = vi.spyOn(KeyboardListNavigation.methods, 'beginningOfListMethod').mockClear();
    endOfListSpy = vi.spyOn(KeyboardListNavigation.methods, 'endOfListMethod').mockClear();
  });

  beforeEach(() => {
    _mountWrapper();
  });

  // Test Teardown
  afterEach(() => {
    beginningOfListSpy.mockReset();
    slots = {};
  });

  describe('When first item is highlighted', () => {
    // Test Setup
    beforeEach(async () => {
      wrapper.setData({ highlightIndex: 0 });
    });

    describe('When arrow up is pressed', () => {
      beforeEach(() => {
        wrapper.vm.onUpKey();
      });

      it('calls the expected beginning of list function', () => {
        expect(beginningOfListSpy).toHaveBeenCalled();
      });
    });

    describe('When arrow down is pressed', () => {
      beforeEach(() => {
        wrapper.vm.onDownKey();
      });

      it('highlight is incremented by 1', () => {
        expect(wrapper.vm.highlightIndex).toBe(1);
      });

      it('calls the expected afterHighlight function', () => {
        expect(afterHighlightSpy).toHaveBeenCalled();
      });
    });

    describe(`When navigation key "${KEYBOARD_LIST_NAVIGATION_TESTER_KEY}" is pressed`, () => {
      beforeEach(() => {
        wrapper.vm.onNavigationKey(KEYBOARD_LIST_NAVIGATION_TESTER_KEY);
      });

      it('highlight is incremented by 1', () => {
        expect(wrapper.vm.highlightIndex).toBe(1);
      });
    });

    describe('When "end" key is pressed', () => {
      beforeEach(() => {
        wrapper.vm.onEndKey();
      });

      it('last index is highlighted', () => {
        expect(wrapper.vm.highlightIndex).toBe(KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.length - 1);
      });
    });
  });

  describe('When last item is highlighted', () => {
    // Test Setup
    beforeEach(async () => {
      wrapper.setData({ highlightIndex: KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.length - 1 });
    });

    describe('When arrow up is pressed', () => {
      beforeEach(() => {
        wrapper.vm.onUpKey();
      });

      it('highlight is decremented by 1', () => {
        expect(wrapper.vm.highlightIndex).toBe(KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS.length - 2);
      });

      it('calls the expected afterHighlight function', () => {
        expect(afterHighlightSpy).toHaveBeenCalled();
      });
    });

    describe('When arrow down is pressed', () => {
      beforeEach(() => {
        wrapper.vm.onDownKey();
      });

      it('calls the expected end of list function', () => {
        expect(endOfListSpy).toHaveBeenCalled();
      });
    });

    describe(`When navigation key "${KEYBOARD_LIST_NAVIGATION_TESTER_KEY}" is pressed`, () => {
      beforeEach(() => {
        wrapper.vm.onNavigationKey(KEYBOARD_LIST_NAVIGATION_TESTER_KEY);
      });

      it('first index is highlighted', () => {
        expect(wrapper.vm.highlightIndex).toBe(0);
      });
    });

    describe('When "home" key is pressed', () => {
      beforeEach(() => {
        wrapper.vm.onHomeKey();
      });

      it('first index is highlighted', () => {
        expect(wrapper.vm.highlightIndex).toBe(0);
      });
    });
  });
});

describe('Keyboard navigation role collections', () => {
  let wrapper;
  const mountList = listItemRole => {
    wrapper = mount({
      mixins: [keyboardNavigation({
        listItemRole, listElementKey: 'getListElement', activeItemKey: 'activeItemEl',
        focusOnKeyboardNavigation: true, scrollToOnHighlight: false,
      })],
      computed: {
        activeItemEl () {
          return Array.from(this.$el.querySelectorAll('[id]')).find(item => item.id === this.highlightId);
        },
      },
      methods: { getListElement () { return this.$el; } },
      render () {
        return h('ul', {
          onKeydown: event => {
            if (event.key === 'ArrowDown') this.onDownKey();
            if (event.key === 'ArrowUp') this.onUpKey();
            if (event.key === 'Home') this.onHomeKey();
            if (event.key === 'End') this.onEndKey();
          },
        }, [
          h('li', { role: 'presentation', id: 'heading' }, 'Heading'),
          h('li', { role: 'menuitem', id: 'action:id', tabindex: -1 }, 'Action'),
          h('li', { role: 'menuitemradio', id: 'radio [one]', tabindex: -1 }, 'Radio'),
          h('li', { role: 'menuitemradio', tabindex: -1 }, 'Missing ID'),
          h('li', { role: 'option', id: 'option', tabindex: -1 }, 'Option'),
          h('button', { id: 'sr-only-close-button' }, 'Close'),
        ]);
      },
    }, { attachTo: document.body });
  };
  afterEach(() => wrapper.unmount());

  it('retains a public highlight request made before the list renders', async () => {
    const warning = vi.spyOn(console, 'error').mockImplementation(() => {});
    wrapper = mount({
      mixins: [keyboardNavigation({ listElementKey: 'getListElement', scrollToOnHighlight: false })],
      props: { show: Boolean },
      methods: { getListElement () { return this.$refs.list; } },
      render () {
        return h('div', { onKeydown: () => this.onDownKey() }, this.show
          ? h('ul', { ref: 'list' }, ['one', 'two'].map(id =>
            h(DtListItem, { id, role: 'option', navigationType: 'arrow-keys' }, () => id)))
          : null);
      },
    });
    try {
      wrapper.vm.setHighlightId('two');
      await wrapper.setProps({ show: true });
      expect(wrapper.get('#two').attributes('aria-selected')).toBe('true');
      await wrapper.trigger('keydown', { key: 'ArrowDown' });
      expect(wrapper.get('#two').attributes('aria-selected')).toBe('true');
    } finally {
      warning.mockRestore();
    }
  });

  it('navigates a role array and special IDs while retaining the close control', async () => {
    mountList(['menuitem', 'menuitemradio']);
    await wrapper.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement.id).toBe('action:id');
    await wrapper.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement.id).toBe('radio [one]');
    await wrapper.trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement.id).toBe('sr-only-close-button');
    wrapper.vm.setHighlightId('radio [one]');
    await wrapper.trigger('keydown', { key: 'ArrowUp' });
    expect(document.activeElement.id).toBe('action:id');
    await wrapper.trigger('keydown', { key: 'End' });
    expect(document.activeElement.id).toBe('sr-only-close-button');
    await wrapper.trigger('keydown', { key: 'Home' });
    expect(document.activeElement.id).toBe('action:id');
  });
});
