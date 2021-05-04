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
    '@babel/transform-runtime',
  ],
};
