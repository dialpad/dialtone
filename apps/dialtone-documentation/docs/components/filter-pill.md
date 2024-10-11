---
title: Filter Pill
description: Drafting design....
---

<div class="rgeerqweerqwe">
  <h1 class="d-headline--xxl d-mb8">Filter Pill</h1>
  <dt-stack gap="600">
    <div class="d-p16 d-bgc-secondary d-bar8">
      <dt-stack direction="row" gap="500">
        <div>
          <div class="d-label--sm d-mb8">No selection</div>
          <span class="d-filter-pill">
            <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
              <template #anchor>
                <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                  <span class="d-filter-pill__label">
                    <span class="d-filter-pill__label-alpha">Channel</span>
                  </span>
                  <template #icon>
                    <dt-icon name="chevron-down" size="200" />
                  </template>
                </dt-button>
              </template>
              <template #content>
                <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                  Popover or maybe Dropdown asdf
                </div>
              </template>
            </dt-popover>
          </span>
        </div>
        <div>
          <div class="d-label--sm d-mb8">Selected, show label/count, has clear</div>
          <span class="d-filter-pill d-filter-pill--selected">
            <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
              <template #anchor>
                <dt-button size="sm" class="d-filter-pill__primary d-filter-pill__primary--selected d-filter-pill__primary--has-clear" kind="muted" importance="outlined" icon-position="right">
                  <span class="d-filter-pill__label">
                    <span class="d-filter-pill__label-alpha">Contact Centers</span>
                    <span class="d-filter-pill__label-omega">89</span>
                  </span>
                  <template #icon>
                    <dt-icon name="chevron-down" size="200" />
                  </template>
                </dt-button>
              </template>
              <template #content>
                <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                  Popover or maybe Dropdown
                </div>
              </template>
            </dt-popover>
            <dt-button onclick="alert('• Remove clear button\n• Remove `--selected` and `--has-clear`\n• Revert text label')" size="sm" class="d-filter-pill__clear d-filter-pill__clear--selected" kind="muted" importance="outlined" v-dt-tooltip="`Remove`">
              <template #icon>
                <dt-icon name="close" size="200" />
              </template>
            </dt-button>
          </span>
        </div>
        <div>
          <div class="d-label--sm d-mb8">Selected, overflow, label tooltip, has clear</div>
          <span class="d-filter-pill d-filter-pill--selected">
            <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
              <template #anchor>
                <dt-button size="sm" class="d-filter-pill__primary d-filter-pill__primary--selected d-filter-pill__primary--has-clear" kind="muted" importance="outlined" icon-position="right" v-dt-tooltip="`Disposition`">
                  <span class="d-filter-pill__label">
                    <span class="d-filter-pill__label-alpha">Merchandise Question (e.g. Size, Fit, etc)</span>
                  </span>
                  <template #icon>
                    <dt-icon name="chevron-down" size="200" />
                  </template>
                </dt-button>
              </template>
              <template #content>
                <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                  Popover or maybe Dropdown
                </div>
              </template>
            </dt-popover>
            <dt-button onclick="alert('• Remove clear button\n• Remove `--selected` and `--has-clear`\n• Revert text label')" size="sm" class="d-filter-pill__clear d-filter-pill__clear--selected" kind="muted" importance="outlined" v-dt-tooltip="`Remove`">
              <template #icon>
                <dt-icon name="close" size="200" />
              </template>
            </dt-button>
          </span>
        </div>
        <div>
          <div class="d-label--sm d-mb8">Selected, label, no clear</div>
          <span class="d-filter-pill d-filter-pill--selected">
            <dt-dropdown navigation-type="arrow-keys" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
              <template #anchor="{ attrs }">
                <dt-button size="sm" class="d-filter-pill__primary d-filter-pill__primary--selected" kind="muted" importance="outlined" icon-position="right" v-dt-tooltip="`Call source`">
                  <span class="d-filter-pill__label">
                    <span class="d-filter-pill__label-alpha">Internal and external</span>
                  </span>
                  <template #icon>
                    <dt-icon name="chevron-down" size="200" />
                  </template>
                </dt-button>
              </template>
              <template #list="{ close }">
                <dt-list-item
                  v-for="(item) in items"
                  :key="item.id"
                  role="menuitem"
                  :navigation-type="arrow-keys"
                  @click="close"
                >
                  {{ item.name }}
                </dt-list-item>
              </template>
            </dt-dropdown>
          </span>
        </div>
        <div>
          <div class="d-label--sm d-mb8">Disabled</div>
          <span class="d-filter-pill d-c-not-allowed">
            <dt-button size="sm" class="d-filter-pill__primary d-btn--disabled" aria-disabled="true" kind="muted" importance="outlined" icon-position="right" v-dt-tooltip="`Conversation type is disabled because selected filters only work with calls.`">
              <span class="d-filter-pill__label">
                <span class="d-filter-pill__label-alpha">Conversation type</span>
              </span>
              <template #icon>
                <dt-icon name="chevron-down" size="200" />
              </template>
            </dt-button>
          </span>
        </div>
      </dt-stack>
    </div>
    <dt-stack gap="500">
      <dt-stack>
        <h2 class="d-headline--xl">All Calls</h2>
        <dt-stack gap="400">
          <p class="d-body--md">Explore what's happening on your team's Dialpad calls with <dt-link href="link.html">Dialpad Ai</dt-link>. <dt-link href="link.html">Need help?</dt-link></p>
          <dt-stack direction="row" gap="300" class="d-body--sm d-fc-tertiary" as="p">
            <span v-dt-tooltip="`Aerolab's time zone setting`" tabindex="0" class="d-td-dotted">All data is in Asia/Kolkata</span>
            <span>Updated Sun Sep 1, 12:17 AM</span>
          </dt-stack>
        </dt-stack>
      </dt-stack>
      <dt-stack direction="row" gap="400" class="d-fw-wrap">
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Location</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Timeframe</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Keyword</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Moment</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Duration</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Call source</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <dt-button size="sm" kind="muted" importance="clear">
          All Filters
        </dt-button>
      </dt-stack>
      <div hidden>
        <dt-stack direction="row" gap="500" class="d-d-inline-flex d-fw-nowrap d-bgc-warning d-jc-space-between d-px8 d-py2 d-bar8">
          <div class="d-body--sm">Would you like to save this search?</div>
          <dt-stack direction="row" gap="300">
            <dt-button link class="d-link--muted d-body--sm">Clear</dt-button>
            <span>•</span>
            <dt-button link class="d-link--muted d-body--sm">Save this search</dt-button>
          </dt-stack>
        </dt-stack>
      </div>
      <dt-tab-group>
        <template #tabs>
          <dt-tab id="tab1" panel-id="tab1" selected>
            Calls
          </dt-tab>
          <dt-tab id="tab2" panel-id="tab2">
            CSAT
          </dt-tab>
          <dt-tab id="tab3" panel-id="tab3">
            Moments
          </dt-tab>
          <dt-tab id="tab4" panel-id="tab4">
            Duration
          </dt-tab>
          <dt-tab id="tab5" panel-id="tab5">
            Texts
          </dt-tab>
        </template>
        <div class="d-ba d-bc-default d-btw0 d-bar8 d-btr0 d-p128 d-ta-center d-fc-tertiary d-body--sm">
          <dt-tab-panel id="tab1" tab-id="tab1">
            <div class="d-py128">(Calls table)</div>
          </dt-tab-panel>
          <dt-tab-panel id="tab2" tab-id="tab2">
            <div class="d-py32">(CSAT table)</div>
          </dt-tab-panel>
          <dt-tab-panel id="tab3" tab-id="tab3">
            <div class="d-py64">(Moments table)</div>
          </dt-tab-panel>
          <dt-tab-panel id="tab4" tab-id="tab4">
            <div class="d-py48">(Duration table)</div>
          </dt-tab-panel>
          <dt-tab-panel id="tab5" tab-id="tab5">
            <div class="d-py128">(Texts table)</div>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </dt-stack>
    <dt-stack gap="500">
      <dt-stack>
        <h2 class="d-headline--xl">All Calls</h2>
        <dt-stack gap="400">
          <p class="d-body--md">Explore what's happening on your team's Dialpad calls with <dt-link href="link.html">Dialpad Ai</dt-link>. <dt-link href="link.html">Need help?</dt-link></p>
          <dt-stack direction="row" gap="300" class="d-body--sm d-fc-tertiary" as="p">
            <span v-dt-tooltip="`Aerolab's time zone setting`" tabindex="0" class="d-td-dotted">All data is in Asia/Kolkata</span>
            <span>Updated Sun Sep 1, 12:17 AM</span>
          </dt-stack>
        </dt-stack>
      </dt-stack>
      <dt-stack direction="row" gap="400" class="d-fw-wrap">
        <span class="d-filter-pill d-filter-pill--selected">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary d-filter-pill__primary--selected" kind="muted" importance="outlined" icon-position="right" v-dt-tooltip="`Location`">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">This office</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill d-filter-pill--selected">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary d-filter-pill__primary--selected d-filter-pill__primary--has-clear" kind="muted" importance="outlined" icon-position="right" v-dt-tooltip="`Timeframe`">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Past 90 days</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown
              </div>
            </template>
          </dt-popover>
          <dt-button onclick="alert('• Remove clear button\n• Remove `--selected` and `--has-clear`\n• Revert text label')" size="sm" class="d-filter-pill__clear d-filter-pill__clear--selected" kind="muted" importance="outlined" v-dt-tooltip="`Remove`">
            <template #icon>
              <dt-icon name="close" size="200" />
            </template>
          </dt-button>
        </span>
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Keyword</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Moment</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill d-c-not-allowed">
          <dt-button size="sm" class="d-filter-pill__primary d-btn--disabled" aria-disabled="true" kind="muted" importance="outlined" icon-position="right" v-dt-tooltip="`Conversation type is disabled because selected filters only work with calls.`">
            <span class="d-filter-pill__label">
              <span class="d-filter-pill__label-alpha">Duration</span>
            </span>
            <template #icon>
              <dt-icon name="chevron-down" size="200" />
            </template>
          </dt-button>
        </span>
        <span class="d-filter-pill d-filter-pill--selected">
          <dt-dropdown navigation-type="arrow-keys" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor="{ attrs }">
              <dt-button size="sm" class="d-filter-pill__primary d-filter-pill__primary--selected" kind="muted" importance="outlined" icon-position="right" v-dt-tooltip="`Call source`">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Internal and external</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #list="{ close }">
              <dt-list-item
                v-for="(item) in items"
                :key="item.id"
                role="menuitem"
                :navigation-type="arrow-keys"
                @click="close"
              >
                {{ item.name }}
              </dt-list-item>
            </template>
          </dt-dropdown>
        </span>
        <dt-button size="sm" kind="muted" importance="clear">
          All Filters
        </dt-button>
      </dt-stack>
      <div hidden>
        <dt-stack direction="row" gap="500" class="d-d-inline-flex d-fw-nowrap d-bgc-warning d-jc-space-between d-px8 d-py2 d-bar8">
          <div class="d-body--sm">Would you like to save this search?</div>
          <dt-stack direction="row" gap="300">
            <dt-button link class="d-link--muted d-body--sm">Clear</dt-button>
            <span>•</span>
            <dt-button link class="d-link--muted d-body--sm">Save this search</dt-button>
          </dt-stack>
        </dt-stack>
      </div>
      <div class="d-ba d-bc-default d-bar8 d-p128 d-ta-center d-fc-tertiary d-body--sm">
        <div class="d-py128">(table)</div>
      </div>
    </dt-stack>
    <dt-stack gap="500">
      <dt-stack>
        <h2 class="d-headline--xl">All Calls</h2>
        <dt-stack gap="400">
          <p class="d-body--md">Explore what's happening on your team's Dialpad calls with <dt-link href="link.html">Dialpad Ai</dt-link>. <dt-link href="link.html">Need help?</dt-link></p>
          <dt-stack direction="row" gap="300" class="d-body--sm d-fc-tertiary" as="p">
            <span v-dt-tooltip="`Aerolab's time zone setting`" tabindex="0" class="d-td-dotted">All data is in Asia/Kolkata</span>
            <span>Updated Sun Sep 1, 12:17 AM</span>
          </dt-stack>
        </dt-stack>
      </dt-stack>
      <dt-stack direction="row" gap="400" class="d-fw-wrap">
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Users or groups</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill d-filter-pill--selected">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary d-filter-pill__primary--selected d-filter-pill__primary--has-clear" kind="muted" importance="outlined" icon-position="right" v-dt-tooltip="`Timeframe`">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Past 90 days</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown
              </div>
            </template>
          </dt-popover>
          <dt-button onclick="alert('• Remove clear button\n• Remove `--selected` and `--has-clear`\n• Revert text label')" size="sm" class="d-filter-pill__clear d-filter-pill__clear--selected" kind="muted" importance="outlined" v-dt-tooltip="`Remove`">
            <template #icon>
              <dt-icon name="close" size="200" />
            </template>
          </dt-button>
        </span>
        <span class="d-filter-pill d-filter-pill--selected">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary d-filter-pill__primary--selected d-filter-pill__primary--has-clear" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Columns</span>
                  <span class="d-filter-pill__label-omega">7</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown
              </div>
            </template>
          </dt-popover>
          <dt-button onclick="alert('• Remove clear button\n• Remove `--selected` and `--has-clear`\n• Revert text label')" size="sm" class="d-filter-pill__clear d-filter-pill__clear--selected" kind="muted" importance="outlined" v-dt-tooltip="`Remove`">
            <template #icon>
              <dt-icon name="close" size="200" />
            </template>
          </dt-button>
        </span>
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Call participants</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Keyword</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Moment</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Duration</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Hold time</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown asdf
              </div>
            </template>
          </dt-popover>
        </span>
        <span class="d-filter-pill d-filter-pill--selected">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary d-filter-pill__primary--selected d-filter-pill__primary--has-clear" kind="muted" importance="outlined" icon-position="right">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">Dispositions</span>
                  <span class="d-filter-pill__label-omega">4</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown
              </div>
            </template>
          </dt-popover>
          <dt-button onclick="alert('• Remove clear button\n• Remove `--selected` and `--has-clear`\n• Revert text label')" size="sm" class="d-filter-pill__clear d-filter-pill__clear--selected" kind="muted" importance="outlined" v-dt-tooltip="`Remove`">
            <template #icon>
              <dt-icon name="close" size="200" />
            </template>
          </dt-button>
        </span>
        <span class="d-filter-pill d-filter-pill--selected">
          <dt-popover :open="onOpen" placement="bottom-start" fallbackPlacements="top-start" :modal="false">
            <template #anchor>
              <dt-button size="sm" class="d-filter-pill__primary d-filter-pill__primary--selected d-filter-pill__primary--has-clear" kind="muted" importance="outlined" icon-position="right" v-dt-tooltip="`Time of day`">
                <span class="d-filter-pill__label">
                  <span class="d-filter-pill__label-alpha">10am – 12pm</span>
                </span>
                <template #icon>
                  <dt-icon name="chevron-down" size="200" />
                </template>
              </dt-button>
            </template>
            <template #content>
              <div class="d-ta-center d-px32 d-py64 d-fc-tertiary d-body--sm">
                Popover or maybe Dropdown
              </div>
            </template>
          </dt-popover>
          <dt-button onclick="alert('• Remove clear button\n• Remove `--selected` and `--has-clear`\n• Revert text label')" size="sm" class="d-filter-pill__clear d-filter-pill__clear--selected" kind="muted" importance="outlined" v-dt-tooltip="`Remove`">
            <template #icon>
              <dt-icon name="close" size="200" />
            </template>
          </dt-button>
        </span>
        <dt-button size="sm" kind="muted" importance="clear">
          All Filters
        </dt-button>
      </dt-stack>
      <div hidden>
        <dt-stack direction="row" gap="500" class="d-d-inline-flex d-fw-nowrap d-bgc-warning d-jc-space-between d-px8 d-py2 d-bar8">
          <div class="d-body--sm">Would you like to save this search?</div>
          <dt-stack direction="row" gap="300">
            <dt-button link class="d-link--muted d-body--sm">Clear</dt-button>
            <span>•</span>
            <dt-button link class="d-link--muted d-body--sm">Save this search</dt-button>
          </dt-stack>
        </dt-stack>
      </div>
      <div class="d-ba d-bc-default d-bar8 d-p128 d-ta-center d-fc-tertiary d-body--sm">
        <div class="d-py128">(table)</div>
      </div>
    </dt-stack>
  </dt-stack>
</div>

<script setup>
  const items = [
    { name: 'All Calls and Dialpad Meetings', id: 1 },
    { name: 'External only', id: 2 },
    { name: 'Internal only', id: 3 },
  ];
</script>
