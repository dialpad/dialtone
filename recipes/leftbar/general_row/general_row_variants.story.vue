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
      />
      <div class="d-mt8">
        Note: the unread count is not limited to 99 or any number so make sure to add the necessary
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
        color="magenta"
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
import DtRecipeGeneralRow from './general_row';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtRecipeGeneralRowVariants',
  components: { DtRecipeGeneralRow, DtStack },
};
</script>
