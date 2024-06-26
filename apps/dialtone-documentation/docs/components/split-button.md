---
title: Split Button
description: A Split Button offers a default action paired with a secondary action to reveal alternate, but related actions.
status: beta
thumb: true
image: assets/images/components/split-button.png
storybook:
---

<div class="asdfasdfqwerqwer">
  <table class="d-table dialtone-doc-table d-bt d-bb d-bbw2 d-bc-default">
    <thead>
      <tr>
        <th class="d-ta-center d-br d-bc-default">
          &nbsp;
        </th>
        <th class="d-ta-center d-br d-bc-default">
          Clear
        </th>
        <th class="d-ta-center d-br d-bc-default">
          Outlined
        </th>
        <th class="d-ta-center d-br d-bc-default">
          Primary
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th class="d-ta-right d-br d-brw2 d-bc-default" scope="row">
          <span class="d-headline--eyebrow">Base</span>
        </th>
        <td class="d-ta-right d-br d-bc-default">
          <dt-stack direction="row" gap="500" class="d-jc-center">
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="clear" class="d-split-btn__alpha d-split-btn__alpha--xs">Place call</dt-button>
                  <dt-button size="xs" importance="clear" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="clear" class="d-split-btn__alpha d-split-btn__alpha--sm">Place call</dt-button>
                  <dt-button size="sm" importance="clear" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="clear" class="d-split-btn__alpha d-split-btn__alpha--md">Place call</dt-button>
                  <dt-button size="md" importance="clear" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="clear" class="d-split-btn__alpha d-split-btn__alpha--lg">Place call</dt-button>
                  <dt-button size="lg" importance="clear" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="clear" class="d-split-btn__alpha d-split-btn__alpha--xl">Place call</dt-button>
                  <dt-button size="xl" importance="clear" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="clear" class="d-split-btn__alpha d-split-btn__alpha--xs">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="xs" importance="clear" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="clear" class="d-split-btn__alpha d-split-btn__alpha--sm">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="sm" importance="clear" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="clear" class="d-split-btn__alpha d-split-btn__alpha--md">
                    <template #icon>
                      <dt-icon name="phone" size="300" />
                    </template>
                  </dt-button>
                  <dt-button size="md" importance="clear" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="clear" class="d-split-btn__alpha d-split-btn__alpha--lg">
                    <template #icon>
                      <dt-icon name="phone" size="400" />
                    </template>
                  </dt-button>
                  <dt-button size="lg" importance="clear" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="clear" class="d-split-btn__alpha d-split-btn__alpha--xl">
                    <template #icon>
                      <dt-icon name="phone" size="500" />
                    </template>
                  </dt-button>
                  <dt-button size="xl" importance="clear" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
          </dt-stack>
        </td>
        <td class="d-ta-right d-br d-bc-default">
          <dt-stack direction="row" gap="500" class="d-jc-center">
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="outlined" class="d-split-btn__alpha d-split-btn__alpha--xs">Place call</dt-button>
                  <dt-button size="xs" importance="outlined" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="outlined" class="d-split-btn__alpha d-split-btn__alpha--sm">Place call</dt-button>
                  <dt-button size="sm" importance="outlined" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="outlined" class="d-split-btn__alpha d-split-btn__alpha--md">Place call</dt-button>
                  <dt-button size="md" importance="outlined" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="outlined" class="d-split-btn__alpha d-split-btn__alpha--lg">Place call</dt-button>
                  <dt-button size="lg" importance="outlined" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="outlined" class="d-split-btn__alpha d-split-btn__alpha--xl">Place call</dt-button>
                  <dt-button size="xl" importance="outlined" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="outlined" class="d-split-btn__alpha d-split-btn__alpha--xs">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="xs" importance="outlined" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="outlined" class="d-split-btn__alpha d-split-btn__alpha--sm">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="sm" importance="outlined" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="outlined" class="d-split-btn__alpha d-split-btn__alpha--md">
                    <template #icon>
                      <dt-icon name="phone" size="300" />
                    </template>
                  </dt-button>
                  <dt-button size="md" importance="outlined" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="outlined" class="d-split-btn__alpha d-split-btn__alpha--lg">
                    <template #icon>
                      <dt-icon name="phone" size="400" />
                    </template>
                  </dt-button>
                  <dt-button size="lg" importance="outlined" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="outlined" class="d-split-btn__alpha d-split-btn__alpha--xl">
                    <template #icon>
                      <dt-icon name="phone" size="500" />
                    </template>
                  </dt-button>
                  <dt-button size="xl" importance="outlined" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="500" class="d-jc-center">
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" class="d-split-btn__alpha d-split-btn__alpha--xs">Place call</dt-button>
                  <dt-button size="xs" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" class="d-split-btn__alpha d-split-btn__alpha--sm">Place call</dt-button>
                  <dt-button size="sm" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" class="d-split-btn__alpha d-split-btn__alpha--md">Place call</dt-button>
                  <dt-button size="md" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" class="d-split-btn__alpha d-split-btn__alpha--lg">Place call</dt-button>
                  <dt-button size="lg" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" class="d-split-btn__alpha d-split-btn__alpha--xl">Place call</dt-button>
                  <dt-button size="xl" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" class="d-split-btn__alpha d-split-btn__alpha--xs">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="xs" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" class="d-split-btn__alpha d-split-btn__alpha--sm">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="sm" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" class="d-split-btn__alpha d-split-btn__alpha--md">
                    <template #icon>
                      <dt-icon name="phone" size="300" />
                    </template>
                  </dt-button>
                  <dt-button size="md" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" class="d-split-btn__alpha d-split-btn__alpha--lg">
                    <template #icon>
                      <dt-icon name="phone" size="400" />
                    </template>
                  </dt-button>
                  <dt-button size="lg" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" class="d-split-btn__alpha d-split-btn__alpha--xl">
                    <template #icon>
                      <dt-icon name="phone" size="500" />
                    </template>
                  </dt-button>
                  <dt-button size="xl" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <th class="d-ta-right d-br d-brw2 d-bc-default" scope="row">
          <span class="d-headline--eyebrow">Danger</span>
        </th>
        <td class="d-br d-bc-default">
          <dt-stack direction="row" gap="500" class="d-jc-center">
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="clear" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--xs">Place call</dt-button>
                  <dt-button size="xs" importance="clear" kind="danger" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="clear" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--sm">Place call</dt-button>
                  <dt-button size="sm" importance="clear" kind="danger" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="clear" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--md">Place call</dt-button>
                  <dt-button size="md" importance="clear" kind="danger" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="clear" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--lg">Place call</dt-button>
                  <dt-button size="lg" importance="clear" kind="danger" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="clear" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--xl">Place call</dt-button>
                  <dt-button size="xl" importance="clear" kind="danger" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="clear" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--xs">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="xs" importance="clear" kind="danger" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="clear" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--sm">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="sm" importance="clear" kind="danger" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="clear" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--md">
                    <template #icon>
                      <dt-icon name="phone" size="300" />
                    </template>
                  </dt-button>
                  <dt-button size="md" importance="clear" kind="danger" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="clear" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--lg">
                    <template #icon>
                      <dt-icon name="phone" size="400" />
                    </template>
                  </dt-button>
                  <dt-button size="lg" importance="clear" kind="danger" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="clear" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--xl">
                    <template #icon>
                      <dt-icon name="phone" size="500" />
                    </template>
                  </dt-button>
                  <dt-button size="xl" importance="clear" kind="danger" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
          </dt-stack>
        </td>
        <td class="d-br d-bc-default">
          <dt-stack direction="row" gap="500" class="d-jc-center">
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="outlined" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--xs">Place call</dt-button>
                  <dt-button size="xs" importance="outlined" kind="danger" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="outlined" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--sm">Place call</dt-button>
                  <dt-button size="sm" importance="outlined" kind="danger" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="outlined" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--md">Place call</dt-button>
                  <dt-button size="md" importance="outlined" kind="danger" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="outlined" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--lg">Place call</dt-button>
                  <dt-button size="lg" importance="outlined" kind="danger" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="outlined" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--xl">Place call</dt-button>
                  <dt-button size="xl" importance="outlined" kind="danger" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="outlined" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--xs">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="xs" importance="outlined" kind="danger" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="outlined" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--sm">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="sm" importance="outlined" kind="danger" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="outlined" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--md">
                    <template #icon>
                      <dt-icon name="phone" size="300" />
                    </template>
                  </dt-button>
                  <dt-button size="md" importance="outlined" kind="danger" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="outlined" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--lg">
                    <template #icon>
                      <dt-icon name="phone" size="400" />
                    </template>
                  </dt-button>
                  <dt-button size="lg" importance="outlined" kind="danger" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="outlined" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--xl">
                    <template #icon>
                      <dt-icon name="phone" size="500" />
                    </template>
                  </dt-button>
                  <dt-button size="xl" importance="outlined" kind="danger" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="500" class="d-jc-center">
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--xs">Place call</dt-button>
                  <dt-button size="xs" kind="danger" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--sm">Place call</dt-button>
                  <dt-button size="sm" kind="danger" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--md">Place call</dt-button>
                  <dt-button size="md" kind="danger" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--lg">Place call</dt-button>
                  <dt-button size="lg" kind="danger" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--xl">Place call</dt-button>
                  <dt-button size="xl" kind="danger" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--xs">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="xs" kind="danger" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--sm">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="sm" kind="danger" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--md">
                    <template #icon>
                      <dt-icon name="phone" size="300" />
                    </template>
                  </dt-button>
                  <dt-button size="md" kind="danger" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--lg">
                    <template #icon>
                      <dt-icon name="phone" size="400" />
                    </template>
                  </dt-button>
                  <dt-button size="lg" kind="danger" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" kind="danger" class="d-split-btn__alpha d-split-btn__alpha--xl">
                    <template #icon>
                      <dt-icon name="phone" size="500" />
                    </template>
                  </dt-button>
                  <dt-button size="xl" kind="danger" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
          </dt-stack>
        </td>
      </tr>
      <tr class="d-bgc-contrast">
        <th class="d-ta-right d-br d-brw2 d-bc-default-inverted" scope="row">
          <span class="d-headline--eyebrow d-fc-primary-inverted">Inverted</span>
        </th>
        <td class="d-br d-bc-default-inverted">
          <dt-stack direction="row" gap="500" class="d-jc-center">
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="clear" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--xs">Place call</dt-button>
                  <dt-button size="xs" importance="clear" kind="inverted" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="clear" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--sm">Place call</dt-button>
                  <dt-button size="sm" importance="clear" kind="inverted" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="clear" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--md">Place call</dt-button>
                  <dt-button size="md" importance="clear" kind="inverted" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="clear" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--lg">Place call</dt-button>
                  <dt-button size="lg" importance="clear" kind="inverted" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="clear" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--xl">Place call</dt-button>
                  <dt-button size="xl" importance="clear" kind="inverted" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="clear" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--xs">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="xs" importance="clear" kind="inverted" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="clear" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--sm">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="sm" importance="clear" kind="inverted" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="clear" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--md">
                    <template #icon>
                      <dt-icon name="phone" size="300" />
                    </template>
                  </dt-button>
                  <dt-button size="md" importance="clear" kind="inverted" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="clear" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--lg">
                    <template #icon>
                      <dt-icon name="phone" size="400" />
                    </template>
                  </dt-button>
                  <dt-button size="lg" importance="clear" kind="inverted" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="clear" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--xl">
                    <template #icon>
                      <dt-icon name="phone" size="500" />
                    </template>
                  </dt-button>
                  <dt-button size="xl" importance="clear" kind="inverted" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
          </dt-stack>
        </td>
        <td class="d-br d-bc-default-inverted">
          <dt-stack direction="row" gap="500" class="d-jc-center">
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="outlined" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--xs">Place call</dt-button>
                  <dt-button size="xs" importance="outlined" kind="inverted" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="outlined" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--sm">Place call</dt-button>
                  <dt-button size="sm" importance="outlined" kind="inverted" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="outlined" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--md">Place call</dt-button>
                  <dt-button size="md" importance="outlined" kind="inverted" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="outlined" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--lg">Place call</dt-button>
                  <dt-button size="lg" importance="outlined" kind="inverted" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="outlined" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--xl">Place call</dt-button>
                  <dt-button size="xl" importance="outlined" kind="inverted" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="outlined" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--xs">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="xs" importance="outlined" kind="inverted" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="outlined" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--sm">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="sm" importance="outlined" kind="inverted" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="outlined" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--md">
                    <template #icon>
                      <dt-icon name="phone" size="300" />
                    </template>
                  </dt-button>
                  <dt-button size="md" importance="outlined" kind="inverted" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="outlined" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--lg">
                    <template #icon>
                      <dt-icon name="phone" size="400" />
                    </template>
                  </dt-button>
                  <dt-button size="lg" importance="outlined" kind="inverted" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="outlined" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--xl">
                    <template #icon>
                      <dt-icon name="phone" size="500" />
                    </template>
                  </dt-button>
                  <dt-button size="xl" importance="outlined" kind="inverted" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
          </dt-stack>
        </td>
        <td>
          <dt-stack direction="row" gap="500" class="d-jc-center">
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--xs">Place call</dt-button>
                  <dt-button size="xs" kind="inverted" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--sm">Place call</dt-button>
                  <dt-button size="sm" kind="inverted" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--md">Place call</dt-button>
                  <dt-button size="md" kind="inverted" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--lg">Place call</dt-button>
                  <dt-button size="lg" kind="inverted" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--xl">Place call</dt-button>
                  <dt-button size="xl" kind="inverted" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--xs">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="xs" kind="inverted" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--sm">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="sm" kind="inverted" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--md">
                    <template #icon>
                      <dt-icon name="phone" size="300" />
                    </template>
                  </dt-button>
                  <dt-button size="md" kind="inverted" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--lg">
                    <template #icon>
                      <dt-icon name="phone" size="400" />
                    </template>
                  </dt-button>
                  <dt-button size="lg" kind="inverted" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" kind="inverted" class="d-split-btn__alpha d-split-btn__alpha--xl">
                    <template #icon>
                      <dt-icon name="phone" size="500" />
                    </template>
                  </dt-button>
                  <dt-button size="xl" kind="inverted" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
          </dt-stack>
        </td>
      </tr>
      <tr>
        <th class="d-ta-right d-br d-brw2 d-bc-default" scope="row">
          <span class="d-headline--eyebrow">Muted</span>
        </th>
        <td class="d-br d-bc-default">
          <dt-stack direction="row" gap="500" class="d-jc-center">
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="clear" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--xs">Place call</dt-button>
                  <dt-button size="xs" importance="clear" kind="muted" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="clear" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--sm">Place call</dt-button>
                  <dt-button size="sm" importance="clear" kind="muted" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="clear" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--md">Place call</dt-button>
                  <dt-button size="md" importance="clear" kind="muted" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="clear" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--lg">Place call</dt-button>
                  <dt-button size="lg" importance="clear" kind="muted" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="clear" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--xl">Place call</dt-button>
                  <dt-button size="xl" importance="clear" kind="muted" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="clear" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--xs">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="xs" importance="clear" kind="muted" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="clear" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--sm">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="sm" importance="clear" kind="muted" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="clear" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--md">
                    <template #icon>
                      <dt-icon name="phone" size="300" />
                    </template>
                  </dt-button>
                  <dt-button size="md" importance="clear" kind="muted" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="clear" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--lg">
                    <template #icon>
                      <dt-icon name="phone" size="400" />
                    </template>
                  </dt-button>
                  <dt-button size="lg" importance="clear" kind="muted" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="clear" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--xl">
                    <template #icon>
                      <dt-icon name="phone" size="500" />
                    </template>
                  </dt-button>
                  <dt-button size="xl" importance="clear" kind="muted" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
          </dt-stack>
        </td>
        <td class="d-br d-bc-default">
          <dt-stack direction="row" gap="500" class="d-jc-center">
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="outlined" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--xs">Place call</dt-button>
                  <dt-button size="xs" importance="outlined" kind="muted" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="outlined" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--sm">Place call</dt-button>
                  <dt-button size="sm" importance="outlined" kind="muted" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="outlined" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--md">Place call</dt-button>
                  <dt-button size="md" importance="outlined" kind="muted" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="outlined" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--lg">Place call</dt-button>
                  <dt-button size="lg" importance="outlined" kind="muted" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="outlined" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--xl">Place call</dt-button>
                  <dt-button size="xl" importance="outlined" kind="muted" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
            <dt-stack gap="400">
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xs" importance="outlined" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--xs">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="xs" importance="outlined" kind="muted" class="d-split-btn__omega d-split-btn__omega--xs" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="sm" importance="outlined" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--sm">
                    <template #icon>
                      <dt-icon name="phone" size="200" />
                    </template>
                  </dt-button>
                  <dt-button size="sm" importance="outlined" kind="muted" class="d-split-btn__omega d-split-btn__omega--sm" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="100" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="md" importance="outlined" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--md">
                    <template #icon>
                      <dt-icon name="phone" size="300" />
                    </template>
                  </dt-button>
                  <dt-button size="md" importance="outlined" kind="muted" class="d-split-btn__omega d-split-btn__omega--md" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="lg" importance="outlined" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--lg">
                    <template #icon>
                      <dt-icon name="phone" size="400" />
                    </template>
                  </dt-button>
                  <dt-button size="lg" importance="outlined" kind="muted" class="d-split-btn__omega d-split-btn__omega--lg" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="200" />
                    </template>
                  </dt-button>
                </span>
              </div>
              <div class="d-ta-center">
                <span class="d-split-btn">
                  <dt-button size="xl" importance="outlined" kind="muted" class="d-split-btn__alpha d-split-btn__alpha--xl">
                    <template #icon>
                      <dt-icon name="phone" size="500" />
                    </template>
                  </dt-button>
                  <dt-button size="xl" importance="outlined" kind="muted" class="d-split-btn__omega d-split-btn__omega--xl" aria-label="More options">
                    <template #icon>
                      <dt-icon name="chevron-down" size="300" />
                    </template>
                  </dt-button>
                </span>
              </div>
            </dt-stack>
          </dt-stack>
        </td>
        <td class="d-ta-center">
          <abbr class="d-fc-muted d-td-none d-fs-100" title="Not applicable">N/A</abbr>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="d-p16">
    <dt-stack direction="row" gap="600" class="d-jc-center">
      <dt-toggle size="sm" onclick="const splitButtons = document.querySelectorAll('.d-split-btn'); splitButtons.forEach(splitButton => { const buttons = splitButton.querySelectorAll('.d-btn'); buttons.forEach(button => { if (button.hasAttribute('disabled')) { button.removeAttribute('disabled'); } else { button.setAttribute('disabled', 'true'); } }); });">
        <div class="d-mr6">
          Disable all split buttons
        </div>
      </dt-toggle>
      <dt-button importance="outlined" icon-position="left" onclick="var element=document.querySelector('.asdfasdfqwerqwer');if(element){element.closest('.asdfasdfqwerqwer').setAttribute('hidden','');}">
        Hide grid
        <template #icon>
          <dt-icon
            name="eye"
            size="300"
          />
        </template>
      </dt-button>
    </dt-stack>
  </div>
</div>
