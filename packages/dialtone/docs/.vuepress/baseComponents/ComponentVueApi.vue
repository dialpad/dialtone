<template>
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
import { computed } from 'vue';
import ComponentDocs from '../../../node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import ComponentVueApiTable from './ComponentVueApiTable.vue';

const props = defineProps({
  componentName: {
    type: String,
    required: true,
  },
});
const formattedComponentName = computed(() => `Dt${props.componentName}`);

const docSlots = ComponentDocs.find(f => f.displayName.toLowerCase() === formattedComponentName.value.toLowerCase())
  ?.slots?.map((item) => {
    return {
      name: item.name,
      description: item.description,
    };
  });

const docProps = ComponentDocs.find(f => f.displayName.toLowerCase() === formattedComponentName.value.toLowerCase())
  ?.props?.map((item) => {
    return {
      name: item?.name,
      description: item?.description,
      type: item?.type?.name,
      defaultValue: item?.defaultValue?.value,
      values: item?.values,
      required: item?.required,
    };
  });

const docEvents = ComponentDocs.find(f => f.displayName.toLowerCase() === formattedComponentName.value.toLowerCase())
  ?.events?.map((item) => {
    return {
      name: item.name,
      description: item.description,
      type: item.type?.names.join(' '),
    };
  });
</script>

<style scoped>
.vue-api-table {
  word-break: normal;
  overflow-wrap: anywhere;
}
</style>
