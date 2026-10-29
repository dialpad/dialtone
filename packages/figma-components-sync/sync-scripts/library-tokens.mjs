/**
 * Name → key for variables published by the Dialtone Design Tokens 2026 library.
 *
 * The scratch file has the library LINKED, not its variables created locally —
 * `getLocalVariablesAsync()` / `GET /v1/files/:key/variables/local` only ever see
 * variables a file owns itself, never ones it merely consumes. The library's own
 * source file (`dialtone-tokens`' FILE_KEY, here as TOKENS_FILE_KEY) still answers
 * `variables/published` over REST, and the `key` it returns per variable is the
 * exact string `figma.variables.importVariableByKeyAsync(key)` accepts inside the
 * plugin — so a token missing locally can still be resolved and bound through it.
 */
export async function fetchPublishedTokenKeys (token, tokensFileKey) {
  if (!tokensFileKey) return new Map();
  const res = await fetch(`https://api.figma.com/v1/files/${tokensFileKey}/variables/published`,
    { headers: { 'X-Figma-Token': token } });
  if (!res.ok) throw new Error(`published variables fetch -> ${res.status}`);
  const vars = Object.values((await res.json()).meta.variables || {});
  return new Map(vars.map(v => [v.name, v.key]));
}
