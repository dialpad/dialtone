import { mount, createLocalVue } from '@vue/test-utils';
import DtRichTextEditor from './rich_text_editor.vue';
import { EditorContent } from '@tiptap/vue-2';

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
      components: { EditorContent },
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
                textAlign: 'left',
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
