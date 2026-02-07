# Scroller

A scroller component that allows blazing fast scrolling of any amount of data.

- **Status**: beta
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-scroller--default

#### Default Scroller

<br>

```html
<dt-scroller
 :items="items"
 :item-size="32"
 :scroller-height="200"
 :scroller-width="300"
 >
 <template #default="{ item }">
   <div class="user">
     {{ item.name }}
   </div>
 </template>
</dt-scroller>
```

#### Dynamic Scroller

<br>

```html
<dt-scroller
 :items="dynamicItems"
 :min-item-size="54"
 :scroller-height="300"
 :scroller-width="500"
 :dynamic="true"
 >
 <template #default="{ item }">
   <div class="avatar">
     {{ item.id }}
     <img
      :key="item.avatar"
      :src="item.avatar"
      alt="avatar"
      class="image"
     >
  </div>
  <div class="text">
     {{ item.message }}
  </div>
 </template>
</dt-scroller>
```

## Vue API

<!-- Vue API data not found for "scroller" -->
