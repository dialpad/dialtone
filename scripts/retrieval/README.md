# Shared retrieval fixtures and regressions

DLT-3652 owns C5 profile definitions, fixture materialization, cache-input contracts and adapter runner integration. Feature owners maintain their assertions in `cases.mjs` and remove the corresponding expected-failure entries when their fixes integrate. DLT-3650 owns production answer provenance; this harness records evidence and tests the resulting contract.

```sh
pnpm nx run-many -t build -p dialtone-cli dialtone-mcp-server
node --test scripts/retrieval/*.test.mjs
node scripts/retrieval/run.mjs --report /tmp/dialtone-retrieval.json
```

The 31 cases run against query-core, CLI JSON and live MCP stdio tools, with exact top results, required/forbidden facts, explicit negatives, migration/accessibility literals and output budgets. Positive cases require independent subject/content facts even when one feature assertion is an owned failure. Optional registry update-check I/O is disabled with a test preload; this is not a startup/network acceptance suite. Existing documentation-ID acceptance scenarios remain separate.

Every expected failure names one assertion, its issue, owner and removal condition. Other assertions still must pass. Setup errors, transport errors, timeouts, malformed responses and unrelated assertions always fail. An unexpected pass also fails: promote the case to a mandatory regression and remove its registration. When a feature introduces a detail tool or C2 provenance fields, replace its candidate detection with the exact integrated contract and promote it. Do not keep a passing behavior masked as an expected failure.

Canonical breadcrumb identity, safe legacy import qualification and Tooltip literal-markup fidelity are mandatory regressions. Every current baseline case is mandatory; documentation negatives require a readable no-match diagnostic.

## C5 profiles

Exact pins were verified from public npm artifacts on 2026-10-06. `dt10-pinned` names a frozen selection, not a moving latest tag. The umbrella package major differs from the standalone Vue package major.

| ID                       | Exact package tuple                                          | Layout                                              | Capability boundary                                     |
| ------------------------ | ------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------- |
| `dt10-pinned`            | umbrella 10.5.1, icons 5.2.0, Vue 3.5.18                     | root                                                | v10 metadata; verify the artifact's actual exports      |
| `dt10-min`               | umbrella 10.0.4, icons 5.0.0, Vue 3.5.18                     | root                                                | selected minimum v10; no later-package capability claim |
| `dt9-legacy`             | umbrella 9.185.0, icons 4.52.0, Vue 3.5.18                   | root                                                | no DtBox/DtText; older prop values                      |
| `standalone-vue3-legacy` | standalone Vue 3.157.0, CSS 8.45.3, icons 4.28.0, Vue 3.5.18 | root                                                | standalone legacy, no DtBox/DtText; older prop values   |
| `no-install`             | none                                                         | root                                                | no installed API claim                                  |
| `partial-install`        | icons 5.2.0, Vue 3.5.18                                      | root                                                | no installed component claim                            |
| `nested-umbrella`        | same as `dt10-pinned`                                        | dependency root `web`, invocation `web/apps/client` | root-selection fixture                                  |

`profiles.mjs` records contract version, exact declarations, framework, layout, expected data paths/schema shape and primary artifact integrity. `createConsumerFixture()` creates isolated declarations or explicitly supplied data-only packages in a caller-owned directory. It does not install packages or discover which installation is authoritative. `fingerprintArtifact()` verifies a named artifact against its profile and records data hashes/schema/record counts.

`legacy-button.json` is a stamped projection of the public umbrella 9.185.0 component data, containing only the button description and size property. The harness reuses it through the existing materializer and actual CLI to verify local source selection and distinctive legacy size values. The fixture establishes lookup-data-only evidence; its small subset proves no missing API or public export, installation, build or browser compatibility. CI performs no install or registry fetch for this case.

Verification levels are evidence values: `declaration-only`, `lookup-data-only`, `installed`, `built`, `browser-tested`. Materialization and unpacked JSON fingerprinting establish only the first two. Real installation, public import compilation and browser checks require separate evidence with exact artifacts/lock hashes. A profile name or copied JSON never promotes those levels automatically. Reuse these profiles/helpers in installed-project, directive and example checks; retain small existing unit fixtures where appropriate.

Use the public scoped registry explicitly when capturing npm evidence: repository configuration may route `@dialpad` to another registry. Record the actual tarball URL and integrity as well as unpacked data hashes. Existing CLI JSON is domain-specific and source selection is reported on stderr; no new CLI installed-version oracle is introduced here.

## Updating pinned profiles

The C5 fixture owner updates `dt10-pinned` when a newer package tuple is needed for a release or compatibility check. Do not track `latest` automatically or advance `dt10-min` and legacy profiles merely because a newer release exists; they retain their comparison boundaries.

