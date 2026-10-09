import {
  normalizeComponents,
  normalizeComponentName,
  componentNames,
} from './component-identity.js';
import type { Component, ComponentMember } from './types.js';
import type { MatchState } from './retrieval.js';

export const COMPONENT_SECTIONS = [
  'props',
  'events',
  'slots',
  'methods',
  'expose',
] as const;
export type ComponentSection = (typeof COMPONENT_SECTIONS)[number];
/** Contract fields that generated metadata can document for each section. */
const CONTRACT_FIELDS: Record<ComponentSection, readonly string[]> = {
  props: ['type', 'values', 'defaultValue', 'required', 'description', 'tags'],
  events: ['type', 'properties', 'description', 'tags'],
  slots: ['bindings', 'description', 'tags'],
  methods: ['params', 'returns', 'description'],
  expose: ['type', 'description'],
};
export interface ComponentDetailArgs {
  component: string;
  projection?: 'all' | ComponentSection;
  field?: string;
}

/** Select identity before projecting API fields. Never use a ranked feature hit. */
export function getComponentDetail(
  args: ComponentDetailArgs,
  records: Component[],
) {
  const name = args.component.trim();
  const key = normalizeComponentName(name);
  const components = normalizeComponents(records);
  const candidates = key
    ? components.filter((record) =>
        componentNames(record).some(
          (alias) => normalizeComponentName(alias) === key,
        ),
      )
    : [];
  const exact = candidates.filter((record) => record.displayName === name);
  const component =
    exact.length === 1
      ? exact[0]
      : candidates.length === 1
        ? candidates[0]
        : null;
  const sections =
    args.projection && args.projection !== 'all'
      ? [args.projection]
      : COMPONENT_SECTIONS;
  if (!component) {
    return {
      match: candidates.length ? ('candidate' as const) : ('no-match' as const),
      component: null,
      items: [],
      available: candidates.map((record) => record.displayName),
      unknown: [],
      unknownContractFields: [],
    };
  }
  const unknown = sections.filter(
    (section) => !Object.hasOwn(component, section),
  );
  const available = sections.flatMap((section) =>
    (component[section] ?? []).map((record) => record.name),
  );
  const items = sections.flatMap((section) =>
    (component[section] ?? [])
      .filter(
        (record) =>
          !args.field ||
          record.name.toLowerCase() === args.field.trim().toLowerCase(),
      )
      .map((contract) => ({ section, contract: contract as ComponentMember })),
  );
  const unknownContractFields = items
    .map(({ section, contract }) => ({
      section,
      name: contract.name,
      fields: CONTRACT_FIELDS[section].filter(
        (field) => !Object.hasOwn(contract, field),
      ),
    }))
    .filter((record) => record.fields.length);
  const match: MatchState =
    args.field && items.length === 0
      ? 'no-match'
      : component.identity?.kind === 'unknown'
        ? 'unverified'
        : 'exact';
  return {
    match,
    component,
    items,
    available,
    unknown,
    unknownContractFields,
  };
}
