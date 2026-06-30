import { describe, expect, it } from 'vitest';
import { getComponentInfo } from './info';

describe('info.js test', function () {
  describe('getComponentInfo', function () {
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
  });
});
