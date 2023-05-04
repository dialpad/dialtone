<template>
  <dt-stack gap="600">
    <div>
      <h3>
        Channel with unread messages
      </h3>
      <dt-recipe-general-row
        type="channels"
        description="Channel name"
        unread-count="29"
        unread-count-tooltip="29 unread messages"
      />
      <div class="d-mt8 d-fc-secondary d-fs-100">
        <strong>Note:</strong> the unread count is not limited to 99 or any number so make sure to add the necessary
        logic to limit the number of unread messages if needed.
      </div>
    </div>
    <div>
      <h3>
        Contact Center
      </h3>
      <dt-recipe-general-row
        type="contact center"
        description="Contact Center name"
        color="magenta-200"
      />
    </div>
    <div>
      <h3>
        Dialbot
      </h3>
      <dt-recipe-general-row
        type="dialbot"
        description="Dialbot"
      />
    </div>
  </dt-stack>
</template>

<script>
import DtRecipeGeneralRow from './general_row.vue';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtRecipeGeneralRowVariants',
  components: { DtRecipeGeneralRow, DtStack },
};
</script>
