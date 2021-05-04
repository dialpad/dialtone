module.exports = {
  presets: [
    // Installed with @vue/cli-plugin-babel
    [
      '@babel/preset-env',
      {
        useBuiltIns: false,
      },
    ],
  ],
  plugins: [
    // Installed with @vue/cli-plugin-babel
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    ['@babel/transform-runtime', { regenerator: false }],
  ],
};
