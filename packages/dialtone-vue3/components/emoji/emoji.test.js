import { mount } from '@vue/test-utils';
import DtEmoji from './emoji.vue';
import { setEmojiAssetUrlSmall, setEmojiAssetUrlLarge, setCustomEmojiUrl, setCustomEmojiJson } from '@/common/emoji.js';
import customEmojiJson from '@/common/custom-emoji.json';

setEmojiAssetUrlSmall('https://mockstorage.com/emojis/', '.png');
setEmojiAssetUrlLarge('https://mockstorage.com/emojis/', '.svg');
setCustomEmojiUrl('https://mockstorage.com/emojis/');

const MOCK_EXPECTED_SMILE_SRC = 'https://mockstorage.com/emojis/1f604.svg';
const MOCK_EXPECTED_SMILE_SRC_SMALL = 'https://mockstorage.com/emojis/1f604.png';
const MOCK_EXPECTED_LAUGHING_SRC = 'https://mockstorage.com/emojis/1f606.svg';
const MOCK_EXPECTED_POINT_UP_LIGHT = 'https://mockstorage.com/emojis/261d-1f3fb.svg';
const MOCK_EXPECTED_SHIP_IT = 'https://mockstorage.com/emojis/shipit.png';

const baseProps = { code: '' };

let mockProps = {};

describe('DtEmoji Tests', () => {
  let wrapper;
  let emoji;

  const updateWrapper = () => {
    wrapper = mount(DtEmoji, {
      props: { ...baseProps, ...mockProps },
    });

    emoji = wrapper.find('img');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    describe('When a code string is passed in', () => {
      beforeEach(() => {
        mockProps = { code: ':smile:' };

        updateWrapper();
      });

      it('renders the correct emoji', () => {
        expect(emoji.attributes('src')).toBe(MOCK_EXPECTED_SMILE_SRC);
      });

      describe('When a prop changes to a new code', () => {
        it('should display the correct emoji with the new code', () => {
          mockProps = { code: ':laughing:' };

          updateWrapper();

          expect(emoji.attributes('src')).toBe(MOCK_EXPECTED_LAUGHING_SRC);
        });
      });

      describe('When a prop changes to a new custom emoji code', () => {
        it('should display the correct emoji with the new custom code', async () => {
          setCustomEmojiJson(customEmojiJson);

          await wrapper.setProps({ code: ':shipit:' });

          expect(emoji.attributes('src')).toBe(MOCK_EXPECTED_SHIP_IT);

          setCustomEmojiJson('');
        });
      });

      describe('When a prop changes to an invalid code', () => {
        it('should display a "not found" image', async () => {
          await wrapper.setProps({ code: ':invalidcode:' });

          expect(emoji.attributes('title')).toBe('Invalid Emoji');
        });
      });

      describe('When the size changes to 800', () => {
        it('the correct class is set on the element', async () => {
          await wrapper.setProps({ size: '800' });

          expect(emoji.classes('d-icon--size-800')).toBe(true);
        });
      });

      describe('When the size changes to 200', () => {
        it('the emoji is rendered using the "small emoji" url', async () => {
          await wrapper.setProps({ size: '200' });

          expect(emoji.attributes('src')).toBe(MOCK_EXPECTED_SMILE_SRC_SMALL);
        });
      });
    });

    describe('When a skin tone emoji is passed in', () => {
      it('renders the correct emoji', () => {
        mockProps = { code: ':point_up_tone1:' };

        updateWrapper();

        expect(emoji.attributes('src')).toBe(MOCK_EXPECTED_POINT_UP_LIGHT);
      });
    });

    describe('When an emoji unicode is passed in', () => {
      it('renders the correct emoji', () => {
        mockProps = { code: '☝🏻' };

        updateWrapper();

        expect(emoji.attributes('src')).toBe(MOCK_EXPECTED_POINT_UP_LIGHT);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When an emoji is rendered', () => {
      it('should have aria-label describing the emoji', () => {
        mockProps = { code: ':smile:' };

        updateWrapper();

        expect(emoji.attributes('aria-label')).toBe('grinning face with smiling eyes');
      });
    });
  });
});
