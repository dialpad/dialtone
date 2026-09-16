<template>
  <dt-breadcrumb-item
    :inverted="$attrs.inverted"
    :selected="$attrs.selected"
    :label="$attrs.label"
    :href="$attrs.href"
    :class="$attrs.class"
  />
</template>

<script>
import DtBreadcrumbItem from './BreadcrumbItem.vue';

export default {
  name: 'DtBreadcrumbItemDefault',
  components: { DtBreadcrumbItem },
};
</script>
