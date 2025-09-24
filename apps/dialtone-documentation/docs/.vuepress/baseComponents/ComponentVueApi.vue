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
import { computed, inject } from 'vue';
import ComponentVueApiTable from './ComponentVueApiTable.vue';

const props = defineProps({
  componentName: {
    type: String,
    required: true,
  },
});
const formattedComponentName = computed(() => `Dt${props.componentName}`);
const componentDocs = inject('dialtoneComponentsDocumentation');

const isSameComponentName = (name) => {
  return name.toLowerCase() === formattedComponentName.value.toLowerCase() ||
    name.toLowerCase() === props.componentName.toLowerCase();
};

const docSlots = componentDocs.find(f => isSameComponentName(f.displayName))
  ?.slots?.map((item) => {
    return {
      name: item.name,
      description: item.description,
    };
  });

const docProps = componentDocs.find(f => isSameComponentName(f.displayName))
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

const docEvents = componentDocs.find(f => isSameComponentName(f.displayName))
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
