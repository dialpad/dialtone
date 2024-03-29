<template>
  <div data-qa="skin-selector">
    <div
      v-show="isOpen"
      class="d-emoji-picker__skin-list"
    >
      <button
        v-for="(skin, index) in skinList"
        :ref="el => { if (el) setSkinsRef(el) }"
        :key="skin.name"
        :class="{
          'selected': skinSelected.skinCode === skin.skinCode,
        }"
        @keydown="event => handleKeyDown(event, skin, index)"
        @click="selectSkin(skin)"
      >
        <img
          class="d-icon d-icon--size-500"
          :alt="skin.name"
          :aria-label="skin.name"
          :title="skin.name"
          :src="`${CDN_URL + skin.unicode_output}.png`"
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
              :alt="skinSelected.name"
              :aria-label="skinSelected.name"
              :title="skinSelected.name"
              :src="`${CDN_URL + skinSelected.unicode_output}.png`"
            >
          </button>
        </template>
      </dt-tooltip>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watchEffect } from 'vue';
import { CDN_URL, EMOJI_PICKER_SKIN_TONE_MODIFIERS } from '@/components/emoji_picker';
import { DtTooltip } from '@/components/tooltip';

const props = defineProps({
  /**
   * The skin tone to apply to the emoji list
   * @type {String}
   * @required
   */
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
});

const emits = defineEmits([
  /**
   * The skin tone that was selected
   * @event skin-tone
   * @type {Number}
   */
  'skin-tone',
  'focus-tabset',
  'focus-last-emoji',
]);

const skinList = [
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

const isOpen = ref(false);

const skinSelectorRef = ref(null);

const skinsRef = ref([]);

/**
 * It will close the skin selector if the user is hovering over the emoji list
 */
watchEffect(
  () => props.isHovering && (isOpen.value = false),
);

/**
 * It will initially display props.skinTone. If a new skin tone is selected,
 * it will display that until props.skinTone changes.
 */
const skinPassedIn = computed(() => skinList.find((skin) => skin.skinTone === props.skinTone));
const skinSelected = ref(skinPassedIn.value);
watchEffect(() => skinPassedIn.value && (skinSelected.value = skinPassedIn.value));

function setSkinsRef (ref) {
  skinsRef.value.push(ref);
}
function focusSkinSelector () {
  skinSelectorRef.value.focus();
}

function selectSkin (skin) {
  skinSelected.value = skin;
  isOpen.value = false;
  emits('skin-tone', skin.skinTone);
  nextTick(() => focusSkinSelector());
}

const handleKeyDown = (event, skin, index) => {
  event.preventDefault();

  if (event.key === 'ArrowLeft') {
    if (index === 0) skinsRef.value[skinsRef.value.length - 1]?.focus();
    skinsRef.value[index - 1]?.focus();
  }

  if (event.key === 'ArrowRight') {
    skinsRef.value[index + 1]?.focus();
  }

  if (event.key === 'Enter') {
    if (skin) { selectSkin(skin); } else {
      toggleSkinList();
    }
  }

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      emits('focus-last-emoji');
    } else {
      emits('focus-tabset');
    }
  }
};

function toggleSkinList () {
  isOpen.value = !isOpen.value;
  nextTick(() => skinsRef.value[0].focus());
}

defineExpose({
  focusSkinSelector,
});
</script>
