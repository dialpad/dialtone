import { mount } from '@vue/test-utils';
import DtEmojiTextWrapper from './emoji_text_wrapper.vue';
import { setCustomEmojiJson, setCustomEmojiUrl, setEmojiAssetUrlLarge } from '@/common/emoji.js';
import customEmojiJson from '@/common/custom-emoji.json';

setEmojiAssetUrlLarge('https://mockstorage.com/emojis/', '.svg');
setCustomEmojiUrl('https://mockstorage.com/emojis/');

const MOCK_EXPECTED_SMILE_SRC = 'https://mockstorage.com/emojis/1f604.svg';
const MOCK_EXPECTED_OCTOCAT_SRC = 'https://mockstorage.com/emojis/octocat.png';

const baseProps = {};
const baseSlots = {};

let mockProps = {};
let mockSlots = {};

describe('DtEmojiTextWrapper Tests', () => {
  let wrapper;
  let emoji;

  const updateWrapper = () => {
    wrapper = mount(DtEmojiTextWrapper, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
    });

    emoji = wrapper.find('img');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When default slot is provided', () => {
      describe('When default slot does not contains shortcode or unicode emoji', () => {
        beforeEach(() => {
          mockSlots = { default: 'Content without emoji.' };

          updateWrapper();
        });

        it('Renders the text correctly', () => {
          expect(wrapper.text()).toBe(mockSlots.default);
        });

        it('Does not contain emoji component', () => {
          expect(emoji.exists()).toBe(false);
        });
      });

      describe('When default slot contains shortcodes', () => {
        describe('When default slot contains valid shortcode', () => {
          beforeEach(() => {
            mockSlots = { default: 'Content with :smile: emoji.' };

            updateWrapper();
          });

          it('Contains emoji component', () => {
            expect(emoji.exists()).toBe(true);
          });

          it('Renders the correct emoji', () => {
            expect(emoji.attributes('src')).toBe(MOCK_EXPECTED_SMILE_SRC);
          });
        });

        describe('When default slot contains valid custom shortcode', () => {
          beforeEach(() => {
            setCustomEmojiJson(customEmojiJson);

            mockSlots = { default: 'Content with :octocat: emoji.' };

            updateWrapper();
          });
          afterAll(() => {
            setCustomEmojiJson('');
          });

          it('Contains emoji component', () => {
            expect(emoji.exists()).toBe(true);
          });

          it('Renders the correct emoji', () => {
            expect(emoji.attributes('src')).toBe(MOCK_EXPECTED_OCTOCAT_SRC);
          });
        });

        describe('When default slot contains text with a colon and a valid emoji', () => {
          beforeEach(() => {
            mockSlots = { default: 'This is a smile emoji: :smile:' };

            updateWrapper();
          });

          it('Contains emoji component', () => {
            expect(emoji.exists()).toBe(true);
          });

          it('Renders the correct emoji', () => {
            expect(emoji.attributes('src')).toBe(MOCK_EXPECTED_SMILE_SRC);
          });
        });

        describe('When default slot contains invalid shortcode', () => {
          beforeEach(() => {
            mockSlots = { default: 'Content with :invalid: emoji.' };

            updateWrapper();
          });

          it('Renders text only', () => {
            expect(wrapper.text()).toBe(mockSlots.default);
          });

          it('Does not contain emoji component', () => {
            expect(emoji.exists()).toBe(false);
          });
        });
      });

      describe('When default slot contains unicode emoji', () => {
        describe('When default slot contains valid unicode emoji', () => {
          beforeEach(() => {
            mockSlots = { default: 'Content with valid 😄 emoji.' };

            updateWrapper();
          });

          it('Contains emoji component', () => {
            expect(emoji.exists()).toBe(true);
          });

          it('Renders the correct emoji', () => {
            expect(emoji.attributes('src')).toBe(MOCK_EXPECTED_SMILE_SRC);
          });
        });

        describe('When default slot contains invalid unicode emoji', () => {
          beforeEach(() => {
            mockSlots = { default: 'Content with invalid 🫡 emoji.' };

            updateWrapper();
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
      it('Is empty', () => {
        expect(wrapper.text()).toBe('');
      });
    });
  });
});
