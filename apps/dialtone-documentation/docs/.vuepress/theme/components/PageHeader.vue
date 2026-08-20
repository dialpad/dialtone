<template>
  <dt-box as="header">
    <slot name="content-top" />
    <dt-box
      :gap="{ default: '25', lg: '200' }"
    >
      <dt-stack
        :direction="viewport.pick({
          default: 'column',
          lg: 'row',
        })"
        :gap="{ default: '25', lg: '200' }"
        align="baseline"
        justify="between"
      >
        <dt-text v-if="backLink" as="nav" kind="body" size="200">
          <dt-link
            tone="muted"
            :to="backLink.to"
            :underline="false"
          >
            <dt-icon name="arrow-left" size="100" />
            {{ backLink.text }}
          </dt-link>
        </dt-text>
        <dt-stack direction="row" gap="100">
          <h1
            v-if="$frontmatter.title"
            class="dialtone-page-title"
            v-text="$frontmatter.title"
          />
          <dt-badge v-if="statusBadge" v-bind="statusBadge" />
        </dt-stack>
        <dt-stack direction="row" gap="100">
          <dt-button
            v-if="$frontmatter.download_url"
            v-bind="downloadButtonAttrs"
            :size="200"
            kind="muted"
            importance="outlined"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon name="google-drive" :size="iconSize" />
            </template>
            {{ $frontmatter.download_url_label || 'Download' }}
          </dt-button>
          <dt-button
            v-if="$frontmatter.figma_url && viewport.above('md')"
            :href="$frontmatter.figma_url"
            target="_blank"
            rel="noopener noreferrer"
            kind="muted"
            importance="outlined"
            :size="200"
            hidden
          >
            <template #startIcon="{ iconSize }">
              <dt-icon-figma :size="iconSize" />
            </template>
            Figma
          </dt-button>
          <dt-button
            v-if="$frontmatter.storybook && $frontmatter.storybook !== 'planned'"
            :href="$frontmatter.storybook"
            target="_blank"
            rel="noopener noreferrer"
            kind="muted"
            importance="outlined"
            :size="200"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon-storybook-color :size="iconSize" />
            </template>
            Storybook
          </dt-button>
          <dt-button
            v-if="githubUrl || $frontmatter.github_url"
            :href="$frontmatter.github_url || githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            kind="muted"
            importance="outlined"
            :size="200"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon name="code" :size="iconSize" />
            </template>
            Source
          </dt-button>
          <dt-split-button
            :size="200"
            importance="outlined"
            kind="muted"
            :disabled="!rawMarkdownUrl"
            end-tooltip-text="More options"
            start-aria-label="Copy Markdown"
            @start-clicked="onCopyAsMarkdown()"
          >
            <template #startIcon="{ size }">
              <dt-icon
                :name="showCopiedIcon ? 'check' : 'copy'"
                :size="size"
                :class="{ 'd-fc-positive': showCopiedIcon }"
              />
            </template>
            Copy MD
            <template #dropdownList="{ close }">
              <dt-list-item-group>
                <dt-list-item
                  role="menuitem"
                  navigation-type="arrow-keys"
                  @click="onCopyMarkdownLink(close)"
                >
                  Copy Markdown link
                </dt-list-item>
                <dt-list-item
                  role="menuitem"
                  navigation-type="arrow-keys"
                  @click="onDownloadAll(close)"
                >
                  Download full docs
                </dt-list-item>
              </dt-list-item-group>
              <dt-dropdown-separator />
              <dt-list-item-group v-if="rawMarkdownUrl">
                <dt-list-item
                  role="menuitem"
                  navigation-type="arrow-keys"
                  @click="onViewAsMarkdown(close)"
                >
                  Open as Markdown
                </dt-list-item>
                <dt-list-item
                  role="menuitem"
                  navigation-type="arrow-keys"
                  @click="openInAiChat(close, 'claude')"
                >
                  Open in Claude.ai
                </dt-list-item>
                <dt-list-item
                  role="menuitem"
                  navigation-type="arrow-keys"
                  @click="openInAiChat(close, 'chatgpt')"
                >
                  Open in ChatGPT
                </dt-list-item>
              </dt-list-item-group>
              <dt-dropdown-separator v-if="githubMarkdownUrl" />
              <dt-list-item-group v-if="githubMarkdownUrl">
                <dt-list-item
                  role="menuitem"
                  navigation-type="arrow-keys"
                  @click="onViewInGitHub(close)"
                >
                  View in GitHub
                </dt-list-item>
              </dt-list-item-group>
            </template>
          </dt-split-button>
        </dt-stack>
      </dt-stack>
      <dt-text
        v-if="$frontmatter.description"
        as="p"
        kind="headline"
        :size="viewport.pick({
          default: '400',
          lg: '500',
        })"
        strength="normal"
        density="300"
        tone="tertiary"
        wrap="pretty"
        class="d-mbs-150 d-mbe-300 d-wmx75ch"
      >
        {{ $frontmatter.description }}
      </dt-text>
    </dt-box>
    <slot name="content-bottom" />
  </dt-box>
</template>

