<template>
  <div>
    <dt-breadcrumbs
      class="d-py16 d-px12"
      :breadcrumbs="breadcrumbs"
    />
    <div class="d-bgc-purple-600 d-py16 d-px12">
      <dt-breadcrumbs
        inverted
        :breadcrumbs="breadcrumbs"
      />
    </div>

    <dt-breadcrumbs
      class="d-py16 d-px12"
    >
      <dt-breadcrumb-item
        v-for="breadcrumb in breadcrumbs"
        :key="breadcrumb.label"
        v-bind="breadcrumb"
      />
    </dt-breadcrumbs>
  </div>
</template>

<script>
import DtBreadcrumbs from './breadcrumbs';
import DtBreadcrumbItem from './breadcrumb_item';

export default {
  name: 'DtBreadcrumbsVariants',
  components: { DtBreadcrumbs, DtBreadcrumbItem },
};
</script>
