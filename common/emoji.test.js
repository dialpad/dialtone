import { getEmojiData, validateCustomEmojiJson } from '@/common/emoji';
import { withValidCustomEmojis, withNotAllRequiredProps, withValidUnicodeEmojis } from './custom-emoji-test.js';
import { assert } from 'chai';

describe('Emoji Tests', function () {
  describe('Validation Tests', function () {
    describe('When a custom emoji json is provided with valid emojis', function () {
      beforeEach(async function () {
        await validateCustomEmojiJson(withValidCustomEmojis);
      });
      after(function () {
        validateCustomEmojiJson('');
      });

      it('sets the custom emoji', async function () {
        const emojiData = getEmojiData();
        assert.isObject(emojiData.octocat);
      });
    });

    describe('When a custom emoji json is provided with invalid emojis', function () {
      let consoleErrorSpy;
      before(async function () {
        consoleErrorSpy = jest.spyOn(console, 'error').mockClear();
        await validateCustomEmojiJson(withNotAllRequiredProps);
      });
      after(function () {
        consoleErrorSpy = null;
        console.error.mockRestore();
        validateCustomEmojiJson('');
      });

      it('doesn\'t set the malformed custom emoji', function () {
        const emojiData = getEmojiData();
        assert.isUndefined(emojiData.notallrequiredprops);
      });

      it('should log error message', async function () {
        assert.isTrue(consoleErrorSpy.calledOnce);
      });
    });

    describe('When a custom emoji json is provided with valid Unicode emojis', function () {
      before(async function () {
        await validateCustomEmojiJson(withValidUnicodeEmojis);
      });
      after(function () {
        validateCustomEmojiJson('');
      });

      it('overwrites the property in case is a string', function () {
        // Test Setup
        const expectedShortname = ':nerdface:';
        const emojiData = getEmojiData();

        assert.strictEqual(emojiData['1f913'].shortname, expectedShortname);
      });

      it('extends the property in case is an array', function () {
        // Test Setup
        const expectedKeywords = ['confused', 'face', 'uc6', 'thinking', 'not sure', 'unknown'];
        const emojiData = getEmojiData();

        assert.lengthOf(emojiData['1f615'].keywords, 6);
        assert.deepEqual(emojiData['1f615'].keywords, expectedKeywords);
      });
    });
  });
});
