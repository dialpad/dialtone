// dialtone-vue's localization/index.js in React: the same Fluent files and message ids, the same singleton
// class and locale rules, on @fluent/bundle directly instead of @dialpad/i18n (which needs Vue). Components read it
// through useI18n, which re-renders them when the locale changes.
import { FluentBundle, FluentResource, type FluentVariable } from '@fluent/bundle';

// The .ftl files are dialtone-vue's, not copies, so the two packages can't drift.
import enUS from '../../../dialtone-vue/localization/en-US.ftl?raw';
import zhCN from '../../../dialtone-vue/localization/zh-CN.ftl?raw';
import nlNL from '../../../dialtone-vue/localization/nl-NL.ftl?raw';
import frFR from '../../../dialtone-vue/localization/fr-FR.ftl?raw';
import deDE from '../../../dialtone-vue/localization/de-DE.ftl?raw';
import itIT from '../../../dialtone-vue/localization/it-IT.ftl?raw';
import jaJP from '../../../dialtone-vue/localization/ja-JP.ftl?raw';
import koKR from '../../../dialtone-vue/localization/ko-KR.ftl?raw';
import ptBR from '../../../dialtone-vue/localization/pt-BR.ftl?raw';
import ruRU from '../../../dialtone-vue/localization/ru-RU.ftl?raw';
import esLA from '../../../dialtone-vue/localization/es-LA.ftl?raw';
import svSE from '../../../dialtone-vue/localization/sv-SE.ftl?raw';

const allowedLocales = {
  ENGLISH: 'en-US',
  CHINESE: 'zh-CN',
  DUTCH: 'nl-NL',
  FRENCH: 'fr-FR',
  GERMAN: 'de-DE',
  ITALIAN: 'it-IT',
  JAPANESE: 'ja-JP',
  KOREAN: 'ko-KR',
  PORTUGUESE: 'pt-BR',
  RUSSIAN: 'ru-RU',
  SPANISH: 'es-LA',
  SWEDISH: 'sv-SE',
} as const;

export type DialtoneLocale = typeof allowedLocales[keyof typeof allowedLocales];
/** Fluent variables, as `$t(key, vars)` takes them: strings, numbers, dates. */
export type DialtoneI18nVariables = Record<string, FluentVariable>;

const SOURCES: Record<DialtoneLocale, string> = {
  'en-US': enUS,
  'zh-CN': zhCN,
  'nl-NL': nlNL,
  'fr-FR': frFR,
  'de-DE': deDE,
  'it-IT': itIT,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'pt-BR': ptBR,
  'ru-RU': ruRU,
  'es-LA': esLA,
  'sv-SE': svSE,
};

const fallbackLocale: DialtoneLocale = 'en-US';
/** Where the user's locale is kept, shared with dialtone-vue and the host app (@dialpad/i18n's key). */
const localeManagerStorageKey = 'user-locale';

const isAllowedLocale = (locale: unknown): locale is DialtoneLocale =>
  (Object.values(allowedLocales) as unknown[]).includes(locale);

export function assertAllowedLocale (locale: unknown): asserts locale is DialtoneLocale {
  if (!isAllowedLocale(locale)) {
    throw new Error(`Locale ${locale} is not allowed, please use one of the following: ${Object.values(allowedLocales).join(', ')}`);
  }
}

// One bundle per locale, parsed on first use. FluentBundle's defaults, as @dialpad/i18n's RawBundleSource uses
// them: placeables are wrapped in Unicode isolation marks, so output is identical to Vue's.
const bundles = new Map<DialtoneLocale, FluentBundle>();
function bundleFor (locale: DialtoneLocale): FluentBundle {
  let bundle = bundles.get(locale);
  if (!bundle) {
    bundle = new FluentBundle(locale);
    bundle.addResource(new FluentResource(SOURCES[locale]));
    bundles.set(locale, bundle);
  }
  return bundle;
}

/** What useI18n returns: the shape Vue components call as `this.i18n`. Stable for a given locale. */
export interface DialtoneI18n {
  /** The message's value, or the key when no bundle has it (warned). */
  $t: (key: string, vars?: DialtoneI18nVariables) => string;
  /** The message's attributes (aria-label, title…) as an object to spread, or {} when no bundle has it (warned). */
  $ta: (key: string, vars?: DialtoneI18nVariables) => Record<string, string>;
  currentLocale: DialtoneLocale;
}

