import { act, render, type RenderResult } from '@testing-library/react';
import type { JSONContent } from '@tiptap/core';
import type { EditorState } from '@tiptap/pm/state';
import type { Mock } from 'vitest';
import { DtRichTextEditor, type DtRichTextEditorHandle, type DtRichTextEditorProps } from '../../RichTextEditor';

let result: RenderResult;
let handle: DtRichTextEditorHandle;
let props: Partial<DtRichTextEditorProps>;
let onPhoneClick: Mock<NonNullable<DtRichTextEditorProps['onPhoneClick']>>;

const PHONE_NUMBER = '(714) 410-7035';

const baseProps: Partial<DtRichTextEditorProps> = {
  value: '',
  inputAriaLabel: 'aria-label text',
  linkPhoneNumbers: [PHONE_NUMBER],
  inputClass: 'qa-editor',
};

const element = () => (
  <DtRichTextEditor
    ref={(instance) => {
      if (instance) handle = instance;
    }}
    inputAriaLabel="aria-label text"
    {...props}
    onPhoneClick={onPhoneClick}
  />
);

const _mountWrapper = (newProps: Partial<DtRichTextEditorProps> = {}) => {
  // Vue's tests mount again over the one from beforeEach; here that one goes first.
  result?.unmount();
  props = { ...baseProps, ...newProps };
  result = render(element());
};

const setProps = async (newProps: Partial<DtRichTextEditorProps>) => {
  props = { ...props, ...newProps };
  await act(async () => {
    result.rerender(element());
  });
};

// Vue's `setProps({ modelValue })`: the controlled value changes and the editor takes it.
const _setValue = async (value: string) => {
  await setProps({ value });
};

const _getPhoneLinksFromJSON = () => {
  const json = handle.editor!.getJSON();
  const links: JSONContent[] = [];
  for (const paragraph of json.content ?? []) {
    for (const textNode of (paragraph.content ?? [])) {
      if (!textNode.marks?.some(mark => mark.type === 'LinkPhoneNumbers')) continue;
      links.push(textNode);
    }
  }
  return links;
};

const _findPhoneMarkPos = (state: EditorState) => {
  let pos = null as number | null;
  state.doc.descendants((node, nodePos) => {
    if (node.isText && node.marks.some(m => m.type.name === 'LinkPhoneNumbers')) {
      pos = nodePos + 1;
    }
  });
  return pos;
};

describe('LinkPhoneNumbers extension', () => {
  beforeAll(() => {
    Range.prototype.getClientRects = vi.fn(() => [{}] as unknown as DOMRectList);
    Range.prototype.getBoundingClientRect = vi.fn(() => [{}] as unknown as DOMRect);
    globalThis.scrollBy = vi.fn();
  });

  beforeEach(async () => {
    onPhoneClick = vi.fn<NonNullable<DtRichTextEditorProps['onPhoneClick']>>();
    _mountWrapper();
    await act(async () => {});
  });

  afterEach(() => {
    result.unmount();
  });

  describe('exact-match linking', () => {
    it('links a number in the phoneNumbers list', async () => {
      await _setValue(`call me at ${PHONE_NUMBER} any time!`);
      const links = _getPhoneLinksFromJSON();
      expect(links).toHaveLength(1);
      expect(links[0].text).toBe(PHONE_NUMBER);
    });

    it('does not link a number not in the phoneNumbers list', async () => {
      await _setValue('call me at (800) 555-0100 any time!');
      expect(_getPhoneLinksFromJSON()).toHaveLength(0);
    });

    it('links multiple occurrences of the same number', async () => {
      await _setValue(`${PHONE_NUMBER} or ${PHONE_NUMBER}`);
      expect(_getPhoneLinksFromJSON()).toHaveLength(2);
    });

    it('does not link plain text with no matching number', async () => {
      await _setValue('check out dialpad.com it is cool');
      expect(_getPhoneLinksFromJSON()).toHaveLength(0);
    });
  });

  describe('when linkPhoneNumbers is an empty array', () => {
    it('links nothing', async () => {
      _mountWrapper({ linkPhoneNumbers: [] });
      await _setValue(`call me at ${PHONE_NUMBER} any time!`);
      expect(_getPhoneLinksFromJSON()).toHaveLength(0);
    });
  });

  describe('when linkPhoneNumbers prop changes', () => {
    it('applies marks when the prop is updated after content is set', async () => {
      _mountWrapper({ linkPhoneNumbers: [] });
      await _setValue(`call me at ${PHONE_NUMBER} any time!`);
      expect(_getPhoneLinksFromJSON()).toHaveLength(0);

      await setProps({ linkPhoneNumbers: [PHONE_NUMBER] });
      expect(_getPhoneLinksFromJSON()).toHaveLength(1);
    });

    it('removes stale marks when a number is no longer in the list', async () => {
      const OTHER_NUMBER = '(800) 555-0199';
      _mountWrapper({ linkPhoneNumbers: [PHONE_NUMBER] });
      await _setValue(`${PHONE_NUMBER} or ${OTHER_NUMBER}`);
      expect(_getPhoneLinksFromJSON()).toHaveLength(1);

      await setProps({ linkPhoneNumbers: [OTHER_NUMBER] });
      const links = _getPhoneLinksFromJSON();
      expect(links).toHaveLength(1);
      expect(links[0].text).toBe(OTHER_NUMBER);
    });

    it('removes all marks when linkPhoneNumbers becomes an empty array', async () => {
      await _setValue(`call me at ${PHONE_NUMBER} any time!`);
      expect(_getPhoneLinksFromJSON()).toHaveLength(1);

      await setProps({ linkPhoneNumbers: [] });
      expect(_getPhoneLinksFromJSON()).toHaveLength(0);
    });
  });

  describe('phone-click event', () => {
    it('emits phone-click when a phone number link is clicked', async () => {
      await _setValue(`call me at ${PHONE_NUMBER} any time!`);

      const { state, view } = handle.editor!;
      const pos = _findPhoneMarkPos(state);
      // Invoke click handler directly — dispatchEvent does not work in JSDOM
      // because ProseMirror relies on getBoundingClientRect to resolve positions.
      await act(async () => {
        view.someProp('handleClick', (fn) => fn(view, pos as number, new MouseEvent('click')));
      });

      expect(onPhoneClick).toHaveBeenCalled();
      expect(onPhoneClick.mock.calls[0][0]).toEqual({ phoneNumber: PHONE_NUMBER });
    });

    it('does not emit phone-click when no phone mark is at the clicked position', async () => {
      await _setValue('no phone here just text');

      const { view } = handle.editor!;
      await act(async () => {
        view.someProp('handleClick', (fn) => fn(view, 1, new MouseEvent('click')));
      });

      expect(onPhoneClick).not.toHaveBeenCalled();
    });
  });
});
