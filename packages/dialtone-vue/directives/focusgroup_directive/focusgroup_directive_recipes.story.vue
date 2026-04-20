<!-- eslint-disable max-lines -->
<template>
  <dt-stack
    gap="200"
    class="d-p-100"
  >
    <dt-stack>
      <p>
        <!-- eslint-disable-next-line max-len -->
        <dt-link
          href="https://github.com/dialpad/dialtone/blob/next/packages/dialtone-vue/directives/focusgroup_directive/focusgroup_directive_recipes.story.vue"
          target="_blank"
          rel="noopener noreferrer"
        >
          View source on GitHub
        </dt-link> for code examples.
      </p>
    </dt-stack>

    <!-- ── Treeview sidebar with DtCollapsible ────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Treeview sidebar
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Up/Down cycles all visible items. Right expands a group, Left collapses or
      moves to parent. Directive owns vertical nav; consumer owns tree structure.
      Uses <code>DtCollapsible</code> for expand/collapse.
      <code>v-dt-focusgroup="'vertical'"</code>
    </dt-text>
    <dt-stack
      v-dt-focusgroup="'vertical'"
      role="tree"
      tabindex="0"
      aria-label="Sidebar navigation"
      class="d-ba d-bc-subtle d-bar8 d-w-500 d-p-50"
      @keydown.right.prevent="expandOrEnter"
      @keydown.left.prevent="collapseOrParent"
    >
      <dt-button
        role="treeitem"
        kind="muted"
        importance="clear"
        label-class="d-jc-space-between"
      >
        Inbox
      </dt-button>
      <dt-button
        role="treeitem"
        kind="muted"
        importance="clear"
        label-class="d-jc-space-between"
      >
        Launchpad
      </dt-button>
      <dt-collapsible
        :open="groupExpanded"
        anchor-class="d-w100p"
        @update:open="groupExpanded = $event"
      >
        <template
          #anchor="{ attrs }"
        >
          <dt-button
            role="treeitem"
            kind="muted"
            importance="clear"
            v-bind="attrs"
            data-tree-group="ops"
            class="d-w100p"
            tabindex="0"
            label-class="d-jc-space-between"
            @click="groupExpanded = !groupExpanded"
          >
            <template #endIcon>
              <dt-icon
                :name="groupExpanded ? 'chevron-down' : 'chevron-right'"
                :size="200"
              />
            </template>
            Operations &amp; Planning
          </dt-button>
        </template>
        <template #content>
          <dt-stack class="d-pis-150">
            <dt-button
              role="treeitem"
              kind="muted"
              importance="clear"
              label-class="d-jc-space-between"
              data-tree-parent="ops"
              class="d-w100p"
            >
              <template #startIcon>
                <dt-icon
                  name="hash"
                  :size="200"
                />
              </template>
              company-announcements
            </dt-button>
            <dt-button
              role="treeitem"
              kind="muted"
              importance="clear"
              label-class="d-jc-space-between"
              data-tree-parent="ops"
              class="d-w100p"
            >
              <template #startIcon>
                <dt-icon
                  name="hash"
                  :size="200"
                />
              </template>
              fun-travel-stories
            </dt-button>
          </dt-stack>
        </template>
      </dt-collapsible>
      <dt-collapsible
        :open="channelsExpanded"
        anchor-class="d-w100p"
        @update:open="channelsExpanded = $event"
      >
        <template
          #anchor="{ attrs }"
        >
          <dt-button
            role="treeitem"
            kind="muted"
            importance="clear"
            v-bind="attrs"
            data-tree-group="channels"
            class="d-w100p"
            tabindex="0"
            label-class="d-jc-space-between"
            @click="channelsExpanded = !channelsExpanded"
          >
            <template #endIcon>
              <dt-icon
                :name="channelsExpanded ? 'chevron-down' : 'chevron-right'"
                :size="200"
              />
            </template>
            Channels
          </dt-button>
        </template>
        <template #content>
          <dt-stack class="d-pis-150">
            <dt-button
              role="treeitem"
              kind="muted"
              importance="clear"
              label-class="d-jc-space-between"
              data-tree-parent="channels"
              class="d-w100p"
            >
              <template #startIcon>
                <dt-icon
                  name="hash"
                  :size="200"
                />
              </template>
              design-reviews
            </dt-button>
            <dt-button
              role="treeitem"
              kind="muted"
              importance="clear"
              label-class="d-jc-space-between"
              data-tree-parent="channels"
              class="d-w100p"
            >
              <template #startIcon>
                <dt-icon
                  name="hash"
                  :size="200"
                />
              </template>
              watercooler
            </dt-button>
            <dt-button
              role="treeitem"
              kind="muted"
              importance="clear"
              label-class="d-jc-space-between"
              data-tree-parent="channels"
              class="d-w100p"
            >
              <template #startIcon>
                <dt-icon
                  name="hash"
                  :size="200"
                />
              </template>
              shipped-it
            </dt-button>
          </dt-stack>
        </template>
      </dt-collapsible>
      <dt-button
        role="treeitem"
        kind="muted"
        importance="clear"
        label-class="d-jc-space-between"
      >
        Recents
      </dt-button>
    </dt-stack>

    <!-- ── Table with row navigation ─────────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Table with row navigation
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Up/Down cycles rows. Tab reaches interactive content within a row.
      Uses <code>selector: 'tbody tr'</code> so the header row is excluded.
    </dt-text>
    <table
      v-dt-focusgroup="{ axis: 'vertical', selector: 'tbody tr', memory: false }"
      class="d-table dialtone-doc-table"
      aria-label="Office List"
    >
      <caption class="d-table__caption">
        Office List
      </caption>
      <thead>
        <tr>
          <th scope="col">
            Office
          </th>
          <th scope="col">
            Country
          </th>
          <th
            scope="col"
            width="10%"
          >
            Employees
          </th>
          <th
            scope="col"
            colspan="2"
          >
            Contact
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-c-pointer"
          tabindex="0"
        >
          <th scope="row">
            Austin, TX
          </th>
          <td>United States</td>
          <td>48</td>
          <td>Henna Ferry</td>
          <td class="d-ta-right">
            <dt-button
              kind="muted"
              importance="outlined"
              size="200"
            >
              Button 1
            </dt-button>
          </td>
          <td class="d-ta-right">
            <dt-button
              kind="muted"
              importance="outlined"
              size="200"
            >
              Button 2
            </dt-button>
          </td>
        </tr>
        <tr
          class="h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-c-pointer"
          tabindex="-1"
        >
          <th scope="row">
            Bangalore
          </th>
          <td>India</td>
          <td>13</td>
          <td>Arun Chadda</td>
          <td class="d-ta-right">
            <dt-button
              kind="muted"
              importance="outlined"
              size="200"
            >
              Button 1
            </dt-button>
          </td>
          <td class="d-ta-right">
            <dt-button
              kind="muted"
              importance="outlined"
              size="200"
            >
              Button 2
            </dt-button>
          </td>
        </tr>
        <tr
          class="h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-c-pointer"
          tabindex="-1"
        >
          <th scope="row">
            San Francisco, CA
          </th>
          <td>United States</td>
          <td>108</td>
          <td>Shane Holmes</td>
          <td class="d-ta-right">
            <dt-button
              kind="muted"
              importance="outlined"
              size="200"
            >
              Button 1
            </dt-button>
          </td>
          <td class="d-ta-right">
            <dt-button
              kind="muted"
              importance="outlined"
              size="200"
            >
              Button 2
            </dt-button>
          </td>
        </tr>
        <tr
          class="h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-c-pointer"
          tabindex="-1"
        >
          <th scope="row">
            Vancouver, BC
          </th>
          <td>Canada</td>
          <td>76</td>
          <td>Kendal Lewis</td>
          <td class="d-ta-right">
            <dt-button
              kind="muted"
              importance="outlined"
              size="200"
            >
              Button 1
            </dt-button>
          </td>
          <td class="d-ta-right">
            <dt-button
              kind="muted"
              importance="outlined"
              size="200"
            >
              Button 2
            </dt-button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ── Inbox with DtRecipeContactRow ─────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Inbox
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Vertical list using <code>DtRecipeContactRow</code>. Up/Down cycles all focusable elements.
    </dt-text>
    <dt-stack
      v-dt-focusgroup="'vertical'"
      role="list"
      aria-label="Contacts"
      class="d-p-200 d-bgc-secondary d-w-400"
    >
      <dt-recipe-contact-row
        role="listitem"
        tabindex="0"
        name="Ashanti Trevor"
        avatar-presence="active"
        user-status="Good morning!"
        has-call-button
      />
      <dt-recipe-contact-row
        role="listitem"
        tabindex="0"
        name="Marcus Chen"
        avatar-presence="away"
        presence-text="Away"
        user-status="Out for a bit"
        has-call-button
      />
      <dt-recipe-contact-row
        role="listitem"
        tabindex="0"
        name="Priya Sharma"
        avatar-presence="busy"
        presence-text="In a meeting"
        user-status="Meetings all day"
        has-call-button
      />
      <dt-recipe-contact-row
        role="listitem"
        tabindex="0"
        name="Jordan Kim"
        unread-count="3"
        :has-unreads="true"
        has-call-button
      />
    </dt-stack>

    <!-- ── Contact list with rich content ────────────────── -->
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Contact list — rich content
    </dt-text>
    <dt-text
      kind="body"
      class="d-fc-tertiary"
    >
      Vertical list of rich content items built with Dialtone primitives.
    </dt-text>
    <dt-stack
      v-dt-focusgroup="'vertical'"
      role="list"
      aria-label="Contacts"
    >
      <dt-stack
        role="listitem"
        tabindex="0"
        gap="100"
        class="d-p-100 d-w-800 h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-bar8"
      >
        <dt-stack
          direction="row"
          gap="100"
          class="d-w100p"
        >
          <dt-avatar full-name="Ashanti Trevor" />
          <dt-stack class="d-fl1">
            <dt-text
              kind="body"
              :size="200"
              strength="bold"
            >
              Ashanti Trevor
            </dt-text>
            <dt-stack
              direction="row"
              gap="50"
            >
              <dt-stack
                direction="row"
                gap="100"
              >
                <dt-icon
                  name="phone-outgoing"
                  size="200"
                  class="d-fc-tertiary"
                />
                <dt-text
                  kind="body"
                  :size="100"
                  tone="tertiary"
                >
                  Outgoing call
                </dt-text>
              </dt-stack>
              <dt-text
                kind="body"
                :size="100"
                tone="tertiary"
              >
                &bull;
              </dt-text>
              <dt-text
                kind="body"
                :size="100"
                tone="tertiary"
              >
                2 minutes 10 seconds
              </dt-text>
            </dt-stack>
          </dt-stack>
          <dt-text
            kind="body"
            :size="200"
            tone="tertiary"
            numeric
          >
            3:23 pm
          </dt-text>
          <dt-badge
            kind="count"
            type="bulletin"
            text="6"
          />
        </dt-stack>
      </dt-stack>
      <dt-stack
        role="listitem"
        tabindex="-1"
        gap="100"
        class="d-p-100 d-w-800 h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-bar8"
      >
        <dt-stack
          direction="row"
          gap="100"
          class="d-w100p"
        >
          <dt-avatar full-name="Marcus Chen" />
          <dt-stack class="d-fl1">
            <dt-text
              kind="body"
              :size="200"
              strength="bold"
            >
              Marcus Chen
            </dt-text>
            <dt-stack
              direction="row"
              gap="50"
            >
              <dt-stack
                direction="row"
                gap="100"
              >
                <dt-icon
                  name="phone-incoming"
                  size="200"
                  class="d-fc-tertiary"
                />
                <dt-text
                  kind="body"
                  :size="100"
                  tone="tertiary"
                >
                  Incoming call
                </dt-text>
              </dt-stack>
              <dt-text
                kind="body"
                :size="100"
                tone="tertiary"
              >
                &bull;
              </dt-text>
              <dt-text
                kind="body"
                :size="100"
                tone="tertiary"
              >
                14 minutes 32 seconds
              </dt-text>
            </dt-stack>
          </dt-stack>
          <dt-text
            kind="body"
            :size="200"
            tone="tertiary"
            numeric
          >
            1:47 pm
          </dt-text>
        </dt-stack>
      </dt-stack>
      <dt-stack
        role="listitem"
        tabindex="-1"
        gap="100"
        class="d-p-100 d-w-800 h:d-bgc-moderate-opaque fv:d-bgc-moderate-opaque d-bar8"
      >
        <dt-stack
          direction="row"
          gap="100"
          class="d-w100p"
        >
          <dt-avatar full-name="Priya Sharma" />
          <dt-stack class="d-fl1">
            <dt-text
              kind="body"
              :size="200"
              strength="bold"
            >
              Priya Sharma
            </dt-text>
            <dt-stack
              direction="row"
              gap="50"
            >
              <dt-stack
                direction="row"
                gap="100"
              >
                <dt-icon
                  name="phone-missed"
                  size="200"
                  class="d-fc-critical"
                />
                <dt-text
                  kind="body"
                  :size="100"
                  tone="tertiary"
                >
                  Missed call
                </dt-text>
              </dt-stack>
              <dt-text
                kind="body"
                :size="100"
                tone="tertiary"
              >
                &bull;
              </dt-text>
              <dt-text
                kind="body"
                :size="100"
                tone="tertiary"
              >
                0 seconds
              </dt-text>
            </dt-stack>
          </dt-stack>
          <dt-text
            kind="body"
            :size="200"
            tone="tertiary"
            numeric
          >
            11:05 am
          </dt-text>
          <dt-badge
            kind="count"
            type="bulletin"
            text="3"
          />
        </dt-stack>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtStack from '@/components/stack/stack.vue';
