/** Explicit Vue directive/plugin names, without treating general intent as an identifier. */
export function directiveIdentifiers(query: string): string[] {
  const names = [
    ...[...query.matchAll(/\bv-dt-([a-z][a-z0-9]*(?:-[a-z0-9]+)*)\b/gi)].map(match => match[1]),
    ...[...query.matchAll(/\bDt([A-Z][A-Za-z0-9]*)Directive\b/g)].map(match => match[1]),
  ];
  return [...new Set(names.map(name => name.toLowerCase()))];
}
