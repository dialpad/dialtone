import dialtoneChangelog from '@dialtone/CHANGELOG.json';

export const DIALTONE_CHANGELOGS = {
  Dialtone: {
    json_file: dialtoneChangelog,
    url_handler: 'dialtone',
  },
};

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
  component: ['avatar', 'badge', 'checkbox', 'icon', 'inputs', 'action'],
};

export default {
  DIALTONE_CHANGELOGS,
};
