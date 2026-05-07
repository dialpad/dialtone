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
  const comp = components.find(c => c.displayName === displayName);
  return Boolean(comp?.props?.some(p => p.name === camelPropName));
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

        for (const attr of attrs) {
          let entry = null;
          let dynamic = false;

          // Static attribute: root-class="x" or rootClass="x"
          if (!attr.directive && attr.key) {
            entry = STATIC_ATTR_MAP.get(attr.key.name);
          }

          // Dynamic (v-bind shorthand): :root-class="expr" or :rootClass="expr"
          if (
            attr.directive &&
            attr.key?.name?.name === "bind" &&
            attr.key?.argument?.rawName
          ) {
            const dynEntry = DYNAMIC_ATTR_MAP.get(attr.key.argument.rawName);
            if (dynEntry) {
              entry = dynEntry;
              dynamic = true;
            }
          }

          if (!entry) continue;
          if (componentDeclaresProp(displayName, entry.camel)) continue;

          const propName = entry.display;

          context.report({
            node: attr,
            messageId: "propRemoved",
            data: { displayName, propName },
            fix (fixer) {
              const fullSource = sourceCode.getText();

              if (dynamic) {
                // Find existing :class binding on this element
                const existingDynClass = attrs.find(a => isDynamicClassAttr(a) && a !== attr);
                if (existingDynClass) {
                  // Cannot merge two dynamic bindings — warn only, no fix
                  return null;
                }
                // Rename :prop="expr" → :class="expr"
                const valueText = sourceCode.getText(attr.value);
                return fixer.replaceText(attr, `:class=${valueText}`);
              } else {
                // Static attr: get the string value (without surrounding quotes)
                const addedVal = attr.value ? attr.value.value : "";
                const existingStaticClass = attrs.find(a => isStaticClassAttr(a) && a !== attr);

                if (existingStaticClass) {
                  // Merge: remove offending attr + append value to existing class
                  const existingVal = existingStaticClass.value.value;
                  return [
                    removeAttrWithLeadingSpace(fixer, fullSource, attr),
                    fixer.replaceText(existingStaticClass, `class="${existingVal} ${addedVal}"`),
                  ];
                } else {
                  // Simple rename: root-class="x" → class="x"
                  return fixer.replaceText(attr, `class="${addedVal}"`);
                }
              }
            },
          });
        }
      },
    });
  },
};
