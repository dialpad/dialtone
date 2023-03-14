<template>
  <dt-stack gap="600">
    <div>
      <h3>
        Default behavior
      </h3>
      <dt-recipe-group-row
        avatar-initials="JN"
        :group-count="2"
        group-count-text="2 users"
        names="Jaqueline Nackos, Lori Smith"
        :avatar-src="defaultImage"
      />
    </div>
    <div>
      <h3>
        Ellipsed names
      </h3>
      <dt-recipe-group-row
        avatar-initials="JN"
        :group-count="4"
        group-count-text="4 users"
        names="Jaqueline Nackos, Lori Smith, Jaqueline Nackos, Lori Smith"
        :avatar-src="defaultImage"
      />
    </div>
    <div>
      <h3>
        With unread count
      </h3>
      <dt-recipe-group-row
        avatar-initials="JN"
        :group-count="2"
        group-count-text="2 users"
        names="Jaqueline Nackos, Lori Smith"
        :avatar-src="defaultImage"
        :has-unreads="true"
        unread-count="1"
        unread-count-tooltip="1 unread message"
      />
    </div>
    <div>
      <h3>
        Selected
      </h3>
      <dt-recipe-group-row
        avatar-initials="JN"
        :group-count="2"
        group-count-text="2 users"
        names="Jaqueline Nackos, Lori Smith"
        :avatar-src="defaultImage"
        selected
      />
    </div>
    <div>
      <h3>
        With Initial as fallback when avatar image src cannot be found.
      </h3>
      <dt-recipe-group-row
        avatar-initials="JN"
        :group-count="2"
        group-count-text="2 users"
        names="Jaqueline Nackos, Lori Smith"
        avatar-src="/static/media/../components/avatar/404"
      />
    </div>
  </dt-stack>
</template>

<script>
import DtRecipeGroupRow from './group_row';
import { DtStack } from '@/components/stack';
const defaultImage = require('@/components/avatar/person.png');

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