<script setup>
import { DtIconStorybookColor, DtIconFigma } from '@dialpad/dialtone-icons/vue';
import { computed, onUnmounted, ref } from 'vue';
import { usePageData, withBase } from 'vuepress/client';
import { isExternalUrl } from '../utils/isExternalUrl';
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';

const viewport = useViewportBreakpoints();

const page = usePageData();

const STATUS_BADGES = {
  beta: { type: 'info', text: 'Beta' },
  new: { type: 'bulletin', text: 'New' },
};
const statusBadge = computed(() => STATUS_BADGES[page.value.frontmatter?.status]);

// Detail pages get a "back to <parent>" affordance above the title row.
// Add new entries as detail-page sections appear.
const BACK_LINKS = [
  { match: /^\/dialtone\/whats-new\/posts\//, to: '/dialtone/whats-new/', text: 'Back to What\'s New' },
];

const backLink = computed(() => {
  return BACK_LINKS.find(l => l.match.test(page.value.path)) ?? null;
});

// External download URLs open in a new tab; internal paths route via <router-link>
// so in-app hash/anchor links (e.g. "/downloads/#graphic") stay in the SPA.
const downloadButtonAttrs = computed(() => {
  const url = page.value.frontmatter?.download_url;
  if (!url) return {};
  return isExternalUrl(url)
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : { to: url };
});

const showCopiedIcon = ref(false);
let copiedTimeout;

function showCopiedFeedback () {
  showCopiedIcon.value = true;
  clearTimeout(copiedTimeout);
  copiedTimeout = setTimeout(() => { showCopiedIcon.value = false; }, 2000);
}

onUnmounted(() => { clearTimeout(copiedTimeout); });

async function onCopyMarkdownLink (close) {
  close?.();
  try {
    const url = rawMarkdownUrl.value
      ? window.location.origin + rawMarkdownUrl.value
      : window.location.href;
    await navigator.clipboard.writeText(url);
    showCopiedFeedback();
  } catch (e) {
    console.error('Failed to copy markdown link:', e);
  }
}

function onDownloadAll (close) {
  close?.();
  const url = withBase('/llms-full.txt');
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `dialtone-complete-documentation--${date}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function onCopyAsMarkdown (close) {
  close?.();
  try {
    const res = await fetch(rawMarkdownUrl.value);
    if (!res.ok) {
      console.error(`Failed to fetch markdown: ${res.status} ${res.statusText}`);
      return;
    }
    const text = await res.text();
    await navigator.clipboard.writeText(text);
    showCopiedFeedback();
  } catch (e) {
    console.error('Failed to copy markdown:', e);
  }
}

const SLUG_OVERRIDES = { tabs: 'tab' };
const EXCLUDED_SLUGS = new Set(['scrollbar', 'table']);
const GITHUB_BASE = 'https://github.com/dialpad/dialtone/tree/staging/packages/dialtone-vue/components';
const GITHUB_DOCS_BASE = 'https://github.com/dialpad/dialtone/blob/staging/apps/dialtone-documentation/docs';

const RAW_SECTIONS = [
  '/components/',
  '/foundations/',
  '/dialtone/',
  '/functions-and-utilities/',
  '/ui-kits/',
  '/utilities/',
  '/guides/',
  '/tokens/',
  '/downloads/',
];

const rawMarkdownUrl = computed(() => {
  const path = page.value.path;
  if (!RAW_SECTIONS.some(s => path.startsWith(s))) return null;
  if (RAW_SECTIONS.includes(path)) return withBase(`/md${path}index.md`);
  const clean = path.replace(/(?:\/(?:index\.html)?|\.html)$/, '');
  if (!clean) return null;
  return withBase(`/md${clean}.md`);
});

const AI_CHAT_URLS = {
  claude: 'https://claude.ai/new',
  chatgpt: 'https://chatgpt.com/',
};

function openInAiChat (close, service) {
  close?.();
  const rawUrl = window.location.origin + rawMarkdownUrl.value;
  const prompt = `Read ${rawUrl} so I can ask questions about it.`;
  const base = AI_CHAT_URLS[service];
  const url = `${base}?q=${encodeURIComponent(prompt)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function onViewAsMarkdown (close) {
  close?.();
  if (rawMarkdownUrl.value) {
    window.open(rawMarkdownUrl.value, '_blank', 'noopener,noreferrer');
  }
}

const githubMarkdownUrl = computed(() => {
  const filePath = page.value.filePathRelative?.replaceAll('\\', '/');
  return filePath ? `${GITHUB_DOCS_BASE}/${filePath}` : null;
});

function onViewInGitHub (close) {
  close?.();
  if (githubMarkdownUrl.value) {
    window.open(githubMarkdownUrl.value, '_blank', 'noopener,noreferrer');
  }
}

const githubUrl = computed(() => {
  const match = page.value.path.match(/^\/components\/([^/.]+)/);
  if (!match) return null;
  const slug = match[1];
  if (EXCLUDED_SLUGS.has(slug)) return null;
  const dir = SLUG_OVERRIDES[slug] ?? slug.replace(/-/g, '_');
  return `${GITHUB_BASE}/${dir}/`;
});
</script>

<!-- TODO: validate that `storybook` and `figma` are URLS -->
