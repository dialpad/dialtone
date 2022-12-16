/**
 * @fileoverview Detects custom dialtone icons implementations
 * @author julio ortega
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/custom-implementation"),
    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions: {sourceType: 'module', ecmaVersion: 'latest'}});
ruleTester.run("custom-implementation", rule, {
    valid: [
        {
            name: 'Dialtone-vue DtIcon import',
            code: "import { DtIcon } from '@dialpad/dialtone-vue';",
        },
    ],

    invalid: [
        {
            name: 'require context',
            code: "const requireIcon = require.context(\n" +
                "  '@dialpad/dialtone/lib/dist/vue/icons',\n" +
                "  false,\n" +
                "  /.*\\.vue$/\n" +
                ");",
            errors: [{messageId: 'avoidRequireContext'}],
        },
        {
            name: 'custom import',
            code: 'import SpotFileUpload from \'@dSpot/SpotFileUpload\';',
            errors: [{messageId: 'avoidCustomImport'}],
        },
    ],
});
