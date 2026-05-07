/**
 * @fileoverview Tests for deprecated-class-props rule.
 */
"use strict";

const RuleTester = require("eslint").RuleTester;
const proxyquire = require("proxyquire").noCallThru();

// Post-deprecation fixture: mirrors what component-documentation.json will look like
// once DLT-3100 ships. DtListItem keeps wrapperClass (it was never deprecated).
const MOCK_COMPONENTS = [
  // post-deprecation: rootClass removed
  { displayName: "DtInput", props: [{ name: "label" }, { name: "value" }, { name: "showLabel" }] },
  // Regression — DtListItem currently declares wrapperClass, must NOT be flagged.
  // Source-of-truth: dialtone-vue components/list_item/list_item.vue (wrapperClass at line 143 on staging)
  { displayName: "DtListItem", props: [{ name: "wrapperClass" }, { name: "label" }, { name: "size" }] },
  // post-deprecation: wrapperClass removed
  { displayName: "DtToggle", props: [{ name: "label" }, { name: "showLabel" }, { name: "disabled" }] },
  // post-deprecation: containerClass removed
  { displayName: "DtCard", props: [{ name: "header" }, { name: "footer" }] },
  // never had rootClass (confirmed via git log — 0 commits ever touched rootClass in avatar/)
  { displayName: "DtAvatar", props: [{ name: "fullName" }, { name: "interactive" }, { name: "avatarClass" }] },
  // post-deprecation: wrapperClass removed
  { displayName: "DtFeedItemPill", props: [{ name: "kind" }, { name: "label" }] },
];

const rule = proxyquire("../../../lib/rules/deprecated-class-props", {
  "@dialpad/dialtone-vue/component-documentation.json": MOCK_COMPONENTS,
});

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require("vue-eslint-parser"),
    parserOptions: { ecmaVersion: "latest" },
  },
});

const URL = "https://dialtone.dialpad.com/guides/migration/component-props/";
const msg = (displayName, propName) =>
  `${displayName} does not accept a '${propName}' prop. Use the native 'class' attribute instead. See: ${URL}`;

// ---------------------------------------------------------------------------
// Detection tests
// ---------------------------------------------------------------------------

ruleTester.run("deprecated-class-props (detection)", rule, {
  valid: [
    // Correct usage — native class attribute
    { code: "<template><dt-input class=\"d-w332\" /></template>" },
    { code: "<template><dt-input :class=\"expr\" /></template>" },
    // No offending attribute at all
    { code: "<template><dt-input /></template>" },
    // Non-Dialtone tags — must never fire
    { code: "<template><div root-class=\"x\" /></template>" },
    { code: "<template><span wrapper-class=\"x\" /></template>" },
    // Regression — DtListItem currently declares wrapperClass, must NOT be flagged
    { code: "<template><dt-list-item wrapper-class=\"d-pt8\" /></template>" },
    { code: "<template><dt-list-item :wrapper-class=\"cls\" /></template>" },
  ],

  invalid: [
    // --- rootClass variants on DtInput (anchor for detection tests) ---
    {
      code: "<template><dt-input root-class=\"x\" /></template>",
      errors: [{ message: msg("DtInput", "root-class") }],
      output: "<template><dt-input class=\"x\" /></template>",
    },
    {
      code: "<template><dt-input rootClass=\"x\" /></template>",
      errors: [{ message: msg("DtInput", "rootClass") }],
      output: "<template><dt-input class=\"x\" /></template>",
    },
    {
      code: "<template><dt-input :root-class=\"expr\" /></template>",
      errors: [{ message: msg("DtInput", "root-class") }],
      output: "<template><dt-input :class=\"expr\" /></template>",
    },
    {
      code: "<template><dt-input :rootClass=\"expr\" /></template>",
      errors: [{ message: msg("DtInput", "rootClass") }],
      output: "<template><dt-input :class=\"expr\" /></template>",
    },
    // PascalCase tag name
    {
      code: "<template><DtInput rootClass=\"x\" /></template>",
      errors: [{ message: msg("DtInput", "rootClass") }],
      output: "<template><DtInput class=\"x\" /></template>",
    },
    // wrapperClass on DtToggle (different prop, MOCK has no wrapperClass for DtToggle)
    {
      code: "<template><dt-toggle wrapper-class=\"x\" /></template>",
      errors: [{ message: msg("DtToggle", "wrapper-class") }],
      output: "<template><dt-toggle class=\"x\" /></template>",
    },
    // containerClass on DtCard
    {
      code: "<template><dt-card container-class=\"x\" /></template>",
      errors: [{ message: msg("DtCard", "container-class") }],
      output: "<template><dt-card class=\"x\" /></template>",
    },
    // Multi-segment kebab tag normalization check
    {
      code: "<template><dt-feed-item-pill wrapper-class=\"x\" /></template>",
      errors: [{ message: msg("DtFeedItemPill", "wrapper-class") }],
      output: "<template><dt-feed-item-pill class=\"x\" /></template>",
    },
    // "Never had it" case — DtAvatar (defensive: listed in migration docs)
    {
      code: "<template><dt-avatar root-class=\"x\" /></template>",
      errors: [{ message: msg("DtAvatar", "root-class") }],
      output: "<template><dt-avatar class=\"x\" /></template>",
    },
    // Sanity: DtListItem has wrapperClass but NOT rootClass — must still fire for rootClass
    {
      code: "<template><dt-list-item root-class=\"x\" /></template>",
      errors: [{ message: msg("DtListItem", "root-class") }],
      output: "<template><dt-list-item class=\"x\" /></template>",
    },
  ],
});

