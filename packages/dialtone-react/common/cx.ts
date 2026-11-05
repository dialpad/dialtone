/**
 * A class value as Vue's class binding accepts it: a string, an array, or an object of class → condition.
 * Props that take a class in dialtone-vue (iconClass, labelClass…) take this in React.
 */
export type ClassValue = string | number | null | undefined | false | ClassValue[] | Record<string, unknown>;

/** Joins class values the way Vue normalizes a class binding. */
export function cx (...values: ClassValue[]): string {
  const out: string[] = [];
  const add = (value: ClassValue) => {
    if (!value) return;
    if (typeof value === 'string' || typeof value === 'number') out.push(String(value));
    else if (Array.isArray(value)) value.forEach(add);
    else for (const [name, on] of Object.entries(value)) if (on) out.push(name);
  };
  values.forEach(add);
  return out.join(' ').replace(/\s+/g, ' ').trim();
}
