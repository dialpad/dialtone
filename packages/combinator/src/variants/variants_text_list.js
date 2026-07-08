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
      gap: {
        initialValue: '100',
      },
    },
    slots: {
      default: {
        initialValue: `<dt-text-list-item>Invite the workspace owners</dt-text-list-item>
<dt-text-list-item :value="7">Map inboxes to support queues</dt-text-list-item>
<dt-text-list-item>Review routing before launch</dt-text-list-item>`,
      },
    },
  },

  'custom markers': {
    props: {
      markerTone: {
        initialValue: 'positive',
      },
      gap: {
        initialValue: '100',
      },
    },
    slots: {
      default: {
        initialValue: `<dt-text-list-item>
  <template #marker>
    <dt-icon-check size="200" />
  </template>
  Included in every plan
</dt-text-list-item>
<dt-text-list-item marker-tone="critical">
  <template #marker>
    <dt-icon-close size="200" />
  </template>
  Requires admin approval
</dt-text-list-item>
<dt-text-list-item>
  <template #marker>
    +
  </template>
  Can be customized per item
</dt-text-list-item>`,
      },
    },
  },

  nested: {
    props: {
      gap: {
        initialValue: '100',
      },
    },
    slots: {
      default: {
        initialValue: `<dt-text-list-item>Prepare the launch workspace
  <dt-text-list type="ordered" gap="50">
    <dt-text-list-item>Confirm owners</dt-text-list-item>
    <dt-text-list-item>Publish onboarding notes</dt-text-list-item>
  </dt-text-list>
</dt-text-list-item>
<dt-text-list-item>Track unresolved tasks
  <dt-text-list gap="50">
    <dt-text-list-item>Permissions</dt-text-list-item>
    <dt-text-list-item>Billing handoff</dt-text-list-item>
  </dt-text-list>
</dt-text-list-item>`,
      },
    },
  },
};
