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
let inputStub: ReturnType<typeof vi.fn<(value: unknown) => void>>;
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

        describe('When using markdown output', () => {
          type JsonNode = Record<string, unknown>;

          const jsonInputBase = (innerContent: JsonNode[]) => {
            return {
              type: 'doc',
              content: [{
                type: 'paragraph',
                content: innerContent,
              }],
            };
          };

          const setContent = async (jsonInput: JsonNode) => {
            await act(async () => {
              getEditor().commands.setContent(jsonInput);
            });
          };

          const getMarkdownOutput = async (jsonInput: JsonNode) => {
            await setContent(jsonInput);
            return handle.getOutput();
          };

          beforeEach(async () => {
            await setProps({ outputFormat: 'markdown' });
          });

          it('should convert JSON to markdown correctly', async () => {
            const jsonInput = jsonInputBase([{
              type: 'text',
              text: 'bold text',
              marks: [{ type: 'bold' }],
            }]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe('**bold text**');
          });

          it('should convert italic text to markdown correctly', async () => {
            const jsonInput = jsonInputBase([{
              type: 'text',
              text: 'italic text',
              marks: [{ type: 'italic' }],
            }]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe('*italic text*');
          });

          it('should convert strikethrough text to markdown correctly', async () => {
            const jsonInput = jsonInputBase([{
              type: 'text',
              text: 'strikethrough text',
              marks: [{ type: 'strike' }],
            }]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe('~~strikethrough text~~');
          });

          it('should convert links to markdown correctly', async () => {
            await setProps({ link: true });

            const jsonInput = jsonInputBase([{
              type: 'text',
              text: 'link text',
              marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
            }]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe('[link text](https://example.com)');
          });

          it('should convert bullet lists to markdown without extra newlines', async () => {
            await setProps({ allowBulletList: true });

            const jsonInput = {
              type: 'doc',
              content: [{
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [jsonInputBase([{ type: 'text', text: 'First item' }]).content[0]],
                  },
                  {
                    type: 'listItem',
                    content: [jsonInputBase([{ type: 'text', text: 'Second item' }]).content[0]],
                  },
                  {
                    type: 'listItem',
                    content: [jsonInputBase([{ type: 'text', text: 'Third item' }]).content[0]],
                  },
                ],
              }],
            };
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe('- First item\n- Second item\n- Third item');
          });

          it('should convert bullet lists with formatting to markdown correctly', async () => {
            await setProps({ allowBulletList: true });
            const jsonInput = {
              type: 'doc',
              content: [{
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [jsonInputBase([
                      { type: 'text', text: 'Item with ' },
                      { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
                      { type: 'text', text: ' text' },
                    ]).content[0]],
                  },
                  {
                    type: 'listItem',
                    content: [jsonInputBase([
                      { type: 'text', text: 'Item with ' },
                      { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
                      { type: 'text', text: ' text' },
                    ]).content[0]],
                  },
                  {
                    type: 'listItem',
                    content: [jsonInputBase([{ type: 'text', text: 'Regular item' }]).content[0]],
                  },
                ],
              }],
            };
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe('- Item with **bold** text\n- Item with *italic* text\n- Regular item');
          });

          it('should convert mixed formatting to markdown correctly', async () => {
            await setProps({ link: true });
            const jsonInput = jsonInputBase([
              { type: 'text', text: 'This has ' },
              { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
              { type: 'text', text: ', ' },
              { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
              { type: 'text', text: ', ' },
              { type: 'text', text: 'strikethrough', marks: [{ type: 'strike' }] },
              { type: 'text', text: ', and a ' },
              { type: 'text', text: 'link', marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] },
              { type: 'text', text: '.' },
            ]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe('This has **bold**, *italic*, ~~strikethrough~~, and a [link](https://example.com).');
          });

          it('should handle text with font size applied', async () => {
            await setProps({ allowFontSize: true, outputFormat: 'html' });

            const jsonInput = jsonInputBase([{
              type: 'text',
              text: 'Large text',
              marks: [{ type: 'textStyle', attrs: { fontSize: '20px' } }],
            }]);

            // Set content directly to editor
            await setContent(jsonInput);

            const output = handle.getOutput();
            expect(output).toContain('font-size: 20px');
          });

          it('should handle text with font color applied', async () => {
            await setProps({ allowFontColor: true, outputFormat: 'html' });

            const jsonInput = jsonInputBase([{
              type: 'text',
              text: 'Colored text',
              marks: [{ type: 'textStyle', attrs: { color: '#ff0000' } }],
            }]);

            // Set content directly to editor
            await setContent(jsonInput);

            const output = handle.getOutput();
            // TipTap converts hex colors to RGB format
            expect(output).toContain('color: rgb(255, 0, 0)');
          });

          it('should handle text with multiple text styles applied', async () => {
            await setProps({
              allowFontSize: true,
              allowFontColor: true,
              outputFormat: 'html',
            });

            const jsonInput = jsonInputBase([{
              type: 'text',
              text: 'Styled text',
              marks: [{
                type: 'textStyle',
                attrs: {
                  fontSize: '18px',
                  color: '#0000ff',
                },
              }],
            }]);

            // Set content directly to editor
            await setContent(jsonInput);

            const output = handle.getOutput();
            expect(output).toContain('font-size: 18px');
            // TipTap converts hex colors to RGB format
            expect(output).toContain('color: rgb(0, 0, 255)');
          });

          it('should handle nested formatting correctly', async () => {
            const jsonInput = jsonInputBase([
              { type: 'text', text: 'Bold and ', marks: [{ type: 'bold' }] },
              { type: 'text', text: 'italic', marks: [{ type: 'bold' }, { type: 'italic' }] },
              { type: 'text', text: ' nested', marks: [{ type: 'bold' }] },
            ]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe('**Bold and** ***italic*** **nested**');
          });

          it('should place spaces outside mark delimiters for CommonMark compatibility', async () => {
            // When switching styles (e.g. bold → italic), TipTap may include the space
            // inside one of the mark boundaries, producing invalid CommonMark like "**bold **".
            // The renderer must move boundary spaces outside the delimiters.
            const jsonInput = jsonInputBase([
              { type: 'text', text: 'bold ', marks: [{ type: 'bold' }] },
              { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
            ]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe('**bold** *italic*');
          });

          it('should place leading spaces outside mark delimiters for CommonMark compatibility', async () => {
            const jsonInput = jsonInputBase([
              { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
              { type: 'text', text: ' italic', marks: [{ type: 'italic' }] },
            ]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe('**bold** *italic*');
          });

          it('should convert mentions to markdown comments correctly', async () => {
            await setProps({
              mentionSuggestion: { items: vi.fn(() => []) },
            });

            const jsonInput = jsonInputBase([
              { type: 'text', text: 'Hello ' },
              {
                type: 'mention',
                attrs: {
                  id: 'john.doe',
                  name: 'John Doe',
                  contactKey: 'contact-123',
                },
              },
              { type: 'text', text: ' how are you?' },
            ]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe(
              'Hello <!-- @mention: {"id": "john.doe", "contactKey": "contact-123", "name": "John Doe"} --> how are you?',
            );
          });

          it('should convert channels to markdown comments correctly', async () => {
            await setProps({
              channelSuggestion: { items: vi.fn(() => []) },
            });

            const jsonInput = jsonInputBase([
              { type: 'text', text: 'Check out ' },
              {
                type: 'channel',
                attrs: {
                  id: 'general',
                  name: 'general',
                  locked: false,
                },
              },
              { type: 'text', text: ' channel' },
            ]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe(
              'Check out <!-- @channel: {"id": "general", "channelKey": "", "name": "general", "locked": "false"} --> channel',
            );
          });

          it('should convert locked channels to markdown comments correctly', async () => {
            await setProps({
              channelSuggestion: { items: vi.fn(() => []) },
            });

            const jsonInput = jsonInputBase([
              { type: 'text', text: 'Check out ' },
              {
                type: 'channel',
                attrs: {
                  id: 'dialtone-internal',
                  name: 'dialtone-internal',
                  locked: true,
                },
              },
              { type: 'text', text: ' channel' },
            ]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe(
              'Check out <!-- @channel: {"id": "dialtone-internal", "channelKey": "", "name": "dialtone-internal", ' +
              '"locked": "true"} --> channel',
            );
          });

          it('should convert channels with channelKey to markdown comments correctly', async () => {
            await setProps({
              channelSuggestion: { items: vi.fn(() => []) },
            });

            const jsonInput = jsonInputBase([
              { type: 'text', text: 'Check out ' },
              {
                type: 'channel',
                attrs: {
                  id: 'general',
                  name: 'general',
                  locked: false,
                  channelKey: 'channel-456',
                },
              },
              { type: 'text', text: ' channel' },
            ]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe(
              'Check out <!-- @channel: {"id": "general", "channelKey": "channel-456", "name": "general", ' +
              '"locked": "false"} --> channel',
            );
          });

          it.each([
            [':cat:'],
            ['🐱'],
          ])('should convert emoji code "%s" to a unicode character', async (code) => {
            const jsonInput = jsonInputBase([
              { type: 'text', text: 'Hello ' },
              {
                type: 'emoji',
                attrs: { code },
              },
            ]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe('Hello 🐱');
          });

          it('should preserve the original code for an unrecognized emoji shortcode', async () => {
            const jsonInput = jsonInputBase([
              { type: 'text', text: 'Hello ' },
              {
                type: 'emoji',
                attrs: { code: ':unknown:' },
              },
            ]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe('Hello :unknown:');
          });
        });
      });
    });

    describe('Copy paste tests', () => {
      // Dispatches a paste carrying every given clipboard type on the editor element.
      const paste = async (data: Record<string, string>) => {
        const clipboardData = new DataTransfer();
        Object.entries(data).forEach(([type, content]) => clipboardData.setData(type, content));

        const pasteEvent = new ClipboardEvent('paste', {
          clipboardData,
          bubbles: true,
          cancelable: true,
        });

        await act(async () => {
          editorEl.dispatchEvent(pasteEvent);
        });
      };

      // When new extensions are added due to change in props editor needs to be recreated
      const remountWithTables = async (extraProps: Partial<DtRichTextEditorProps> = {}) => {
        result.unmount();
        props = { ...props, outputFormat: 'html', value: '', allowTables: true, ...extraProps };
        _mountWrapper();
        await flush();
        _setChildWrappers();
      };

      describe('When pasting plain text', () => {
        it('should handle plain text paste correctly', async () => {
          const pastedText = 'This is pasted plain text';

          await act(async () => {
            simulatePaste(pastedText, 'text/plain', editorEl);
          });

          expect(handle.getOutput()).toContain(pastedText);
        });
      });

      describe('When pasting HTML content', () => {
        it('if pasteRichText is true, it should parse html content', async () => {
          await setProps({
            pasteRichText: true,
            allowBold: true,
            outputFormat: 'html',
            value: '',
          });

          const htmlContent = '<strong>bold pasted text</strong>';
          const textContent = 'bold pasted text';
          await paste({ 'text/html': htmlContent, 'text/plain': textContent });

          let output = handle.getOutput();
          // Verify html output
          expect(output).toBe(`<p>${htmlContent}</p>`);
          await setProps({
            outputFormat: 'text',
          });
          output = handle.getOutput();
          // Verify text output
          expect(output).toBe(textContent);
        });

        it('if pasteRichText is false, html tags should be output as literal characters', async () => {
          await setProps({
            pasteRichText: false,
            allowBold: true,
            outputFormat: 'html',
            value: '',
          });

          const htmlContent = '<strong>bold pasted text</strong>';
          await paste({ 'text/html': htmlContent, 'text/plain': '<strong>bold pasted text</strong>' });

          let output = handle.getOutput();
          expect(output).toBe('<p>&lt;strong&gt;bold pasted text&lt;/strong&gt;</p>');
          await setProps({
            outputFormat: 'text',
          });
          output = handle.getOutput();
          expect(output).toBe('<strong>bold pasted text</strong>');
        });

        it('should preserve tables when pasted', async () => {
          await remountWithTables();

          await paste({
            'text/plain': 'testtesttesttest',
            'text/html': '<table><tr><td>test</td><td>test</td></tr><tr><td>test</td><td>test</td></tr></table>',
          });

          const output = handle.getOutput();
          // Check that the table has been preserved using custom table rendering
          expect(output).toContain('<table>');
          expect(output).toContain('<tbody>');
          expect(output).toContain('test');
          expect(output).not.toContain('colgroup');
          expect(output).not.toContain('min-width');
        });

        it('should preserve text mark styles inside table cells when pasted', async () => {
          await remountWithTables({ allowFontSize: true, allowFontColor: true });

          await paste({
            'text/plain': 'Customer Support',
            'text/html': '<table><tr><td><div style="font-size:10pt; color:#002968; font-weight:bold;">' +
              'Customer Support</div></td></tr></table>',
          });

          const output = handle.getOutput();
          expect(output).toContain('color: rgb(0, 41, 104)');
          expect(output).toContain('font-size: 10pt');
        });

        it('should preserve table border, cellpadding, and cellspacing attributes when pasted', async () => {
          await remountWithTables();

          await paste({
            'text/plain': 'Cell',
            'text/html': '<table border="0" cellpadding="5" cellspacing="0"><tr><td>Cell</td></tr></table>',
          });

          const output = handle.getOutput();
          expect(output).toContain('border="0"');
          expect(output).toContain('cellpadding="5"');
          expect(output).toContain('cellspacing="0"');
        });

        it('should preserve table inline style attribute when pasted', async () => {
          await remountWithTables();

          await paste({
            'text/plain': 'Cell',
            'text/html': '<table style="border-collapse: collapse; width: 100%;"><tr><td>Cell</td></tr></table>',
          });

          const output = handle.getOutput();
          expect(output).toContain('border-collapse: collapse');
          expect(output).toContain('width: 100%');
        });

        it('should preserve table row style attribute when pasted', async () => {
          await remountWithTables();

          await paste({
            'text/plain': 'Cell',
            'text/html': '<table><tr style="background-color: #f0f0f0;"><td>Cell</td></tr></table>',
          });

          const output = handle.getOutput();
          expect(output).toContain('background-color: rgb(240, 240, 240)');
        });

        it('should preserve table cell style, valign, and width attributes when pasted', async () => {
          await remountWithTables();

          await paste({
            'text/plain': 'Cell',
            'text/html': '<table><tr><td style="padding: 10px;" valign="top" width="200">Cell</td></tr></table>',
          });

          const output = handle.getOutput();
          expect(output).toContain('padding: 10px');
          expect(output).toContain('valign="top"');
          expect(output).toContain('width="200"');
        });

        it('should preserve table header style, valign, and width attributes when pasted', async () => {
          await remountWithTables();

          await paste({
            'text/plain': 'Header',
            'text/html': '<table><tr><th style="font-weight: bold;" valign="middle" width="150">Header</th></tr>' +
              '<tr><td>Cell</td></tr></table>',
          });

          const output = handle.getOutput();
          expect(output).toContain('valign="middle"');
          expect(output).toContain('width="150"');
        });

        it('should preserve styles from anchor tags inside table cells when pasted', async () => {
          await remountWithTables({ allowFontSize: true, allowFontColor: true });

          await paste({
            'text/plain': 'Click here',
            'text/html': '<table><tr><td><a href="https://example.com" style="color:#0066cc; font-size:12pt;">' +
              'Click here</a></td></tr></table>',
          });

          const output = handle.getOutput();
          expect(output).toContain('color: rgb(0, 102, 204)');
          expect(output).toContain('font-size: 12pt');
        });

        it('should preserve complex email signature table with mixed attributes when pasted', async () => {
          await remountWithTables({ allowFontSize: true, allowFontColor: true });

          await paste({
            'text/plain': 'John DoeSupport Team',
            'text/html':
              '<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">' +
              '<tr style="background-color: #ffffff;">' +
              '<td style="padding: 5px;" valign="top" width="300">' +
              '<div style="font-size:14pt; color:#333333; font-weight:bold;">John Doe</div>' +
              '</td>' +
              '</tr>' +
              '<tr>' +
              '<td style="padding: 5px;" valign="top" width="300">' +
              '<div style="font-size:10pt; color:#666666;">Support Team</div>' +
              '</td>' +
              '</tr>' +
              '</table>',
          });

          const output = handle.getOutput();
          // Table attributes
          expect(output).toContain('border="0"');
          expect(output).toContain('cellpadding="0"');
          expect(output).toContain('cellspacing="0"');
          expect(output).toContain('border-collapse: collapse');
          // Row attributes
          expect(output).toContain('background-color: rgb(255, 255, 255)');
          // Cell attributes
          expect(output).toContain('valign="top"');
          expect(output).toContain('width="300"');
          expect(output).toContain('padding: 5px');
          // Text styles from div tags
          expect(output).toContain('font-size: 14pt');
          expect(output).toContain('font-size: 10pt');
          expect(output).toContain('color: rgb(51, 51, 51)');
          expect(output).toContain('color: rgb(102, 102, 102)');
        });

        it('should preserve nested tables when pasted', async () => {
          await remountWithTables();

          await paste({
            'text/plain': 'OuterInner',
            'text/html':
              '<table border="0" style="width: 100%;">' +
              '<tr><td style="padding: 10px;">' +
              '<table border="1" style="width: 50%;">' +
              '<tr><td style="padding: 5px;">Inner</td></tr>' +
              '</table>' +
              '</td></tr>' +
              '</table>',
          });

          const output = handle.getOutput();
          // Outer table attributes
          expect(output).toContain('border="0"');
          expect(output).toContain('width: 100%');
          // Inner table attributes
          expect(output).toContain('border="1"');
          expect(output).toContain('width: 50%');
          // Cell padding
          expect(output).toContain('padding: 10px');
          expect(output).toContain('padding: 5px');
        });

        it('should preserve colspan and rowspan in custom table mode', async () => {
          await remountWithTables();

          await paste({
            'text/plain': 'HeaderCell 1Cell 2',
            'text/html':
              '<table>' +
              '<tr><td colspan="2">Header</td></tr>' +
              '<tr><td>Cell 1</td><td>Cell 2</td></tr>' +
              '</table>',
          });

          const output = handle.getOutput();
          expect(output).toContain('colspan="2"');
        });

        it('should handle multiple tables in a single paste with custom tables', async () => {
          await remountWithTables();

          await paste({
            'text/plain': 'Table1Table2',
            'text/html':
              '<table border="1"><tr><td>Table1</td></tr></table>' +
              '<p>Separator</p>' +
              '<table border="2"><tr><td>Table2</td></tr></table>',
          });

          const output = handle.getOutput();
          expect(output).toContain('border="1"');
          expect(output).toContain('border="2"');
          expect(output).toContain('Table1');
          expect(output).toContain('Table2');
          expect(output).toContain('Separator');
        });

        it('should handle table with empty cells in custom table mode', async () => {
          await remountWithTables();

          await paste({
            'text/plain': 'Content',
            'text/html':
              '<table border="0" style="width: 100%;">' +
              '<tr><td style="padding: 5px;">Content</td><td></td></tr>' +
              '</table>',
          });

          const output = handle.getOutput();
          expect(output).toContain('<table');
          expect(output).toContain('border="0"');
          expect(output).toContain('Content');
        });

        it('should preserve custom table attributes when setting content programmatically', async () => {
          await remountWithTables();

          const tableHTML =
            '<table border="0" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">' +
            '<tbody>' +
            '<tr style="background-color: #eee;">' +
            '<td style="padding: 10px;" valign="top" width="200">Cell content</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>';

          await act(async () => {
            getEditor().commands.setContent(tableHTML);
          });

          const output = handle.getOutput();
          expect(output).toContain('border="0"');
          expect(output).toContain('cellpadding="5"');
          expect(output).toContain('cellspacing="0"');
          expect(output).toContain('border-collapse: collapse');
          expect(output).toContain('background-color: rgb(238, 238, 238)');
          expect(output).toContain('valign="top"');
          expect(output).toContain('width="200"');
          expect(output).toContain('padding: 10px');
        });

        it('should handle table with no custom attributes gracefully in custom mode', async () => {
          await remountWithTables();

          await paste({
            'text/plain': 'AB',
            'text/html': '<table><tr><td>A</td><td>B</td></tr></table>',
          });

          const output = handle.getOutput();
          // Should render a clean table without colgroup/min-width and without extraneous null attributes
          expect(output).toContain('<table><tbody>');
          expect(output).not.toContain('colgroup');
          expect(output).not.toContain('min-width');
          expect(output).not.toContain('border=');
          expect(output).not.toContain('cellpadding=');
          expect(output).not.toContain('cellspacing=');
          expect(output).toContain('A');
          expect(output).toContain('B');
        });

        it('should preserve styles from div tags inside table cells via CustomTextStyle', async () => {
          await remountWithTables({ allowFontSize: true, allowFontColor: true });

          await paste({
            'text/plain': 'NameTitle',
            'text/html':
              '<table>' +
              '<tr><td>' +
              '<div style="font-size: 16pt; color: #111111;">Name</div>' +
              '<div style="font-size: 10pt; color: #888888;">Title</div>' +
              '</td></tr>' +
              '</table>',
          });

          const output = handle.getOutput();
          expect(output).toContain('font-size: 16pt');
          expect(output).toContain('font-size: 10pt');
          expect(output).toContain('color: rgb(17, 17, 17)');
          expect(output).toContain('color: rgb(136, 136, 136)');
        });

        it('should not preserve tables when pasted without allow tables', async () => {
          await setProps({
            pasteRichText: false,
            outputFormat: 'html',
            value: '',
          });
          await paste({
            'text/plain': 'testtesttesttest',
            'text/html': '<table><tr><td>test</td><td>test</td></tr><tr><td>test</td><td>test</td></tr></table>',
          });

          const output = handle.getOutput();
          // Check that the table has been converted to text;
          expect(output).toBe('<p>testtesttesttest</p>');
        });

        it('if pasteRichText is false, line breaks should be preserved as hard breaks', async () => {
          await setProps({
            pasteRichText: false,
            outputFormat: 'html',
            value: '',
          });

          await paste({ 'text/plain': 'Line 1\nLine 2\nLine 3' });

          const output = handle.getOutput();
          // Line breaks should be converted to <br /> tags within a single paragraph
          expect(output).toBe('<p>Line 1<br>Line 2<br>Line 3</p>');
        });
      });

      describe('When pasting content with line breaks and white space', () => {
        it('should retain the line breaks and white space', async () => {
          await setProps({
            allowLineBreaks: true,
            outputFormat: 'text',
            value: '',
          });

          const textWithLineBreaks = 'Line 1\n  Line 2\n    Line 3';
          await act(async () => {
            simulatePaste(textWithLineBreaks, 'text/plain', editorEl);
          });

          const output = handle.getOutput();
          // Check that the line break content was pasted and contains the lines
          expect(output).toBe(textWithLineBreaks);
        });
      });

      describe('When pasting content with line breaks in html mode', () => {
        it('line breaks should be converted to <p>', async () => {
          await setProps({
            allowLineBreaks: true,
            outputFormat: 'html',
            value: '',
          });

          const textWithLineBreaks = 'Line 1\n  Line 2\n    Line 3';
          await act(async () => {
            simulatePaste(textWithLineBreaks, 'text/plain', editorEl);
          });

          const output = handle.getOutput();
          // Check that the line break content was pasted and converted to HTML paragraphs
          expect(output).toBe('<p>Line 1</p><p>  Line 2</p><p>    Line 3</p>');
        });
      });

      describe('When pasting preformatted HTML content', () => {
        it('should preserve line breaks from white-space: pre-wrap content', async () => {
          await setProps({
            pasteRichText: true,
            outputFormat: 'html',
            value: '',
          });

          await paste({
            'text/html': '<span style="white-space: pre-wrap;">Line 1\nLine 2\nLine 3</span>',
            'text/plain': 'Line 1\nLine 2\nLine 3',
          });

          const output = handle.getOutput();
          // Check that line breaks are preserved as hard breaks when pasting preformatted HTML
          expect(output).toBe('<p>Line 1<br>Line 2<br>Line 3</p>');
        });
      });

      describe('When pasting content with blank lines', () => {
        it('should preserve blank lines when pasteRichText is true', async () => {
          await setProps({
            pasteRichText: true,
            outputFormat: 'html',
            value: '',
          });

          const textWithBlankLines = '# go to ubervoice/static folder\ncd ~/src/firespotter/ubervoice/static\n\nnpm install';
          await paste({ 'text/plain': textWithBlankLines });

          const output = handle.getOutput();
          // Check that blank lines are preserved as hard breaks
          expect(output).toBe(
            '<p># go to ubervoice/static folder<br>cd ~/src/firespotter/ubervoice/static<br><br>npm install</p>',
          );
        });

        it('should still convert single line breaks to paragraphs when no blank lines present', async () => {
          await setProps({
            pasteRichText: true,
            outputFormat: 'html',
            value: '',
          });

          await paste({ 'text/plain': 'Line 1\nLine 2\nLine 3' });

          const output = handle.getOutput();
          // Check that single line breaks are converted to paragraphs (default TipTap behavior)
          expect(output).toBe('<p>Line 1</p><p>Line 2</p><p>Line 3</p>');
        });
      });
    });

    describe('Font styling tests', () => {
      // Pastes rich HTML into a freshly mounted editor, as the Vue tests remount with the props they need.
      const remountAndPaste = async (extraProps: Partial<DtRichTextEditorProps>, html: string, text: string) => {
        result.unmount();
        props = {
          ...baseProps,
          pasteRichText: true,
          ...extraProps,
          outputFormat: 'html',
          value: '',
        };
        _mountWrapper();
        await flush();
        _setChildWrappers();

        const clipboardData = new DataTransfer();
        clipboardData.setData('text/html', html);
        clipboardData.setData('text/plain', text);

        const pasteEvent = new ClipboardEvent('paste', {
          clipboardData,
          bubbles: true,
          cancelable: true,
        });

        await act(async () => {
          editorEl.dispatchEvent(pasteEvent);
        });
      };

      describe('When font size is enabled', () => {
        beforeEach(async () => {
          await setProps({
            allowFontSize: true,
            outputFormat: 'html',
            value: 'Test text',
          });
        });

        it('should preserve font size when pasting styled content', async () => {
          // Remount with proper props for font size and rich text pasting
          await remountAndPaste(
            { allowFontSize: true },
            '<span style="font-size: 24px;">Large text</span>',
            'Large text',
          );

          const output = handle.getOutput();
          expect(output).toContain('font-size');
        });
      });

      describe('When font color is enabled', () => {
        beforeEach(async () => {
          await setProps({
            allowFontColor: true,
            outputFormat: 'html',
            value: 'Test text',
          });
        });

        it('should preserve font color when pasting styled content', async () => {
          // Remount with proper props for font color and rich text pasting
          await remountAndPaste(
            { allowFontColor: true },
            '<span style="color: rgb(255, 0, 0);">Red text</span>',
            'Red text',
          );

          const output = handle.getOutput();
          expect(output).toContain('color');
        });
      });

      describe('When both font size and color are enabled', () => {
        beforeEach(async () => {
          await setProps({
            allowFontSize: true,
            allowFontColor: true,
            outputFormat: 'json',
            value: '',
          });
        });

        it('should handle combined font styles in JSON output', async () => {
          const content = {
            type: 'doc',
            content: [{
              type: 'paragraph',
              content: [{
                type: 'text',
                text: 'Styled text',
                marks: [{
                  type: 'textStyle',
                  attrs: {
                    fontSize: '16px',
                    color: '#0000ff',
                  },
                }],
              }],
            }],
          };

          await act(async () => {
            getEditor().commands.setContent(content);
          });

          const jsonOutput = handle.getOutput() as {
            content: { content: { marks?: { type: string; attrs: Record<string, string> }[] }[] }[];
          };
          const textNode = jsonOutput.content[0].content[0];
          expect(textNode.marks).toBeDefined();
          expect(textNode.marks![0].type).toBe('textStyle');
          expect(textNode.marks![0].attrs.fontSize).toBe('16px');
          expect(textNode.marks![0].attrs.color).toBe('#0000ff');
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    // The tiptap editor view, as the handlers registered through editorProps see it.
    type EditorView = Editor['view'];

    describe('Mention click functionality', () => {
      describe('When a mention is clicked', () => {
        it('should emit mention-click event with mention data', async () => {
          const mentionData = {
            id: 'john.doe',
            name: 'John Doe',
            avatarSrc: 'avatar.jpg',
            contactKey: 'contact-123',
          };

          await setProps({
            mentionSuggestion: { items: vi.fn(() => [mentionData]) },
          });

          const editorInstance = getEditor();
          const mentionNode = editorInstance.schema.nodes.mention.create(mentionData);
          await act(async () => {
            editorInstance.view.dispatch(editorInstance.state.tr.insert(0, mentionNode));
          });

          const mentionLink = result.container.querySelector('a.d-link') as HTMLElement;
          expect(mentionLink.textContent).toBe('@John Doe');

          await act(async () => {
            fireEvent.click(mentionLink);
          });
          expect(emitted('onMentionClick')![0][0]).toEqual(mentionData);
        });
      });
    });

    describe('Link click functionality', () => {

      const HREF = 'https://example.com/app/messages/123';

      const _insertLink = async (linkProps: Partial<DtRichTextEditorProps> = {}) => {
        await setProps({ link: true, ...linkProps });
        const editorInstance = getEditor();
        await act(async () => {
          editorInstance.commands.setContent({
            type: 'doc',
            content: [{
              type: 'paragraph',
              content: [{
                type: 'text',
                text: 'a link',
                marks: [{ type: 'link', attrs: { href: HREF } }],
              }],
            }],
          });
        });
      };

      // The link click is handled via a DOM `click` event (handleDOMEvents.click)
      // rather than ProseMirror's handleClick, so that it also fires on a
      // non-editable (read-only) editor. Build an event whose target is the
      // rendered link element and dispatch it through the registered handler.
      const _clickLink = (
        view: EditorView,
        { cancelable = false, target }: { cancelable?: boolean; target?: Element } = {},
      ) => {
        const anchor = target ?? result.container.querySelector('a.d-link') as Element;
        const event = new MouseEvent('click', { button: 0, cancelable });
        Object.defineProperty(event, 'target', { value: anchor });
        return view.someProp('handleDOMEvents', (handlers) => handlers.click?.(view, event as PointerEvent));
      };

      it('emits link-click with the href when a link is clicked', async () => {
        await _insertLink();

        await act(async () => {
          _clickLink(getEditor().view);
        });

        expect(emitted('onLinkClick')).toBeTruthy();
        expect(emitted('onLinkClick')![0][0]).toMatchObject({ href: HREF, text: 'a link' });
        expect(emitted('onLinkClick')![0][0].event).toBeInstanceOf(MouseEvent);
      });

      it('does not emit link-click when the click is not on a link', async () => {
        await _insertLink();

        await act(async () => {
          _clickLink(getEditor().view, { target: document.createElement('div') });
        });

        expect(emitted('onLinkClick')).toBeFalsy();
      });

      it('preserves default navigation when the consumer does not preventDefault', async () => {
        await _insertLink();

        let handled: boolean | void | undefined;
        await act(async () => {
          handled = _clickLink(getEditor().view, { cancelable: true });
        });

        // The event still emits, but without preventDefault the handler reports
        // not-handled (someProp returns undefined for a falsy result), so the
        // anchor's default behavior (target="_blank") proceeds as before.
        expect(handled).toBeFalsy();
        expect(emitted('onLinkClick')).toBeTruthy();
      });

      it('lets the consumer suppress default navigation via preventDefault', async () => {
        await _insertLink();

        // A consumer that intercepts the link would preventDefault on the event;
        // the click handler then reports it as handled so the browser does not
        // follow the anchor's target="_blank".
        listeners.onLinkClick.mockImplementation(({ event }: { event: MouseEvent }) => event.preventDefault());
        const view = getEditor().view;
        const anchor = result.container.querySelector('a.d-link') as Element;
        const event = new MouseEvent('click', { button: 0, cancelable: true });
        Object.defineProperty(event, 'target', { value: anchor });
        expect(event.defaultPrevented).toBe(false);
        let handled: boolean | void | undefined;
        await act(async () => {
          handled = view.someProp('handleDOMEvents', (handlers) => handlers.click?.(view, event as PointerEvent));
        });

        expect(emitted('onLinkClick')).toBeTruthy();
        expect(event.defaultPrevented).toBe(true);
        expect(handled).toBe(true);
      });

      it('does not emit link-click when the built-in link extension is disabled', async () => {
        // The event is scoped to the built-in `link` extension. With link
        // disabled, anchors from other extensions (e.g. customLink) must not
        // emit link-click, matching the documented contract.
        await setProps({ link: false });
        await flush();

        const view = getEditor().view;
        const anchor = document.createElement('a');
        anchor.href = HREF;
        anchor.textContent = 'a link';
        const event = new MouseEvent('click', { button: 0, cancelable: true });
        Object.defineProperty(event, 'target', { value: anchor });
        await act(async () => {
          view.someProp('handleDOMEvents', (handlers) => handlers.click?.(view, event as PointerEvent));
        });

        expect(emitted('onLinkClick')).toBeFalsy();
      });
    });

    describe('Mention hover functionality', () => {
      const mentionData = {
        id: 'john.doe',
        name: 'John Doe',
        avatarSrc: 'avatar.jpg',
        contactKey: 'contact-123',
      };

      beforeEach(async () => {
        await setProps({
          mentionSuggestion: { items: vi.fn(() => [mentionData]) },
        });

        const editorInstance = getEditor();
        const mentionNode = editorInstance.schema.nodes.mention.create(mentionData);
        await act(async () => {
          editorInstance.view.dispatch(editorInstance.state.tr.insert(0, mentionNode));
        });
      });

      describe('When the cursor enters a mention', () => {
        it('should emit mention-hover event with mention data and mouse event', async () => {
          const mentionLink = result.container.querySelector('a.d-link') as HTMLElement;
          await act(async () => {
            fireEvent.mouseEnter(mentionLink);
          });

          const calls = emitted('onMentionHover');
          expect(calls).toBeTruthy();
          expect(calls![0][0]).toMatchObject(mentionData);
          expect(calls![0][0].event).toBeInstanceOf(MouseEvent);
        });
      });

      describe('When the cursor leaves a mention', () => {
        it('should emit mention-leave event with mention data and mouse event', async () => {
          const mentionLink = result.container.querySelector('a.d-link') as HTMLElement;
          await act(async () => {
            fireEvent.mouseLeave(mentionLink);
          });

          const calls = emitted('onMentionLeave');
          expect(calls).toBeTruthy();
          expect(calls![0][0]).toMatchObject(mentionData);
          expect(calls![0][0].event).toBeInstanceOf(MouseEvent);
        });
      });
    });

    describe('Channel click functionality', () => {
      describe('When a channel is clicked', () => {
        it('should emit channel-click event with channel data', async () => {
          const channelData = {
            id: 'general',
            name: 'general',
            locked: false,
            channelKey: 'ch-123',
          };

          await setProps({
            channelSuggestion: { items: vi.fn(() => [channelData]) },
          });

          const editorInstance = getEditor();
          const channelNode = editorInstance.schema.nodes.channel.create(channelData);
          await act(async () => {
            editorInstance.view.dispatch(editorInstance.state.tr.insert(0, channelNode));
          });

          const channelLink = result.container.querySelector('a.d-link') as HTMLElement;
          expect(channelLink.textContent).toBe('#general');

          await act(async () => {
            fireEvent.click(channelLink);
          });
          expect(emitted('onChannelClick')![0][0]).toEqual(channelData);
        });
      });
    });

    describe('setLink method', () => {

      const linkOptions = { class: 'd-link' };
      const supportedProtocols = [/^https?:\/\//, /^ftp?:\/\//, /mailto:/];
      const defaultPrefix = 'https://';

      beforeEach(async () => {
        await setProps({ link: true, outputFormat: 'html' });
        await act(async () => {
          getEditor().commands.focus();
        });
      });

      it.each([
        ['https://example.com', 'Example', 'Example'],
        ['https://example.com', '', 'https://example.com'],
      ])('should render link correctly (url=%s, displayText=%s)', async (url, displayText, expectedSubstring) => {
        await act(async () => {
          handle.setLink(url, displayText, linkOptions, supportedProtocols, defaultPrefix);
        });
        expect(handle.getOutput()).toContain(expectedSubstring);
      });
    });

    describe('Link keyboard shortcut functionality', () => {

      describe('When Mod+K is pressed and link is enabled', () => {
        it('should emit edit-link event', async () => {
          await setProps({ link: true });

          // Get the editor instance
          const editorInstance = getEditor();

          // Simulate the keyboard shortcut by triggering it directly on the editor
          // This tests that the edit-link event gets emitted when Mod+K shortcut is triggered
          await act(async () => {
            // Focus the editor
            editorInstance.commands.focus();
            editorInstance.commands.keyboardShortcut('Mod-k');
          });

          // Check if the edit-link event was emitted
          expect(emitted('onEditLink')).toBeTruthy();
        });
      });
    });

    describe('forceLinkifyPendingText method', () => {

      beforeEach(async () => {
        await setProps({ link: true, outputFormat: 'html' });
      });

      it('should linkify a bare URL at the end of the content with no trailing space', async () => {
        await act(async () => {
          getEditor().commands.setContent('www.google.com');
          handle.forceLinkifyPendingText();
        });

        expect(handle.getOutput()).toContain('href="http://www.google.com"');
      });

      it('should not modify content that is already linkified', async () => {
        let before: unknown;
        await act(async () => {
          getEditor().commands.setContent('<p><a href="https://www.google.com">www.google.com</a></p>');
          before = handle.getOutput();

          handle.forceLinkifyPendingText();
        });

        expect(handle.getOutput()).toBe(before);
      });

      it('should do nothing when customLink is enabled', async () => {
        await setProps({ customLink: true });
        await act(async () => {
          getEditor().commands.setContent('www.google.com');
          handle.forceLinkifyPendingText();
        });

        expect(handle.getOutput()).not.toContain('href=');
      });

      it('should not run automatically on Enter or blur, it must be called explicitly', async () => {
        await setProps({ allowLineBreaks: false });
        await act(async () => {
          getEditor().commands.setContent('www.google.com');
          getEditor().commands.focus();

          getEditor().commands.keyboardShortcut('Enter');
          getEditor().view.dom.dispatchEvent(new FocusEvent('blur'));
        });

        expect(emitted('onEnter')).toBeTruthy();
        expect(emitted('onBlur')).toBeTruthy();
        expect(handle.getOutput()).not.toContain('href=');
      });

      it('should not linkify a malformed domain that only looks valid as a prefix', async () => {
        await act(async () => {
          getEditor().commands.setContent('www.google.comx');
          handle.forceLinkifyPendingText();
        });

        expect(handle.getOutput()).not.toContain('href=');
      });

      it.each([
        ['a URL wrapped in matching parentheses', '(www.google.com)', 'href="http://www.google.com">www.google.com</a>)'],
        ['the full range of an extended link', '<p><a href="http://example.co">example.co</a>m</p>', 'href="http://example.com">example.com</a>'],
        ['a URL after a hard break', '<p>hi<br>www.google.com</p>', 'hi<br><a target="_blank" rel="noopener noreferrer nofollow" class="d-link d-wb-break-all" href="http://www.google.com">www.google.com</a>'],
      ])('should linkify %s', async (_, content, expected) => {
        await act(async () => {
          getEditor().commands.setContent(content);
          handle.forceLinkifyPendingText();
        });

        expect(handle.getOutput()).toContain(expected);
      });
    });

    describe('Blockquote keyboard shortcut functionality', () => {

      describe('When Mod+Shift+B is pressed and blockquote is enabled', () => {
        it('should toggle blockquote formatting', async () => {
          await setProps({
            allowBlockquote: true,
            outputFormat: 'html',
            value: 'Test text',
          });

          // Get the editor instance
          const editorInstance = getEditor();

          await act(async () => {
            // Focus the editor and select all text
            editorInstance.commands.focus();
            editorInstance.commands.selectAll();

            // Simulate the Mod+Shift+B keyboard shortcut
            editorInstance.commands.keyboardShortcut('Mod-Shift-b');
          });

          // Check if the text is now wrapped in a blockquote
          const output = handle.getOutput();
          expect(output).toBe('<blockquote><p>Test text</p></blockquote>');
        });
      });
    });

    describe('handleKeyDown functionality', () => {
      type KeyDownHandler = (view: EditorView, event: KeyboardEvent) => boolean | void;
      let mockKeyEvent: { key: string; shiftKey: boolean; preventDefault: () => void; stopPropagation: () => void };
      let mockView: { state: { schema: Record<string, never> } };

      const getHandleKeyDown = () => {
        const keyDown = getEditor().options.editorProps.handleKeyDown as KeyDownHandler;
        return () => keyDown(mockView as unknown as EditorView, mockKeyEvent as unknown as KeyboardEvent);
      };

      beforeEach(() => {
        mockView = { state: { schema: {} } };
        mockKeyEvent = {
          key: '',
          shiftKey: false,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
        };
      });

      describe('When allowTyping is true', () => {
        beforeEach(async () => {
          await setProps({ allowTyping: true });
        });

        it('should allow letter keys by returning false', () => {
          const handleKeyDown = getHandleKeyDown();

          mockKeyEvent.key = 'a';
          expect(handleKeyDown()).toBe(false);
        });

        it('should allow Enter key by returning false', () => {
          const handleKeyDown = getHandleKeyDown();

          mockKeyEvent.key = 'Enter';
          expect(handleKeyDown()).toBe(false);
        });

        it('should allow Backspace key by returning false', () => {
          const handleKeyDown = getHandleKeyDown();

          mockKeyEvent.key = 'Backspace';
          expect(handleKeyDown()).toBe(false);
        });

        it('should allow Space key by returning false', () => {
          const handleKeyDown = getHandleKeyDown();

          mockKeyEvent.key = 'Space';
          expect(handleKeyDown()).toBe(false);
        });
      });

      describe('When allowTyping is false', () => {
        beforeEach(async () => {
          await setProps({ allowTyping: false });
        });

        describe('Backspace key', () => {
          it('should always allow Backspace key', () => {
            const handleKeyDown = getHandleKeyDown();

            mockKeyEvent.key = 'Backspace';
            expect(handleKeyDown()).toBe(false);
          });
        });

        describe('Enter key with allowLineBreaks false', () => {
          beforeEach(async () => {
            await setProps({
              allowTyping: false,
              allowLineBreaks: false,
            });
          });

          it('should allow Enter key when shift is not pressed', () => {
            const handleKeyDown = getHandleKeyDown();

            mockKeyEvent.key = 'Enter';
            mockKeyEvent.shiftKey = false;
            expect(handleKeyDown()).toBe(false);
          });

          it('should block Enter key when shift is pressed', () => {
            const handleKeyDown = getHandleKeyDown();

            mockKeyEvent.key = 'Enter';
            mockKeyEvent.shiftKey = true;
            expect(handleKeyDown()).toBe(true);
          });
        });

        describe('Enter key with allowLineBreaks true', () => {
          beforeEach(async () => {
            await setProps({
              allowTyping: false,
              allowLineBreaks: true,
            });
          });

          it('should block Enter key when shift is not pressed', () => {
            const handleKeyDown = getHandleKeyDown();

            mockKeyEvent.key = 'Enter';
            mockKeyEvent.shiftKey = false;
            expect(handleKeyDown()).toBe(true);
          });

          it('should block Enter key when shift is pressed', () => {
            const handleKeyDown = getHandleKeyDown();

            mockKeyEvent.key = 'Enter';
            mockKeyEvent.shiftKey = true;
            expect(handleKeyDown()).toBe(true);
          });
        });

        describe('Other keys', () => {
          it('should block letter keys', () => {
            const handleKeyDown = getHandleKeyDown();

            mockKeyEvent.key = 'a';
            expect(handleKeyDown()).toBe(true);
          });

          it('should block Tab key', () => {
            const handleKeyDown = getHandleKeyDown();

            mockKeyEvent.key = 'Tab';
            mockKeyEvent.shiftKey = false;
            expect(handleKeyDown()).toBe(true);

            mockKeyEvent.shiftKey = true;
            expect(handleKeyDown()).toBe(true);
          });

          it('should block Delete key', () => {
            const handleKeyDown = getHandleKeyDown();

            mockKeyEvent.key = 'Delete';
            mockKeyEvent.shiftKey = false;
            expect(handleKeyDown()).toBe(true);

            mockKeyEvent.shiftKey = true;
            expect(handleKeyDown()).toBe(true);
          });
        });
      });
    });
  });

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

  describe('Variable Extension Tests', function () {
    interface VariableAttrs { id: string; altText: string }
    // insertVariable is added by the variable extension, so it isn't on the editor's command types.
    const insertVariable = (editorInstance: Editor, attrs: VariableAttrs) => {
      (editorInstance.commands as unknown as { insertVariable: (attrs: VariableAttrs) => boolean })
        .insertVariable(attrs);
    };
    const jsonContent = (output: unknown) => (output as EditorNode).content;

    describe('When allowVariable is true', function () {
      const variableItems = [
        { id: 'user_name', name: 'User Name', placeholder: 'User Name' },
        { id: 'company_name', name: 'Company Name', placeholder: 'Company Name' },
        { id: 'ticket_id', name: 'Ticket ID', placeholder: 'Ticket ID' },
      ];

      beforeEach(async function () {
        await setProps({
          allowVariable: true,
          variableItems,
        });
      });

      it('should enable the variable extension', function () {
        const editorInstance = getEditor();
        const variableExtension = editorInstance.extensionManager.extensions.find(
          ext => ext.name === 'variable',
        );
        expect(variableExtension).toBeDefined();
      });

      it('should have insertVariable command available', function () {
        const editorInstance = getEditor();
        expect(typeof (editorInstance.commands as unknown as Record<string, unknown>).insertVariable)
          .toBe('function');
      });

      it('should insert a variable with id and altText', async function () {
        const editorInstance = getEditor();
        await act(async () => {
          insertVariable(editorInstance, {
            id: 'user_name',
            altText: 'John Doe',
          });
        });

        const json = editorInstance.getJSON();
        const variableNode = findVariable(json.content, 'user_name');
        expect(variableNode).not.toBeNull();
        expect(variableNode!.attrs!.altText).toBe('John Doe');
      });

      it('should render variables in HTML output', async function () {
        await setProps({ outputFormat: 'html' });

        const editorInstance = getEditor();
        await act(async () => {
          insertVariable(editorInstance, {
            id: 'company_name',
            altText: 'Acme Corp',
          });
        });

        const htmlOutput = handle.getOutput();
        expect(htmlOutput).toContain('data-variable-id="company_name"');
        expect(htmlOutput).toContain('data-alt-text="Acme Corp"');
      });

      it('should render variables in JSON output', async function () {
        await setProps({ outputFormat: 'json' });

        const editorInstance = getEditor();
        await act(async () => {
          insertVariable(editorInstance, {
            id: 'ticket_id',
            altText: '#12345',
          });
        });

        const jsonOutput = handle.getOutput();
        expect(jsonContent(jsonOutput)).toBeDefined();

        const variableNode = findVariable(jsonContent(jsonOutput), 'ticket_id');
        expect(variableNode).not.toBeNull();
        expect(variableNode!.attrs!.altText).toBe('#12345');
      });

      it('should render variable altText in text output', async function () {
        await setProps({ outputFormat: 'text', value: '' });

        const editorInstance = getEditor();
        await act(async () => {
          insertVariable(editorInstance, {
            id: 'user_name',
            altText: 'Jane Smith',
          });
        });

        const textOutput = handle.getOutput();
        expect(textOutput).toBe('Jane Smith');
      });

      it('should render variables in markdown output as comments', async function () {
        await setProps({ outputFormat: 'markdown', value: '' });

        const editorInstance = getEditor();
        await act(async () => {
          editorInstance.commands.insertContent('Hello ');
          insertVariable(editorInstance, {
            id: 'user_name',
            altText: 'Bob',
          });
          editorInstance.commands.insertContent(' welcome!');
        });

        const markdownOutput = handle.getOutput();
        expect(markdownOutput).toBe('Hello {{user_name=Bob}} welcome!');
      });

      it('should insert multiple variables', async function () {
        const editorInstance = getEditor();

        await act(async () => {
          insertVariable(editorInstance, { id: 'user_name', altText: 'User' });
          editorInstance.commands.insertContent(' from ');
          insertVariable(editorInstance, { id: 'company_name', altText: 'Company' });
        });

        const json = editorInstance.getJSON();
        const variableCount = countVariables(json.content);
        expect(variableCount).toBe(2);
      });

      it('should preserve variable items configuration', function () {
        const editorInstance = getEditor();
        const variableExtension = editorInstance.extensionManager.extensions.find(
          ext => ext.name === 'variable',
        );

        expect(variableExtension!.options.variableItems).toEqual(variableItems);
      });

      it('should handle variables with empty altText', async function () {
        await setProps({ outputFormat: 'text', value: '' });

        const editorInstance = getEditor();
        await act(async () => {
          editorInstance.commands.insertContent('Hello ');
          insertVariable(editorInstance, { id: 'user_name', altText: '' });
          editorInstance.commands.insertContent(' there');
        });

        const textOutput = handle.getOutput();
        expect(textOutput).toBe('Hello  there');
      });

      it('should parse variables from HTML input', async function () {
        const htmlWithVariable = '<p>Hello <variable data-variable-id="user_name" data-alt-text="Alice"></variable>!</p>';

        await setProps({
          value: htmlWithVariable,
          outputFormat: 'json',
        });
        await flush();

        const jsonOutput = handle.getOutput();
        const variableNode = findVariable(jsonContent(jsonOutput), 'user_name');
        expect(variableNode).not.toBeNull();
        expect(variableNode!.attrs!.altText).toBe('Alice');
      });
    });

    describe('When allowVariable is false', function () {
      beforeEach(async function () {
        await setProps({
          allowVariable: false,
        });
      });

      it('should not enable the variable extension', function () {
        const editorInstance = getEditor();
        const variableExtension = editorInstance.extensionManager.extensions.find(
          ext => ext.name === 'variable',
        );
        expect(variableExtension).toBeUndefined();
      });

      it('should not have insertVariable command available', function () {
        const editorInstance = getEditor();
        expect((editorInstance.commands as unknown as Record<string, unknown>).insertVariable).toBeUndefined();
      });
    });

    describe('Variable with different output formats', function () {
      beforeEach(async function () {
        await setProps({
          allowVariable: true,
          variableItems: [
            { id: 'test_var', name: 'Test Variable', placeholder: 'Test' },
          ],
          value: '',
        });
      });

      it('should handle variables mixed with formatted text in markdown', async function () {
        await setProps({
          outputFormat: 'markdown',
          allowBold: true,
          allowItalic: true,
        });

        const editorInstance = getEditor();
        await act(async () => {
          editorInstance.commands.insertContent('Hello ');
          insertVariable(editorInstance, { id: 'test_var', altText: 'Variable' });
          editorInstance.commands.insertContent(' and ');
          editorInstance.commands.toggleBold();
          editorInstance.commands.insertContent('bold text');
        });

        const markdownOutput = handle.getOutput();
        expect(markdownOutput).toBe('Hello {{test_var=Variable}} and **bold text**');
      });

      it('should handle variables in complex document structure', async function () {
        await setProps({
          outputFormat: 'json',
          allowBulletList: true,
        });

        const editorInstance = getEditor();
        await act(async () => {
          editorInstance.commands.toggleBulletList();
          editorInstance.commands.insertContent('Item with ');
          insertVariable(editorInstance, { id: 'test_var', altText: 'var' });
        });

        const jsonOutput = handle.getOutput();
        expect(jsonContent(jsonOutput)![0].type).toBe('bulletList');

        const hasVariables = countVariables(jsonContent(jsonOutput)) > 0;
        expect(hasVariables).toBe(true);
      });
    });
  });

  describe('Codeblock toggle tests', function () {
    let editorInstance: Editor;

    // Resolves the collapsed/anchor end of the selection into a readable shape.
    const _cursor = () => {
      const { $from } = editorInstance.state.selection;
      return {
        block: $from.index(0),
        text: $from.parent.textContent,
        offset: $from.parentOffset,
      };
    };

    const _setContentAndSelection = async (html: string, selection: number | { from: number; to: number }) => {
      await act(async () => {
        editorInstance.commands.setContent(html);
        editorInstance.commands.setTextSelection(selection);
      });
    };

    const _toggleCodeBlock = async () => {
      await act(async () => {
        editorInstance.commands.toggleCodeBlock();
      });
    };

    beforeEach(async () => {
      editorInstance = getEditor();
    });

    describe('When removing a codeblock with the cursor on the first line', function () {
      // A two-line message is a single paragraph with a hard break, since Enter
      // sends the message and Shift + Enter inserts the break.
      beforeEach(async () => {
        await _setContentAndSelection('<p>line1<br>line2</p>', 4);
        await _toggleCodeBlock();
      });

      it('should place the cursor in the codeblock at the same offset', function () {
        expect(_cursor()).toEqual({ block: 0, text: 'line1\nline2', offset: 3 });
      });

      describe('When the codeblock is removed', function () {
        beforeEach(async () => {
          await _toggleCodeBlock();
        });

        it('should leave the cursor on the same line', function () {
          expect(_cursor()).toEqual({ block: 0, text: 'line1line2', offset: 3 });
        });

        it('should restore the original hard break rather than splitting into paragraphs', function () {
          expect(editorInstance.getHTML()).toBe('<p>line1<br>line2</p>');
        });
      });
    });

    describe('When removing a single-line codeblock', function () {
      beforeEach(async () => {
        await _setContentAndSelection('<pre><code>hello world</code></pre>', 4);
        await _toggleCodeBlock();
      });

      it('should leave the cursor where it was', function () {
        expect(_cursor()).toEqual({ block: 0, text: 'hello world', offset: 3 });
      });

      it('should convert the codeblock to a paragraph', function () {
        expect(editorInstance.getHTML()).toBe('<p>hello world</p>');
      });
    });

    describe('When toggling a codeblock on and back off', function () {
      // The codeblock stores each line separated by a single newline, so removing
      // it must not inflate those newlines into paragraph breaks.
      it('should round-trip the text output unchanged', async () => {
        await setProps({ outputFormat: 'text' });
        editorInstance = getEditor();
        await _setContentAndSelection('<p>line1<br>line2</p>', 4);
        const before = handle.getOutput();

        await act(async () => {
          editorInstance.commands.toggleCodeBlock();
          editorInstance.commands.toggleCodeBlock();
        });

        expect(handle.getOutput()).toBe(before);
      });
    });

    describe('When adding a codeblock over a selection spanning multiple paragraphs', function () {
      beforeEach(async () => {
        // from/to land inside 'line1' and 'line2' respectively.
        await _setContentAndSelection('<p>line1</p><p>line2</p>', { from: 2, to: 10 });
        await _toggleCodeBlock();
      });

      it('should merge the paragraphs into a single codeblock', function () {
        expect(editorInstance.getHTML()).toBe('<pre class="d-rich-text-editor__code-block"><code>line1\nline2</code></pre>');
      });

      it('should keep the same text selected rather than collapsing to the end', function () {
        const { from, to } = editorInstance.state.selection;
        expect(editorInstance.state.doc.textBetween(from, to)).toBe('ine1\nli');
      });
    });

    // Text positions in <pre>aaa</pre><pre>bbb</pre>: 1-4 in the first block,
    // 6-9 in the second. setBlockType does not change node sizes, so the same
    // positions still address the same characters once they are paragraphs.
    const TWO_CODEBLOCKS = '<pre><code>aaa</code></pre><pre><code>bbb</code></pre>';

    describe('When toggling a selection that spans several existing codeblocks', function () {
      beforeEach(async () => {
        await _setContentAndSelection(TWO_CODEBLOCKS, { from: 2, to: 8 });
      });

      it('should report the codeblock as active', function () {
        expect(editorInstance.isActive('codeBlock')).toBe(true);
      });

      describe('When the button is pressed', function () {
        beforeEach(async () => {
          await _toggleCodeBlock();
        });

        it('should turn them all off rather than merging them', function () {
          expect(editorInstance.getHTML()).toBe('<p>aaa</p><p>bbb</p>');
        });

        it('should keep the forward selection over the same text', function () {
          const { anchor, head } = editorInstance.state.selection;
          expect({ anchor, head }).toEqual({ anchor: 2, head: 8 });
        });
      });
    });

    describe('When toggling off a backward selection spanning several codeblocks', function () {
      beforeEach(async () => {
        await _setContentAndSelection(TWO_CODEBLOCKS, { from: 2, to: 8 });
        // Drag from the second block up into the first.
        await act(async () => {
          editorInstance.view.dispatch(
            editorInstance.state.tr.setSelection(
              TextSelection.create(editorInstance.state.doc, 8, 2),
            ),
          );
        });
        await _toggleCodeBlock();
      });

      it('should turn them all off', function () {
        expect(editorInstance.getHTML()).toBe('<p>aaa</p><p>bbb</p>');
      });

      it('should keep the selection pointing backward over the same text', function () {
        const { anchor, head } = editorInstance.state.selection;
        expect({ anchor, head }).toEqual({ anchor: 8, head: 2 });
      });
    });

    describe('When toggling a selection that mixes a codeblock and a paragraph', function () {
      beforeEach(async () => {
        await _setContentAndSelection('<pre><code>a</code></pre><p>b</p>', { from: 2, to: 6 });
      });

      it('should not report the codeblock as active', function () {
        expect(editorInstance.isActive('codeBlock')).toBe(false);
      });

      it('should merge them into a single codeblock', async () => {
        await _toggleCodeBlock();

        expect(editorInstance.getHTML())
          .toBe('<pre class="d-rich-text-editor__code-block"><code>a\nb</code></pre>');
      });
    });

    describe('When adding a codeblock over paragraphs with a blank one between', function () {
      beforeEach(async () => {
        await _setContentAndSelection('<p>a</p><p></p><p>b</p>', { from: 1, to: 8 });
        await _toggleCodeBlock();
      });

      it('should keep the blank line as an empty line in the codeblock', function () {
        expect(editorInstance.getHTML())
          .toBe('<pre class="d-rich-text-editor__code-block"><code>a\n\nb</code></pre>');
      });
    });

    describe('When adding a codeblock over a backward selection', function () {
      beforeEach(async () => {
        await _setContentAndSelection('<p>line1</p><p>line2</p>', { from: 2, to: 10 });
        // Drag from 'line2' up into 'line1', so the anchor trails the head.
        await act(async () => {
          editorInstance.view.dispatch(
            editorInstance.state.tr.setSelection(
              TextSelection.create(editorInstance.state.doc, 10, 2),
            ),
          );
        });
        await _toggleCodeBlock();
      });

      it('should keep the selection pointing backward', function () {
        const { anchor, head } = editorInstance.state.selection;
        expect(anchor).toBeGreaterThan(head);
      });

      it('should keep the same text selected', function () {
        const { from, to } = editorInstance.state.selection;
        expect(editorInstance.state.doc.textBetween(from, to)).toBe('ine1\nli');
      });
    });

    describe('When adding a codeblock over a select-all of multiple paragraphs', function () {
      // Select all produces an AllSelection whose ends sit at the document level,
      // outside any of the merged paragraphs.
      beforeEach(async () => {
        await act(async () => {
          editorInstance.commands.setContent('<p>line1</p><p>line2</p>');
          editorInstance.commands.selectAll();
          editorInstance.commands.toggleCodeBlock();
        });
      });

      it('should merge the paragraphs into one codeblock', function () {
        expect(editorInstance.getHTML())
          .toBe('<pre class="d-rich-text-editor__code-block"><code>line1\nline2</code></pre>');
      });

      it('should leave the whole codeblock selected', function () {
        const { from, to } = editorInstance.state.selection;
        expect(editorInstance.state.doc.textBetween(from, to)).toBe('line1\nline2');
      });
    });

    describe('When adding a codeblock over a selection spanning three paragraphs', function () {
      beforeEach(async () => {
        await _setContentAndSelection('<p>line1</p><p>line2</p><p>line3</p>', { from: 2, to: 17 });
        await _toggleCodeBlock();
      });

      it('should merge all three paragraphs into a single codeblock', function () {
        expect(editorInstance.getHTML()).toBe('<pre class="d-rich-text-editor__code-block"><code>line1\nline2\nline3</code></pre>');
      });

      it('should keep the same text selected', function () {
        const { from, to } = editorInstance.state.selection;
        expect(editorInstance.state.doc.textBetween(from, to)).toBe('ine1\nline2\nli');
      });
    });
  });
});
