/**
 * @fileoverview Detects usage of removed structural class props on Dialtone Vue components.
 * @author belu.montoya@dialpad.com
 */
"use strict";

// ---------------------------------------------------------------------------
// Component data — loaded from @dialpad/dialtone-vue/component-documentation.json.
// In production this is the consumer's installed dialtone-vue version.
// In tests this require is stubbed via proxyquire so tests are deterministic.
// ---------------------------------------------------------------------------

let components = [];

try {
  components = require("@dialpad/dialtone-vue/component-documentation.json");
} catch {
  console.warn(
    "[eslint-plugin-dialtone] Could not load component-documentation.json from @dialpad/dialtone-vue. " +
    "The deprecated-class-props rule will not flag anything. " +
    "Ensure @dialpad/dialtone-vue is installed as a peer dependency."
  );
}

// Defensive: handle malformed data (not an array) gracefully.
if (!Array.isArray(components)) components = [];

// Pre-build a Map<displayName, Set<propName>> for O(1) lookup. Built once at module load.
const componentPropsMap = new Map(
  components
    .filter(c => c && typeof c.displayName === "string")
    .map(c => [c.displayName, new Set((c.props ?? []).map(p => p?.name).filter(Boolean))]),
);

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MIGRATION_URL = "https://dialtone.dialpad.com/guides/migration/component-props/";

// vue-eslint-parser lowercases static attribute names (rootClass → rootclass).
// This map covers both kebab-case (preserved) and camelCase (lowercased).
// Value: { camel: canonical camelCase for prop lookup, display: name for message }
const STATIC_ATTR_MAP = new Map([
  ["root-class",      { camel: "rootClass",      display: "root-class" }],
  ["rootclass",       { camel: "rootClass",      display: "rootClass" }],
  ["wrapper-class",   { camel: "wrapperClass",   display: "wrapper-class" }],
  ["wrapperclass",    { camel: "wrapperClass",   display: "wrapperClass" }],
  ["container-class", { camel: "containerClass", display: "container-class" }],
  ["containerclass",  { camel: "containerClass", display: "containerClass" }],
]);

