---
layout: Blank
---
<dt-stack gap="500" class="d-p16 d-pb96">
  <dt-stack gap="400" direction="row">
    <dt-dropdown
      id="theme-toggle-dropdown"
      navigation-type="arrow-keys"
      placement="bottom-start"
      class="theme-toggle-dropdown"
      max-height="33vh"
    >
      <template #anchor>
        <dt-button
          class="theme-toggle-button"
          importance="outlined"
          kind="muted"
          style="
            --button-color-text: var(--dt-shell-action-color-foreground-secondary-default);
            --button-color-background: var(--dt-shell-action-color-background-secondary-default);
          "
        >
          <span>
            <strong>Theme:</strong>
            {{ currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1) }}
          </span>
          <template #icon>
            <dt-icon
              size="300"
              name="satisfied-filled"
              style="
                color: var(--dt-shell-base-color-accent);
              "
            />
          </template>
        </dt-button>
      </template>
      <template #list>
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Base Theme"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setTheme('dp')"
          >
            Dialpad (DP)
            <template #right>
              <dt-icon :class="{ 'd-o0': currentTheme !== 'dp' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
        <dt-dropdown-separator />
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Partner Themes"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setTheme('tmo')"
          >
            T-Mobile (TMO)
            <template #right>
              <dt-icon :class="{ 'd-o0': currentTheme !== 'tmo' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
        <dt-dropdown-separator />
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Accessibility"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setTheme('prota-deuter')"
          >
            Prota-Deuter
            <template #right>
              <dt-icon :class="{ 'd-o0': currentTheme !== 'prota-deuter' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setTheme('trita')"
          >
            Trita
            <template #right>
              <dt-icon :class="{ 'd-o0': currentTheme !== 'trita' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
        <dt-dropdown-separator />
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Named Themes"
        >
          <dt-list-item
            v-for="themeName in namedThemes"
            :key="themeName"
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setTheme(themeName)"
          >
            {{ formatThemeName(themeName) }}
            <template #right>
              <dt-icon :class="{ 'd-o0': currentTheme !== themeName }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
        <dt-dropdown-separator />
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Experimental (37 themes)"
        >
          <dt-list-item
            v-for="themeNum in numberedThemes"
            :key="themeNum"
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setTheme(themeNum)"
          >
            Theme {{ themeNum }}
            <template #right>
              <dt-icon :class="{ 'd-o0': currentTheme !== themeNum }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
      </template>
    </dt-dropdown>
    <dt-dropdown navigation-type="arrow-keys" placement="bottom-start">
      <template #anchor>
        <dt-button
          importance="outlined"
          kind="muted"
          class="dialtone-shell-btn"
        >
          <dt-stack gap="400" direction="row">
            <span><strong>Mode:</strong> {{ currentMode.charAt(0).toUpperCase() + currentMode.slice(1) }}</span>
            <span><strong>Contrast:</strong> {{ currentContrast.charAt(0).toUpperCase() + currentContrast.slice(1) }}</span>
          </dt-stack>
          <template #icon>
            <dt-icon
              size="300"
              :name="currentModeIconName"
            />
          </template>
        </dt-button>
      </template>
      <template #list>
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Mode"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('system')"
          >
            System
            <template #right>
              <dt-icon :class="{ 'd-o0': currentMode !== 'system' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('light')"
          >
            Light
            <template #right>
              <dt-icon :class="{ 'd-o0': currentMode !== 'light' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('dark')"
          >
            Dark
            <template #right>
              <dt-icon :class="{ 'd-o0': currentMode !== 'dark' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
        <dt-dropdown-separator />
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Contrast"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setContrast('default')"
          >
            Default
            <template #right>
              <dt-icon :class="{ 'd-o0': currentContrast !== 'default' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setContrast('high')"
          >
            High
            <template #right>
              <dt-icon :class="{ 'd-o0': currentContrast !== 'high' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
      </template>
    </dt-dropdown>
    <span class="d-ml-auto">Hint... <dt-keyboard-shortcut shortcut="Shift+C"/></span>
  </dt-stack>
  <dt-stack gap="500" direction="row">
    <div class="d-fl1 d-p16 d-ba d-bc-transparent d-bar16">
      <dt-stack gap="500">
        <strong class="d-code--md d-fs-400">(root)</strong>
        <p>Follows the root theme</p>
        <dt-mode-island mode="dark" class="d-p8 d-bar8">
          <strong>Nested dark.</strong>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-secondary">d-bgc-secondary</div>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-critical">d-bgc-critical</div>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-critical">d-fc-critical</div>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-tertiary">d-fc-tertiary</div>
        </dt-mode-island>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-secondary">d-bgc-secondary</div>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-critical">d-bgc-critical</div>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-critical">d-fc-critical</div>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-tertiary">d-fc-tertiary</div>
        <dt-input label="Input field" type="text" placeholder="Placeholder" size="sm" />
        <dt-notice kind="info">
          <span> Notice </span>
          <template #action>
            <dt-button size="sm" importance="outlined" kind="muted" @click="onClick"> Action </dt-button>
          </template>
        </dt-notice>
        <dt-stack gap="300" direction="row" class="d-jc-space-between">
          <dt-badge kind="count" text="8"></dt-badge>
          <dt-badge kind="count" text="8" type="info"></dt-badge>
          <dt-badge kind="count" text="8" type="success"></dt-badge>
          <dt-badge kind="count" text="8" type="warning"></dt-badge>
          <dt-badge kind="count" text="8" type="critical"></dt-badge>
          <dt-badge kind="count" text="8" type="bulletin"></dt-badge>
          <dt-badge kind="count" text="8" type="ai"></dt-badge>
        </dt-stack>
        <dt-stack gap="300" direction="row" class="d-jc-space-between">
          <dt-button size="sm">Button</dt-button>
          <dt-button size="sm" importance="clear" kind="muted">Button</dt-button>
          <dt-button size="sm" importance="outlined" kind="muted">Button</dt-button>
          <dt-button size="sm" kind="danger">Button</dt-button>
          <dt-button size="sm" kind="positive">Button</dt-button>
        </dt-stack>
        <dt-stack gap="300" class="d-jc-space-between">
          <dt-stack gap="300" direction="row">
            <dt-popover padding="none" placement="bottom-start">
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Popover: default </dt-button>
              </template>
              <template #content="{ close }">
                <dt-mode-island class="d-p8 d-bgc-secondary">
                  <p>This is content rendered within the popover.</p>
                </dt-mode-island>
              </template>
            </dt-popover>
            <dt-popover padding="none" placement="bottom-start">
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Popover: light </dt-button>
              </template>
              <template #content="{ close }">
                <dt-mode-island mode="light" class="d-p8 d-bgc-secondary">
                  <p>This is content rendered within the popover.</p>
                </dt-mode-island>
              </template>
            </dt-popover>
            <dt-popover padding="none" placement="bottom-start">
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Popover: dark </dt-button>
              </template>
              <template #content="{ close }">
                <dt-mode-island mode="dark" class="d-p8 d-bgc-secondary">
                  <p>This is content rendered within the popover.</p>
                </dt-mode-island>
              </template>
            </dt-popover>
          </dt-stack>
          <dt-stack gap="300" direction="row">
            <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
              <!-- dialogClass, contentClass, padding -->
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Hovercard: default </dt-button>
              </template>
              <template #content>
                <dt-mode-island class="d-p16">
                  <dt-stack gap="500">
                    <dt-stack gap="400" class="d-jc-space-between">
                      <dt-stack gap="200">
                        <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                        <dt-stack direction="row" gap="350">
                          <span class="d-fc-success">Available</span>
                          <span>&bull;</span>
                          <span class="d-fc-tertiary">Troubleshooting stuffs</span>
                        </dt-stack>
                      </dt-stack>
                      <dt-stack class="d-body--md-compact">
                        <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                        <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
                      </dt-stack>
                    </dt-stack>
                    <dt-stack gap="400" direction="row" class="d-jc-space-between">
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-phone :size="iconSize" />
                        </template>
                        Call
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-quick-reply :size="iconSize" />
                        </template>
                        Message
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-video :size="iconSize" />
                        </template>
                        Meet
                      </dt-button>
                    </dt-stack>
                  </dt-stack>
                </dt-mode-island>
              </template>
            </dt-hovercard>
            <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
              <!-- dialogClass, contentClass, padding -->
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Hovercard: light </dt-button>
              </template>
              <template #content>
                <dt-mode-island mode="light" class="d-p16">
                  <dt-stack gap="500">
                    <dt-stack gap="400" class="d-jc-space-between">
                      <dt-stack gap="200">
                        <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                        <dt-stack direction="row" gap="350">
                          <span class="d-fc-success">Available</span>
                          <span>&bull;</span>
                          <span class="d-fc-tertiary">Troubleshooting stuffs</span>
                        </dt-stack>
                      </dt-stack>
                      <dt-stack class="d-body--md-compact">
                        <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                        <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
                      </dt-stack>
                    </dt-stack>
                    <dt-stack gap="400" direction="row" class="d-jc-space-between">
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-phone :size="iconSize" />
                        </template>
                        Call
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-quick-reply :size="iconSize" />
                        </template>
                        Message
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-video :size="iconSize" />
                        </template>
                        Meet
                      </dt-button>
                    </dt-stack>
                  </dt-stack>
                </dt-mode-island>
              </template>
            </dt-hovercard>
            <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
              <!-- dialogClass, contentClass, padding -->
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Hovercard: dark </dt-button>
              </template>
              <template #content>
                <dt-mode-island mode="dark" class="d-p16">
                  <dt-stack gap="500">
                    <dt-stack gap="400" class="d-jc-space-between">
                      <dt-stack gap="200">
                        <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                        <dt-stack direction="row" gap="350">
                          <span class="d-fc-success">Available</span>
                          <span>&bull;</span>
                          <span class="d-fc-tertiary">Troubleshooting stuffs</span>
                        </dt-stack>
                      </dt-stack>
                      <dt-stack class="d-body--md-compact">
                        <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                        <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
                      </dt-stack>
                    </dt-stack>
                    <dt-stack gap="400" direction="row" class="d-jc-space-between">
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-phone :size="iconSize" />
                        </template>
                        Call
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-quick-reply :size="iconSize" />
                        </template>
                        Message
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-video :size="iconSize" />
                        </template>
                        Meet
                      </dt-button>
                    </dt-stack>
                  </dt-stack>
                </dt-mode-island>
              </template>
            </dt-hovercard>
          </dt-stack>
          <dt-stack gap="300" direction="row">
            <dt-dropdown navigation-type="arrow-keys" placement="bottom-start">
              <template #anchor="{ attrs }">
                <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined" icon-position="right">
                  Dropdown: default
                  <template #icon="{ iconSize }">
                    <dt-icon name="chevron-down" :size="iconSize" />
                  </template>
                </dt-button>
              </template>
              <template #list="{ close }">
                <dt-list-item
                  v-for="item in items"
                  :key="item.id"
                  role="menuitem"
                  :navigation-type="arrow - keys"
                  @click="close"
                >
                  {{ item.name }}
                </dt-list-item>
              </template>
            </dt-dropdown>
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </div>
    <dt-mode-island class="asdfasdfasdf d-fl1 d-p16 d-ba d-bc-subtle d-bar16"
      @click="$event.currentTarget.classList.toggle('asdfasdfasdf')"
    >
      <dt-stack gap="500">
        <strong class="d-code--md d-fs-400">mode="<strong>inverted</strong>"</strong>
        <p>Inverted relative to parent</p>
        <dt-mode-island mode="dark" class="d-p8 d-bar8">
          <strong>Nested dark.</strong>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-secondary">d-bgc-secondary</div>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-critical">d-bgc-critical</div>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-critical">d-fc-critical</div>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-tertiary">d-fc-tertiary</div>
        </dt-mode-island>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-secondary">d-bgc-secondary</div>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-critical">d-bgc-critical</div>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-critical">d-fc-critical</div>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-tertiary">d-fc-tertiary</div>
        <dt-input label="Input field" type="text" placeholder="Placeholder" size="sm" />
        <dt-notice kind="info">
          <span> Notice </span>
          <template #action>
            <dt-button size="sm" importance="outlined" kind="muted" @click="onClick"> Action </dt-button>
          </template>
        </dt-notice>
        <dt-stack gap="300" direction="row" class="d-jc-space-between">
          <dt-badge kind="count" text="8"></dt-badge>
          <dt-badge kind="count" text="8" type="info"></dt-badge>
          <dt-badge kind="count" text="8" type="success"></dt-badge>
          <dt-badge kind="count" text="8" type="warning"></dt-badge>
          <dt-badge kind="count" text="8" type="critical"></dt-badge>
          <dt-badge kind="count" text="8" type="bulletin"></dt-badge>
          <dt-badge kind="count" text="8" type="ai"></dt-badge>
        </dt-stack>
        <dt-stack gap="300" direction="row" class="d-jc-space-between">
          <dt-button size="sm">Button</dt-button>
          <dt-button size="sm" importance="clear" kind="muted">Button</dt-button>
          <dt-button size="sm" importance="outlined" kind="muted">Button</dt-button>
          <dt-button size="sm" kind="danger">Button</dt-button>
          <dt-button size="sm" kind="positive">Button</dt-button>
        </dt-stack>
        <dt-stack gap="300" class="d-jc-space-between">
          <dt-stack gap="300" direction="row">
            <dt-popover padding="none" placement="bottom-start">
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Popover: default </dt-button>
              </template>
              <template #content="{ close }">
                <dt-mode-island class="d-p8 d-bgc-secondary">
                  <p>This is content rendered within the popover.</p>
                </dt-mode-island>
              </template>
            </dt-popover>
            <dt-popover padding="none" placement="bottom-start">
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Popover: light </dt-button>
              </template>
              <template #content="{ close }">
                <dt-mode-island mode="light" class="d-p8 d-bgc-secondary">
                  <p>This is content rendered within the popover.</p>
                </dt-mode-island>
              </template>
            </dt-popover>
            <dt-popover padding="none" placement="bottom-start">
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Popover: dark </dt-button>
              </template>
              <template #content="{ close }">
                <dt-mode-island mode="dark" class="d-p8 d-bgc-secondary">
                  <p>This is content rendered within the popover.</p>
                </dt-mode-island>
              </template>
            </dt-popover>
          </dt-stack>
          <dt-stack gap="300" direction="row">
            <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
              <!-- dialogClass, contentClass, padding -->
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Hovercard: default </dt-button>
              </template>
              <template #content>
                <dt-mode-island class="d-p16">
                  <dt-stack gap="500">
                    <dt-stack gap="400" class="d-jc-space-between">
                      <dt-stack gap="200">
                        <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                        <dt-stack direction="row" gap="350">
                          <span class="d-fc-success">Available</span>
                          <span>&bull;</span>
                          <span class="d-fc-tertiary">Troubleshooting stuffs</span>
                        </dt-stack>
                      </dt-stack>
                      <dt-stack class="d-body--md-compact">
                        <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                        <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
                      </dt-stack>
                    </dt-stack>
                    <dt-stack gap="400" direction="row" class="d-jc-space-between">
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-phone :size="iconSize" />
                        </template>
                        Call
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-quick-reply :size="iconSize" />
                        </template>
                        Message
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-video :size="iconSize" />
                        </template>
                        Meet
                      </dt-button>
                    </dt-stack>
                  </dt-stack>
                </dt-mode-island>
              </template>
            </dt-hovercard>
            <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
              <!-- dialogClass, contentClass, padding -->
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Hovercard: light </dt-button>
              </template>
              <template #content>
                <dt-mode-island mode="light" class="d-p16">
                  <dt-stack gap="500">
                    <dt-stack gap="400" class="d-jc-space-between">
                      <dt-stack gap="200">
                        <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                        <dt-stack direction="row" gap="350">
                          <span class="d-fc-success">Available</span>
                          <span>&bull;</span>
                          <span class="d-fc-tertiary">Troubleshooting stuffs</span>
                        </dt-stack>
                      </dt-stack>
                      <dt-stack class="d-body--md-compact">
                        <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                        <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
                      </dt-stack>
                    </dt-stack>
                    <dt-stack gap="400" direction="row" class="d-jc-space-between">
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-phone :size="iconSize" />
                        </template>
                        Call
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-quick-reply :size="iconSize" />
                        </template>
                        Message
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-video :size="iconSize" />
                        </template>
                        Meet
                      </dt-button>
                    </dt-stack>
                  </dt-stack>
                </dt-mode-island>
              </template>
            </dt-hovercard>
            <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
              <!-- dialogClass, contentClass, padding -->
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Hovercard: dark </dt-button>
              </template>
              <template #content>
                <dt-mode-island mode="dark" class="d-p16">
                  <dt-stack gap="500">
                    <dt-stack gap="400" class="d-jc-space-between">
                      <dt-stack gap="200">
                        <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                        <dt-stack direction="row" gap="350">
                          <span class="d-fc-success">Available</span>
                          <span>&bull;</span>
                          <span class="d-fc-tertiary">Troubleshooting stuffs</span>
                        </dt-stack>
                      </dt-stack>
                      <dt-stack class="d-body--md-compact">
                        <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                        <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
                      </dt-stack>
                    </dt-stack>
                    <dt-stack gap="400" direction="row" class="d-jc-space-between">
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-phone :size="iconSize" />
                        </template>
                        Call
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-quick-reply :size="iconSize" />
                        </template>
                        Message
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-video :size="iconSize" />
                        </template>
                        Meet
                      </dt-button>
                    </dt-stack>
                  </dt-stack>
                </dt-mode-island>
              </template>
            </dt-hovercard>
          </dt-stack>
          <dt-stack gap="300" direction="row">
            <dt-dropdown navigation-type="arrow-keys" placement="bottom-start">
              <template #anchor="{ attrs }">
                <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined" icon-position="right">
                  Dropdown: default
                  <template #icon="{ iconSize }">
                    <dt-icon name="chevron-down" :size="iconSize" />
                  </template>
                </dt-button>
              </template>
              <template #list="{ close }">
                <dt-list-item
                  v-for="item in items"
                  :key="item.id"
                  role="menuitem"
                  :navigation-type="arrow - keys"
                  @click="close"
                >
                  {{ item.name }}
                </dt-list-item>
              </template>
            </dt-dropdown>
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </dt-mode-island>
    <dt-mode-island mode="dark" class="asdfasdfasdf d-fl1 d-p16 d-ba d-bc-subtle d-bar16"
      @click="$event.currentTarget.classList.toggle('asdfasdfasdf')"
    >
      <dt-stack gap="500">
        <strong class="d-code--md d-fs-400">mode="<strong>dark</strong>"</strong>
        <p>Always dark no matter the root theme</p>
        <dt-mode-island mode="light" class="d-p8 d-bar8">
          <strong>Nested light.</strong>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-secondary">d-bgc-secondary</div>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-critical">d-bgc-critical</div>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-critical">d-fc-critical</div>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-tertiary">d-fc-tertiary</div>
        </dt-mode-island>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-secondary">d-bgc-secondary</div>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-critical">d-bgc-critical</div>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-critical">d-fc-critical</div>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-tertiary">d-fc-tertiary</div>
        <dt-input label="Input field" type="text" placeholder="Placeholder" size="sm" />
        <dt-notice kind="info">
          <span> Notice </span>
          <template #action>
            <dt-button size="sm" importance="outlined" kind="muted" @click="onClick"> Action </dt-button>
          </template>
        </dt-notice>
        <dt-stack gap="300" direction="row" class="d-jc-space-between">
          <dt-badge kind="count" text="8"></dt-badge>
          <dt-badge kind="count" text="8" type="info"></dt-badge>
          <dt-badge kind="count" text="8" type="success"></dt-badge>
          <dt-badge kind="count" text="8" type="warning"></dt-badge>
          <dt-badge kind="count" text="8" type="critical"></dt-badge>
          <dt-badge kind="count" text="8" type="bulletin"></dt-badge>
          <dt-badge kind="count" text="8" type="ai"></dt-badge>
        </dt-stack>
        <dt-stack gap="300" direction="row" class="d-jc-space-between">
          <dt-button size="sm">Button</dt-button>
          <dt-button size="sm" importance="clear" kind="muted">Button</dt-button>
          <dt-button size="sm" importance="outlined" kind="muted">Button</dt-button>
          <dt-button size="sm" kind="danger">Button</dt-button>
          <dt-button size="sm" kind="positive">Button</dt-button>
        </dt-stack>
        <dt-stack gap="300" class="d-jc-space-between">
          <dt-stack gap="300" direction="row">
            <dt-popover padding="none" placement="bottom-start">
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Popover: default </dt-button>
              </template>
              <template #content="{ close }">
                <dt-mode-island class="d-p8 d-bgc-secondary">
                  <p>This is content rendered within the popover.</p>
                </dt-mode-island>
              </template>
            </dt-popover>
            <dt-popover padding="none" placement="bottom-start">
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Popover: light </dt-button>
              </template>
              <template #content="{ close }">
                <dt-mode-island mode="light" class="d-p8 d-bgc-secondary">
                  <p>This is content rendered within the popover.</p>
                </dt-mode-island>
              </template>
            </dt-popover>
            <dt-popover padding="none" placement="bottom-start">
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Popover: dark </dt-button>
              </template>
              <template #content="{ close }">
                <dt-mode-island mode="dark" class="d-p8 d-bgc-secondary">
                  <p>This is content rendered within the popover.</p>
                </dt-mode-island>
              </template>
            </dt-popover>
          </dt-stack>
          <dt-stack gap="300" direction="row">
            <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
              <!-- dialogClass, contentClass, padding -->
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Hovercard: default </dt-button>
              </template>
              <template #content>
                <dt-mode-island class="d-p16">
                  <dt-stack gap="500">
                    <dt-stack gap="400" class="d-jc-space-between">
                      <dt-stack gap="200">
                        <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                        <dt-stack direction="row" gap="350">
                          <span class="d-fc-success">Available</span>
                          <span>&bull;</span>
                          <span class="d-fc-tertiary">Troubleshooting stuffs</span>
                        </dt-stack>
                      </dt-stack>
                      <dt-stack class="d-body--md-compact">
                        <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                        <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
                      </dt-stack>
                    </dt-stack>
                    <dt-stack gap="400" direction="row" class="d-jc-space-between">
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-phone :size="iconSize" />
                        </template>
                        Call
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-quick-reply :size="iconSize" />
                        </template>
                        Message
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-video :size="iconSize" />
                        </template>
                        Meet
                      </dt-button>
                    </dt-stack>
                  </dt-stack>
                </dt-mode-island>
              </template>
            </dt-hovercard>
            <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
              <!-- dialogClass, contentClass, padding -->
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Hovercard: light </dt-button>
              </template>
              <template #content>
                <dt-mode-island mode="light" class="d-p16">
                  <dt-stack gap="500">
                    <dt-stack gap="400" class="d-jc-space-between">
                      <dt-stack gap="200">
                        <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                        <dt-stack direction="row" gap="350">
                          <span class="d-fc-success">Available</span>
                          <span>&bull;</span>
                          <span class="d-fc-tertiary">Troubleshooting stuffs</span>
                        </dt-stack>
                      </dt-stack>
                      <dt-stack class="d-body--md-compact">
                        <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                        <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
                      </dt-stack>
                    </dt-stack>
                    <dt-stack gap="400" direction="row" class="d-jc-space-between">
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-phone :size="iconSize" />
                        </template>
                        Call
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-quick-reply :size="iconSize" />
                        </template>
                        Message
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-video :size="iconSize" />
                        </template>
                        Meet
                      </dt-button>
                    </dt-stack>
                  </dt-stack>
                </dt-mode-island>
              </template>
            </dt-hovercard>
            <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
              <!-- dialogClass, contentClass, padding -->
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Hovercard: dark </dt-button>
              </template>
              <template #content>
                <dt-mode-island mode="dark" class="d-p16">
                  <dt-stack gap="500">
                    <dt-stack gap="400" class="d-jc-space-between">
                      <dt-stack gap="200">
                        <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                        <dt-stack direction="row" gap="350">
                          <span class="d-fc-success">Available</span>
                          <span>&bull;</span>
                          <span class="d-fc-tertiary">Troubleshooting stuffs</span>
                        </dt-stack>
                      </dt-stack>
                      <dt-stack class="d-body--md-compact">
                        <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                        <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
                      </dt-stack>
                    </dt-stack>
                    <dt-stack gap="400" direction="row" class="d-jc-space-between">
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-phone :size="iconSize" />
                        </template>
                        Call
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-quick-reply :size="iconSize" />
                        </template>
                        Message
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-video :size="iconSize" />
                        </template>
                        Meet
                      </dt-button>
                    </dt-stack>
                  </dt-stack>
                </dt-mode-island>
              </template>
            </dt-hovercard>
          </dt-stack>
          <dt-stack gap="300" direction="row">
            <dt-dropdown navigation-type="arrow-keys" placement="bottom-start">
              <template #anchor="{ attrs }">
                <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined" icon-position="right">
                  Dropdown: default
                  <template #icon="{ iconSize }">
                    <dt-icon name="chevron-down" :size="iconSize" />
                  </template>
                </dt-button>
              </template>
              <template #list="{ close }">
                <dt-list-item
                  v-for="item in items"
                  :key="item.id"
                  role="menuitem"
                  :navigation-type="arrow - keys"
                  @click="close"
                >
                  {{ item.name }}
                </dt-list-item>
              </template>
            </dt-dropdown>
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </dt-mode-island>
    <dt-mode-island mode="light" class="asdfasdfasdf d-fl1 d-p16 d-ba d-bc-subtle d-bar16"
      @click="$event.currentTarget.classList.toggle('asdfasdfasdf')"
    >
      <dt-stack gap="500">
        <strong class="d-code--md d-fs-400">mode="<strong>light</strong>"</strong>
        <p>Always light no matter the root theme</p>
        <dt-mode-island mode="dark" class="d-p8 d-bar8">
          <strong>Nested dark.</strong>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-secondary">d-bgc-secondary</div>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-critical">d-bgc-critical</div>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-critical">d-fc-critical</div>
          <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-tertiary">d-fc-tertiary</div>
        </dt-mode-island>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-secondary">d-bgc-secondary</div>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-bgc-critical">d-bgc-critical</div>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-critical">d-fc-critical</div>
        <div class="d-body--sm d-p8 d-ba d-bc-subtle d-fc-tertiary">d-fc-tertiary</div>
        <dt-input label="Input field" type="text" placeholder="Placeholder" size="sm" />
        <dt-notice kind="info">
          <span> Notice </span>
          <template #action>
            <dt-button size="sm" importance="outlined" kind="muted" @click="onClick"> Action </dt-button>
          </template>
        </dt-notice>
        <dt-stack gap="300" direction="row" class="d-jc-space-between">
          <dt-badge kind="count" text="8"></dt-badge>
          <dt-badge kind="count" text="8" type="info"></dt-badge>
          <dt-badge kind="count" text="8" type="success"></dt-badge>
          <dt-badge kind="count" text="8" type="warning"></dt-badge>
          <dt-badge kind="count" text="8" type="critical"></dt-badge>
          <dt-badge kind="count" text="8" type="bulletin"></dt-badge>
          <dt-badge kind="count" text="8" type="ai"></dt-badge>
        </dt-stack>
        <dt-stack gap="300" direction="row" class="d-jc-space-between">
          <dt-button size="sm">Button</dt-button>
          <dt-button size="sm" importance="clear" kind="muted">Button</dt-button>
          <dt-button size="sm" importance="outlined" kind="muted">Button</dt-button>
          <dt-button size="sm" kind="danger">Button</dt-button>
          <dt-button size="sm" kind="positive">Button</dt-button>
        </dt-stack>
        <dt-stack gap="300" class="d-jc-space-between">
          <dt-stack gap="300" direction="row">
            <dt-popover padding="none" placement="bottom-start">
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Popover: default </dt-button>
              </template>
              <template #content="{ close }">
                <dt-mode-island class="d-p8 d-bgc-secondary">
                  <p>This is content rendered within the popover.</p>
                </dt-mode-island>
              </template>
            </dt-popover>
            <dt-popover padding="none" placement="bottom-start">
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Popover: light </dt-button>
              </template>
              <template #content="{ close }">
                <dt-mode-island mode="light" class="d-p8 d-bgc-secondary">
                  <p>This is content rendered within the popover.</p>
                </dt-mode-island>
              </template>
            </dt-popover>
            <dt-popover padding="none" placement="bottom-start">
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Popover: dark </dt-button>
              </template>
              <template #content="{ close }">
                <dt-mode-island mode="dark" class="d-p8 d-bgc-secondary">
                  <p>This is content rendered within the popover.</p>
                </dt-mode-island>
              </template>
            </dt-popover>
          </dt-stack>
          <dt-stack gap="300" direction="row">
            <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
              <!-- dialogClass, contentClass, padding -->
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Hovercard: default </dt-button>
              </template>
              <template #content>
                <dt-mode-island class="d-p16">
                  <dt-stack gap="500">
                    <dt-stack gap="400" class="d-jc-space-between">
                      <dt-stack gap="200">
                        <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                        <dt-stack direction="row" gap="350">
                          <span class="d-fc-success">Available</span>
                          <span>&bull;</span>
                          <span class="d-fc-tertiary">Troubleshooting stuffs</span>
                        </dt-stack>
                      </dt-stack>
                      <dt-stack class="d-body--md-compact">
                        <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                        <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
                      </dt-stack>
                    </dt-stack>
                    <dt-stack gap="400" direction="row" class="d-jc-space-between">
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-phone :size="iconSize" />
                        </template>
                        Call
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-quick-reply :size="iconSize" />
                        </template>
                        Message
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-video :size="iconSize" />
                        </template>
                        Meet
                      </dt-button>
                    </dt-stack>
                  </dt-stack>
                </dt-mode-island>
              </template>
            </dt-hovercard>
            <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
              <!-- dialogClass, contentClass, padding -->
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Hovercard: light </dt-button>
              </template>
              <template #content>
                <dt-mode-island mode="light" class="d-p16">
                  <dt-stack gap="500">
                    <dt-stack gap="400" class="d-jc-space-between">
                      <dt-stack gap="200">
                        <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                        <dt-stack direction="row" gap="350">
                          <span class="d-fc-success">Available</span>
                          <span>&bull;</span>
                          <span class="d-fc-tertiary">Troubleshooting stuffs</span>
                        </dt-stack>
                      </dt-stack>
                      <dt-stack class="d-body--md-compact">
                        <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                        <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
                      </dt-stack>
                    </dt-stack>
                    <dt-stack gap="400" direction="row" class="d-jc-space-between">
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-phone :size="iconSize" />
                        </template>
                        Call
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-quick-reply :size="iconSize" />
                        </template>
                        Message
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-video :size="iconSize" />
                        </template>
                        Meet
                      </dt-button>
                    </dt-stack>
                  </dt-stack>
                </dt-mode-island>
              </template>
            </dt-hovercard>
            <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
              <!-- dialogClass, contentClass, padding -->
              <template #anchor>
                <dt-button size="sm" kind="muted" importance="outlined"> Hovercard: dark </dt-button>
              </template>
              <template #content>
                <dt-mode-island mode="dark" class="d-p16">
                  <dt-stack gap="500">
                    <dt-stack gap="400" class="d-jc-space-between">
                      <dt-stack gap="200">
                        <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                        <dt-stack direction="row" gap="350">
                          <span class="d-fc-success">Available</span>
                          <span>&bull;</span>
                          <span class="d-fc-tertiary">Troubleshooting stuffs</span>
                        </dt-stack>
                      </dt-stack>
                      <dt-stack class="d-body--md-compact">
                        <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                        <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
                      </dt-stack>
                    </dt-stack>
                    <dt-stack gap="400" direction="row" class="d-jc-space-between">
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-phone :size="iconSize" />
                        </template>
                        Call
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-quick-reply :size="iconSize" />
                        </template>
                        Message
                      </dt-button>
                      <dt-button class="d-fl1" kind="muted" importance="outlined">
                        <template #icon="{ iconSize }">
                          <dt-icon-video :size="iconSize" />
                        </template>
                        Meet
                      </dt-button>
                    </dt-stack>
                  </dt-stack>
                </dt-mode-island>
              </template>
            </dt-hovercard>
          </dt-stack>
          <dt-stack gap="300" direction="row">
            <dt-dropdown navigation-type="arrow-keys" placement="bottom-start">
              <template #anchor="{ attrs }">
                <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined" icon-position="right">
                  Dropdown: default
                  <template #icon="{ iconSize }">
                    <dt-icon name="chevron-down" :size="iconSize" />
                  </template>
                </dt-button>
              </template>
              <template #list="{ close }">
                <dt-list-item
                  v-for="item in items"
                  :key="item.id"
                  role="menuitem"
                  :navigation-type="arrow - keys"
                  @click="close"
                >
                  {{ item.name }}
                </dt-list-item>
              </template>
            </dt-dropdown>
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </dt-mode-island>
  </dt-stack>
  <dt-mode-island
    class="d-p16 d-ba d-bc-subtle d-bar8 asdfasdfasdf"
    @click="$event.currentTarget.classList.toggle('asdfasdfasdf')"
    >
    <p class="d-body--md d-mb16">
      This will invert relative to the parent mode.
    </p>
    <dt-mode-island
      class="d-p16 d-ba d-bc-subtle d-bar8"
    >
      <p class="d-body--md d-mb16">
        This nested island inverts the parent mode.
      </p>
      <dt-mode-island
        class="d-p16 d-ba d-bc-subtle d-bar8"
      >
        <p class="d-body--md d-mb16">
          This deeply nested island inverts again.
        </p>
        <dt-mode-island
          class="d-p16 d-ba d-bc-subtle d-bar8"
        >
          <p class="d-body--md">
            And invert again.
          </p>
        </dt-mode-island>
      </dt-mode-island>
    </dt-mode-island>
  </dt-mode-island>
