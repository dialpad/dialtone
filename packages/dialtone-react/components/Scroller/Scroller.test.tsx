import { createRef, type ReactNode } from 'react';
import { act, fireEvent, render, type RenderResult } from '@testing-library/react';
import type { Mock } from 'vitest';
import { DtScroller, type DtScrollerHandle, type DtScrollerProps, type ScrollerUserPosition } from './Scroller';

interface User {
  id: number;
  name: string;
}

const MOCK_ITEMS: User[] = Array.from({ length: 20 }, (_, i) => ({
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
  const prototype = HTMLElement.prototype as unknown as Record<string, unknown>;
  if (originalClientHeight) {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight);
  } else {
    delete prototype.clientHeight;
  }
  if (originalScrollHeight) {
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', originalScrollHeight);
  } else {
    delete prototype.scrollHeight;
  }
}

type Props = Partial<DtScrollerProps<User>>;

const baseProps: Props = {
  items: MOCK_ITEMS,
  itemSize: 30,
  scrollerHeight: 60,
  scrollerWidth: 60,
};
const baseSlots: Props = {
  children: ({ item }) => (
    <div className="user">
      {item.name}
    </div>
  ),
};

let mockProps: Props = {};
let mockSlots: { before?: ReactNode; after?: ReactNode; empty?: ReactNode } = {};

describe('DtScroller Tests', () => {
  let wrapper: RenderResult;
  let defaultContent: HTMLElement;
  let scroller: ReturnType<typeof createRef<DtScrollerHandle>>;
  let onUserPosition: Mock<(position: ScrollerUserPosition) => void>;
  let onScrollStart: Mock<() => void>;
  let onScrollEnd: Mock<() => void>;

  const updateWrapper = () => {
    wrapper?.unmount();
    scroller = createRef<DtScrollerHandle>();
    onUserPosition = vi.fn<(position: ScrollerUserPosition) => void>();
    onScrollStart = vi.fn<() => void>();
    onScrollEnd = vi.fn<() => void>();
    const props = { ...baseProps, ...baseSlots, ...mockProps, ...mockSlots } as DtScrollerProps<User>;
    wrapper = render(
      <DtScroller
        {...props}
        ref={scroller}
        onUserPosition={onUserPosition}
        onScrollStart={onScrollStart}
        onScrollEnd={onScrollEnd}
      />,
    );

    defaultContent = wrapper.getByTestId('dt-scroller');
  };

  const items = () => wrapper.getAllByTestId('dt-scroller-item');

  const scrollTo = (scrollTop: number) => {
    defaultContent.scrollTop = scrollTop;
    fireEvent.scroll(defaultContent);
  };

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { cb(0); return 0; });
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    vi.unstubAllGlobals();
  });

  describe('Presentation Tests', () => {
    describe('When scroller renders', () => {
      it('scroller exist', () => {
        expect(wrapper.container.firstElementChild).not.toBeNull();
      });

      it('scroller content should render correctly', () => {
        expect(defaultContent).toBeInTheDocument();
      });
    });

    describe('When a buffer is provided', () => {
      beforeEach(() => {
        mockProps = { buffer: 500 };
        updateWrapper();
      });

      // Vue reads the prop on DtScroller and on its CoreScroller. Here, its effect: with an empty viewport, the
      // buffer alone decides how many items render, ceil(500 / itemSize 30) = 17.
      it('declares buffer as its own prop and passes it to the underlying scroller', () => {
        expect(items()).toHaveLength(17);
      });
    });

    describe('When no buffer is provided', () => {
      // ceil(200 / itemSize 30) = 7 items.
      it('defaults the buffer to 200', () => {
        expect(items()).toHaveLength(7);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Should emit', () => {
      it('`blockStart` event when scroll reach the block-start (aka top) of the component', () => {
        scrollTo(25);
        scrollTo(0);

        expect(onUserPosition.mock.calls[1]).toEqual(['blockStart']);
      });

      it.skip('`top` deprecated event when scroll reach the block-start (aka top) of the component', () => {
        // The deprecated `top` value isn't ported (skips.json).
      });

      it('`middle` on scroll', () => {
        scrollTo(25);

        expect(onUserPosition.mock.calls[0]).toEqual(['middle']);
      });

      it('`blockEnd` event when scroll reach the block-end (aka bottom) of the component', () => {
        scrollTo(defaultContent.scrollHeight - defaultContent.clientHeight);

        // Vue's call 3: middle, blockStart and the deprecated top come first. Without top, it's call 2.
        expect(onUserPosition.mock.calls[2]).toEqual(['blockEnd']);
        expect(onUserPosition.mock.calls).toEqual([['middle'], ['blockStart'], ['blockEnd']]);
      });

      it.skip('`bottom` deprecated event when scroll reach the block-end (aka bottom) of the component', () => {
        // The deprecated `bottom` value isn't ported (skips.json).
      });
    });

    describe('Should emit scroll boundary events', () => {
      beforeEach(() => {
        // Must be mocked before mounting — the pool is first computed on mount.
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
        expect(onScrollEnd).not.toHaveBeenCalled();

        scrollTo(defaultContent.scrollHeight - defaultContent.clientHeight);

        expect(onScrollEnd).toHaveBeenCalled();
      });

      it('`scroll-start` when the first item re-enters the render pool', () => {
        // 240 is chosen so the window starts at index 1 (240 - buffer 200 = 40, over
        // itemSize 30) while still overlapping the mount window — the algorithm only
        // releases off-window views on a continuous move, and a view must be released
        // before it can count as newly used again.
        scrollTo(240);

        const beforeReturn = onScrollStart.mock.calls.length;

        scrollTo(0);

        expect(onScrollStart.mock.calls.length).toBeGreaterThan(beforeReturn);
      });
    });

    describe('On `scrollToItem` event', () => {
      it('should scroll to the item', () => {
        scroller.current!.scrollToItem(15);
        fireEvent.scroll(defaultContent);

        expect(defaultContent.scrollTop).toBe(450);
      });
    });

    // React only: Vue's updateItems() looks item indexes up on a computed ref instead of its value, so it released
    // every view and counted it as newly used again, firing scroll-start again (and passing an undefined index).
    describe('On `updateItems`', () => {
      it('keeps each item\'s index and does not report scroll-start again', () => {
        const indexes = () => items().map(item => item.textContent?.trim());
        const before = indexes();

        act(() => scroller.current!.updateItems());

        expect(indexes()).toEqual(before);
        expect(onScrollStart).toHaveBeenCalledTimes(1);
      });
    });

    describe('When the required size props are missing', () => {
      it('logs an error once per change of props', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        try {
          const { rerender } = render(<DtScroller items={MOCK_ITEMS} />);
          expect(error).toHaveBeenCalledTimes(1);
          expect(error).toHaveBeenCalledWith('scroller error: \'itemSize\' is required.');

          rerender(<DtScroller items={MOCK_ITEMS} dynamic />);
          expect(error).toHaveBeenCalledTimes(2);
          expect(error).toHaveBeenLastCalledWith('scroller error: \'minItemSize\' is required on \'dynamic\' mode.');
        } finally {
          error.mockRestore();
        }
      });
    });

    describe('When unmounted before the mounted nextTick callback fires', () => {
      it('does not throw reading scrollTop off a null root element', () => {
        // Mount and unmount at once, then run whatever the mount left pending (the sort timer, a scroll frame).
        vi.useFakeTimers();
        try {
          const fresh = render(<DtScroller {...(baseProps as DtScrollerProps<User>)} {...baseSlots} />);
          fireEvent.scroll(fresh.container.firstElementChild!);
          fresh.unmount();

          expect(() => vi.runAllTimers()).not.toThrow();
        } finally {
          vi.useRealTimers();
        }
      });
    });
  });

  describe('Slot Tests', () => {
    describe('When before, after and empty slots are provided', () => {
      beforeEach(() => {
        mockSlots = {
          before: <div className="before-content">Before</div>,
          after: <div className="after-content">After</div>,
          empty: <div className="empty-content">Empty</div>,
        };
        updateWrapper();
      });

      it('renders the before slot in a scroller slot wrapper', () => {
        const before = wrapper.container.querySelector('.before-content');

        expect(before).not.toBeNull();
        expect(before!.parentElement!.getAttribute('data-qa')).toBe('dt-scroller-before');
      });

      it('renders the after slot in a scroller slot wrapper', () => {
        const after = wrapper.container.querySelector('.after-content');

        expect(after).not.toBeNull();
        expect(after!.parentElement!.getAttribute('data-qa')).toBe('dt-scroller-after');
      });
    });

    describe('When the empty slot is provided and the list is empty', () => {
      beforeEach(() => {
        mockProps = { items: [] };
        mockSlots = { empty: <div className="empty-content">Empty</div> };
        updateWrapper();
      });

      it('renders the empty slot content inside the item wrapper', () => {
        const empty = wrapper.container.querySelector('.empty-content');

        expect(empty).not.toBeNull();
        expect(empty!.closest('[data-qa="dt-scroller-item-wrapper"]')).not.toBeNull();
      });
    });

    describe('When the empty slot is provided and the list is populated', () => {
      beforeEach(() => {
        mockSlots = { empty: <div className="empty-content">Empty</div> };
        updateWrapper();
      });

      it('does not render the empty slot content', () => {
        expect(wrapper.container.querySelector('.empty-content')).toBeNull();
      });
    });

    describe('When no before or after slot is provided', () => {
      it('renders no empty slot wrapper', () => {
        expect(wrapper.queryByTestId('dt-scroller-before')).toBeNull();
        expect(wrapper.queryByTestId('dt-scroller-after')).toBeNull();
      });
    });

    describe('When a before slot occupies space in the scroll viewport', () => {
      beforeEach(() => {
        // Must be mocked before mounting — the pool is first computed on mount.
        mockScrollDimensions();
        mockSlots = {
          before: <div className="before-content">Before</div>,
        };
        updateWrapper();
      });

      afterEach(() => {
        restoreScrollDimensions();

        // Confirm the mock actually came off, rather than trusting the delete/restore
        // logic silently — a leaked mock would make every later test see clientHeight 60.
        expect(document.createElement('div').clientHeight).toBe(0);
      });

      it('renders the first item once the before slot size is accounted for', () => {
        // The mocked before wrapper reports the same 600px scrollHeight as the mocked
        // clientHeight/scrollHeight of every element, so scrolling to 300 only keeps the
        // first item (index 0) in the render pool if its size is subtracted from the
        // window. Otherwise the window starts further down the list and index 0 gets
        // recycled away to represent a later item instead.
        scrollTo(300);

        const firstItem = items().find(item => item.textContent?.trim() === 'User 0');

        expect(firstItem).toBeTruthy();
        expect(firstItem!.style.transform).toContain('translateY(0px)');
      });
    });

    describe('When in dynamic mode', () => {
      beforeEach(() => {
        mockProps = { dynamic: true, minItemSize: 54, itemSize: undefined, buffer: 350 };
        mockSlots = { after: <div className="after-content">After</div> };
        updateWrapper();
      });

      it('forwards the after slot', () => {
        expect(wrapper.container.querySelector('.after-content')).not.toBeNull();
      });

      // Vue reads the prop on the inner CoreScroller. Here, its effect: with an empty viewport and items of
      // minItemSize 54, a 350 buffer renders the items starting below 350, 7 of them (a 200 buffer renders 4).
      it('forwards the buffer prop to the inner CoreScroller', () => {
        expect(items()).toHaveLength(7);
      });
    });

    describe('When in dynamic mode with no before, empty or after slots provided', () => {
      beforeEach(() => {
        mockProps = { dynamic: true, minItemSize: 54, itemSize: undefined };
        updateWrapper();
      });

      it('renders no empty slot wrapper', () => {
        expect(wrapper.queryByTestId('dt-scroller-before')).toBeNull();
        expect(wrapper.queryByTestId('dt-scroller-after')).toBeNull();
      });
    });
  });
});
