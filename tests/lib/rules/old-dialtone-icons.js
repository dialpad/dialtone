/**
 * @fileoverview Finds and warns about old dialtone icons usage
 * @author julio ortega
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/old-dialtone-icons"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("old-dialtone-icons", rule, {
  valid: [
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "import svgLockIcon from '@dialpad/dialtone/lib/build/svg/system/lock.svg';",
      errors: [{ message: "Fill me in.", type: "Me too" }],
    },
  ],
});
