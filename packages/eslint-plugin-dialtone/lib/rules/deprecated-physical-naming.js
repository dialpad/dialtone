/**
 * @fileoverview Detect deprecated physical direction names in Dialtone component
 * slots, props, prop values, and events. Suggests logical replacements.
 */
'use strict';

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

/**
 * Maps component names to their deprecated slot names and replacements.
 * null value = special handling (ambiguous, e.g. #icon on dt-button).
 */
const DEPRECATED_SLOTS = {
  'dt-badge': { leftIcon: 'startIcon', rightIcon: 'endIcon' },
  'dt-button': { icon: null },
  'dt-input': { leftIcon: 'startIcon', rightIcon: 'endIcon' },
  'dt-tab': { leftIcon: 'startIcon' },
  'dt-split-button': { alphaIcon: 'startIcon', omegaIcon: 'endIcon', omega: 'end' },
  'dt-item-layout': { left: 'start', right: 'end', bottom: 'blockEnd' },
  'dt-recipe-callbox': { right: 'end', bottom: 'blockEnd' },
  'dt-recipe-contact-centers-row': { right: 'end' },
  'dt-recipe-general-row': { left: 'start' },
  'dt-recipe-top-banner-info': { left: 'start', right: 'end' },
  'dt-recipe-grouped-chip': {
    leftIcon: 'startIcon',
    rightIcon: 'endIcon',
    leftContent: 'startContent',
    rightContent: 'endContent',
  },
};

/**
 * Maps component names to their deprecated prop names (kebab-case) and replacements.
 */
const DEPRECATED_PROPS = {
  'dt-item-layout': {
    'left-class': 'start-class',
    'right-class': 'end-class',
    'bottom-class': 'block-end-class',
  },
  'dt-split-button': {
    'alpha-active': 'start-active',
    'alpha-aria-label': 'start-aria-label',
    'alpha-icon-position': 'start-icon-position',
    'alpha-leading-class': 'start-leading-class',
    'alpha-trailing-class': 'start-trailing-class',
    'alpha-label-class': 'start-label-class',
    'alpha-disabled': 'start-disabled',
    'alpha-loading': 'start-loading',
    'alpha-tooltip-text': 'start-tooltip-text',
    'omega-active': 'end-active',
    'omega-aria-label': 'end-aria-label',
    'omega-disabled': 'end-disabled',
    'omega-id': 'end-id',
    'omega-tooltip-text': 'end-tooltip-text',
  },
};

/**
 * Maps component names to props whose specific values are deprecated.
 */
const DEPRECATED_PROP_VALUES = {
  'dt-button': {
    'icon-position': { left: 'start', right: 'end', top: 'blockStart', bottom: 'blockEnd' },
  },
  'dt-root-layout': {
    'sidebar-position': { left: 'start', right: 'end' },
  },
};

/**
 * Maps component names to their deprecated event names and replacements.
 */
const DEPRECATED_EVENTS = {
  'dt-split-button': { 'alpha-clicked': 'start-clicked', 'omega-clicked': 'end-clicked' },
};

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Converts PascalCase or camelCase to kebab-case.
 * e.g. 'DtBadge' → 'dt-badge', 'DtRecipeCallbox' → 'dt-recipe-callbox'
 */
function toKebabCase (str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detects deprecated physical direction names in Dialtone slots, props, prop values, and events.',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-physical-naming.md',
    },
    fixable: null,
    schema: [],
    messages: {
      deprecatedSlot:
        '#{{ oldSlot }} on <{{ component }}> is deprecated. Use #{{ newSlot }} instead.',
      deprecatedIconSlot:
        'The #icon slot on <dt-button> is deprecated. Use #startIcon, #endIcon, #blockStartIcon, or #blockEndIcon instead.',
      deprecatedProp:
        '{{ oldProp }} on <{{ component }}> is deprecated. Use {{ newProp }} instead.',
      deprecatedPropValue:
        '{{ prop }}="{{ oldValue }}" on <{{ component }}> is deprecated. Use {{ prop }}="{{ newValue }}" instead.',
      deprecatedEvent:
        '@{{ oldEvent }} on <{{ component }}> is deprecated. Use @{{ newEvent }} instead.',
    },
  },

  create (context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return sourceCode.parserServices.defineTemplateBodyVisitor({

      VElement (node) {
        const rawName = node.rawName || node.name;
        const elementName = rawName.includes('-') ? rawName : toKebabCase(rawName);

        const slotsMap = DEPRECATED_SLOTS[elementName];
        const propsMap = DEPRECATED_PROPS[elementName];
        const propValuesMap = DEPRECATED_PROP_VALUES[elementName];
        const eventsMap = DEPRECATED_EVENTS[elementName];

        // Check attributes in a single pass (props, prop values, events)
        if (propsMap || propValuesMap || eventsMap) {
          for (const attr of node.startTag.attributes) {
            if (!attr.directive) {
              // Static props: alpha-active, left-class="x", icon-position="left"
              const attrName = attr.key && (attr.key.rawName || attr.key.name);
              if (attrName && propsMap && propsMap[attrName]) {
                context.report({
                  node: attr,
                  messageId: 'deprecatedProp',
                  data: {
                    component: elementName,
                    oldProp: attrName,
                    newProp: propsMap[attrName],
                  },
                });
              }
              if (attrName && propValuesMap && propValuesMap[attrName] && attr.value) {
                const val = attr.value.value;
                if (propValuesMap[attrName][val]) {
                  context.report({
                    node: attr,
                    messageId: 'deprecatedPropValue',
                    data: {
                      component: elementName,
                      prop: attrName,
                      oldValue: val,
                      newValue: propValuesMap[attrName][val],
                    },
                  });
                }
              }
            } else if (attr.directive && attr.key.name.name === 'bind') {
              // Dynamic props: :alpha-active="x", v-bind:omega-disabled="y"
              const bindName = attr.key.argument && (attr.key.argument.rawName || attr.key.argument.name);
              if (bindName && propsMap && propsMap[bindName]) {
                context.report({
                  node: attr,
                  messageId: 'deprecatedProp',
                  data: {
                    component: elementName,
                    oldProp: bindName,
                    newProp: propsMap[bindName],
                  },
                });
              }
            } else if (eventsMap && attr.key.name.name === 'on') {
              const eventName = attr.key.argument && (attr.key.argument.rawName || attr.key.argument.name);
              if (eventName && eventsMap[eventName]) {
                context.report({
                  node: attr,
                  messageId: 'deprecatedEvent',
                  data: {
                    component: elementName,
                    oldEvent: eventName,
                    newEvent: eventsMap[eventName],
                  },
                });
              }
            }
          }
        }

        // Check child <template> elements for deprecated slot names
        if (slotsMap) {
          for (const child of node.children) {
            if (child.type === 'VElement' && child.name === 'template') {
              for (const attr of child.startTag.attributes) {
                if (attr.directive && attr.key.name.name === 'slot') {
                  const slotName = attr.key.argument && (attr.key.argument.rawName || attr.key.argument.name);
                  if (slotName && slotName in slotsMap) {
                    if (slotsMap[slotName] === null) {
                      // #icon on dt-button is ambiguous — consumer must choose replacement
                      context.report({ node: attr, messageId: 'deprecatedIconSlot' });
                    } else {
                      context.report({
                        node: attr,
                        messageId: 'deprecatedSlot',
                        data: {
                          component: elementName,
                          oldSlot: slotName,
                          newSlot: slotsMap[slotName],
                        },
                      });
                    }
                  }
                  break;
                }
              }
            }
          }
        }
      },
    });
  },
};
