import DtProse from './prose.vue';
import { mount } from '@vue/test-utils';

const PROSE_SELECTOR = '[data-qa="dt-prose"]';

let wrapper;

const _setWrapper = (props = {}, attrs = {}, slots = {}) => {
  wrapper = mount(DtProse, {
    props,
    attrs,
    slots,
  });
};

describe('DtProse Tests', () => {
  afterEach(() => {
    wrapper?.unmount();
    vi.restoreAllMocks();
  });

  describe('Presentation Tests', () => {
    it('Should render the dt-prose wrapper', () => {
      _setWrapper();

      const prose = wrapper.find(PROSE_SELECTOR);

      expect(prose.exists()).toBe(true);
      expect(prose.element.tagName).toBe('DIV');
      expect(prose.classes()).toContain('d-prose');
    });

    it('Should render slot content inside the wrapper', () => {
      _setWrapper({}, {}, {
        default: '<p>Hello world</p>',
      });

      const prose = wrapper.find(PROSE_SELECTOR);

      expect(prose.find('p').text()).toBe('Hello world');
    });
  });

  describe('Validation — Disallowed Elements', () => {
    it('Should console.error when slot contains <form>', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      _setWrapper({}, {}, {
        default: '<form><div>form content</div></form>',
      });

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('<form> is not allowed'),
      );
    });

    it('Should console.error when slot contains <input>', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      _setWrapper({}, {}, {
        default: '<div><input type="text"></div>',
      });

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('<input> is not allowed'),
      );
    });

    it('Should console.error when slot contains <select>', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      _setWrapper({}, {}, {
        default: '<div><select><option>A</option></select></div>',
      });

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('<select> is not allowed'),
      );
    });

    it('Should console.error when slot contains <textarea>', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      _setWrapper({}, {}, {
        default: '<div><textarea></textarea></div>',
      });

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('<textarea> is not allowed'),
      );
    });

    it('Should console.error when slot contains <button>', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      _setWrapper({}, {}, {
        default: '<div><button>Click</button></div>',
      });

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('<button> is not allowed'),
      );
    });

    it('Should not error for <input type="checkbox"> inside <li> (task list)', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      _setWrapper({}, {}, {
        default: '<ul><li><input type="checkbox" checked> Task item</li></ul>',
      });

      expect(consoleError).not.toHaveBeenCalled();
    });

    it('Should console.error when slot contains a custom element', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      _setWrapper({}, {}, {
        default: '<div><my-component>content</my-component></div>',
      });

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('<my-component> is not allowed'),
      );
    });

    it('Should re-validate when content changes after mount', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const SlotWrapper = {
        components: { DtProse },
        template: '<dt-prose><div v-html="content" /></dt-prose>',
        data () { return { content: '<p>Clean</p>' }; },
      };

      wrapper = mount(SlotWrapper);
      expect(consoleError).not.toHaveBeenCalled();

      await wrapper.setData({ content: '<form>injected</form>' });

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('<form> is not allowed'),
      );
    });
  });

  describe('Validation — Attribute Stripping', () => {
    it('Should strip class and style from inner elements', () => {
      _setWrapper({}, {}, {
        default: '<p class="foo" style="color: red;">text</p>',
      });

      const p = wrapper.find('p');

      expect(p.element.hasAttribute('class')).toBe(false);
      expect(p.element.hasAttribute('style')).toBe(false);
    });

    it('Should preserve href on <a>', () => {
      _setWrapper({}, {}, {
        default: '<a href="https://example.com" class="link">link</a>',
      });

      const a = wrapper.find('a');

      expect(a.element.getAttribute('href')).toBe('https://example.com');
      expect(a.element.hasAttribute('class')).toBe(false);
    });

    it('Should preserve src and alt on <img>', () => {
      _setWrapper({}, {}, {
        default: '<img src="image.png" alt="desc" class="img-class">',
      });

      const img = wrapper.find('img');

      expect(img.element.getAttribute('src')).toBe('image.png');
      expect(img.element.getAttribute('alt')).toBe('desc');
      expect(img.element.hasAttribute('class')).toBe(false);
    });

    it('Should preserve scope on <th>', () => {
      _setWrapper({}, {}, {
        default: '<table><thead><tr><th scope="col" class="header">Name</th></tr></thead></table>',
      });

      const th = wrapper.find('th');

      expect(th.element.getAttribute('scope')).toBe('col');
      expect(th.element.hasAttribute('class')).toBe(false);
    });

    it('Should strip data-* attributes', () => {
      _setWrapper({}, {}, {
        default: '<p data-testid="test" data-custom="val">text</p>',
      });

      const p = wrapper.find('p');

      expect(p.element.hasAttribute('data-testid')).toBe(false);
      expect(p.element.hasAttribute('data-custom')).toBe(false);
    });
  });

  describe('Accessibility Tests', () => {
    it('Should render as a div with no implicit role', () => {
      _setWrapper();

      const prose = wrapper.find(PROSE_SELECTOR);

      expect(prose.element.tagName).toBe('DIV');
      expect(prose.element.hasAttribute('role')).toBe(false);
    });
  });
});
