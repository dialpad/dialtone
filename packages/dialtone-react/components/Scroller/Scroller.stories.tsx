import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtAvatar } from '../Avatar';
import { DtScroller, type DtScrollerHandle, type DtScrollerProps, type ScrollerUserPosition } from './Scroller';

interface User {
  id: number;
  name: string;
}

interface Message {
  id: number;
  avatar: string;
  message: string;
}

// `default` is Vue's default slot arg, which its template doesn't render (it renders each user).
type ScrollerStoryArgs = DtScrollerProps<User> & { default?: string };

// Default Prop Values
export const argsData = {
  listTag: 'div',
  itemTag: 'div',
  itemSize: 32,
  scrollerWidth: 300,
  scrollerHeight: 200,
  buffer: 200,
  onScrollStart: action('scroll-start'),
  onScrollEnd: action('scroll-end'),
  onUserPosition: action('user-position'),
};

export const argTypesData = {
  default: {
    control: false,
    description: 'Markup to display each item from the items array.\n\n' +
      'item {*}: the item currently being rendered from within your items array.\n\n' +
      'index {number}: the index of this item in the items array.\n\n' +
      'active {boolean}: whether this item is currently visible to the user.',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Props
  items: {
    control: false,
  },

  dynamic: {
    control: false,
  },

  keyField: {
    control: false,
  },

  direction: {
    control: {
      type: 'select',
    },
    options: ['horizontal', 'vertical'],
  },

  listTag: {
    control: { type: 'text' },
  },

  itemTag: {
    control: { type: 'text' },
  },

  // react-docgen reports these as unions; plain controls keep them drivable from the URL.
  itemSize: {
    control: { type: 'number' },
  },

  minItemSize: {
    control: false,
  },

  scrollerWidth: {
    control: { type: 'number' },
  },

  scrollerHeight: {
    control: { type: 'number' },
  },

  // Action Event Handlers
  onScrollStart: {
    description: 'Called when the first item enters the rendered view pool, at least one buffer ' +
      'length before the viewport\'s start edge (earlier still with `before` content).',
    table: {
      type: { summary: 'event' },
    },
  },

  onScrollEnd: {
    description: 'Called when the last item enters the rendered view pool, at least one buffer ' +
      'length before the viewport\'s end edge (earlier still with `after` content). Use it ' +
      'to append more items.',
    table: {
      type: { summary: 'event' },
    },
  },

  onUserPosition: {
    description: 'Called with the last user position.',
    table: {
      type: { summary: 'event' },
    },
  },

  before: {
    control: false,
    description: 'Content rendered before the items, inside the scroll viewport. Scrolls with the list.',
    table: {
      type: { summary: 'ReactNode' },
    },
  },

  after: {
    control: false,
    description: 'Content rendered after the items, inside the scroll viewport. Scrolls with the list.',
    table: {
      type: { summary: 'ReactNode' },
    },
  },

  empty: {
    control: false,
    description: 'Content rendered inside the list wrapper only while the list is empty.',
    table: {
      type: { summary: 'ReactNode' },
    },
  },

  buffer: {
    control: { type: 'number' },
  },
} satisfies Meta<ScrollerStoryArgs>['argTypes'];

const meta = {
  title: 'Components/Scroller',
  component: DtScroller,
  argTypes: argTypesData,
  args: argsData,
  excludeStories: /.*Data$/,
} satisfies Meta<ScrollerStoryArgs>;

export default meta;
type Story = StoryObj<ScrollerStoryArgs>;

// The Vue templates' scoped styles.
const scrollerStyle: CSSProperties = { margin: '20px 0', border: '1px solid red' };
const autoScrollingStyle: CSSProperties = { display: 'flex', alignItems: 'center' };
const indicatorStyle = (enabled: boolean): CSSProperties => ({
  inlineSize: '5px',
  blockSize: '5px',
  borderRadius: '25px',
  marginInlineStart: '5px',
  ...(enabled ? { backgroundColor: '#00ff00' } : {}),
});

// ScrollerDefault.story.vue
function ScrollerDefault (args: ScrollerStoryArgs) {
  const [items, setItems] = useState<User[]>(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    name: `User ${i}`,
  })));
  const scroller = useRef<DtScrollerHandle>(null);
  const [autoScrolling, setAutoScrolling] = useState(false);
  const userPosition = useRef<ScrollerUserPosition | null>(null);
  // Demonstrates the documented pattern for the `after` slot: guard it with your
  // own flag rather than relying on the scroller to show or hide it for you.
  const [isFetching] = useState(true);
  const addedAt = useRef<'top' | 'bottom' | null>(null);

  function scrollToItem (index: number) {
    scroller.current?.scrollToItem(index);
  }

  // Vue mutates the items in place and calls the scroller at once; here the scroller gets the new items when this
  // renders, so the calls follow the render that added them.
  useEffect(() => {
    if (addedAt.current === 'top') {
      scroller.current?.scrollToItem(10);
      scroller.current?.updateItems();
    } else if (addedAt.current === 'bottom') {
      if (userPosition.current === 'blockEnd') scroller.current?.scrollToItem(items.length - 1);
      scroller.current?.updateItemsFromBottom();
    }
    addedAt.current = null;
  }, [items]);

  function addItemTop () {
    addedAt.current = 'top';
    setItems((current) => {
      const aux = current.length;
      const added = Array.from({ length: 10 }, (_, i) => ({ id: aux + 10 - i, name: `User ${aux + 10 - i}` }));
      return [...added, ...current];
    });
  }

  useEffect(() => {
    if (!autoScrolling) return;
    const intervalId = setInterval(() => {
      addedAt.current = 'bottom';
      setItems(current => [...current, { id: current.length, name: `User ${current.length}` }]);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [autoScrolling]);

  function switchAutoScrolling () {
    setAutoScrolling(on => !on);
    scroller.current?.scrollToItem(items.length - 1);
  }

  return (
    <div>
      <h3>Scroller</h3>

      <button type="button" onClick={() => scrollToItem(25)}>
        Go to index 25
      </button>
      <button type="button" onClick={() => scrollToItem(0)}>
        Go to start
      </button>
      <button type="button" onClick={() => scrollToItem(items.length - 1)}>
        Go to end
      </button>

      <button type="button" onClick={addItemTop}>
        Add 10 items top
      </button>

      <br />
      <br />
      <button
        type="button"
        className="autoscrolling"
        style={autoScrollingStyle}
        onClick={switchAutoScrolling}
      >
        Auto scrolling <div className={autoScrolling ? 'enabled' : undefined} style={indicatorStyle(autoScrolling)} />
      </button>

      <DtScroller
        ref={scroller}
        className="scroller"
        style={scrollerStyle}
        items={items}
        itemSize={args.itemSize}
        scrollerHeight={args.scrollerHeight}
        scrollerWidth={args.scrollerWidth}
        minItemSize={args.minItemSize}
        listTag={args.listTag}
        itemTag={args.itemTag}
        direction={args.direction}
        buffer={args.buffer}
        onUserPosition={(position) => {
          args.onUserPosition?.(position);
          userPosition.current = position;
        }}
        onScrollStart={() => args.onScrollStart?.()}
        onScrollEnd={() => args.onScrollEnd?.()}
        after={isFetching
          ? (
            <div className="d-p8 d-fc-muted d-helper--md">
              Loading more…
            </div>
            )
          : null}
      >
        {({ item }) => (
          <div
            className="user"
            style={{
              blockSize: '25px',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBlockEnd: '1px solid #eee',
            }}
          >
            <DtAvatar seed={String(item.id)} size="200" fullName={item.name} />
            {item.name}
          </div>
        )}
      </DtScroller>
    </div>
  );
}

// dialtone-vue's story imports its own person.png, which isn't in the Storybook's static files; this one is.
const defaultAvatar = '/avatar1.png';

const messages = [
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor,nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam',
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl',
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet',
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet',
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam,nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc',
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam',
  'lorem ipsum dolor sit amet',
];

// ScrollerDynamic.story.vue
function ScrollerDynamic () {
  const [dynamicItems, setDynamicItems] = useState<Message[]>(() => Array.from({ length: 37 }, (_, index) => ({
    id: index,
    avatar: defaultAvatar,
    message: messages[0],
  })));
  const scroller = useRef<DtScrollerHandle>(null);
  const [autoScrolling, setAutoScrolling] = useState(false);
  const userPosition = useRef<ScrollerUserPosition | null>(null);
  const added = useRef(false);

  function updateItem (index: number) {
    setDynamicItems(current => current.map((item, i) => (i === index
      ? { ...item, message: messages[Math.floor(Math.random() * 8)] }
      : item)));
  }

  // Vue's nextTick after adding an item.
  useEffect(() => {
    if (added.current && userPosition.current === 'blockEnd') scroller.current?.scrollToBottom();
    added.current = false;
  }, [dynamicItems]);

  useEffect(() => {
    if (!autoScrolling) return;
    const intervalId = setInterval(() => {
      added.current = true;
      setDynamicItems(current => [...current, {
        id: current.length,
        avatar: defaultAvatar,
        message: messages[Math.floor(Math.random() * 8)],
      }]);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [autoScrolling]);

  function switchAutoScrolling () {
    setAutoScrolling(on => !on);
    scroller.current?.scrollToBottom();
  }

  function replaceItems () {
    // The scroller reads the new items once they render.
    flushSync(() => setDynamicItems(current => [...current].reverse()));
    scroller.current?.updateItems();
  }

  return (
    <div>
      <h3>Scroller with dynamic size</h3>

      <button type="button" onClick={() => updateItem(0)}>
        Update Element Message
      </button>
      <br />
      <br />
      <button type="button" onClick={replaceItems}>
        Replace Items
      </button>
      <br />
      <br />
      <button
        type="button"
        className="autoscrolling"
        style={autoScrollingStyle}
        onClick={switchAutoScrolling}
      >
        Auto scrolling <div className={autoScrolling ? 'enabled' : undefined} style={indicatorStyle(autoScrolling)} />
      </button>

      <DtScroller
        ref={scroller}
        items={dynamicItems}
        minItemSize={54}
        scrollerHeight={300}
        scrollerWidth={500}
        className="scroller"
        style={scrollerStyle}
        dynamic
        onUserPosition={(position) => { userPosition.current = position; }}
      >
        {({ item }) => (
          <>
            <div className="avatar" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DtAvatar seed={String(item.id)} size="200" imageSrc={item.avatar} imageAlt="avatar" />
              {item.id}
            </div>
            <div className="text">
              {item.message}
            </div>
          </>
        )}
      </DtScroller>
    </div>
  );
}

export const Default: Story = {
  render: args => <ScrollerDefault {...args} />,
  args: {
    default: 'Scroller',
  },
};

export const Dynamic: Story = {
  render: () => <ScrollerDynamic />,
  parameters: { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } },
};
