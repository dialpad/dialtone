import { onBeforeMount, ref } from 'vue';

/**
 * Composable for loading component table data from JSON files.
 * Consolidates data loading logic shared by ComponentClassTable,
 * ComponentAccessibleTable, and similar components.
 *
 * @param {string} componentName - Name of the component (matches JSON filename)
 * @param {string} dataKey - Key to extract from JSON (e.g., 'classes', 'accessible')
 * @returns {Object} Object containing reactive data and loading state
 */
export function useComponentTableData(componentName, dataKey) {
  const data = ref(null);
  const loading = ref(true);
  const error = ref(null);

  onBeforeMount(async () => {
    try {
      const module = await import(`../../_data/${componentName}.json`);
      data.value = module[dataKey];
      loading.value = false;
    } catch (e) {
      error.value = e;
      loading.value = false;
      console.error(`Failed to load ${componentName}.json[${dataKey}]:`, e);
    }
  });

  return {
    data,
    loading,
    error,
  };
}
