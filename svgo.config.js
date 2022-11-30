module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // customize default plugin options
          removeUnknownsAndDefaults: {
            keepRoleAttr: true,
          },
        },
      },
    },
  ],
};
