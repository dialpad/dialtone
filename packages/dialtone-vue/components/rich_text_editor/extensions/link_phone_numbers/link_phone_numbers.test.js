import { mount } from '@vue/test-utils';
import { DtRichTextEditor } from '@/components/rich_text_editor';
import { EditorContent } from '@tiptap/vue-3';

let wrapper;
let editorEl;

const baseProps = {
  value: '',
  inputAriaLabel: 'aria-label text',
  linkPhoneNumbers: true,
  inputClass: 'qa-editor',
};

const _mountWrapper = (props = {}) => {
  editorEl?.remove();
  wrapper = mount(DtRichTextEditor, {
    props: { ...baseProps, ...props },
    components: { EditorContent },
    attachTo: document.body,
  });
};

const _setChildWrappers = () => {
  editorEl = document.getElementsByClassName('qa-editor')[0];
};

const _setValue = async (value) => {
  editorEl.innerHTML = value;
  await wrapper.vm.$nextTick();
};

const _getPhoneLinksFromJSON = () => {
  const json = wrapper.vm.editor.getJSON();
  const links = [];
  for (const paragraph of json.content) {
    for (const textNode of (paragraph.content ?? [])) {
      if (!textNode.marks?.some(mark => mark.type === 'LinkPhoneNumbers')) continue;
      links.push(textNode);
    }
  }
  return links;
};

const _findPhoneMarkPos = (state) => {
  let pos = null;
  state.doc.descendants((node, nodePos) => {
    if (node.isText && node.marks.some(m => m.type.name === 'LinkPhoneNumbers')) {
      pos = nodePos + 1;
    }
  });
  return pos;
};

describe('LinkPhoneNumbers extension', () => {
  beforeAll(() => {
    global.Range.prototype.getClientRects = vi.fn(() => [{}]);
    global.Range.prototype.getBoundingClientRect = vi.fn(() => [{}]);
    global.scrollBy = vi.fn();
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('auto-detection', () => {
    beforeEach(async () => {
      _mountWrapper();
      await wrapper.vm.$nextTick();
      _setChildWrappers();
    });

    it('links a formatted phone number', async () => {
      await _setValue('call me at (714) 410-7035 any time!');
      const links = _getPhoneLinksFromJSON();
      expect(links).toHaveLength(1);
      expect(links[0].text).toBe('(714) 410-7035');
    });

    it('links an international phone number', async () => {
      await _setValue('reach me at +17787658813');
      const links = _getPhoneLinksFromJSON();
      expect(links).toHaveLength(1);
    });

    it('does not link a URL', async () => {
      await _setValue('check out dialpad.com it is cool');
      expect(_getPhoneLinksFromJSON()).toHaveLength(0);
    });

    it('does not link a URL whose path contains 7+ digits', async () => {
      await _setValue('check out https://example.com/7658813 it is cool');
      expect(_getPhoneLinksFromJSON()).toHaveLength(0);
    });
  });

  describe('phoneNumbers allowlist', () => {
    it('links only numbers in the allowlist', async () => {
      _mountWrapper({ linkPhoneNumbers: ['(714) 410-7035'] });
      await wrapper.vm.$nextTick();
      _setChildWrappers();
      await _setValue('call (714) 410-7035 or (800) 555-0100');
      const links = _getPhoneLinksFromJSON();
      expect(links).toHaveLength(1);
      expect(links[0].text).toBe('(714) 410-7035');
    });

    it('links no phones when given an empty array', async () => {
      _mountWrapper({ linkPhoneNumbers: [] });
      await wrapper.vm.$nextTick();
      _setChildWrappers();
      await _setValue('call me at (714) 410-7035 any time!');
      expect(_getPhoneLinksFromJSON()).toHaveLength(0);
    });
  });

  describe('phone-click event', () => {
    beforeEach(async () => {
      _mountWrapper();
      await wrapper.vm.$nextTick();
      _setChildWrappers();
    });

    it('emits phone-click when a phone number link is clicked', async () => {
      await _setValue('call me at (714) 410-7035 any time!');
      await wrapper.vm.$nextTick();

      const { state, view } = wrapper.vm.editor;
      const pos = _findPhoneMarkPos(state);
      // Invoke click handler directly — dispatchEvent does not work in JSDOM
      // because ProseMirror relies on getBoundingClientRect to resolve positions.
      view.someProp('handleClick', (fn) => fn(view, pos, new MouseEvent('click')));
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('phone-click')).toBeTruthy();
    });

    it('does not emit phone-click when no phone mark is at the clicked position', async () => {
      await _setValue('no phone here just text');
      await wrapper.vm.$nextTick();

      const { view } = wrapper.vm.editor;
      view.someProp('handleClick', (fn) => fn(view, 1, new MouseEvent('click')));
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('phone-click')).toBeFalsy();
    });
  });
});
