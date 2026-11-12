<template>
  <dt-stack gap="500">
    <dt-stack
      direction="row"
      gap="400"
      class="d-fl-wrap"
    >
      <dt-filter-pill
        v-model:open="statusOpen"
        label="Filter by"
        use-dropdown
        :options="statusOptions"
        :selected="current"
        neutral-value="all"
        :start-tooltip-text="current === 'all' ? '' : 'Filter by'"
        end-tooltip-text="Clear"
        @selection-change="applyFilter"
      >
        <template #headerContent>
          Filter by
        </template>
        <template #anchorEnd="{ selected }">
          <template v-if="selected === 'unread' && unreadCount > 0">
            <dt-badge
              type="bulletin"
              kind="count"
              aria-hidden="true"
            >
              {{ countText }}
            </dt-badge>
            <span class="d-vi-visible-sr">, {{ unreadCount }} unread messages</span>
          </template>
        </template>
        <template #optionEnd="{ option }">
          <template v-if="option.value === 'unread' && unreadCount > 0">
            <dt-badge
              type="bulletin"
              kind="count"
              aria-hidden="true"
            >
              {{ countText }}
            </dt-badge>
            <span class="d-vi-visible-sr">, {{ unreadCount }} unread messages</span>
          </template>
        </template>
      </dt-filter-pill>
      <dt-filter-pill
        v-model:selected="type"
        label="Type"
        use-dropdown
        neutral-value="all"
        :options="typeOptions"
      >
        <template #headerContent>
          Type
        </template>
      </dt-filter-pill>
      <dt-filter-pill
        v-model:selected="outcome"
        label="Outcome"
        use-dropdown
        neutral-value=""
        :options="[{ value: '', label: 'All outcomes' }, { value: 'resolved', label: 'Resolved' }]"
      >
        <template #headerContent>
          Outcome
        </template>
      </dt-filter-pill>
    </dt-stack>
    <dt-stack
      direction="row"
      gap="400"
      class="d-fl-wrap"
    >
      <dt-button
        kind="muted"
        importance="outlined"
        size="200"
        @click="current = 'mentions'"
      >
        External Mentions
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
        size="200"
        @click="replaceLabels"
      >
        Replace labels
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
        size="200"
        @click="cycleCount"
      >
        Refresh count
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
        size="200"
        @click="statusOptions = []"
      >
        Empty options
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
        size="200"
        @click="statusOptions = makeStatusOptions()"
      >
        Restore options
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
        size="200"
        @click="statusOpen = !statusOpen"
      >
        Toggle status visibility
      </dt-button>
    </dt-stack>
    <dt-stack
      direction="row"
      gap="400"
      class="d-fl-wrap"
    >
      <dt-filter-pill
        label="Immediate teams"
        :options="teamOptions"
        :selected="teams"
        @selection-change="proposeTeams"
      />
      <dt-filter-pill
        v-model:selected="deferredTeams"
        label="Deferred teams"
        defer-selection
        :options="teamOptions"
        @selection-change="recordDeferred"
      />
    </dt-stack>
    <dt-stack
      direction="row"
      gap="400"
      class="d-fl-wrap"
    >
      <dt-button
        kind="muted"
        importance="outlined"
        size="200"
        @click="acceptTeams = !acceptTeams"
      >
        {{ acceptTeams ? 'Decline immediate proposals' : 'Accept immediate proposals' }}
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
        size="200"
        @click="acceptLatestTeams"
      >
        Accept latest proposal later
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
        size="200"
        @click="deferredTeams = ['engineering']"
      >
        External deferred Engineering
      </dt-button>
      <dt-button
        kind="muted"
        importance="outlined"
        size="200"
        @click="reset"
      >
        Reset
      </dt-button>
    </dt-stack>
    <p>
      Committed: status={{ current }}, type={{ type }}, outcome={{ outcome || '(empty neutral)' }},
      teams={{ teams }}, deferred={{ deferredTeams }}
    </p>
    <p>
      Immediate proposals are {{ acceptTeams ? 'accepted synchronously' : 'declined' }}.
      Persist accepted UI state asynchronously in the application.
    </p>
    <pre data-qa="controlled-action-trace">{{ JSON.stringify(commits, null, 2) }}</pre>
  </dt-stack>
</template>

<script>
import { DtBadge } from '@/components/Badge';
import { DtButton } from '@/components/Button';
import { DtStack } from '@/components/Stack';
import DtFilterPill from './FilterPill.vue';

const makeStatusOptions = () => [
  { value: 'all', label: 'All Messages', shortLabel: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'starred', label: 'Starred' },
  { value: 'mentions', label: 'Mentions & Reactions', shortLabel: 'Mentions' },
];

export default {
  name: 'DtFilterPillControlled',
  components: { DtBadge, DtButton, DtStack, DtFilterPill },
  props: { initialMenuOpen: { type: Boolean, default: false } },
  data () {
    return {
      current: this.initialMenuOpen ? 'unread' : 'all',
      statusOpen: this.initialMenuOpen,
      statusOptions: makeStatusOptions(),
      unreadCount: 12,
      type: 'all',
      outcome: '',
      typeOptions: [
        { value: 'all', label: 'All Types', shortLabel: 'All' },
        { value: 'calls', label: 'Calls Only', shortLabel: 'Calls' },
        { value: 'messages', label: 'Messages Only', shortLabel: 'Messages' },
        { value: 'voicemails', label: 'Voicemails' },
        { value: 'threads', label: 'Threads Only', shortLabel: 'Threads' },
      ],

      teamOptions: [
        { value: 'sales', label: 'Sales' },
        { value: 'support', label: 'Support' },
        { value: 'engineering', label: 'Engineering' },
      ],

      teams: Object.freeze(['sales']),
      deferredTeams: ['sales'],
      acceptTeams: false,
      latestTeams: null,
      commits: [],
    };
  },

  computed: {
    countText () { return this.unreadCount > 99 ? '99+' : String(this.unreadCount); },
  },

  methods: {
    makeStatusOptions,
    applyFilter (action) {
      this.current = action.value;
      this.commits.push({ dimension: 'status', ...action });
    },

    proposeTeams (action) {
      this.latestTeams = [...action.value];
      if (this.acceptTeams) this.teams = Object.freeze([...action.value]);
      this.commits.push({ dimension: 'immediate teams', ...action });
    },

    recordDeferred (action) { this.commits.push({ dimension: 'deferred teams', ...action }); },
    acceptLatestTeams () {
      if (this.latestTeams) this.teams = Object.freeze([...this.latestTeams]);
    },

    replaceLabels () {
      this.statusOptions = this.statusOptions.map(option => ({
        ...option, label: `${option.label} updated`, shortLabel: option.shortLabel ?? option.label,
      }));
    },

    cycleCount () { this.unreadCount = this.unreadCount === 12 ? 100 : this.unreadCount === 100 ? 0 : 12; },
    reset () {
      this.current = 'all';
      this.statusOptions = makeStatusOptions();
      this.unreadCount = 12;
      this.type = 'all';
      this.outcome = '';
      this.teams = Object.freeze(['sales']);
      this.deferredTeams = ['sales'];
      this.commits = [];
    },
  },
};
</script>
