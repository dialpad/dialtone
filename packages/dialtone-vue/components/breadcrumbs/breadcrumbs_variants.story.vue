<template>
  <div>
    <dt-breadcrumbs
      class="d-py16 d-px12"
      :breadcrumbs="$attrs.breadcrumbs"
    />
    <dt-breadcrumbs
      class="d-py16 d-px12"
    >
      <dt-breadcrumb-item
        v-for="(breadcrumb, idx) in $attrs.breadcrumbs"
        :key="breadcrumb.label + idx"
        v-bind="breadcrumb"
      />
    </dt-breadcrumbs>
  </div>
</template>

<script>
import DtBreadcrumbs from './breadcrumbs.vue';
import DtBreadcrumbItem from './breadcrumb_item.vue';

export default {
  name: 'DtBreadcrumbsVariants',
  components: { DtBreadcrumbs, DtBreadcrumbItem },
};
</script>