For an update, capture exact package versions, tarball URLs and integrity from the public scoped registry. Check the unpacked data paths, schemas and export differences before changing the declarations or capability notes. Update the inherited nested/partial profiles and this table together. Run fixture contracts and the retrieval harness; record installed/build/browser evidence separately when required. Keep the previous evidence's exact pins and verification date in the handoff so historical comparisons remain reproducible.

## Freshness and pending integration

Vue generator/shared-helper inputs and MCP client rules participate in Nx build hashes. Query-core and bundled adapters hash transitive generated JSON/JavaScript and TypeScript declaration outputs. Cache contracts use the pinned Nx 19.8 input expansion and matching implementation; local cache probes additionally compare changed generated bytes and packed bundles. Caching remains enabled.

Reports fingerprint tracked changes against HEAD, including staged edits, and record nonignored untracked file hashes (symlinks hash their link target). The combined source-state hash includes both; ignored scratch files are excluded.

Reports hash both the source and consumed `dist/keywords-icons.json` icon metadata and verify their parsed content matches. They include the imported common helper and all current `scripts/lib/**/*.mjs` generator helpers.

Standalone Vue release commit selection also includes those generator/shared-helper paths. A temporary Git history exercises the installed release selector, including the Vue identity helper while excluding unrelated scripts and helpers. This verifies commit selection; publication and subsequent public artifact qualification still require separate evidence. Private Nx contract tests fail explicitly if the installed Nx version changes from 19.8.0.

`unit_tests.yml` runs the existing query-core, CLI, docs and ESLint suites plus these contracts and retrieval checks for relevant source/data/adapter and generator-test changes. Generator, helper and test changes also route to the existing documentation tests/build workflow. Merged public-identity generator and installed-declaration tests now run from staging source. Merged MCP startup/shutdown and shared-core release-selection suites run as mandatory commands in the same lookup job, against the built server and installed release implementation. Registry publication and named consumer/client qualification remain separate acceptance evidence.

## Selected example consumer and packed delivery checks

Ready component-page live Vue fences are delivered automatically when their public imports, supported source state and source API checks are complete. IDs derive from page/section; source-adjacent `<!-- @example {"key":"compact"} -->` metadata handles ambiguity and stable overrides. Most fences need no marker. Supported local setup is derived from actual source; concise usage notes belong only in generated artifacts, not source annotations. No publishing list is maintained. The eight earlier exact IDs are preserved as source overrides. Follow the [source authoring contract](../../.agents/resources/documentation-examples.md) for the single syntax, retirement, static subjects and exclusions. Other source forms remain explicit coverage gaps. Combinator membership continues to come from its curated registry. All delivery remains separate from consumer proof.

After building the adapters, run the optional real-install consumer check in an owned scratch directory:

```sh
node scripts/retrieval/validate-examples.mjs .temp/example-consumers
```

This reuses the C5 `dt10-pinned` materializer, installs public npm artifacts with an isolated cache, validates delivered props/values/default slots and applicable deprecation rules, checks the exact primary artifact integrity, and builds all files extracted from each delivered record. It retains consumer applications, lockfiles and `example-consumer-report.json`. Network access is required. `example-validation.json` records reviewed evidence bound to source/files/profile hashes; generation falls back to unverified when those inputs change. Repeat `--id <returned-example-id>` to bound a consumer check. Add `--promote` to write successful machine results into the existing `example-validation.json` after payload/profile/artifact/tooling checks; inspect that diff and rebuild documentation and adapters afterward. Without `--promote`, results stay in the isolated report. Unknown IDs fail explicitly. Promotion preserves only matching existing human evidence; it never creates a human pass. Browser/keyboard/screen-reader review remains separate: record its reviewer, environment and result in the matching entry's `manualReview` evidence. A consumer build does not promote that status automatically.

Static examples retain their authored HTML. Validation requires each selected utility in both the markup and the installed CSS, and reports missing supporting classes as partial coverage. The Word Wrap example additionally checks its own `overflow-wrap: normal` declaration; other utilities do not inherit that semantic check. Class availability alone does not establish visual behavior. No browser or accessibility result is inferred.

Pack the built CLI and MCP packages with lifecycle scripts disabled, install both tarballs in a separate consumer, then run:

```sh
node scripts/retrieval/probe-packed-examples.mjs /path/to/packed-consumer
```

The probe compares both adapters with the same generated records, reconstructs bounded MCP continuations, checks no-match behavior, preserves legacy `component --examples` JSON and checks all five searches remain text-only. It writes `packed-example-report.json`. These are local candidate checks; they do not publish packages or establish installed-project compatibility.
