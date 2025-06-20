---
title: Component status
description: Overview of the components health status
prev: { link: "/components/", text: "Overview" }
next: { link: "/components/avatar/", text: "Avatar" }
no_preview: true
---

<component-health-status-table :components-status="$page.componentsStatus" />

<script setup>
    import ComponentHealthStatusTable from '@baseComponents/ComponentHealthStatusTable.vue';
</script>
