import { getEmojiData, validateCustomEmojiJson, unicodeToString } from '@/common/emoji';
import { withValidCustomEmojis, withNotAllRequiredProps, withValidUnicodeEmojis } from './custom-emoji-test.js';

describe('Emoji Tests', () => {
  describe('Validation Tests', () => {
    describe('When a unicode emoji is passed in to unicodeToString that starts with 00', () => {
      it('The preceding 0s should be included in the returned value', async () => {
        const result = unicodeToString('1️⃣');
        expect(result).toBe('0031-20e3');
      });
    });

    describe('When a custom emoji json is provided with valid emojis', () => {
      beforeEach(async () => {
        await validateCustomEmojiJson(withValidCustomEmojis);
      });
      afterAll(() => {
        validateCustomEmojiJson('');
      });

      it('sets the custom emoji', async () => {
        const emojiData = getEmojiData();
        expect(typeof emojiData.octocat).toBe('object');
      });
    });

    describe('When a custom emoji json is provided with invalid emojis', () => {
      let consoleErrorSpy;
      beforeAll(async () => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockClear();
        await validateCustomEmojiJson(withNotAllRequiredProps);
      });
      afterAll(() => {
        consoleErrorSpy = null;
        console.error.mockRestore();
        validateCustomEmojiJson('');
      });

      it('doesn\'t set the malformed custom emoji', () => {
        const emojiData = getEmojiData();
        expect(emojiData.notallrequiredprops).toBeUndefined();
      });

      it('should log error message', async () => {
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('When a custom emoji json is provided with valid Unicode emojis', () => {
      beforeAll(async () => {
        await validateCustomEmojiJson(withValidUnicodeEmojis);
      });
      afterAll(() => {
        validateCustomEmojiJson('');
      });

      it('overwrites the property in case is a string', () => {
        // Test Setup
        const expectedShortname = ':nerdface:';
        const emojiData = getEmojiData();

        expect(emojiData['1f913'].shortname).toBe(expectedShortname);
      });

      it('extends the property in case is an array', () => {
        // Test Setup
        const expectedKeywords = ['confused', 'face', 'uc6', 'thinking', 'not sure', 'unknown'];
        const emojiData = getEmojiData();

        expect(emojiData['1f615'].keywords.length).toBe(6);
        expect(emojiData['1f615'].keywords).toEqual(expectedKeywords);
      });
    });
  });
});
