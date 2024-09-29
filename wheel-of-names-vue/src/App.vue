<template>
  <v-container>
    <spinner-wheel @onwinner="onWinner"></spinner-wheel>

    <v-dialog v-model="dialog" max-width="500">
      <v-card title="Winner">
        <v-card-text>{{ winnerMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close" @click="dialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SpinnerWheel from './components/SpinnerWheel.vue'
import confetti from 'canvas-confetti'

export default defineComponent({
  name: 'App',
  components: {
    'spinner-wheel': SpinnerWheel
  },
  data() {
    return {
      dialog: false,
      winnerMessage: ''
    }
  },
  methods: {
    onWinner(winner) {
      this.winnerMessage = `Winner is ${winner}`
      this.launchConfetti()
      this.dialog = true
    },
    launchConfetti() {
      console.log('launching confetti')
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }
})
</script>

<style scoped></style>
