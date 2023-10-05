<template>
  <dt-breadcrumb-item
    :inverted="inverted"
    :selected="selected"
    :label="label"
    :href="href"
  />
</template>

<script>
import DtBreadcrumbItem from './breadcrumb_item.vue';

export default {
  name: 'DtBreadcrumbItemDefault',
  components: { DtBreadcrumbItem },
};
</script>
