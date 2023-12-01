<template>
  <div data-qa="skin-selector">
    <div
      v-show="isOpen"
      class="d-emoji-picker__skin-list"
    >
      <button
        v-for="(skin, index) in skinList"
        :key="skin.name"
        :ref="`skinRef-${index}`"
        :class="{
          'selected': skinSelected?.skinCode === skin.skinCode,
        }"
        @click="selectSkin(skin)"
        @keydown="event => handleKeyDown(event, skin, index)"
      >
        <img
          class="d-icon d-icon--size-500"
          :alt="skin.name"
          :aria-label="skin.name"
          :title="skin.name"
          :src="`${cdnUrl + skin.unicode_output}.png`"
        >
      </button>
    </div>
    <div
      v-show="!isOpen"
      class="d-emoji-picker__skin-selected"
    >
      <dt-tooltip placement="top-end">
        {{ skinSelectorButtonTooltipLabel }}
        <template #anchor>
          <button
            ref="skinSelectorRef"
            :aria-label="skinSelectorButtonTooltipLabel"
            tabindex="-1"
            @click="toggleSkinList"
            @keydown="event => handleKeyDown(event)"
          >
            <img
              class="d-icon d-icon--size-500"
              :alt="skinSelected?.name"
              :aria-label="skinSelected?.name"
              :title="skinSelected?.name"
              :src="`${cdnUrl + skinSelected?.unicode_output}.png`"
            >
          </button>
        </template>
      </dt-tooltip>
    </div>
  </div>
</template>

<script>
import DtTooltip from '@/components/tooltip/tooltip.vue';
import { CDN_URL, EMOJI_PICKER_SKIN_TONE_MODIFIERS } from '@/components/emoji_picker/emoji_picker_constants';

export default {
  name: 'EmojiSkinSelector',

  components: {
    DtTooltip,
  },

  props: {
    skinTone: {
      type: String,
      required: true,
    },

    isHovering: {
      type: Boolean,
      default: false,
    },

    skinSelectorButtonTooltipLabel: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      isOpen: false,
      skinSelected: null,
      skinsRef: [],
      cdnUrl: CDN_URL,
    };
  },

  computed: {
    skinPassedIn () {
      return this.skinList.find(skin => skin.skinTone === this.skinTone);
    },

    skinList () {
      return [
        {
          name: ':wave_tone1:',
          unicode_output: '1f44b-1f3fb',
          skinTone: EMOJI_PICKER_SKIN_TONE_MODIFIERS.LIGHT,
          skinCode: '_tone1',
        },
        {
          name: ':wave_tone2:',
          unicode_output: '1f44b-1f3fc',
          skinTone: EMOJI_PICKER_SKIN_TONE_MODIFIERS.MEDIUM_LIGHT,
          skinCode: '_tone2',
        },
        {
          name: ':wave_tone3:',
          unicode_output: '1f44b-1f3fd',
          skinTone: EMOJI_PICKER_SKIN_TONE_MODIFIERS.MEDIUM,
          skinCode: '_tone3',
        },
        {
          name: ':wave_tone4:',
          unicode_output: '1f44b-1f3fe',
          skinTone: EMOJI_PICKER_SKIN_TONE_MODIFIERS.MEDIUM_DARK,
          skinCode: '_tone4',
        },
        {
          name: ':wave_tone5:',
          unicode_output: '1f44b-1f3ff',
          skinTone: EMOJI_PICKER_SKIN_TONE_MODIFIERS.DARK,
          skinCode: '_tone5',
        },
        {
          name: ':wave:',
          unicode_output: '1f44b',
          skinTone: EMOJI_PICKER_SKIN_TONE_MODIFIERS.DEFAULT,
          skinCode: '',
        },
      ];
    },
  },

  watch: {
    isHovering (newVal) {
      if (newVal) {
        this.isOpen = false;
      }
    },

    skinTone (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.skinSelected = this.skinPassedIn;
      }
    },
  },

  mounted () {
    this.skinSelected = this.skinPassedIn;
    this.$nextTick(() => {
      this.setupSkinRefs();
    });
  },

  methods: {
    setupSkinRefs () {
      this.skinList.forEach((skin, index) => {
        const refKey = `skinRef-${index}`;
        if (this.$refs[refKey]) {
          this.$set(this.skinsRef, index, this.$refs[refKey][0]);
        }
      });
    },

    focusSkinSelector () {
      if (this.$refs.skinSelectorRef) {
        this.$refs.skinSelectorRef.focus();
      }
    },

    selectSkin (skin) {
      this.skinSelected = skin;
      this.isOpen = false;
      this.$emit('skin-tone', skin.skinTone);
      this.$nextTick(() => {
        this.focusSkinSelector();
      });
    },

    handleKeyDown (event, skin, index) {
      event.preventDefault();

      if (event.key === 'ArrowLeft') {
        if (index === 0) this.skinsRef[this.skinsRef.length - 1]?.focus();
        this.skinsRef[index - 1]?.focus();
      }

      if (event.key === 'ArrowRight') {
        if (this.skinsRef.length) this.skinsRef[0]?.focus();
        this.skinsRef[index + 1]?.focus();
      }

      if (event.key === 'Enter') {
        if (skin) { this.selectSkin(skin); } else {
          this.toggleSkinList();
        }
      }

      if (event.key === 'Tab') {
        this.$emit('focus-tabset');
      }
    },

    toggleSkinList () {
      this.isOpen = !this.isOpen;
      this.$nextTick(() => {
        if (this.skinsRef[0]) {
          this.skinsRef[0].focus();
        }
      });
    },
  },
};
</script>
