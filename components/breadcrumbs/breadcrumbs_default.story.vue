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
    >
      <html-fragment
        v-if="defaultSlot"
        :html="defaultSlot"
      />
    </dt-breadcrumbs>
  </div>
</template>

<script>
import DtBreadcrumbs from './breadcrumbs';
import { htmlFragment } from '../utils';

export default {
  name: 'DtBreadcrumbsDefault',
  components: { DtBreadcrumbs, htmlFragment },
};
</script>
