// Resolvers import dialtone-tokens' sync-scripts across the package
// boundary, and neither of these ships (or is checked for) types of its own:
// `culori` has no published `.d.ts` and dialtone-tokens' own tsconfig never
// includes `sync-scripts/**` (it type-checks `themes/*.js` only, so this
// gap has simply never been exercised there). Declaring both loosely here —
// scoped to this package's own typecheck — is cheaper and less risky than
// reaching into another package's source to fix a gap this package is the
// first to actually hit.
declare module 'culori';
declare module '*dialtone-transforms.js';
