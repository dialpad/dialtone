<template>
  <!-- DtInput in Next: input text re-set with the new type scale (12px → 14px)
       plus validation icon slots (DLT-3422) and the new info variant
       (DLT-3423). Each input shows one state. -->
  <div class="vg-scene" style="width:480px;">
    <p class="vg-heading">
      Input — text size and validation states
    </p>
    <div style="display:flex;flex-direction:column;gap:20px;">
      <dt-input label="Default" :show-label="true" model-value="hello@dialpad.com" />
      <dt-input
        label="Info"
        :show-label="true"
        model-value="hello@dialpad.com"
        :messages="[{ message: 'Informational note', type: 'info' }]"
        :show-messages="true"
      />
      <dt-input
        label="Warning"
        :show-label="true"
        model-value="hello"
        :messages="[{ message: 'Double-check this value', type: 'warning' }]"
        :show-messages="true"
      />
      <dt-input
        label="Critical"
        :show-label="true"
        model-value=""
        :messages="[{ message: 'This field is required', type: 'critical' }]"
        :show-messages="true"
      />
    </div>
  </div>
</template>
