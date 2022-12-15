/**
 * @fileoverview Finds old dialtone svg icons usage
 * @author julio ortega
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/old-svg-icons"), RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions: {ecmaVersion: 7, sourceType: 'module'}});
ruleTester.run("old-svg-icons", rule, {
    valid: [
        {
            name: 'New icon import',
            code: "import svgLockIcon from '@dialpad/dialtone-icons/dist/svg/lock.svg';",
        },
        {
            name: 'Dialtone Styles import',
            code: "import dialtoneCSS from '@dialpad/dialtone/lib/build/less/dialtone.less';",
        }
    ],

    invalid: [
        {
            name: 'Old icon import from build',
            code: "import svgLockIcon from '../node_modules/@dialpad/dialtone/lib/build/svg/system/lock.svg';",
            errors: [
                {
                    messageId: "avoidSVGImport"
                }
            ],
        },
        {
            name: 'Old icon import from dist',
            code: "import svgLockIcon from '../node_modules/@dialpad/dialtone/lib/dist/svg/system/lock.svg';",
            errors: [
                {
                    messageId: "avoidSVGImport"
                }
            ],
        }
    ],
});
