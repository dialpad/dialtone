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
        {
            name: 'Deprecated DropdownMenu',
            code: "import DropdownMenu from '../components/dropdown_menu';",
            errors: [
                {
                    messageId: "deprecatedComponent"
                }
            ],
        },
        {
            name: 'Deprecated DropdownMenu .vue',
            code: "import DropdownMenu from '../components/dropdown_menu.vue';",
            errors: [
                {
                    messageId: "deprecatedComponent"
                }
            ],
        },
        {
            name: 'Deprecated BaseToggle',
            code: "import BaseToggle from '../components/base_toggle';",
            errors: [
                {
                    messageId: "deprecatedComponent"
                }
            ],
        },
        {
            name: 'Deprecated BaseToggle .vue',
            code: "import BaseToggle from '../components/base_toggle.vue';",
            errors: [
                {
                    messageId: "deprecatedComponent"
                }
            ],
        },
        {
            name: 'Deprecated BaseDatePicker',
            code: "import BaseDatePicker from '../components/base_date_picker';",
            errors: [
                {
                    messageId: "deprecatedComponent"
                }
            ],
        },
        {
            name: 'Deprecated BaseDatePicker .vue',
            code: "import BaseDatePicker from '../components/base_date_picker.vue';",
            errors: [
                {
                    messageId: "deprecatedComponent"
                }
            ],
        },
        {
            name: 'Deprecated Checkbox',
            code: "import Checkbox from '../components/checkbox';",
            errors: [
                {
                    messageId: "deprecatedComponent"
                }
            ],
        },
        {
            name: 'Deprecated Checkbox .vue',
            code: "import Checkbox from '../components/checkbox.vue';",
            errors: [
                {
                    messageId: "deprecatedComponent"
                }
            ],
        },
    ],
});
