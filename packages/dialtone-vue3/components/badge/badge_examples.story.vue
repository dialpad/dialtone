<template>
  <div class="d-fd-column d-p24 d-w100p d-of-auto d-stack8">
    <h2>Kind: Label</h2>
    <dt-stack
      direction="row"
      gap="400"
      align="center"
      data-migrate-outline
    >
      <dt-badge
        text="Co-host"
      />
      <dt-badge
        text="Customer"
      />
      <dt-badge
        text="Locked"
      >
        <template #leftIcon="{ iconSize }">
          <dt-icon-lock :size="iconSize" />
        </template>
      </dt-badge>
      <dt-badge
        text="Chat log"
      >
        <template #leftIcon="{ iconSize }">
          <dt-icon-message :size="iconSize" />
        </template>
      </dt-badge>
    </dt-stack>
    <dt-stack
      direction="row"
      gap="400"
      align="center"
      data-migrate-outline
    >
      <dt-badge
        text="Label"
        decoration="black-900"
      />
      <dt-badge
        text="Support"
        decoration="blue-400"
      />
      <dt-badge
        text="Complaint"
        decoration="red-400"
      />
    </dt-stack>
    <dt-stack
      direction="row"
      gap="400"
      align="center"
      data-migrate-outline
    >
      <dt-badge
        text="In progress"
        type="info"
      />
      <dt-badge
        text="Beta"
        type="info"
      />
      <dt-badge
        text="Draft"
        type="info"
      />
    </dt-stack>
    <dt-stack
      direction="row"
      gap="400"
      align="center"
      data-migrate-outline
    >
      <dt-badge
        text="Overdue"
        type="warning"
      />
    </dt-stack>
    <dt-stack
      direction="row"
      gap="400"
      align="center"
      data-migrate-outline
    >
      <dt-badge
        text="Resolved"
        type="success"
      />
    </dt-stack>
    <dt-stack
      direction="row"
      gap="400"
      align="center"
      data-migrate-outline
    >
      <dt-badge
        text="Recording"
        type="critical"
      >
        <template #leftIcon="{ iconSize }">
          <dt-icon-record-filled :size="iconSize" />
        </template>
      </dt-badge>
    </dt-stack>
    <dt-stack
      direction="row"
      gap="400"
      align="center"
      data-migrate-outline
    >
      <dt-badge
        text="Live"
        type="bulletin"
      />
      <dt-badge
        text="Presenter"
        type="bulletin"
      />
    </dt-stack>
    <dt-stack
      direction="row"
      gap="400"
      align="center"
      data-migrate-outline
    >
      <dt-badge
        text="Ai Notes"
        type="ai"
      />
      <dt-badge
        text="Ai Suggestion"
        type="ai"
      />
      <dt-badge
        text="Ai on"
        type="ai"
      />
      <dt-badge
        text="Ai Transcript"
        type="ai"
      />
    </dt-stack>
    <h2 class="d-mt32">
      Kind: Count
    </h2>
    <dt-stack
      direction="row"
      gap="400"
      align="center"
      data-migrate-outline
    >
      <dt-badge
        text="5%"
        kind="count"
        type="success"
      >
        <template #leftIcon="{ iconSize }">
          <dt-icon-arrow-up :size="iconSize" />
        </template>
      </dt-badge>
    </dt-stack>
    <dt-stack
      direction="row"
      gap="400"
      align="center"
      data-migrate-outline
    >
      <dt-badge
        text="-12%"
        kind="count"
        type="critical"
      >
        <template #leftIcon="{ iconSize }">
          <dt-icon-arrow-down :size="iconSize" />
        </template>
      </dt-badge>
    </dt-stack>
    <dt-stack
      direction="row"
      gap="400"
      align="center"
      data-migrate-outline
    >
      <dt-badge
        text="1"
        kind="count"
        type="bulletin"
      />
      <dt-badge
        text="18"
        kind="count"
        type="bulletin"
      />
      <dt-badge
        text="99+"
        kind="count"
        type="bulletin"
      />
    </dt-stack>
  </div>
</template>

<script>
import { DtBadge, DtStack } from './';
import {
  DtIconArrowDown,
  DtIconArrowUp,
  DtIconLock,
  DtIconMessage,
  DtIconRecordFilled,
} from '@dialpad/dialtone-icons/vue3';

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
