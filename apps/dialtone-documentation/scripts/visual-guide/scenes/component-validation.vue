<template>
  <!-- Validation messages in Next show a leading severity icon and gain a new
       blue `info` variant (DLT-3422/3423). DtValidationMessages renders only
       the highest-priority type in an array, so each type gets its own
       instance. On staging the `info` row falls back unstyled — that IS the
       before state. -->
  <div class="vg-scene" style="width:520px;">
    <p class="vg-heading">
      Validation messages — severity icons + info variant
    </p>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <dt-validation-messages
        id="vg-vm-info"
        :validation-messages="[{ message: 'Informational message', type: 'info' }]"
      />
      <dt-validation-messages
        id="vg-vm-positive"
        :validation-messages="[{ message: 'Positive message', type: 'positive' }]"
      />
      <dt-validation-messages
        id="vg-vm-warning"
        :validation-messages="[{ message: 'Warning message', type: 'warning' }]"
      />
      <dt-validation-messages
        id="vg-vm-critical"
        :validation-messages="[{ message: 'Critical message', type: 'critical' }]"
      />
    </div>
  </div>
</template>
