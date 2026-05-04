<template>
  <dt-stack gap="400">
    <div>
      <h3>
        Default behavior
      </h3>
      <dt-recipe-group-row
        names="Jaqueline Nackos, Lori Smith"
      />
    </div>
    <div>
      <h3>
        Ellipsed names
      </h3>
      <dt-recipe-group-row
        names="Jaqueline Nackos, Lori Smith, Jaqueline Nackos, Lori Smith"
      />
    </div>
    <div>
      <h3>
        With unread count
      </h3>
      <dt-recipe-group-row
        names="Jaqueline Nackos, Lori Smith"
        :has-unreads="true"
        unread-count="1"
      />
    </div>
    <div>
      <h3>
        Selected
      </h3>
      <dt-recipe-group-row
        names="Jaqueline Nackos, Lori Smith"
        selected
      />
    </div>
  </dt-stack>
</template>

<script>
import DtRecipeGroupRow from './GroupRow.vue';
import { DtStack } from '@/components/Stack';

export default {
  name: 'DtRecipeGroupRowVariants',
  components: { DtRecipeGroupRow, DtStack },
};
</script>