// ---------------------------------------------------------------------------
// Autofix tests
// ---------------------------------------------------------------------------

ruleTester.run("deprecated-class-props (autofix)", rule, {
  valid: [],
  invalid: [
    // Scenario 1: static, no existing class → simple rename
    {
      code: "<template><dt-input root-class=\"d-w332\" /></template>",
      errors: 1,
      output: "<template><dt-input class=\"d-w332\" /></template>",
    },
    // Scenario 2a: static, existing class before offending attr → merge
    {
      code: "<template><dt-input class=\"other\" root-class=\"d-w332\" /></template>",
      errors: 1,
      output: "<template><dt-input class=\"other d-w332\" /></template>",
    },
    // Scenario 2b: static, offending attr before existing class → merge
    {
      code: "<template><dt-input root-class=\"d-w332\" class=\"other\" /></template>",
      errors: 1,
      output: "<template><dt-input class=\"other d-w332\" /></template>",
    },
    // Scenario 3: dynamic, no existing :class → rename
    {
      code: "<template><dt-input :root-class=\"cls\" /></template>",
      errors: 1,
      output: "<template><dt-input :class=\"cls\" /></template>",
    },
    // Scenario 4: dynamic, existing :class → warn only (no autofix)
    {
      code: "<template><dt-input :root-class=\"cls\" :class=\"other\" /></template>",
      errors: 1,
      output: null,
    },
    // Scenario 5: two different offending static props on the same element → merged into single class
    {
      code: "<template><dt-input root-class=\"a\" wrapper-class=\"b\" /></template>",
      errors: 2,
      output: "<template><dt-input class=\"a b\" /></template>",
    },
    // Scenario 6: two static deprecated + existing class → all merged into the existing class
    {
      code: "<template><dt-input class=\"orig\" root-class=\"a\" wrapper-class=\"b\" /></template>",
      errors: 2,
      output: "<template><dt-input class=\"orig a b\" /></template>",
    },
    // Scenario 7: mixed static + dynamic deprecated, no existing class/:class → handled independently
    {
      code: "<template><dt-input root-class=\"a\" :wrapper-class=\"expr\" /></template>",
      errors: 2,
      output: "<template><dt-input class=\"a\" :class=\"expr\" /></template>",
    },
    // Scenario 8: v-bind long-form preserved (not collapsed to shorthand)
    {
      code: "<template><dt-input v-bind:root-class=\"expr\" /></template>",
      errors: 1,
      output: "<template><dt-input v-bind:class=\"expr\" /></template>",
    },
    // Scenario 9: HTML entities in class value round-trip without corruption
    // (e.g. data-attribute selectors stored in class strings during dev tooling)
    {
      code: "<template><dt-input root-class=\"foo &amp; bar\" /></template>",
      errors: 1,
      output: "<template><dt-input class=\"foo &amp; bar\" /></template>",
    },
    // Scenario 10: Vue 3.4+ same-name shorthand (`:rootClass` with no value).
    // attr.value is null in the AST — fixer must expand to :class="rootClass" using
    // the camelCase form (the variable name Vue would have implicitly referenced).
    {
      code: "<template><dt-input :rootClass /></template>",
      errors: 1,
      output: "<template><dt-input :class=\"rootClass\" /></template>",
    },
    // Scenario 11: two dynamic deprecated props, no existing :class.
    // dynamicFixable is false (length > 1), so the rule warns on both but
    // emits no autofix — two arbitrary expressions can't be auto-merged into one
    // :class binding without changing semantics.
    {
      code: "<template><dt-input :root-class=\"a\" :wrapper-class=\"b\" /></template>",
      errors: 2,
      output: null,
    },
  ],
});

// ---------------------------------------------------------------------------
// Fail-closed behavior: components without validated metadata in the JSON
// must NOT be flagged. Covers two cases:
//   1. Component entry is missing entirely (unknown to installed dialtone-vue)
//   2. Component entry exists but `props` is malformed (not an array)
// ---------------------------------------------------------------------------

