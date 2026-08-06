import { mount } from '@vue/test-utils';
import DtScroller from './scroller.vue';
import CoreScroller from './modules/core_scroller.vue';

const MOCK_ITEMS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
}));

// jsdom doesn't compute layout — mock the scroll dimensions the props imply
// (20 items x itemSize 30 = 600 of content in a 60px viewport) so the render
// pool can actually reach the last item.
const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
const originalScrollHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight');

function mockScrollDimensions () {
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get () { return 60; },
  });
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get () { return 600; },
  });
}

function restoreScrollDimensions () {
  if (originalClientHeight) {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight);
  } else {
    delete HTMLElement.prototype.clientHeight;
  }
  if (originalScrollHeight) {
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', originalScrollHeight);
  } else {
    delete HTMLElement.prototype.scrollHeight;
  }
}

const baseProps = {
  items: MOCK_ITEMS,
  itemSize: 30,
  scrollerHeight: 60,
  scrollerWidth: 60,
};
const baseSlots = {
  default: ` <div class="user">
          {{ item.name }}
        </div>`,
};

let mockProps = {};
let mockSlots = {};

describe('DtScroller Tests', () => {
  let wrapper;
  let defaultContent;

  const updateWrapper = () => {
    wrapper = mount(DtScroller, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
    });

    defaultContent = wrapper.find('[data-qa="dt-scroller"]');
  };

  beforeEach(() => {
    global.requestAnimationFrame = cb => cb();
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When scroller renders', () => {
      it('scroller exist', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('scroller content should render correctly', () => {
        expect(defaultContent.exists()).toBe(true);
      });
    });

    describe('When a buffer is provided', () => {
      beforeEach(() => {
        mockProps = { buffer: 500 };
        updateWrapper();
      });

      it('declares buffer as its own prop and passes it to the underlying scroller', () => {
        expect(wrapper.props('buffer')).toBe(500);
        expect(wrapper.findComponent(CoreScroller).props('buffer')).toBe(500);
      });
    });

    describe('When no buffer is provided', () => {
      it('defaults the buffer to 200', () => {
        expect(wrapper.props('buffer')).toBe(200);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Should emit', () => {
      it('`top` event when scroll reach the top of the component', () => {
        defaultContent.element.scrollTop = 25;
        wrapper.trigger('scroll');
        defaultContent.element.scrollTop = 0;
        wrapper.trigger('scroll');

        expect(wrapper.emitted()['user-position'][1]).toEqual(['top']);
      });

      it('`middle` on scroll', () => {
        defaultContent.element.scrollTop = 25;
        wrapper.trigger('scroll');

        expect(wrapper.emitted()['user-position'][0]).toEqual(['middle']);
      });

      it('`bottom` event when scroll reach the bottom of the component', () => {
        defaultContent.element.scrollTop = defaultContent.element.scrollHeight - defaultContent.element.clientHeight;
        wrapper.trigger('scroll');

        expect(wrapper.emitted()['user-position'][2]).toEqual(['bottom']);
      });
    });

    describe('Should emit scroll boundary events', () => {
      beforeEach(() => {
        // Must be mocked before mounting — the pool is first computed in onMounted.
        mockScrollDimensions();
        updateWrapper();
      });

      afterEach(() => {
        restoreScrollDimensions();

        // Confirm the mock actually came off, rather than trusting the delete/restore
        // logic silently — a leaked mock would make every later test see clientHeight 60.
        expect(document.createElement('div').clientHeight).toBe(0);
      });

      it('`scroll-end` when the last item enters the render pool', () => {
        expect(wrapper.emitted()['scroll-end']).toBeUndefined();

        defaultContent.element.scrollTop =
          defaultContent.element.scrollHeight - defaultContent.element.clientHeight;
        wrapper.trigger('scroll');

        expect(wrapper.emitted()['scroll-end']).toBeTruthy();
      });

      it('`scroll-start` when the first item re-enters the render pool', () => {
        // 240 is chosen so the window starts at index 1 (240 - buffer 200 = 40, over
        // itemSize 30) while still overlapping the mount window — the algorithm only
        // releases off-window views on a continuous move, and a view must be released
        // before it can count as newly used again.
        defaultContent.element.scrollTop = 240;
        wrapper.trigger('scroll');

        const beforeReturn = wrapper.emitted()['scroll-start'].length;

        defaultContent.element.scrollTop = 0;
        wrapper.trigger('scroll');

        expect(wrapper.emitted()['scroll-start'].length).toBeGreaterThan(beforeReturn);
      });
    });

    describe('On `scrollToItem` event', () => {
      it('should scroll to the item', () => {
        wrapper.vm.scrollToItem(15);
        wrapper.trigger('scroll');

        expect(defaultContent.element.scrollTop).toBe(450);
      });
    });
  });

  describe('Slot Tests', () => {
    describe('When before, after and empty slots are provided', () => {
      beforeEach(() => {
        mockSlots = {
          before: '<div class="before-content">Before</div>',
          after: '<div class="after-content">After</div>',
          empty: '<div class="empty-content">Empty</div>',
        };
        updateWrapper();
      });

      it('renders the before slot in a scroller slot wrapper', () => {
        const before = wrapper.find('.before-content');

        expect(before.exists()).toBe(true);
        expect(before.element.parentElement.classList.contains('vue-recycle-scroller__slot')).toBe(true);
      });

      it('renders the after slot in a scroller slot wrapper', () => {
        const after = wrapper.find('.after-content');

        expect(after.exists()).toBe(true);
        expect(after.element.parentElement.classList.contains('vue-recycle-scroller__slot')).toBe(true);
      });

      it('renders the empty slot inside the item wrapper', () => {
        const empty = wrapper.find('.empty-content');

        expect(empty.exists()).toBe(true);
        expect(empty.element.closest('.vue-recycle-scroller__item-wrapper')).not.toBeNull();
      });
    });

    describe('When no before or after slot is provided', () => {
      it('renders no empty slot wrapper', () => {
        expect(wrapper.find('.vue-recycle-scroller__slot').exists()).toBe(false);
      });
    });

    describe('When a before slot occupies space in the scroll viewport', () => {
      beforeEach(() => {
        // Must be mocked before mounting — the pool is first computed in onMounted.
        mockScrollDimensions();
        mockSlots = {
          before: '<div class="before-content">Before</div>',
        };
        updateWrapper();
      });

      afterEach(() => {
        restoreScrollDimensions();

        // Confirm the mock actually came off, rather than trusting the delete/restore
        // logic silently — a leaked mock would make every later test see clientHeight 60.
        expect(document.createElement('div').clientHeight).toBe(0);
      });

      it('renders the first item once the before slot size is accounted for', async () => {
        // The mocked before wrapper reports the same 600px scrollHeight as the mocked
        // clientHeight/scrollHeight of every element, so scrolling to 300 only keeps the
        // first item (index 0) in the render pool if its size is subtracted from the
        // window. Otherwise the window starts further down the list and index 0 gets
        // recycled away to represent a later item instead.
        defaultContent.element.scrollTop = 300;
        await wrapper.trigger('scroll');

        const firstItem = wrapper.findAll('.vue-recycle-scroller__item-view')
          .find((item) => item.text().trim() === 'User 0');

        expect(firstItem).toBeTruthy();
        expect(firstItem.element.style.transform).toContain('translateY(0px)');
      });
    });

    describe('When in dynamic mode', () => {
      beforeEach(() => {
        mockProps = { dynamic: true, minItemSize: 54, itemSize: undefined, buffer: 350 };
        mockSlots = { after: '<div class="after-content">After</div>' };
        updateWrapper();
      });

      it('forwards the after slot', () => {
        expect(wrapper.find('.after-content').exists()).toBe(true);
      });

      it('forwards the buffer prop to the inner CoreScroller', () => {
        expect(wrapper.findComponent(CoreScroller).props('buffer')).toBe(350);
      });
    });

    describe('When in dynamic mode with no before, empty or after slots provided', () => {
      beforeEach(() => {
        mockProps = { dynamic: true, minItemSize: 54, itemSize: undefined };
        updateWrapper();
      });

      it('renders no empty slot wrapper', () => {
        expect(wrapper.find('.vue-recycle-scroller__slot').exists()).toBe(false);
      });
    });
  });
});
