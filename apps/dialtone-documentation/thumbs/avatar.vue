<template>
  <dt-stack gap="200" align="center" direction="row">
    <dt-avatar
      size="500"
      presence="away"
      image-src="/assets/images/person.png"
      image-alt="Avatar user"
      full-name="Daniel Parker"
    />
    <dt-avatar
      size="500"
    >
      <template #icon>
        <dt-icon-user />
      </template>
    </dt-avatar>
    <dt-avatar
      seed="user-unique-id"
      family="11"
      variant="4"
      size="500"
      full-name="Daniel Parker"
    />
  </dt-stack>
</template>
