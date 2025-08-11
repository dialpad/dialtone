<!-- eslint-disable max-lines -->
<template>
  <div class="d-d-flex d-jc-space-between d-fw-wrap d-w100p d-cg12 d-fl-col2">
    <dt-popover
      :modal="$attrs.modal"
      :hide-on-click="$attrs.hideOnClick"
      :transition="$attrs.transition"
      width-content="anchor"
      placement="bottom-start"
      initial-focus-element="first"
      class="d-mb128"
      header-class="d-d-flex d-ai-center d-jc-space-between"
      :open="isFirstPopoverOpen"
    >
      <template #anchor="{ attrs }">
        <dt-button  v-bind="attrs"
      @click="isFirstPopoverOpen = !isFirstPopoverOpen"
        >Open First Popover</dt-button>
      </template>

      <template slot="headerContent">
          <!-- Second Popover Content -->
          <div>
          Potential Title
        </div>
        <div>
          <dt-popover
            v-model="openSecondPopover"
            :modal="true"
            placement="right-start"
            :open.sync="openSecondPopover"
          >
           <template #anchor="{ attrs }">
        <dt-button
            circle
            class="d-p6 d-bc-transparent"
            importance="outlined"
            v-bind="attrs"
            @click="openSecondPopover = !openSecondPopover"
          >
            <template slot="icon">
              <dt-icon
                name="close"
                size="300"
              />
            </template>
          </dt-button>
      </template>
            <template #content>
              <div>
                <dt-button
                @click="() => {
                 openSecondPopover = !openSecondPopover;
                 isFirstPopoverOpen = !isFirstPopoverOpen
                 }"
              >
                Close option #1
              </dt-button>
              <br>
              <br>
               <dt-button
               @click="() => {
                 openSecondPopover = !openSecondPopover;
                 isFirstPopoverOpen = !isFirstPopoverOpen
                 }"
              >
                Close option #2
              </dt-button>
              </div>
            </template>
          </dt-popover>
          </div>
      </template>

      <!-- First Popover Content -->
      <template #content>
        <div class="d-stack8">
          <p>
           test text test texttest
          </p>
        </div>
      </template>
    </dt-popover>
  </div>
</template>

<script>
import { DtPopover } from './';
import { DtButton } from '@/components/button';
import { DtDropdown } from '@/components/dropdown';
import { DtListItem } from '@/components/list_item';
import { DtTooltip } from '@/components/tooltip';
import { DtIcon } from '@/components/icon';

export default {
  name: 'PopoverVariantsStory',

  components: {
    DtPopover,
    DtButton,
    DtDropdown,
    DtTooltip,
    DtIcon,
    DtListItem,
  },

  data () {
    return {
    isFirstPopoverOpen: false,
      openSecondPopover: false,
      openPopoverWithTriggerOverride: this.$attrs.open,
      sampleText: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Consequuntur delectus distinctio id iure labore,
            maiores mollitia reprehenderit sunt tempore veritatis.
            Aliquam delectus earum ex, expedita ipsam nobis
            obcaecati quibusdam repudiandae.`,
    };
  },

  methods: {
    onMouseOver () {
      this.openPopoverWithTriggerOverride = true;
    },

    onMouseOut () {
      this.openPopoverWithTriggerOverride = false;
    },

    withURLprefix (query) {
      return window.location.origin + window.location.pathname + query;
    },
  },
};
</script>
