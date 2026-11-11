import { act } from 'react';
import { render, screen } from '@testing-library/react';
import { DialtoneLocalization, DtLocalizationProvider, useI18n } from '.';

const localeManagerStorageKey = 'user-locale';
// Fluent wraps placeables in Unicode isolation marks (FSI … PDI), as @dialpad/i18n does in Vue.
const isolate = (s: string) => `⁨${s}⁩`;

function Probe ({ id = 'DIALTONE_LOADING' }: { id?: string }) {
  const i18n = useI18n();
  return <span data-qa="probe" data-locale={i18n.currentLocale}>{i18n.$t(id)}</span>;
}

describe('DialtoneLocalization Tests', () => {
  afterEach(() => {
    if (DialtoneLocalization.instance) DialtoneLocalization.instance.currentLocale = 'en-US';
    window.localStorage.removeItem(localeManagerStorageKey);
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // dialtone-vue's localization/index.test.js, unchanged.
  describe('getPreferredLocale', () => {
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

  describe('the instance', () => {
    it('is a singleton', () => {
      expect(new DialtoneLocalization()).toBe(new DialtoneLocalization('fr-FR'));
    });

    it('lists the locales Dialtone ships', () => {
      expect(Object.values(DialtoneLocalization.getAllowedLocales())).toEqual([
        'en-US', 'zh-CN', 'nl-NL', 'fr-FR', 'de-DE', 'it-IT', 'ja-JP', 'ko-KR', 'pt-BR', 'ru-RU', 'es-LA', 'sv-SE',
      ]);
    });

    it('formats messages, variables and plurals from the .ftl files', () => {
      const i18n = new DialtoneLocalization();
      expect(i18n.$t('DIALTONE_LOADING')).toBe('loading');
      expect(i18n.$t('DIALTONE_UNREAD_MESSAGE_COUNT_TEXT', { unreadCount: 0 })).toBe('No unread messages');
      expect(i18n.$t('DIALTONE_UNREAD_MESSAGE_COUNT_TEXT', { unreadCount: 5 }))
        .toBe(`${isolate('5')} unread messages`);
    });

    it('returns attributes with $ta, and the key from $t for a message with attributes only', () => {
      const i18n = new DialtoneLocalization();
      expect(i18n.$ta('DIALTONE_EDITOR_CONFIRM_SET_LINK_BUTTON')).toEqual({ title: 'Confirm', 'aria-label': 'Confirm set link' });
      expect(i18n.$t('DIALTONE_EDITOR_CONFIRM_SET_LINK_BUTTON')).toBe('DIALTONE_EDITOR_CONFIRM_SET_LINK_BUTTON');
    });

    it('returns the key, or no attributes, and warns for a missing message', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const i18n = new DialtoneLocalization();
      expect(i18n.$t('NOT_A_KEY')).toBe('NOT_A_KEY');
      expect(i18n.$ta('NOT_A_KEY')).toEqual({});
      expect(warn).toHaveBeenCalledWith('[dialtone-react] Could not find translation for key [NOT_A_KEY]');
    });

    it('switches locale, falling back to en-US for messages the locale lacks', () => {
      const i18n = new DialtoneLocalization();
      i18n.currentLocale = 'fr-FR';
      expect(i18n.currentLocale).toBe('fr-FR');
      expect(i18n.$t('DIALTONE_LOADING')).toBe('En cours de chargement');
      // Not in fr-FR.ftl yet.
      expect(i18n.$t('DIALTONE_FILTER_PILL_CLEAR_BUTTON_LABEL')).toBe('Clear filter');
    });

    it('saves the locale under user-locale, as Vue does', () => {
      new DialtoneLocalization().currentLocale = 'de-DE';
      expect(window.localStorage.getItem(localeManagerStorageKey)).toBe('de-DE');
    });

    it('throws for a locale Dialtone does not ship', () => {
      expect(() => { new DialtoneLocalization().currentLocale = 'tr-TR'; })
        .toThrow('Locale tr-TR is not allowed, please use one of the following: en-US, zh-CN');
    });

    it('follows user-locale changes from other tabs, ignoring locales Dialtone does not ship', () => {
      const i18n = new DialtoneLocalization();
      window.dispatchEvent(new StorageEvent('storage', { key: localeManagerStorageKey, newValue: 'ja-JP' }));
      expect(i18n.currentLocale).toBe('ja-JP');
      window.dispatchEvent(new StorageEvent('storage', { key: localeManagerStorageKey, newValue: 'tr-TR' }));
      expect(i18n.currentLocale).toBe('ja-JP');
    });
  });

  describe('useI18n', () => {
    it('re-renders components when the locale changes', () => {
      render(<Probe />);
      expect(screen.getByTestId('probe')).toHaveTextContent('loading');
      act(() => { new DialtoneLocalization().currentLocale = 'fr-FR'; });
      expect(screen.getByTestId('probe')).toHaveTextContent('En cours de chargement');
      expect(screen.getByTestId('probe')).toHaveAttribute('data-locale', 'fr-FR');
    });

    it('returns the same object for the same locale', () => {
      const seen: unknown[] = [];
      function Collect () { seen.push(useI18n()); return null; }
      const { rerender } = render(<Collect />);
      rerender(<Collect />);
      expect(seen[0]).toBe(seen[1]);
    });

    it('uses a provider\'s locale for its subtree, whatever the current locale', () => {
      render(
        <>
          <DtLocalizationProvider locale="de-DE"><Probe /></DtLocalizationProvider>
          <Probe id="DIALTONE_CLOSE_BUTTON" />
        </>,
      );
      act(() => { new DialtoneLocalization().currentLocale = 'fr-FR'; });
      const [pinned, global] = screen.getAllByTestId('probe');
      expect(pinned).toHaveAttribute('data-locale', 'de-DE');
      expect(global).toHaveTextContent('Cliquez pour fermer');
    });

    it('follows the current locale under a provider without one', () => {
      render(<DtLocalizationProvider><Probe /></DtLocalizationProvider>);
      act(() => { new DialtoneLocalization().currentLocale = 'fr-FR'; });
      expect(screen.getByTestId('probe')).toHaveAttribute('data-locale', 'fr-FR');
    });

    it('throws for a provider locale Dialtone does not ship', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(
        // @ts-expect-error: not a Dialtone locale
        <DtLocalizationProvider locale="tr-TR"><Probe /></DtLocalizationProvider>,
      )).toThrow('Locale tr-TR is not allowed');
    });
  });
});
