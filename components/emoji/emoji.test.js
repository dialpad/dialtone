import { mount } from '@vue/test-utils';
import DtEmoji from './emoji.vue';
import { setEmojiAssetUrlSmall, setEmojiAssetUrlLarge, setCustomEmojiUrl, setCustomEmojiJson } from '@/common/emoji.js';
import { flushPromises } from '@/common/utils.js';
import customEmojiJson from '@/common/custom-emoji.json';

setEmojiAssetUrlSmall('https://mockstorage.com/emojis/', '.png');
setEmojiAssetUrlLarge('https://mockstorage.com/emojis/', '.svg');
setCustomEmojiUrl('https://mockstorage.com/emojis/');

// Constants
const baseProps = {};

describe('DtEmoji Tests', () => {
  // Wrappers
  let wrapper;
  let emoji;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = {};

  // Expected
  const expectedSmileSrc = 'https://mockstorage.com/emojis/1f604.svg';
  const expectedSmileSrcSmall = 'https://mockstorage.com/emojis/1f604.png';
  const expectedLaughingSrc = 'https://mockstorage.com/emojis/1f606.svg';
  const expectedPointUpLight = 'https://mockstorage.com/emojis/261d-1f3fb.svg';
  const expectedShipIt = 'https://mockstorage.com/emojis/shipit.png';

  // Helpers
  const _setChildWrappers = async () => {
    emoji = await wrapper.find('img');
  };

  const _setWrappers = async () => {
    wrapper = mount(DtEmoji, {
      props,
      attrs,
      slots,
    });
    await flushPromises();
    await _setChildWrappers();
  };

  // Setup

  // Teardown
  afterEach(function () {
    props = baseProps;
    attrs = {};
    slots = {};
  });
  afterAll(() => {});

  describe('Presentation Tests', () => {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */

    describe('When a code string is passed in', () => {
      beforeEach(async () => {
        props = {
          code: ':smile:',
        };
        await _setWrappers();
      });

      it('renders the correct emoji', async () => {
        expect(emoji.attributes('src')).toBe(expectedSmileSrc);
      });
      describe('When a prop changes to a new code', () => {
        beforeEach(async () => {
          await wrapper.setProps({ code: ':laughing:' });
          await flushPromises();
          await _setChildWrappers();
        });
        it('should display the correct emoji with the new code', () => {
          expect(emoji.attributes('src')).toBe(expectedLaughingSrc);
        });
      });

      describe('When a prop changes to a new custom emoji code', () => {
        beforeEach(async () => {
          setCustomEmojiJson(customEmojiJson);
          await wrapper.setProps({ code: ':shipit:' });
          await flushPromises();
          await _setChildWrappers();
        });
        afterAll(() => {
          setCustomEmojiJson('');
        });
        it('should display the correct emoji with the new custom code', () => {
          expect(emoji.attributes('src')).toBe(expectedShipIt);
        });
      });

      describe('When a prop changes to an invalid code', () => {
        beforeEach(async () => {
          await wrapper.setProps({ code: ':invalidcode:' });
          await flushPromises();
          await _setChildWrappers();
        });
        it('should display a "not found" image', () => {
          expect(emoji.attributes('title')).toBe('Invalid Emoji');
        });
      });

      describe('When the size changes to 800', () => {
        beforeEach(async () => {
          await wrapper.setProps({ size: '800' });
        });
        it('the correct class is set on the element', () => {
          expect(emoji.classes('d-icon--size-800')).toBe(true);
        });
      });

      describe('When the size changes to 200', () => {
        beforeEach(async () => {
          await wrapper.setProps({ size: '200' });
          await flushPromises();
        });
        it('the emoji is rendered using the "small emoji" url', () => {
          expect(emoji.attributes('src')).toBe(expectedSmileSrcSmall);
        });
      });
    });

    describe('When a skin tone emoji is passed in', () => {
      beforeEach(async () => {
        props = {
          code: ':point_up_tone1:',
        };
        await _setWrappers();
      });
      it('renders the correct emoji', () => {
        expect(emoji.attributes('src')).toBe(expectedPointUpLight);
      });
    });

    describe('When an emoji unicode is passed in', () => {
      beforeEach(async () => {
        props = {
          code: '☝🏻',
        };
        await _setWrappers();
      });
      it('renders the correct emoji', () => {
        expect(emoji.attributes('src')).toBe(expectedPointUpLight);
      });
    });
  });

  describe('Accessibility Tests', () => {
    /*
     * Test(s) to ensure that the component is accessible
     */

    describe('When an emoji is rendered', () => {
      beforeEach(async () => {
        props = {
          code: ':smile:',
        };
        await _setWrappers();
      });
      it('should have aria-label describing the emoji', () => {
        expect(emoji.attributes('aria-label')).toBe('grinning face with smiling eyes');
      });
    });
  });
});
