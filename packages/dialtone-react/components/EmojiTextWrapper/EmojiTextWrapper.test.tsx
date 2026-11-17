import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { DtEmojiTextWrapper, type DtEmojiTextWrapperProps } from './EmojiTextWrapper';
import { setCustomEmojiJson, setCustomEmojiUrl, setEmojiAssetUrlLarge } from '../../common/emoji';
import customEmojiJson from '../../common/custom-emoji.json';

setEmojiAssetUrlLarge('https://mockstorage.com/emojis/', '.svg');
setCustomEmojiUrl('https://mockstorage.com/emojis/');

const MOCK_EXPECTED_SMILE_SRC = 'https://mockstorage.com/emojis/1f604.svg';
const MOCK_EXPECTED_BABY_YODA_SRC = 'https://storage.googleapis.com/uv-beta_custom_emojis/5646620347596800/baby_yoda';

const baseProps: DtEmojiTextWrapperProps = {};

let mockProps: DtEmojiTextWrapperProps = {};
let mockSlots: { default?: ReactNode } = {};

describe('DtEmojiTextWrapper Tests', () => {
  let wrapper: HTMLElement;
  let emoji: HTMLElement | null;

  const updateWrapper = () => {
    // A fresh mount, as Vue's mount() is: the previous render goes first.
    cleanup();
    render(<DtEmojiTextWrapper {...baseProps} {...mockProps}>{mockSlots.default}</DtEmojiTextWrapper>);

    wrapper = screen.getByTestId('emoji-text-wrapper');
    emoji = wrapper.querySelector('img');
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
          expect(wrapper.textContent).toBe(mockSlots.default);
        });

        it('Does not contain emoji component', () => {
          expect(emoji).not.toBeInTheDocument();
        });
      });

      describe('When default slot contains shortcodes', () => {
        describe('When default slot contains valid shortcode', () => {
          beforeEach(() => {
            mockSlots = { default: 'Content with :smile: emoji.' };

            updateWrapper();
          });

          it('Contains emoji component', () => {
            expect(emoji).toBeInTheDocument();
          });

          it('Renders the correct emoji', () => {
            expect(emoji).toHaveAttribute('src', MOCK_EXPECTED_SMILE_SRC);
          });
        });

        describe('When default slot contains valid custom shortcode', () => {
          beforeEach(() => {
            setCustomEmojiJson(customEmojiJson);

            mockSlots = { default: 'Content with :baby_yoda: emoji.' };

            updateWrapper();
          });
          afterAll(() => {
            setCustomEmojiJson('');
          });

          it('Contains emoji component', () => {
            expect(emoji).toBeInTheDocument();
          });

          it('Renders the correct emoji', () => {
            expect(emoji).toHaveAttribute('src', MOCK_EXPECTED_BABY_YODA_SRC);
          });
        });

        describe('When default slot contains text with a colon and a valid emoji', () => {
          beforeEach(() => {
            mockSlots = { default: 'This is a smile emoji: :smile:' };

            updateWrapper();
          });

          it('Contains emoji component', () => {
            expect(emoji).toBeInTheDocument();
          });

          it('Renders the correct emoji', () => {
            expect(emoji).toHaveAttribute('src', MOCK_EXPECTED_SMILE_SRC);
          });
        });

        describe('When default slot contains invalid shortcode', () => {
          beforeEach(() => {
            mockSlots = { default: 'Content with :invalid: emoji.' };

            updateWrapper();
          });

          it('Renders text only', () => {
            expect(wrapper.textContent).toBe(mockSlots.default);
          });

          it('Does not contain emoji component', () => {
            expect(emoji).not.toBeInTheDocument();
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
            expect(emoji).toBeInTheDocument();
          });

          it('Renders the correct emoji', () => {
            expect(emoji).toHaveAttribute('src', MOCK_EXPECTED_SMILE_SRC);
          });
        });
      });

      describe('When default slot contains html', () => {
        beforeEach(() => {
          // JSX can't hold an HTML comment, so `slightly` is a JSX comment: it renders nothing, as Vue's does.
          mockSlots = {
            default: (
              <>
                this <strong>noun</strong> being <em>bolded :star_struck:</em> is {/* slightly */} impressive!
              </>
            ),
          };

          updateWrapper();
        });

        it('Contains emoji component', () => {
          expect(emoji).toBeInTheDocument();
        });

        it('Does not render comments as text', () => {
          expect(wrapper.textContent).not.toContain('slightly');
          // The emoji sits inside the <em>, so the search went into the nested element.
          expect(wrapper.querySelector('em img')).toBeInTheDocument();
          expect(wrapper.querySelector('strong')).toHaveTextContent('noun');
        });
      });
    });

    describe('When default slot is not provided', () => {
      it('Is empty', () => {
        expect(wrapper.textContent).toBe('');
      });
    });
  });
});
