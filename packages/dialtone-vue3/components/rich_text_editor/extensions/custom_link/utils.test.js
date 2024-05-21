import {
  getRegexMatches,
  hasValidPrefix,
  trimEndPunctiation,
  getWordAt,
  getWordAtUntil,
} from './utils';

describe('Links Utils Tests', () => {
  // Test Environment
  const numberRegex = /[0-9]+/g;

  describe('getRegexMatches', () => {
    // Test Environment
    const oneNumberInput = 'abc 1234 def';
    const oneNumberInputRes = [Object.assign(
      ['1234'], { index: 4, input: oneNumberInput, groups: undefined },
    )];
    const twoNumberInput = 'abc 1234 def 5678 ghi';
    const twoNumberInputRes = [
      Object.assign(['1234'], { index: 4, input: twoNumberInput, groups: undefined }),
      Object.assign(['5678'], { index: 13, input: twoNumberInput, groups: undefined }),
    ];

    describe('when not using a validator', () => {
      it('should return an empty array when no matches found', () => {
        expect(getRegexMatches('abc', numberRegex)).toEqual([]);
      });

      it('should return a match in an array when a match found', () => {
        expect(getRegexMatches(oneNumberInput, numberRegex)).toEqual(oneNumberInputRes);
      });

      it('should return multiple matches in an array when matches found', () => {
        expect(getRegexMatches(twoNumberInput, numberRegex)).toEqual(twoNumberInputRes);
      });
    });

    describe('when using a validator', () => {
      // Test Environment
      const isMatchLongerThan3 = (_, match) => match[0].length > 3;

      it('should return an empty array when no matches found and not valid', () => {
        expect(getRegexMatches('abc', numberRegex, isMatchLongerThan3)).toEqual([]);
      });

      it('should return an empty array when a match found but not valid', () => {
        expect(getRegexMatches('abc 123 def', numberRegex, isMatchLongerThan3)).toEqual([]);
      });

      it('should return a match array when a match found and valid', () => {
        expect(getRegexMatches(oneNumberInput, numberRegex, isMatchLongerThan3))
          .toEqual(oneNumberInputRes);
      });

      it('should return multiple matches in an array when matches and valid', () => {
        expect(getRegexMatches(twoNumberInput, numberRegex, isMatchLongerThan3))
          .toEqual(twoNumberInputRes);
      });
    });
  });

  describe('hasValidPrefix', () => {
    // Test Environment
    const charactersToTest = [['@'], ['#']];

    it.each(charactersToTest)('should return false when index has "%s" character', async (input) => {
      expect(hasValidPrefix(`not ${input}valid`, { index: 4 })).toBe(false);
    });

    it.each(charactersToTest)('should return false when index - 1 has "%s" character', async (input) => {
      expect(hasValidPrefix(`not ${input}valid`, { index: 5 })).toBe(false);
    });

    it.each(charactersToTest)('should return true when index - 2 has "%s" character', async (input) => {
      expect(hasValidPrefix(`not ${input}valid`, { index: 6 })).toBe(true);
    });

    it.each(charactersToTest)('should return true when index + 1 has "%s" character', async (input) => {
      expect(hasValidPrefix(`not ${input}valid`, { index: 3 })).toBe(true);
    });
  });

  describe('trimEndPunctiation', () => {
    // Test Environment
    const characters = ['!', '?', '.', ',', ':', ';', '\'', '"'];
    const symbolPrefixes = ['&', '&amp;'];
    const symbolCodes = ['lt', 'gt', 'quot', 'apos', 'raquo', 'laquo', 'rsaquo', 'lsaquo'];
    const symbols = symbolCodes.map(c => symbolPrefixes.map(p => p + c + ';')).flat();
    const punctuationMarks = [...characters, ...symbols].map(c => [c]);

    describe('when string does not end with a punctuation character', () => {
      it.each([
        ['hello world'],
        ['!hello world'],
        ['hello worl!d'],
        ['hello world! '],
      ])('should return original string "%s"', async (input) => {
        expect(trimEndPunctiation(input)).toBe(input);
      });
    });

    describe('when string ends with a punctuation character', () => {
      it.each(punctuationMarks)('should return trimmed string when ends with "%s"', async (input) => {
        expect(trimEndPunctiation(`hello world${input}`)).toBe('hello world');
      });
    });
  });

  describe('getWordAt', () => {
    // Test Environment
    const helloMatch = { text: 'hello', from: 0, to: 5 };
    const worldMatch = { text: 'world', from: 6, to: 11 };

    describe('when index within a word that is not at the end of string', () => {
      it('should return the word', () => {
        expect(getWordAt('hello world', 3)).toEqual(helloMatch);
      });
    });

    describe('when index within a word that is at the end of string', () => {
      it('should return the word', () => {
        expect(getWordAt('hello world', 8)).toEqual(worldMatch);
      });
    });

    describe('when index between words', () => {
      it('should return the preceding word', () => {
        expect(getWordAt('hello world', 5)).toEqual(helloMatch);
      });
    });

    describe('when index further than the length of string', () => {
      it('should return the last word', () => {
        expect(getWordAt('hello world', 5000)).toEqual(worldMatch);
      });
    });
  });

  describe('getWordAtUntil', () => {
    // Test Environment
    const exampleString = 'one two three four five';
    const oneMatch = { text: 'one', from: 0, to: 3 };
    const twoMatch = { text: 'two', from: 4, to: 7 };
    const threeMatch = { text: 'three', from: 8, to: 13 };
    const fourMatch = { text: 'four', from: 14, to: 18 };
    const fiveMatch = { text: 'five', from: 19, to: 23 };

    describe('when word does not match regex', () => {
      describe('when direction is "left"', () => {
        it('should return the word at index', () => {
          expect(getWordAtUntil(exampleString, 10, 'left', numberRegex))
            .toEqual(threeMatch);
        });
      });

      describe('when direction is "right"', () => {
        it('should return the word at index', () => {
          expect(getWordAtUntil(exampleString, 10, 'right', numberRegex))
            .toEqual(threeMatch);
        });
      });
    });

    describe('when word does match regex', () => {
      describe('when direction is "left"', () => {
        describe('when does not have matching word to the left', () => {
          it('should return the word immediately left to the matching word', () => {
            expect(getWordAtUntil('one two 33333 four five', 10, 'left', numberRegex))
              .toEqual(twoMatch);
          });
        });

        describe('when has matching word(s) to the left', () => {
          it('should return the first non-matching word to the left', () => {
            expect(getWordAtUntil('one two 33333 444 5555', 20, 'left', numberRegex))
              .toEqual(twoMatch);
          });
        });

        describe('when word is at the beginning of the string', () => {
          it('should return the first word', () => {
            expect(getWordAtUntil(exampleString, 3, 'left', /one/g))
              .toEqual(oneMatch);
          });
        });
      });

      describe('when direction is "right"', () => {
        describe('when does not have matching word to the right', () => {
          it('should return the word immediately right from the matching word', () => {
            expect(getWordAtUntil('one two 33333 four five', 10, 'right', numberRegex))
              .toEqual(fourMatch);
          });
        });

        describe('when has matching word(s) to the right', () => {
          it('should return the first non-matching word to the right', () => {
            expect(getWordAtUntil('111 2222 3333 four five', 1, 'right', numberRegex))
              .toEqual(fourMatch);
          });
        });

        describe('when word is at the end of the string', () => {
          it('should return the last word', () => {
            expect(getWordAtUntil(exampleString, 20, 'right', /five/g))
              .toEqual(fiveMatch);
          });
        });
      });

      describe('when given a dumb regex', () => {
        const dumbRegex = /(.*)/g;
        const everythingMatch = { text: 'everything', from: 0, to: 10 };

        it('should return the matching word without blowing up when direction is left', () => {
          expect(getWordAtUntil(everythingMatch.text, 3, 'left', dumbRegex))
            .toEqual(everythingMatch);
        });

        it('should return the matching word without blowing up when direction is right', () => {
          expect(getWordAtUntil(everythingMatch.text, 3, 'right', dumbRegex))
            .toEqual(everythingMatch);
        });
      });
    });
  });
});
