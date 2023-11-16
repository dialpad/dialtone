import { mount } from '@vue/test-utils';
import DtRichTextEditor from '../../rich_text_editor.vue';
import { EditorContent } from '@tiptap/vue-3';

// Wrappers
let wrapper;
let editorEl;

// Test Environment
let propsData;

// Constants
const baseProps = {
  modelValue: 'init',
  inputAriaLabel: 'aria-label text',
  link: true,
  inputClass: 'qa-editor',
};

const getClientRectsMock = vi.fn(() => [{}]);
const getBoundingClientRect = vi.fn(() => [{}]);
const scrollByMock = vi.fn();

// Helpers
const _setChildWrappers = () => {
  editorEl = document.getElementsByClassName('qa-editor')[0];
};

const _setValue = async (value) => {
  // await wrapper.setProps({ modelValue: value });
  editorEl.innerHTML = value;
  await wrapper.vm.$nextTick();
};

const _getEmojiNodesFromJSON = () => {
  const json = wrapper.vm.editor.getJSON();
  const emojiNodes = [];

  for (const paragraph of json.content) {
    for (const node of paragraph.content) {
      if (node.type !== 'emoji') continue;
      emojiNodes.push(node);
    }
  }

  return emojiNodes;
};

const _mountWrapper = () => {
  editorEl?.remove();
  wrapper = mount(DtRichTextEditor, {
    propsData,
    components: { EditorContent },
    attachTo: document.body,
  });
};

describe('DtRichTextEditor Emoji Extension tests', () => {
  // Test Setup
  beforeAll(() => {
    global.Range.prototype.getClientRects = getClientRectsMock;
    global.Range.prototype.getBoundingClientRect = getBoundingClientRect;
    global.scrollBy = scrollByMock;
  });

  beforeEach(async () => {
    propsData = baseProps;
    _mountWrapper();
    await wrapper.vm.$nextTick();
    _setChildWrappers();
  });

  // Test Teardown
  afterEach(() => {
    propsData = baseProps;
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
