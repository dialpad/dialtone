/**
 * @fileoverview Finds old dialtone svg icons usage
 * @author julio ortega
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/deprecated-icons"), RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ languageOptions: { sourceType: 'module', ecmaVersion: 'latest' } });
ruleTester.run("deprecated-icons", rule, {
    valid: [
        {
            name: 'New icon import',
            code: "import svgLockIcon from '@dialpad/dialtone-icons/dist/svg/lock.svg';",
        },
        {
            name: 'Brand SVG icon import',
            code: "import dialpadAiIcon from '../../node_modules/@dialpad/dialtone/lib/build/svg/brand/dialpad-ai.svg';",
        },
        {
            name: 'Brand VUE icon import',
            code: "import IconDialpadAi from '@dialpad/dialtone/vue/icons/IconDialpadAi';",
        },
        {
            name: 'Spot illustration import',
            code: "import SpotBrowserTableGraph from '@dialpad/dialtone/vue/spot/SpotBrowserTableGraph';",
        },
        {
            name: 'Dialtone Styles import',
            code: "import dialtoneCSS from '@dialpad/dialtone/lib/build/less/dialtone.less';",
        },
        {
            name: 'Vue entry point import',
            code: "import { DtButton } from '@dialpad/dialtone/vue';",
        },
        {
            name: 'Vue component import',
            code: "import { DtButton } from '@dialpad/dialtone/vue/lib/button';",
        },
        {
            name: 'Vue component import from node_modules',
            code: "import { DtButton } from '../node_modules/@dialpad/dialtone/vue/lib/button';",
        },
    ],

    invalid: [
        {
            name: 'Old SVG icon import from build',
            code: "import svgLockIcon from '../node_modules/@dialpad/dialtone/lib/build/svg/system/lock.svg';",
            errors: [
                {
                    messageId: "avoidDeprecatedImport"
                }
            ],
        },
        {
            name: 'Old SVG icon import from dist',
            code: "import svgLockIcon from '../node_modules/@dialpad/dialtone/lib/dist/svg/system/lock.svg';",
            errors: [
                {
                    messageId: "avoidDeprecatedImport"
                }
            ],
        },
        {
            name: 'Old VUE icon import',
            code: "import IconSettings from '@dialpad/dialtone/vue/icons/IconSettings';",
            errors: [
                {
                    messageId: "avoidDeprecatedImport"
                }
            ],
        },
        {
            name: 'Old VUE icon import from node_modules',
            code: "import IconSettings from '../node_modules/@dialpad/dialtone/vue/icons/IconSettings';",
            errors: [
                {
                    messageId: "avoidDeprecatedImport"
                }
            ],
        },
        {
            name: 'Consecutive old icon imports are all reported',
            code: [
                "import IconSettings from '@dialpad/dialtone/vue/icons/IconSettings';",
                "import IconSettings2 from '@dialpad/dialtone/vue/icons/IconSettings';",
                "import { DtButton } from '@dialpad/dialtone/vue/lib/button';",
                "import IconSettings3 from '@dialpad/dialtone/vue/icons/IconSettings';",
            ].join('\n'),
            errors: [
                { messageId: "avoidDeprecatedImport", line: 1 },
                { messageId: "avoidDeprecatedImport", line: 2 },
                { messageId: "avoidDeprecatedImport", line: 4 },
            ],
        },
    ],
});
