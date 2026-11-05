<template>
  <ol class="d-breadcrumbs__list">
    <dt-breadcrumb-item
      :inverted="$attrs.inverted"
      :selected="$attrs.selected"
      :label="$attrs.label"
      :href="$attrs.href"
      :class="$attrs.class"
    />
  </ol>
</template>

<script>
import DtBreadcrumbItem from './BreadcrumbItem.vue';

export default {
  name: 'DtBreadcrumbItemDefault',
  components: { DtBreadcrumbItem },
};
</script>
