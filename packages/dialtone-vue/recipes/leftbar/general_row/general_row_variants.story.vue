<template>
  <dt-stack gap="600">
    <div>
      <h3 class="d-mb8">
        Channel with unread messages
      </h3>
      <dt-recipe-general-row
        description="Channel name 😄"
        has-unreads
        type="channels"
        unread-count="29"
      />
      <div class="d-mt8 d-fc-secondary d-fs-100">
        <strong>Note:</strong> the unread count is not limited to 99 or any number so make sure to add the necessary
        logic to limit the number of unread messages if needed.
      </div>
    </div>
    <div>
      <h3 class="d-mb8">
        Contact Center
      </h3>
      <dt-recipe-general-row
        color="magenta-200"
        description="Contact Center name"
        type="contact center"
      />
    </div>
    <div>
      <h3 class="d-mb8">
        Dialbot
      </h3>
      <dt-recipe-general-row
        description="Dialbot"
        type="dialbot"
      />
    </div>
    <div>
      <h3>
        Channel with unread messages
      </h3>
      <dt-recipe-general-row
        description="Channel name"
        has-unreads
        type="channels"
        unread-count="1"
      />
    </div>
    <div>
      <h3>
        Channel only show unread mentioned count with 'always' setting
      </h3>
      <dt-recipe-general-row
        channel-setting="always"
        description="Channel name"
        has-unreads
        type="channels"
        unread-mention-count="1"
      />
    </div>
    <div>
      <h3>
        Channel show unread mentioned count with other than 'always' setting
      </h3>
      <dt-recipe-general-row
        channel-setting="mention"
        description="Channel name"
        has-unreads
        type="channels"
        unread-mention-count="1"
      />
    </div>
    <div>
      <h3>
        Channel show both unread and unread mention count
      </h3>
      <dt-recipe-general-row
        description="Channel name"
        has-unreads
        type="channels"
        unread-count="4"
        unread-mention-count="1"
      />
    </div>
    <div>
      <h3>
        Contact Center with DND and unread count
      </h3>
      <dt-recipe-general-row
        has-unreads
        color="magenta-200"
        description="Long contact center name"
        dnd-text="DND"
        type="contact center"
        unread-count="1"
      />
    </div>
    <div>
      <h3>
        Contact Center with active voice chat
      </h3>
      <dt-recipe-general-row
        active-voice-chat
        color="magenta-200"
        description="Long contact center name :smile: with emoji"
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
