# Source documentation examples

Keep example markup in its authored VuePress page. Ready public component pages automatically deliver self-contained `vue demo` and `vue demo-only` fences when their imports resolve to public APIs, supported source state is available and the source API checker passes. No page or example publishing list is maintained. A comment is not an opt-in: most deliverable fences need no annotation. Source-valid delivery does not prove compatibility with the pinned consumer packages.

The default ID is `examples/docs/<docId>/<section-slug>`, using the H2/H3 path before prose duplicate suffixes. A second unkeyed live demo in a deliverable section fails the build and CI. The diagnostic identifies the page, section and fence lines, gives a copyable key example and appears as a clickable CI annotation. Keep the existing section to preserve its ID; give the added demo a distinct heading or source-adjacent key. Use an exact ID to preserve an identity across a move:

```html
<!-- @example {"key":"compact"} -->
```

Use one JSON comment in its own HTML block immediately before the live fence, with only whitespace between them. `key` is a lowercase hyphenated slug; `id` is an exact lowercase slug path under `examples/`, outside `examples/presets/`. Use one or the other. IDs must fit the 256-character retrieval limit. Unknown fields, orphaned/stacked annotations and legacy `example-id` comments fail the build. Future reference/MDX kinds must use separate identity scopes.

Supported `ref` setup is limited to literal Booleans, strings, `null`, and arrays containing only literal strings, including `[]`. It is derived from the declarations the template actually references in the page's top-level script. Calls, computed values, handlers, object initializers, spreads and other setup remain unsupported. Do not add state inventories or per-example `responsibilities`/`interaction` paragraphs. Imports come from source usage and public exports, ordered by the page's used API relations before layout companions. Unsupported state, bindings or APIs stay unresolved.

The three controlled FilterPill source starters and six controlled Combinator presets are withheld from lookup with owned exclusions: the `dt10-pinned` 10.5.1 package lacks `options`/`selected` support. Keep them excluded until a compatible package is published and the profile is qualified through the existing consumer procedure; do not repin the shared profile merely to deliver them. The live documentation and Storybook demos remain available. Preserve all 11 legacy FilterPill source-example IDs and the original `examples/presets/DtFilterPill/default` record.

Literal-ref support also delivers 12 SegmentedControl source examples and one dynamic-mode ModeIsland example. These records retain their separate consumer and manual-review status. The legacy FilterPill `defer selection` preset gains its already-authored `popover-footer-class` through corrected prop-dependency interpretation; preserving IDs does not imply every payload is unchanged.

Do not add per-example prose annotations or a tracked guidance sidecar. Concise source-bound guidance generation is a separate follow-up; this source-delivery change supplies setup and qualification without claiming generated usage notes.

An explicit `representation: "static-html"` requires `targetUtilities`, whose classes must appear literally in the markup. The consumer validator owns CSS and property checks. Preserve the existing Word Wrap fragment; other automatic static subjects, directive pages, MDX, references and richer setup remain later work. Migration, before/after and negative guidance retain their context. What's New is outside this component rule and remains pending.

Use `exclude: {"reason":"…","owner":"…"}` only with a reason and owner, without delivery metadata. It may retain an identity key/id. An owner string is attribution: approval means code-owner review of the adding PR and closeout sign-off. All raw live demos, including exclusions and unresolved sources, count toward identity ambiguity.

Run `pnpm nx run dialtone-docs:build` and inspect `packages/dialtone-docs/dist/example-coverage.json`. It reports physical source lines, classifications, exclusions, delivered IDs and remaining work. Additions and edits flow from source; a heading rename/removal retires the derived ID and returns no-match. Use an explicit ID when moving a semantic identity. No aliases or retirement catalog are maintained. A complete live-fence report is not full raw/reference/MDX coverage.

The eight earlier exact IDs remain source overrides. If a retained explicit ID becomes ineligible, including when its page becomes planned, beta or wip, the build fails with its location and reason; fix the source or add an owned exclusion to retire it deliberately. Metadata-only migration preserves consumer files and matching evidence. Whole-page hashes identify provenance; changed payloads or package/tooling tuples invalidate proof. Use the existing [consumer validation and packed delivery procedure](../../scripts/retrieval/README.md#selected-example-consumer-and-packed-delivery-checks). Preserve unverified/pending status without actual evidence. A build is not a browser, keyboard or screen-reader review.

Check owning build/cache/CI inputs and the shared lookup release policy for new producers. Update this guidance and both public guides with their owning changes. A source merge, generated output or site deployment does not refresh installed adapters; publication, updates and MCP restart remain separate.

## Combinator presets

`dialtone-combinator:generate-examples` materializes the curated registry using the UI's serializer and binding logic. Documentation consumes only its ignored `.generated/preset-examples.json`; stale source/input hashes fail the build. There is no separate preset publishing list. New registered presets are evaluated on the next build; unregistered files are not enrolled.

A preset may set `metadata.lookupExclude: { reason, owner }` when its source must stay out of lookup, including known incompatibility with the pinned consumer profile. Both fields must be nonempty strings. The preset remains available in Combinator; the producer records `policy-excluded` with the owned reason and does not materialize a lookup template. Remove the exclusion only after its stated qualification condition is met. This metadata is not a component prop or a second publishing list.

Inspect `packages/dialtone-docs/dist/preset-example-coverage.json`. It accounts for delivered sources, unresolved context, policy exclusions and deprecation, with separate consumer-verified and unverified totals. A safely assembled fixture can be retrieved without consumer proof; it stays unverified. Missing state or unsupported APIs keep the affected source unresolved without suppressing other fixtures. Corrupt intermediate data still fails clearly.

The shared source and consumer API checker accepts exact native attribute names explicitly documented by a component's top-level `@property ... attribute` declaration. Literal attributes and static-argument `v-bind` use that contract; arbitrary forwarded attributes and attribute-only `v-model` do not. Declared props retain their value and deprecation checks.

Preset IDs encode exact component/preset names. Renames/removals retire old IDs, which use normal no-match recovery; no parallel retirement catalog or aliases are required. Copying a fixture supplies no application update handlers or persistence. Rebuild owning Vue/icon metadata and regenerate after source/default/support changes. Revalidate changed payload/profile bindings; unchanged matching proof can be reused. Use the validator's explicit `--id` selection and `--promote` option described in [the validation workflow](../../scripts/retrieval/README.md#selected-example-consumer-and-packed-delivery-checks). Machine results never create human accessibility evidence. Register producer changes with the shared lookup release policy before publication, then verify packed delivery. Installed tools need package updates; MCP also needs a restart.
