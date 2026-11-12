import { config, mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { flushPromises } from '@/common/utils';
import { DtListItemGroup } from '@/components/ListItemGroup';
import { DtListItem } from '@/components/ListItem';
import { DtFocustrapDirective } from '@/directives/focustrap_directive';
import DtDropdown from './Dropdown.vue';
import SrOnlyCloseButton from '@/common/sr_only_close_button.vue';
import { DtPopover } from '@/components/Popover';

const MOCK_HIGHLIGHT_STUB = vi.fn();
const MOCK_UPDATE_OPEN_STUB = vi.fn();

const baseProps = {
  open: true,
};
const baseSlots = {
  anchor: anchorAttrs => h('button', {
    id: 'anchor',
    ref: element => { consumerTrigger = element; },
    'aria-expanded': anchorAttrs['aria-expanded'],
    'aria-controls': anchorAttrs['aria-controls'],
    'aria-haspopup': anchorAttrs['aria-haspopup'],
  }, 'Open menu'),
  list: `<ul id="list">
    <li role="menuitem">1</li>
    <li role="menuitem">2</li>
    <li role="menuitem">3</li>
  </ul>`,
};
const baseAttrs = {};

let consumerTrigger;
let mockProps = {};
let mockSlots = {};
let mockAttrs = {};

describe('DtDropdown Tests', () => {
  let wrapper;
  let anchorElement;
  let listWrapper;
  let popover;
  let popoverContent;
  let closeButton;

  const updateWrapper = () => {
    wrapper = mount(DtDropdown, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      attrs: { ...baseAttrs, ...mockAttrs },
      global: {
        stubs: {
          transition: false,
        },
      },
      attachTo: document.body,
    });

    anchorElement = wrapper.find('#anchor');
    popover = wrapper.findComponent({ ref: 'popover' });
    popoverContent = popover.findComponent({ ref: 'content' });
    listWrapper = popoverContent.find('[data-qa="dt-dropdown-list-wrapper"]');
    closeButton = wrapper.findComponent(SrOnlyCloseButton);
  };

  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    config.global.renderStubDefaultSlot = true;
    global.requestAnimationFrame = vi.fn();
    global.cancelAnimationFrame = vi.fn();
  });

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    config.global.renderStubDefaultSlot = false;
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    mockAttrs = {};
    vi.restoreAllMocks();
    wrapper.unmount();
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render the visually hidden close button', () => {
      expect(closeButton.exists()).toBe(true);
    });

    describe('When a list is provided', () => {
      it('should render the list wrapper', () => {
        expect(listWrapper.exists()).toBe(true);
      });

      it('should render the anchor', () => {
        expect(anchorElement.exists()).toBe(true);
      });

      it('should render the list', () => {
        expect(listWrapper.find('#list').exists()).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When the dropdown is not open', () => {
      it('aria-expanded should be "false"', () => {
        mockProps = { open: false };

        updateWrapper();

        expect(anchorElement.attributes('aria-expanded')).toBe('false');
      });
    });

    describe('When the dropdown is open', () => {
      it('should forward popup attributes without overwriting the consumer ref', () => {
        expect(anchorElement.attributes('aria-expanded')).toBe('true');
        expect(anchorElement.attributes('aria-controls')).toBe(popoverContent.attributes('id'));
        expect(anchorElement.attributes('aria-haspopup')).toBe('menu');
        expect(consumerTrigger).toBe(anchorElement.element);
      });
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(() => {
      mockAttrs = { onHighlight: MOCK_HIGHLIGHT_STUB, 'onUpdate:open': MOCK_UPDATE_OPEN_STUB };

      updateWrapper();
    });

    describe('When the highlightIndex changes', () => {
      beforeEach(() => {
        wrapper.vm.setHighlightIndex(1);
      });

      it('should call listener', () => {
        expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalled();
      });

      it('should emit highlight event', () => {
        expect(wrapper.emitted().highlight.length).toBe(1);
      });
    });

    it('should pass listeners to the popover', async () => {
      await wrapper.findComponent(DtPopover).vm.$emit('update:open', false);

      expect(MOCK_UPDATE_OPEN_STUB).toHaveBeenCalledWith(false);
    });

    describe('When mouseleave is detected on the list wrapper', () => {
      it('should reset the highlightIndex', async () => {
        await listWrapper.trigger('mouseleave');

        expect(wrapper.vm.highlightIndex).toBe(-1);
      });
    });

    describe('When visually hidden close button is clicked', () => {
      it('should close the dropdown', async () => {
        await closeButton.trigger('click');

        expect(anchorElement.attributes('aria-expanded')).toBe('false');
      });
    });
  });
});

