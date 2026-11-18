import {
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
  type Ref,
} from 'react';
import { cx } from '../../../../common/cx';
import { DtListItem } from '../../../ListItem';

export type SuggestionItemType = 'emoji' | 'mention' | 'channel' | 'slash-command';

/** What every suggestion item may carry; each item type reads its own keys. */
export interface SuggestionItem {
  id?: string;
  [key: string]: unknown;
}

export interface SuggestionListHandle {
  /** The suggestion plugin's onKeyDown: returns whether the list handled the key. */
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export interface SuggestionListProps {
  items: SuggestionItem[];
  command: (props: Record<string, unknown>) => void;
  itemComponent: ComponentType<{ item: SuggestionItem }>;
  itemType: SuggestionItemType;
  ref?: Ref<SuggestionListHandle>;
}

/**
 * The suggestion popup's list. Vue's SuggestionList renders the `d-popover__dialog d-suggestion-list__container`
 * root itself; here that element is the renderer's own (see createSuggestionComponent), which the suggestion
 * renderer positions, so this renders what goes inside it.
 */
export function SuggestionList ({ items, command, itemComponent: ItemComponent, itemType, ref }: SuggestionListProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Vue's `items` watcher: new items reset the selection.
  const [prevItems, setPrevItems] = useState(items);
  if (prevItems !== items) {
    setPrevItems(items);
    setSelectedIndex(0);
  }

  const listRef = useRef<HTMLUListElement>(null);
  const scrollPending = useRef(false);

  // Vue scrolls after $nextTick, once the highlighted class has moved.
  useLayoutEffect(() => {
    if (!scrollPending.current) return;
    scrollPending.current = false;
    const activeElement = listRef.current?.querySelector('.d-list-item--highlighted');
    activeElement?.scrollIntoView?.({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [selectedIndex]);

  const selectItem = (index: number) => {
    const item = items[index];

    switch (itemType) {
      case 'emoji':
        command(item);
        return;
      case 'mention':
        command({ name: item.name, id: item.id, avatarSrc: item.avatarSrc, contactKey: item.contactKey });
        break;
      case 'channel':
        command({ name: item.name, id: item.id, locked: item.locked, channelKey: item.channelKey });
        break;
      case 'slash-command':
        command({ command: item.command });
        break;
    }
  };

  const upHandler = () => {
    scrollPending.current = true;
    setSelectedIndex(((selectedIndex + items.length) - 1) % items.length);
  };

  const downHandler = () => {
    scrollPending.current = true;
    setSelectedIndex((selectedIndex + 1) % items.length);
  };

  const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
    if (event.key === 'ArrowUp') {
      upHandler();
      return true;
    }

    if (event.key === 'ArrowDown') {
      downHandler();
      return true;
    }

    if (event.key === 'Enter' || event.key === 'Tab') {
      selectItem(selectedIndex);
      return true;
    }

    return false;
  };

  useImperativeHandle(ref, () => ({ onKeyDown }));

  // Vue binds `@keydown.prevent="onKeyDown"`, which passes the KeyboardEvent where onKeyDown expects `{ event }`,
  // so Vue's throws on `event.key`. This wraps it, so a key pressed on an item navigates like one in the editor.
  const handleItemKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    event.preventDefault();
    onKeyDown({ event: event.nativeEvent });
  };

  return (
    <ul
      ref={listRef}
      className="d-suggestion-list"
      style={items.length ? undefined : { display: 'none' }}
    >
      {items.map((item, index) => (
        <DtListItem
          key={item.id ?? index}
          className={cx('d-suggestion-list__item', { 'd-list-item--highlighted': index === selectedIndex })}
          navigationType="arrow-keys"
          onClick={() => selectItem(index)}
          onKeyDown={handleItemKeyDown}
        >
          <ItemComponent item={item} />
        </DtListItem>
      ))}
    </ul>
  );
}
