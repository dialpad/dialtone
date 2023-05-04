<template>
  <div class="d-fd-column d-p24 d-w100p d-of-auto d-stack8">
    <h2>Kind: Label</h2>
    <div
      class="d-d-flex d-gg8 d-ai-center"
    >
      <dt-badge
        text="Co-host"
      />
      <dt-badge
        text="Customer"
      />
      <dt-badge
        text="Locked"
        icon-left="lock"
      />
      <dt-badge
        text="Chat log"
        icon-left="message"
      />
    </div>
    <div
      class="d-d-flex d-gg8 d-ai-center"
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
    </div>
    <div
      class="d-d-flex d-gg8 d-ai-center"
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
    </div>
    <div
      class="d-d-flex d-gg8 d-ai-center"
    >
      <dt-badge
        text="Overdue"
        type="warning"
      />
    </div>
    <div
      class="d-d-flex d-gg8 d-ai-center"
    >
      <dt-badge
        text="Resolved"
        type="success"
      />
    </div>
    <div
      class="d-d-flex d-gg8 d-ai-center"
    >
      <dt-badge
        text="Recording"
        type="critical"
        icon-left="record-filled"
      />
    </div>
    <div
      class="d-d-flex d-gg8 d-ai-center"
    >
      <dt-badge
        text="Live"
        type="bulletin"
      />
      <dt-badge
        text="Presenter"
        type="bulletin"
      />
    </div>
    <div
      class="d-d-flex d-gg8 d-ai-center"
    >
      <dt-badge
        text="Notes"
        type="ai"
      />
      <dt-badge
        text="Suggestion"
        type="ai"
      />
      <dt-badge
        text="on"
        type="ai"
      />
      <dt-badge
        text="Transcript"
        type="ai"
      />
    </div>
    <h2 class="d-mt32">
      Kind: Count
    </h2>
    <div
      class="d-d-flex d-gg8 d-ai-center"
    >
      <dt-badge
        text="5%"
        kind="count"
        type="success"
        icon-left="arrow-up"
      />
    </div>
    <div
      class="d-d-flex d-gg8 d-ai-center"
    >
      <dt-badge
        text="-12%"
        kind="count"
        type="critical"
        icon-left="arrow-down"
      />
    </div>
    <div
      class="d-d-flex d-gg8 d-ai-center"
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
    </div>
  </div>
</template>

<script>
import DtBadge from './badge.vue';

export default {
  name: 'DtBadgeExamples',

  components: { DtBadge },
};
</script>
