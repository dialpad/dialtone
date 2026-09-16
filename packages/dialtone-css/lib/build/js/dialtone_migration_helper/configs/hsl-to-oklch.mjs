export default {
  description:
    'Migrates consumer HSL breakout patterns to OKLCH relative color syntax.\n' +
    '- Strips LESS ~"" wrappers around hsl() calls with channel variable references\n' +
    '- Converts composite -hsl/-hsla vars with alpha to oklch(from ...)\n' +
    '- Converts composite -hsl/-hsla vars without alpha: hsl(var(--token-hsl)) → var(--token)\n' +
    '- Converts separate H,S,L channel vars (comma/space syntax) to oklch() or var()\n' +
    '- Converts calc() on lightness: calc(var(--T-l) ± N%) → calc(l ± N/100)\n' +
    '- Converts desaturation (S=0): hsl(var(--T-h), 0%, var(--T-l)) → oklch(from var(--T) l 0 h)\n' +
    '\nOut of scope (flagged, not auto-converted):\n' +
    '- LESS compile-time variables (@step0, @step1) — app-internal\n' +
    '- Hardcoded HSL values (hsla(137, 100%, 27%, 0.05)) — should adopt tokens\n',
  patterns: ['**/*.{css,less,scss,sass,styl,html,vue,md,js,ts,jsx,tsx}'],
  expressions: [
    // 0. LESS ~"" stripping — only when inner hsl call references channel vars
    {
      from: /~"(hsla?\([^"]*var\(--[\w-]+-(?:h|s|l|a|hsl|hsla)\)[^"]*\))"/g,
      to: '$1',
    },

    // 1. Composite -hsl/-hsla + alpha
    //    hsla(var(--token-hsl) / alpha) → oklch(from var(--token) l c h / alpha)
    {
      from: /hsla?\(\s*var\((--[\w-]+)-hsla?\)\s*\/\s*([^()\s]*(?:\([^()]*\))?)\s*\)/g,
      to: 'oklch(from var($1) l c h / $2)',
    },

    // 2. Composite -hsl/-hsla no alpha
    //    hsl(var(--token-hsl)) → var(--token)
    {
      from: /hsla?\(\s*var\((--[\w-]+)-hsla?\)\s*\)/g,
      to: 'var($1)',
    },

    // 3. Separate H,S,L comma + alpha (backreference ensures same base token)
    //    hsla(var(--T-h), var(--T-s), var(--T-l), alpha) → oklch(from var(--T) l c h / alpha)
    {
      from: /hsla?\(\s*var\((--[\w-]+)-h\)\s*,\s*var\(\1-s\)\s*,\s*var\(\1-l\)\s*,\s*([^()\s]*(?:\([^()]*\))?)\s*\)/g,
      to: 'oklch(from var($1) l c h / $2)',
    },

    // 4. Separate H,S,L space + slash alpha (backreference ensures same base token)
    //    hsl(var(--T-h) var(--T-s) var(--T-l) / alpha) → oklch(from var(--T) l c h / alpha)
    {
      from: /hsla?\(\s*var\((--[\w-]+)-h\)\s+var\(\1-s\)\s+var\(\1-l\)\s*\/\s*([^()\s]*(?:\([^()]*\))?)\s*\)/g,
      to: 'oklch(from var($1) l c h / $2)',
    },

    // 5. Separate H,S,L no alpha (comma or space syntax)
    //    hsl(var(--T-h), var(--T-s), var(--T-l)) → var(--T)
    {
      from: /hsla?\(\s*var\((--[\w-]+)-h\)\s*[, ]\s*var\(\1-s\)\s*[, ]\s*var\(\1-l\)\s*\)/g,
      to: 'var($1)',
    },

    // 6. calc() on lightness — converts HSL lightness N% to OKLCH lightness N/100
    //    hsl(var(--T-h), var(--T-s), calc(var(--T-l) ± N%))
    //    → oklch(from var(--T) calc(l ± N/100) c h)
    {
      from: new RegExp(
        'hsla?\\(\\s*var\\((--[\\w-]+)-h\\)\\s*,\\s*var\\(\\1-s\\)\\s*,' +
        '\\s*calc\\(\\s*var\\(\\1-l\\)\\s*([+-])\\s*(\\d+(?:\\.\\d+)?)%\\s*\\)\\s*\\)',
        'g',
      ),
      to: (_match, token, op, n) => {
        return `oklch(from var(${token}) calc(l ${op} ${n} / 100) c h)`;
      },
    },

    // 7. Desaturation (S → 0) — zero saturation in HSL = zero chroma in OKLCH
    //    hsl(var(--T-h), 0%, var(--T-l)) → oklch(from var(--T) l 0 h)
    {
      from: /hsla?\(\s*var\((--[\w-]+)-h\)\s*,\s*0%?\s*,\s*var\(\1-l\)\s*\)/g,
      to: 'oklch(from var($1) l 0 h)',
    },
  ],
};
