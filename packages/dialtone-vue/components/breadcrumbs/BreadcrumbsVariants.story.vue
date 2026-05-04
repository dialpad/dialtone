<template>
  <div>
    <dt-breadcrumbs
      class="d-py-200 d-px-150"
      :breadcrumbs="$attrs.breadcrumbs"
    />
    <dt-breadcrumbs
      class="d-py-200 d-px-150"
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
import DtBreadcrumbItem from './BreadcrumbItem.vue';

export default {
  name: 'DtBreadcrumbsVariants',
  components: { DtBreadcrumbs, DtBreadcrumbItem },
};
</script>
