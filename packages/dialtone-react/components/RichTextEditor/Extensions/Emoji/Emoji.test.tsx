import { act, render, type RenderResult } from '@testing-library/react';
import type { JSONContent } from '@tiptap/core';
import { DtRichTextEditor, type DtRichTextEditorHandle, type DtRichTextEditorProps } from '../../RichTextEditor';

// Wrappers
let result: RenderResult;
let handle: DtRichTextEditorHandle;
let editorEl: HTMLElement;

// Constants
const baseProps: Partial<DtRichTextEditorProps> = {
  value: 'init',
  inputAriaLabel: 'aria-label text',
  link: true,
  inputClass: 'qa-editor',
  showLinkBubbleMenu: false,
};

const getClientRectsMock = vi.fn(() => [{}] as unknown as DOMRectList);
const getBoundingClientRect = vi.fn(() => [{}] as unknown as DOMRect);
const scrollByMock = vi.fn();

// Helpers
const _setChildWrappers = () => {
  editorEl = document.getElementsByClassName('qa-editor')[0] as HTMLElement;
};

const _setValue = async (value: string) => {
  await act(async () => {
    editorEl.innerHTML = value;
  });
};

const _getEmojiNodesFromJSON = () => {
  const json = handle.editor!.getJSON();
  const emojiNodes: JSONContent[] = [];

  for (const paragraph of json.content ?? []) {
    if (!paragraph.content) continue;

    for (const node of paragraph.content) {
      if (node.type !== 'emoji') continue;
      emojiNodes.push(node);
    }
  }

  return emojiNodes;
};

const _mountWrapper = () => {
  result = render(
    <DtRichTextEditor
      ref={(instance) => {
        if (instance) handle = instance;
      }}
      inputAriaLabel="aria-label text"
      {...baseProps}
    />,
  );
};

describe('DtRichTextEditor Emoji Extension tests', () => {
  // Test Setup
  beforeAll(() => {
    Range.prototype.getClientRects = getClientRectsMock;
    Range.prototype.getBoundingClientRect = getBoundingClientRect;
    globalThis.scrollBy = scrollByMock;
  });

  beforeEach(async () => {
    _mountWrapper();
    await act(async () => {});
    _setChildWrappers();
  });

  // Test Teardown
  afterEach(() => {
    result.unmount();
  });

  describe('Functionality Tests', () => {
    describe('Shortcodes', () => {
      it(':cat: should be a valid shortcode for emoji', async () => {
        await _setValue(':cat:');
        expect(_getEmojiNodesFromJSON().length).toBe(1);
      });

      it(':caat: should not be a valid shortcode for emoji', async () => {
        await _setValue(':caat:');
        expect(_getEmojiNodesFromJSON().length).toBe(0);
      });
    });
  });
});
