<template>
  <div class="d-w464">
    <dt-stack gap="600">
      <div>
        <p class="d-fw-bold">
          Default behavior
        </p>
        <dt-recipe-group-row
          class="d-pt8"
          avatar-initials="JN"
          :group-count="2"
          names="Jaqueline Nackos, Lori Smith"
          :avatar-src="avatarSrc"
        />
      </div>

      <div>
        <p class="d-fw-bold">
          Ellipsed names
        </p>
        <dt-recipe-group-row
          class="d-pt8"
          avatar-initials="JN"
          :group-count="4"
          names="Jaqueline Nackos, Lori Smith, Jaqueline Nackos, Lori Smith"
          :avatar-src="avatarSrc"
        />
      </div>

      <div>
        <p class="d-fw-bold">
          With unread count
        </p>
        <dt-recipe-group-row
          class="d-pt8"
          avatar-initials="JN"
          :group-count="2"
          names="Jaqueline Nackos, Lori Smith"
          :avatar-src="avatarSrc"
          unread-count="1"
        />
      </div>

      <div>
        <p class="d-fw-bold">
          Selected
        </p>
        <dt-recipe-group-row
          class="d-pt8"
          avatar-initials="JN"
          :group-count="2"
          names="Jaqueline Nackos, Lori Smith"
          :avatar-src="avatarSrc"
          selected
        />
      </div>

      <div>
        <p class="d-fw-bold">
          With Initial as fallback when avatar image src cannot be found.
        </p>
        <dt-recipe-group-row
          class="d-pt8"
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
