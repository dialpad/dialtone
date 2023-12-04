<template>
  <ol
    class="d-combobox__loading-list"
    aria-busy="true"
  >
    <dt-list-item
      v-for="index in 7"
      :key="index"
      role="option"
      navigation-type="none"
    >
      <dt-skeleton
        :text-option="{ type: 'body' }"
        :offset="0"
      />
    </dt-list-item>
  </ol>
</template>

<script>
import { DtListItem } from '../list_item';
import { DtSkeleton } from '../skeleton';

export default {
  name: 'ComboboxLoadingList',

  components: { DtListItem, DtSkeleton },
};
</script>
