import { mount } from '@vue/test-utils';
import DtRichTextEditor from './rich_text_editor.vue';
import { EditorContent } from '@tiptap/vue-3';
import { simulatePaste } from '../../tests/setupTests';

// Wrappers
let wrapper;
let editor;
let editorEl;

// Test Environment
let props;
let attrs;
let slots;
let listeners;
let inputStub;

// Constants
const baseProps = {
  modelValue: 'initial value',
  inputAriaLabel: 'aria-label text',
  inputClass: 'qa-editor',
  allowInlineImages: true,
};

// Helpers
const _setChildWrappers = () => {
  editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
  editorEl = document.getElementsByClassName('qa-editor')[0];
};

const _mountWrapper = () => {
  // remove the previous element if it exists or otherwise we'll end up with
  // multiple elements when re-mounting.
  editorEl?.remove();
  wrapper = mount(DtRichTextEditor, {
    props,
    components: { EditorContent },
    listeners,
    attrs,
    slots,
    attachTo: document.body,
  });
};

const _setValue = async (value) => {
  // Use TipTap's setContent API and manually trigger events
  wrapper.vm.editor.commands.setContent(value, false, { preserveWhitespace: 'full' });
  // Manually trigger the input change events that would normally be called by the 'update' event
  wrapper.vm.triggerInputChangeEvents();
  await wrapper.vm.$nextTick();
};

