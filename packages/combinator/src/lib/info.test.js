import { getComponentInfo } from './info';

import { expect } from 'vitest';

const supportedComponent = { name: 'DtCard', props: {} };
const unsupportedComponent = { name: 'DtDropdown', props: {} };

describe('info.js test', function () {
  it('Should add a native class attribute for components that support root class', function () {
    const info = getComponentInfo(supportedComponent, {
      displayName: 'DtCard',
      props: [],
      tags: {},
    });

    expect(info.attributes.map(attribute => attribute.name)).toContain('class');
  });

  it('Should not add a native class attribute for components that do not support root class', function () {
    const info = getComponentInfo(unsupportedComponent, {
      displayName: 'DtDropdown',
      props: [],
      tags: {},
    });

    expect(info.attributes).toBeUndefined();
  });
});
