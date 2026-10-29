/**
 * Resolve a remote (library) variable for the checks.
 *
 * `GET /v1/files/:key/variables/local` lists a remote variable only when a node in
 * the file uses it directly, so an alias chain that continues inside the library
 * breaks after its first hop (86 of 129 hops on Button's first build). The library's
 * own file holds the whole chain, so a remote id is resolved there by its variable
 * key instead: `VariableID:<key>/<id>` names the variable, and the aliases inside it
 * are ids local to the library file.
 */
const REMOTE_ID = /^VariableID:([0-9a-f]{40})\//;

export async function loadLibrary (figmaGet, tokensFileKey) {
  if (!tokensFileKey) return null;
  const { meta } = await figmaGet(`/v1/files/${tokensFileKey}/variables/local`);
  const byKey = new Map(Object.values(meta.variables).map(v => [v.key, v]));
  return {
    VM: meta.variables,
    VC: meta.variableCollections,
    /** The library variable a remote id names, or null for anything else. */
    fromRemote: id => { const m = REMOTE_ID.exec(id); return m ? byKey.get(m[1]) ?? null : null; },
  };
}
