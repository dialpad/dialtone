<template>
  <!-- DLT-2959 (select portion): select menu restyled in the same pass as
       input. Closed state with label and description. -->
  <div
    class="vg-scene"
    style="width:480px;"
  >
    <p class="vg-heading">
      Select menu
    </p>
    <!-- Native <option> children work identically on both branches. -->
    <div style="display:flex;flex-direction:column;gap:20px;">
      <dt-select-menu
        label="Caller ID"
        model-value="1"
      >
        <option
          value="1"
          selected
        >
          Main line (+1 555 0100)
        </option>
        <option value="2">
          Support queue
        </option>
        <option value="3">
          Personal number
        </option>
      </dt-select-menu>
      <dt-select-menu
        label="Ring duration"
        description="How long to ring before voicemail."
        model-value="30"
      >
        <option value="15">
          15 seconds
        </option>
        <option
          value="30"
          selected
        >
          30 seconds
        </option>
      </dt-select-menu>
    </div>
  </div>
</template>
