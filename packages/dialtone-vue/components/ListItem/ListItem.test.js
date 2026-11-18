import { mount } from '@vue/test-utils';
import DtListItem from './ListItem.vue';
import { LIST_ITEM_NAVIGATION_TYPES } from './ListItemConstants';

const MOCK_CLICK_STUB = vi.fn();

const baseProps = {
  id: 'dt-item',
  navigationType: LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS,
  role: 'option',
};
const baseAttrs = {
  onClick: MOCK_CLICK_STUB,
};
const baseProvide = {
  highlightId: () => 'dt-item2',
};

let mockProps = {};
let mockAttrs = {};
let mockProvide = {};

describe('DtListItem tests', () => {
  let wrapper;
  let listItemWrapper;

  const updateWrapper = () => {
    wrapper = mount(DtListItem, {
      props: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      global: {
        provide: { ...baseProvide, ...mockProvide },
      },
    });

    listItemWrapper = wrapper.find('[data-qa="dt-list-item-wrapper"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockProvide = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe('When navigation type is set to tab', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          navigationType: LIST_ITEM_NAVIGATION_TYPES.TAB,
        });
      });

      it('should apply the focusable class to the wrapper.', () => {
        expect(wrapper.classes('d-list-item--focusable')).toBe(true);
      });

      it('should add tabindex 0 to the wrapper.', () => {
        expect(wrapper.attributes('tabindex') === '0').toBe(true);
      });
    });

    describe('When navigation type is set to none', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          navigationType: LIST_ITEM_NAVIGATION_TYPES.NONE,
        });
      });

      it('should not apply the classes to the wrapper.', () => {
        expect(wrapper.classes('d-list-item--focusable')).toBe(false);
        expect(wrapper.classes('d-list-item--highlighted')).toBe(false);
      });

      it('should add tabindex -1 to the wrapper.', () => {
        expect(wrapper.attributes('tabindex') === '-1').toBe(true);
      });
    });

    describe('When item is not highlighted', () => {
      it('should not apply the class to the wrapper.', () => {
        expect(wrapper.classes('d-list-item--highlighted')).toBe(false);
      });

      it('aria-selected should not be set', () => {
        expect(wrapper.attributes('aria-selected')).toBe('false');
      });
    });

    describe('When item is highlighted', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          id: 'dt-item2',
        });
      });

      it('should apply the class to the wrapper.', () => {
        expect(wrapper.classes('d-list-item--highlighted')).toBe(true);
      });

      it('aria-selected should be set to "true"', () => {
        expect(wrapper.attributes('aria-selected') === 'true').toBe(true);
      });
    });

    describe('When item is selected', () => {
      it('should render checkmark icon', async () => {
        await wrapper.setProps({ selected: true });
        await vi.dynamicImportSettled();

        const icon = wrapper.find('[data-qa="dt-icon"]');

        expect(icon.exists()).toBe(true);
        expect(icon.classes('d-icon--check')).toBe(true);
      });
    });

    describe('When element type is provided', () => {
      it('should use the provided element type on the wrapper.', async () => {
        await wrapper.setProps({ elementType: 'div' });

        expect(wrapper.element.tagName).toBe('DIV');
      });
    });

    describe('When element type is not provided', () => {
      it('should use the default element type on the wrapper.', () => {
        expect(wrapper.element.tagName).toBe('LI');
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When "Enter" key is pressed', () => {
      beforeEach(async () => {
        await wrapper.trigger('keydown', { code: 'Enter' });
      });

      it('should call listener', async () => {
        expect(MOCK_CLICK_STUB).toHaveBeenCalled();
      });

      it('should emit click event', () => {
        expect(wrapper.emitted().click.length).toBe(1);
      });
    });

    describe('When "Space" key is pressed', () => {
      beforeEach(async () => {
        await wrapper.trigger('keydown', { code: 'Space' });
      });

      it('should call listener', async () => {
        expect(MOCK_CLICK_STUB).toHaveBeenCalled();
      });

      it('should emit click event', () => {
        expect(wrapper.emitted().click.length).toBe(1);
      });
    });

    describe('When mousemove is triggered', () => {
      it('should emit mousemove event', async () => {
        await wrapper.trigger('mousemove');

        expect(wrapper.emitted().mousemove.length).toBe(1);
      });
    });

    describe('When mouseleave is triggered', () => {
      it('should emit mouseleave event', async () => {
        await wrapper.trigger('mouseleave');

        expect(wrapper.emitted().mouseleave.length).toBe(1);
      });
    });
  });

  describe('Disabled Tests', () => {
    describe('When disabled is not set', () => {
      it('renders the same root attributes as before the prop existed', () => {
        expect(wrapper.attributes()).toEqual({
          id: 'dt-item',
          class: 'd-list-item',
          tabindex: '-1',
          role: 'option',
          'aria-selected': 'false',
        });
      });

      it('passes a consumer aria-disabled through and still emits click', async () => {
        mockAttrs = { 'aria-disabled': 'true' };
        updateWrapper();

        await wrapper.trigger('click');

        expect(wrapper.attributes('aria-disabled')).toBe('true');
        expect(wrapper.classes()).toEqual(['d-list-item']);
        expect(wrapper.emitted('click')).toHaveLength(1);
      });
    });

    describe('When disabled', () => {
      beforeEach(() => {
        mockProps = { disabled: true };
        updateWrapper();
      });

      it('sets aria-disabled and the disabled modifier together', () => {
        expect(wrapper.attributes('aria-disabled')).toBe('true');
        expect(wrapper.classes()).toEqual(['d-list-item', 'd-list-item--disabled']);
      });

      it('emits pointer events except click', async () => {
        await wrapper.trigger('click');
        await wrapper.trigger('mousemove');
        await wrapper.trigger('mouseleave');

        expect(Object.keys(wrapper.emitted())).toEqual(['mousemove', 'mouseleave']);
      });

      it('cancels the native activation of a disabled link row', () => {
        mockProps = { disabled: true, elementType: 'a' };
        mockAttrs = { href: '/settings' };
        updateWrapper();
        const click = new MouseEvent('click', { bubbles: true, cancelable: true });

        wrapper.element.dispatchEvent(click);

        expect(click.defaultPrevented).toBe(true);
      });

      it('keeps the keyboard highlight', async () => {
        // baseProvide highlights dt-item2.
        await wrapper.setProps({ id: 'dt-item2' });

        expect(wrapper.classes()).toEqual(['d-list-item', 'd-list-item--highlighted', 'd-list-item--disabled']);
        expect(wrapper.attributes('aria-selected')).toBe('true');
      });

      it('stays focusable for tab navigation', async () => {
        await wrapper.setProps({ navigationType: LIST_ITEM_NAVIGATION_TYPES.TAB });

        expect(wrapper.attributes('tabindex')).toBe('0');
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When type is "default" and "wrapperClass" prop is provided', () => {
      beforeEach(async () => {
        await wrapper.setProps({ wrapperClass: 'custom-class' });
      });

      it('should apply the provided class to the wrapper.', () => {
        expect(listItemWrapper.element.classList.contains('custom-class')).toBe(true);
      });
    });
  });

  describe('Slot Forwarding Tests', () => {
    describe('When start slot is provided', () => {
      beforeEach(() => {
        mockProps = {};
        wrapper = mount(DtListItem, {
          props: { ...baseProps },
          attrs: { ...baseAttrs },
          global: {
            provide: { ...baseProvide },
          },
          slots: { start: 'start content' },
        });
      });

      it('should forward start slot to item layout', () => {
        expect(wrapper.text()).toContain('start content');
      });
    });

    describe('When end slot is provided', () => {
      beforeEach(() => {
        mockProps = {};
        wrapper = mount(DtListItem, {
          props: { ...baseProps },
          attrs: { ...baseAttrs },
          global: {
            provide: { ...baseProvide },
          },
          slots: { end: 'end content' },
        });
      });

      it('should forward end slot to item layout', () => {
        expect(wrapper.text()).toContain('end content');
      });
    });

    describe('When left slot is provided (deprecated)', () => {
      beforeEach(() => {
        mockProps = {};
        wrapper = mount(DtListItem, {
          props: { ...baseProps },
          attrs: { ...baseAttrs },
          global: {
            provide: { ...baseProvide },
          },
          slots: { left: 'left content' },
        });
      });

      it('should forward left slot to item layout', () => {
        expect(wrapper.text()).toContain('left content');
      });
    });

    describe('When right slot is provided (deprecated)', () => {
      beforeEach(() => {
        mockProps = {};
        wrapper = mount(DtListItem, {
          props: { ...baseProps },
          attrs: { ...baseAttrs },
          global: {
            provide: { ...baseProvide },
          },
          slots: { right: 'right content' },
        });
      });

      it('should forward right slot to item layout', () => {
        expect(wrapper.text()).toContain('right content');
      });
    });
  });
});

