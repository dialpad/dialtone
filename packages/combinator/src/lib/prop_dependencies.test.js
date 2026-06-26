import { expect } from 'vitest';
import { buildDependencyMap } from './prop_dependencies';

describe('prop_dependencies', function () {
  it('should infer truthy dependencies from applies-when descriptions', function () {
    const members = [
      { name: 'scrollbar' },
      { name: 'scrollbarContentClass', description: 'Only applies when scrollbar prop is set.' },
    ];

    expect(buildDependencyMap(members).get('scrollbarContentClass')).toBe('scrollbar');
  });

  it('should infer dependencies from false-value descriptions for visible-disabled controls', function () {
    const members = [
      { name: 'useDropdown' },
      { name: 'popoverContentClass', description: 'Only applies when useDropdown is false.' },
    ];

    expect(buildDependencyMap(members).get('popoverContentClass')).toBe('useDropdown');
  });
});
