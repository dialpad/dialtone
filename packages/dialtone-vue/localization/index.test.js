import { DialtoneLocalization } from './index';

describe('DialtoneLocalization Tests', () => {
  const localeManagerStorageKey = 'user-locale';

  afterEach(() => {
    window.localStorage.removeItem(localeManagerStorageKey);
    vi.unstubAllGlobals();
  });

  describe('getPreferredLocale', () => {
    it.each(['access', 'read'])('falls back to English when storage %s throws', failure => {
      const storage = failure === 'access'
        ? vi.spyOn(window, 'localStorage', 'get')
        : vi.spyOn(Storage.prototype, 'getItem');
      storage.mockImplementation(() => {
        throw new DOMException('Storage is blocked', 'SecurityError');
      });

      try {
        expect(DialtoneLocalization.getPreferredLocale()).toBe('en-US');
      } finally {
        storage.mockRestore();
      }
    });

    it('returns the stored locale when it is supported', () => {
      window.localStorage.setItem(localeManagerStorageKey, 'fr-FR');

      expect(DialtoneLocalization.getPreferredLocale()).toBe('fr-FR');
    });

    it('falls back to English when the stored locale is not supported by Dialtone', () => {
      window.localStorage.setItem(localeManagerStorageKey, 'tr-TR');
      vi.stubGlobal('navigator', { language: 'tr-TR' });

      expect(DialtoneLocalization.getPreferredLocale()).toBe('en-US');
    });

    it('falls back to the navigator language when no stored locale is supported', () => {
      window.localStorage.setItem(localeManagerStorageKey, 'tr-TR');
      vi.stubGlobal('navigator', { language: 'de-DE' });

      expect(DialtoneLocalization.getPreferredLocale()).toBe('de-DE');
    });
  });

  it('initializes with blocked storage without replacing the host handler', () => {
    const previousHandler = window.onstorage;
    const hostHandler = () => {};
    window.onstorage = hostHandler;
    const storage = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('Storage is blocked', 'SecurityError');
    });

    try {
      const localization = new DialtoneLocalization();
      expect(localization.$t('DIALTONE_LOADING')).toBe('loading');
      expect(window.onstorage).toBe(hostHandler);
    } finally {
      storage.mockRestore();
      window.onstorage = previousHandler;
    }
  });
});
