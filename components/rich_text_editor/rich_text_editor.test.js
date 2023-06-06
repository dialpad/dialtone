import { mount, createLocalVue } from '@vue/test-utils';
import DtRichTextEditor from './rich_text_editor.vue';
import { EditorContent } from '@tiptap/vue-2';

// Wrappers
let wrapper;
let editor;
let editorEl;

// Test Environment
let propsData;
let attrs;
let slots;
let listeners;
let inputStub;
const localVue = createLocalVue();

// Constants
const baseProps = {
  value: 'initial value',
  inputAriaLabel: 'aria-label text',
  inputClass: 'qa-editor',
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
    propsData,
    components: { EditorContent },
    listeners,
    attrs,
    slots,
    localVue,
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
    propsData = baseProps;
    inputStub = vi.fn();
    listeners = {
      input: inputStub,
    };
    _mountWrapper();
    await wrapper.vm.$nextTick();
    _setChildWrappers();
  });

  // Test Teardown
  afterEach(() => {
    propsData = baseProps;
    slots = {};
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
        // Shared Examples
        const itBehavesLikeOutputsCorrectly = (value, output) => {
          it('should emit the output value', async () => {
            await _setValue(value);
            expect(wrapper.emitted().input[0][0]).toEqual(output);
            expect(inputStub).toHaveBeenCalled();
          });
        };

        describe('When using text output', () => {
          // Test Setup
          beforeEach(async () => {
            await wrapper.setProps({ outputFormat: 'text' });
          });

          itBehavesLikeOutputsCorrectly('new value', 'new value');
        });

        describe('When using json output', () => {
          // Test Environment
          const jsonOutput = {
            type: 'doc',
            content: [{
              type: 'paragraph',
              content: [{
                text: 'new value',
                type: 'text',
              }],
            }],
          };

          // Test Setup
          beforeEach(async () => {
            await wrapper.setProps({ outputFormat: 'json' });
          });

          itBehavesLikeOutputsCorrectly('new value', jsonOutput);
        });

        describe('When using html output', () => {
          // Test Setup
          beforeEach(async () => {
            await wrapper.setProps({ outputFormat: 'html' });
          });

          itBehavesLikeOutputsCorrectly('new value', '<p>new value</p>');
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
      beforeEach(async () => {
        await wrapper.setProps({ editable: false });
      });

      it('should have aria-readonly attribute', () => {
        expect(editor.attributes('aria-readonly')).toBe('true');
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When an inputAriaLabel prop is provided', () => {
      beforeEach(async () => {
        await wrapper.setProps({ inputAriaLabel: 'new aria-label' });
      });

      it('should pass through the prop to the editor', () => {
        expect(editor.attributes('aria-label')).toBe('new aria-label');
      });
    });

    describe('When an inputClass prop is provided', () => {
      beforeEach(async () => {
        await wrapper.setProps({ inputClass: 'input-class' });
      });

      it('should pass through the prop to the editor', () => {
        expect(editor.classes('input-class')).toBe(true);
      });
    });

    describe('When an editable prop is provided', () => {
      beforeEach(async () => {
        await wrapper.setProps({ editable: false });
      });

      it('should pass through the prop to the editor', () => {
        expect(editor.attributes('contenteditable')).toBe('false');
      });
    });
  });

  describe('Build Tests', () => {
    it('should not be included in the core build', async () => {
      // Ok this one is a bit goofy, but it's a naive attempt to make sure no
      // one exports this component at the root level.
      const DialtoneVue = await import('../../index.js');
      expect(Object.hasOwnProperty.call(DialtoneVue, 'DtRichTextEditor')).toBe(false);
    });
  });
});
