<template>
  <dt-breadcrumb-item
    :inverted="$attrs.inverted"
    :selected="$attrs.selected"
    :label="$attrs.label"
    :href="$attrs.href"
  />
</template>

<script>
import DtBreadcrumbItem from './breadcrumb_item.vue';

export default {
  name: 'DtBreadcrumbItemDefault',
  components: { DtBreadcrumbItem },
};
</script>