describe('DtRichTextEditor tests', () => {
  // Test Setup
  beforeAll(() => {
    global.Range.prototype.getClientRects = vi.fn(() => [{}]);
    global.Range.prototype.getBoundingClientRect = vi.fn(() => [{}]);
    global.scrollBy = vi.fn();
  });

  beforeEach(async () => {
    props = baseProps;
    inputStub = vi.fn();
    attrs = {
      onInput: inputStub,
    };
    _mountWrapper();
    await wrapper.vm.$nextTick();
    _setChildWrappers();
  });

  // Test Teardown
  afterEach(function () {
    props = baseProps;
    slots = {};
    wrapper.unmount();
  });

  describe('Presentation Tests', function () {
    it('should render the component', function () {
      expect(wrapper.exists()).toBe(true);
    });

    it('should contain the initial value', function () {
      expect(editor.text()).toBe('initial value');
    });
  });

  describe('Reactivity Tests', function () {
    describe('User Input Tests', function () {
      describe('When user inputs a value', function () {
        // Shared Examples
        const itBehavesLikeOutputsCorrectly = (value, output, onlyCheckOutputContained = false) => {
          it('should emit the output value', async () => {
            await _setValue(value);

            // In Vue 3, check for update:modelValue event (v-model standard)
            const emittedEvents = wrapper.emitted()['update:modelValue'] || wrapper.emitted().input;
            const emittedOutput = emittedEvents?.[0]?.[0];

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
            await wrapper.setProps({ outputFormat: 'text' });
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
            await wrapper.setProps({ outputFormat: 'json' });
          });

          itBehavesLikeOutputsCorrectly('new value', jsonOutput);
        });

        describe('When using html output', function () {
          // Test Setup
          beforeEach(async function () {
            await wrapper.setProps({ outputFormat: 'html' });
          });

          itBehavesLikeOutputsCorrectly('new value', '<p>new value</p>');

          const htmlWithImgTag = 'image <img src="http://someimgurl.com" height="100px" width="200px" />';

          itBehavesLikeOutputsCorrectly(htmlWithImgTag, 'height="100px"', true);
          itBehavesLikeOutputsCorrectly(htmlWithImgTag, 'width="200px"', true);
          itBehavesLikeOutputsCorrectly(htmlWithImgTag, 'src="http://someimgurl.com"', true);
        });

        describe('When using markdown output', () => {
          it('should convert JSON to markdown correctly', async () => {
            const wrapper = mount(DtRichTextEditor, {
              props: {
                outputFormat: 'markdown',
                inputAriaLabel: 'Test',
              },
            });

            // Test jsonToMarkdownConverter directly
            const jsonToMarkdownConverter = wrapper.vm.jsonToMarkdownConverter;
            const jsonInput = {
              type: 'doc',
              content: [{
                type: 'paragraph',
                content: [{
                  type: 'text',
                  text: 'bold text',
                  marks: [{ type: 'bold' }],
                }],
              }],
            };
            const output = jsonToMarkdownConverter.convertToMarkdown(jsonInput);
            expect(output).toBe('**bold text**\n');
          });

          it('should convert italic text to markdown correctly', async () => {
            const wrapper = mount(DtRichTextEditor, {
              props: {
                outputFormat: 'markdown',
                allowItalic: true,
                inputAriaLabel: 'Test',
              },
            });

            // Test jsonToMarkdownConverter directly
            const jsonToMarkdownConverter = wrapper.vm.jsonToMarkdownConverter;
            const jsonInput = {
              type: 'doc',
              content: [{
                type: 'paragraph',
                content: [{
                  type: 'text',
                  text: 'italic text',
                  marks: [{ type: 'italic' }],
                }],
              }],
            };
            const output = jsonToMarkdownConverter.convertToMarkdown(jsonInput);
            expect(output).toBe('*italic text*\n');
          });

          it('should convert strikethrough text to markdown correctly', async () => {
            const wrapper = mount(DtRichTextEditor, {
              props: {
                outputFormat: 'markdown',
                allowStrike: true,
                inputAriaLabel: 'Test',
              },
            });

            // Test jsonToMarkdownConverter directly
            const jsonToMarkdownConverter = wrapper.vm.jsonToMarkdownConverter;
            const jsonInput = {
              type: 'doc',
              content: [{
                type: 'paragraph',
                content: [{
                  type: 'text',
                  text: 'strikethrough text',
                  marks: [{ type: 'strike' }],
                }],
              }],
            };
            const output = jsonToMarkdownConverter.convertToMarkdown(jsonInput);
            expect(output).toBe('~~strikethrough text~~\n');
          });

          it('should convert links to markdown correctly', async () => {
            const wrapper = mount(DtRichTextEditor, {
              props: {
                outputFormat: 'markdown',
                link: true,
                inputAriaLabel: 'Test',
              },
            });

            // Test jsonToMarkdownConverter directly
            const jsonToMarkdownConverter = wrapper.vm.jsonToMarkdownConverter;
            const jsonInput = {
              type: 'doc',
              content: [{
                type: 'paragraph',
                content: [{
                  type: 'text',
                  text: 'link text',
                  marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
                }],
              }],
            };
            const output = jsonToMarkdownConverter.convertToMarkdown(jsonInput);
            expect(output).toBe('[link text](https://example.com)\n');
          });

          it('should convert bullet lists to markdown without extra newlines', async () => {
            const wrapper = mount(DtRichTextEditor, {
              props: {
                outputFormat: 'markdown',
                allowBulletList: true,
                inputAriaLabel: 'Test',
              },
            });

            // Test jsonToMarkdownConverter directly
            const jsonToMarkdownConverter = wrapper.vm.jsonToMarkdownConverter;
            const jsonInput = {
              type: 'doc',
              content: [{
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [{
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'First item' }],
                    }],
                  },
                  {
                    type: 'listItem',
                    content: [{
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Second item' }],
                    }],
                  },
                  {
                    type: 'listItem',
                    content: [{
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Third item' }],
                    }],
                  },
                ],
              }],
            };
            const output = jsonToMarkdownConverter.convertToMarkdown(jsonInput);
            expect(output).toBe('- First item\n- Second item\n- Third item\n');
          });

          it('should convert bullet lists with formatting to markdown correctly', async () => {
            const wrapper = mount(DtRichTextEditor, {
              props: {
                outputFormat: 'markdown',
                allowBulletList: true,
                allowBold: true,
                allowItalic: true,
                inputAriaLabel: 'Test',
              },
            });

            // Test jsonToMarkdownConverter directly
            const jsonToMarkdownConverter = wrapper.vm.jsonToMarkdownConverter;
            const jsonInput = {
              type: 'doc',
              content: [{
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [{
                      type: 'paragraph',
                      content: [
                        { type: 'text', text: 'Item with ' },
                        { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
                        { type: 'text', text: ' text' },
                      ],
                    }],
                  },
                  {
                    type: 'listItem',
                    content: [{
                      type: 'paragraph',
                      content: [
                        { type: 'text', text: 'Item with ' },
                        { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
                        { type: 'text', text: ' text' },
                      ],
                    }],
                  },
                  {
                    type: 'listItem',
                    content: [{
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Regular item' }],
                    }],
                  },
                ],
              }],
            };
            const output = jsonToMarkdownConverter.convertToMarkdown(jsonInput);
            expect(output).toBe('- Item with **bold** text\n- Item with *italic* text\n- Regular item\n');
          });

          it('should convert mixed formatting to markdown correctly', async () => {
            const wrapper = mount(DtRichTextEditor, {
              props: {
                outputFormat: 'markdown',
                allowBold: true,
                allowItalic: true,
                allowStrike: true,
                link: true,
                inputAriaLabel: 'Test',
              },
            });

            // Test jsonToMarkdownConverter directly
            const jsonToMarkdownConverter = wrapper.vm.jsonToMarkdownConverter;
            const jsonInput = {
              type: 'doc',
              content: [{
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'This has ' },
                  { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
                  { type: 'text', text: ', ' },
                  { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
                  { type: 'text', text: ', ' },
                  { type: 'text', text: 'strikethrough', marks: [{ type: 'strike' }] },
                  { type: 'text', text: ', and a ' },
                  { type: 'text', text: 'link', marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] },
                  { type: 'text', text: '.' },
                ],
              }],
            };
            const output = jsonToMarkdownConverter.convertToMarkdown(jsonInput);
            expect(output).toBe('This has **bold**, *italic*, ~~strikethrough~~, and a [link](https://example.com).\n');
          });

          it('should handle nested formatting correctly', async () => {
            const wrapper = mount(DtRichTextEditor, {
              props: {
                outputFormat: 'markdown',
                allowBold: true,
                allowItalic: true,
                inputAriaLabel: 'Test',
              },
            });

            // Test jsonToMarkdownConverter directly
            const jsonToMarkdownConverter = wrapper.vm.jsonToMarkdownConverter;
            const jsonInput = {
              type: 'doc',
              content: [{
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'Bold and ', marks: [{ type: 'bold' }] },
                  { type: 'text', text: 'italic', marks: [{ type: 'bold' }, { type: 'italic' }] },
                  { type: 'text', text: ' nested', marks: [{ type: 'bold' }] },
                ],
              }],
            };
            const output = jsonToMarkdownConverter.convertToMarkdown(jsonInput);
            expect(output).toBe('**Bold and *****italic***** nested**\n');
          });

          it('should convert mentions to markdown comments correctly', async () => {
            const wrapper = mount(DtRichTextEditor, {
              props: {
                outputFormat: 'markdown',
                inputAriaLabel: 'Test',
              },
            });

            // Test jsonToMarkdownConverter directly
            const jsonToMarkdownConverter = wrapper.vm.jsonToMarkdownConverter;
            const jsonInput = {
              type: 'doc',
              content: [{
                type: 'paragraph',
                content: [
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
                ],
              }],
            };
            const output = jsonToMarkdownConverter.convertToMarkdown(jsonInput);
            expect(output).toBe('Hello <!-- @mention: {"id": "john.doe", "contactKey": "contact-123", "name": "John Doe"} --> how are you?\n');
          });

          it('should convert channels to markdown comments correctly', async () => {
            const wrapper = mount(DtRichTextEditor, {
              props: {
                outputFormat: 'markdown',
                inputAriaLabel: 'Test',
              },
            });

            // Test jsonToMarkdownConverter directly
            const jsonToMarkdownConverter = wrapper.vm.jsonToMarkdownConverter;
            const jsonInput = {
              type: 'doc',
              content: [{
                type: 'paragraph',
                content: [
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
                ],
              }],
            };
            const output = jsonToMarkdownConverter.convertToMarkdown(jsonInput);
            expect(output).toBe('Check out <!-- @channel: {"id": "general", "name": "general", "locked": "false"} --> channel\n');
          });

          it('should convert locked channels to markdown comments correctly', async () => {
            const wrapper = mount(DtRichTextEditor, {
              props: {
                outputFormat: 'markdown',
                inputAriaLabel: 'Test',
              },
            });

            // Test jsonToMarkdownConverter directly
            const jsonToMarkdownConverter = wrapper.vm.jsonToMarkdownConverter;
            const jsonInput = {
              type: 'doc',
              content: [{
                type: 'paragraph',
                content: [
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
                ],
              }],
            };
            const output = jsonToMarkdownConverter.convertToMarkdown(jsonInput);
            expect(output).toBe('Check out <!-- @channel: {"id": "dialtone-internal", "name": "dialtone-internal", "locked": "true"} --> channel\n');
          });
        });
      });
    });
    describe('Copy paste tests', () => {
      describe('When pasting plain text', () => {
        it('should handle plain text paste correctly', async () => {
          const pastedText = 'This is pasted plain text';

          simulatePaste(pastedText, 'text/plain', editorEl);
          await wrapper.vm.$nextTick();

          expect(wrapper.vm.getOutput()).toContain(pastedText);
        });
      });

      describe('When pasting HTML content', () => {
        it('if pasteRichText is true, it should parse html content', async () => {
          await wrapper.setProps({
            pasteRichText: true,
            allowBold: true,
            outputFormat: 'html',
            modelValue: '',
          });
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const htmlContent = '<strong>bold pasted text</strong>';
          const textContent = 'bold pasted text';
          const clipboardData = new DataTransfer();
          clipboardData.setData('text/html', htmlContent);
          clipboardData.setData('text/plain', textContent);

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();

          let output = wrapper.vm.getOutput();
          // Verify html output
          expect(output).toBe(`<p>${htmlContent}</p>`);
          await wrapper.setProps({
            outputFormat: 'text',
          });
          output = wrapper.vm.getOutput();
          // Verify text output
          expect(output).toBe(textContent);
        });

        it('if pasteRichText is false, html tags should be output as literal characters', async () => {
          await wrapper.setProps({
            pasteRichText: false,
            allowBold: true,
            outputFormat: 'html',
            modelValue: '',
          });
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const htmlContent = '<strong>bold pasted text</strong>';
          const clipboardData = new DataTransfer();
          clipboardData.setData('text/html', htmlContent);
          clipboardData.setData('text/plain', '<strong>bold pasted text</strong>');

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();

          let output = wrapper.vm.getOutput();
          expect(output).toBe('<p>&lt;strong&gt;bold pasted text&lt;/strong&gt;</p>');
          await wrapper.setProps({
            outputFormat: 'text',
          });
          output = wrapper.vm.getOutput();
          expect(output).toBe('<strong>bold pasted text</strong>');
        });

        it('if pasteRichText is false, line breaks should be preserved as hard breaks', async () => {
          await wrapper.setProps({
            pasteRichText: false,
            outputFormat: 'html',
            modelValue: '',
          });
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const textWithLineBreaks = 'Line 1\nLine 2\nLine 3';
          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', textWithLineBreaks);

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();

          const output = wrapper.vm.getOutput();
          // Line breaks should be converted to <br /> tags within a single paragraph
          expect(output).toBe('<p>Line 1<br>Line 2<br>Line 3</p>');
        });
      });

      describe('When pasting content with line breaks and white space', () => {
        it('should retain the line breaks and white space', async () => {
          await wrapper.setProps({
            allowLineBreaks: true,
            outputFormat: 'text',
            modelValue: '',
          });
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const textWithLineBreaks = 'Line 1\n  Line 2\n    Line 3';
          simulatePaste(textWithLineBreaks, 'text/plain', editorEl);
          await wrapper.vm.$nextTick();

          const output = wrapper.vm.getOutput();
          // Check that the line break content was pasted and contains the lines
          expect(output).toBe(textWithLineBreaks);
        });
      });
      describe('When pasting content with line breaks in html mode', () => {
        it('line breaks should be converted to <p>', async () => {
          await wrapper.setProps({
            allowLineBreaks: true,
            outputFormat: 'html',
            modelValue: '',
          });
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const textWithLineBreaks = 'Line 1\n  Line 2\n    Line 3';
          simulatePaste(textWithLineBreaks, 'text/plain', editorEl);
          await wrapper.vm.$nextTick();

          const output = wrapper.vm.getOutput();
          // Check that the line break content was pasted and converted to HTML paragraphs
          expect(output).toBe('<p>Line 1</p><p>  Line 2</p><p>    Line 3</p>');
        });
      });

      describe('When pasting preformatted HTML content', () => {
        it('should preserve line breaks from white-space: pre-wrap content', async () => {
          await wrapper.setProps({
            pasteRichText: true,
            outputFormat: 'html',
            modelValue: '',
          });
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const preformattedHTML = '<span style="white-space: pre-wrap;">Line 1\nLine 2\nLine 3</span>';
          const clipboardData = new DataTransfer();
          clipboardData.setData('text/html', preformattedHTML);
          clipboardData.setData('text/plain', 'Line 1\nLine 2\nLine 3');

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();

          const output = wrapper.vm.getOutput();
          // Check that line breaks are preserved as hard breaks when pasting preformatted HTML
          expect(output).toBe('<p>Line 1<br>Line 2<br>Line 3</p>');
        });
      });

      describe('When pasting content with blank lines', () => {
        it('should preserve blank lines when pasteRichText is true', async () => {
          await wrapper.setProps({
            pasteRichText: true,
            outputFormat: 'html',
            modelValue: '',
          });
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const textWithBlankLines = '# go to ubervoice/static folder\ncd ~/src/firespotter/ubervoice/static\n\nnpm install';
          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', textWithBlankLines);

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();

          const output = wrapper.vm.getOutput();
          // Check that blank lines are preserved as hard breaks
          expect(output).toBe('<p># go to ubervoice/static folder<br>cd ~/src/firespotter/ubervoice/static<br><br>npm install</p>');
        });

        it('should still convert single line breaks to paragraphs when no blank lines present', async () => {
          await wrapper.setProps({
            pasteRichText: true,
            outputFormat: 'html',
            modelValue: '',
          });
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const textWithSingleLineBreaks = 'Line 1\nLine 2\nLine 3';
          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', textWithSingleLineBreaks);

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();

          const output = wrapper.vm.getOutput();
          // Check that single line breaks are converted to paragraphs (default TipTap behavior)
          expect(output).toBe('<p>Line 1</p><p>Line 2</p><p>Line 3</p>');
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Link keyboard shortcut functionality', () => {
      describe('When Mod+K is pressed and link is enabled', () => {
        it('should emit edit-link event', async () => {
          await wrapper.setProps({ link: true });

          // Get the editor instance
          const editorInstance = wrapper.vm.editor;

          // Focus the editor
          editorInstance.commands.focus();

          // Simulate the keyboard shortcut by triggering it directly on the editor
          // This tests that the edit-link event gets emitted when Mod+K shortcut is triggered
          editorInstance.commands.keyboardShortcut('Mod-k');

          await wrapper.vm.$nextTick();

          // Check if the edit-link event was emitted
          expect(wrapper.emitted('edit-link')).toBeTruthy();
        });
      });
    });

    describe('Blockquote keyboard shortcut functionality', () => {
      describe('When Mod+Shift+B is pressed and blockquote is enabled', () => {
        it('should toggle blockquote formatting', async () => {
          await wrapper.setProps({
            allowBlockquote: true,
            outputFormat: 'html',
            modelValue: 'Test text',
          });

          // Get the editor instance
          const editorInstance = wrapper.vm.editor;

          // Focus the editor and select all text
          editorInstance.commands.focus();
          editorInstance.commands.selectAll();

          // Simulate the Mod+Shift+B keyboard shortcut
          editorInstance.commands.keyboardShortcut('Mod-Shift-b');

          await wrapper.vm.$nextTick();

          // Check if the text is now wrapped in a blockquote
          const output = wrapper.vm.getOutput();
          expect(output).toBe('<blockquote><p>Test text</p></blockquote>');
        });
      });
    });

    describe('handleKeyDown functionality', () => {
      let mockKeyEvent;
      let mockView;

      beforeEach(() => {
        mockView = { state: { schema: {} } };
        mockKeyEvent = {
          key: '',
          shiftKey: false,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
        };
      });

      describe('When preventTyping is false', () => {
        beforeEach(async () => {
          await wrapper.setProps({ preventTyping: false });
        });

        it('should allow letter keys by returning false', () => {
          const handleKeyDown = wrapper.vm.editor.options.editorProps.handleKeyDown;

          mockKeyEvent.key = 'a';
          expect(handleKeyDown(mockView, mockKeyEvent)).toBe(false);
        });

        it('should allow Enter key by returning false', () => {
          const handleKeyDown = wrapper.vm.editor.options.editorProps.handleKeyDown;

          mockKeyEvent.key = 'Enter';
          expect(handleKeyDown(mockView, mockKeyEvent)).toBe(false);
        });

        it('should allow Backspace key by returning false', () => {
          const handleKeyDown = wrapper.vm.editor.options.editorProps.handleKeyDown;

          mockKeyEvent.key = 'Backspace';
          expect(handleKeyDown(mockView, mockKeyEvent)).toBe(false);
        });

        it('should allow Space key by returning false', () => {
          const handleKeyDown = wrapper.vm.editor.options.editorProps.handleKeyDown;

          mockKeyEvent.key = 'Space';
          expect(handleKeyDown(mockView, mockKeyEvent)).toBe(false);
        });
      });

      describe('When preventTyping is true', () => {
        beforeEach(async () => {
          await wrapper.setProps({ preventTyping: true });
        });

        describe('Backspace key', () => {
          it('should always allow Backspace key', () => {
            const handleKeyDown = wrapper.vm.editor.options.editorProps.handleKeyDown;

            mockKeyEvent.key = 'Backspace';
            expect(handleKeyDown(mockView, mockKeyEvent)).toBe(false);
          });
        });

        describe('Enter key with allowLineBreaks false', () => {
          beforeEach(async () => {
            await wrapper.setProps({
              preventTyping: true,
              allowLineBreaks: false,
            });
          });

          it('should allow Enter key when shift is not pressed', () => {
            const handleKeyDown = wrapper.vm.editor.options.editorProps.handleKeyDown;

            mockKeyEvent.key = 'Enter';
            mockKeyEvent.shiftKey = false;
            expect(handleKeyDown(mockView, mockKeyEvent)).toBe(false);
          });

          it('should block Enter key when shift is pressed', () => {
            const handleKeyDown = wrapper.vm.editor.options.editorProps.handleKeyDown;

            mockKeyEvent.key = 'Enter';
            mockKeyEvent.shiftKey = true;
            expect(handleKeyDown(mockView, mockKeyEvent)).toBe(true);
          });
        });

        describe('Enter key with allowLineBreaks true', () => {
          beforeEach(async () => {
            await wrapper.setProps({
              preventTyping: true,
              allowLineBreaks: true,
            });
          });

          it('should block Enter key when shift is not pressed', () => {
            const handleKeyDown = wrapper.vm.editor.options.editorProps.handleKeyDown;

            mockKeyEvent.key = 'Enter';
            mockKeyEvent.shiftKey = false;
            expect(handleKeyDown(mockView, mockKeyEvent)).toBe(true);
          });

          it('should block Enter key when shift is pressed', () => {
            const handleKeyDown = wrapper.vm.editor.options.editorProps.handleKeyDown;

            mockKeyEvent.key = 'Enter';
            mockKeyEvent.shiftKey = true;
            expect(handleKeyDown(mockView, mockKeyEvent)).toBe(true);
          });
        });

        describe('Other keys', () => {
          it('should block letter keys', () => {
            const handleKeyDown = wrapper.vm.editor.options.editorProps.handleKeyDown;

            mockKeyEvent.key = 'a';
            expect(handleKeyDown(mockView, mockKeyEvent)).toBe(true);
          });

          it('should block Tab key', () => {
            const handleKeyDown = wrapper.vm.editor.options.editorProps.handleKeyDown;

            mockKeyEvent.key = 'Tab';
            mockKeyEvent.shiftKey = false;
            expect(handleKeyDown(mockView, mockKeyEvent)).toBe(true);

            mockKeyEvent.shiftKey = true;
            expect(handleKeyDown(mockView, mockKeyEvent)).toBe(true);
          });

          it('should block Delete key', () => {
            const handleKeyDown = wrapper.vm.editor.options.editorProps.handleKeyDown;

            mockKeyEvent.key = 'Delete';
            mockKeyEvent.shiftKey = false;
            expect(handleKeyDown(mockView, mockKeyEvent)).toBe(true);

            mockKeyEvent.shiftKey = true;
            expect(handleKeyDown(mockView, mockKeyEvent)).toBe(true);
          });
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('should have aria-multiline attribute', () => {
      expect(editor.attributes('aria-multiline')).toBe('true');
    });

    it('should have role attribute', function () {
      expect(editor.attributes('role')).toBe('textbox');
    });

    describe('When not editable', function () {
      beforeEach(async function () {
        await wrapper.setProps({ editable: false });
      });

      it('should have aria-readonly attribute', function () {
        expect(editor.attributes('aria-readonly')).toBe('true');
      });

      it('should preserve input classes', function () {
        expect(editor.attributes('class')).toContain('qa-editor');
      });
    });
  });

  describe('Extendability Tests', function () {
    describe('When an inputAriaLabel prop is provided', function () {
      beforeEach(async function () {
        await wrapper.setProps({ inputAriaLabel: 'new aria-label' });
      });

      it('should pass through the prop to the editor', function () {
        expect(editor.attributes('aria-label')).toBe('new aria-label');
      });
    });

    describe('When an inputClass prop is provided', function () {
      beforeEach(async function () {
        await wrapper.setProps({ inputClass: 'input-class' });
      });

      it('should pass through the prop to the editor', function () {
        expect(editor.classes('input-class')).toBe(true);
      });
    });

    describe('When an editable prop is provided', function () {
      beforeEach(async function () {
        await wrapper.setProps({ editable: false });
      });

      it('should pass through the prop to the editor', function () {
        expect(editor.attributes('contenteditable')).toBe('false');
      });
    });
  });

  describe('Slash Command Event Tests', function () {
    describe('When slash command suggestion is enabled', function () {
      let mockSelectedCommandListener;
      let slashCommandSuggestion;

      beforeEach(async function () {
        mockSelectedCommandListener = vi.fn();
        slashCommandSuggestion = {
          items: () => [
            { command: 'test', description: 'Test command' },
            { command: 'example', description: 'Example command' },
          ],
        };

        await wrapper.setProps({
          slashCommandSuggestion,
        });

        wrapper.vm.$on?.('selected-command', mockSelectedCommandListener) ||
        wrapper.vm.$el?.addEventListener?.('selected-command', mockSelectedCommandListener);
      });

      it('should emit selected-command event when slash command component is created', async function () {
        // Get the editor instance
        const editorInstance = wrapper.vm.editor;

        // Manually create a slash command node to simulate selection
        const slashCommandNode = editorInstance.schema.nodes['slash-commands'].create({
          command: 'test',
        });

        // Insert the node into the editor
        const tr = editorInstance.state.tr.insert(0, slashCommandNode);
        editorInstance.view.dispatch(tr);

        await wrapper.vm.$nextTick();

        // Check if the selected-command event was emitted
        const emittedEvents = wrapper.emitted('selected-command');
        expect(emittedEvents[0][0]).toBe('test');
      });

      it('should handle different slash commands correctly', async function () {
        const editorInstance = wrapper.vm.editor;

        // Test with different command
        const slashCommandNode = editorInstance.schema.nodes['slash-commands'].create({
          command: 'example',
        });

        const tr = editorInstance.state.tr.insert(0, slashCommandNode);
        editorInstance.view.dispatch(tr);

        await wrapper.vm.$nextTick();

        const emittedEvents = wrapper.emitted('selected-command');
        expect(emittedEvents[0][0]).toBe('example');
      });
    });

    describe('When slash command suggestion is not enabled', function () {
      it('should not emit selected-command events', function () {
        // Default props don't include slashCommandSuggestion
        const emittedEvents = wrapper.emitted('selected-command');
        expect(emittedEvents).toBeFalsy();
      });
    });
  });
});
