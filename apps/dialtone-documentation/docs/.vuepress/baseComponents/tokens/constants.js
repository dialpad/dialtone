export const FORMAT_MAP = {
  CSS: 'css/variables',
  Android: 'compose/object',
  iOS: 'ios-swift/enum.swift',
};

export const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export const CATEGORY_MAP = {
  color: ['color', 'opacity', 'theme'],
  typography: ['typography', 'font'],
  size: ['size'],
  space: ['space'],
  shadow: ['shadow'],
  component: ['topbar', 'sidebar', 'presence', 'mention', 'avatar', 'badge', 'checkbox', 'icon', 'inputs', 'action'],
};

export const SUBCATEGORY_MAP = {
  color: ['foreground', 'surface', 'border', 'link', 'neutral'],
  font: ['family', 'weight', 'size'],
  size: ['radius', 'border'],
};

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
    neutral: {
      _children: [],
    },
    brand: {
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
    'font style': {
      _children: [],
    },
    'font family': {
      _children: [],
    },
    'font weight': {
      _children: [],
    },
    textcase: {
      _children: [],
    },
    'line height': {
      _children: [],
    },
    'font size': {
      _children: [],
    },
    components: {
      _children: [],
    },
  },
  shadow: {
    _children: [],
  },
  size: {
    base: {
      _children: [],
    },
    negative: {
      _children: [],
    },
    percentage: {
      _children: [],
    },
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
  space: {
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
});
