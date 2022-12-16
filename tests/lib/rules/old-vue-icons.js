/**
 * @fileoverview Finds old dialtone vue icons usage
 * @author julio ortega
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/old-vue-icons"), RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions: {sourceType: 'module', ecmaVersion: 'latest'}});
ruleTester.run("old-vue-icons", rule, {
  valid: [
    {
      name: 'Dialtone-vue DtIcon import',
      code: "import { DtIcon } from '@dialpad/dialtone-vue';",
    },
  ],

  invalid: [
    {
      name: 'Dialtone vue icon import',
      code: "import IconSettingsOld from '@dialpad/dialtone/vue/icons/IconSettings';",
      errors: [{ messageId: 'avoidVueImport' }],
    },
  ],
});
