/* eslint-disable vue/no-use-v-if-with-v-for */
<template>
  <div id="app">
    <div class="buttons-holder">
      <dt-button
        style="z-index: 99999;"
        @click="start"
      >
        Start
      </dt-button>
      <dt-button
        style="z-index: 99999;"
        @click="end"
      >
        End
      </dt-button>
      <dt-button
        style="z-index: 99999;"
        @click="destroy"
      >
        Destroy
      </dt-button>
      <dt-button
        style="z-index: 99999;"
        @click="mount"
      >
        Mount
      </dt-button>
    </div>

    <dt-popover
      v-for="popover in popovers"
      :open="popover.open"
      :hide-on-click="false"
      modal
      :key="popover.key"
    >
      <template #anchor="{ attrs }">
        <dt-button
          v-bind="attrs"
          @click="popover.open = !popover.open"
        >
          Click to open
        </dt-button>
      </template>
      <template #content>
        <p>I will be displayed in the popover!</p>
      </template>
    </dt-popover>
  </div>
</template>

<script>
import { DtPopover, DtButton } from '@dialpad/dialtone-vue'

export default {
  name: 'App',
  components: {
    DtPopover,
    DtButton,
  },
  data() {
    return {
      popovers: [],
      uniq: [],
      interval: 0,
      counter: 1,
    }
  },

  methods: {
    getKey() {
      this.counter = this.counter + 1
      return this.counter
    },

    start() {
      this.interval = setInterval(() => {
        const shuffled = this.popovers.sort(() => 0.5 - Math.random()).slice(0,10)
        shuffled.forEach( (popover) => {
          popover.key = this.getKey()
        })
      }, 1000)
    },

    end() {
      clearInterval(this.interval)
    },

    destroy() {
      this.popovers = []
    },

    mount() {
      this.uniq = Array.from({ length: 100 }, () => ({
       key: this.getKey(),
       open: true
      }))

      this.popovers = this.popovers.concat(this.uniq)
    }
  }
}
</script>

<style>
@import "~@dialpad/dialtone/lib/dist/css/dialtone.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.buttons-holder {
  display: flex;
  align-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999999;
  width: 100%;
  background: red;
}
</style>
