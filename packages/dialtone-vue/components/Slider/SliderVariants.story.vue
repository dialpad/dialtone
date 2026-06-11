<template>
  <div
    id="components-slider--variants-container"
    class="d-d-flex d-fd-column d-g-500 d-p-500"
  >
    <!-- Single thumb -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        Single thumb
      </p>
      <dt-slider
        v-model="singleValue"
        label="Volume"
      />
    </section>

    <!-- Range slider -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        Range slider
      </p>
      <dt-slider
        v-model="rangeValue"
        label="Price range"
      />
    </section>

    <!-- With start / end slots -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        With start and end labels
      </p>
      <dt-slider
        v-model="iconValue"
        label="Brightness"
      >
        <template #start>
          <span>0%</span>
        </template>
        <template #end>
          <span>100%</span>
        </template>
      </dt-slider>
    </section>

    <!-- With emoji start / end slots -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        Emoji start and end labels
      </p>
      <dt-slider
        v-model="emojiValue"
        label="Mood"
      >
        <template #start>
          <span aria-label="sad">😞</span>
        </template>
        <template #end>
          <span aria-label="happy">😄</span>
        </template>
      </dt-slider>
    </section>

    <!-- With ticks -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        With ticks
      </p>
      <dt-slider
        v-model="tickValue"
        label="Rating"
        :min="0"
        :max="10"
        :step="1"
        :tick-interval="1"
        show-ticks
      />
    </section>

    <!-- Start/end slots + marks below (both independent) -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        Start/end slots with marks
      </p>
      <dt-slider
        v-model="labelsWithBoundariesValue"
        label="Temperature"
        :min="-20"
        :max="40"
        :marks="[-20, 40]"
      >
        <template #start>
          <span>❄️</span>
        </template>
        <template #end>
          <span>🔥</span>
        </template>
      </dt-slider>
    </section>

    <!-- Labels at arbitrary positions -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        Marks at arbitrary positions
      </p>
      <dt-slider
        v-model="midpointValue"
        label="Balance"
        :min="-100"
        :max="100"
        :fill-origin="0"
        :marks="[{ value: -100, text: '−100' }, { value: 0, text: '0' }, { value: 100, text: '100' }]"
        show-ticks
        :tick-interval="25"
      />
    </section>

    <!-- Value tooltip -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        Value tooltip
      </p>
      <dt-slider
        v-model="tooltipValue"
        label="Volume"
        show-tooltip
      />
    </section>

    <!-- Inverted -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        Inverted (fill from max end)
      </p>
      <dt-slider
        v-model="invertedValue"
        label="Download limit"
        inverted
      />
    </section>

    <!-- Fill from origin -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        Fill from origin — percentage selector
      </p>
      <dt-slider
        v-model="percentageValue"
        :min="-100"
        :max="100"
        :step="1"
        :fill-origin="0"
        :marks="[{ value: -100, text: '-100%' }, { value: 0, text: '0%' }, { value: 100, text: '100%' }]"
      >
        <template #label>
          Percentage &middot; {{ percentageValue }}%
        </template>
      </dt-slider>
    </section>

    <!-- Disabled single -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        Disabled — single
      </p>
      <dt-slider
        :model-value="30"
        label="Volume (disabled)"
        disabled
      />
    </section>

    <!-- Disabled range -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        Disabled — range
      </p>
      <dt-slider
        :model-value="[20, 80]"
        label="Price range (disabled)"
        disabled
      />
    </section>

    <!-- Vertical -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        Vertical orientation
      </p>
      <div class="d-d-flex d-g-600">
        <dt-slider
          v-model="verticalValue"
          label="Height"
          orientation="vertical"
        />
        <dt-slider
          :model-value="[30, 70]"
          label="Range vertical"
          orientation="vertical"
        />
      </div>
    </section>

    <!-- Use-case examples -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        Use-case examples
      </p>
      <div class="d-d-flex d-fd-column d-g-500">
        <!-- Call duration filter — range mode, formatted time output -->
        <dt-slider
          v-model="durationFilter"
          :min="0"
          :max="120"
          :step="1"
        >
          <template #label>
            Call duration filter &middot; {{ durationFilter[0] }}–{{ durationFilter[1] }} min
          </template>
          <template #start>
            <dt-icon
              name="clock-1"
              size="200"
            />
          </template>
          <template #end>
            <dt-icon
              name="clock-12"
              size="200"
            />
          </template>
        </dt-slider>

        <!-- Chat font size — discrete steps with ticks, formatted "px" output -->
        <dt-slider
          v-model="fontSize"
          :min="12"
          :max="32"
          :step="2"
          show-ticks
          :tick-interval="2"
          :marks="true"
        >
          <template #label>
            Chat text size &middot; {{ fontSize }}px
          </template>
          <template #start>
            <dt-icon
              name="font-size"
              size="100"
            />
          </template>
          <template #end>
            <dt-icon
              name="font-size"
              size="400"
            />
          </template>
        </dt-slider>

        <!-- Noise cancellation — 5 named discrete levels with ticks -->
        <dt-slider
          v-model="noiseCancellation"
          :min="0"
          :max="4"
          :step="1"
          show-ticks
          :tick-interval="1"
          :marks="[{ value: 0, text: 'Off' }, { value: 4, text: 'Max' }]"
        >
          <template #label>
            Noise cancellation &middot; {{ ['Off', 'Low', 'Medium', 'High', 'Max'][noiseCancellation] }}
          </template>
          <template #start>
            <dt-icon
              name="volume-1"
              size="200"
            />
          </template>
          <template #end>
            <dt-icon
              name="volume-x"
              size="200"
            />
          </template>
        </dt-slider>

        <!-- Playback speed — discrete steps, formatted "×" multiplier output -->
        <dt-slider
          v-model="playbackSpeed"
          :min="25"
          :max="200"
          :step="25"
          show-ticks
          :tick-interval="25"
        >
          <template #label>
            Playback speed &middot; {{ (playbackSpeed / 100).toFixed(2) }}×
          </template>
          <template #start>
            🐢
          </template>
          <template #end>
            🐇
          </template>
        </dt-slider>
      </div>
    </section>

    <!-- Label hidden -->
    <section>
      <p class="d-body--sm-compact d-mbe-300 d-fc-tertiary">
        Label hidden (visually, still in DOM)
      </p>
      <dt-slider
        v-model="hiddenLabelValue"
        label="This label is for screen readers only"
        label-hidden
      />
    </section>
  </div>
</template>

<script>
import { ref } from 'vue';
import DtSlider from './Slider.vue';
import { DtIcon } from '@/components/Icon';

export default {
  name: 'SliderVariants',

  components: { DtSlider, DtIcon },

  setup () {
    return {
      singleValue: ref(50),
      rangeValue: ref([20, 70]),
      iconValue: ref(65),
      emojiValue: ref(50),
      tickValue: ref(7),
      labelsWithBoundariesValue: ref(10),
      midpointValue: ref(0),
      tooltipValue: ref(48),
      invertedValue: ref(40),
      panValue: ref(50),
      percentageValue: ref(0),
      verticalValue: ref(60),
      hiddenLabelValue: ref(50),
      // Use-case examples
      durationFilter: ref([5, 45]),
      fontSize: ref(16),
      noiseCancellation: ref(2),
      playbackSpeed: ref(100),
    };
  },
};
</script>