describe('ListItem contextual roles', () => {
  it('keeps ordinary selected list content as listitem', () => {
    const item = mount(DtListItem, { props: { selected: true } });
    expect(item.attributes('role')).toBe('listitem');
    expect(item.attributes('aria-selected')).toBeUndefined();
    expect(item.attributes('aria-checked')).toBeUndefined();
    item.unmount();
  });

  it('keeps checked state independent of menu radio highlight', async () => {
    const item = mount(DtListItem, {
      props: { id: 'radio', role: 'menuitemradio', selected: true, navigationType: 'arrow-keys' },
    });
    expect(item.attributes('aria-checked')).toBe('true');
    expect(item.attributes('aria-selected')).toBeUndefined();
    await item.trigger('mousemove');
    expect(item.classes()).toContain('d-list-item--highlighted');
    expect(item.attributes('aria-checked')).toBe('true');
    await item.setProps({ selected: false });
    expect(item.attributes('aria-checked')).toBe('false');
    item.unmount();
  });

  it.each(['Enter', 'Space'])('activates a menu radio once on %s with the default action prevented', async code => {
    const item = mount(DtListItem, {
      props: { id: 'radio', role: 'menuitemradio', navigationType: 'arrow-keys' },
    });
    await item.trigger('keydown', { key: code === 'Space' ? ' ' : code, code });
    expect(item.emitted('click')).toHaveLength(1);
    expect(item.emitted('click')[0][0].defaultPrevented).toBe(true);
    item.unmount();
  });

  it.each(['Enter', 'Space'])('refuses %s on a disabled menu radio with the default action still prevented', async code => {
    const item = mount(DtListItem, {
      props: { id: 'radio', role: 'menuitemradio', navigationType: 'arrow-keys', disabled: true },
    });
    await item.trigger('keydown', { key: code === 'Space' ? ' ' : code, code });
    expect(Object.keys(item.emitted())).toEqual(['keydown']);
    expect(item.emitted('keydown')[0][0].defaultPrevented).toBe(true);
    item.unmount();
  });

  it.each(['menuitem', 'option'])('preserves %s highlight markup without inferring a radio', async role => {
    const item = mount(DtListItem, { props: { role, selected: true, navigationType: 'arrow-keys' } });
    expect(item.attributes('role')).toBe(role);
    expect(item.attributes('aria-selected')).toBe('false');
    expect(item.attributes('aria-checked')).toBeUndefined();
    await item.trigger('mousemove');
    expect(item.attributes('aria-selected')).toBe('true');
    item.unmount();
  });
});
