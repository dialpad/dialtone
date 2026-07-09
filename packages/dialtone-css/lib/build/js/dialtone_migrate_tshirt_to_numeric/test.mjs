#!/usr/bin/env node

/**
 * @fileoverview Tests for dialtone-migrate-tshirt-to-numeric codemod.
 * Run: node packages/dialtone-css/lib/build/js/dialtone_migrate_tshirt_to_numeric/test.mjs
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { transformContent } from './index.mjs';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Basic size prop transforms', () => {
  it('transforms size="xs" to :size="100"', () => {
    const input = '<dt-button size="xs">Click</dt-button>';
    const expected = '<dt-button :size="100">Click</dt-button>';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, expected);
    assert.equal(count, 1);
  });

  it('transforms size="sm" to :size="200"', () => {
    const input = '<dt-text size="sm">Hello</dt-text>';
    const expected = '<dt-text :size="200">Hello</dt-text>';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms size="md" to :size="300"', () => {
    const input = '<dt-input size="md" label="Name" />';
    const expected = '<dt-input :size="300" label="Name" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms size="lg" to :size="400"', () => {
    const input = '<dt-toggle size="lg" />';
    const expected = '<dt-toggle :size="400" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms size="xl" to :size="500"', () => {
    const input = '<dt-segmented-control size="xl" />';
    const expected = '<dt-segmented-control :size="500" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms size="2xl" to :size="600"', () => {
    const input = '<dt-text kind="headline" size="2xl">Title</dt-text>';
    const expected = '<dt-text kind="headline" :size="600">Title</dt-text>';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms size="3xl" to :size="700"', () => {
    const input = '<dt-text kind="headline" size="3xl">Title</dt-text>';
    const expected = '<dt-text kind="headline" :size="700">Title</dt-text>';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });
});

describe('label-size prop transforms', () => {
  it('transforms label-size="xs" to :label-size="100"', () => {
    const input = '<dt-input label-size="xs" label="Name" />';
    const expected = '<dt-input :label-size="100" label="Name" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms label-size="lg" to :label-size="400"', () => {
    const input = '<dt-select-menu label-size="lg" />';
    const expected = '<dt-select-menu :label-size="400" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });
});

describe('speed prop transforms', () => {
  it('transforms speed="sm" to :speed="200"', () => {
    const input = '<dt-motion-text speed="sm" text="Hello" />';
    const expected = '<dt-motion-text :speed="200" text="Hello" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms speed="lg" to :speed="400"', () => {
    const input = '<dt-motion-text speed="lg" text="Hello" />';
    const expected = '<dt-motion-text :speed="400" text="Hello" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });
});

describe('Does NOT transform non-Dialtone components', () => {
  it('ignores size on native elements', () => {
    const input = '<div size="sm">Not a component</div>';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('ignores size on non-dt components', () => {
    const input = '<my-button size="sm">Click</my-button>';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('ignores size on custom elements without dt- prefix', () => {
    const input = '<app-select size="md" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });
});

describe('Does NOT transform already-numeric or dynamic values', () => {
  it('ignores :size="200" (already numeric binding)', () => {
    const input = '<dt-button :size="200">Click</dt-button>';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('ignores :size="sm" (already a v-bind, consumer chose string)', () => {
    const input = '<dt-button :size="sm">Click</dt-button>';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('ignores :label-size="xs" (already a v-bind)', () => {
    const input = '<dt-input :label-size="xs" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('ignores :size="computedSize" (dynamic binding)', () => {
    const input = '<dt-button :size="computedSize">Click</dt-button>';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('ignores :size="iconSize" (icon size binding)', () => {
    const input = '<dt-icon :size="iconSize" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('ignores numeric string size="200" on dt-icon (icon scale)', () => {
    const input = '<dt-icon size="200" name="phone" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });
});

describe('PascalCase component names', () => {
  it('transforms DtButton size', () => {
    const input = '<DtButton size="sm">Click</DtButton>';
    const expected = '<DtButton :size="200">Click</DtButton>';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms DtText size', () => {
    const input = '<DtText size="xl">Title</DtText>';
    const expected = '<DtText :size="500">Title</DtText>';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });
});

describe('Multiple transforms in one tag', () => {
  it('transforms size and label-size on same component', () => {
    const input = '<dt-input size="lg" label-size="sm" label="Name" />';
    const expected = '<dt-input :size="400" :label-size="200" label="Name" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, expected);
    assert.equal(count, 2);
  });
});

describe('Multiple components in one template', () => {
  it('transforms all Dialtone components, ignores others', () => {
    const input = `<template>
  <div>
    <dt-button size="sm">Small</dt-button>
    <my-button size="sm">Not Dialtone</my-button>
    <dt-text size="xl">Title</dt-text>
    <dt-icon size="200" name="phone" />
  </div>
</template>`;
    const expected = `<template>
  <div>
    <dt-button :size="200">Small</dt-button>
    <my-button size="sm">Not Dialtone</my-button>
    <dt-text :size="500">Title</dt-text>
    <dt-icon size="200" name="phone" />
  </div>
</template>`;
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, expected);
    assert.equal(count, 2);
  });
});

describe('Real-world patterns from the monorepo', () => {
  it('transforms button in notice action slot', () => {
    const input = '<dt-button size="sm" importance="outlined" kind="muted">Action</dt-button>';
    const expected = '<dt-button :size="200" importance="outlined" kind="muted">Action</dt-button>';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms text inside card variant template', () => {
    const input = '<dt-text as="p" kind="headline" size="md">Lorem ipsum</dt-text>';
    const expected = '<dt-text as="p" kind="headline" :size="300">Lorem ipsum</dt-text>';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms avatar size', () => {
    const input = '<dt-avatar size="md" :full-name="item.id" />';
    const expected = '<dt-avatar :size="300" :full-name="item.id" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms motion-text speed in story', () => {
    const input = '<dt-motion-text speed="md" text="Animated" :auto-start="false" />';
    const expected = '<dt-motion-text :speed="300" text="Animated" :auto-start="false" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('handles multiline component tags', () => {
    const input = `<dt-button
      size="xs"
      kind="muted"
      importance="clear"
    >`;
    const expected = `<dt-button
      :size="100"
      kind="muted"
      importance="clear"
    >`;
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });
});

describe('Future-proof: any compound *-size prop', () => {
  it('transforms description-size="sm" to :description-size="200"', () => {
    const input = '<dt-input description-size="sm" />';
    const expected = '<dt-input :description-size="200" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms icon-size="lg" to :icon-size="400"', () => {
    const input = '<dt-badge icon-size="lg" />';
    const expected = '<dt-badge :icon-size="400" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms header-size="xl" to :header-size="500"', () => {
    const input = '<dt-card header-size="xl" />';
    const expected = '<dt-card :header-size="500" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });
});

describe('camelCase prop names', () => {
  it('transforms labelSize="xs" to :labelSize="100"', () => {
    const input = '<dt-input labelSize="xs" />';
    const expected = '<dt-input :labelSize="100" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms descriptionSize="md" to :descriptionSize="300"', () => {
    const input = '<dt-input descriptionSize="md" />';
    const expected = '<dt-input :descriptionSize="300" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });
});

describe('Excluded props (not component scale sizes)', () => {
  it('ignores button-width-size="md"', () => {
    const input = '<dt-recipe-callbar-button button-width-size="md" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('ignores buttonWidthSize="lg"', () => {
    const input = '<DtCallbarButton buttonWidthSize="lg" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });
});

describe('DtModal size → fullscreen transform', () => {
  it('transforms size="full" to fullscreen', () => {
    const input = '<dt-modal size="full" header-text="Title" />';
    const expected = '<dt-modal fullscreen header-text="Title" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, expected);
    assert.equal(count, 1);
  });

  it('removes size="default"', () => {
    const input = '<dt-modal size="default" header-text="Title" />';
    const expected = '<dt-modal header-text="Title" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, expected);
    assert.equal(count, 1);
  });

  it('transforms PascalCase DtModal size="full"', () => {
    const input = '<DtModal size="full">Content</DtModal>';
    const expected = '<DtModal fullscreen>Content</DtModal>';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, expected);
    assert.equal(count, 1);
  });

  it('ignores size="full" on non-modal components', () => {
    const input = '<dt-button size="full">Click</dt-button>';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('ignores size="full" on tags that merely start with dt-modal', () => {
    const input = '<dt-modal-header size="full">Content</dt-modal-header>';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('handles multiline dt-modal tags', () => {
    const input = `<dt-modal
      size="full"
      header-text="Title"
    >`;
    const expected = `<dt-modal
      fullscreen
      header-text="Title"
    >`;
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, expected);
    assert.equal(count, 1);
  });
});

describe('Edge cases', () => {
  it('does not transform size inside text content', () => {
    const input = '<dt-text>The size="sm" option is deprecated</dt-text>';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('returns count of 0 for content with no matches', () => {
    const input = '<div><span>No Dialtone here</span></div>';
    const { count } = transformContent(input);
    assert.equal(count, 0);
  });

  it('handles empty string', () => {
    const { transformed, count } = transformContent('');
    assert.equal(transformed, '');
    assert.equal(count, 0);
  });
});
