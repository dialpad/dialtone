import { mount } from '@vue/test-utils';
import { DtRichTextEditor } from '@/components/rich_text_editor';
import { EditorContent } from '@tiptap/vue-3';

let wrapper;

const PHONE_NUMBER = '(714) 410-7035';

const baseProps = {
  modelValue: '',
  inputAriaLabel: 'aria-label text',
  linkPhoneNumbers: [PHONE_NUMBER],
  inputClass: 'qa-editor',
};

const _mountWrapper = (props = {}) => {
  wrapper = mount(DtRichTextEditor, {
    props: { ...baseProps, ...props },
    components: { EditorContent },
    attachTo: document.body,
  });
};

const _setValue = async (value) => {
  await wrapper.setProps({ modelValue: value });
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

  beforeEach(() => {
    _mountWrapper();
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('exact-match linking', () => {
    it('links a number in the phoneNumbers list', async () => {
      await _setValue(`call me at ${PHONE_NUMBER} any time!`);
      const links = _getPhoneLinksFromJSON();
      expect(links).toHaveLength(1);
      expect(links[0].text).toBe(PHONE_NUMBER);
    });

    it('does not link a number not in the phoneNumbers list', async () => {
      await _setValue('call me at (800) 555-0100 any time!');
      expect(_getPhoneLinksFromJSON()).toHaveLength(0);
    });

    it('links multiple occurrences of the same number', async () => {
      await _setValue(`${PHONE_NUMBER} or ${PHONE_NUMBER}`);
      expect(_getPhoneLinksFromJSON()).toHaveLength(2);
    });

    it('does not link plain text with no matching number', async () => {
      await _setValue('check out dialpad.com it is cool');
      expect(_getPhoneLinksFromJSON()).toHaveLength(0);
    });
  });

  describe('when linkPhoneNumbers is an empty array', () => {
    it('links nothing', async () => {
      _mountWrapper({ linkPhoneNumbers: [] });
      await _setValue(`call me at ${PHONE_NUMBER} any time!`);
      expect(_getPhoneLinksFromJSON()).toHaveLength(0);
    });
  });

  describe('when linkPhoneNumbers prop changes', () => {
    it('applies marks when the prop is updated after content is set', async () => {
      _mountWrapper({ linkPhoneNumbers: [] });
      await _setValue(`call me at ${PHONE_NUMBER} any time!`);
      expect(_getPhoneLinksFromJSON()).toHaveLength(0);

      await wrapper.setProps({ linkPhoneNumbers: [PHONE_NUMBER] });
      await wrapper.vm.$nextTick();
      expect(_getPhoneLinksFromJSON()).toHaveLength(1);
    });
  });

  describe('phone-click event', () => {
    it('emits phone-click when a phone number link is clicked', async () => {
      await _setValue(`call me at ${PHONE_NUMBER} any time!`);
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
