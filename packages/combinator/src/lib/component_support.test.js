import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

import documentation from '@/node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import * as dialtone from '@dialpad/dialtone-vue';
import unsupportedComponents from '@/src/unsupported_components.json';
import { getUnsupportedComponentReason, isSupportedComponent } from './component_support';

const workspaceRoot = resolve(process.cwd(), '../..');

function getActiveDocsCombinatorComponents () {
  const componentsDir = join(workspaceRoot, 'apps/dialtone-documentation/docs/components');
  return [...new Set(
    readdirSync(componentsDir)
      .filter(fileName => fileName.endsWith('.md'))
      .flatMap(fileName => {
        const filePath = join(componentsDir, fileName);
        const contents = readFileSync(filePath, 'utf8');
        return [...contents.matchAll(/<component-combinator\s+component-name="([^"]+)"\s*\/?>/g)]
          .filter(match => {
            const before = contents.slice(Math.max(0, match.index - 8), match.index);
            const after = contents.slice(match.index + match[0].length, match.index + match[0].length + 4);
            return !(before.includes('<!--') && after.includes('-->'));
          })
          .map(match => match[1]);
      }),
  )].sort();
}

describe('component_support.js test', function () {
  it('supports components that have documentation and are not explicitly denied', function () {
    expect(isSupportedComponent('DtText', documentation)).toBe(true);
  });

  it('does not support documented components that are explicitly denied', function () {
    expect(isSupportedComponent('DtModal', documentation)).toBe(false);
    expect(getUnsupportedComponentReason('DtModal')).toBeTruthy();
  });

  it('does not support components without documentation', function () {
    expect(isSupportedComponent('DtTable', documentation)).toBe(false);
  });

  it('keeps active docs Combinator pages out of the unsupported component list', function () {
    const unsupportedNames = new Set(Object.keys(unsupportedComponents));
    const unusableActiveComponents = getActiveDocsCombinatorComponents()
      .filter(componentName => {
        return unsupportedNames.has(componentName) ||
          !dialtone[componentName] ||
          !isSupportedComponent(componentName, documentation);
      });

    expect(unusableActiveComponents).toEqual([]);
  });

  it('keeps every unsupported component entry documented with a reason', function () {
    Object.entries(unsupportedComponents).forEach(([componentName, reason]) => {
      expect(componentName).toMatch(/^Dt[A-Z]/);
      expect(reason.trim().length).toBeGreaterThan(0);
      expect(isSupportedComponent(componentName, documentation)).toBe(false);
    });
  });
});
