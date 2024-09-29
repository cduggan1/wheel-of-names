<template>
  <v-container fill-height>
    <v-card class="mx-auto" prepend-icon="$vuetify" subtitle="Written in Vue.JS">
      <template v-slot:title>
        <span class="font-weight-black">Wheel of Names!</span>
      </template>
      <h6 style="margin-left: 10px; color: red; position: absolute; top: 10px; left: 10px">
        {{ Math.floor(angle) }}
      </h6>
      <v-divider :thickness="2"></v-divider>

      <div
        v-if="!chartData || !chartData.length"
        style="
          margin-bottom: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        "
      ></div>

      <div
        v-if="chartData && chartData.length"
        style="
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        "
      >
        <div
          :class="{ 'spin-container': isSpinning, 'no-spin': !isSpinning }"
          :style="{ transform: 'rotate(' + angle + 'deg)' }"
        >
          <apexchart type="pie" :options="chartOptions" :series="chartData" height="500" />
        </div>
        <svg-icon color="red" :path="mdiArrowLeftBold" size="150" style="margin-left: -75px" />
      </div>
      <v-card-actions>
        <v-text-field
          v-model="newName"
          placeholder="Enter a name"
          hide-details
          variant="outlined"
          :loading="isSpinning"
          :disabled="isSpinning"
          style="max-width: 300px"
          @keyup.enter="addName"
          @click:append-inner="addName"
          color="primary"
        >
        </v-text-field>

        <v-btn
          icon
          color="error"
          @click="addName"
          :disabled="isSpinning"
          style="
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <svg-icon color="green" :path="mdiPlus" />
        </v-btn>
        <v-btn
          icon
          color="error"
          @click="removeLastData"
          :disabled="isSpinning"
          style="
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <svg-icon color="black" :path="mdiMinus" />
        </v-btn>

        <v-btn :disabled="isSpinning" color="success" elevation="2" @click="startSpinning">
          SPIN THE WHEEL!
        </v-btn>

        <h6 style="margin-left: 10px; color: red">{{ isSpinning ? 'Spinning...' : '' }}</h6>
        <v-btn
          :disabled="isSpinning"
          color="danger"
          style="margin:right:10px; color: red;"
          elevation="2"
          @click="startSpinning"
        >
          RESET
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { mdiArrowLeftBold, mdiPlus, mdiMinus, mdiSync } from '@mdi/js'
import SvgIcon from 'vue3-icon'

export default defineComponent({
  name: 'SpinnerWheel',
  components: {
    apexchart: VueApexCharts,
    'svg-icon': SvgIcon
  },
  data() {
    return {
      onWinner: Function,
      mdiArrowLeftBold,
      mdiPlus,
      mdiMinus,
      mdiSync,
      isSpinning: false,
      angle: 0,
      chartOptions: {
        chart: {
          type: 'pie',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150
            },
            dynamicAnimation: {
              enabled: true,
              delay: 150,
              speed: 350
            }
          }
        },
        labels: [],
        title: {
          align: 'center',
          style: {
            fontSize: '24px'
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val, opts) => {
            return opts.w.globals.labels[opts.seriesIndex]
          },
          style: {
            fontSize: '32px',
            colors: ['#000']
          },
          minAngleToShowLabel: 90
        },
        tooltip: {
          enabled: false
        },
        legend: {
          show: false
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: 0
            }
          }
        }
      },
      chartData: [],
      newName: ''
    }
  },
  methods: {
    getPointedItem(angle) {
      if (this.isSpinning) {
        const normalizedAngle = angle % 360
        const itemCount = this.chartData.length

        if (itemCount === 0) {
          console.log('No items in chartData')
          return null
        }

        const degreeSpan = 360 / itemCount
        var itemDegree = normalizedAngle < 90 ? 90 - normalizedAngle : 450 - normalizedAngle

        for (let i = 0; i < itemCount; i++) {
          if (itemDegree >= i * degreeSpan && itemDegree < (i + 1) * degreeSpan) {
            this.isSpinning = false
            return this.chartOptions.labels[i]
          }
        }
      }
    },
    startSpinning() {
      this.isSpinning = true
      this.angle = 0
      this.targetAngle = Math.floor(Math.random() * (10000 - 1500) + 1500)
      //   this.targetAngle = 720
      this.speed = 1
      this.incrementAngle()
    },
    incrementAngle() {
      console.log('targetAngle', this.targetAngle)
      const interval = setInterval(() => {
        if (this.angle < this.targetAngle) {
          this.angle += this.speed

          if (this.angle < this.targetAngle * 0.5) {
            this.speed += 0.1
            if (this.speed > 15) this.speed = 15
          } else {
            this.speed -= 0.1
            if (this.speed < 0) {
              this.speed = 0
              this.computeWinner(this.angle)
              clearInterval(interval)
            }
          }
        } else {
          this.angle = this.targetAngle
          this.computeWinner(this.angle)
          clearInterval(interval)
        }
      }, 1000 / 60)
    },
    computeWinner(angle) {
      const winner = this.getPointedItem(angle)
      this.$emit('onwinner', winner)
    },
    addName() {
      if (this.newName) {
        this.chartData.push(1)
        this.chartOptions.labels.push(this.newName)
        this.newName = ''
        this.updateLabelFontSize()
      }
    },
    removeLastData() {
      if (this.chartData.length > 0) {
        this.chartData.pop()
        this.chartOptions.labels.pop()
        this.updateLabelFontSize()
      }
    },
    resetData() {
      this.chartData = []
      this.chartOptions.labels = []
      this.angle = 0
      this.isSpinning = false
      this.newName = ''
      this.updateLabelFontSize()
    },
    updateLabelFontSize() {
      const newFontSize = this.calculateLabelFontSize()
      this.chartOptions.dataLabels.style.fontSize = newFontSize
      this.chartOptions = { ...this.chartOptions }
    },
    calculateLabelFontSize() {
      if (!this.chartData) return '28px'
      const itemCount = this.chartData.length
      if (itemCount === 0) return '28px'
      const baseSize = 32
      const sizeReduction = itemCount > 5 ? (itemCount - 4) * 2 : 0
      const answer = Math.max(baseSize - sizeReduction, 10) + 'px'
      return answer
    }
  }
})
</script>

<style scoped>
.spin-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-spin {
  animation: none;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
