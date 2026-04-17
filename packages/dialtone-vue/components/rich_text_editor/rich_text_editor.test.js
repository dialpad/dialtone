import { mount } from '@vue/test-utils';
import DtRichTextEditor from './rich_text_editor.vue';
import { EditorContent } from '@tiptap/vue-3';
import { simulatePaste } from '../../tests/setupTests';
import {
  findVariable,
  countVariables,
} from '../../common/test_utils/node_traversal';

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

          const jsonInputBase = (innerContent) => {
            return {
              type: 'doc',
              content: [{
                type: 'paragraph',
                content: innerContent,
              }],
            }
          };

          const getMarkdownOutput = async (jsonInput) => {
            wrapper.vm.editor.commands.setContent(jsonInput);
            await wrapper.vm.$nextTick();
            return wrapper.vm.getOutput();
          };

          beforeEach(async () => {
            await wrapper.setProps({ outputFormat: 'markdown' });
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
            await wrapper.setProps({ link: true });

            const jsonInput = jsonInputBase([{
              type: 'text',
              text: 'link text',
              marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
            }]);
            const output = await getMarkdownOutput(jsonInput);
            expect(output).toBe('[link text](https://example.com)');
          });

          it('should convert bullet lists to markdown without extra newlines', async () => {
            await wrapper.setProps({ allowBulletList: true });

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
            await wrapper.setProps({ allowBulletList: true });
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
            await wrapper.setProps({ link: true });
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
            await wrapper.setProps({ allowFontSize: true, outputFormat: 'html' });

            const jsonInput = jsonInputBase([{
              type: 'text',
              text: 'Large text',
              marks: [{ type: 'textStyle', attrs: { fontSize: '20px' } }],
            }]);

            // Set content directly to editor
            wrapper.vm.editor.commands.setContent(jsonInput);
            await wrapper.vm.$nextTick();

            const output = wrapper.vm.getOutput();
            expect(output).toContain('font-size: 20px');
          });

          it('should handle text with font color applied', async () => {
            await wrapper.setProps({ allowFontColor: true, outputFormat: 'html' });

            const jsonInput = jsonInputBase([{
              type: 'text',
              text: 'Colored text',
              marks: [{ type: 'textStyle', attrs: { color: '#ff0000' } }],
            }]);

            // Set content directly to editor
            wrapper.vm.editor.commands.setContent(jsonInput);
            await wrapper.vm.$nextTick();

            const output = wrapper.vm.getOutput();
            // TipTap converts hex colors to RGB format
            expect(output).toContain('color: rgb(255, 0, 0)');
          });

          it('should handle text with multiple text styles applied', async () => {
            await wrapper.setProps({
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
            wrapper.vm.editor.commands.setContent(jsonInput);
            await wrapper.vm.$nextTick();

            const output = wrapper.vm.getOutput();
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
            await wrapper.setProps({
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
            expect(output).toBe('Hello <!-- @mention: {"id": "john.doe", "contactKey": "contact-123", "name": "John Doe"} --> how are you?');
          });

          it('should convert channels to markdown comments correctly', async () => {
            await wrapper.setProps({
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
            expect(output).toBe('Check out <!-- @channel: {"id": "general", "channelKey": "", "name": "general", "locked": "false"} --> channel');
          });

          it('should convert locked channels to markdown comments correctly', async () => {
            await wrapper.setProps({
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
            expect(output).toBe('Check out <!-- @channel: {"id": "dialtone-internal", "channelKey": "", "name": "dialtone-internal", "locked": "true"} --> channel');
          });

          it('should convert channels with channelKey to markdown comments correctly', async () => {
            await wrapper.setProps({
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
            expect(output).toBe('Check out <!-- @channel: {"id": "general", "channelKey": "channel-456", "name": "general", "locked": "false"} --> channel');
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
        it('should preserve tables when pasted', async () => {
          // When new extensions are added due to change in props editor needs to be recreated
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;
          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'testtesttesttest');
          clipboardData.setData('text/html', '<table><tr><td>test</td><td>test</td></tr><tr><td>test</td><td>test</td></tr></table>');

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
          // Check that the table has been preserved using custom table rendering
          expect(output).toContain('<table>');
          expect(output).toContain('<tbody>');
          expect(output).toContain('test');
          expect(output).not.toContain('colgroup');
          expect(output).not.toContain('min-width');
        });

        it('should preserve text mark styles inside table cells when pasted', async () => {
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          props['allowFontSize'] = true;
          props['allowFontColor'] = true;
          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'Customer Support');
          clipboardData.setData('text/html', '<table><tr><td><div style="font-size:10pt; color:#002968; font-weight:bold;">Customer Support</div></td></tr></table>');

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
          expect(output).toContain('color: rgb(0, 41, 104)');
          expect(output).toContain('font-size: 10pt');
        });

        it('should preserve table border, cellpadding, and cellspacing attributes when pasted', async () => {
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'Cell');
          clipboardData.setData('text/html', '<table border="0" cellpadding="5" cellspacing="0"><tr><td>Cell</td></tr></table>');

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
          expect(output).toContain('border="0"');
          expect(output).toContain('cellpadding="5"');
          expect(output).toContain('cellspacing="0"');
        });

        it('should preserve table inline style attribute when pasted', async () => {
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'Cell');
          clipboardData.setData('text/html', '<table style="border-collapse: collapse; width: 100%;"><tr><td>Cell</td></tr></table>');

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
          expect(output).toContain('border-collapse: collapse');
          expect(output).toContain('width: 100%');
        });

        it('should preserve table row style attribute when pasted', async () => {
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'Cell');
          clipboardData.setData('text/html', '<table><tr style="background-color: #f0f0f0;"><td>Cell</td></tr></table>');

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
          expect(output).toContain('background-color: rgb(240, 240, 240)');
        });

        it('should preserve table cell style, valign, and width attributes when pasted', async () => {
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'Cell');
          clipboardData.setData('text/html', '<table><tr><td style="padding: 10px;" valign="top" width="200">Cell</td></tr></table>');

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
          expect(output).toContain('padding: 10px');
          expect(output).toContain('valign="top"');
          expect(output).toContain('width="200"');
        });

        it('should preserve table header style, valign, and width attributes when pasted', async () => {
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'Header');
          clipboardData.setData('text/html', '<table><tr><th style="font-weight: bold;" valign="middle" width="150">Header</th></tr><tr><td>Cell</td></tr></table>');

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
          expect(output).toContain('valign="middle"');
          expect(output).toContain('width="150"');
        });

        it('should preserve styles from anchor tags inside table cells when pasted', async () => {
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          props['allowFontSize'] = true;
          props['allowFontColor'] = true;
          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'Click here');
          clipboardData.setData('text/html', '<table><tr><td><a href="https://example.com" style="color:#0066cc; font-size:12pt;">Click here</a></td></tr></table>');

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
          expect(output).toContain('color: rgb(0, 102, 204)');
          expect(output).toContain('font-size: 12pt');
        });

        it('should preserve complex email signature table with mixed attributes when pasted', async () => {
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          props['allowFontSize'] = true;
          props['allowFontColor'] = true;
          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'John DoeSupport Team');
          clipboardData.setData('text/html',
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
          );

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
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
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'OuterInner');
          clipboardData.setData('text/html',
            '<table border="0" style="width: 100%;">' +
            '<tr><td style="padding: 10px;">' +
            '<table border="1" style="width: 50%;">' +
            '<tr><td style="padding: 5px;">Inner</td></tr>' +
            '</table>' +
            '</td></tr>' +
            '</table>',
          );

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
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
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'HeaderCell 1Cell 2');
          clipboardData.setData('text/html',
            '<table>' +
            '<tr><td colspan="2">Header</td></tr>' +
            '<tr><td>Cell 1</td><td>Cell 2</td></tr>' +
            '</table>',
          );

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
          expect(output).toContain('colspan="2"');
        });

        it('should handle multiple tables in a single paste with custom tables', async () => {
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'Table1Table2');
          clipboardData.setData('text/html',
            '<table border="1"><tr><td>Table1</td></tr></table>' +
            '<p>Separator</p>' +
            '<table border="2"><tr><td>Table2</td></tr></table>',
          );

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
          expect(output).toContain('border="1"');
          expect(output).toContain('border="2"');
          expect(output).toContain('Table1');
          expect(output).toContain('Table2');
          expect(output).toContain('Separator');
        });

        it('should handle table with empty cells in custom table mode', async () => {
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'Content');
          clipboardData.setData('text/html',
            '<table border="0" style="width: 100%;">' +
            '<tr><td style="padding: 5px;">Content</td><td></td></tr>' +
            '</table>',
          );

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
          expect(output).toContain('<table');
          expect(output).toContain('border="0"');
          expect(output).toContain('Content');
        });

        it('should preserve custom table attributes when setting content programmatically', async () => {
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();

          const tableHTML =
            '<table border="0" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">' +
            '<tbody>' +
            '<tr style="background-color: #eee;">' +
            '<td style="padding: 10px;" valign="top" width="200">Cell content</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>';

          wrapper.vm.editor.commands.setContent(tableHTML);
          await wrapper.vm.$nextTick();

          const output = wrapper.vm.getOutput();
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
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'AB');
          clipboardData.setData('text/html', '<table><tr><td>A</td><td>B</td></tr></table>');

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
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
          wrapper.unmount();
          props['outputFormat'] = 'html';
          props['modelValue'] = '';
          props['allowTables'] = true;

          props['allowFontSize'] = true;
          props['allowFontColor'] = true;
          editorEl?.remove();
          wrapper = mount(DtRichTextEditor, {
            props,
            components: { EditorContent },
            listeners,
            attrs,
            slots,
            attachTo: document.body,
          });
          await wrapper.vm.$nextTick();
          editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
          editorEl = document.getElementsByClassName('qa-editor')[0];

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'NameTitle');
          clipboardData.setData('text/html',
            '<table>' +
            '<tr><td>' +
            '<div style="font-size: 16pt; color: #111111;">Name</div>' +
            '<div style="font-size: 10pt; color: #888888;">Title</div>' +
            '</td></tr>' +
            '</table>',
          );

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
          expect(output).toContain('font-size: 16pt');
          expect(output).toContain('font-size: 10pt');
          expect(output).toContain('color: rgb(17, 17, 17)');
          expect(output).toContain('color: rgb(136, 136, 136)');
        });

        it('should not preserve tables when pasted without allow tables', async () => {
          await wrapper.setProps({
            pasteRichText: false,
            outputFormat: 'html',
            modelValue: '',
          });
          const clipboardData = new DataTransfer();
          clipboardData.setData('text/plain', 'testtesttesttest');
          clipboardData.setData('text/html', '<table><tr><td>test</td><td>test</td></tr><tr><td>test</td><td>test</td></tr></table>');

          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData,
            bubbles: true,
            cancelable: true,
          });

          editorEl.dispatchEvent(pasteEvent);
          await wrapper.vm.$nextTick();
          const output = wrapper.vm.getOutput();
          // Check that the table has been converted to text;
          expect(output).toBe(`<p>testtesttesttest</p>`);
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

    describe('Font styling tests', () => {
      describe('When font size is enabled', () => {
        beforeEach(async () => {
          await wrapper.setProps({
            allowFontSize: true,
            outputFormat: 'html',
            modelValue: 'Test text',
          });
        });

        it('should preserve font size when pasting styled content', async () => {
          // Remount with proper props for font size and rich text pasting
          wrapper.unmount();
          props = {
            ...baseProps,
            pasteRichText: true,
            allowFontSize: true,
            outputFormat: 'html',
            modelValue: '',
          };
          _mountWrapper();
          await wrapper.vm.$nextTick();
          _setChildWrappers();

          const htmlContent = '<span style="font-size: 24px;">Large text</span>';
          const textContent = 'Large text';

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

          const output = wrapper.vm.getOutput();
          expect(output).toContain('font-size');
        });
      });

      describe('When font color is enabled', () => {
        beforeEach(async () => {
          await wrapper.setProps({
            allowFontColor: true,
            outputFormat: 'html',
            modelValue: 'Test text',
          });
        });

        it('should preserve font color when pasting styled content', async () => {
          // Remount with proper props for font color and rich text pasting
          wrapper.unmount();
          props = {
            ...baseProps,
            pasteRichText: true,
            allowFontColor: true,
            outputFormat: 'html',
            modelValue: '',
          };
          _mountWrapper();
          await wrapper.vm.$nextTick();
          _setChildWrappers();

          const htmlContent = '<span style="color: rgb(255, 0, 0);">Red text</span>';
          const textContent = 'Red text';

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

          const output = wrapper.vm.getOutput();
          expect(output).toContain('color');
        });
      });

      describe('When both font size and color are enabled', () => {
        beforeEach(async () => {
          await wrapper.setProps({
            allowFontSize: true,
            allowFontColor: true,
            outputFormat: 'json',
            modelValue: '',
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

          wrapper.vm.editor.commands.setContent(content);
          await wrapper.vm.$nextTick();

          const jsonOutput = wrapper.vm.getOutput();
          const textNode = jsonOutput.content[0].content[0];
          expect(textNode.marks).toBeDefined();
          expect(textNode.marks[0].type).toBe('textStyle');
          expect(textNode.marks[0].attrs.fontSize).toBe('16px');
          expect(textNode.marks[0].attrs.color).toBe('#0000ff');
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Mention click functionality', () => {
      describe('When a mention is clicked', () => {
        it('should emit mention-click event with mention data', async () => {
          const mentionData = {
            id: 'john.doe',
            name: 'John Doe',
            avatarSrc: 'avatar.jpg',
            contactKey: 'contact-123',
          };

          await wrapper.setProps({
            mentionSuggestion: { items: vi.fn(() => [mentionData]) },
          });

          const editorInstance = wrapper.vm.editor;
          const mentionNode = editorInstance.schema.nodes.mention.create(mentionData);
          editorInstance.view.dispatch(editorInstance.state.tr.insert(0, mentionNode));
          await wrapper.vm.$nextTick();

          const mentionLink = wrapper.find('a.d-link');
          expect(mentionLink.text()).toBe('@John Doe');

          await mentionLink.trigger('click');
          expect(wrapper.emitted('mention-click')[0][0]).toEqual(mentionData);
        });
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
        await wrapper.setProps({
          mentionSuggestion: { items: vi.fn(() => [mentionData]) },
        });

        const editorInstance = wrapper.vm.editor;
        const mentionNode = editorInstance.schema.nodes.mention.create(mentionData);
        editorInstance.view.dispatch(editorInstance.state.tr.insert(0, mentionNode));
        await wrapper.vm.$nextTick();
      });

      describe('When the cursor enters a mention', () => {
        it('should emit mention-hover event with mention data and mouse event', async () => {
          const mentionLink = wrapper.find('a.d-link');
          await mentionLink.trigger('mouseenter');

          const emitted = wrapper.emitted('mention-hover');
          expect(emitted).toBeTruthy();
          expect(emitted[0][0]).toMatchObject(mentionData);
          expect(emitted[0][0].event).toBeInstanceOf(MouseEvent);
        });
      });

      describe('When the cursor leaves a mention', () => {
        it('should emit mention-leave event with mention data and mouse event', async () => {
          const mentionLink = wrapper.find('a.d-link');
          await mentionLink.trigger('mouseleave');

          const emitted = wrapper.emitted('mention-leave');
          expect(emitted).toBeTruthy();
          expect(emitted[0][0]).toMatchObject(mentionData);
          expect(emitted[0][0].event).toBeInstanceOf(MouseEvent);
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

          await wrapper.setProps({
            channelSuggestion: { items: vi.fn(() => [channelData]) },
          });

          const editorInstance = wrapper.vm.editor;
          const channelNode = editorInstance.schema.nodes.channel.create(channelData);
          editorInstance.view.dispatch(editorInstance.state.tr.insert(0, channelNode));
          await wrapper.vm.$nextTick();

          const channelLink = wrapper.find('a.d-link');
          expect(channelLink.text()).toBe('#general');

          await channelLink.trigger('click');
          expect(wrapper.emitted('channel-click')[0][0]).toEqual(channelData);
        });
      });
    });

    describe('setLink method', () => {
      const linkOptions = { class: 'd-link' };
      const supportedProtocols = [/^https?:\/\//, /^ftp?:\/\//, /mailto:/];
      const defaultPrefix = 'https://';

      beforeEach(async () => {
        await wrapper.setProps({ link: true, outputFormat: 'html' });
        wrapper.vm.editor.commands.focus();
      });

      it.each([
        ['https://example.com', 'Example', 'Example'],
        ['https://example.com', '', 'https://example.com'],
      ])('should render link correctly (url=%s, displayText=%s)', async (url, displayText, expectedSubstring) => {
        wrapper.vm.setLink(url, displayText, linkOptions, supportedProtocols, defaultPrefix);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.getOutput()).toContain(expectedSubstring);
      });
    });

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

  describe('Variable Extension Tests', function () {
    describe('When allowVariable is true', function () {
      const variableItems = [
        { id: 'user_name', name: 'User Name', placeholder: 'User Name' },
        { id: 'company_name', name: 'Company Name', placeholder: 'Company Name' },
        { id: 'ticket_id', name: 'Ticket ID', placeholder: 'Ticket ID' },
      ];

      beforeEach(async function () {
        await wrapper.setProps({
          allowVariable: true,
          variableItems,
        });
      });

      it('should enable the variable extension', function () {
        const editorInstance = wrapper.vm.editor;
        const variableExtension = editorInstance.extensionManager.extensions.find(
          ext => ext.name === 'variable',
        );
        expect(variableExtension).toBeDefined();
      });

      it('should have insertVariable command available', function () {
        const editorInstance = wrapper.vm.editor;
        expect(typeof editorInstance.commands.insertVariable).toBe('function');
      });

      it('should insert a variable with id and altText', async function () {
        const editorInstance = wrapper.vm.editor;
        editorInstance.commands.insertVariable({
          id: 'user_name',
          altText: 'John Doe',
        });
        await wrapper.vm.$nextTick();

        const json = editorInstance.getJSON();
        const variableNode = findVariable(json.content, 'user_name');
        expect(variableNode).not.toBeNull();
        expect(variableNode.attrs.altText).toBe('John Doe');
      });

      it('should render variables in HTML output', async function () {
        await wrapper.setProps({ outputFormat: 'html' });

        const editorInstance = wrapper.vm.editor;
        editorInstance.commands.insertVariable({
          id: 'company_name',
          altText: 'Acme Corp',
        });
        await wrapper.vm.$nextTick();

        const htmlOutput = wrapper.vm.getOutput();
        expect(htmlOutput).toContain('data-variable-id="company_name"');
        expect(htmlOutput).toContain('data-alt-text="Acme Corp"');
      });

      it('should render variables in JSON output', async function () {
        await wrapper.setProps({ outputFormat: 'json' });

        const editorInstance = wrapper.vm.editor;
        editorInstance.commands.insertVariable({
          id: 'ticket_id',
          altText: '#12345',
        });
        await wrapper.vm.$nextTick();

        const jsonOutput = wrapper.vm.getOutput();
        expect(jsonOutput.content).toBeDefined();

        const variableNode = findVariable(jsonOutput.content, 'ticket_id');
        expect(variableNode).not.toBeNull();
        expect(variableNode.attrs.altText).toBe('#12345');
      });

      it('should render variable altText in text output', async function () {
        await wrapper.setProps({ outputFormat: 'text', modelValue: '' });

        const editorInstance = wrapper.vm.editor;
        editorInstance.commands.insertVariable({
          id: 'user_name',
          altText: 'Jane Smith',
        });
        await wrapper.vm.$nextTick();

        const textOutput = wrapper.vm.getOutput();
        expect(textOutput).toBe('Jane Smith');
      });

      it('should render variables in markdown output as comments', async function () {
        await wrapper.setProps({ outputFormat: 'markdown', modelValue: '' });

        const editorInstance = wrapper.vm.editor;
        editorInstance.commands.insertContent('Hello ');
        editorInstance.commands.insertVariable({
          id: 'user_name',
          altText: 'Bob',
        });
        editorInstance.commands.insertContent(' welcome!');
        await wrapper.vm.$nextTick();

        const markdownOutput = wrapper.vm.getOutput();
        expect(markdownOutput).toBe('Hello {{user_name=Bob}} welcome!');
      });

      it('should insert multiple variables', async function () {
        const editorInstance = wrapper.vm.editor;

        editorInstance.commands.insertVariable({ id: 'user_name', altText: 'User' });
        editorInstance.commands.insertContent(' from ');
        editorInstance.commands.insertVariable({ id: 'company_name', altText: 'Company' });
        await wrapper.vm.$nextTick();

        const json = editorInstance.getJSON();
        const variableCount = countVariables(json.content);
        expect(variableCount).toBe(2);
      });

      it('should preserve variable items configuration', function () {
        const editorInstance = wrapper.vm.editor;
        const variableExtension = editorInstance.extensionManager.extensions.find(
          ext => ext.name === 'variable',
        );

        expect(variableExtension.options.variableItems).toEqual(variableItems);
      });

      it('should handle variables with empty altText', async function () {
        await wrapper.setProps({ outputFormat: 'text', modelValue: '' });

        const editorInstance = wrapper.vm.editor;
        editorInstance.commands.insertContent('Hello ');
        editorInstance.commands.insertVariable({ id: 'user_name', altText: '' });
        editorInstance.commands.insertContent(' there');
        await wrapper.vm.$nextTick();

        const textOutput = wrapper.vm.getOutput();
        expect(textOutput).toBe('Hello  there');
      });

      it('should parse variables from HTML input', async function () {
        const htmlWithVariable = '<p>Hello <variable data-variable-id="user_name" data-alt-text="Alice"></variable>!</p>';

        await wrapper.setProps({
          modelValue: htmlWithVariable,
          outputFormat: 'json',
        });
        await wrapper.vm.$nextTick();

        const jsonOutput = wrapper.vm.getOutput();
        const variableNode = findVariable(jsonOutput.content, 'user_name');
        expect(variableNode).not.toBeNull();
        expect(variableNode.attrs.altText).toBe('Alice');
      });
    });

    describe('When allowVariable is false', function () {
      beforeEach(async function () {
        await wrapper.setProps({
          allowVariable: false,
        });
      });

      it('should not enable the variable extension', function () {
        const editorInstance = wrapper.vm.editor;
        const variableExtension = editorInstance.extensionManager.extensions.find(
          ext => ext.name === 'variable',
        );
        expect(variableExtension).toBeUndefined();
      });

      it('should not have insertVariable command available', function () {
        const editorInstance = wrapper.vm.editor;
        expect(editorInstance.commands.insertVariable).toBeUndefined();
      });
    });

    describe('Variable with different output formats', function () {
      beforeEach(async function () {
        await wrapper.setProps({
          allowVariable: true,
          variableItems: [
            { id: 'test_var', name: 'Test Variable', placeholder: 'Test' },
          ],
          modelValue: '',
        });
      });

      it('should handle variables mixed with formatted text in markdown', async function () {
        await wrapper.setProps({
          outputFormat: 'markdown',
          allowBold: true,
          allowItalic: true,
        });

        const editorInstance = wrapper.vm.editor;
        editorInstance.commands.insertContent('Hello ');
        editorInstance.commands.insertVariable({ id: 'test_var', altText: 'Variable' });
        editorInstance.commands.insertContent(' and ');
        editorInstance.commands.toggleBold();
        editorInstance.commands.insertContent('bold text');
        await wrapper.vm.$nextTick();

        const markdownOutput = wrapper.vm.getOutput();
        expect(markdownOutput).toBe('Hello {{test_var=Variable}} and **bold text**');
      });

      it('should handle variables in complex document structure', async function () {
        await wrapper.setProps({
          outputFormat: 'json',
          allowBulletList: true,
        });

        const editorInstance = wrapper.vm.editor;
        editorInstance.commands.toggleBulletList();
        editorInstance.commands.insertContent('Item with ');
        editorInstance.commands.insertVariable({ id: 'test_var', altText: 'var' });
        await wrapper.vm.$nextTick();

        const jsonOutput = wrapper.vm.getOutput();
        expect(jsonOutput.content[0].type).toBe('bulletList');

        const hasVariables = countVariables(jsonOutput.content) > 0;
        expect(hasVariables).toBe(true);
      });
    });
  });
});
