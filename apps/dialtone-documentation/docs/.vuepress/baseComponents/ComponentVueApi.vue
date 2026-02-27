<template>
  <div v-if="showImport" class="language-javascript" data-highlighter="prismjs" data-ext="js">
    <pre><code class="language-javascript" v-html="highlightedImport" /></pre>
  </div>
  <component-vue-api-table
    v-if="docSlots"
    category-name="Slots"
    :table-data="docSlots"
  />
  <component-vue-api-table
    v-if="docProps"
    category-name="Props"
    :table-data="docProps"
  />
  <component-vue-api-table
    v-if="docEvents"
    category-name="Events"
    :table-data="docEvents"
  />
</template>

<script setup>
import { computed, inject } from 'vue';
import Prism from 'prismjs';
import ComponentVueApiTable from './ComponentVueApiTable.vue';

const props = defineProps({
  componentName: {
    type: String,
    required: true,
  },

  /**
   * Show the import statement above the API tables.
   * Set to false on subsequent <component-vue-api> tags for compound components.
   */
  showImport: {
    type: Boolean,
    default: true,
  },

  /**
   * Additional component names to include in the import statement.
   * Used for compound components (e.g., tabs page passes ['tab', 'tabpanel']).
   */
  alsoImport: {
    type: Array,
    default: () => [],
  },
});
const formattedComponentName = computed(() => `Dt${props.componentName}`);
const componentDocs = inject('dialtoneComponentsDocumentation');

const isSameComponentName = (name) => {
  return name.toLowerCase() === formattedComponentName.value.toLowerCase() ||
    name.toLowerCase() === props.componentName.toLowerCase();
};

const findDisplayName = (componentName) => {
  const formatted = `Dt${componentName}`.toLowerCase();
  const entry = componentDocs.find(
    f => f.displayName && (
      f.displayName.toLowerCase() === formatted ||
      f.displayName.toLowerCase() === componentName.toLowerCase()
    ),
  );
  return entry?.displayName || `Dt${componentName.charAt(0).toUpperCase()}${componentName.slice(1)}`;
};

const importStatement = computed(() => {
  const names = [findDisplayName(props.componentName)];
  for (const name of props.alsoImport) {
    names.push(findDisplayName(name));
  }
  return `import { ${names.join(', ')} } from '@dialpad/dialtone-vue';`;
});

const highlightedImport = computed(() => {
  return Prism.highlight(importStatement.value, Prism.languages.javascript, 'javascript');
});

const isDeprecated = (item) => {
  return item.tags?.deprecated?.length > 0 ||
    /(@deprecated|deprecated[,)])/i.test(item.description || '');
};

const deprecationMessage = (item) => {
  const tag = item.tags?.deprecated?.[0]?.description;
  if (tag) return tag;
  const desc = item.description || '';
  const match = desc.match(/deprecated,?\s*use\s+([\w.]+)/i) ||
    desc.match(/@deprecated\s+Use\s+([\w.]+)/i);
  return match ? `Use ${match[1]}` : null;
};

const docSlots = componentDocs.find(f => isSameComponentName(f.displayName))
  ?.slots?.map((item) => {
    return {
      name: item.name,
      description: isDeprecated(item) ? undefined : item.description,
      deprecated: isDeprecated(item),
      deprecatedMessage: deprecationMessage(item),
    };
  });

const resolveConstantRef = (rawDefault, values) => {
  const match = rawDefault.match(/^[A-Z][A-Z_]*\.[A-Z][A-Z_]*$/);
  if (!match) return rawDefault;
  const key = rawDefault.split('.')[1].toLowerCase().replace(/_/g, '-');
  const found = values.find(v => v === key || v === key.replace(/-/g, '_'));
  if (found) return found;
  if (key === 'none' && values.includes('null')) return 'null';
  return rawDefault;
};

const resolveDefaultValue = (rawDefault, values) => {
  if (!rawDefault) return rawDefault;
  if (rawDefault === 'undefined') return null;
  if (/getUniqueString\(\)/.test(rawDefault)) return 'generated unique ID';
  if (!values?.length) return rawDefault;
  return resolveConstantRef(rawDefault, values);
};

const docProps = componentDocs.find(f => isSameComponentName(f.displayName))
  ?.props?.map((item) => {
    return {
      name: item.name,
      description: item.description,
      type: item.type?.name,
      defaultValue: resolveDefaultValue(item.defaultValue?.value, item.values),
      values: item.values,
      required: item.required,
      deprecated: isDeprecated(item),
      deprecatedMessage: deprecationMessage(item),
    };
  });

const docEvents = componentDocs.find(f => isSameComponentName(f.displayName))
  ?.events?.map((item) => {
    return {
      name: item.name,
      description: item.description,
      type: item.type?.names.join(' '),
      deprecated: isDeprecated(item),
      deprecatedMessage: deprecationMessage(item),
    };
  });
</script>

<style scoped>
.vue-api-table {
  word-break: normal;
  overflow-wrap: anywhere;
}
</style>
