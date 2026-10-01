# Dialtone Spec Builder — Figma dev plugin

Builds component pages in Figma directly from the measured specs, with no payload
copying. Everything it needs is already generated; you only run it.

## Why this exists

The MCP `use_figma` sandbox has no `fetch`, so a payload can only reach it inside the
tool-call string — an assistant has to retype every byte, which is slow and is the only
step in this pipeline with an undetectable failure mode. A real dev plugin *does* have
`fetch` (via `manifest.networkAccess.devAllowedDomains`), so it pulls the payloads from
a local server itself.

`code.js` is **generated** from `sync-scripts/generic-builder.js` by
`sync-scripts/build-plugin.mjs` — never edit it by hand. Several bugs in this project
were drift between a versioned builder and what actually ran; generating removes that
class of bug entirely.

## One-time setup (about a minute)

1. Open the **Figma desktop app** (browser Figma cannot load a local plugin).
2. Open the scratch file: `https://figma.com/design/o9ouJpvThZclLpyGpsDG9z`
3. Menu → **Plugins → Development → Import plugin from manifest…**
   (if it rejects the manifest, re-run `build-plugin.mjs` — the manifest is generated,
   and an older one allowlisted an IP literal that Figma refuses)
4. Choose:
   `packages/figma-components-sync/sync-scripts/figma-plugin/manifest.json`

That registers "Dialtone Spec Builder" under Plugins → Development. You only do this
once; it survives restarts.

## Each run — one command

```
node packages/figma-components-sync/sync-scripts/run-batch.mjs toggle badge chip button avatar
```

That does everything except the click:

1. **re-measures** any spec older than the code that produces it (Button and Avatar take
   a few minutes each; anything current is skipped)
2. **encodes, shards, and regenerates** `code.js` from `generic-builder.js`
3. **preflights every payload** — cheaper to fail here than to leave a half-built page,
   because a plugin run is not atomic the way a `use_figma` call is
4. **serves** the payloads and waits
5. → **you click Run in Figma** (the one step no API can do) ←
6. **writes the returned set ids** into the right config — `configs/<name>.mjs` for the
   per-file configs, `component-axes.mjs` for the built-ins. This is the step most worth
   automating: it used to be a hand copy of ids read off a screen into two different
   files, and a wrong id makes the checks verify the *wrong set*, which reads as a clean
   pass on work nobody looked at. It also records each component's payload fingerprints
   in `build-data/built-from.json`.
7. **runs `check-all`** on whatever was built and prints the result

Step 6 also prints anything the builder **traded away** to keep the render correct — an
effect style whose numbers disagreed with the measurement, a multi-layer shadow whose one
token belongs to no identifiable layer, a numeric token that cannot hold its measured
value. Each of those costs a binding and is the right call; none of them should be
discovered later by accident, so they are printed next to the set id.

`check-all` compares the recorded fingerprints against the payloads on disk and warns
before the results if the set you are checking was built from something else. Verifying a
stale set deliberately is reasonable; doing it unaware is what the warning is for.

Flags: `--no-verify` to stop after step 6, `--visual` to also write contact sheets.

If a component comes back with no set, the report says so and nothing is written for it —
`combineAsVariants` refuses a duplicate variant name, and the page is left with loose
components.

## Each run — by hand

Only needed if you want to drive the steps individually; `run-batch.mjs` above does all
of this.

1. **Regenerate the payloads** for whatever you want built (from the repo root):

   ```
   node packages/figma-components-sync/sync-scripts/build-plugin.mjs toggle badge chip button avatar
   ```

   Named components only — omitting the list falls back to an older default set. It
   re-encodes each one, shards anything large, writes
   `sync-scripts/build-data/shards/` plus `index.json`, and regenerates `code.js`.

   If it stops with *"this spec is OLDER than build-spec.mjs"*, that guard is doing its
   job: the measured spec predates a pipeline change. Re-measure first —
   `node packages/figma-components-sync/sync-scripts/build-spec.mjs <name>` — then repeat.
   Button and Avatar take a few minutes each.

2. **Start the server** and leave it running — `serve-build-data.mjs`, this step's
   original standalone script, is retired (see `sync-scripts/superseded/README.md`).
   There's no standalone replacement: `run-batch.mjs` (the "one command" at the top of
   this README) now does its own serving internally as steps 4/5, listening on the same
   port, so driving this step by hand means running the full `run-batch.mjs <names>` and
   leaving steps 3 onward below to describe what happens while it's serving.

   It serves `build-data/` on `http://127.0.0.1:8931` and waits for the plugin to POST
   its results back.

3. **Run the plugin** in Figma: Plugins → Development → **Dialtone Spec Builder**.

   It fetches `index.json`, builds each shard onto its own page (clearing the page on
   the first shard of each component), combines the loose components into one variant
   set named `Dt<Page>`, and POSTs a report. A toast names each shard as it goes.

4. **Read the report.** The plugin closes with one line per component, and the server
   writes the same thing to `sync-scripts/build-data/plugin-results.json`:

   ```json
   [{ "component": "toggle", "page": "Toggle", "built": 72,
      "setId": "178:386", "variants": 72, "properties": ["modelValue", "size", …] }]
   ```

5. **Wire the set IDs into the configs** — the checks need them:
   - `sync-scripts/configs/<name>.mjs` → `figmaSetId` (avatar)
   - `sync-scripts/component-axes.mjs` → `figmaSetId` (button, badge, link, toggle, chip)

6. **Verify.** This is the part that matters:

   ```
   node packages/figma-components-sync/sync-scripts/check-all.mjs toggle badge chip button avatar
   ```

   Three passes per component — rendered values in both light and dark, token identity,
   and slots where a slot set exists. Then look at it, because numbers agreeing is not
   the same as it rendering right:

   ```
   node packages/figma-components-sync/sync-scripts/visual-compare.mjs toggle --set <id> --zoom 6
   ```

7. Stop the server with ctrl-C.

## If something goes wrong

| Symptom | Cause |
| --- | --- |
| `Manifest error: Invalid value for devAllowedDomains … must be a valid URL` | An IP literal (`http://127.0.0.1:8931`) — Figma only accepts a hostname form. Must be `http://localhost:8931`, and one bad entry fails the whole manifest rather than being skipped |
| `FAILED: Failed to fetch` | Server not running, or Figma is the browser build rather than desktop |
| `FAILED: Failed to fetch` with the server clearly up | The server is bound to one loopback stack only. `localhost` resolves to `::1` first on macOS; both servers here bind `127.0.0.1` **and** `::1` |
| `FAILED: missing variables: …` | A token the spec needs has no Figma variable — check the name in the message |
| `FAILED: Can only set minWidth on auto layout nodes` | The builder and a payload have drifted; re-run `build-plugin.mjs` |
| Plugin runs, page stays empty | `index.json` lists no components — re-run `build-plugin.mjs` with explicit names |
| A page has loose components and no set | `combineAsVariants` found a duplicate variant name; the report's `setId` is null |

A failing plugin run is **not** atomic the way a `use_figma` call is: a component that
throws mid-shard leaves that page partly built. Re-running is safe — the first shard of
each component clears its page.
