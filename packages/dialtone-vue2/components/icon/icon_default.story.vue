<template>
  <div style="display: flex; justify-content: space-around">
    <div>
      <h1>New icon component</h1>
      <h3>This icon does not has render issue</h3>
      <button
        @click="hideAccIcon"
      >
        hide first accessibility icon
      </button>
      <br>
      first dt-icon component instance
      <br>
      <dt-icon
        v-show="showAccIcon"
        aria-label="accessibility icon"
        name="calendar"
        size="500"
      />
      <br>
      second dt-icon component instance
      <br>
      <dt-icon
        aria-label="accessibility icon"
        name="calendar"
        size="500"
      />
      <br>
      <hr>
      <h3>This icon has render issue</h3>
      <br>
      <h3>FIXED render issue</h3>
      <button
        @click="hideWspIcon"
      >
        Show/Hide first wsp icon
      </button>

      <button
        @click="updateWspIcon"
      >
        Switch icon
      </button>
      <br>
      first dt-icon component instance
      <br>
      <dt-icon
        v-show="showWspIcon"
        :name="iconName"
        aria-label="whatsapp icon"
        size="500"
      />
      <br>
      <br>
      second dt-icon component instance
      <dt-icon
        :name="iconName"
        aria-label="whatsapp icon"
        size="500"
      />
      <br>
    </div>
    <div>
      <h1>Old icon component</h1>
      <h3>This icon does not has render issue</h3>
      <br>
      first dt-icon component instance
      <br>
      <old-dt-icon
        v-show="showAccIcon"
        name="calendar"
        size="500"
      />
      <br>
      <br>
      second dt-icon component instance
      <br>
      <old-dt-icon
        name="calendar"
        size="500"
      />
      <br>
      <br>
      <hr>
      <h3>This icon has render issue</h3>
      <br>
      <h3>Render issue</h3>
      <span><b>not fixed, will disapear</b></span>
      <br>
      first dt-icon component instance
      <br>
      <old-dt-icon
        v-show="showWspIcon"
        :name="iconName"
        aria-label="whatsapp icon"
        size="500"
      />
      <br>
      <br>
      second dt-icon component instance
      <br>
      <old-dt-icon
        :name="iconName"
        size="500"
      />
    </div>
  </div>
</template>

<script>
import DtIcon from './icon.vue';
import OldDtIcon from './icon_old.vue';

export default {
  name: 'IconDefault',
  components: { DtIcon, OldDtIcon },
  data () {
    return {
      showAccIcon: true,
      showWspIcon: true,
      iconName: 'whatsapp',
    };
  },

  methods: {
    hideAccIcon () {
      this.showAccIcon = !this.showAccIcon;
    },

    hideWspIcon () {
      this.showWspIcon = !this.showWspIcon;
    },

    updateWspIcon () {
      this.iconName = this.iconName === 'whatsapp' ? 'front' : 'whatsapp';
    },
  },
};
</script>
