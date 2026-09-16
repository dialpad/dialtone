<template>
  <div
    :class="[
      {
        'd-bgc-contrast': $attrs.inverted,
      },
    ]"
  >
    <dt-breadcrumbs
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
import DtBreadcrumbs from './Breadcrumbs.vue';
import { htmlFragment } from '@/common/utils';

export default {
  name: 'DtBreadcrumbsDefault',
  components: { DtBreadcrumbs, htmlFragment },
};
</script>
