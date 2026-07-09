<template>
  <!-- DLT-2945: breadcrumbs visual refresh — typography, spacing, and
       separator changes. Same component API on both branches. -->
  <div
    class="vg-scene"
    style="width:560px;"
  >
    <p class="vg-heading">
      Breadcrumbs
    </p>
    <dt-breadcrumbs
      :breadcrumbs="[
        { label: 'Contact center', href: '#' },
        { label: 'Settings', href: '#' },
        { label: 'Business hours', href: '#', selected: true },
      ]"
    />
  </div>
</template>
