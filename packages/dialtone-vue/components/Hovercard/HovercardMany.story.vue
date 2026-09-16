<template>
  <ul class="d-mbe-50">
    <li
      v-for="data in cardData"
      :key="data.name"
      class="d-d-flex d-gap-100 d-mbe-100"
    >
      <div>
        <dt-hovercard
          :id="$attrs.id"
          :placement="$attrs.placement"
          :content-class="$attrs.contentClass"
          :fallback-placements="$attrs.fallbackPlacements"
          :padding="$attrs.padding"
          :transition="$attrs.transition"
          :offset="$attrs.offset"
          initial-focus-element="none"
          :header-class="$attrs.headerClass"
          :footer-class="$attrs.footerClass"
          :append-to="$attrs.appendTo"
          :enter-delay="$attrs.enterDelay"
          :leave-delay="$attrs.leaveDelay"
          @opened="$attrs.onOpened"
        >
          <template #anchor="slotProps">
            <dt-avatar
              :full-name="data.name"
              :image-src="data.src"
              :seed="data.name"
              image-alt=""
              avatar-class="d-c-pointer"
              v-bind="slotProps"
            />
          </template>
          <template #content>
            <dt-stack
              direction="column"
              gap="100"
            >
              <dt-stack
                direction="row"
                gap="50"
              >
                <dt-avatar
                  :full-name="data.name"
                  :image-src="data.src"
                  image-alt="Person avatar"
                  seed="JN"
                  :size="300"
                  presence="active"
                />
                <dt-stack
                  direction="column"
                  gap="0"
                >
                  <p class="d-headline--md-compact">
                    {{ data.name }}
                  </p>
                  <p class="d-body--sm d-fc-tertiary">
                    Good Morning! :smile:
                  </p>
                </dt-stack>
              </dt-stack>
              <dt-stack
                direction="column"
                gap="50"
                class="d-fc-secondary"
              >
                <p>
                  Vice President of Sales Enablement Aerolabs
                </p>
                <dt-stack
                  direction="row"
                  gap="50"
                >
                  <dt-icon
                    name="clock-4"
                    size="200"
                  />
                  <p class="d-body--sm">
                    <b>Local Time:</b> 12:32 PM
                  </p>
                </dt-stack>
              </dt-stack>
              <dt-stack
                direction="row"
                gap="100"
              >
                <dt-button
                  width="var(--dt-layout-100-percent)"
                  importance="outlined"
                  kind="muted"
                >
                  Call
                </dt-button>
                <dt-button
                  width="var(--dt-layout-100-percent)"
                  importance="outlined"
                  kind="muted"
                >
                  Message
                </dt-button>
              </dt-stack>
            </dt-stack>
          </template>
        </dt-hovercard>
      </div>
      <dt-stack
        direction="column"
        gap="50"
        class="d-fl-grow1"
      >
        <dt-stack
          direction="row"
          gap="50"
          justify="space-between"
        >
          <p class="d-body--sm-bold">
            {{ data.name }}
          </p>
          <p class="d-body--sm d-fc-tertiary">
            {{ data.time }}
          </p>
        </dt-stack>
        <span
          v-if="data.default"
          v-html="data.default"
        />
        <dt-button
          importance="clear"
          :size="200"
          aria-label="Add reaction"
          data-qa="feed-item-reaction-button"
        >
          <dt-icon
            size="300"
            name="satisfied"
          />
        </dt-button>
      </dt-stack>
    </li>
  </ul>
</template>

<script setup>
import DtHovercard from './Hovercard.vue';
import avatar1 from '@/common/assets/avatar1.png?url';
import avatar2 from '@/common/assets/avatar2.png?url';
import { DtStack } from '@/components/Stack';
import { DtIcon } from '@/components/Icon';
import { DtButton } from '@/components/Button';
import { DtAvatar } from '@/components/Avatar';

const cardData = [{
  name: 'Jaqueline Nackos', src: avatar2, time: '4:54 PM', default: `<p class="d-fs-200 d-lh-400 d-wmx90ch">
  Elementum fames nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis quisque.</p>`,
},
{
  name: 'Joseph Lumaban', src: avatar1, time: '5:05 PM', default: `<p class="d-fs-200 d-lh-400 d-wmx90ch">
  Elementum fames nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis quisque.</p>`,
},
{
  name: 'Purdie Afra', time: '5:16 PM', default: `<p class="d-fs-200 d-lh-400 d-wmx90ch">
  Elementum fames nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis quisque.</p>`,
}];
</script>