</dt-stack>
<dt-mode-island
   id="callbarr"
   class="
     d-ps-fixed
     d-r16
     d-bn100p
     d-l16
     d-t
     d-ttf-quint
     d-o0
   "
   style="transition-duration: calc(var(--td300) * 2) !important;"
  >
  <div
    class="
      d-bgc-primary
      d-bgo90
      d-ba
      d-bc-subtle
      d-p8
      d-py6
      d-bar32
      d-bs-md
    "
    style="backdrop-filter: blur(8px)"
  >
    <dt-stack direction="row" gap="500">
      <dt-stack class="d-w20p" gap="400" direction="row">
        <dt-avatar
          full-name="TA"
          color="700"
          size="lg"
        />
        <dt-stack gap="200">
          <span class="d-label--md-compact">Ted Anderson</span>
          <dt-stack direction="row" gap="300" class="d-ai-baseline d-helper--sm d-fc-tertiary">
            <span >(913) 555-6745</span>
            <span class="d-fc-muted">&bull;</span>
            <span class="d-fvn-tabular">21:18</span>
          </dt-stack>
        </dt-stack>
      </dt-stack>
      <dt-stack class="d-fl1 d-jc-center" direction="row" gap="200">
        <dt-button class="d-px8 d-w72" size="sm" kind="danger" icon-position="top">
          <template #icon> <dt-icon name="more-vertical" size="400" /> </template>
          Unmute
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear" icon-position="top">
          <template #icon> <dt-icon name="hold" size="400" /> </template>
          Hold
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear" icon-position="top">
          <template #icon> <dt-icon name="transfer" size="400" /> </template>
          Transfer
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear" icon-position="top">
          <template #icon> <dt-icon name="record-filled" size="400" /> </template>
          Record
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear" icon-position="top">
          <template #icon> <dt-icon name="keypad" size="400" /> </template>
          Keypad
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear" icon-position="top">
          <template #icon> <dt-icon name="user-plus" size="400" /> </template>
          Add
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear" icon-position="top">
          <template #icon> <dt-icon name="park" size="400" /> </template>
          Share
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear" icon-position="top">
          <template #icon> <dt-icon name="mic" size="400" /> </template>
          Park
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear" icon-position="top">
          <template #icon> <dt-icon name="more-horizontal" size="400" /> </template>
          More
        </dt-button>
      </dt-stack>
      <dt-stack class="d-w20p">
        <div class="d-ml-auto">
          <dt-button class="d-p12" circle size="lg" kind="danger" @click="toggleCallbar">
            <template #icon> <dt-icon name="phone-hang-up" size="500" /> </template>
          </dt-button>
        </div>
      </dt-stack>
    </dt-stack>
  </div>
</dt-mode-island>

<script setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import { DtIconPhone, DtIconQuickReply, DtIconVideo } from '@dialpad/dialtone-icons/vue3';
  import { useThemeManager } from '@composables/useThemeManager';

  const items = ref([
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
  ]);

  // Use theme manager composable with full theme switching
  const {
    currentMode,
    currentTheme,
    currentContrast,
    currentModeIconName,
    setMode,
    setContrast,
    setTheme,
    namedThemes,
    numberedThemes,
    formatThemeName,
  } = useThemeManager({ includeThemes: true });

  const toggleCallbar = () => {
    const el = document.getElementById('callbarr');
    if (el) {
      el.classList.toggle('d-bn100p');
      el.classList.toggle('d-b16');
      el.classList.toggle('d-o0');
    }
  };

  const handleKeydown = (event) => {
    // Check for Shift + C
    if (event.shiftKey && event.key === 'C') {
      toggleCallbar();
    }
  };

  onMounted(() => {
    // Listen for Shift + C keypress
    window.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<style lang="less">
  /* .asdfasdfasdf {
    opacity: 0;
  } */
  .vp-back-to-top-button {
    display: none;
  }
</style>
