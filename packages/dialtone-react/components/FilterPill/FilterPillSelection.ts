/** One choice of a controlled FilterPill. */
export interface DtFilterPillOption {
  /** Stable choice identity. */
  value: string;
  /** Required choice label. */
  label: string;
  /** Optional anchor summary; null uses label. */
  shortLabel?: string | null;
  /** Dropdown only. True keeps the row visible and focusable but refuses activation. */
  disabled?: boolean | null;
  /** Dropdown only. Visible secondary text and the row's accessible description. */
  description?: string | null;
  /** Dropdown only. Heading text; consecutive options with the same group share a section. */
  group?: string | null;
}

/** A controlled selection: `string | null` in dropdowns, `string[]` in popovers. */
export type DtFilterPillSelected = string | null | readonly string[];

export interface DtFilterPillOptionRow {
  option: Readonly<DtFilterPillOption>;
  disabled: boolean;
  description: string | null;
  group: string | null;
}

export interface DtFilterPillOptionSection {
  group: string | null;
  rows: DtFilterPillOptionRow[];
}

export interface DtFilterPillSelectionState {
  valid: boolean;
  options: Readonly<DtFilterPillOption>[];
  rows: DtFilterPillOptionRow[];
  sections: DtFilterPillOptionSection[];
  /** The normalized selection: `string | null` for single selection, `string[]` for multiple. */
  value: string | null | string[];
  /** The selection as a list. */
  values: string[];
  selectedOptions: Readonly<DtFilterPillOption>[];
  unknownValues: string[];
  isActive: boolean;
  issues: string[];
}

/** Compare the membership of owned selection snapshots without sorting consumer arrays. */
export function sameSelection (first: unknown, second: unknown): boolean {
  if (!Array.isArray(first) || !Array.isArray(second)) return first === second;
  return first.length === second.length && first.every(value => second.includes(value));
}

export function selectionSnapshot<T> (value: T): T {
  return (Array.isArray(value) ? [...value] : value) as T;
}

type RowField = 'disabled' | 'description' | 'group';

const ROW_FIELD_TYPES: Record<RowField, 'boolean' | 'string'> = { disabled: 'boolean', description: 'string', group: 'string' };
const ROW_FIELDS = Object.keys(ROW_FIELD_TYPES) as RowField[];

/**
 * Derive dropdown row presentation apart from the records, which slots receive unchanged.
 * Malformed fields are reported and read as absent; they never invalidate the options.
 */
function getOptionRows (records: Readonly<DtFilterPillOption>[], issues: string[]): DtFilterPillOptionRow[] {
  const read = (option: Readonly<DtFilterPillOption>, field: RowField): unknown =>
    (typeof option[field] === ROW_FIELD_TYPES[field] ? option[field] : null);
  for (const field of ROW_FIELDS) {
    if (records.some(option => option[field] != null && read(option, field) === null)) {
      issues.push(`option ${field} must be a ${ROW_FIELD_TYPES[field]} or null; malformed values are ignored.`);
    }
  }
  return records.map(option => ({
    option,
    disabled: read(option, 'disabled') === true,
    description: (read(option, 'description') as string | null) || null,
    group: (read(option, 'group') as string | null) || null,
  }));
}

/** Split rows into runs that share a group, in data order; options are never reordered. */
function getOptionSections (rows: DtFilterPillOptionRow[], issues: string[]): DtFilterPillOptionSection[] {
  const sections: DtFilterPillOptionSection[] = [];
  for (const row of rows) {
    const current = sections[sections.length - 1];
    if (current && current.group === row.group) {
      current.rows.push(row);
      continue;
    }
    if (row.group && sections.some(section => section.group === row.group)) {
      issues.push(`option group "${row.group}" repeats after other options and renders as a separate group.`);
    }
    sections.push({ group: row.group, rows: [row] });
  }
  return sections;
}

interface SelectionStateOptions {
  useDropdown?: boolean | null;
  neutralValue?: unknown;
}

/** Normalize the controlled contract without reading or mutating the legacy model. */
export function getSelectionState (
  options: unknown,
  selected: unknown,
  { useDropdown, neutralValue }: SelectionStateOptions = {},
): DtFilterPillSelectionState {
  const issues: string[] = [];
  const optionList = options as Readonly<DtFilterPillOption>[];
  const validOptions = Array.isArray(options) && Array.from(optionList).every(option =>
    option && typeof option.value === 'string' && typeof option.label === 'string' &&
    (option.shortLabel == null || typeof option.shortLabel === 'string')) &&
    new Set(optionList.map(option => option.value)).size === optionList.length;
  if (!validOptions) issues.push('options must contain unique string values and string labels.');
  const resolved = selected === undefined ? (useDropdown ? null : []) : selected;
  const validSelected = useDropdown
    ? resolved === null || typeof resolved === 'string'
    : Array.isArray(resolved) && Array.from(resolved).every(value => typeof value === 'string');
  if (!validSelected) issues.push('selected has the wrong shape for this selection pattern.');
  const validNeutral = !useDropdown || neutralValue == null || typeof neutralValue === 'string';
  if (!validNeutral) issues.push('neutralValue must be a string or null in single selection.');
  let value: string | null | string[];
  if (!validSelected) value = useDropdown ? null : [];
  else value = useDropdown ? resolved as string | null : [...new Set(resolved as string[])];
  if (!useDropdown && validSelected && (value as string[]).length !== (resolved as string[]).length) {
    issues.push('selected contains duplicate values.');
  }
  if (!useDropdown && neutralValue != null) issues.push('neutralValue is ignored in multiple selection.');
  const records = validOptions ? optionList.map(option => Object.freeze({ ...option })) : [];
  if (!useDropdown && records.some(option => ROW_FIELDS.some(field => option[field] != null))) {
    issues.push('option disabled, description and group are ignored in multiple selection.');
  }
  // Multiple selection renders checkboxes from the records, so only dropdowns have rows.
  const rows = useDropdown ? getOptionRows(records, issues) : [];
  const sections = getOptionSections(rows, issues);
  const values = useDropdown ? (value === null ? [] : [value as string]) : value as string[];
  const selectedOptions = records.filter(option => values.includes(option.value));
  const unknownValues = values.filter(item => !records.some(option => option.value === item));
  const isActive = useDropdown ? value !== null && value !== neutralValue : (value as string[]).length > 0;
  return {
    valid: validOptions && validSelected && validNeutral,
    options: records,
    rows,
    sections,
    value,
    values,
    selectedOptions,
    unknownValues,
    isActive,
    issues,
  };
}
