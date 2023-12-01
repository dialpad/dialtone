export const withValidCustomEmojis = {
  octocat: {
    name: 'octocat',
    category: '',
    shortname: ':octocat:',
    shortname_alternates: [],
    keywords: [
      'octo',
      'cat',
      'github',
    ],
    extension: '.png',
    custom: true,
  },
};

export const withNotAllRequiredProps = {
  octocat: {
    name: 'octocat',
    category: '',
    shortname: ':octocat:',
    shortname_alternates: [],
    keywords: [
      'octo',
      'cat',
      'github',
    ],
    extension: '.png',
    custom: true,
  },
  notallrequiredprops: {
    name: 'not all required props',
    category: '',
    shortname: ':notallrequiredprops:',
    shortname_alternates: [],
    keywords: [
      'not',
    ],
    custom: true,
  },
};

export const withValidUnicodeEmojis = {
  '1f913': {
    shortname: ':nerdface:',
  },
  '1f615': {
    keywords: ['thinking', 'not sure', 'unknown'],
  },
};
