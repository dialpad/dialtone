<template>
  <dt-empty-state
    :size="200"
    header-text="Nothing to see here"
    body-text="Looks like there is no data to display here."
  >
    <template #icon="{ iconSize }">
      <dt-icon-box :size="iconSize" />
    </template>
    <template #body>
      <dt-stack direction="row" gap="50">
        <dt-button size="200" importance="clear">
          Action
        </dt-button>
        <dt-button size="200">
          Action
        </dt-button>
      </dt-stack>
    </template>
  </dt-empty-state>
</template>
