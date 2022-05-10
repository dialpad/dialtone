<template>
  <dt-combobox
    :show-list="!!value && $attrs.sbShowList"
    list-aria-label="Example list items"
    @escape="onComboboxEscape"
    @highlight="$attrs.onHighlight"
    @select="onComboboxSelect"
    @opened="onOpened"
  >
    <template
      #input="{ inputProps }"
    >
      <dt-input
        v-model="value"
        v-bind="inputProps"
        placeholder="Type to show the items"
      />
    </template>
    <template
      #list="{ listProps }"
    >
      <ol
        v-bind="listProps"
        class="d-p0 d-mt8 d-hmx332 d-of-y-auto"
      >
        <dt-list-item
          v-for="(item, i) in displayItems"
          :key="item.id"
          role="option"
          navigation-type="arrow-keys"
          @click="onComboboxSelect(i)"
        >
          <template #left>
            <dt-avatar
              kind="initials"
              color="purple-500"
            >
              <span aria-hidden="true">{{ i + 1 }}</span>
            </dt-avatar>
          </template>
          {{ item.name }}
        </dt-list-item>
      </ol>
    </template>
  </dt-combobox>
</template>

<script>
import DtAvatar from '../avatar/avatar';
import DtCombobox from './combobox';
import DtInput from '../input/input';
import DtListItem from '../list_item/list_item';

export default {
  name: 'DtComboboxDefault',

  components: {
    DtAvatar,
    DtCombobox,
    DtInput,
    DtListItem,
  },

  data () {
    return {
      value: 'example',
    };
  },

  computed: {
    displayItems () {
      return [
        { name: 'combobox item 1', id: 1 },
        { name: 'combobox item 2', id: 2 },
        { name: 'combobox item 3', id: 3 },
        { name: 'combobox item 4', id: 4 },
        { name: 'combobox item 5', id: 5 },
        { name: 'combobox item 6', id: 6 },
        { name: 'combobox item 7', id: 7 },
        { name: 'combobox item 8', id: 8 },
        { name: 'combobox item 9', id: 9 },
        { name: 'combobox item 10', id: 10 },
        { name: 'combobox item 11', id: 11 },
        { name: 'combobox item 12', id: 12 },
      ];
    },
  },

  methods: {
    onComboboxSelect (i) {
      this.value = '';
      this.$attrs.onSelect(i);
    },

    onComboboxEscape () {
      this.value = '';
      this.$attrs.onEscape();
    },
  },
};
</script>