// For dynamic (v-bind/:) attributes, we use rawName which preserves original casing.
const DYNAMIC_ATTR_MAP = new Map([
  ["root-class",      { camel: "rootClass",      display: "root-class" }],
  ["rootClass",       { camel: "rootClass",      display: "rootClass" }],
  ["wrapper-class",   { camel: "wrapperClass",   display: "wrapper-class" }],
  ["wrapperClass",    { camel: "wrapperClass",   display: "wrapperClass" }],
  ["container-class", { camel: "containerClass", display: "container-class" }],
  ["containerClass",  { camel: "containerClass", display: "containerClass" }],
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function tagNameToPascal (name) {
  if (/^[A-Z]/.test(name)) return name;
  return name.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

function isDialtoneTag (rawName) {
  return /^dt-[a-z]/.test(rawName) || /^Dt[A-Z]/.test(rawName);
}

function componentDeclaresProp (displayName, camelPropName) {
  return componentPropsMap.get(displayName)?.has(camelPropName) ?? false;
}

function isStaticClassAttr (attr) {
  return !attr.directive && attr.key && attr.key.name === "class";
}

function isDynamicClassAttr (attr) {
  return (
    attr.directive &&
    attr.key?.name?.name === "bind" &&
    attr.key?.argument?.rawName === "class"
  );
}

// Remove `attr` and any whitespace that precedes it (handles spaces, tabs, multi-space).
function removeAttrWithLeadingSpace (fixer, fullSource, attr) {
  let remStart = attr.range[0];
  while (remStart > 0 && /\s/.test(fullSource[remStart - 1])) remStart--;
  return fixer.removeRange([remStart, attr.range[1]]);
}

// Detect whether an attribute is one of the deprecated class props we care about.
// Returns { entry, dynamic } or null.
function classifyDeprecatedAttr (attr) {
  if (!attr.directive && attr.key) {
    const entry = STATIC_ATTR_MAP.get(attr.key.name);
    if (entry) return { entry, dynamic: false };
  }
  if (
    attr.directive &&
    attr.key?.name?.name === "bind" &&
    attr.key?.argument?.rawName
  ) {
    const entry = DYNAMIC_ATTR_MAP.get(attr.key.argument.rawName);
    if (entry) return { entry, dynamic: true };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Rule Definition
// ---------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Detects usage of removed structural class props on Dialtone Vue components",
      recommended: false,
      url: "https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-class-props.md",
    },
    fixable: "code",
    schema: [],
    messages: {
      propRemoved: "{{displayName}} does not accept a '{{propName}}' prop. Use the native 'class' attribute instead. See: " + MIGRATION_URL,
    },
  },

  create (context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();

    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VElement (node) {
        const rawName = node.rawName;
        if (!isDialtoneTag(rawName)) return;

        const displayName = tagNameToPascal(rawName);
        const attrs = node.startTag.attributes;

        // Collect every deprecated class-prop attribute on this element.
        const deprecated = [];
        for (const attr of attrs) {
          const cls = classifyDeprecatedAttr(attr);
          if (!cls) continue;
          if (componentDeclaresProp(displayName, cls.entry.camel)) continue;
          deprecated.push({ attr, ...cls });
        }
        if (deprecated.length === 0) return;

        const existingStaticClass = attrs.find(a => isStaticClassAttr(a));
        const existingDynClass = attrs.find(a => isDynamicClassAttr(a));

        const staticDeps = deprecated.filter(d => !d.dynamic);
        const dynamicDeps = deprecated.filter(d => d.dynamic);

        // Dynamic autofix is only safe when exactly one dynamic deprecated attr exists
        // AND there is no existing :class (two dynamic class expressions can't be merged
        // automatically — would require building an array literal).
        const dynamicFixable = dynamicDeps.length === 1 && !existingDynClass;

        // Build a single element-level fix that ESLint applies once per pass.
        // Attached to the first reported attr; subsequent reports get no fix.
        const elementFix = (fixer) => {
          const fixes = [];
          const fullSource = sourceCode.getText();

          // --- Static side ---
          if (staticDeps.length > 0) {
            const addedValues = staticDeps
              .map(d => d.attr.value?.value ?? "")
              .filter(Boolean);

            if (existingStaticClass) {
              const existingVal = existingStaticClass.value?.value ?? "";
              const merged = [existingVal, ...addedValues].filter(Boolean).join(" ");
              fixes.push(fixer.replaceText(existingStaticClass, `class="${merged}"`));
              for (const d of staticDeps) {
                fixes.push(removeAttrWithLeadingSpace(fixer, fullSource, d.attr));
              }
            } else {
              // No existing class: first static dep becomes the consolidated class, rest are removed.
              const merged = addedValues.join(" ");
              fixes.push(fixer.replaceText(staticDeps[0].attr, `class="${merged}"`));
              for (const d of staticDeps.slice(1)) {
                fixes.push(removeAttrWithLeadingSpace(fixer, fullSource, d.attr));
              }
            }
          }

          // --- Dynamic side ---
          if (dynamicFixable) {
            const dyn = dynamicDeps[0];
            const valueText = sourceCode.getText(dyn.attr.value);
            // Preserve `v-bind:` long form vs `:` shorthand to avoid stylistic mutation.
            const prefix = sourceCode.getText(dyn.attr).startsWith("v-bind:") ? "v-bind:class" : ":class";
            fixes.push(fixer.replaceText(dyn.attr, `${prefix}=${valueText}`));
          }
          // If !dynamicFixable, dynamic deps stay as warnings with no autofix.

          return fixes.length > 0 ? fixes : null;
        };

        deprecated.forEach((dep, idx) => {
          context.report({
            node: dep.attr,
            messageId: "propRemoved",
            data: { displayName, propName: dep.entry.display },
            fix: idx === 0 ? elementFix : () => null,
          });
        });
      },
    });
  },
};
