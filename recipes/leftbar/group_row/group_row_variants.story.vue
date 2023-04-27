<template>
  <dt-stack gap="600">
    <div>
      <h3>
        Default behavior
      </h3>
      <dt-recipe-group-row
        group-count-text="2 users"
        names="Jaqueline Nackos, Lori Smith"
      />
    </div>
    <div>
      <h3>
        Ellipsed names
      </h3>
      <dt-recipe-group-row
        group-count-text="4 users"
        names="Jaqueline Nackos, Lori Smith, Jaqueline Nackos, Lori Smith"
      />
    </div>
    <div>
      <h3>
        With unread count
      </h3>
      <dt-recipe-group-row
        group-count-text="2 users"
        names="Jaqueline Nackos, Lori Smith"
        :has-unreads="true"
        unread-count-tooltip="1 unread message"
      />
    </div>
    <div>
      <h3>
        Selected
      </h3>
      <dt-recipe-group-row
        group-count-text="2 users"
        names="Jaqueline Nackos, Lori Smith"
        selected
      />
    </div>
  </dt-stack>
</template>

<script>
import DtRecipeGroupRow from './group_row';
import { DtStack } from '@/components/stack';
const defaultImage = require('@/common/assets/person.png');

export default {
  name: 'DtRecipeGroupRowVariants',
  components: { DtRecipeGroupRow, DtStack },
  data () {
    return {
      defaultImage,
    };
  },
};
</script>
