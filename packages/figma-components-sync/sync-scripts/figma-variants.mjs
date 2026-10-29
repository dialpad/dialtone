/**
 * Fetch a component set's variants with their FULL subtrees.
 *
 * Why not simply fetch the set: REST caps how deep one node request descends, and
 * the cap counts from the REQUESTED node. Fetching the set at `depth=6` therefore
 * yields only five levels below each variant, silently truncating anything deeper.
 * `filter_pill`'s chevron sits at six: it arrived as a childless frame, so
 * `childCount` compared 1 against 0 and reported 32 findings against Figma nodes
 * that had been built correctly (B-101). A truncated fetch does not look like a
 * truncated fetch — it looks like a defect in the work.
 *
 * Re-rooting the request at each variant restarts the depth budget there. Measured
 * across every set in this project, batches of 40 return the complete subtree:
 * `depth=20` and `depth=10` agree on the deepest node, so nothing is being cut.
 * Raising depth on the SET request instead does not work — at 400+ variants it
 * returns no usable children at all (B-71), because the cost is the whole set
 * rather than 40 variants.
 */

/** Requested depth. Deepest tree observed is 7; the guard below catches a deeper one. */
const DEPTH = 20;
/** Pause between batches, and the escalating waits for a rate-limited batch. */
const PACE_MS = 250;
const RETRY_MS = [5000, 15000, 30000];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * Every request this module makes, retried on the same longer scale.
 *
 * A 560-variant set is 14 requests and `check-all` runs several passes at once, so this
 * module turned one request per pass into a burst and Figma answered 429. The caller's
 * `figmaGet` retries over ~12 seconds, which a rate limit outlasts.
 *
 * It covers EVERY request rather than only the batches. The batch loop was wrapped first
 * and the shallow depth=1 fetch was not — so the avatar pass still died on a 429, on the
 * very first line, with a protected loop right underneath that never got to run. A retry
 * that covers most of the calls reads exactly like one that covers all of them, right up
 * to the call it does not cover.
 */
async function withRetry (figmaGet, path) {
  for (let attempt = 0; ; attempt++) {
    try { return await figmaGet(path); }
    catch (e) {
      if (attempt >= RETRY_MS.length) throw e;
      await sleep(RETRY_MS[attempt]);
    }
  }
}

const deepest = (n, d = 0) => (n.children || []).reduce((m, c) => Math.max(m, deepest(c, d + 1)), d);

/**
 * @param figmaGet  the caller's authenticated GET — each check has its own, and
 *                  passing it in keeps this module free of credentials.
 * @returns Map<variantName, node> with every descendant present.
 */
export async function fetchVariantsByName (figmaGet, fileKey, setId, { batch = 40 } = {}) {
  /**
   * A SET THE PLUGIN JUST CREATED MAY NOT BE VISIBLE TO REST YET.
   *
   * The request succeeds — 200, `nodes: {}` — so it is not an error `withRetry` can catch;
   * it is a successful answer that says "no such node". Immediately after a 2,240-variant
   * build, that answer is simply premature: the write has not propagated to the read API.
   *
   * Retried on the same schedule as a rate limit, because it is the same class of thing —
   * a transient condition whose response is indistinguishable from a permanent one. What
   * must not happen is retrying forever on a genuinely wrong id, so the attempts are bounded
   * and the final message names both possibilities rather than asserting one.
   */
  let entry = null;
  for (let attempt = 0; ; attempt++) {
    const shallow = await withRetry(figmaGet, `/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(setId)}&depth=1`);
    entry = Object.values(shallow.nodes || {})[0];
    if (entry && entry.document) break;
    if (attempt >= RETRY_MS.length) {
      throw new Error(`set ${setId} is not in file ${fileKey} after `
        + `${RETRY_MS.reduce((a, b) => a + b, 0) / 1000}s of retries — either the id is wrong, `
        + `or a very large build has not finished propagating to the read API`);
    }
    await sleep(RETRY_MS[attempt]);
  }
  const ids = (entry.document.children || []).map(c => c.id);
  if (!ids.length) throw new Error(`set ${setId} returned no variants`);

  const byName = new Map();
  let maxDepth = 0;
  for (let i = 0; i < ids.length; i += batch) {
    const chunk = ids.slice(i, i + batch);
    const res = await withRetry(figmaGet,
      `/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(chunk.join(','))}&depth=${DEPTH}`);
    if (i + batch < ids.length) await sleep(PACE_MS);
    for (const id of chunk) {
      const doc = res.nodes[id] && res.nodes[id].document;
      // A variant the batch did not return is not "no variant" — it is an
      // unexplained gap, and every check downstream would report all of its nodes
      // as MISSING. Fail here, where the cause is still visible.
      if (!doc) throw new Error(`variant ${id} of set ${setId} missing from batch response`);
      byName.set(doc.name, doc);
      maxDepth = Math.max(maxDepth, deepest(doc));
    }
  }
  // The failure this module exists to fix is invisible truncation. If any subtree
  // reaches the requested depth, assume it was cut rather than assume it ended.
  if (maxDepth >= DEPTH) {
    throw new Error(`set ${setId}: a variant subtree reaches the requested depth ${DEPTH} `
      + `— it may be truncated. Raise DEPTH in figma-variants.mjs and re-run.`);
  }
  if (byName.size !== ids.length) {
    throw new Error(`set ${setId}: ${ids.length} variants collapsed to ${byName.size} names `
      + `— duplicate variant names in the set`);
  }
  // The set itself, which the variants alone cannot say: its default variant is its FIRST child,
  // and its variant properties carry the default each one resolves to.
  byName.setNode = {
    defaultVariantName: (entry.document.children[0] || {}).name || null,
    definitions: entry.document.componentPropertyDefinitions || {},
  };
  return byName;
}
