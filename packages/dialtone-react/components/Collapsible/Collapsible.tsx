import {
  Children,
  Fragment,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { hasContent, renderSlot, type SlotProp } from '../../common/slots';
import { DtIconChevronDown, DtIconChevronRight } from '../../icons';
import { DtButton } from '../Button/Button';
import { DtCollapsibleLazyShow } from './CollapsibleLazyShow';

/** The scope Vue's `anchor` slot passes: the attributes the anchor needs to control the content. */
export interface DtCollapsibleAnchorSlotScope {
  attrs: {
    'aria-controls': string;
    'aria-expanded': 'true' | 'false';
    role: 'button';
  };
}

type NativeAttributes = Omit<HTMLAttributes<HTMLElement>, 'id' | 'children' | 'content' | 'aria-label'>;

export interface DtCollapsibleProps extends NativeAttributes {
  /**
   * Text that is displayed on the anchor if nothing is passed in the slot.
   * Ignored if the anchor slot is used.
   */
  anchorText?: string | null;

  /**
   * Controls whether the collapsible is shown. When null (default), the collapsible starts expanded (or as
   * `defaultOpen` says) and toggles on click. When set to true or false, the default trigger is disabled and the
   * parent controls visibility, through `onOpenChange`.
   * @values null, true, false
   */
  open?: boolean | null;

  /** Whether the collapsible starts expanded when `open` isn't set. Clicks on the default anchor take it from there. */
  defaultOpen?: boolean;

  /** The id of the content wrapper. */
  id?: string;

  /** HTML element type (tag name) of the root element of the component. */
  elementType?: string;

  /** HTML element type (tag name) of the content wrapper element. */
  contentElementType?: string;

  /** Additional class name for the anchor wrapper element. */
  anchorClass?: ClassValue;

  /** Additional class name for the content wrapper element. */
  contentClass?: ClassValue;

  /**
   * The maximum width of the anchor and collapsible element.
   * Possible units rem|px|%|em
   */
  maxWidth?: string | null;

  /**
   * The maximum height of the collapsible element.
   * Possible units rem|px|%|em
   */
  maxHeight?: string | null;

  /** Label on the collapsible content. Should provide this or ariaLabelledBy but not both. */
  ariaLabel?: string | null;

  /**
   * Id of the element that labels the collapsible content. Defaults to the anchor element.
   * Should provide this or ariaLabel but not both.
   */
  ariaLabelledBy?: string | null;

  /** Slot for the anchor element that toggles the collapsible content */
  anchor?: SlotProp<DtCollapsibleAnchorSlotScope>;

  /** Slot for the collapsible element that is expanded by the anchor */
  content?: ReactNode;

  /** Called once the content's enter or leave transition ends, with whether it's now shown: Vue's `opened`. */
  onOpened?: (opened: boolean) => void;

  /** Called alongside onOpened while `open` is set (controlled), with the same value: Vue's `update:open`. */
  onOpenChange?: (open: boolean) => void;

  /** The root element. */
  ref?: Ref<HTMLElement>;
}

/**
 * A collapsible is a component consisting of an interactive anchor that toggled the expandable/collapsible element.
 * @see https://dialtone.dialpad.com/components/collapsible.html
 */
export function DtCollapsible ({
  anchorText = null,
  open = null,
  defaultOpen = true,
  id: idProp,
  elementType = 'div',
  contentElementType = 'div',
  anchorClass = null,
  contentClass = null,
  maxWidth = null,
  maxHeight = null,
  ariaLabel = null,
  ariaLabelledBy = null,
  anchor,
  content,
  onOpened,
  onOpenChange,
  ref,
  ...attrs
}: DtCollapsibleProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const anchorId = useId();

  // Vue's isOpen. `open` is synced into it whenever it changes (Vue's immediate watcher), and keeps its last value
  // when `open` goes back to null.
  const [isOpen, setIsOpen] = useState<boolean>(open ?? defaultOpen);
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open !== null) setIsOpen(open);
  }

  // aria-labelledby should be set only if aria-labelledby is passed as a prop, or if there is no aria-label and the
  // labelledby should point to the anchor. Vue renders a `false` here as the string "false".
  const labelledBy = ariaLabelledBy || (!ariaLabel && anchorId);
  const anchorWrapperId = String(!ariaLabelledBy && labelledBy);

  const scope: DtCollapsibleAnchorSlotScope = {
    attrs: {
      'aria-controls': id,
      'aria-expanded': isOpen ? 'true' : 'false',
      role: 'button',
    },
  };
  const anchorContent = renderSlot(anchor, scope);

  // Vue falls back when the slot renders nothing but comments, which an empty fragment does.
  const useFallbackAnchor = Children.toArray(anchorContent).every(isEmptyFragment);

  useValidateProperAnchor(anchorText, useFallbackAnchor ? null : anchorContent);

  const defaultToggleOpen = () => {
    if (open === null) setIsOpen(!isOpen);
  };

  // DtCollapsibleLazyShow's transition calls no hook once it unmounts, which is what Vue's `_isUnmounting` guards.
  const onLeaveTransitionComplete = () => {
    onOpened?.(false);
    if (open !== null) onOpenChange?.(false);
  };

  const onEnterTransitionComplete = () => {
    onOpened?.(true);
    if (open !== null) onOpenChange?.(true);
  };

  const Root = elementType as ElementType;

  return (
    <Root {...attrs} ref={ref}>
      {/* Element for capturing keypress events */}
      <div id={anchorWrapperId} className={cx(anchorClass) || undefined}>
        {!useFallbackAnchor
          ? anchorContent
          : (
            <DtButton
              importance="clear"
              kind="muted"
              aria-controls={id}
              aria-expanded={`${isOpen}`}
              style={{ width: maxWidth ?? undefined }}
              onClick={defaultToggleOpen}
              startIcon={isOpen
                ? <DtIconChevronDown className="d-collapsible__icon" size="300" />
                : <DtIconChevronRight className="d-collapsible__icon" size="300" />}
            >
              <span className="d-collapsible__anchor-text" title={anchorText ?? undefined}>
                {anchorText}
              </span>
            </DtButton>
          )}
      </div>
      <DtCollapsibleLazyShow
        id={id}
        aria-hidden={`${!isOpen}`}
        aria-labelledby={String(labelledBy)}
        aria-label={ariaLabel ?? undefined}
        show={isOpen}
        elementType={contentElementType}
        className={cx(contentClass) || undefined}
        style={{ maxHeight: maxHeight ?? undefined, maxWidth: maxWidth ?? undefined }}
        data-qa="dt-collapsible--content"
        tabIndex={-1}
        appear
        onAfterLeave={onLeaveTransitionComplete}
        onAfterEnter={onEnterTransitionComplete}
      >
        {content}
      </DtCollapsibleLazyShow>
    </Root>
  );
}

/** A fragment that holds nothing but empty fragments: it renders no DOM, like a slot of only comments in Vue. */
function isEmptyFragment (node: ReactNode): boolean {
  return isValidElement<{ children?: ReactNode }>(node) && node.type === Fragment &&
    Children.toArray(node.props.children).every(isEmptyFragment);
}

/** Vue's `validateProperAnchor`, from `created()`: once per instance. */
function useValidateProperAnchor (anchorText: string | null, anchorContent: ReactNode) {
  const checked = useRef(false);
  const invalid = !anchorText && !hasContent(anchorContent);
  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    if (invalid) console.error('anchor text and anchor slot content cannot both be falsy');
  }, [invalid]);
}
