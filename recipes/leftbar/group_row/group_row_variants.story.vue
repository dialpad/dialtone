<template>
  <div class="d-w464">
    <dt-stack gap="600">
      <dt-stack gap="400">
        <p class="d-fw-bold">
          Default behavior
        </p>
        <dt-recipe-group-row
          avatar-initials="JN"
          :group-count="2"
          names="Jaqueline Nackos, Lori Smith"
          :avatar-src="defaultImage"
        />
      </dt-stack>

      <dt-stack gap="400">
        <p class="d-fw-bold">
          Ellipsed names
        </p>
        <dt-recipe-group-row
          avatar-initials="JN"
          :group-count="4"
          names="Jaqueline Nackos, Lori Smith, Jaqueline Nackos, Lori Smith"
          :avatar-src="defaultImage"
        />
      </dt-stack>

      <dt-stack gap="400">
        <p class="d-fw-bold">
          With unread count
        </p>
        <dt-recipe-group-row
          avatar-initials="JN"
          :group-count="2"
          names="Jaqueline Nackos, Lori Smith"
          :avatar-src="defaultImage"
          unread-count="1"
        />
      </dt-stack>

      <dt-stack gap="400">
        <p class="d-fw-bold">
          Selected
        </p>
        <dt-recipe-group-row
          avatar-initials="JN"
          :group-count="2"
          names="Jaqueline Nackos, Lori Smith"
          :avatar-src="defaultImage"
          selected
        />
      </dt-stack>

      <dt-stack gap="400">
        <p class="d-fw-bold">
          With Initial as fallback when avatar image src cannot be found.
        </p>
        <dt-recipe-group-row
          avatar-initials="JN"
          :group-count="2"
          names="Jaqueline Nackos, Lori Smith"
          avatar-src="/static/media/../components/avatar/404"
        />
      </dt-stack>
    </dt-stack>
  </div>
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
