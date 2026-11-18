import { act, fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import { TextSelection } from '@tiptap/pm/state';
import type { Editor } from '@tiptap/core';
import { simulatePaste } from '../../tests/helpers/clipboard';
import { findVariable, countVariables, type EditorNode } from '../../tests/helpers/node_traversal';
import { DtRichTextEditor, type DtRichTextEditorHandle, type DtRichTextEditorProps } from './RichTextEditor';

// Test Environment
let result: RenderResult;
let handle: DtRichTextEditorHandle;
let props: Partial<DtRichTextEditorProps>;
let inputStub: ReturnType<typeof vi.fn>;
let listeners: Record<string, ReturnType<typeof vi.fn>>;
let editor: HTMLElement;
let editorEl: HTMLElement;

// Constants
const baseProps: Partial<DtRichTextEditorProps> = {
  value: 'initial value',
  inputAriaLabel: 'aria-label text',
  inputClass: 'qa-editor',
  allowInlineImages: true,
};

// What Vue's wrapper.emitted(name) reads: every call of the matching callback.
const emitted = (name: string) => listeners[name]?.mock.calls.length ? listeners[name].mock.calls : undefined;

const setRef = (instance: DtRichTextEditorHandle | null) => {
  if (instance) handle = instance;
};

// The tiptap editor, as Vue's tests read wrapper.vm.editor.
const getEditor = (): Editor => handle.editor!;

const element = () => (
  <DtRichTextEditor
    ref={setRef}
    inputAriaLabel="aria-label text"
    {...props}
    onValueChange={inputStub}
    {...listeners}
  />
);

// Helpers
const _setChildWrappers = () => {
  editor = screen.getByTestId('dt-rich-text-editor').querySelector('div[contenteditable]') as HTMLElement;
  editorEl = document.getElementsByClassName('qa-editor')[0] as HTMLElement;
};

const _mountWrapper = () => {
  result = render(element());
};

// Vue's `await $nextTick()`. tiptap renders node views and suggestion popups through React portals, a microtask
// after it creates them, so this lets those settle too.
const flush = async () => {
  await act(async () => {});
};

const setProps = async (newProps: Partial<DtRichTextEditorProps>) => {
  props = { ...props, ...newProps };
  await act(async () => {
    result.rerender(element());
  });
  _setChildWrappers();
};

const _setValue = async (value: string) => {
  // Vue's tests read what was emitted after their `await setProps()`, which waits for microtasks only, so the
  // editor's `create` event (a timeout in tiptap) hasn't emitted yet. React's act() lets that timeout run, so drop
  // what it emitted: the test is about the value set here.
  inputStub.mockClear();
  // Use TipTap's setContent API, which emits an update as Vue's test triggers one by hand.
  await act(async () => {
    getEditor().commands.setContent(value, { emitUpdate: true, parseOptions: { preserveWhitespace: 'full' } });
  });
};

describe('DtRichTextEditor tests', () => {
  // Test Setup
  beforeAll(() => {
    Range.prototype.getClientRects = vi.fn(() => [{}] as unknown as DOMRectList);
    Range.prototype.getBoundingClientRect = vi.fn(() => [{}] as unknown as DOMRect);
    globalThis.scrollBy = vi.fn();
  });

  beforeEach(async () => {
    props = { ...baseProps };
    inputStub = vi.fn();
    listeners = {
      onEnter: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      onEditLink: vi.fn(),
      onSelectedCommand: vi.fn(),
      onMentionClick: vi.fn(),
      onMentionHover: vi.fn(),
      onMentionLeave: vi.fn(),
      onChannelClick: vi.fn(),
      onLinkClick: vi.fn(),
    };
    _mountWrapper();
    await flush();
    _setChildWrappers();
  });

  // Test Teardown
  afterEach(() => {
    result.unmount();
  });

  describe('Presentation Tests', function () {
    it('should render the component', function () {
      expect(screen.getByTestId('dt-rich-text-editor')).toBeInTheDocument();
    });

    it('should contain the initial value', function () {
      expect(editor.textContent).toBe('initial value');
    });
  });

  describe('Reactivity Tests', function () {
    describe('User Input Tests', function () {
      describe('When user inputs a value', function () {
        // Shared Examples
        const itBehavesLikeOutputsCorrectly = (value: string, output: unknown, onlyCheckOutputContained = false) => {
          it('should emit the output value', async () => {
            await _setValue(value);

            const emittedOutput = inputStub.mock.calls[0]?.[0];

            if (onlyCheckOutputContained) {
              expect(emittedOutput).toContain(output);
            } else {
              expect(emittedOutput).toEqual(output);
            }
            expect(inputStub).toHaveBeenCalled();
          });
        };

        describe('When using text output', function () {
          // Test Setup
          beforeEach(async function () {
            await setProps({ outputFormat: 'text' });
          });

          itBehavesLikeOutputsCorrectly('new value', 'new value');
        });

        describe('When using json output', function () {
          // Test Environment
          const jsonOutput = {
            type: 'doc',
            content: [{
              type: 'paragraph',
              attrs: {
                textAlign: null,
              },
              content: [{
                text: 'new value',
                type: 'text',
              }],
            }],
          };

          // Test Setup
          beforeEach(async function () {
            await setProps({ outputFormat: 'json' });
          });

          itBehavesLikeOutputsCorrectly('new value', jsonOutput);
        });

        describe('When using html output', function () {
          // Test Setup
          beforeEach(async function () {
            await setProps({ outputFormat: 'html' });
          });

          itBehavesLikeOutputsCorrectly('new value', '<p>new value</p>');

          const htmlWithImgTag = 'image <img src="http://someimgurl.com" height="100px" width="200px" />';

          itBehavesLikeOutputsCorrectly(htmlWithImgTag, 'height="100px"', true);
          itBehavesLikeOutputsCorrectly(htmlWithImgTag, 'width="200px"', true);
          itBehavesLikeOutputsCorrectly(htmlWithImgTag, 'src="http://someimgurl.com"', true);
        });

        // PORT: When using markdown output
      });
    });

    // PORT: Copy paste tests, Font styling tests
  });

  // PORT: Interactivity Tests

  describe('Accessibility Tests', () => {
    it('should have aria-multiline attribute', () => {
      expect(editor).toHaveAttribute('aria-multiline', 'true');
    });

    it('should have role attribute', function () {
      expect(editor).toHaveAttribute('role', 'textbox');
    });

    describe('When not editable', function () {
      beforeEach(async function () {
        await setProps({ editable: false });
      });

      it('should have aria-readonly attribute', function () {
        expect(editor).toHaveAttribute('aria-readonly', 'true');
      });

      it('should preserve input classes', function () {
        expect(editor.getAttribute('class')).toContain('qa-editor');
      });
    });
  });

  describe('Extendability Tests', function () {
    describe('When an inputAriaLabel prop is provided', function () {
      beforeEach(async function () {
        await setProps({ inputAriaLabel: 'new aria-label' });
      });

      it('should pass through the prop to the editor', function () {
        expect(editor).toHaveAttribute('aria-label', 'new aria-label');
      });
    });

    describe('When an inputClass prop is provided', function () {
      beforeEach(async function () {
        await setProps({ inputClass: 'input-class' });
      });

      it('should pass through the prop to the editor', function () {
        expect(editor).toHaveClass('input-class');
      });
    });

    describe('When an editable prop is provided', function () {
      beforeEach(async function () {
        await setProps({ editable: false });
      });

      it('should pass through the prop to the editor', function () {
        expect(editor).toHaveAttribute('contenteditable', 'false');
      });
    });
  });

  describe('Slash Command Event Tests', function () {
    describe('When slash command suggestion is enabled', function () {
      let slashCommandSuggestion: DtRichTextEditorProps['slashCommandSuggestion'];

      beforeEach(async function () {
        slashCommandSuggestion = {
          items: () => [
            { command: 'test', description: 'Test command' },
            { command: 'example', description: 'Example command' },
          ],
        };

        await setProps({
          slashCommandSuggestion,
        });
      });

      it('should emit selected-command event when slash command component is created', async function () {
        // Get the editor instance
        const editorInstance = getEditor();

        // Manually create a slash command node to simulate selection
        const slashCommandNode = editorInstance.schema.nodes['slash-commands'].create({
          command: 'test',
        });

        // Insert the node into the editor
        const tr = editorInstance.state.tr.insert(0, slashCommandNode);
        await act(async () => {
          editorInstance.view.dispatch(tr);
        });

        // Check if the selected-command event was emitted
        const emittedEvents = emitted('onSelectedCommand');
        expect(emittedEvents![0][0]).toBe('test');
      });

      it('should handle different slash commands correctly', async function () {
        const editorInstance = getEditor();

        // Test with different command
        const slashCommandNode = editorInstance.schema.nodes['slash-commands'].create({
          command: 'example',
        });

        const tr = editorInstance.state.tr.insert(0, slashCommandNode);
        await act(async () => {
          editorInstance.view.dispatch(tr);
        });

        const emittedEvents = emitted('onSelectedCommand');
        expect(emittedEvents![0][0]).toBe('example');
      });
    });

    describe('When slash command suggestion is not enabled', function () {
      it('should not emit selected-command events', function () {
        // Default props don't include slashCommandSuggestion
        const emittedEvents = emitted('onSelectedCommand');
        expect(emittedEvents).toBeFalsy();
      });
    });
  });

  // PORT: Variable Extension Tests, Codeblock toggle tests
});

// Referenced by the sections still to port.
export const _unused = { TextSelection, simulatePaste, findVariable, countVariables, fireEvent, editorEl } as {
  TextSelection: unknown; simulatePaste: unknown; findVariable: unknown; countVariables: unknown; fireEvent: unknown;
  editorEl: unknown; node?: EditorNode;
};
