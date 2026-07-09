<template>
  <!-- DLT-2949: checkbox and radio visual refresh — new control drawing and
       DtText-based label typography. Same component API on both branches. -->
  <div
    class="vg-scene"
    style="width:560px;"
  >
    <p class="vg-heading">
      Checkbox &amp; radio
    </p>
    <div style="display:flex;gap:56px;">
      <div style="display:flex;flex-direction:column;gap:14px;">
        <dt-checkbox
          value="checked"
          :checked="true"
          description="With a description line."
        >
          Checked
        </dt-checkbox>
        <dt-checkbox value="unchecked">
          Unchecked
        </dt-checkbox>
        <dt-checkbox
          value="disabled"
          :disabled="true"
        >
          Disabled
        </dt-checkbox>
      </div>
      <dt-radio-group
        name="vg-radio-group"
        legend="Radio group"
        model-value="one"
        value="one"
      >
        <dt-radio value="one">
          Selected
        </dt-radio>
        <dt-radio value="two">
          Unselected
        </dt-radio>
        <dt-radio
          value="three"
          :disabled="true"
        >
          Disabled
        </dt-radio>
      </dt-radio-group>
    </div>
  </div>
</template>
