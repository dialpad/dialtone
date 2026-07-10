<!-- eslint-disable vue/no-restricted-class -->
<template>
  <dt-stack gap="600">
    <section>
      <dt-text
        as="h3"
        variant="label-md"
        class="d-mbe-200"
      >
        Unordered
      </dt-text>
      <dt-text-list>
        <dt-text-list-item>Connect voice, meetings, and messaging in one workspace.</dt-text-list-item>
        <dt-text-list-item>Search across conversations without switching tools.</dt-text-list-item>
        <dt-text-list-item>Summarize follow-ups for every customer touchpoint.</dt-text-list-item>
      </dt-text-list>
    </section>

    <section>
      <dt-text
        as="h3"
        variant="label-md"
        class="d-mbe-200"
      >
        Ordered
      </dt-text>
      <dt-text-list
        type="ordered"
        marker="decimal"
        :start="3"
      >
        <dt-text-list-item>Invite the implementation team.</dt-text-list-item>
        <dt-text-list-item value="7">
          Map shared inboxes to current queues.
        </dt-text-list-item>
        <dt-text-list-item>Review routing changes before launch.</dt-text-list-item>
      </dt-text-list>
    </section>

    <section>
      <dt-text
        as="h3"
        variant="label-md"
        class="d-mbe-200"
      >
        Custom Markers
      </dt-text>
      <dt-text-list
        marker-tone="positive"
      >
        <dt-text-list-item>
          <template #marker>
            <dt-icon-check size="200" />
          </template>
          Included in every plan.
        </dt-text-list-item>
        <dt-text-list-item marker-tone="critical">
          <template #marker>
            <dt-icon-close size="200" />
          </template>
          Requires admin approval.
        </dt-text-list-item>
        <dt-text-list-item>
          <template #marker>
            <span aria-hidden="true">+</span>
          </template>
          Custom marker slot.
        </dt-text-list-item>
      </dt-text-list>
    </section>

    <section>
      <dt-text
        as="h3"
        variant="label-md"
        class="d-mbe-200"
      >
        Nested
      </dt-text>
      <dt-text-list>
        <dt-text-list-item>
          Prepare the launch workspace.
          <dt-text-list
            type="ordered"
            gap="50"
          >
            <dt-text-list-item>Confirm owners.</dt-text-list-item>
            <dt-text-list-item>Publish onboarding notes.</dt-text-list-item>
          </dt-text-list>
        </dt-text-list-item>
        <dt-text-list-item>
          Track unresolved tasks.
          <dt-text-list gap="50">
            <dt-text-list-item>Permissions</dt-text-list-item>
            <dt-text-list-item>Billing handoff</dt-text-list-item>
          </dt-text-list>
        </dt-text-list-item>
      </dt-text-list>
    </section>
  </dt-stack>
</template>

<script>
import { DtStack } from '@/components/Stack';
import { DtText } from '@/components/Text';
import { DtIconCheck, DtIconClose } from '@dialpad/dialtone-icons/vue';
import { DtTextList, DtTextListItem } from './index';

export default {
  name: 'DtTextListVariants',
  components: {
    DtStack,
    DtText,
    DtTextList,
    DtTextListItem,
    DtIconCheck,
    DtIconClose,
  },
};
</script>
