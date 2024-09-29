<template>
  <div style="background-color: white">
    <h1 style="font-size: 32px; text-align: center; color: black">Wheel of Names!</h1>
    <spinner-wheel></spinner-wheel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SpinnerWheel from './components/SpinnerWheel.vue'

export default defineComponent({
  name: 'App',
  components: {
    'spinner-wheel': SpinnerWheel
  },
  data() {
    return {}
  },
  methods: {}
})
</script>

<style scoped></style>
