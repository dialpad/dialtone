<template>
  <div class="dialtone-usage">
    <div class="dialtone-usage__item dialtone-usage__item--do">
      <h3 class="dialtone-usage__hd dialtone-usage__hd--do">
        <dt-icon name="check" size="200" />
        Do
      </h3>
      <div class="dialtone-usage__bd">
        <slot name="do" />
      </div>
    </div>
    <div class="dialtone-usage__item dialtone-usage__item--dont">
      <h3 class="dialtone-usage__hd dialtone-usage__hd--dont">
        <dt-icon name="close" size="200" />
        Don’t
      </h3>
      <div class="dialtone-usage__bd">
        <slot name="dont" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DialtoneUsage',
};
</script>
