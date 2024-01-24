export default {
    description:
        'Updates dialtone 7 variables to dialtone 8 design tokens.\n' +
        '- Replaces var(--{color}-{stop}) with var(--dt-color-{color}-{stop})\n\t' +
            'eg. var(--black-200) with var(--dt-color-black-200)\n' +
        '- Replaces @{color}-{stop} with var(--dt-color-{color}-{stop})\n\t' +
            'eg. @red-100 with var(--dt-color-red-100)\n' +
        '- Replaces var(--fc-{kind}) with var(--dt-color-foreground-{kind})\n\t' +
            'eg. var(--fc-success-inverted) with var(--dt-color-foreground-success-inverted)\n',
    patterns: ['**/*.{css,less,scss,sass,styl,html,vue,md}'],
    expressions: [
        // ------------------------------------------------------------ //
        //                            Colors                            //
        // ------------------------------------------------------------ //
        // LESS variables
        {
            from: /@(black|purple|magenta|gold|green|red|blue|tan)(-[1-9]00)/g,
            to: 'var(--dt-color-$1$2)',
        },
        // Neutral LESS variables
        {
            from: /@(white|black)/g,
            to: 'var(--dt-color-neutral-$1)',
        },
        // CSS variables
        {
            from: /var\(--(black|purple|orange|magenta|gold|green|red|blue|tan)(-[1-9]00)(-(h|s|l|hsl))?\)/g,
            to: 'var(--dt-color-$1$2$3)',
        },
        // Neutral CSS variables
        {
            from: /var\(--(white|black)(-(h|s|l|hsl))?\)/g,
            to: 'var(--dt-color-neutral-$1$2)',
        },
        // Background colors
        {
            // eslint-disable-next-line max-len
            from: /var\(--bgc-(primary|secondary|moderate|bold|strong|contrast|critical|success|warning|info)(-(subtle|opaque|subtle-opaque|strong))?\)/g,
            to: 'var(--dt-color-surface-$1$2)',
        },
        // Special Background color cases
        {
            // eslint-disable-next-line max-len
            from: /var\(--bgc-(error|danger)(-(subtle|opaque|subtle-opaque|strong))?\)/g,
            to: 'var(--dt-color-surface-critical$2)',
        },
        // Border colors
        {
            // eslint-disable-next-line max-len
            from: /var\(--bc-(default|subtle|moderate|bold|focus|critical|success|warning|brand|ai|accent)(-(inverted|subtle|strong|subtle-inverted|strong-inverted))?\)/g,
            to: 'var(--dt-color-border-$1$2)',
        },
        // Font colors
        {
            // eslint-disable-next-line max-len
            from: /var\(--fc-(primary|secondary|tertiary|muted|placeholder|disabled|critical|success|warning)(-(strong|inverted|strong-inverted))?\)/g,
            to: 'var(--dt-color-foreground-$1$2)',
        },
        // Special Font color cases
        {
            from: /var\(--fc-(error|danger)(-(strong|inverted|strong-inverted))?\)/g,
            to: 'var(--dt-color-foreground-critical$2)',
        },
        {
            from: /d-(fc|bc)-white/g,
            to: 'd-$1-neutral-white',
        },
    ],
};
