// Intentional no-op. @dialpad/dialtone has no default entry point — everything is
// consumed via subpath exports (./css, ./vue3, ./tokens/*, etc). This file exists only
// so a "." export can exist, which lets bundlers resolve glob imports like
// `@dialpad/dialtone/vue3/lib/*` (some bundlers require a package to have a "."
// export before they'll expand a subpath glob against it).
module.exports = {};
