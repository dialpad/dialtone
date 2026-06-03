// Migration: deprecated physical direction slot/prop/event names → logical equivalents.
// Covers Vue template directives only. Does NOT cover:
// - #icon on dt-button (ambiguous — requires manual migration)
// - Dynamic bindings or script-section references

export default {
  description:
    'Renames deprecated physical direction names (left/right/top/bottom/alpha/omega) to\n' +
    'logical equivalents (start/end/blockStart/blockEnd) in Vue template slots, props,\n' +
    'prop values, and events. Does NOT rename #icon on dt-button (ambiguous).',
  patterns: ['**/*.{vue,html,md,js,ts,jsx,tsx}'],
  expressions: [
    // ── Slot renames ──────────────────────────────────────────────────────
    // Longer patterns first to prevent partial matches.
    // e.g. #leftIcon before #left, #rightIcon before #right

    // #leftIcon → #startIcon
    { from: /#leftIcon/g, to: '#startIcon' },
    // #rightIcon → #endIcon
    { from: /#rightIcon/g, to: '#endIcon' },
    // #alphaIcon → #startIcon
    { from: /#alphaIcon/g, to: '#startIcon' },
    // #omegaIcon → #endIcon
    { from: /#omegaIcon/g, to: '#endIcon' },
    // #leftContent → #startContent
    { from: /#leftContent/g, to: '#startContent' },
    // #rightContent → #endContent
    { from: /#rightContent/g, to: '#endContent' },
    // #omega → #end (word boundary to avoid matching #omegaIcon)
    // Scoped: only dt-split-button uses #omega
    { from: /#omega(?=[\s"'>])/g, to: '#end' },

    // Generic short slot names (#left, #right, #bottom) are scoped to known
    // Dialtone components to avoid renaming slots on non-Dialtone components.
    // Uses multiline matching to find the slot within a dt-* or dt-recipe-* tag.
    // Components: dt-item-layout, dt-list-item, dt-recipe-callbox, dt-recipe-contact-centers-row,
    //             dt-recipe-general-row, dt-recipe-top-banner-info

    // #left → #start (only on dt-item-layout, dt-list-item, dt-recipe-general-row, dt-recipe-top-banner-info)
    { from: /(<(?:dt-(?:item-layout|list-item|recipe-general-row|recipe-top-banner-info)|Dt(?:ItemLayout|ListItem|RecipeGeneralRow|RecipeTopBannerInfo))[\s\S]*?)#left(?=[\s"'>])/gm, to: '$1#start' },
    // #right → #end (only on dt-item-layout, dt-list-item, dt-recipe-callbox, dt-recipe-contact-centers-row, dt-recipe-top-banner-info)
    { from: /(<(?:dt-(?:item-layout|list-item|recipe-callbox|recipe-contact-centers-row|recipe-top-banner-info)|Dt(?:ItemLayout|ListItem|RecipeCallbox|RecipeContactCentersRow|RecipeTopBannerInfo))[\s\S]*?)#right(?=[\s"'>])/gm, to: '$1#end' },
    // #bottom → #blockEnd (only on dt-item-layout, dt-list-item, dt-recipe-callbox)
    { from: /(<(?:dt-(?:item-layout|list-item|recipe-callbox)|Dt(?:ItemLayout|ListItem|RecipeCallbox))[\s\S]*?)#bottom(?=[\s"'>])/gm, to: '$1#blockEnd' },

    // ── Prop renames ──────────────────────────────────────────────────────
    // Longer patterns first within each prefix group.

    // alpha-* → start-* (longest first)
    { from: /alpha-trailing-class/g, to: 'start-trailing-class' },
    { from: /alpha-tooltip-text/g, to: 'start-tooltip-text' },
    { from: /alpha-leading-class/g, to: 'start-leading-class' },
    { from: /alpha-icon-position/g, to: 'start-icon-position' },
    { from: /alpha-aria-label/g, to: 'start-aria-label' },
    { from: /alpha-label-class/g, to: 'start-label-class' },
    { from: /alpha-disabled/g, to: 'start-disabled' },
    { from: /alpha-loading/g, to: 'start-loading' },
    { from: /alpha-active/g, to: 'start-active' },

    // omega-* → end-* (longest first)
    { from: /omega-tooltip-text/g, to: 'end-tooltip-text' },
    { from: /omega-aria-label/g, to: 'end-aria-label' },
    { from: /omega-disabled/g, to: 'end-disabled' },
    { from: /omega-active/g, to: 'end-active' },
    { from: /omega-id/g, to: 'end-id' },

    // layout class props
    { from: /bottom-class=/g, to: 'block-end-class=' },
    { from: /left-class=/g, to: 'start-class=' },
    { from: /right-class=/g, to: 'end-class=' },

    // ── Prop value renames ────────────────────────────────────────────────
    // icon-position values
    { from: /icon-position="left"/g, to: 'icon-position="start"' },
    { from: /icon-position="right"/g, to: 'icon-position="end"' },
    { from: /icon-position="top"/g, to: 'icon-position="blockStart"' },
    { from: /icon-position="bottom"/g, to: 'icon-position="blockEnd"' },
    // sidebar-position values
    { from: /sidebar-position="left"/g, to: 'sidebar-position="start"' },
    { from: /sidebar-position="right"/g, to: 'sidebar-position="end"' },

    // ── Event renames ─────────────────────────────────────────────────────
    { from: /@alpha-clicked/g, to: '@start-clicked' },
    { from: /@omega-clicked/g, to: '@end-clicked' },
  ],
};
