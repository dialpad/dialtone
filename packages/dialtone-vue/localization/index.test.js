import { DialtoneLocalization } from './index';

describe('DialtoneLocalization Tests', () => {
  const localeManagerStorageKey = 'user-locale';

  afterEach(() => {
    window.localStorage.removeItem(localeManagerStorageKey);
    vi.unstubAllGlobals();
  });

  describe('getPreferredLocale', () => {
    it('returns the stored locale when it is supported', () => {
      window.localStorage.setItem(localeManagerStorageKey, 'fr-FR');

      expect(DialtoneLocalization.getPreferredLocale()).toBe('fr-FR');
    });

    it('falls back to English when the stored locale is not supported by Dialtone', () => {
      window.localStorage.setItem(localeManagerStorageKey, 'ko-KR');
      vi.stubGlobal('navigator', { language: 'ko-KR' });

      expect(DialtoneLocalization.getPreferredLocale()).toBe('en-US');
    });

    it('falls back to the navigator language when no stored locale is supported', () => {
      window.localStorage.setItem(localeManagerStorageKey, 'ko-KR');
      vi.stubGlobal('navigator', { language: 'de-DE' });

      expect(DialtoneLocalization.getPreferredLocale()).toBe('de-DE');
    });
  });
});
