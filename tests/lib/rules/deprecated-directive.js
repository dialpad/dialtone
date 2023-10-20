/**
 * @fileoverview Detects usages of old dialpad product side components which should be replaced by Dialtone components.
 * @author Brad Paugh
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/deprecated-directive"), RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 'latest' }
})
ruleTester.run("deprecated-directive", rule, {
  valid: [
    {
      name: 'Non deprecated directive',
      code: "<template><dt-button v-dt-tooltip=\"'tooltip'\" /></template>",
    },
  ],

  invalid: [
    {
      name: 'Deprecated directive',
      code: "<template><button v-tooltip=\"'tooltip'\" /></template>",
      errors: [
        {
            messageId: "deprecatedDirective"
        }
      ],
    },
  ],
});
