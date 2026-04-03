export const FORMAT_MAP = {
  CSS: 'css/variables',
  Android: 'compose/object',
  iOS: 'ios-swift/enum.swift',
};

export const MODES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export const THEMES = [
  { value: 'dp', label: 'Dialpad' },
  { value: 'tmo', label: 'T-Mobile' },
  // { value: 'expressive', label: 'Expressive' },
  // { value: 'expressive-sm', label: 'Expressive Small' },
  { value: 'aegean', label: 'Aegean' },
  { value: 'botany', label: 'Botany' },
  { value: 'buttercream', label: 'Buttercream' },
  { value: 'high-desert', label: 'High Desert' },
  { value: 'melon', label: 'Melon' },
  { value: 'plum', label: 'Plum' },
  { value: 'sunflower', label: 'Sunflower' },
  { value: 'verdant-haze', label: 'Verdant Haze' },
];

export const CATEGORY_MAP = {
  color: ['color', 'opacity', 'shell'],
  typography: ['typography', 'font', 'text'],
  spacing: ['spacing'],
  layout: ['layout'],
  size: ['size'],
  shadow: ['shadow'],
  component: ['topbar', 'sidebar', 'presence', 'mention', 'avatar', 'badge', 'checkbox', 'icon', 'inputs', 'action'],
};

export const SUBCATEGORY_MAP = {
  color: ['foreground', 'surface', 'border', 'link', 'neutral'],
  font: ['family', 'weight', 'size'],
  size: ['radius', 'border'],
};

export const DEPRECATED_PATTERNS = [
  'typography-headline-',
  'typography-body-',
  'typography-label-',
  'typography-helper-',
  'typography-code-',
];

export const getTokensStructure = () => ({
  color: {
    foreground: {
      _children: [],
    },
    surface: {
      _children: [],
    },
    border: {
      _children: [],
    },
    link: {
      _children: [],
    },
    theme: {
      _children: [],
    },
    chart: {
      _children: [],
    },
    neutral: {
      _children: [],
    },
    opacity: {
      _children: [],
    },
    components: {
      _children: [],
    },
    base: {
      _children: [],
    },
  },
  typography: {
    'text style': {
      _children: [],
    },
    'font size': {
      _children: [],
    },
    'font weight': {
      _children: [],
    },
    'line height': {
      _children: [],
    },
    'font family': {
      _children: [],
    },
    textcase: {
      _children: [],
    },
    components: {
      _children: [],
    },
  },
  shadow: {
    _children: [],
  },
  spacing: {
    base: {
      _children: [],
    },
    negative: {
      _children: [],
    },
  },
  layout: {
    base: {
      _children: [],
    },
    negative: {
      _children: [],
    },
    percentage: {
      _children: [],
    },
  },
  size: {
    radius: {
      _children: [],
    },
    border: {
      _children: [],
    },
    components: {
      _children: [],
    },
  },
});
