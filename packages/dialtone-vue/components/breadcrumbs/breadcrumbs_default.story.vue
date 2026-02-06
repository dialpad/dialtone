<template>
  <div
    :class="[
      {
        'd-bgc-purple-600': $attrs.inverted,
      },
    ]"
  >
    <dt-breadcrumbs
      class="d-py16 d-px12"
      :breadcrumbs="$attrs.breadcrumbs"
      :inverted="$attrs.inverted"
    >
      <html-fragment
        v-if="defaultSlot"
        :html="defaultSlot"
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
