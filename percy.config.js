module.exports = {
  version: 2,
  storybook: {
    queryParams: {
      viewMode: 'docs',
    },
    include: [
      'Visual Testing/Combobox With Popover: Default',
      'Visual Testing/Dropdown: Default',
      'Visual Testing/Popover: Default',
      'Visual Testing/Toast: Default',
      'Visual Testing/Tooltip: Default',
      'Visual Testing/Inline Components: Default',
      'Visual Testing/Modal: Default',
      'Visual Testing/Modal: With Footer',
      'Visual Testing/Modal: With Fixed Header Footer',
      'Visual Testing/Modal: With Danger Style',
      'Visual Testing/Modal: With Full Size',
      'Visual Testing/Modal: With Custom Header And Content',
      'Visual Testing/Image Viewer: Default',
    ],
    waitForTimeout: 250,
  },
  snapshot: {
    enableJavaScript: true,
  },
  discovery: {
    disableCache: true,
  },
};