describe('Dropdown menu roles and controlled arrow opt-in', () => {
  let wrapper;
  let visibilityChanges;
  let actions;
  beforeEach(() => {
    visibilityChanges = vi.fn();
    actions = [];
    vi.stubGlobal('requestAnimationFrame', vi.fn());
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });
  const mountMenu = (props = {}, onKeydown, list, attrs = {}) => {
    wrapper = mount(DtDropdown, {
      props: { open: true, visibilityChangeCallback: visibilityChanges, ...props },
      attrs: { onKeydown, ...attrs },
      slots: {
        anchor: attrs => h('button', {
          'data-qa': 'trigger',
          'aria-expanded': attrs['aria-expanded'],
        }, 'Choose'),
        list: list || (() => [
          h('li', { role: 'presentation', 'data-qa': 'heading' }, 'Choices'),
          h(DtListItem, { role: 'menuitemradio', id: 'radio:one', selected: true,
            navigationType: 'arrow-keys', onClick: () => actions.push('Alpha') }, () => 'Alpha'),
          h('li', { role: 'separator' }),
          h(DtListItem, { role: 'menuitem', id: 'action', navigationType: 'arrow-keys',
            onClick: () => actions.push('Beta') }, () => 'Beta'),
          h(DtListItem, {
            role: 'menuitemradio', id: 'radio two', navigationType: 'arrow-keys',
            onClick: () => actions.push('Bravo'),
          }, () => h('span', { role: 'img', 'aria-label': 'Bravo icon', 'data-qa': 'nested-role' }, 'Bravo')),
          h('li', { role: 'menuitemradio', tabindex: -1 }, 'No ID'),
        ]),
      },
      global: { plugins: [DtFocustrapDirective], stubs: { transition: false } },
      attachTo: document.body,
    });
    return wrapper.findComponent(DtPopover);
  };
  afterEach(() => { wrapper.unmount(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('preserves consumer popup classes while scoping keyboard Close visibility', async () => {
    const popover = mountMenu({}, undefined, undefined, {
      'dialog-class': ['consumer-kebab', { 'consumer-active': true }],
      dialogClass: { 'consumer-camel': true, 'consumer-inactive': false },
    });
    await flushPromises();
    const content = popover.findComponent({ ref: 'content' });
    expect(content.classes()).toEqual(expect.arrayContaining([
      'consumer-kebab', 'consumer-active', 'consumer-camel', 'd-dropdown__menu--arrow-keys',
    ]));
    expect(content.classes()).not.toContain('consumer-inactive');
    for (const navigationType of ['tab', 'none']) {
      await wrapper.setProps({ navigationType });
      expect(content.classes()).not.toContain('d-dropdown__menu--arrow-keys');
      expect(content.classes()).toEqual(expect.arrayContaining([
        'consumer-kebab', 'consumer-active', 'consumer-camel',
      ]));
    }
    await wrapper.setProps({ navigationType: 'arrow-keys' });
    expect(content.classes()).toContain('d-dropdown__menu--arrow-keys');
    await wrapper.setProps({ dialogClass: 'consumer-updated', 'dialog-class': ['consumer-kebab-updated'] });
    expect(content.classes()).toEqual(expect.arrayContaining([
      'consumer-updated', 'consumer-kebab-updated', 'd-dropdown__menu--arrow-keys',
    ]));
    expect(content.classes()).not.toContain('consumer-camel');
    expect(content.classes()).not.toContain('consumer-kebab');
  });

  it.each([false, true])('navigates mixed menu roles and Close with showCloseButton=%s', async showCloseButton => {
    const popover = mountMenu({ showCloseButton });
    await flushPromises();
    const content = popover.findComponent({ ref: 'content' });
    const list = content.find('[data-qa="dt-dropdown-list-wrapper"]');
    const close = content.get(showCloseButton
      ? '[data-qa="dt-popover-close"]'
      : '[data-qa="dt-sr-only-close-button"]');
    expect(close.attributes('role')).toBe('menuitem');
    expect(content.element.contains(close.element)).toBe(true);
    expect(list.element.contains(close.element)).toBe(false);
    const send = (key, code = key) => list.trigger('keydown', { key, code });
    await send('ArrowDown');
    expect(document.activeElement.id).toBe('radio:one');
    await send('ArrowDown');
    expect(document.activeElement.id).toBe('action');
    await send('b', 'KeyB');
    expect(document.activeElement.id).toBe('radio two');
    expect(wrapper.emitted('highlight')).toEqual([[0], [1]]);
    await send('End');
    expect(document.activeElement).toBe(close.element);
    expect(wrapper.emitted('highlight')).toEqual([[0], [1]]);
    await close.trigger('keydown', { key: 'ArrowUp', code: 'ArrowUp' });
    expect(document.activeElement.id).toBe('radio two');
    await send('ArrowDown');
    expect(document.activeElement).toBe(close.element);
    await close.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    expect(document.activeElement.id).toBe('radio:one');
    await send('ArrowUp');
    expect(document.activeElement).toBe(close.element);
    await close.trigger('keydown', { key: 'Home', code: 'Home' });
    expect(document.activeElement.id).toBe('radio:one');
    expect(list.find('[id="radio:one"]').attributes('aria-checked')).toBe('true');
    expect(list.find('[id="radio two"]').attributes('aria-checked')).toBe('false');
    expect(wrapper.emitted('highlight')).toEqual([[0], [1], [0], [0]]);
    expect(actions).toEqual([]);
    await close.trigger('keydown', { key: 'Escape', code: 'Escape' });
    await flushPromises();
    expect(wrapper.find('[data-qa="trigger"]').attributes('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(wrapper.get('[data-qa="trigger"]').element);
  });

  it('targets the owning menu row when hovering nested-role content', async () => {
    const popover = mountMenu();
    await flushPromises();
    const list = popover.findComponent({ ref: 'content' });
    list.element.focus();
    await list.find('[data-qa="nested-role"]').trigger('mousemove');
    expect(document.activeElement.id).toBe('radio two');
    await list.get('[id="radio two"]').trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    expect(document.activeElement).toBe(list.get('[data-qa="dt-sr-only-close-button"]').element);
    await list.get('#action').trigger('mousemove');
    expect(document.activeElement.id).toBe('action');
    await list.get('#action').trigger('keydown', { key: 'Enter', code: 'Enter' });
    await list.get('#action').trigger('keydown', { key: ' ', code: 'Space' });
    expect(actions).toEqual(['Beta', 'Beta']);
    expect(wrapper.emitted('highlight')).toEqual([[1]]);
  });

  it.each([false, true])('focuses only Close in an empty keyboard-opened menu with showCloseButton=%s',
    async showCloseButton => {
      const popover = mountMenu({ open: null, showCloseButton }, undefined, () => []);
      await wrapper.get('[data-qa="trigger"]').trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
      await flushPromises();
      const content = popover.findComponent({ ref: 'content' });
      const close = content.get(showCloseButton
        ? '[data-qa="dt-popover-close"]'
        : '[data-qa="dt-sr-only-close-button"]');
      expect(document.activeElement).toBe(close.element);
      for (const key of ['ArrowUp', 'ArrowDown', 'Home', 'End']) {
        await close.trigger('keydown', { key, code: key });
        expect(document.activeElement).toBe(close.element);
      }
      expect(wrapper.emitted('highlight')).toBeUndefined();
    });

  it.each(['dialog', 'listbox'])('preserves legacy row boundaries with popup role=%s', async role => {
    const popover = mountMenu({ role });
    await flushPromises();
    const content = popover.findComponent({ ref: 'content' });
    expect(content.attributes('role')).toBe(role);
    expect(content.classes()).not.toContain('d-dropdown__menu--arrow-keys');
    await content.trigger('keydown', { key: 'End', code: 'End' });
    expect(document.activeElement.id).toBe('radio two');
    await content.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    expect(document.activeElement.id).toBe('radio:one');
    await content.trigger('keydown', { key: 'ArrowUp', code: 'ArrowUp' });
    expect(document.activeElement.id).toBe('radio two');
  });

  it('preserves custom callbacks at the application row boundaries', async () => {
    const beginning = vi.fn();
    const end = vi.fn();
    const popover = mountMenu({ onBeginningOfList: beginning, onEndOfList: end });
    await flushPromises();
    const content = popover.findComponent({ ref: 'content' });
    await content.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    await content.trigger('keydown', { key: 'ArrowUp', code: 'ArrowUp' });
    expect(beginning).toHaveBeenCalledExactlyOnceWith();
    expect(document.activeElement.id).toBe('radio:one');
    await content.trigger('keydown', { key: 'End', code: 'End' });
    const close = content.get('[data-qa="dt-sr-only-close-button"]');
    expect(document.activeElement).toBe(close.element);
    await close.trigger('keydown', { key: 'ArrowUp', code: 'ArrowUp' });
    expect(document.activeElement.id).toBe('radio two');
    await content.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    expect(end).toHaveBeenCalledExactlyOnceWith();
    expect(document.activeElement.id).toBe('radio two');
    expect(actions).toEqual([]);
  });

  it.each([false, true])('dismisses the owning Close without a choice event with showCloseButton=%s',
    async showCloseButton => {
      const foreign = mount(DtPopover, {
        props: { open: true, modal: false },
        slots: { anchor: () => h('button', 'Another popup') },
        global: { plugins: [DtFocustrapDirective], stubs: { transition: false } },
        attachTo: document.body,
      });
      try {
        const popover = mountMenu({ showCloseButton });
        await flushPromises();
        const content = popover.findComponent({ ref: 'content' });
        const close = content.get(showCloseButton
          ? '[data-qa="dt-popover-close"]'
          : '[data-qa="dt-sr-only-close-button"]');
        await content.trigger('keydown', { key: 'End', code: 'End' });
        expect(document.activeElement).toBe(close.element);
        if (showCloseButton) await close.trigger('click');
        else await close.trigger('keydown', { key: ' ', code: 'Space' });
        await flushPromises();
        expect(wrapper.get('[data-qa="trigger"]').attributes('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(wrapper.get('[data-qa="trigger"]').element);
        expect(foreign.get('button').attributes('aria-expanded')).toBe('true');
        expect(wrapper.emitted('highlight')).toEqual([[-1]]);
        expect(actions).toEqual([]);
        expect(visibilityChanges.mock.calls).toEqual([[true], [false]]);
      } finally {
        foreign.unmount();
      }
    });

  it('preserves non-li rows without pointer-driven menu focus or highlight events', async () => {
    const popover = mountMenu({}, undefined, () => [
      h(DtListItem, { id: 'div-first', role: 'menuitem', elementType: 'div',
        navigationType: 'arrow-keys' }, () => 'First'),
      h(DtListItem, { id: 'div-second', role: 'menuitem', elementType: 'div',
        navigationType: 'arrow-keys' }, () => 'Second'),
    ]);
    await flushPromises();
    const content = popover.findComponent({ ref: 'content' });
    content.element.focus();
    await content.get('#div-second').trigger('mousemove');
    expect(document.activeElement).toBe(content.element);
    expect(wrapper.emitted('highlight')).toBeUndefined();
  });

  it('navigates anchor arrows when initially open with the opt-in', async () => {
    mountMenu({ open: true, forwardAnchorArrowKeys: true });
    await flushPromises();
    await wrapper.find('[data-qa="trigger"]').trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    expect(visibilityChanges.mock.calls).toEqual([[true]]);
    expect(wrapper.emitted('keydown')[0][0].defaultPrevented).toBe(true);
    expect(document.activeElement.id).toBe('radio:one');
  });

  it('preserves legacy highlight notifications when hovering a group heading', async () => {
    const popover = mountMenu({}, undefined, () => [
      h(DtListItemGroup, { id: 'sort-options', heading: 'Sort order' }, () => [
        h(DtListItem, { id: 'newest', role: 'menuitemradio', selected: true,
          navigationType: 'arrow-keys' }, () => 'Newest'),
        h(DtListItem, { id: 'oldest', role: 'menuitemradio', navigationType: 'arrow-keys' }, () => 'Oldest'),
        h(DtListItem, { id: 'refresh', role: 'menuitem', navigationType: 'arrow-keys' }, () => 'Refresh'),
      ]),
    ]);
    await flushPromises();
    const list = popover.findComponent({ ref: 'content' });
    await list.get('#oldest').trigger('mousemove');
    expect(wrapper.emitted('highlight')).toEqual([[1]]);
    await list.get('#sort-options-heading').trigger('mousemove');
    await list.get('#sort-options-heading').trigger('mousemove');
    expect(wrapper.emitted('highlight')).toEqual([[1], [-1]]);
    expect(list.get('#oldest').classes()).not.toContain('d-list-item--highlighted');
    expect(document.activeElement.id).toBe('oldest');
    expect(list.get('#newest').attributes('aria-checked')).toBe('true');
  });

  it('keeps the menu context through a neutral wrapper and an explicitly labelled group', async () => {
    const popover = mountMenu({}, undefined, () => [
      h(DtListItemGroup, { id: 'sort-group', heading: 'Sort order' }, () => [
        h(DtListItem, { role: 'menuitemradio', selected: true, navigationType: 'arrow-keys' }, () => 'Newest'),
      ]),
      h(DtListItem, { role: 'menuitem', navigationType: 'arrow-keys' }, () => 'Refresh'),
    ]);
    await flushPromises();
    const menu = popover.findComponent({ ref: 'content' });
    const list = menu.find('[data-qa="dt-dropdown-list-wrapper"]');
    const group = list.find('[role="group"]');
    expect(menu.attributes('role')).toBe('menu');
    expect(list.attributes('role')).toBe('none');
    expect(group.find('[role="menuitemradio"]').element.parentElement).toBe(group.element);
    expect(group.element.parentElement).toBe(list.element);
    expect(group.element.parentElement.closest('ul:not([role]), ol:not([role])')).toBeNull();
    expect(list.find('[role="menuitem"]').element.parentElement).toBe(list.element);
  });

  it('keeps closing-content arrows out of the closed-anchor opening path', async () => {
    const popover = mountMenu({ open: true, forwardAnchorArrowKeys: true });
    await flushPromises();
    const content = popover.findComponent({ ref: 'content' });
    const list = content.find('[data-qa="dt-dropdown-list-wrapper"]');
    let releaseFocus;
    let focusRequested;
    const leaving = new Promise(resolve => { focusRequested = resolve; });
    vi.spyOn(popover.vm, 'getFirstFocusableElement').mockImplementationOnce(() => {
      focusRequested();
      return new Promise(resolve => { releaseFocus = resolve; });
    });
    await wrapper.setProps({ open: false });
    await leaving;
    await list.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    expect(wrapper.emitted('keydown')).toHaveLength(1);
    expect(wrapper.emitted('keydown')[0][0].defaultPrevented).toBe(true);
    expect(wrapper.find('[data-qa="trigger"]').attributes('aria-expanded')).toBe('false');
    releaseFocus(wrapper.find('[data-qa="trigger"]').element);
    await flushPromises();
  });

  it.each([
    { code: 'ArrowUp', showCloseButton: false },
    { code: 'ArrowDown', showCloseButton: true },
  ])('preserves first-row keyboard focus on $code opening with showCloseButton=$showCloseButton',
    async ({ code, showCloseButton }) => {
      mountMenu({ open: null, showCloseButton });
      await wrapper.find('[data-qa="trigger"]').trigger('keydown', { key: code, code });
      await flushPromises();
      expect(wrapper.emitted('keydown')).toHaveLength(1);
      expect(document.activeElement.id).toBe('radio:one');
    });

  it('forwards one closed controlled arrow without suppressing an ancestor and forgets ignored modality', async () => {
    mountMenu({ open: false, forwardAnchorArrowKeys: true });
    const ancestor = vi.fn();
    wrapper.element.parentElement.addEventListener('keydown', ancestor);
    await wrapper.find('[data-qa="trigger"]').trigger('keydown', {
      key: 'ArrowDown', code: 'ArrowDown',
    });
    expect(wrapper.emitted('keydown')).toHaveLength(1);
    const event = wrapper.emitted('keydown')[0][0];
    expect(ancestor).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(false);
    await nextTick();
    await wrapper.find('[data-qa="trigger"]').trigger('click');
    await wrapper.setProps({ open: true });
    await flushPromises();
    expect(document.activeElement.getAttribute('role')).toBe('menu');
  });

  it('records keyboard modality before the parent accepts opening', async () => {
    mountMenu({ open: false, forwardAnchorArrowKeys: true }, () => {
      wrapper.setProps({ open: true });
    });
    await wrapper.find('[data-qa="trigger"]').trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    await flushPromises();
    expect(visibilityChanges.mock.calls).toEqual([[true]]);
    expect(document.activeElement.id).toBe('radio:one');
  });

  it('keeps controlled anchor arrows silent by default', async () => {
    mountMenu({ open: false });
    await wrapper.find('[data-qa="trigger"]').trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    expect(wrapper.emitted('keydown')).toBeUndefined();
    expect(wrapper.find('[data-qa="trigger"]').attributes('aria-expanded')).toBe('false');
  });
});
