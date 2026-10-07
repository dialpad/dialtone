const identifier = '[$A-Z_a-z][$\\w]*';
const namedBinding = new RegExp(`^(${identifier})(?:\\s+as\\s+(${identifier}))?$`);
const importDeclaration = new RegExp(`^import\\s+(\\{[^}]*\\}|${identifier}|\\*\\s+as\\s+${identifier})\\s+from\\s+(['"])[^'"\\r\\n]+\\2\\s*;`);
const sideEffectImport = /^import\s+(['"])[^'"\r\n]+\1\s*;/;
// Imports declare strict-mode module bindings; identifier-shaped keywords are
// not valid locals. Imported/exported aliases may still use keyword names.
const forbiddenLocals = new Set(`await break case catch class const continue debugger default delete do else enum export extends false finally for function if implements import in instanceof interface let new null package private protected public return static super switch this throw true try typeof var void while with yield eval arguments`.split(' '));

function bindings(list: string): Array<{ original: string; local: string }> | null {
  const parts = list.trim().replace(/,$/, '').split(',').map(part => part.trim());
  if (parts.length === 1 && !parts[0]) return [];
  const result = [];
  for (const part of parts) {
    const match = namedBinding.exec(part);
    if (!match) return null;
    result.push({ original: match[1], local: match[2] ?? match[1] });
  }
  return result;
}

/**
 * Verify the import/export-only entry grammar emitted by published Vue bundles.
 * The entire entry must match; comments, executable code and other export
 * forms are unsupported, rather than being guessed from substring matches.
 * This is static export evidence, not execution of the imported dependencies.
 */
export function parseComponentExports(source: string): string[] | null {
  let remaining = source.trimStart();
  const locals = new Set<string>();
  function addLocal(name: string): boolean {
    if (forbiddenLocals.has(name) || locals.has(name)) return false;
    locals.add(name);
    return true;
  }
  while (remaining.startsWith('import')) {
    const sideEffect = sideEffectImport.exec(remaining);
    if (sideEffect) {
      if (sideEffect[0].includes('\\')) return null;
      remaining = remaining.slice(sideEffect[0].length).trimStart();
      continue;
    }
    const match = importDeclaration.exec(remaining);
    // Specifier escape parsing is outside this bounded grammar.
    if (!match || match[0].includes('\\')) return null;
    const clause = match[1];
    if (clause.startsWith('{')) {
      const items = bindings(clause.slice(1, -1));
      if (!items || items.some(item => !addLocal(item.local))) return null;
    } else if (!addLocal(clause.replace(/^\*\s+as\s+/, ''))) return null;
    remaining = remaining.slice(match[0].length).trimStart();
  }
  const exported = /^export\s*\{([^}]*)\}\s*;?\s*(?:\/\/# sourceMappingURL=[^\r\n]+\s*)?$/.exec(remaining);
  if (!exported) return null;
  const items = bindings(exported[1]);
  if (!items || items.some(item => !locals.has(item.original))) return null;
  const names = items.map(item => item.local);
  return new Set(names).size === names.length ? names : null;
}
