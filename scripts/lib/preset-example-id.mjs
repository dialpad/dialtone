/** Exact preset identity, encoded for both URL IDs and copyable CLI arguments. */
export function presetExampleId(component, preset) {
  const encode = value => encodeURIComponent(value).replace(/[!'()*]/g,
    character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
  return `examples/presets/${encode(component)}/${encode(preset)}`;
}
