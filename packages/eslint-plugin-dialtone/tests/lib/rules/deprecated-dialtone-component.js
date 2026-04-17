/**
 * @fileoverview Detects usages of deprecated Dialtone components that should be replaced by newer alternatives.
 * @author Brad Paugh
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/deprecated-dialtone-component"), RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions: {sourceType: 'module', ecmaVersion: 'latest'}});
ruleTester.run("deprecated-dialtone-component", rule, {
    valid: [
        {
            name: 'Non-deprecated Dialtone component import',
            code: "import { DtButton } from '@dialpad/dialtone-vue';",
        },
        {
            name: 'Direct icon component import (not DtIcon)',
            code: "import { DtIconPhoneHangUp } from '@dialpad/dialtone-icons/vue3';",
        },
        {
            name: 'Non-deprecated Dialtone component import from dialtone',
            code: "import { DtComboboxWithPopover } from '@dialpad/dialtone';",
        },
        {
            name: 'Import from a non-Dialtone package',
            code: "import { DtRecipeCallbarButton } from 'some-other-package';",
        },
        {
            name: 'Default import from Dialtone',
            code: "import Dialtone from '@dialpad/dialtone-vue';",
        },
    ],

    invalid: [
        {
            name: 'Deprecated DtRecipeComboboxMultiSelect from dialtone-vue',
            code: "import { DtRecipeComboboxMultiSelect } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeComboboxWithPopover from dialtone',
            code: "import { DtRecipeComboboxWithPopover } from '@dialpad/dialtone';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeMotionText',
            code: "import { DtRecipeMotionText } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeCallbarButton',
            code: "import { DtRecipeCallbarButton } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeCallbarButtonWithPopover',
            code: "import { DtRecipeCallbarButtonWithPopover } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeCallbarButtonWithDropdown',
            code: "import { DtRecipeCallbarButtonWithDropdown } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeGroupedChip',
            code: "import { DtRecipeGroupedChip } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeTopBannerInfo',
            code: "import { DtRecipeTopBannerInfo } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeAttachmentCarousel',
            code: "import { DtRecipeAttachmentCarousel } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeMessageInput',
            code: "import { DtRecipeMessageInput } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeContactInfo',
            code: "import { DtRecipeContactInfo } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeEditor',
            code: "import { DtRecipeEditor } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeEmojiRow',
            code: "import { DtRecipeEmojiRow } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeFeedItemPill',
            code: "import { DtRecipeFeedItemPill } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeFeedItemRow',
            code: "import { DtRecipeFeedItemRow } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeContactCentersRow',
            code: "import { DtRecipeContactCentersRow } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeContactRow',
            code: "import { DtRecipeContactRow } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeGeneralRow',
            code: "import { DtRecipeGeneralRow } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeGroupRow',
            code: "import { DtRecipeGroupRow } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeUnreadPill',
            code: "import { DtRecipeUnreadPill } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeCallbox',
            code: "import { DtRecipeCallbox } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeSettingsMenuButton',
            code: "import { DtRecipeSettingsMenuButton } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtRecipeIvrNode',
            code: "import { DtRecipeIvrNode } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Multiple deprecated imports in one statement',
            code: "import { DtRecipeCallbarButton, DtRecipeEditor } from '@dialpad/dialtone-vue';",
            errors: [
                { messageId: 'deprecatedDialtoneComponent' },
                { messageId: 'deprecatedDialtoneComponent' },
            ],
        },
        {
            name: 'Mixed deprecated and valid imports in one statement',
            code: "import { DtButton, DtRecipeMotionText } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDialtoneComponent' }],
        },
        {
            name: 'Deprecated DtIcon from dialtone-vue',
            code: "import { DtIcon } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDtIcon' }],
        },
        {
            name: 'Deprecated DtIcon from dialtone',
            code: "import { DtIcon } from '@dialpad/dialtone';",
            errors: [{ messageId: 'deprecatedDtIcon' }],
        },
        {
            name: 'DtIcon mixed with other valid imports',
            code: "import { DtButton, DtIcon } from '@dialpad/dialtone-vue';",
            errors: [{ messageId: 'deprecatedDtIcon' }],
        },
    ],
});
