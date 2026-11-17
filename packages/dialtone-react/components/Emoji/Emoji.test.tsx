import { cleanup, render, screen } from '@testing-library/react';
import { DtEmoji, type DtEmojiProps } from './Emoji';
import {
  setEmojiAssetUrlSmall,
  setEmojiAssetUrlLarge,
  setCustomEmojiUrl,
  setCustomEmojiJson,
  getEmojiData,
} from '../../common/emoji';
import customEmojiJson from '../../common/custom-emoji.json';

setEmojiAssetUrlSmall('https://mockstorage.com/emojis/', '.png');
setEmojiAssetUrlLarge('https://mockstorage.com/emojis/', '.svg');
setCustomEmojiUrl('https://mockstorage.com/emojis/');

const MOCK_EXPECTED_SMILE_SRC = 'https://mockstorage.com/emojis/1f604.svg';
const MOCK_EXPECTED_SMILE_SRC_SMALL = 'https://mockstorage.com/emojis/1f604.png';
const MOCK_EXPECTED_LAUGHING_SRC = 'https://mockstorage.com/emojis/1f606.svg';
const MOCK_EXPECTED_POINT_UP_LIGHT = 'https://mockstorage.com/emojis/261d-1f3fb.svg';
const MOCK_EXPECTED_BABY_YODA = 'https://storage.googleapis.com/uv-beta_custom_emojis/5646620347596800/baby_yoda';

const baseProps: DtEmojiProps = { code: '' };

let mockProps: Partial<DtEmojiProps> = {};

describe('DtEmoji Tests', () => {
  let root: HTMLElement;
  let emoji: HTMLElement;
  let setProps: (props: Partial<DtEmojiProps>) => void;

  const updateWrapper = () => {
    // A fresh mount, as Vue's mount() is: the previous render goes first.
    cleanup();
    const result = render(<DtEmoji {...baseProps} {...mockProps} />);
    setProps = (props) => {
      mockProps = { ...mockProps, ...props };
      result.rerender(<DtEmoji {...baseProps} {...mockProps} />);
    };

    root = screen.getByTestId('dt-emoji');
    emoji = screen.getByTestId('dt-emoji-image');
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
        expect(root).toHaveAttribute('data-qa', 'dt-emoji');
        expect(emoji).toHaveAttribute('src', MOCK_EXPECTED_SMILE_SRC);
      });

      describe('When a prop changes to a new code', () => {
        it('should display the correct emoji with the new code', () => {
          mockProps = { code: ':laughing:' };

          updateWrapper();

          expect(emoji).toHaveAttribute('src', MOCK_EXPECTED_LAUGHING_SRC);
        });
      });

      describe('When a prop changes to a new custom emoji code', () => {
        it('should display the correct emoji with the new custom code', () => {
          setCustomEmojiJson(customEmojiJson);

          setProps({ code: ':baby_yoda:' });

          expect(emoji).toHaveAttribute('src', MOCK_EXPECTED_BABY_YODA);

          setCustomEmojiJson('');
        });
      });

      describe('When a prop changes to an invalid code', () => {
        it('should display a "not found" image', () => {
          setProps({ code: ':invalidcode:' });

          expect(emoji).toHaveAttribute('title', 'Invalid Emoji');
        });
      });

      describe('When the size changes to 800', () => {
        it('the correct class is set on the element', () => {
          setProps({ size: '800' });

          expect(emoji).toHaveClass('d-icon--size-800');
        });
      });

      describe('When the size changes to 200', () => {
        it('the emoji is rendered using the "small emoji" url', () => {
          setProps({ size: '200' });

          expect(emoji).toHaveAttribute('src', MOCK_EXPECTED_SMILE_SRC_SMALL);
        });
      });
    });

    describe('When a skin tone emoji is passed in', () => {
      it('renders the correct emoji', () => {
        mockProps = { code: ':point_up_tone1:' };

        updateWrapper();

        expect(emoji).toHaveAttribute('src', MOCK_EXPECTED_POINT_UP_LIGHT);
      });
    });

    describe('When an emoji unicode is passed in', () => {
      it('renders the correct emoji', () => {
        mockProps = { code: '☝🏻' };

        updateWrapper();

        expect(emoji).toHaveAttribute('src', MOCK_EXPECTED_POINT_UP_LIGHT);
      });
    });
  });

  describe('Custom emoji json from outside (React-only)', () => {
    it('does not pollute Object.prototype or the emoji data through its keys', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const hostile = JSON.parse(
        '{"__proto__":{"polluted":"yes"},"constructor":{"custom":true},"1f604":{"__proto__":{"polluted":"yes"}}}',
      );

      setCustomEmojiJson(hostile);

      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
      expect(Object.getPrototypeOf(getEmojiData())).toBe(Object.prototype);
      expect(Object.getPrototypeOf(getEmojiData()['1f604'])).toBe(Object.prototype);
      expect(Object.hasOwn(getEmojiData(), 'constructor')).toBe(false);
      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
    });

    it('rejects entries with malformed fields, so lookups keep working', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const valid = {
        name: 'x', unicode_output: 'x', image: 'x', custom: true, date_added: 1,
        shortname: ':x:', shortname_alternates: [],
      };

      setCustomEmojiJson({
        badalts: { ...valid, shortname: ':badalts:', shortname_alternates: null },
        badname: { ...valid, shortname: 7 },
        shortname: { ...valid, shortname: ':catalogkey:' },
      });

      expect(Object.hasOwn(getEmojiData(), 'badalts')).toBe(false);
      expect(Object.hasOwn(getEmojiData(), 'badname')).toBe(false);

      setProps({ code: ':invalidcode:' });
      expect(emoji).toHaveAttribute('title', 'Invalid Emoji');

      delete (getEmojiData() as Record<string, unknown>).shortname;
      errorSpy.mockRestore();
    });
  });

  describe('Accessibility Tests', () => {
    describe('When an emoji is rendered', () => {
      it('should have aria-label describing the emoji', () => {
        mockProps = { code: ':smile:' };

        updateWrapper();

        expect(emoji).toHaveAttribute('aria-label', 'grinning face with smiling eyes');
      });
    });
  });
});
