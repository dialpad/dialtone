/**
 * @fileoverview Detects usages of old dialpad product side components which should be replaced by Dialtone components.
 * @author Brad Paugh
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/deprecated-component"), RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions: {sourceType: 'module', ecmaVersion: 'latest'}});
ruleTester.run("deprecated-component", rule, {
    valid: [
        {
            name: 'Non deprecated component',
            code: "import MyComponent from './my_component';",
        },
        {
            name: 'Component that contains select_menu in the filename, but is not the file we are looking for',
            code: "import SelectMenuOption from '../components/select_menu_option';",
        },
    ],

    invalid: [
        {
            name: 'Deprecated SelectMenu',
            code: "import SelectMenu from '../components/select_menu';",
            errors: [
                {
                    messageId: "deprecatedComponent"
                }
            ],
        },
        {
            name: 'Deprecated SelectMenu .vue',
            code: "import SelectMenu from '../components/select_menu.vue';",
            errors: [
                {
                    messageId: "deprecatedComponent"
                }
            ],
        },
    ],
});