import DtText from '@/components/text/text.vue';
import DtButton from '@/components/button/button.vue';
import DtLink from '@/components/link/link.vue';
import DtCollapsible from '@/components/collapsible/collapsible.vue';
import DtAvatar from '@/components/avatar/avatar.vue';
import DtIcon from '@/components/icon/icon.vue';
import DtBadge from '@/components/badge/badge.vue';
import { DtRecipeContactRow } from '@/recipes/leftbar/contact_row';

export default {
  name: 'DtFocusgroupDirectiveRecipes',
  components: {
    DtStack,
    DtText,
    DtButton,
    DtLink,
    DtCollapsible,
    DtAvatar,
    DtIcon,
    DtBadge,
    DtRecipeContactRow,
  },

  data () {
    return {
      groupExpanded: true,
      channelsExpanded: false,
    };
  },

  methods: {
    toggleGroup (groupId, value) {
      if (groupId === 'ops') this.groupExpanded = value;
      if (groupId === 'channels') this.channelsExpanded = value;
    },

    expandOrEnter () {
      const el = document.activeElement;
      if (!el) return;
      if (el.getAttribute('aria-expanded') === 'false') {
        this.toggleGroup(el.dataset.treeGroup, true);
        return;
      }
      if (el.getAttribute('aria-expanded') === 'true') {
        const groupId = el.dataset.treeGroup;
        const firstChild = el.closest('[role="tree"]')
          ?.querySelector(`[data-tree-parent="${groupId}"]`);
        if (firstChild) firstChild.focus();
      }
    },

    collapseOrParent () {
      const el = document.activeElement;
      if (!el) return;
      if (el.getAttribute('aria-expanded') === 'true') {
        this.toggleGroup(el.dataset.treeGroup, false);
        return;
      }
      const parentId = el.dataset.treeParent;
      if (parentId) {
        const parent = el.closest('[role="tree"]')
          ?.querySelector(`[data-tree-group="${parentId}"]`);
        if (parent) parent.focus();
      }
    },
  },
};
</script>
