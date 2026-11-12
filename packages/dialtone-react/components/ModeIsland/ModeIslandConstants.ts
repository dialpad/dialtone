export const DT_MODE_ISLAND_TYPES = {
  INVERTED: 'inverted',
  LIGHT: 'light',
  DARK: 'dark',
} as const;

/** DtModeIsland's `mode`: Vue's `modeValidator` (Validators.js) as a type. */
export type ModeIslandType = typeof DT_MODE_ISLAND_TYPES[keyof typeof DT_MODE_ISLAND_TYPES];
