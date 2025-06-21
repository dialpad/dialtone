import { mount, createLocalVue } from '@vue/test-utils';
import DtRichTextEditor from './rich_text_editor.vue';
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-2';
import { simulatePaste } from '../../tests/setupTests';

const MOCK_INPUT_STUB = vi.fn();

const baseProps = {
  value: 'initial value',
  inputAriaLabel: 'aria-label text',
  inputClass: 'qa-editor',
};
const baseListeners = {
  input: MOCK_INPUT_STUB,
};

let mockProps = {};
let mockListeners = {};
const testContext = {};

describe('DtRichTextEditor tests', () => {
  let wrapper;
  let editor;
  let editorEl;

  const updateWrapper = async () => {
    editorEl?.remove();
    wrapper = mount(DtRichTextEditor, {
      components: { Editor, EditorContent, BubbleMenu },
      propsData: { ...baseProps, ...mockProps },
      listeners: { ...baseListeners, ...mockListeners },
      localVue: testContext.localVue,
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');
    editorEl = document.getElementsByClassName('qa-editor')[0];
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
    global.Range.prototype.getClientRects = vi.fn(() => [{}]);
    global.Range.prototype.getBoundingClientRect = vi.fn(() => [{}]);
    global.scrollBy = vi.fn();
  });

  beforeEach(async () => {
    await updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockListeners = {};
    wrapper.destroy();
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should contain the initial value', () => {
      expect(editor.text()).toBe('initial value');
    });
  });

  describe('Reactivity Tests', () => {
    describe('User Input Tests', () => {
      describe('When user inputs a value', () => {
        describe('When using text output', () => {
          it('should emit the output value', async () => {
            await wrapper.setProps({ outputFormat: 'text' });

            editorEl = document.getElementsByClassName('qa-editor')[0];

            editorEl.innerHTML = 'new value';

            await wrapper.vm.$nextTick();

            expect(wrapper.emitted().input[0][0]).toBe('new value');
            expect(MOCK_INPUT_STUB).toHaveBeenCalled();
          });
        });

        describe('When using json output', () => {
          const MOCK_JSON_OUTPUT = {
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

          it('should emit the output value', async () => {
            await wrapper.setProps({ outputFormat: 'json' });

            editorEl = document.getElementsByClassName('qa-editor')[0];
            editorEl.innerHTML = 'new value';

            await wrapper.vm.$nextTick();

            expect(wrapper.emitted().input[0][0]).toEqual(MOCK_JSON_OUTPUT);
            expect(MOCK_INPUT_STUB).toHaveBeenCalled();
          });
        });

        describe('When using html output', () => {
          it('should emit the output value', async () => {
            await wrapper.setProps({ outputFormat: 'html' });

            editorEl = document.getElementsByClassName('qa-editor')[0];
            editorEl.innerHTML = 'new value';

            await wrapper.vm.$nextTick();

            expect(wrapper.emitted().input[0][0]).toBe('<p>new value</p>');
            expect(MOCK_INPUT_STUB).toHaveBeenCalled();
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
            value: '',
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
            value: '',
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
            value: '',
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
            value: '',
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
            value: '',
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
            value: '',
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
            value: '',
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
            value: '',
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

  describe('Accessibility Tests', () => {
    it('should have aria-multiline attribute', () => {
      expect(editor.attributes('aria-multiline')).toBe('true');
    });

    it('should have role attribute', () => {
      expect(editor.attributes('role')).toBe('textbox');
    });

    describe('When not editable', () => {
      it('should have aria-readonly attribute', async () => {
        await wrapper.setProps({ editable: false });

        expect(editor.attributes('aria-readonly')).toBe('true');
        expect(editor.attributes('class')).toContain('qa-editor');
      });

      it('should preserve input classes', async () => {
        await wrapper.setProps({ editable: false });

        expect(editor.attributes('class')).toContain('qa-editor');
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When an inputAriaLabel prop is provided', () => {
      it('should pass through the prop to the editor', async () => {
        await wrapper.setProps({ inputAriaLabel: 'new aria-label' });

        expect(editor.attributes('aria-label')).toBe('new aria-label');
      });
    });

    describe('When an inputClass prop is provided', () => {
      it('should pass through the prop to the editor', async () => {
        await wrapper.setProps({ inputClass: 'input-class' });

        expect(editor.classes('input-class')).toBe(true);
      });
    });

    describe('When an editable prop is provided', () => {
      it('should pass through the prop to the editor', async () => {
        await wrapper.setProps({ editable: false });

        expect(editor.attributes('contenteditable')).toBe('false');
      });
    });
  });
});
