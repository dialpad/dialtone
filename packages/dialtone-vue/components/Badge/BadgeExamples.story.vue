<template>
  <dt-stack gap="100">
    <h2>Variant: Base</h2>
    <dt-stack
      direction="row"
      gap="100"
      align="center"
    >
      <dt-badge
        kind="status"
        variant="neutral"
        label="Co-host"
      />
      <dt-badge
        kind="status"
        variant="neutral"
        label="Customer"
      />
      <dt-badge
        kind="status"
        variant="neutral"
        label="Locked"
      >
        <template #startIcon>
          <dt-icon-lock size="200" />
        </template>
      </dt-badge>
      <dt-badge
        kind="status"
        variant="neutral"
        label="Chat log"
      >
        <template #startIcon>
          <dt-icon-message size="200" />
        </template>
      </dt-badge>
    </dt-stack>
    <dt-stack
      direction="row"
      gap="100"
      align="center"
    >
      <dt-badge
        kind="status"
        variant="neutral"
        label="Label"
        decoration="black-900"
      />
      <dt-badge
        kind="status"
        variant="neutral"
        label="Support"
        decoration="blue-400"
      />
      <dt-badge
        kind="status"
        variant="neutral"
        label="Complaint"
        decoration="red-400"
      />
    </dt-stack>
    <dt-stack
      direction="row"
      gap="100"
      align="center"
    >
      <dt-badge
        kind="status"
        label="In progress"
        variant="info"
      />
      <dt-badge
        kind="status"
        label="Beta"
        variant="info"
      />
      <dt-badge
        kind="status"
        label="Draft"
        variant="info"
      />
    </dt-stack>
    <dt-stack
      direction="row"
      gap="100"
      align="center"
    >
      <dt-badge
        kind="status"
        label="Overdue"
        variant="warning"
      />
    </dt-stack>
    <dt-stack
      direction="row"
      gap="100"
      align="center"
    >
      <dt-badge
        kind="status"
        label="Resolved"
        variant="positive"
      />
    </dt-stack>
    <dt-stack
      direction="row"
      gap="100"
      align="center"
    >
      <dt-badge
        kind="status"
        label="Recording"
        variant="critical"
      >
        <template #startIcon>
          <dt-icon-record-filled size="200" />
        </template>
      </dt-badge>
    </dt-stack>
    <dt-stack
      direction="row"
      gap="100"
      align="center"
    >
      <dt-badge
        kind="release"
        label="Live"
        variant="pre-release"
      />
      <dt-badge
        kind="status"
        label="Presenter"
        variant="neutral"
      />
    </dt-stack>
    <dt-stack
      direction="row"
      gap="100"
      align="center"
    >
      <dt-badge
        kind="status"
        label="Ai Notes"
        variant="neutral"
      />
      <dt-badge
        kind="status"
        label="Ai Suggestion"
        variant="neutral"
      />
      <dt-badge
        kind="status"
        label="Ai on"
        variant="neutral"
      />
      <dt-badge
        kind="status"
        label="Ai Transcript"
        variant="neutral"
      />
    </dt-stack>
    <h2 class="d-mbs-400">
      Variant: Count
    </h2>
    <dt-stack
      direction="row"
      gap="100"
      align="center"
    >
      <dt-badge
        kind="counter"
        label="5%"
        variant="count"
        emphasis="strong"
      >
        <template #startIcon>
          <dt-icon-arrow-up size="200" />
        </template>
      </dt-badge>
    </dt-stack>
    <dt-stack
      direction="row"
      gap="100"
      align="center"
    >
      <dt-badge
        kind="counter"
        label="-12%"
        variant="count"
        emphasis="strong"
      >
        <template #startIcon>
          <dt-icon-arrow-down size="200" />
        </template>
      </dt-badge>
    </dt-stack>
    <dt-stack
      direction="row"
      gap="100"
      align="center"
    >
      <dt-badge
        kind="counter"
        label="1"
        variant="count"
      />
      <dt-badge
        kind="counter"
        label="18"
        variant="count"
      />
      <dt-badge
        kind="counter"
        label="99+"
        variant="count"
      />
    </dt-stack>
  </dt-stack>
</template>

<script>
import { DtBadge } from './';
import { DtStack } from '@/components/Stack';

import {
  DtIconArrowDown,
  DtIconArrowUp,
  DtIconLock,
  DtIconMessage,
  DtIconRecordFilled,
} from '@dialpad/dialtone-icons/vue';

export default {
  name: 'DtBadgeExamples',

  components: {
    DtBadge,
    DtStack,
    DtIconArrowDown,
    DtIconArrowUp,
    DtIconLock,
    DtIconMessage,
    DtIconRecordFilled,
  },
};
</script>
