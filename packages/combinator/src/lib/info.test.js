import { describe, expect, it } from 'vitest';
import { getComponentInfo } from './info';

const supportedComponent = { name: 'DtCard', props: {} };
const unsupportedComponent = { name: 'DtDropdown', props: {} };

describe('info.js test', function () {
  describe('getComponentInfo', function () {
    it('preserves union types and a usable initial value for forwarded attributes', function () {
      const info = getComponentInfo(supportedComponent, {
        displayName: 'DtCard',
        props: [],
        tags: {
          property: [{
            name: 'trailingClass',
            description: 'attribute',
            type: {
              name: 'union',
              elements: [{ name: 'String' }, { name: 'Array' }, { name: 'Object' }],
            },
          }],
        },
      });

      const attribute = info.attributes.find(attribute => attribute.name === 'trailingClass');
      expect(attribute.types).toEqual(['string', 'array', 'object']);
      expect(attribute.initialValue).toBe('');
    });

    it('supports prop default factories that read raw props', function () {
      const component = {
        props: {
          kind: {
            type: String,
            default: null,
          },
          variant: {
            type: String,
            default: rawProps => rawProps.kind ? null : 'body-md',
          },
        },
      };
      const documentation = {
        props: [
          {
            name: 'kind',
            type: { name: 'string' },
          },
          {
            name: 'variant',
            type: { name: 'string' },
          },
        ],
      };

      const info = getComponentInfo(component, documentation);

      expect(info.props.find(prop => prop.name === 'variant').initialValue).toBe('body-md');
    });

    it('adds a native class attribute for components that support root class', function () {
      const info = getComponentInfo(supportedComponent, {
        displayName: 'DtCard',
        props: [],
        tags: {},
      });

      expect(info.attributes.map(attribute => attribute.name)).toContain('class');
    });

    it('does not add a native class attribute for components that do not support root class', function () {
      const info = getComponentInfo(unsupportedComponent, {
        displayName: 'DtDropdown',
        props: [],
        tags: {},
      });

      expect(info.attributes).toBeUndefined();
    });
  });
});
