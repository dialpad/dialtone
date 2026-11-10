import { config, mount } from '@vue/test-utils';
import { h, nextTick, ref } from 'vue';
import { flushPromises } from '@/common/utils';
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
  let showLastRadio;
  let onActivate;
  beforeEach(() => {
    showLastRadio = ref(true);
    onActivate = vi.fn();
    vi.stubGlobal('requestAnimationFrame', vi.fn());
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });
  const mountMenu = (props = {}, onKeydown) => {
    wrapper = mount(DtDropdown, {
      props: { open: true, ...props },
      attrs: { onKeydown },
      slots: {
        anchor: attrs => h('button', {
          'data-qa': 'trigger',
          'aria-expanded': attrs['aria-expanded'],
        }, 'Choose'),
        list: () => [
          h('li', { role: 'presentation', 'data-qa': 'heading' }, 'Choices'),
          h(DtListItem, { role: 'menuitemradio', id: 'radio:one', selected: true,
            navigationType: 'arrow-keys', onClick: onActivate }, () => 'Alpha'),
          h('li', { role: 'separator' }),
          h(DtListItem, { role: 'menuitem', id: 'action', navigationType: 'arrow-keys' }, () => 'Beta'),
          showLastRadio.value && h(DtListItem, {
            role: 'menuitemradio', id: 'radio two', navigationType: 'arrow-keys',
          }, () => h('span', { role: 'img', 'aria-label': 'Bravo icon', 'data-qa': 'nested-role' }, 'Bravo')),
          h('li', { role: 'menuitemradio', tabindex: -1 }, 'No ID'),
        ],
      },
      global: { plugins: [DtFocustrapDirective], stubs: { transition: false } },
      attachTo: document.body,
    });
    return wrapper.findComponent(DtPopover);
  };
  afterEach(() => { wrapper.unmount(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('navigates mixed menu roles without changing the checked row', async () => {
    const popover = mountMenu();
    await flushPromises();
    const list = popover.findComponent({ ref: 'content' }).find('[data-qa="dt-dropdown-list-wrapper"]');
    const send = (key, code = key) => list.trigger('keydown', { key, code });
    await send('ArrowDown');
    expect(document.activeElement.id).toBe('radio:one');
    await send('ArrowDown');
    expect(document.activeElement.id).toBe('action');
    await send('b', 'KeyB');
    expect(document.activeElement.id).toBe('radio two');
    await send('End');
    expect(document.activeElement.id).toBe('radio two');
    await send('ArrowDown');
    expect(document.activeElement.id).toBe('radio:one');
    await send('ArrowUp');
    expect(document.activeElement.id).toBe('radio two');
    await send('Home');
    expect(document.activeElement.id).toBe('radio:one');
    expect(list.find('[id="radio:one"]').attributes('aria-checked')).toBe('true');
    expect(list.find('[id="radio two"]').attributes('aria-checked')).toBe('false');
    await list.find('[data-qa="heading"]').trigger('mousemove');
    expect(document.activeElement.id).toBe('radio:one');
    await list.find('[data-qa="nested-role"]').trigger('mousemove');
    expect(document.activeElement.id).toBe('radio two');
  });

  it.each(['ArrowUp', 'ArrowDown'])('preserves first-row keyboard focus on uncontrolled %s opening', async code => {
    mountMenu({ open: null });
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
    wrapper.element.parentElement.removeEventListener('keydown', ancestor);
  });

  it('records keyboard modality before the parent accepts opening', async () => {
    mountMenu({ open: false, forwardAnchorArrowKeys: true }, () => {
      wrapper.setProps({ open: true });
    });
    await wrapper.find('[data-qa="trigger"]').trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    await flushPromises();
    expect(wrapper.emitted('keydown')).toHaveLength(1);
    expect(wrapper.emitted('open-change')).toEqual([[true]]);
    expect(document.activeElement.id).toBe('radio:one');
  });

  it.each(['Enter', 'Space'])('activates the focused menu radio once on %s', async code => {
    const popover = mountMenu();
    await flushPromises();
    const radio = popover.findComponent({ ref: 'content' }).find('[id="radio:one"]');
    await radio.trigger('keydown', { key: code === 'Space' ? ' ' : code, code });
    expect(onActivate).toHaveBeenCalledOnce();
    expect(onActivate.mock.calls[0][0].defaultPrevented).toBe(true);
    expect(radio.attributes('aria-checked')).toBe('true');
  });

  it('re-enumerates current menu contents without including headers or id-less radios', async () => {
    const popover = mountMenu();
    await flushPromises();
    const list = popover.findComponent({ ref: 'content' }).find('[data-qa="dt-dropdown-list-wrapper"]');
    await list.trigger('keydown', { key: 'End', code: 'End' });
    expect(document.activeElement.id).toBe('radio two');
    showLastRadio.value = false;
    await nextTick();
    await list.trigger('keydown', { key: 'End', code: 'End' });
    expect(document.activeElement.id).toBe('action');
  });

  it('clears an unconsumed arrow when a pointer opens in the same flush', async () => {
    mountMenu({ open: false, forwardAnchorArrowKeys: true });
    const trigger = wrapper.find('[data-qa="trigger"]');
    const arrow = trigger.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    const pointer = trigger.trigger('pointerdown');
    const click = trigger.trigger('click');
    const open = wrapper.setProps({ open: true });
    await Promise.all([arrow, pointer, click, open]);
    expect(wrapper.emitted('keydown')).toHaveLength(1);
    await flushPromises();
    expect(document.activeElement.getAttribute('role')).toBe('menu');
  });

  it('keeps controlled anchor arrows silent by default', async () => {
    mountMenu({ open: false });
    await wrapper.find('[data-qa="trigger"]').trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    expect(wrapper.emitted('keydown')).toBeUndefined();
    expect(wrapper.find('[data-qa="trigger"]').attributes('aria-expanded')).toBe('false');
  });
});
