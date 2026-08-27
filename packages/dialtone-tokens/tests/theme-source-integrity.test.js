// @vitest-environment node
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokenRoot = join(packageRoot, 'tokens');
const themes = JSON.parse(readFileSync(join(tokenRoot, '$themes.json'), 'utf8'));

// Excluded by identity, not by shape: `dp` is the base every brand layers on,
// and `expressive` is a display-scale variant with no dark counterpart. Naming
// them means a brand that loses its dark.json fails here instead of silently
// dropping out of the suite.
const NOT_BRAND_THEMES = ['dp', 'expressive'];

const themeGroups = readdirSync(join(tokenRoot, 'theme'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !NOT_BRAND_THEMES.includes(entry.name))
  .map((entry) => entry.name);

const recordsFor = (group) => {
  const records = themes.filter((theme) => theme.group === group);
  return {
    records,
    light: records.find((theme) => theme.name === 'light'),
    dark: records.find((theme) => theme.name === 'dark'),
  };
};

const selectedThemePaths = (theme) => Object.entries(theme.selectedTokenSets)
  .filter(([path, state]) => path.startsWith('theme/') && state === 'enabled')
  .map(([path]) => path)
  .sort();

describe('theme token source', () => {
  it.each(themeGroups)('%s Should have one light and one dark record', (group) => {
    expect(recordsFor(group).records).toHaveLength(2);
  });

  it.each(themeGroups)('%s light record Should select its own and dp default token sets', (group) => {
    expect(selectedThemePaths(recordsFor(group).light)).toEqual([
      `theme/${group}/default`,
      'theme/dp/default',
    ].sort());
  });

  it.each(themeGroups)('%s dark record Should select its own and dp dark token sets', (group) => {
    expect(selectedThemePaths(recordsFor(group).dark)).toEqual([
      `theme/${group}/dark`,
      `theme/${group}/default`,
      'theme/dp/dark',
      'theme/dp/default',
    ].sort());
  });
});
