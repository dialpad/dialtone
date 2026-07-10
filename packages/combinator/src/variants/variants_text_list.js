import {
  DT_TEXT_LIST_ORDERED_MARKERS,
  DT_TEXT_LIST_UNORDERED_MARKERS,
} from '@dialpad/dialtone-vue';

export default {
  defaults: {
    props: {
      gap: {
        tokenCategory: 'spacing',
        searchKeywords: ['spacing'],
      },
      marker: {
        searchKeywords: ['bullet', 'number', 'list style'],
      },
      markerTone: {
        tokenCategory: 'color:d-text-list--marker-tone-:--text-list-marker-color',
        searchKeywords: ['marker color', 'foreground color'],
      },
      start: {
        searchKeywords: ['ordered list', 'numbering'],
      },
      reversed: {
        searchKeywords: ['ordered list', 'numbering'],
      },
    },
  },

  exclusions: [
    {
      when: { type: 'unordered' },
      disable: { props: ['start', 'reversed'] },
    },
    {
      when: { type: 'unordered' },
      disableValues: { props: { marker: DT_TEXT_LIST_ORDERED_MARKERS } },
    },
    {
      when: { type: 'ordered' },
      disableValues: { props: { marker: DT_TEXT_LIST_UNORDERED_MARKERS } },
    },
  ],

  default: {
    slots: {
      default: {
        initialValue: `<dt-text-list-item>Collaborative inboxes</dt-text-list-item>
<dt-text-list-item>AI-powered call summaries</dt-text-list-item>
<dt-text-list-item>Unified customer history</dt-text-list-item>`,
      },
    },
  },

  ordered: {
    props: {
      type: {
        initialValue: 'ordered',
      },
    },
    slots: {
      default: {
        initialValue: `<dt-text-list-item>Invite the workspace owners</dt-text-list-item>
<dt-text-list-item>Map inboxes to support queues</dt-text-list-item>
<dt-text-list-item>Review routing before launch</dt-text-list-item>`,
      },
    },
  },

  nested: {
    props: {
      type: {
        initialValue: 'ordered',
      },
    },
    slots: {
      default: {
        initialValue: `<dt-text-list-item>Prepare the launch workspace
  <dt-text-list type="unordered">
    <dt-text-list-item>Confirm owners</dt-text-list-item>
    <dt-text-list-item>Publish onboarding notes</dt-text-list-item>
  </dt-text-list>
</dt-text-list-item>
<dt-text-list-item type="unordered">Track unresolved tasks
  <dt-text-list>
    <dt-text-list-item>Permissions</dt-text-list-item>
    <dt-text-list-item>Billing handoff</dt-text-list-item>
  </dt-text-list>
</dt-text-list-item>`,
      },
    },
  },

  'custom markers, marker tone, style list items': {
    slots: {
      default: {
        initialValue: `<dt-text-list-item class="d-p-200 d-bar-400" marker-tone="secondary">
  <template #marker>
    <dt-icon name="check-circle-filled" size="500" />
  </template>
  <dt-text as="p" variant="body-md" tone="secondary">Complete the form</dt-text>
  <dt-text as="p" variant="body-sm" tone="tertiary">Add contact and workspace details.</dt-text>
</dt-text-list-item>
<dt-text-list-item class="d-p-200 d-bar-400 d-bgc-moderate-opaque" marker-tone="primary">
  <template #marker>
    <dt-icon name="circle-half-filled" size="500" />
  </template>
  <dt-text as="p" variant="body-md" tone="primary">Fix the errors</dt-text>
  <dt-text as="p" variant="body-sm" tone="secondary">Review required fields and warnings.</dt-text>
</dt-text-list-item>
<dt-text-list-item class="d-p-200 d-bar-400">
  <template #marker>
    <dt-icon name="circle-dashed" size="500" />
  </template>
  <dt-text as="p" variant="body-md" tone="tertiary">Submit for review</dt-text>
  <dt-text as="p" variant="body-sm" tone="tertiary">Send the request to workspace admins.</dt-text>
</dt-text-list-item>
<dt-text-list-item class="d-p-200 d-bar-400">
  <template #marker>
    <dt-icon name="circle-dashed" size="500" />
  </template>
  <dt-text as="p" variant="body-md" tone="tertiary">Wait for approval</dt-text>
  <dt-text as="p" variant="body-sm" tone="tertiary">Track status until the review is done.</dt-text>
</dt-text-list-item>`,
      },
    },
  },

  'small bullet list': {
    slots: {
      default: {
        initialValue: `<dt-text-list-item>
  <dt-text as="p" variant="body-xs">Collaborative inboxes</dt-text>
</dt-text-list-item>
<dt-text-list-item>
  <dt-text as="p" variant="body-xs">AI-powered call summaries</dt-text>
</dt-text-list-item>
<dt-text-list-item>
  <dt-text as="p" variant="body-xs">Unified customer history</dt-text>
</dt-text-list-item>`,
      },
    },
  },

  'ordered with headline and body text': {
    props: {
      type: {
        initialValue: 'ordered',
      },
      gap: {
        initialValue: '100',
      },
    },
    slots: {
      default: {
        initialValue: `<dt-text-list-item>
  <dt-text as="h3" variant="headline-md">Collaborative inboxes</dt-text>
  <dt-text as="p" variant="body-sm">Share queues, ownership, and replies.</dt-text>
</dt-text-list-item>
<dt-text-list-item>
  <dt-text as="h3" variant="headline-md">AI-powered call summaries</dt-text>
  <dt-text as="p" variant="body-sm">Capture outcomes without manual notes.</dt-text>
</dt-text-list-item>
<dt-text-list-item>
  <dt-text as="h3" variant="headline-md">Unified customer history</dt-text>
  <dt-text as="p" variant="body-sm">Keep context across every conversation.</dt-text>
</dt-text-list-item>`,
      },
    },
  },

  'emoji markers': {
    props: {
      gap: {
        initialValue: '100',
      },
    },
    slots: {
      default: {
        initialValue: `<dt-text-list-item>
  <template #marker>
    <dt-emoji code="😁" size="400" />
  </template>
  Customer left happy.
</dt-text-list-item>
<dt-text-list-item>
  <template #marker>
    <dt-emoji code="✅" size="400" />
  </template>
  Follow-up task completed.
</dt-text-list-item>
<dt-text-list-item>
  <template #marker>
    <dt-emoji code="❌" size="400" />
  </template>
  Request needs another pass.
</dt-text-list-item>`,
      },
    },
  },

  'custom marker ui design': {
    slots: {
      default: {
        initialValue: `<dt-text-list-item class="d-g-50">
  <template #marker>
    <dt-box
      border-width="100"
      border-color="subtle"
      surface="moderate-opaque"
      border-radius="circle"
      inline-size="25"
      block-size="25"
      class="d-plc-center"
    >
      <dt-text
        as="p"
        variant="body-xs"
        size="50"
        strength="bold"
        align="center"
        text-box-trim="both"
        tone="secondary"
      >
        X
      </dt-text>
    </dt-box>
  </template>
  <dt-text as="p" variant="body-sm">Xylophone</dt-text>
</dt-text-list-item>
<dt-text-list-item class="d-g-50">
  <template #marker>
    <dt-box
      border-width="100"
      border-color="subtle"
      surface="moderate-opaque"
      border-radius="circle"
      inline-size="25"
      block-size="25"
      class="d-plc-center"
    >
      <dt-text
        as="p"
        variant="body-xs"
        size="50"
        strength="bold"
        align="center"
        text-box-trim="both"
        tone="secondary"
      >
        Y
      </dt-text>
    </dt-box>
  </template>
  <dt-text as="p" variant="body-sm">Yueqin</dt-text>
</dt-text-list-item>
<dt-text-list-item class="d-g-50">
  <template #marker>
    <dt-box
      border-width="100"
      border-color="subtle"
      surface="moderate-opaque"
      border-radius="circle"
      inline-size="25"
      block-size="25"
      class="d-plc-center"
    >
      <dt-text
        as="p"
        variant="body-xs"
        size="50"
        strength="bold"
        align="center"
        text-box-trim="both"
        tone="secondary"
      >
        Z
      </dt-text>
    </dt-box>
  </template>
  <dt-text as="p" variant="body-sm">Zither</dt-text>
</dt-text-list-item>`,
      },
    },
  },
};
