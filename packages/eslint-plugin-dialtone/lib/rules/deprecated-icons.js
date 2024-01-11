/**
 * @fileoverview Finds old dialtone svg icons usage
 * @author julio ortega
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'suggestion', // `problem`, `suggestion`, or `layout`
        docs: {
            description: 'Finds deprecated svg and vue icon imports from dialtone',
            recommended: false,
            url: 'https://github.com/dialpad/eslint-plugin-dialtone/blob/main/docs/rules/deprecated-icons.md', // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
        messages: {
            avoidDeprecatedImport: 'Avoid usage of old dialtone icons [deprecated]. Check https://dialtone.dialpad.com/components/icon.html for details.',
        },
    },
    create(context) {
        const iconRegex = /.*@dialpad\/dialtone\/(vue\/.*|.+\.svg)/gim;
        const brandIconsList = [
            'IconAirtable',
            'IconAmex',
            'IconAppStoreBadge',
            'IconApple',
            'IconAsana',
            'IconBrandDialpadMeetings',
            'IconBrandDialpad',
            'IconBullhorn',
            'IconClockify',
            'IconCopperCrm',
            'IconDialpadAi',
            'IconDinersClub',
            'IconDiscover',
            'IconEvernote',
            'IconFacebook',
            'IconFreshsalesCrm',
            'IconFront',
            'IconGmail',
            'IconGoogleBusinessMessaging',
            'IconGoogleCalendar',
            'IconGoogleDocs',
            'IconGoogleDrive',
            'IconGoogleGlyph',
            'IconGreenhouse',
            'IconHighfive',
            'IconHubspot',
            'IconInstagram',
            'IconIntercom',
            'IconJcb',
            'IconJiraServiceDesk',
            'IconLineMessenger',
            'IconLinkedin',
            'IconMaestro',
            'IconMastercard',
            'IconMessenger',
            'IconMicrosoftDynamics365',
            'IconMicrosoftTeams',
            'IconMicrosoft',
            'IconMiro',
            'IconMondayCom',
            'IconOffice365',
            'IconPipedrive',
            'IconPlayStoreBadge',
            'IconSalesforceGlyph',
            'IconSalesforceLogo',
            'IconServicenow',
            'IconSlack',
            'IconSnapchat',
            'IconTelegram',
            'IconTiktok',
            'IconToggl',
            'IconTwitter',
            'IconUnionPay',
            'IconViber',
            'IconVisa',
            'IconWeChat',
            'IconWhatsapp',
            'IconZendesk',
            'IconZohoCrm',
            'IconZohoDesk',
            'IconZoho',
            'IconZoom',
        ];

        function isBrandIcon(source) {
            const iconName = source.split('/').pop();
            return brandIconsList.includes(iconName);
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ImportDeclaration(node) {
                const matched = iconRegex.exec(node.source.value);
                if (!matched || matched.input.includes('/brand/') || matched.input.includes('/spot/') || isBrandIcon(matched.input)) return;

                context.report({
                    node: node,
                    messageId: 'avoidDeprecatedImport',
                });
            }
        };
    },
};
