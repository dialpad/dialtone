import BaseLight from '@dialpad/dialtone-tokens/dist/css/tokens-base-light.css?inline';
import BaseDark from '@dialpad/dialtone-tokens/dist/css/tokens-base-dark.css?inline';
import SemanticDpLight from '@dialpad/dialtone-tokens/dist/css/tokens-dp-light.css?inline';
import SemanticDpDark from '@dialpad/dialtone-tokens/dist/css/tokens-dp-dark.css?inline';
import SemanticTmoLight from '@dialpad/dialtone-tokens/dist/css/tokens-tmo-light.css?inline';
import SemanticTmoDark from '@dialpad/dialtone-tokens/dist/css/tokens-tmo-dark.css?inline';
import SemanticExpressiveLight from '@dialpad/dialtone-tokens/dist/css/tokens-expressive-light.css?inline';
import SemanticExpressiveDark from '@dialpad/dialtone-tokens/dist/css/tokens-expressive-dark.css?inline';
import SemanticExpressiveSmLight from '@dialpad/dialtone-tokens/dist/css/tokens-expressive-sm-light.css?inline';
import SemanticExpressiveSmDark from '@dialpad/dialtone-tokens/dist/css/tokens-expressive-sm-dark.css?inline';

export const THEME_MAP = {
  light: BaseLight,
  dark: BaseDark,
};

export const BRAND_MAP = {
  dp: {
    light: SemanticDpLight,
    dark: SemanticDpDark,
  },
  tmo: {
    light: SemanticTmoLight,
    dark: SemanticTmoDark,
  },
  expressive: {
    light: SemanticExpressiveLight,
    dark: SemanticExpressiveDark,
  },
  'expressive-sm': {
    light: SemanticExpressiveSmLight,
    dark: SemanticExpressiveSmDark,
  },
};

export const BRANDS = ['dp', 'tmo', 'expressive', 'expressive-sm'];
export const THEMES = ['light', 'dark', 'system'];
