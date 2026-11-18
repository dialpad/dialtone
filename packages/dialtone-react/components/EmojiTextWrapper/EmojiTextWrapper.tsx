import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../common/cx';
import { findEmojis, findShortCodes } from '../../common/emoji';
import type { IconSize } from '../../icons';
import { DtEmoji } from '../Emoji';

interface DtEmojiTextWrapperOwnProps {
  /**
   * Element type (tag name) to use for the wrapper.
   */
  elementType?: string;

  /**
   * The icon size to render the emojis at.
   * @values 100, 200, 300, 400, 500, 600, 700, 800
   */
  size?: IconSize;

  /**
   * Content to search for shortcodes like :smile: or unicode emojis such as 😄.
   */
  children?: ReactNode;
}

export type DtEmojiTextWrapperProps = DtEmojiTextWrapperOwnProps
  & Omit<ComponentPropsWithRef<'div'>, keyof DtEmojiTextWrapperOwnProps>;

/**
 * Replaces the valid codes from the text content with a DtEmoji component.
 */
function replaceDtEmojis (replaceList: string[], textContent: string, size: IconSize, key: number): ReactNode {
  // Escape the asterisk to avoid breaking the regex for the asterisk emoji
  const escapedReplaceList = replaceList.map(item => item.replace(/\*/g, '\\*'));

  const regexp = new RegExp(`(${escapedReplaceList.join('|')})`, 'g');
  const items = textContent.split(regexp);

  return (
    <Fragment key={key}>
      {items
        .filter(item => item.trim() !== '')
        .map((item, index) => {
          if (replaceList.includes(item)) {
            return <DtEmoji key={index} code={item} size={size} />;
          }
          return <span key={index} className="d-emoji-text-wrapper__text">{item}</span>;
        })}
    </Fragment>
  );
}

/**
 * Find codes in text.
 */
function searchCodes (textContent: string, size: IconSize, key: number): ReactNode {
  const replaceList = [...findShortCodes(textContent), ...findEmojis(textContent)];
  if (replaceList.length === 0) return textContent;
  return replaceDtEmojis(replaceList, textContent, size, key);
}

/**
 * Recursively search the React element tree to find text. Elements that are components (not DOM elements) are kept
 * as they are, as Vue's TODO for crawling Vue components leaves them.
 */
function searchNodes (children: ReactNode, size: IconSize): ReactNode[] {
  // Children.toArray flattens nested arrays into one key scope (and leaves portal keys as they are), so each nested
  // array is wrapped in a keyed Fragment first; searchNode then recurses into it with its own scope.
  // The generated key must not equal a sibling's own key, or Children.toArray gives both the same key.
  const level = Array.isArray(children)
    ? children.map((child, index) => {
      if (!Array.isArray(child)) return child;
      const taken = new Set(children.map(c => (isValidElement(c) ? c.key : null)));
      let key = `list-${index}`;
      while (taken.has(key)) key += '_';
      return <Fragment key={key}>{child}</Fragment>;
    })
    : children;
  return Children.toArray(level).map((node, index) => searchNode(node, size, index));
}

function searchNode (node: ReactNode, size: IconSize, key: number): ReactNode {
  if (typeof node === 'string') return searchCodes(node, size, key);
  if (!isValidElement(node)) return node;

  const element = node as ReactElement<{
    children?: ReactNode;
    dangerouslySetInnerHTML?: { __html: string };
  }>;
  // Clone so the caller's key is kept and only the children are processed.
  if (element.type === Fragment) return cloneElement(element, undefined, searchNodes(element.props.children, size));
  if (typeof element.type !== 'string') return element;

  // Vue replaces an element that has `innerHTML` (v-html) with the result of searching that string.
  // React also accepts a TrustedHTML object here, so it's turned into a string for the text search.
  const innerHTML = element.props.dangerouslySetInnerHTML?.__html;
  if (innerHTML != null && String(innerHTML) !== '') return searchCodes(String(innerHTML), size, key);

  // A textarea's string child is its initial value, so it can't become a Fragment.
  // A script's body must stay a single string for server rendering.
  if (element.type === 'textarea' || element.type === 'script') return element;

  // Void elements (img, br) take no children.
  if (element.props.children == null) return element;
  return cloneElement(element, undefined, searchNodes(element.props.children, size));
}

/**
 * Wrapper to find and replace shortcodes like :smile: or unicode chars such as 😄 with our custom Emojis implementation.
 * @see https://dialtone.dialpad.com/components/emoji_text_wrapper.html
 */
export function DtEmojiTextWrapper ({
  elementType = 'div',
  size = 500,
  children,
  className,
  ...rest
}: DtEmojiTextWrapperProps) {
  const Tag = elementType as ElementType;

  return (
    <Tag
      data-qa="emoji-text-wrapper"
      className={cx('d-emoji-text-wrapper', className)}
      {...rest}
    >
      {/* React throws when both children and dangerouslySetInnerHTML are set, and when a void element (br) gets
        an empty children array, so only pass children when there are some. */}
      {children == null || elementType === 'textarea' || elementType === 'script'
        ? children
        : searchNodes(children, size)}
    </Tag>
  );
}
