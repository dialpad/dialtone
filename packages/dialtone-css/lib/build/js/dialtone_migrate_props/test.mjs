#!/usr/bin/env node

/**
 * @fileoverview Tests for dialtone-migrate-props codemod.
 * Run: node packages/dialtone-css/lib/build/js/dialtone_migrate_props/test.mjs
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { transformContent } from './index.mjs';

// ---------------------------------------------------------------------------
// DLT-3161 — avatar: clickable → interactive
// ---------------------------------------------------------------------------

describe('clickable → interactive (dt-avatar)', () => {
  it('renames clickable prop', () => {
    const input = '<dt-avatar clickable />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, '<dt-avatar interactive />');
    assert.equal(count, 1);
  });

  it('renames :clickable binding', () => {
    const { transformed } = transformContent('<dt-avatar :clickable="true" />');
    assert.equal(transformed, '<dt-avatar :interactive="true" />');
  });

  it('does not rename clickable on other components', () => {
    const input = '<dt-button clickable />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('handles PascalCase DtAvatar', () => {
    const { transformed } = transformContent('<DtAvatar :clickable="isClickable" />');
    assert.equal(transformed, '<DtAvatar :interactive="isClickable" />');
  });

  it('renames bare boolean clickable on non-self-closing tag', () => {
    const { transformed } = transformContent('<dt-avatar clickable>Profile</dt-avatar>');
    assert.equal(transformed, '<dt-avatar interactive>Profile</dt-avatar>');
  });
});

// ---------------------------------------------------------------------------
// DLT-3282 — show → open (modal, toast, tooltip)
// ---------------------------------------------------------------------------

describe('show → open (modal, toast, tooltip)', () => {
  it('renames :show on dt-modal', () => {
    const { transformed } = transformContent('<dt-modal :show="isOpen" />');
    assert.equal(transformed, '<dt-modal :open="isOpen" />');
  });

  it('renames :show on dt-toast', () => {
    const { transformed } = transformContent('<dt-toast :show="visible" />');
    assert.equal(transformed, '<dt-toast :open="visible" />');
  });

  it('renames :show on dt-tooltip', () => {
    const { transformed } = transformContent('<dt-tooltip :show="hovered" />');
    assert.equal(transformed, '<dt-tooltip :open="hovered" />');
  });

  it('renames @update:show event', () => {
    const { transformed } = transformContent('<dt-modal :show="open" @update:show="close" />');
    assert.equal(transformed, '<dt-modal :open="open" @update:open="close" />');
  });

  it('renames v-model:show', () => {
    const { transformed } = transformContent('<dt-modal v-model:show="isOpen" />');
    assert.equal(transformed, '<dt-modal v-model:open="isOpen" />');
  });

  it('does not rename show on non-overlay components', () => {
    const input = '<dt-avatar :show="true" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('does not rename show-close when renaming show', () => {
    const input = '<dt-modal :show="isOpen" :show-close="false" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, '<dt-modal :open="isOpen" :show-close="false" />');
  });
});

// ---------------------------------------------------------------------------
// DLT-3284 — title/titleId → headerText/headerId (banner, notice, toast, modal)
// ---------------------------------------------------------------------------

describe('title → header-text (banner, notice, toast, modal)', () => {
  it('renames title on dt-banner', () => {
    const { transformed } = transformContent('<dt-banner title="Alert" />');
    assert.equal(transformed, '<dt-banner header-text="Alert" />');
  });

  it('renames title-id on dt-banner', () => {
    const { transformed } = transformContent('<dt-banner title-id="hdr" />');
    assert.equal(transformed, '<dt-banner header-id="hdr" />');
  });

  it('renames title on dt-notice', () => {
    const { transformed } = transformContent('<dt-notice title="Info" />');
    assert.equal(transformed, '<dt-notice header-text="Info" />');
  });

  it('renames title-id on dt-notice', () => {
    const { transformed } = transformContent('<dt-notice title-id="notice-hdr" />');
    assert.equal(transformed, '<dt-notice header-id="notice-hdr" />');
  });

  it('renames title on dt-toast', () => {
    const { transformed } = transformContent('<dt-toast title="Done!" />');
    assert.equal(transformed, '<dt-toast header-text="Done!" />');
  });

  it('renames title on dt-modal', () => {
    const { transformed } = transformContent('<dt-modal title="Confirm" />');
    assert.equal(transformed, '<dt-modal header-text="Confirm" />');
  });

  it('renames banner-title on dt-modal', () => {
    const { transformed } = transformContent('<dt-modal banner-title="Warning" />');
    assert.equal(transformed, '<dt-modal banner-header-text="Warning" />');
  });

  it('renames bound :title on dt-banner', () => {
    const { transformed } = transformContent('<dt-banner :title="alertTitle" />');
    assert.equal(transformed, '<dt-banner :header-text="alertTitle" />');
  });

  it('does not rename title on unrelated components', () => {
    const input = '<dt-avatar title="Profile" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });
});

// ---------------------------------------------------------------------------
// DLT-3159 — label-visible → show-label
// ---------------------------------------------------------------------------

describe('label-visible → show-label', () => {
  it('renames on dt-input', () => {
    const { transformed } = transformContent('<dt-input label-visible="false" />');
    assert.equal(transformed, '<dt-input show-label="false" />');
  });

  it('renames on dt-checkbox', () => {
    const { transformed } = transformContent('<dt-checkbox label-visible="true" />');
    assert.equal(transformed, '<dt-checkbox show-label="true" />');
  });

  it('renames on dt-combobox', () => {
    const { transformed } = transformContent('<dt-combobox :label-visible="showLabel" />');
    assert.equal(transformed, '<dt-combobox :show-label="showLabel" />');
  });

  it('renames on dt-toggle', () => {
    const { transformed } = transformContent('<dt-toggle label-visible="false" />');
    assert.equal(transformed, '<dt-toggle show-label="false" />');
  });

  it('renames on dt-select-menu', () => {
    const { transformed } = transformContent('<dt-select-menu label-visible="false" />');
    assert.equal(transformed, '<dt-select-menu show-label="false" />');
  });

  it('does not rename on components without this prop', () => {
    const input = '<dt-badge label-visible="false" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });
});

// ---------------------------------------------------------------------------
// DLT-3159 — Inverted boolean props (hide-X → :show-X="false")
// ---------------------------------------------------------------------------

describe('hide-close → :show-close="false"', () => {
  it('converts bare boolean hide-close on dt-banner', () => {
    const { transformed } = transformContent('<dt-banner hide-close />');
    assert.equal(transformed, '<dt-banner :show-close="false" />');
  });

  it('converts :hide-close="true" on dt-chip', () => {
    const { transformed } = transformContent('<dt-chip :hide-close="true" />');
    assert.equal(transformed, '<dt-chip :show-close="false" />');
  });

  it('removes :hide-close="false" on dt-modal (default is show)', () => {
    const { transformed } = transformContent('<dt-modal :hide-close="false" />');
    assert.equal(transformed, '<dt-modal  />');
  });

  it('converts bare hide-close on dt-notice', () => {
    const { transformed } = transformContent('<dt-notice hide-close />');
    assert.equal(transformed, '<dt-notice :show-close="false" />');
  });

  it('converts bare hide-close on dt-toast', () => {
    const { transformed } = transformContent('<dt-toast hide-close />');
    assert.equal(transformed, '<dt-toast :show-close="false" />');
  });

  it('emits a warning for dynamic :hide-close expressions', () => {
    const { warnings } = transformContent('<dt-banner :hide-close="someVar" />');
    assert.ok(warnings.some(w => w.includes('Cannot auto-invert')));
  });

  it('converts bare hide-close on a non-self-closing tag', () => {
    const { transformed } = transformContent('<dt-banner hide-close>Content</dt-banner>');
    assert.equal(transformed, '<dt-banner :show-close="false">Content</dt-banner>');
  });
});

describe('hide-icon → :show-icon="false"', () => {
  it('converts bare hide-icon on dt-banner', () => {
    const { transformed } = transformContent('<dt-banner hide-icon />');
    assert.equal(transformed, '<dt-banner :show-icon="false" />');
  });

  it('converts :hide-icon="true" on dt-notice', () => {
    const { transformed } = transformContent('<dt-notice :hide-icon="true" />');
    assert.equal(transformed, '<dt-notice :show-icon="false" />');
  });

  it('does not apply hide-icon rename to dt-chip (not in map)', () => {
    const input = '<dt-chip hide-icon />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });
});

describe('hide-action → :show-action="false"', () => {
  it('converts bare hide-action on dt-toast', () => {
    const { transformed } = transformContent('<dt-toast hide-action />');
    assert.equal(transformed, '<dt-toast :show-action="false" />');
  });
});

describe('hide-clear → :show-clear="false" (dt-filter-pill)', () => {
  it('converts bare hide-clear', () => {
    const { transformed } = transformContent('<dt-filter-pill hide-clear />');
    assert.equal(transformed, '<dt-filter-pill :show-clear="false" />');
  });

  it('removes :hide-clear="false"', () => {
    const { transformed } = transformContent('<dt-filter-pill :hide-clear="false" />');
    assert.equal(transformed, '<dt-filter-pill  />');
  });
});

// ---------------------------------------------------------------------------
// DLT-3157 — kind and validation-state value renames
// ---------------------------------------------------------------------------

describe('kind value renames', () => {
  it('renames kind="danger" → kind="critical"', () => {
    const { transformed } = transformContent('<dt-button kind="danger" />');
    assert.equal(transformed, '<dt-button kind="critical" />');
  });

  it('renames kind="error" → kind="critical"', () => {
    const { transformed } = transformContent('<dt-banner kind="error" />');
    assert.equal(transformed, '<dt-banner kind="critical" />');
  });

  it('renames kind="success" → kind="positive"', () => {
    const { transformed } = transformContent('<dt-badge kind="success" />');
    assert.equal(transformed, '<dt-badge kind="positive" />');
  });

  it('renames bound :kind="\'danger\'"', () => {
    const { transformed } = transformContent('<dt-link :kind="\'danger\'" />');
    assert.equal(transformed, '<dt-link :kind="\'critical\'" />');
  });

  it('does not alter kind="muted"', () => {
    const input = '<dt-button kind="muted" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('does not alter kind="default"', () => {
    const input = '<dt-badge kind="default" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });
});

describe('validation-state value renames', () => {
  it('renames validation-state="error" → "critical"', () => {
    const { transformed } = transformContent('<dt-input validation-state="error" />');
    assert.equal(transformed, '<dt-input validation-state="critical" />');
  });

  it('renames validation-state="success" → "positive"', () => {
    const { transformed } = transformContent('<dt-checkbox validation-state="success" />');
    assert.equal(transformed, '<dt-checkbox validation-state="positive" />');
  });

  it('does not alter validation-state="warning"', () => {
    const input = '<dt-input validation-state="warning" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });
});

// ---------------------------------------------------------------------------
// DLT-3283 — Slot renames
// ---------------------------------------------------------------------------

describe('slot renames', () => {
  it('renames #titleOverride → #header', () => {
    const { transformed } = transformContent('<template #titleOverride>Custom</template>');
    assert.equal(transformed, '<template #header>Custom</template>');
  });

  it('renames v-slot:titleOverride → v-slot:header', () => {
    const { transformed } = transformContent('<template v-slot:titleOverride>Custom</template>');
    assert.equal(transformed, '<template v-slot:header>Custom</template>');
  });

  it('renames slot="titleOverride" → slot="header"', () => {
    const { transformed } = transformContent('<span slot="titleOverride">Custom</span>');
    assert.equal(transformed, '<span slot="header">Custom</span>');
  });

  it('renames #labelSlot → #label', () => {
    const { transformed } = transformContent('<template #labelSlot>Label text</template>');
    assert.equal(transformed, '<template #label>Label text</template>');
  });

  it('renames v-slot:labelSlot → v-slot:label', () => {
    const { transformed } = transformContent('<template v-slot:labelSlot>Label</template>');
    assert.equal(transformed, '<template v-slot:label>Label</template>');
  });

  it('renames #headingSlot → #heading', () => {
    const { transformed } = transformContent('<template #headingSlot>Group name</template>');
    assert.equal(transformed, '<template #heading>Group name</template>');
  });
});

// ---------------------------------------------------------------------------
// DLT-3100 — rootClass removal warning
// ---------------------------------------------------------------------------

describe('rootClass removal warning', () => {
  it('emits a warning for root-class on dt-avatar', () => {
    const { warnings } = transformContent('<dt-avatar root-class="d-w300" />');
    assert.ok(warnings.some(w => w.includes('root-class')));
    assert.ok(warnings.some(w => w.includes('dt-avatar')));
  });

  it('auto-migrates :rootClass on dt-input instead of warning', () => {
    const { transformed, warnings } = transformContent('<dt-input :rootClass="myClass" />');
    assert.equal(transformed, '<dt-input :class="myClass" />');
    assert.equal(warnings.filter(w => w.includes('rootClass')).length, 0);
  });

  it('does not alter the tag content for rootClass', () => {
    const input = '<dt-avatar root-class="d-w300" />';
    const { transformed } = transformContent(input);
    assert.equal(transformed, input);
  });
});

// ---------------------------------------------------------------------------
// DLT-3100 — rootClass / wrapperClass / containerClass auto-migration
// ---------------------------------------------------------------------------

describe('root-class auto-migration', () => {
  it('renames root-class to class on dt-input', () => {
    const { transformed, count } = transformContent('<dt-input root-class="d-w100p" />');
    assert.equal(transformed, '<dt-input class="d-w100p" />');
    assert.equal(count, 1);
  });

  it('renames rootClass (camelCase) to class on dt-checkbox', () => {
    const { transformed } = transformContent('<dt-checkbox rootClass="d-ml8" />');
    assert.equal(transformed, '<dt-checkbox class="d-ml8" />');
  });

  it('renames :root-class dynamic binding to :class on dt-radio', () => {
    const { transformed } = transformContent('<dt-radio :root-class="myClass" />');
    assert.equal(transformed, '<dt-radio :class="myClass" />');
  });

  it('renames :rootClass camelCase dynamic binding to :class on dt-select-menu', () => {
    const { transformed } = transformContent('<dt-select-menu :rootClass="myClass" />');
    assert.equal(transformed, '<dt-select-menu :class="myClass" />');
  });

  it('merges root-class into existing class on dt-input', () => {
    const { transformed } = transformContent('<dt-input class="d-mt8" root-class="d-w100p" />');
    assert.equal(transformed, '<dt-input class="d-mt8 d-w100p"  />');
  });

  it('warns and leaves tag unchanged when :root-class clashes with existing :class', () => {
    const input = '<dt-input :class="baseClass" :root-class="extraClass" />';
    const { transformed, warnings } = transformContent(input);
    assert.equal(transformed, input);
    assert.ok(warnings.some(w => w.includes('Cannot auto-merge')));
  });

  it('renames wrapper-class to class on dt-toggle', () => {
    const { transformed } = transformContent('<dt-toggle wrapper-class="d-w100p" />');
    assert.equal(transformed, '<dt-toggle class="d-w100p" />');
  });

  it('renames wrapper-class to class on dt-feed-item-pill', () => {
    const { transformed } = transformContent('<dt-feed-item-pill wrapper-class="d-p8" />');
    assert.equal(transformed, '<dt-feed-item-pill class="d-p8" />');
  });

  it('renames container-class to class on dt-card', () => {
    const { transformed } = transformContent('<dt-card container-class="d-bgc-primary" />');
    assert.equal(transformed, '<dt-card class="d-bgc-primary" />');
  });

  it('renames root-class on dt-breadcrumb-item', () => {
    const { transformed } = transformContent('<dt-breadcrumb-item root-class="d-fw-bold" />');
    assert.equal(transformed, '<dt-breadcrumb-item class="d-fw-bold" />');
  });

  it('renames root-class on dt-split-button', () => {
    const { transformed } = transformContent('<dt-split-button root-class="d-mt16" />');
    assert.equal(transformed, '<dt-split-button class="d-mt16" />');
  });

  it('still warns for root-class on components not in the migration map', () => {
    const { warnings } = transformContent('<dt-avatar root-class="d-w300" />');
    assert.ok(warnings.some(w => w.includes('root-class')));
    assert.ok(warnings.some(w => w.includes('dt-avatar')));
  });

  it('handles PascalCase DtInput', () => {
    const { transformed } = transformContent('<DtInput root-class="d-w100p" />');
    assert.equal(transformed, '<DtInput class="d-w100p" />');
  });
});

// ---------------------------------------------------------------------------
// Non-Dialtone components are not transformed
// ---------------------------------------------------------------------------

describe('does not transform non-Dialtone components', () => {
  it('ignores bare HTML elements', () => {
    const input = '<div kind="error">text</div>';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('ignores components without dt- prefix', () => {
    const input = '<my-modal :show="open" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('ignores app-prefixed components', () => {
    const input = '<app-banner kind="error" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });
});

// ---------------------------------------------------------------------------
// PascalCase component names
// ---------------------------------------------------------------------------

describe('PascalCase component names', () => {
  it('transforms DtModal :show → :open', () => {
    const { transformed } = transformContent('<DtModal :show="isOpen" />');
    assert.equal(transformed, '<DtModal :open="isOpen" />');
  });

  it('transforms DtBanner title → header-text', () => {
    const { transformed } = transformContent('<DtBanner title="Alert" />');
    assert.equal(transformed, '<DtBanner header-text="Alert" />');
  });

  it('transforms DtButton kind="danger"', () => {
    const { transformed } = transformContent('<DtButton kind="danger" />');
    assert.equal(transformed, '<DtButton kind="critical" />');
  });
});

// ---------------------------------------------------------------------------
// Multiple transforms in one tag / file
// ---------------------------------------------------------------------------

describe('multiple transforms', () => {
  it('applies several renames in a single tag', () => {
    const input = '<dt-banner title="Oops" kind="error" hide-close />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, '<dt-banner header-text="Oops" kind="critical" :show-close="false" />');
    assert.ok(count >= 3);
  });

  it('transforms multiple components in one template', () => {
    const input = `<template>
  <dt-avatar clickable />
  <dt-modal :show="open" @update:show="close" />
  <dt-badge kind="success" />
</template>`;
    const expected = `<template>
  <dt-avatar interactive />
  <dt-modal :open="open" @update:open="close" />
  <dt-badge kind="positive" />
</template>`;
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('handles multiline component tags', () => {
    const input = `<dt-banner
  title="Alert"
  kind="error"
  hide-icon
/>`;
    const expected = `<dt-banner
  header-text="Alert"
  kind="critical"
  :show-icon="false"
/>`;
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('edge cases', () => {
  it('returns count 0 for content with no matches', () => {
    const input = '<div><span>No Dialtone here</span></div>';
    const { count } = transformContent(input);
    assert.equal(count, 0);
  });

  it('handles empty string', () => {
    const { transformed, count } = transformContent('');
    assert.equal(transformed, '');
    assert.equal(count, 0);
  });

  it('does not change already-migrated props', () => {
    const input = '<dt-modal :open="isOpen" @update:open="close" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('does not change already-migrated kind="critical"', () => {
    const input = '<dt-badge kind="critical" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('does not change kind inside text content of a tag', () => {
    const input = '<dt-text>Use kind="error" on inputs</dt-text>';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });
});
