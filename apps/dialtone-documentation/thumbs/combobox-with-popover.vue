<template>
  <dt-combobox-with-popover :open="true" label="Label Text" content-width="anchor" max-height="300px">
    <template #input="{ inputProps, onInput }">
      <dt-input placeholder="Select one or start typing" v-bind="inputProps" @input="onInput" />
    </template>
    <template #list="{ listProps }">
      <ul v-bind="listProps" class="d-p-50">
        <dt-list-item role="option" navigation-type="arrow-keys">
          +1 (555) 000-0001
          <template #right>
            <span class="d-fc-secondary">Mobile</span>
          </template>
        </dt-list-item>
        <dt-list-item role="option" navigation-type="arrow-keys">
          +1 (555) 000-0002
          <template #right>
            <span class="d-fc-secondary">Work</span>
          </template>
        </dt-list-item>
        <dt-list-item role="option" navigation-type="arrow-keys">
          +1 (555) 000-0003
          <template #right>
            <span class="d-fc-secondary">Home</span>
          </template>
        </dt-list-item>
      </ul>
    </template>
  </dt-combobox-with-popover>
</template>
