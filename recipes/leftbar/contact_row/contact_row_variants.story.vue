<template>
  <dt-stack gap="600">
    <div>
      <h3>
        With user status
      </h3>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="active"
        :avatar-src="defaultImage"
        user-status="Good Morning! :smile:"
        call-button-tooltip="Call"
      />
    </div>
    <div>
      <h3>
        with away presence
      </h3>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="away"
        presence-text="Away"
        user-status="Out for a bit"
        :avatar-src="defaultImage"
        call-button-tooltip="Call"
      />
    </div>
    <div>
      <h3>
        with busy presence
      </h3>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="busy"
        presence-text="In a meeting"
        user-status="Meetings all day"
        :avatar-src="defaultImage"
        call-button-tooltip="Call"
      />
    </div>
    <div>
      <h3>
        With unread count
      </h3>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="active"
        :avatar-src="defaultImage"
        unread-count="5"
        unread-count-tooltip="55 unread messages"
        :has-unreads="true"
        call-button-tooltip="Call"
      />
    </div>
    <div>
      <h3>
        Selected
      </h3>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="active"
        :avatar-src="defaultImage"
        :selected="true"
        call-button-tooltip="Call"
      />
    </div>
    <div>
      <h3>
        With initial
      </h3>
      <dt-recipe-contact-row
        name="Jaqueline Nackos"
        avatar-presence="active"
        call-button-tooltip="Call"
      />
    </div>
  </dt-stack>
</template>

<script>
import DtRecipeContactRow from './contact_row';
import { DtStack } from '@/components/stack';
const defaultImage = require('@/common/assets/person.png');

export default {
  name: 'DtRecipeContactRowVariants',
  components: { DtRecipeContactRow, DtStack },
  data () {
    return {
      defaultImage,
    };
  },
};
</script>
