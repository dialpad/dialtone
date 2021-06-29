<template>
  <div
    :class="[
      {
        'd-bgc-purple-800': inverted,
      },
    ]"
  >
    <dt-breadcrumbs
      class="d-py16 d-px12"
      :breadcrumbs="breadcrumbs"
      :inverted="inverted"
    />
  </div>
</template>

<script>
import DtBreadcrumbs from './breadcrumbs';

export default {
  name: 'DtBreadcrumbsDefault',
  components: { DtBreadcrumbs },
};
</script>
