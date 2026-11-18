import {
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import { Editor, Extension, type AnyExtension, type Extensions, type JSONContent } from '@tiptap/core';
import { EditorContent } from '@tiptap/react';
import { BubbleMenuPlugin } from '@tiptap/extension-bubble-menu';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import Code from '@tiptap/extension-code';
import Document from '@tiptap/extension-document';
import { Placeholder, UndoRedo, Gapcursor } from '@tiptap/extensions';
import HardBreak from '@tiptap/extension-hard-break';
import Paragraph from '@tiptap/extension-paragraph';
import Bold from '@tiptap/extension-bold';
import { BulletList, OrderedList, ListItem } from '@tiptap/extension-list';
import Italic from '@tiptap/extension-italic';
import TipTapLink, { type LinkOptions } from '@tiptap/extension-link';
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import type { SuggestionOptions } from '@tiptap/suggestion';
import type { EditorView } from '@tiptap/pm/view';
import deepEqual from 'deep-equal';
import { emojiPattern } from 'regex-combined-emojis';

import { cx } from '../../common/cx';
import { useControllableState } from '../../common/hooks/useControllableState';
import { useI18n } from '../../common/localization';
import { DtButton } from '../Button';
import { DtStack } from '../Stack';
import { CustomTable, CustomTableRow, CustomTableCell, CustomTableHeader } from './Extensions/Table/Table';
import { CustomTextStyle } from './Extensions/TextStyle/TextStyle';
import Emoji from './Extensions/Emoji';
import CustomLink from './Extensions/CustomLink';
import { forceLinkifyPendingText as flushPendingLinks } from './ForceLinkify';
import { LinkPhoneNumbers } from './Extensions/LinkPhoneNumbers/LinkPhoneNumbers';
import ConfigurableImage from './Extensions/Image';
import DivParagraph from './Extensions/Div';
import { MentionPlugin } from './Extensions/Mentions/Mention';
import { ChannelPlugin } from './Extensions/Channels/Channel';
import { SlashCommandPlugin } from './Extensions/SlashCommand/SlashCommand';
import Variable from './Extensions/Variable';
import type { VariableItem } from './Extensions/Variable/Variable';
import {
  RICH_TEXT_EDITOR_SUPPORTED_LINK_PROTOCOLS,
  type RichTextEditorAutoFocusType,
  type RichTextEditorOutputFormat,
} from './RichTextEditorConstants';
import mentionSuggestion from './Extensions/Mentions/Suggestion';
import channelSuggestion from './Extensions/Channels/Suggestion';
import slashCommandSuggestion from './Extensions/SlashCommand/Suggestion';
import { renderEditorToMarkdown } from './MarkdownRenderer';
import type { ChannelData, LinkClickData, MentionData, MentionPointerData, PhoneClickData } from './editorEvents';

/** The editor's content: a string in the output format, or TipTap's JSON document. */
export type RichTextEditorValue = string | JSONContent;

/** A suggestion configuration: tiptap's suggestion options, of which only `items` is required. */
export type RichTextEditorSuggestion = Partial<SuggestionOptions> & Pick<SuggestionOptions, 'items'>;

export interface RichTextEditorLink {
  href: string | undefined;
  text: string;
}

/** What a ref to DtRichTextEditor exposes: Vue's public instance members. */
export interface DtRichTextEditorHandle {
  /** The TipTap editor. A new one is created whenever the extensions change. */
  readonly editor: Editor | null;
  /** Focuses the editor. */
  focusEditor: () => void;
  /** The editor's content in the output format. */
  getOutput: () => RichTextEditorValue | undefined;
  /**
   * Sets a link on the selection, or removes it when `linkInput` is empty. A `linkInput` that matches none of
   * `linkProtocols` gets `defaultPrefix` prepended.
   */
  setLink: (
    linkInput: string,
    linkText: string,
    linkOptions: { class?: string },
    linkProtocols?: (RegExp | string)[],
    defaultPrefix?: string,
  ) => void;
  /** Removes the link at the selection. */
  removeLink: () => void;
  /**
   * Converts a trailing URL that has not been linkified yet into a link.
   * Call this before reading the editor's content (e.g. right before sending).
   *
   * See ForceLinkify.ts for why this exists: TipTap's built-in link autolink
   * only commits a link mark once a boundary character follows a URL, so a
   * trailing URL never gets linkified on its own. Dialtone has no generic
   * "send" event to hook, so this is a plain public method -- call it
   * yourself.
   */
  forceLinkifyPendingText: () => void;
}

interface DtRichTextEditorOwnProps {
  /** A ref to the editor's public members (Vue's template ref on the component). */
  ref?: Ref<DtRichTextEditorHandle>;

  /**
   * Value of the input. The object format should match TipTap's JSON
   * document structure: https://tiptap.dev/guide/output#option-1-json
   */
  value?: RichTextEditorValue;

  /** The initial value, when `value` isn't controlled. */
  defaultValue?: RichTextEditorValue;

  /** Called with the output whenever the content changes, and once when the editor is created. */
  onValueChange?: (value: RichTextEditorValue) => void;

  /**
   * Whether the input is editable
   */
  editable?: boolean;

  /**
   * Allows the user to type in the editor. Set to false to prevent typing while still allowing deletion.
   */
  allowTyping?: boolean;

  /**
   * When this option is false the editor will only ever paste plain text, no rich text formatting will be applied,
   * and any HTML will be rendered as text.
   */
  pasteRichText?: boolean;

  /**
   * Whether the input allows for line breaks to be introduced in the text by pressing enter. If this is disabled,
   * line breaks can still be entered by pressing shift+enter.
   */
  allowLineBreaks?: boolean;

  /**
   * Descriptive label for the input element
   */
  inputAriaLabel: string;

  /**
   * Additional class name for the input element. Only accepts a String value
   * because this is passed to the editor via options. For multiple classes,
   * join them into one string, e.g. "d-p-100 d-hmx-150"
   */
  inputClass?: string;

  /**
   * Whether the input should receive focus after the component has been
   * mounted. Either one of `start`, `end`, `all` or a Boolean or a Number.
   * - `start`  Sets the focus to the beginning of the input
   * - `end`    Sets the focus to the end of the input
   * - `all`    Selects the whole contents of the input
   * - `Number` Sets the focus to a specific position in the input
   * - `true`   Defaults to `start`
   * - `false`  Disables autofocus
   */
  autoFocus?: boolean | RichTextEditorAutoFocusType | number;

  /**
   * The output format that the editor uses when calling `onValueChange`.
   * One of `text`, `json`, `html`, `markdown`. See https://tiptap.dev/guide/output for
   * examples.
   */
  outputFormat?: RichTextEditorOutputFormat;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Enables the TipTap Link extension and optionally passes configurations to it
   *
   * It is not recommended to use this and the custom link extension at the same time.
   */
  link?: boolean | Partial<LinkOptions>;

  /**
   * Enables the Custom Link extension and optionally passes configurations to it
   *
   * It is not recommended to use this and the built in TipTap link extension at the same time.
   *
   * The custom link does some additional things on top of the built in TipTap link
   * extension such as styling phone numbers and IP adresses as links, and allows you
   * to linkify text without having to type a space after the link. Currently it is missing some
   * functionality such as editing links and will likely require more work to be fully usable,
   * so it is recommended to use the built in TipTap link for now.
   */
  customLink?: boolean | Record<string, unknown>;

  /**
   * Phone number strings to display as clickable links, typically provided
   * by the backend via `rich_media`. Matching text in the editor will be
   * marked and call `onPhoneClick` when clicked. An empty array or
   * `null` disables phone linking.
   */
  linkPhoneNumbers?: string[] | null;

  /**
   * suggestion object containing the items query function.
   * The valid keys passed into this object can be found here: https://tiptap.dev/api/utilities/suggestion
   *
   * The only required key is the items function which is used to query the contacts for suggestion.
   * items({ query }) => { return [ContactObject]; }
   * ContactObject format:
   * { name: string, avatarSrc: string, id: string }
   *
   * When null, it does not add the plugin. A new object recreates the editor, so keep it stable across renders.
   */
  mentionSuggestion?: RichTextEditorSuggestion | null;

  /**
   * suggestion object containing the items query function.
   * The valid keys passed into this object can be found here: https://tiptap.dev/api/utilities/suggestion
   *
   * The only required key is the items function which is used to query the channels for suggestion.
   * items({ query }) => { return [ChannelObject]; }
   * ChannelObject format:
   * { name: string, id: string, locked: boolean, channelKey?: string }
   *
   * When null, it does not add the plugin. Setting locked to true will display a lock rather than hash.
   * A new object recreates the editor, so keep it stable across renders.
   */
  channelSuggestion?: RichTextEditorSuggestion | null;

  /**
   * suggestion object containing the items query function.
   * The valid keys passed into this object can be found here: https://tiptap.dev/api/utilities/suggestion
   *
   * The only required key is the items function which is used to query the slash commands for suggestion.
   * items({ query }) => { return [SlashCommandObject]; }
   * SlashCommandObject format:
   * { command: string, description: string, parametersExample?: string }
   * The "parametersExample" parameter is optional, and describes an example
   * of the parameters that command can take.
   *
   * When null, it does not add the plugin. A new object recreates the editor, so keep it stable across renders.
   * Note that slash commands only work when they are the first word in the input.
   */
  slashCommandSuggestion?: RichTextEditorSuggestion | null;

  /**
   * Whether the input allows for block quote.
   */
  allowBlockquote?: boolean;

  /**
   * Whether the input allows for bold to be introduced in the text.
   */
  allowBold?: boolean;

  /**
   * Whether the input allows for bullet list to be introduced in the text.
   */
  allowBulletList?: boolean;

  /**
   * Whether the input allows for italic to be introduced in the text.
   */
  allowItalic?: boolean;

  /**
   * Whether the input allows for strike to be introduced in the text.
   */
  allowStrike?: boolean;

  /**
   * Whether the input allows for underline to be introduced in the text.
   */
  allowUnderline?: boolean;

  /**
   * Whether the input allows inline code (wrapped in backticks).
   */
  allowCode?: boolean;

  /**
   * Whether the input allows codeblock to be introduced in the text.
   */
  allowCodeblock?: boolean;

  /**
   * Whether the input allows inline images to be rendered.
   */
  allowInlineImages?: boolean;

  /**
   * Whether the input allows color to be introduced in the text.
   */
  allowFontColor?: boolean;

  /**
   * Whether the input allows background color to be introduced in the text.
   */
  allowBackgroundColor?: boolean;

  /**
   * Whether the input allows font size to be introduced in the text.
   */
  allowFontSize?: boolean;

  /**
   * Whether the input allows different font-families to be introduced in the text.
   */
  allowFontFamily?: boolean;

  /**
   * Whether the input allows line height to be introduced in the text.
   */
  allowLineHeight?: boolean;

  /**
   * Whether the input allows variables to be introduced in the text.
   */
  allowVariable?: boolean;

  /**
   * Array of available variable items that can be inserted. A new array recreates the editor.
   */
  variableItems?: VariableItem[];

  /**
   * Additional TipTap extensions to be added to the editor. A new array recreates the editor.
   */
  additionalExtensions?: AnyExtension[];

  /**
   * Shows the link bubble menu when a link is selected via the cursor.
   * Set to false when you want the link to remain selected but hide the bubble menu,
   * such as when showing a custom link editor popup.
   */
  showLinkBubbleMenu?: boolean;

  /**
   * Controls how whitespace is handled when parsing HTML content.
   * - 'full': All whitespace is preserved
   * - true: Whitespace in inline content is preserved, whitespace-only nodes between blocks are removed
   * - false: Standard HTML whitespace collapsing
   */
  preserveWhitespace?: boolean | 'full';

  /**
   * Show text in HTML div tags instead of paragraph tags
   */
  useDivTags?: boolean;

  /**
   * Allow Tables to be used in to the editor
   */
  allowTables?: boolean;

  /**
   * Allow text alignment controls (left, center, right, justify) in the editor.
   */
  allowTextAlign?: boolean;

  /**
   * Whether the input allows image resize to be introduced in the text.
   */
  allowImageResize?: boolean;

  /** Input event always in JSON format. */
  onJsonInput?: (value: JSONContent) => void;

  /** Input event always in HTML format. */
  onHtmlInput?: (value: string) => void;

  /** Input event always in text format. */
  onTextInput?: (value: string) => void;

  /** Input event always in markdown format. */
  onMarkdownInput?: (value: string) => void;

  /** Editor blur event */
  onBlur?: (event: FocusEvent) => void;

  /** Editor focus event */
  onFocus?: (event: FocusEvent) => void;

  /** Enter was pressed. Note that shift enter must be pressed to line break the input. */
  onEnter?: () => void;

  /**
   * "Edit link" button was clicked. Fires an event for the consuming component to handle the editing of the link.
   * event contains the link object with two properties href and text. Mod+K calls it with no link.
   */
  onEditLink?: (link?: RichTextEditorLink) => void;

  /**
   * Fired when the user selects text in the editor, with the currently selected text.
   * If the selected text is partially a link, the full link text is returned.
   */
  onSelected?: (text: string) => void;

  /** Fired when a slash command is selected */
  onSelectedCommand?: (command: string) => void;

  /** Fired when a mention is clicked */
  onMentionClick?: (mention: MentionData) => void;

  /**
   * Fired when the cursor enters a mention. The payload includes the
   * mention data (name, id, avatarSrc, contactKey) plus the native MouseEvent
   * as `event`, which can be used for positioning a hovercard.
   */
  onMentionHover?: (mention: MentionPointerData) => void;

  /**
   * Fired when the cursor leaves a mention. The payload includes the
   * mention data (name, id, avatarSrc, contactKey) plus the native MouseEvent
   * as `event`.
   */
  onMentionLeave?: (mention: MentionPointerData) => void;

  /** Fired when a channel is clicked */
  onChannelClick?: (channel: ChannelData) => void;

  /**
   * Fired when a phone number link is clicked.
   * Payload: { phoneNumber: string } — the raw phone number text as matched.
   * Requires the `linkPhoneNumbers` prop to be set (loads the LinkPhoneNumbers extension).
   */
  onPhoneClick?: (phone: PhoneClickData) => void;

  /**
   * Fired when a link is clicked.
   * Payload: { href: string, text: string, event: MouseEvent } — the link's
   * href, its text content, and the originating click event. Call
   * event.preventDefault() to suppress the default navigation (e.g. to route
   * same-origin URLs in-app instead of opening a new tab).
   * Requires the `link` prop to be set.
   */
  onLinkClick?: (link: LinkClickData) => void;
}

export type DtRichTextEditorProps = DtRichTextEditorOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof DtRichTextEditorOwnProps>;

// Stable defaults: a new array would recreate the editor on every render.
const NO_VARIABLE_ITEMS: VariableItem[] = [];
const NO_EXTENSIONS: AnyExtension[] = [];

const FLOATING_OPTIONS = {
  placement: 'top-start' as const,
};

const BUBBLE_MENU_PLUGIN_KEY = 'bubbleMenu';

const isHandlerName = (name: string) => /^on[A-Z]/.test(name);

function getOutput (editor: Editor, outputFormat: RichTextEditorOutputFormat, extensions: Extensions) {
  switch (outputFormat) {
    case 'json':
      return editor.getJSON();
    case 'html':
      return editor.getHTML();
    case 'markdown':
      return renderEditorToMarkdown(editor.getJSON(), extensions);
    case 'text':
    default:
      return editor.getText({ blockSeparator: '\n' });
  }
}

function getExtension (extension: AnyExtension, options: boolean | Record<string, unknown>) {
  if (typeof options === 'boolean') {
    return extension;
  }
  return extension.configure?.(options);
}

/**
 * If the selection contains a link, return the existing link text.
 * Otherwise, use just the selected text.
 */
function getSelectedLinkText (editor: Editor): string {
  const { view, state } = editor;
  const { from, to } = view.state.selection;
  const text = state.doc.textBetween(from, to, '');
  const linkNode = editor.state.doc.nodeAt(from);
  if (linkNode && linkNode.marks?.at(0)?.type?.name === 'link') {
    return linkNode.textContent;
  } else {
    return text;
  }
}

function removeLink (editor: Editor | null) {
  editor?.chain()?.focus()?.unsetLink()?.run();
}

function hasPreWhitespace (element: Element): boolean {
  const styleAttr = element.getAttribute('style') || '';
  const elementStyle = (element as HTMLElement).style?.whiteSpace || '';

  const hasPreElementStyle = elementStyle === 'pre' || elementStyle === 'pre-wrap';
  const hasPreInlineStyle = styleAttr.includes('white-space: pre');

  return hasPreElementStyle || hasPreInlineStyle;
}

function hasLineBreaks (element: Element): boolean {
  return !!element.textContent && element.textContent.includes('\n');
}

function hasBlankLines (textData: string): boolean {
  // Check for blank lines (empty lines between content) or multiple consecutive line breaks
  return textData.includes('\n\n') || /\n\s*\n/.test(textData);
}

function containsPreformattedContent (htmlData: string): boolean {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlData;
  const elements = tempDiv.querySelectorAll('*');

  for (const element of Array.from(elements)) {
    if (hasPreWhitespace(element) && hasLineBreaks(element)) {
      return true;
    }
  }
  return false;
}

function walkAndExtractText (node: Node): string {
  let result = '';

  if (node.nodeType === Node.TEXT_NODE) {
    result += node.textContent;
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (hasPreWhitespace(node as Element)) {
      result += node.textContent;
    } else {
      for (const child of Array.from(node.childNodes)) {
        result += walkAndExtractText(child);
      }
    }
  }

  return result;
}

function extractPreformattedText (htmlData: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlData;
  return walkAndExtractText(tempDiv);
}

// Moves the <br /> tags inside the previous closing tag to avoid
// Prosemirror wrapping them within another </p> tag.
// Converts <hr> to an empty paragraph so it pastes as a line separator.
function transformPastedHTML (html: string): string {
  return html
    .replace(/<hr[^>]*\/?>/gi, '<p><br></p>')
    .replace(/(<\/\w+>)((<br \/>)+)/g, '$2$1')
    // Strip trailing <br> just before the final </p> so pasted content
    // doesn't produce an extra blank line at the end of the message.
    // Anchored to end-of-string to avoid removing intentional hard breaks
    // inside non-final paragraphs.
    .replace(/(<br[^>]*>\s*)+<\/p>(\s*)$/i, '</p>$2');
}

/**
 * A rich text editor, built on TipTap.
 * @see https://dialtone.dialpad.com/components/rich_text_editor.html
 */
export function DtRichTextEditor ({
  ref,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  editable = true,
  allowTyping = true,
  pasteRichText = true,
  allowLineBreaks = false,
  inputAriaLabel,
  inputClass = '',
  autoFocus = false,
  outputFormat = 'html',
  placeholder = '',
  link = false,
  customLink = false,
  linkPhoneNumbers = null,
  mentionSuggestion: mentionSuggestionProp = null,
  channelSuggestion: channelSuggestionProp = null,
  slashCommandSuggestion: slashCommandSuggestionProp = null,
  allowBlockquote = true,
  allowBold = true,
  allowBulletList = true,
  allowItalic = true,
  allowStrike = true,
  allowUnderline = true,
  allowCode = true,
  allowCodeblock = true,
  allowInlineImages = false,
  allowFontColor = false,
  allowBackgroundColor = false,
  allowFontSize = false,
  allowFontFamily = false,
  allowLineHeight = false,
  allowVariable = false,
  variableItems = NO_VARIABLE_ITEMS,
  additionalExtensions = NO_EXTENSIONS,
  showLinkBubbleMenu = true,
  preserveWhitespace = 'full',
  useDivTags = false,
  allowTables = false,
  allowTextAlign = true,
  allowImageResize = false,
  onJsonInput,
  onHtmlInput,
  onTextInput,
  onMarkdownInput,
  onBlur,
  onFocus,
  onEnter,
  onEditLink,
  onSelected,
  onSelectedCommand,
  onMentionClick,
  onMentionHover,
  onMentionLeave,
  onChannelClick,
  onPhoneClick,
  onLinkClick,
  className,
  style,
  ...rest
}: DtRichTextEditorProps) {
  const i18n = useI18n();
  const [currentValue, setCurrentValue] = useControllableState<RichTextEditorValue>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  const [editor, setEditor] = useState<Editor | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const extensionsRef = useRef<Extensions>([]);

  // Vue binds its $attrs to both the root and the editor content, but overrides the native input, focus and blur
  // listeners on the latter. Listeners go on the root only here, so a consumer's handler runs once per event.
  const attrs: Record<string, unknown> = {};
  const listeners: Record<string, unknown> = {};
  for (const [name, attrValue] of Object.entries(rest)) {
    (isHandlerName(name) ? listeners : attrs)[name] = attrValue;
  }

  const inputAttrs = (isEditable: boolean): Record<string, string | boolean> => {
    const attributes: Record<string, string | boolean> = {
      'aria-label': inputAriaLabel,
      'aria-multiline': true,
      role: 'textbox',
    };
    if (!isEditable) {
      attributes['aria-readonly'] = true;
    }
    return attributes;
  };

  const updateEditorAttributes = useEffectEvent((instance: Editor, attributes: Record<string, string | boolean>) => {
    instance.setOptions({
      editorProps: {
        attributes: {
          ...inputAttrs(editable),
          class: inputClass,
          ...attributes,
        } as Record<string, string>,
      },
    });
  });

  const triggerInputChangeEvents = useEffectEvent((instance: Editor) => {
    // Capture every output before calling a consumer: a handler can replace the content synchronously, and the
    // others must still report the change that fired this.
    const output = getOutput(instance, outputFormat, extensionsRef.current);
    const jsonValue = instance.getJSON();
    const htmlValue = instance.getHTML();
    const textValue = instance.getText({ blockSeparator: '\n' });
    // Markdown only when something reads it: the static renderer rejects nodes whose renderHTML returns a DOM
    // element (e.g. from additionalExtensions), which would otherwise break updates that never use markdown.
    const markdownValue = onMarkdownInput
      ? renderEditorToMarkdown(jsonValue, extensionsRef.current)
      : undefined;

    setCurrentValue(output);
    // Always output JSON, HTML, text and markdown in separate events
    onJsonInput?.(jsonValue);
    onHtmlInput?.(htmlValue);
    onTextInput?.(textValue);
    if (markdownValue !== undefined) onMarkdownInput?.(markdownValue);
  });

  const applyPhoneMarks = useEffectEvent((instance: Editor) => {
    const type = instance.schema.marks.LinkPhoneNumbers;
    if (!type) return;
    const { tr, doc } = instance.state;
    tr.removeMark(0, doc.content.size, type);
    if (linkPhoneNumbers?.length) {
      // Searches within individual text nodes only. A phone number that spans a
      // mark boundary (e.g. partially bold) is split into separate text nodes by
      // ProseMirror and will not be found. Backend-provided numbers are plain text,
      // so this is expected to be a non-issue in practice.
      doc.descendants((node, pos) => {
        if (!node.isText || !node.text) return;
        for (const number of linkPhoneNumbers) {
          // An empty string matches at every index and the search would never advance.
          if (!number) continue;
          let searchFrom = 0;
          let idx;
          while ((idx = node.text.indexOf(number, searchFrom)) !== -1) {
            tr.addMark(pos + idx, pos + idx + number.length, type.create());
            searchFrom = idx + number.length;
          }
        }
      });
    }
    instance.view.dispatch(tr);
  });

  const processValue = useEffectEvent((instance: Editor, newValue: RichTextEditorValue, returnIfEqual = true) => {
    const output = getOutput(instance, outputFormat, extensionsRef.current);

    if (returnIfEqual && deepEqual(newValue, output)) {
      // The new value came from this component and was passed back down
      // through the parent, so don't do anything here.
      return;
    }

    // If the text contains emoji characters convert them to emoji component tags
    if (typeof newValue === 'string' && outputFormat === 'text') {
      const inputUnicodeRegex = new RegExp(`(${emojiPattern})`, 'g');
      newValue = newValue?.replace(inputUnicodeRegex, '<emoji-component code="$1"></emoji-component>');
    }

    // Otherwise replace the content (resets the cursor position).
    instance.commands.setContent(newValue, {
      emitUpdate: false,
      parseOptions: { preserveWhitespace },
    });
    applyPhoneMarks(instance);
  });

  const insertPlainTextWithHardBreaks = useEffectEvent((instance: Editor, textData: string) => {
    // If we convert both newlines into hardBreak, we create a blank line.
    // Collapsing avoids the extra hardBreak while preserving single line breaks.
    const normalizedData = pasteRichText
      ? textData
      : textData.replace(/\r\n/g, '\n').replace(/\n\n/g, '\n');

    // Remove trailing newlines to avoid inserting empty lines at the end
    const trimmedData = normalizedData.replace(/[\r\n]+$/, '');

    const lines = trimmedData.split(/\r?\n/);

    const content: JSONContent[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) content.push({ type: 'hardBreak' });
      if (lines[i]) content.push({ type: 'text', text: lines[i] });
    }

    instance.chain().focus().insertContent(content).run();
  });

  const processPasteData = useEffectEvent((instance: Editor, textData: string, htmlData: string) => {
    const shouldPreserveLineBreaks = !pasteRichText
      // When pasteRichText is false, always use plain text handling to ensure HTML tags are literal
      ? !!textData
      // When pasteRichText is true, preserve line breaks for plain text that contains blank lines
      // or multiple consecutive line breaks to avoid losing formatting
      : !htmlData && !!textData && hasBlankLines(textData);

    if (shouldPreserveLineBreaks) {
      insertPlainTextWithHardBreaks(instance, textData);
      return true;
    }

    if (pasteRichText && htmlData && containsPreformattedContent(htmlData)) {
      const extractedText = extractPreformattedText(htmlData);
      if (extractedText && extractedText.includes('\n')) {
        insertPlainTextWithHardBreaks(instance, extractedText);
        return true;
      }
    }

    return false;
  });

  const handleKeyDown = useEffectEvent((_view: EditorView, event: Pick<KeyboardEvent, 'key' | 'shiftKey'>) => {
    if (allowTyping) return false;

    const allowedKeys = ['Backspace'];
    if (!allowLineBreaks && !event.shiftKey) {
      allowedKeys.push('Enter');
    }

    return !allowedKeys.includes(event.key);
  });

  const handleLinkClick = useEffectEvent((instance: Editor, event: MouseEvent) => {
    if (!link || event.button !== 0) return false;
    const anchor = (event.target as Element | null)?.closest?.('a');
    // Phone number anchors (LinkPhoneNumbers) have no href: they aren't the built-in link's.
    if (!anchor || !anchor.hasAttribute('href')) return false;
    instance.emit('link-click', {
      href: anchor.href,
      text: anchor.textContent,
      event,
    });
    return event.defaultPrevented;
  });

  const handleShiftEnter = useEffectEvent((instance: Editor) => {
    if (allowLineBreaks) {
      return false;
    }
    instance.commands.first(({ commands }) => [
      () => commands.newlineInCode(),
      () => allowBulletList && commands.splitListItem('listItem'),
      () => commands.createParagraphNear(),
      () => commands.liftEmptyBlock(),
      () => commands.splitBlock(),
    ]);
    return true;
  });

  const handleEnter = useEffectEvent(() => {
    if (allowLineBreaks) {
      return false;
    }
    onEnter?.();
    return true;
  });

  const handleEditLinkShortcut = useEffectEvent(() => {
    onEditLink?.();
    return true;
  });

  const reportSelectedCommand = useEffectEvent((command: string) => {
    onSelectedCommand?.(command);
  });

  const buildExtensions = useEffectEvent((): Extensions => {
    // These are the default extensions needed just for plain text.
    const extensions: Extensions = [Document, Text, UndoRedo, HardBreak];
    extensions.push(useDivTags ? DivParagraph : Paragraph);

    // bold must come before blockquote due to keyboard shortcuts
    if (allowBold) {
      extensions.push(Bold);
    }
    if (allowBlockquote) {
      extensions.push(Blockquote);
    }

    if (allowBulletList) {
      extensions.push(BulletList);
      extensions.push(ListItem.extend({
        renderText ({ node }) {
          return node.textContent;
        },
      }));
      extensions.push(OrderedList);
    }
    if (allowItalic) {
      extensions.push(Italic);
    }
    if (allowStrike) {
      extensions.push(Strike);
    }
    if (allowUnderline) {
      extensions.push(Underline);
    }

    // Enable placeholderText
    if (placeholder) {
      extensions.push(
        Placeholder.configure({ placeholder }),
      );
    }

    const ShiftEnter = Extension.create({
      addKeyboardShortcuts () {
        return {
          'Shift-Enter': ({ editor: instance }) => handleShiftEnter(instance),
          Enter: () => handleEnter(),
        };
      },
    });
    extensions.push(ShiftEnter);

    if (link) {
      extensions.push(TipTapLink.extend({
        inclusive: false,
        addKeyboardShortcuts () {
          return {
            'Mod-k': () => handleEditLinkShortcut(),
          };
        },
      }).configure({
        HTMLAttributes: {
          class: 'd-link d-wb-break-all',
        },
        openOnClick: false,
        // Disable autolink when customLink is active — customLink handles URL/IP
        // autolinking and the two autolink plugins can conflict on the same text.
        autolink: !customLink,
        protocols: RICH_TEXT_EDITOR_SUPPORTED_LINK_PROTOCOLS,
      }));
    }
    if (customLink) {
      extensions.push(getExtension(CustomLink, customLink));
    }
    if (linkPhoneNumbers !== null) {
      extensions.push(LinkPhoneNumbers);
    }

    if (mentionSuggestionProp) {
      // Add both the suggestion plugin as well as means for user to add suggestion items to the plugin
      const suggestionObject = { ...mentionSuggestionProp, ...mentionSuggestion };
      extensions.push(MentionPlugin.configure({ suggestion: suggestionObject }));
    }

    if (channelSuggestionProp) {
      // Add both the suggestion plugin as well as means for user to add suggestion items to the plugin
      const suggestionObject = { ...channelSuggestionProp, ...channelSuggestion };
      extensions.push(ChannelPlugin.configure({ suggestion: suggestionObject }));
    }

    if (slashCommandSuggestionProp) {
      // Add both the suggestion plugin as well as means for user to add suggestion items to the plugin
      const suggestionObject = { ...slashCommandSuggestionProp, ...slashCommandSuggestion };
      extensions.push(SlashCommandPlugin.configure({
        suggestion: suggestionObject,
        onSelectedCommand: (command: string) => reportSelectedCommand(command),
      }));
    }

    if (allowVariable) {
      extensions.push(Variable.configure({
        variableItems,
      }));
    }

    // Emoji has some interactions with Enter key
    // hence this should be done last otherwise the enter wont add a emoji.
    extensions.push(Emoji);

    if (allowTextAlign) {
      extensions.push(TextAlign.configure({
        types: ['paragraph'],
      }));
    }

    if (allowCode) {
      extensions.push(Code);
    }

    if (allowCodeblock) {
      extensions.push(CodeBlock.extend({
        renderText (props) {
          const { node, pos } = props;
          // tiptap's types don't list it yet, but 3.x passes range = { from, to } (the overall selection range).
          const { range } = props as typeof props & { range?: { from: number; to: number } };
          // Full node in range: wrap in fences (getText(), full doc selection).
          // Partial selection: return only the overlapping text.
          const from = range?.from ?? 0;
          const to = range?.to ?? (pos + node.nodeSize);
          if (from <= pos && to >= pos + node.nodeSize) {
            return `\`\`\`\n${node.textContent}\n\`\`\``;
          }
          const textStart = Math.max(0, from - pos - 1);
          const textEnd = Math.min(node.textContent.length, to - pos - 1);
          return node.textContent.slice(textStart, textEnd);
        },
        addCommands () {
          return {
            ...this.parent?.(),
            toggleCodeBlock: (attributes = {} as { language: string }) => ({ state, chain, commands }) => {
              const codeBlockType = state.schema.nodes[this.name];
              const { $from, $to } = state.selection;

              const blocks: { node: typeof state.doc; pos: number }[] = [];
              state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
                if (node.isTextblock) {
                  blocks.push({ node, pos });
                  return false;
                }
              });

              // Single block, in either direction: defer to the built-in. It uses
              // setBlockType, which changes the node's type in place rather than
              // replacing its content, so the cursor and any selection map through
              // untouched. Untoggling this way also leaves the block's newlines as
              // hard breaks in one paragraph, which round-trips the original text
              // exactly (splitting into separate paragraphs would turn each single
              // newline into a paragraph break).
              if (blocks.length <= 1) {
                return commands.toggleNode(this.name, 'paragraph', attributes);
              }

              // Every selected block is already a code block, so the button reads as
              // active and pressing it has to turn them all off rather than merge
              // them. Passing no attributes on purpose: they take part in the
              // is-active check, so a language on the command would stop blocks with
              // a different language from toggling off.
              if (blocks.every(({ node }) => node.type === codeBlockType)) {
                return commands.toggleNode(this.name, 'paragraph');
              }

              // A mix of blocks, or several paragraphs: merge into a single code
              // block. The built-in would give one code block per paragraph instead,
              // so retype them all and then stitch the results together.
              return chain()
                .setNode(this.name, attributes)
                .command(({ tr }) => {
                  // Replace only the boundary between two adjacent code blocks with a
                  // newline. That is a small enough step that every text position on
                  // either side maps through it, so the caret, the selected range and
                  // its direction all survive without being recomputed. Walk the
                  // boundaries back to front to keep the earlier positions valid.
                  for (let index = blocks.length - 1; index > 0; index--) {
                    const blockStart = tr.mapping.map(blocks[index].pos);
                    const previousBlockEnd = blockStart - 1;
                    if (tr.doc.resolve(previousBlockEnd).parent.type !== codeBlockType) continue;
                    tr.replaceWith(previousBlockEnd, blockStart + 1, state.schema.text('\n'));
                  }
                  return true;
                })
                .run();
            },
          };
        },
      }).configure({
        HTMLAttributes: {
          class: 'd-rich-text-editor__code-block',
        },
      }));
    }

    if (allowInlineImages) {
      extensions.push(ConfigurableImage.configure({
        resize: {
          enabled: allowImageResize,
          alwaysPreserveAspectRatio: true,
        },
      }));
    }

    if (allowFontFamily ||
      allowFontColor ||
      allowFontSize ||
      allowBackgroundColor ||
      allowLineHeight) {
      extensions.push(TextStyleKit.configure({
        // CustomTextStyle below provides the `textStyle` mark, so disable the
        // kit's own copy to avoid a duplicate extension name.
        textStyle: false,
        color: allowFontColor ? undefined : false,
        backgroundColor: allowBackgroundColor ? undefined : false,
        fontFamily: allowFontFamily ? undefined : false,
        fontSize: allowFontSize ? undefined : false,
        lineHeight: allowLineHeight ? undefined : false,
      }));
      extensions.push(CustomTextStyle);
    }

    if (additionalExtensions.length) {
      extensions.push(...additionalExtensions);
    }

    if (allowTables) {
      extensions.push(CustomTable.configure({ resizable: true }),
        CustomTableRow, CustomTableHeader, CustomTableCell, Gapcursor);
    }
    return extensions;
  });

  const reportSelected = useEffectEvent((instance: Editor) => onSelected?.(getSelectedLinkText(instance)));
  const reportFocus = useEffectEvent((event: FocusEvent) => onFocus?.(event));
  const reportBlur = useEffectEvent((event: FocusEvent) => onBlur?.(event));
  const reportMentionClick = useEffectEvent((data: MentionData) => onMentionClick?.(data));
  const reportMentionHover = useEffectEvent((data: MentionPointerData) => onMentionHover?.(data));
  const reportMentionLeave = useEffectEvent((data: MentionPointerData) => onMentionLeave?.(data));
  const reportChannelClick = useEffectEvent((data: ChannelData) => onChannelClick?.(data));
  const reportPhoneClick = useEffectEvent((data: PhoneClickData) => onPhoneClick?.(data));
  const reportLinkClick = useEffectEvent((data: LinkClickData) => onLinkClick?.(data));

  const createEditor = useEffectEvent((): Editor => {
    const extensions = buildExtensions();
    extensionsRef.current = extensions;

    // For all available options, see https://tiptap.dev/api/editor#settings
    const instance: Editor = new Editor({
      autofocus: autoFocus,
      content: currentValue,
      editable,
      extensions,
      parseOptions: {
        preserveWhitespace,
      },

      editorProps: {
        attributes: {
          ...inputAttrs(editable),
          class: inputClass,
        } as Record<string, string>,

        // Emit `link-click` for anchors from the built-in `link` extension so
        // consumers can intercept links (e.g. to navigate same-origin URLs
        // in-app instead of opening a new tab). The default anchor behavior is
        // preserved; a listener may call event.preventDefault() to suppress
        // the default navigation. Scoped to the `link` extension to match the
        // event's documented contract (the custom link extension is out of
        // scope and does not emit this event).
        //
        // Uses a DOM click handler rather than ProseMirror's handleClick:
        // handleClick is not invoked on a non-editable view (e.g. a read-only
        // editor rendering a message), whereas handleDOMEvents fires for real
        // DOM clicks regardless of editable state.
        handleDOMEvents: {
          click: (_view, event) => handleLinkClick(instance, event),
        },

        handleKeyDown: (view, event) => handleKeyDown(view, event),

        handlePaste: (_view, event) => {
          const clipboardData = event.clipboardData ||
            (window as unknown as { clipboardData: DataTransfer }).clipboardData;
          // ProseMirror can call this with its parsed slice and an event that has no clipboard data: let it insert.
          if (!clipboardData) return false;
          const textData = clipboardData.getData('text/plain');
          const htmlData = clipboardData.getData('text/html');

          return processPasteData(instance, textData, htmlData);
        },

        transformPastedHTML,
      },
    });

    // The Editor exposes event hooks that we have to map our callbacks into. See
    // https://tiptap.dev/api/events for all events.
    instance.on('create', () => triggerInputChangeEvents(instance));
    // The content has changed.
    instance.on('update', () => triggerInputChangeEvents(instance));
    instance.on('selectionUpdate', ({ editor: updated }) => reportSelected(updated));
    // The editor is focused.
    instance.on('focus', ({ event }) => reportFocus(event));
    // The editor isn't focused anymore.
    instance.on('blur', ({ event }) => reportBlur(event));
    // Mention is clicked
    instance.on('mention-click', mentionData => reportMentionClick(mentionData));
    // Cursor enters a mention
    instance.on('mention-hover', mentionData => reportMentionHover(mentionData));
    // Cursor leaves a mention
    instance.on('mention-leave', mentionData => reportMentionLeave(mentionData));
    // Channel is clicked
    instance.on('channel-click', channelData => reportChannelClick(channelData));
    // Phone number link is clicked — only emitted by the LinkPhoneNumbers extension
    instance.on('phone-click', phoneData => reportPhoneClick(phoneData));
    // A link is clicked — only emitted when the built-in `link` extension is active
    instance.on('link-click', linkData => reportLinkClick(linkData));
    return instance;
  });

  // Vue creates the editor before mounting, and recreates it whenever the extensions change: they can't be
  // registered on the fly (https://github.com/ueberdosis/tiptap/issues/1044). The dependencies are the props
  // buildExtensions reads; createEditor reads every other prop at creation time, as Vue's createEditor does.
  const hasPhoneNumbers = linkPhoneNumbers !== null;
  const variableItemsDep = allowVariable ? variableItems : null;
  const imageResizeDep = allowInlineImages && allowImageResize;
  useLayoutEffect(() => {
    const instance = createEditor();
    editorRef.current = instance;
    setEditor(instance);
    return () => {
      instance.destroy();
      if (editorRef.current === instance) editorRef.current = null;
    };
  }, [
    useDivTags, allowBold, allowBlockquote, allowBulletList, allowItalic, allowStrike, allowUnderline, placeholder,
    link, customLink, hasPhoneNumbers, mentionSuggestionProp, channelSuggestionProp, slashCommandSuggestionProp,
    allowVariable, variableItemsDep, allowTextAlign, allowCode, allowCodeblock, allowInlineImages, imageResizeDep,
    allowFontFamily, allowFontColor, allowFontSize, allowBackgroundColor, allowLineHeight, additionalExtensions,
    allowTables,
  ]);

  // Vue's mounted(): the initial value goes through processValue once, converting emoji in text and marking phone
  // numbers. Declared after the effect that creates the editor, so it sees that editor.
  useLayoutEffect(() => {
    if (editorRef.current) processValue(editorRef.current, currentValue, false);
    // No dependencies on purpose: this is the mount step; later values go through the value watcher below.
  }, []);

  // Vue's watchers, which don't run on mount: each compares against the value the editor last saw.
  const lastValue = useRef(currentValue);
  useEffect(() => {
    if (Object.is(lastValue.current, currentValue)) return;
    lastValue.current = currentValue;
    if (editorRef.current) processValue(editorRef.current, currentValue);
  }, [currentValue]);

  const lastEditable = useRef(editable);
  useEffect(() => {
    if (lastEditable.current === editable) return;
    lastEditable.current = editable;
    const instance = editorRef.current;
    if (!instance) return;
    // No update event: the content hasn't changed, so save and validation listeners shouldn't hear of it.
    instance.setEditable(editable, false);
    updateEditorAttributes(instance, { 'aria-readonly': !editable });
  }, [editable]);

  const lastInputClass = useRef(inputClass);
  useEffect(() => {
    if (lastInputClass.current === inputClass) return;
    lastInputClass.current = inputClass;
    if (editorRef.current) updateEditorAttributes(editorRef.current, { class: inputClass });
  }, [inputClass]);

  const lastInputAriaLabel = useRef(inputAriaLabel);
  useEffect(() => {
    if (lastInputAriaLabel.current === inputAriaLabel) return;
    lastInputAriaLabel.current = inputAriaLabel;
    if (editorRef.current) updateEditorAttributes(editorRef.current, { 'aria-label': inputAriaLabel });
  }, [inputAriaLabel]);

  const lastLinkPhoneNumbers = useRef(linkPhoneNumbers);
  useEffect(() => {
    if (lastLinkPhoneNumbers.current === linkPhoneNumbers) return;
    lastLinkPhoneNumbers.current = linkPhoneNumbers;
    if (editorRef.current) applyPhoneMarks(editorRef.current);
  }, [linkPhoneNumbers]);

  // The link bubble menu. tiptap's BubbleMenuPlugin moves its element into the document when it shows and out when
  // it hides, so that element is one this component owns, as Vue's BubbleMenu root; the buttons portal into it.
  const [bubbleMenuEl] = useState(() => (typeof document === 'undefined' ? null : document.createElement('div')));
  const bubbleMenuShouldShow = useEffectEvent((instance: Editor) => showLinkBubbleMenu && instance.isActive('link'));
  const hasLink = !!link;
  useEffect(() => {
    if (!editor || !hasLink || !bubbleMenuEl || editor.isDestroyed) return;
    bubbleMenuEl.style.visibility = 'hidden';
    bubbleMenuEl.style.position = 'absolute';
    editor.registerPlugin(BubbleMenuPlugin({
      editor,
      element: bubbleMenuEl,
      options: FLOATING_OPTIONS,
      pluginKey: BUBBLE_MENU_PLUGIN_KEY,
      // The plugin doesn't clear its update timer when the editor is destroyed, so this can run afterwards, when
      // the editor has no view left: then there's nothing to show the menu over.
      appendTo: () => (editor.isDestroyed
        ? undefined
        : (editor.view.dom.getRootNode() as Document | ShadowRoot).querySelector('body')) as HTMLElement,
      shouldShow: ({ editor: instance }) => bubbleMenuShouldShow(instance),
    }));
    return () => {
      if (!editor.isDestroyed) editor.unregisterPlugin(BUBBLE_MENU_PLUGIN_KEY);
      bubbleMenuEl.remove();
    };
  }, [editor, hasLink, bubbleMenuEl]);

  const editLink = () => {
    if (!editor) return;
    const linkText = getSelectedLinkText(editor);

    onEditLink?.({
      href: editor.getAttributes('link').href,
      text: linkText,
    });
  };

  const openLink = () => {
    editor?.chain()?.focus();
    const href = editor?.getAttributes('link').href;
    // noopener: the destination can't reach this window through window.opener.
    window.open(href, '_blank', 'noopener');
  };

  useImperativeHandle(ref, () => ({
    get editor () {
      return editorRef.current;
    },

    focusEditor () {
      editorRef.current?.commands.focus();
    },

    getOutput () {
      return editorRef.current ? getOutput(editorRef.current, outputFormat, extensionsRef.current) : undefined;
    },

    setLink (linkInput, linkText, linkOptions, linkProtocols = RICH_TEXT_EDITOR_SUPPORTED_LINK_PROTOCOLS,
      defaultPrefix) {
      const instance = editorRef.current;
      if (!linkInput) {
        // If link text is set to empty string,
        // remove any existing links.
        removeLink(instance);
        return;
      }
      if (!instance) return;

      // Check if input matches any of the supported link formats. Vue tests each one as a RegExp, so its default
      // protocol names throw there; a name matches as `<name>:` here.
      const prefix = linkProtocols.find(protocol => typeof protocol === 'string'
        ? linkInput.startsWith(`${protocol}:`)
        : protocol.test(linkInput));

      if (!prefix) {
        // If no matching pattern is found, prepend default prefix
        linkInput = `${defaultPrefix ?? ''}${linkInput}`;
      }

      instance
        .chain()
        .focus()
        .extendMarkRange('link')
        .run();

      const selection = instance.view.state.selection;
      const displayText = linkText || linkInput;

      instance
        .chain()
        .focus()
        .insertContent(displayText)
        .setTextSelection({ from: selection.from, to: selection.from + displayText.length })
        .setLink({ href: linkInput, class: linkOptions.class })
        .run();
    },

    removeLink () {
      removeLink(editorRef.current);
    },

    forceLinkifyPendingText () {
      if (!editorRef.current || !link || customLink) {
        return;
      }

      flushPendingLinks(editorRef.current);
    },
  }), [outputFormat, link, customLink]);

  return (
    <div {...attrs} {...listeners} className={className} style={style}>
      {editor && link && bubbleMenuEl && createPortal(
        <div className="d-popover__dialog">
          <DtStack
            direction="row"
            className="d-rich-text-editor-bubble-menu__button-stack"
            gap="0"
          >
            <DtButton
              kind="muted"
              importance="clear"
              onClick={editLink}
            >
              {i18n.$t('DIALTONE_RICH_TEXT_EDITOR_EDIT_BUTTON_LABEL')}
            </DtButton>
            <DtButton
              kind="muted"
              importance="clear"
              onClick={openLink}
            >
              {i18n.$t('DIALTONE_RICH_TEXT_EDITOR_OPEN_LINK_BUTTON_LABEL')}
            </DtButton>
            <DtButton
              kind="critical"
              importance="clear"
              onClick={() => removeLink(editor)}
            >
              {i18n.$t('DIALTONE_RICH_TEXT_EDITOR_REMOVE_BUTTON_LABEL')}
            </DtButton>
          </DtStack>
        </div>,
        bubbleMenuEl,
      )}
      <EditorContent
        editor={editor}
        className={cx('d-rich-text-editor', className)}
        data-qa="dt-rich-text-editor"
        style={style}
        {...attrs}
      />
    </div>
  );
}
