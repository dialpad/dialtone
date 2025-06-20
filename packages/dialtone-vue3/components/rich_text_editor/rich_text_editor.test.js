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
  editorEl.innerHTML = value;
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
            const emittedOutput = wrapper.emitted().input[0][0];
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
    });
  });

  describe('Accessibility Tests', function () {
    it('should have aria-multiline attribute', function () {
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
});
