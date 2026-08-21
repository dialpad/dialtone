<template>
  <dt-box padding-inline="100">
    <dt-stack v-if="viewport.above('lg')" gap="75">
      <dt-box border-width-block-start="100" border-color="subtle" class="d-mx-n150" />
      <dt-box padding-inline-start="50" padding-inline-end="50" padding-block-start="150" padding-block-end="100">
        <dt-stack direction="row" gap="100" justify="space-between">
          <dt-box
            v-dt-mode:light
            surface="secondary"
            border-radius="450"
            border-width="100"
            border-color="subtle"
            padding-block="1"
            class="d-d-flex d-of-hidden"
          >
            <svg-loader name="dialtone-logo" class="d-w-100" />
          </dt-box>
          <dt-stack direction="row" gap="1">
            <dt-button
              v-dt-tooltip="`#dialtone channel`"
              class="d-w100p"
              href="https://dialpad.com/app/messages/agxzfnViZXItdm9pY2VyGAsSC1RleHRNZXNzYWdlGIDA3KvmyP0IDA"
              target="_blank"
              rel="noreferrer noopener"
              kind="muted"
              importance="clear"
              size="200"
            >
              <template #startIcon="{ iconSize }">
                <dt-icon name="hash" :size="iconSize" />
              </template>
            </dt-button>
            <dt-button
              v-dt-tooltip="`Make a request`"
              class="d-w100p"
              href="https://dialpad.atlassian.net/servicedesk/customer/portal/123/create/465"
              target="_blank"
              rel="noreferrer noopener"
              kind="muted"
              importance="clear"
              size="200"
            >
              <template #startIcon="{ iconSize }">
                <dt-icon name="hand-filled" :size="iconSize" />
              </template>
            </dt-button>
            <dt-button
              v-dt-tooltip="`Report a bug`"
              class="d-w100p"
              href="https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=1&pid=12508"
              target="_blank"
              rel="noreferrer noopener"
              kind="muted"
              importance="clear"
              size="200"
            >
              <template #startIcon>
                <svg
                  class="d-icon--size-200 d-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 20v-9" />
                  <path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z" />
                  <path d="M14.12 3.88 16 2" />
                  <path d="M21 21a4 4 0 0 0-3.81-4" />
                  <path d="M21 5a4 4 0 0 1-3.55 3.97" />
                  <path d="M22 13h-4" />
                  <path d="M3 21a4 4 0 0 1 3.81-4" />
                  <path d="M3 5a4 4 0 0 0 3.55 3.97" />
                  <path d="M6 13H2" />
                  <path d="m8 2 1.88 1.88" />
                  <path d="M9 7.13V6a3 3 0 1 1 6 0v1.13" />
                </svg>
              </template>
            </dt-button>
          </dt-stack>
        </dt-stack>
      </dt-box>
      <dt-segmented-control
        :model-value="currentMode"
        aria-label="Appearance mode"
        @update:model-value="setMode"
      >
        <dt-segmented-control-item v-dt-tooltip="`Mode: System`" value="system" label="System">
          <template #startIcon="{ iconSize }">
            <dt-icon name="laptop-2" :size="iconSize" />
          </template>
        </dt-segmented-control-item>
        <dt-segmented-control-item v-dt-tooltip="`Mode: Light`" value="light" label="Light">
          <template #startIcon="{ iconSize }">
            <dt-icon name="sun" :size="iconSize" />
          </template>
        </dt-segmented-control-item>
        <dt-segmented-control-item v-dt-tooltip="`Mode: Dark`" value="dark" label="Dark">
          <template #startIcon="{ iconSize }">
            <dt-icon name="moon" :size="iconSize" />
          </template>
        </dt-segmented-control-item>
      </dt-segmented-control>
    </dt-stack>
  </dt-box>
</template>

<script setup>
import { useThemeManager } from '../composables/useThemeManager';
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';

// Appearance controls plus the external links under the sidebar nav. Desktop chrome
// only, like SidebarHeader — the narrow shell has no room for it.
const viewport = useViewportBreakpoints();
const { currentMode, setMode } = useThemeManager();
</script>
