import { mount } from '@vue/test-utils';
import DtEmojiTextWrapper from './emoji_text_wrapper.vue';
import { setCustomEmojiJson, setCustomEmojiUrl, setEmojiAssetUrlLarge } from '@/common/emoji.js';
import { flushPromises } from '@/common/utils.js';
import customEmojiJson from '@/common/custom-emoji.json';

setEmojiAssetUrlLarge('https://mockstorage.com/emojis/', '.svg');
setCustomEmojiUrl('https://mockstorage.com/emojis/');

// Constants
const baseProps = {};

describe('DtEmojiTextWrapper Tests', () => {
  // Wrappers
  let wrapper;
  let emoji;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = {};

  // Expected
  const expectedSmileSrc = 'https://mockstorage.com/emojis/1f604.svg';
  const expectedOctocatSrc = 'https://mockstorage.com/emojis/octocat.png';

  // Helpers
  const _setChildWrappers = async () => {
    emoji = await wrapper.find('img');
  };

  const _setWrappers = async () => {
    wrapper = mount(DtEmojiTextWrapper, {
      props,
      attrs,
      slots,
    });
    await flushPromises();
    await _setChildWrappers();
  };

  // Teardown
  afterEach(function () {
    props = baseProps;
    attrs = {};
    slots = {};
  });
  afterAll(() => {});

  describe('Presentation Tests', () => {
    describe('When default slot is provided', () => {
      describe('When default slot does not contains shortcode or unicode emoji', () => {
        beforeEach(async () => {
          slots = { default: 'Content without emoji.' };
          await _setWrappers();
        });

        it('Renders the text correctly', () => {
          expect(wrapper.text()).toBe(slots.default);
        });

        it('Does not contain emoji component', () => {
          expect(emoji.exists()).toBe(false);
        });
      });
      describe('When default slot contains shortcodes', () => {
        describe('When default slot contains valid shortcode', () => {
          beforeEach(async () => {
            slots = { default: 'Content with :smile: emoji.' };
            await _setWrappers();
          });

          it('Contains emoji component', () => {
            expect(emoji.exists()).toBe(true);
          });

          it('Renders the correct emoji', () => {
            expect(emoji.attributes('src')).toBe(expectedSmileSrc);
          });
        });
        describe('When default slot contains valid custom shortcode', () => {
          beforeEach(async () => {
            setCustomEmojiJson(customEmojiJson);
            slots = { default: 'Content with :octocat: emoji.' };
            await _setWrappers();
          });
          afterAll(() => {
            setCustomEmojiJson('');
          });

          it('Contains emoji component', () => {
            expect(emoji.exists()).toBe(true);
          });

          it('Renders the correct emoji', () => {
            expect(emoji.attributes('src')).toBe(expectedOctocatSrc);
          });
        });
        describe('When default slot contains text with a colon and a valid emoji', () => {
          beforeEach(async () => {
            slots = { default: 'This is a smile emoji: :smile:' };
            await _setWrappers();
          });

          it('Contains emoji component', () => {
            expect(emoji.exists()).toBe(true);
          });

          it('Renders the correct emoji', () => {
            expect(emoji.attributes('src')).toBe(expectedSmileSrc);
          });
        });
        describe('When default slot contains invalid shortcode', () => {
          beforeEach(async () => {
            slots = { default: 'Content with :invalid: emoji.' };
            await _setWrappers();
          });

          it('Renders text only', () => {
            expect(wrapper.text()).toBe(slots.default);
          });

          it('Does not contain emoji component', () => {
            expect(emoji.exists()).toBe(false);
          });
        });
      });
      describe('When default slot contains unicode emoji', () => {
        describe('When default slot contains valid unicode emoji', () => {
          beforeEach(async () => {
            slots = { default: 'Content with valid 😄 emoji.' };
            await _setWrappers();
          });

          it('Contains emoji component', () => {
            expect(emoji.exists()).toBe(true);
          });

          it('Renders the correct emoji', () => {
            expect(emoji.attributes('src')).toBe(expectedSmileSrc);
          });
        });
        describe('When default slot contains invalid unicode emoji', () => {
          beforeEach(async () => {
            slots = { default: 'Content with invalid 🫡 emoji.' };
            await _setWrappers();
          });

          it('Contains emoji component', () => {
            expect(emoji.exists()).toBe(true);
          });

          it('Renders the invalid emoji image', () => {
            expect(emoji.attributes('src')).toBe('invalid');
          });
        });
      });
    });
    describe('When default slot is not provided', () => {
      beforeEach(async () => {
        await _setWrappers();
      });

      it('Is empty', () => {
        expect(wrapper.text()).toBe('');
      });
    });
  });
});
