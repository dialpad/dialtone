<template>
  <div class="d-w464">
    <dt-stack gap="600">
      <div>
        <h3>
          Default behavior
        </h3>
        <dt-recipe-group-row
          avatar-initials="JN"
          :group-count="2"
          names="Jaqueline Nackos, Lori Smith"
          :avatar-src="avatarSrc"
        />
      </div>
      <div>
        <h3>
          Ellipsed names
        </h3>
        <dt-recipe-group-row
          avatar-initials="JN"
          :group-count="4"
          names="Jaqueline Nackos, Lori Smith, Jaqueline Nackos, Lori Smith"
          :avatar-src="avatarSrc"
        />
      </div>
      <div>
        <h3>
          With unread count
        </h3>
        <dt-recipe-group-row
          avatar-initials="JN"
          :group-count="2"
          names="Jaqueline Nackos, Lori Smith"
          :avatar-src="avatarSrc"
          unread-count="1"
        />
      </div>
      <div>
        <h3>
          Selected
        </h3>
        <dt-recipe-group-row
          avatar-initials="JN"
          :group-count="2"
          names="Jaqueline Nackos, Lori Smith"
          :avatar-src="avatarSrc"
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
          names="Jaqueline Nackos, Lori Smith"
          avatar-src="/static/media/../components/avatar/404"
        />
      </div>
    </dt-stack>
  </div>
</template>

<script>
import DtRecipeGroupRow from './group_row';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtRecipeGroupRowVariants',
  components: { DtRecipeGroupRow, DtStack },
};
</script>
