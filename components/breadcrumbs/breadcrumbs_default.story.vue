<template>
  <div
    :class="[
      {
        'd-bgc-purple-600': inverted,
      },
    ]"
  >
    <dt-breadcrumbs
      class="d-py16 d-px12"
      :breadcrumbs="$attrs.breadcrumbs"
      :inverted="$attrs.inverted"
    >
      <html-fragment
        v-if="$attrs.default"
        :html="$attrs.default"
      />
    </dt-breadcrumbs>
  </div>
</template>

<script>
import DtBreadcrumbs from './breadcrumbs.vue';
import { htmlFragment } from '@/common/utils';

export default {
  name: 'DtBreadcrumbsDefault',
  components: { DtBreadcrumbs, htmlFragment },
};
</script>
