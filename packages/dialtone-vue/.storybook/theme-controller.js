export const createThemeController = ({
  brandImports,
  highContrastImport,
  initialize,
  applyMode,
  applyBrand,
  applyContrast,
}) => {
  const themesReady = Promise.all([
    Promise.all(brandImports.map(async ([id, themeImport]) => [id, (await themeImport).default])),
    highContrastImport,
  ]).then(([brandEntries, highContrastModule]) => {
    const brands = Object.fromEntries(brandEntries);

    initialize(brands.dp);

    return {
      brands,
      highContrast: highContrastModule.default,
    };
  });

  return {
    update: ({ mode, brand, highContrast }) => themesReady.then((themes) => {
      applyMode(mode);

      if (themes.brands[brand]) {
        applyBrand(themes.brands[brand]);
      }

      applyContrast(highContrast ? themes.highContrast : null);
    }),
  };
};
