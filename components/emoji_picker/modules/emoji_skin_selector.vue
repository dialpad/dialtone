<template>
  <div>
    <div
      v-show="isOpen"
      class="d-emoji-picker__skin-list"
    >
      <button
        v-for="skin in skinList"
        :key="skin.name"
        :class="{
          'selected': skinSelected.skinCode === skin.skinCode,
        }"
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
            @click="isOpen = true"
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
import { ref, watchEffect } from 'vue';
import { CDN_URL } from '@/components/emoji_picker/emoji_picker_constants';
import DtTooltip from '@/components/tooltip/tooltip.vue';

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
]);

const skinList = [
  {
    name: ':wave_tone1:',
    unicode_output: '1f44b-1f3fb',
    skinTone: 'Light',
    skinCode: '_tone1',
  },
  {
    name: ':wave_tone2:',
    unicode_output: '1f44b-1f3fc',
    skinTone: 'MediumLight',
    skinCode: '_tone2',
  },
  {
    name: ':wave_tone3:',
    unicode_output: '1f44b-1f3fd',
    skinTone: 'Medium',
    skinCode: '_tone3',
  },
  {
    name: ':wave_tone4:',
    unicode_output: '1f44b-1f3fe',
    skinTone: 'MediumDark',
    skinCode: '_tone4',
  },
  {
    name: ':wave_tone5:',
    unicode_output: '1f44b-1f3ff',
    skinTone: 'Dark',
    skinCode: '_tone5',
  },
  {
    name: ':wave:',
    unicode_output: '1f44b',
    skinTone: 'Default',
    skinCode: '',
  },
];

const skinSelected = ref(skinList.find((skin) => skin.skinTone === props.skinTone));

const isOpen = ref(false);

/**
 * It will close the skin selector if the user is hovering over the emoji list
 */
watchEffect(
  () => props.isHovering && (isOpen.value = false),
);

function selectSkin (skin) {
  skinSelected.value = skin;
  isOpen.value = false;
  emits('skin-tone', skin.skinTone);
}
</script>

<style lang="less" scoped>
.d-emoji-picker{
  &__skin-list{
    display: inline-flex;
    border-radius: 40px;
    background: rgba(0, 0, 0, 0.05);
    flex-direction: row;
    align-items: flex-start;
    padding: 4px;
    gap: 4px;

    button{
      border: none;
      background: none;
      cursor: pointer;
      margin: 0;
      padding: 0;
      outline: none;
      width: 34px;
      height: 34px;

      &:hover{
        background: rgba(0, 0, 0, 0.1);
        border-radius: 28px;
      }

      &.selected{
        border: 1px solid rgba(0, 0, 0, 0.25);
        border-radius: 28px;
      }
    }
  }

  &__skin-selected{
    button{
      border: none;
      background: none;
      cursor: pointer;
      margin: 0;
      outline: none;
      padding: 7px;
      display: inline-block;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 28px;
      width: 42px;
      height: 42px;

      &:hover{
        background: #D2D2D2;
      }
    }
  }
}
</style>
