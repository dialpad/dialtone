<template>
  <div>
    <p>
      Selected date: {{ currentSelectedDate }}
    </p>

    <dt-popover
      :open="datepickerOpened"
      initial-focus-element="#prevYearButton"
      padding="none"
      @opened="(open) => { datepickerOpened = open }"
    >
      <template #anchor>
        <dt-button
          size="sm"
          circle
          importance="clear"
          aria-label="Open datepicker"
          @click="toggleDatepicker"
        >
          <template #icon>
            <dt-icon
              name="calendar"
              size="300"
            />
          </template>
        </dt-button>
      </template>
      <template #content>
        <dt-datepicker
          :selected-date="currentSelectedDate"
          @selected-date="currentSelectedDate = $event; $attrs.onSelectedDate($event)"
          @close-datepicker="$attrs.onCloseDatepicker"
        />
      </template>
    </dt-popover>
  </div>
</template>

<script setup>
import DtDatepicker from './datepicker.vue';
import DtPopover from '@/components/popover/popover.vue';
import DtButton from '@/components/button/button.vue';
import DtIcon from '@/components/icon/icon.vue';
import { ref } from 'vue';

const props = defineProps({
  date: {
    type: Date,
    default: () => (new Date()),
  },

  opened: {
    type: Boolean,
    default: false,
  },
});

const currentSelectedDate = ref(props.date);
const datepickerOpened = ref(props.opened);

function toggleDatepicker () {
  datepickerOpened.value = !datepickerOpened.value;
}
</script>