// @dialpad/i18n's lookup (fluent-vue over @fluent/sequence): the first of [locale, en-US] that has the message
// wins, even when that message has attributes only, in which case $t returns the key.
const translators = new Map<DialtoneLocale, DialtoneI18n>();
export function translatorFor (locale: DialtoneLocale): DialtoneI18n {
  let translator = translators.get(locale);
  if (translator) return translator;
  const chain = locale === fallbackLocale ? [fallbackLocale] : [locale, fallbackLocale];
  const find = (key: string) => {
    for (const bundle of chain.map(bundleFor)) {
      const message = bundle.getMessage(key);
      if (message) return { bundle, message };
    }
    console.warn(`[dialtone-react] Could not find translation for key [${key}]`);
    return null;
  };
  const format = (bundle: FluentBundle, key: string, pattern: Parameters<FluentBundle['formatPattern']>[0],
    vars?: DialtoneI18nVariables) => {
    const errors: Error[] = [];
    const text = bundle.formatPattern(pattern, vars, errors);
    for (const error of errors) console.warn(`[dialtone-react] Error when formatting message with key [${key}]`, error);
    return text;
  };
  translator = {
    currentLocale: locale,
    $t: (key, vars) => {
      const found = find(key);
      if (!found?.message.value) return key;
      return format(found.bundle, key, found.message.value, vars);
    },
    $ta: (key, vars) => {
      const found = find(key);
      if (!found) return {};
      return Object.fromEntries(Object.entries(found.message.attributes)
        .map(([name, pattern]) => [name, format(found.bundle, key, pattern, vars)]));
    },
  };
  translators.set(locale, translator);
  return translator;
}

function storage (): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage ?? null;
  } catch { // access denied (sandboxed frames, some private modes)
    return null;
  }
}

function saveLocale (locale: DialtoneLocale) {
  try {
    storage()?.setItem(localeManagerStorageKey, locale);
  } catch { /* quota or access denied: the locale still applies to this page */ }
}

/**
 * Dialtone localization: dialtone-vue's DialtoneLocalization, with the same API. A singleton: every
 * `new DialtoneLocalization()` returns the same instance. Setting `currentLocale` switches every component that
 * reads it through useI18n (not those under a DtLocalizationProvider with its own `locale`), and is saved, as in
 * Vue, under the `user-locale` storage key, which other tabs and dialtone-vue follow.
 */
export class DialtoneLocalization {
  static instance: DialtoneLocalization | undefined;

  private _locale!: DialtoneLocale;
  private listeners!: Set<() => void>;

  constructor (locale: string | null = null) {
    if (typeof DialtoneLocalization.instance === 'object') {
      return DialtoneLocalization.instance;
    }
    const initial = locale || DialtoneLocalization.getPreferredLocale();
    assertAllowedLocale(initial);
    this._locale = initial;
    this.listeners = new Set();
    // @dialpad/i18n's LocaleManager saves the locale it starts with.
    saveLocale(initial);
    DialtoneLocalization.instance = this;

    if (typeof window !== 'undefined') {
      // Vue assigns window.onstorage, replacing the app's handler; a listener doesn't. A value Dialtone has no
      // bundle for is ignored, where Vue's setter would throw from the event.
      window.addEventListener('storage', (event) => {
        if (event.key === localeManagerStorageKey && isAllowedLocale(event.newValue)) {
          this.currentLocale = event.newValue;
        }
      });
    }
  }

  /** The stored locale if Dialtone ships it, else the browser language's first match, else en-US. */
  static getPreferredLocale (): DialtoneLocale {
    if (typeof window === 'undefined' || !storage()) {
      return fallbackLocale;
    }
    const storedLanguage = storage()?.getItem(localeManagerStorageKey);
    const localStorageLanguage = isAllowedLocale(storedLanguage) ? storedLanguage : null;
    const navigatorLanguage = Object.values(allowedLocales)
      .find(locale => locale.startsWith(navigator.language.slice(0, 2)));
    return localStorageLanguage || navigatorLanguage || fallbackLocale;
  }

  static getAllowedLocales () {
    return allowedLocales;
  }

  $t (key: string, vars?: DialtoneI18nVariables): string {
    return translatorFor(this._locale).$t(key, vars);
  }

  $ta (key: string, vars?: DialtoneI18nVariables): Record<string, string> {
    return translatorFor(this._locale).$ta(key, vars);
  }

  get currentLocale (): DialtoneLocale {
    return this._locale;
  }

  /** Throws for a locale Dialtone doesn't ship, as Vue does. */
  set currentLocale (newLocale: string) {
    if (newLocale === this._locale) return;
    assertAllowedLocale(newLocale);
    this._locale = newLocale;
    saveLocale(newLocale);
    this.listeners.forEach(listener => listener());
  }

  /** For useSyncExternalStore: calls `listener` after every locale change. Returns the unsubscribe. */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
}