const MALFORMED_MOCK = [
  // Valid: DtInput is fine
  { displayName: "DtInput", props: [{ name: "label" }] },
  // Malformed: props is an object, not an array
  { displayName: "DtMalformed", props: { name: "rootClass" } },
  // Malformed: props is missing entirely
  { displayName: "DtNoProps" },
  // Malformed: entry is null
  null,
  // Malformed: displayName is not a string
  { displayName: 42, props: [] },
];

const malformedRule = proxyquire("../../../lib/rules/deprecated-class-props", {
  "@dialpad/dialtone-vue/component-documentation.json": MALFORMED_MOCK,
});

ruleTester.run("deprecated-class-props (fail-closed)", malformedRule, {
  valid: [
    // DtMalformed has malformed props — rule must NOT fire even though it looks deprecated
    { code: "<template><dt-malformed root-class=\"x\" /></template>" },
    // DtNoProps is missing props field — rule must NOT fire
    { code: "<template><dt-no-props root-class=\"x\" /></template>" },
    // DtUnknown is not in the JSON at all — rule must NOT fire
    { code: "<template><dt-unknown root-class=\"x\" /></template>" },
  ],
  invalid: [
    // DtInput is valid in this fixture and has no rootClass — should still fire
    {
      code: "<template><dt-input root-class=\"x\" /></template>",
      errors: 1,
      output: "<template><dt-input class=\"x\" /></template>",
    },
  ],
});

// ---------------------------------------------------------------------------
// Regression: components currently declaring these prop names must NOT fire.
// Source-of-truth: git log confirms DtListItem has wrapperClass at staging:
// packages/dialtone-vue/components/list_item/list_item.vue line 143.
// These cases verify the data-driven design — if the lookup logic breaks or
// the fixture shape changes, these tests catch false positives early.
// ---------------------------------------------------------------------------

ruleTester.run("deprecated-class-props (regression)", rule, {
  valid: [
    { code: "<template><dt-list-item wrapper-class=\"d-pt8\" /></template>" },
    { code: "<template><dt-list-item :wrapper-class=\"cls\" /></template>" },
  ],
  invalid: [],
});

// ---------------------------------------------------------------------------
// Integration smoke test: realistic multi-line template covering all scenarios.
// Validates detection count and exact post-fix output in one shot.
// Uses the same MOCK_COMPONENTS fixture as unit tests — fully deterministic.
// ---------------------------------------------------------------------------

ruleTester.run("deprecated-class-props (integration)", rule, {
  valid: [
    {
      code: [
        "<template>",
        "  <dt-input class=\"d-pl8\" />",
        "  <dt-list-item wrapper-class=\"d-pt8\" />",
        "</template>",
      ].join("\n"),
    },
  ],
  invalid: [
    {
      code: [
        "<template>",
        "  <dt-input root-class=\"d-w332\" label=\"Email\" />",
        "  <dt-toggle wrapper-class=\"d-mt16\" />",
        "  <dt-card container-class=\"d-mbs-300\" />",
        "  <dt-avatar root-class=\"d-mr8\" />",
        "  <dt-input :root-class=\"myClass\" />",
        "  <dt-input :root-class=\"myClass\" :class=\"otherClass\" />",
        "  <dt-list-item wrapper-class=\"d-pt8\" />",
        "  <dt-input class=\"d-pl8\" root-class=\"d-w332\" />",
        "</template>",
      ].join("\n"),
      errors: 7,
      output: [
        "<template>",
        "  <dt-input class=\"d-w332\" label=\"Email\" />",
        "  <dt-toggle class=\"d-mt16\" />",
        "  <dt-card class=\"d-mbs-300\" />",
        "  <dt-avatar class=\"d-mr8\" />",
        "  <dt-input :class=\"myClass\" />",
        "  <dt-input :root-class=\"myClass\" :class=\"otherClass\" />",
        "  <dt-list-item wrapper-class=\"d-pt8\" />",
        "  <dt-input class=\"d-pl8 d-w332\" />",
        "</template>",
      ].join("\n"),
    },
  ],
});

// ---------------------------------------------------------------------------
// Idempotency: applying the autofix twice yields no further changes.
// The already-fixed code must NOT trigger any new warnings.
// ---------------------------------------------------------------------------

ruleTester.run("deprecated-class-props (idempotency)", rule, {
  valid: [
    // Output of autofix scenario 1 (static rename) — no further warning
    { code: "<template><dt-input class=\"d-w332\" /></template>" },
    // Output of autofix scenario 2 (static merge) — no further warning
    { code: "<template><dt-input class=\"other d-w332\" /></template>" },
    // Output of autofix scenario 3 (dynamic rename) — no further warning
    { code: "<template><dt-input :class=\"cls\" /></template>" },
  ],
  invalid: [],
});
