<template>
  <div
    v-if="chartData && chartData.length"
    style="margin-bottom: 20px; display: flex; align-items: center; overflow: hidden"
  >
    {{ angle }}

    <div
      :class="{ 'spin-container': isSpinning, 'no-spin': !isSpinning }"
      :style="{ transform: 'rotate(' + angle + 'deg)' }"
    >
      <apexchart type="pie" :options="chartOptions" :series="chartData" height="500" />
    </div>
    <svg-icon color="red" :path="mdiArrowLeftBold" size="150" style="margin-left: -75px" />
  </div>

  <div style="margin-top: 20px; display: flex; flex-direction: column; align-items: center">
    <input
      v-model="newName"
      placeholder="Enter a name"
      style="font-size: 20px; padding: 10px; width: 300px; text-align: center"
      @keyup.enter="addName"
    />
    <v-btn
      @click="addName"
      style="
        margin: 10px;
        font-size: 20px;
        padding: 10px 20px;
        background-color: #333;
        color: white;
      "
      >Add</v-btn
    >
    <v-btn
      @click="removeLastData"
      style="
        margin: 10px;
        font-size: 20px;
        padding: 10px 20px;
        background-color: #333;
        color: white;
      "
      >Remove Last</v-btn
    >
    <v-btn
      @click="resetData"
      style="
        margin: 10px;
        font-size: 20px;
        padding: 10px 20px;
        background-color: #333;
        color: white;
      "
      >Reset</v-btn
    >
    <v-btn
      @click="startSpinning"
      style="
        margin: 10px;
        font-size: 20px;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
      "
      >Start Spin</v-btn
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { mdiArrowLeftBold } from '@mdi/js'
import SvgIcon from 'vue3-icon'
import { no } from 'vuetify/locale'

export default defineComponent({
  name: 'SpinnerWheel',
  components: {
    apexchart: VueApexCharts,
    'svg-icon': SvgIcon
  },
  data() {
    return {
      mdiArrowLeftBold: mdiArrowLeftBold,
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
            },
            events: {
              dataPointSelection: (event) => {
                event.stopPropagation()
              }
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
        var itemDegree = normalizedAngle > 90 ? 270 - normalizedAngle : 90 - normalizedAngle
        console.log('itemDegree', itemDegree)

        for (let i = 0; i < itemCount; i++) {
          if (itemDegree >= i * degreeSpan && itemDegree < (i + 1) * degreeSpan) {
            return this.chartOptions.labels[i]
          }
        }
        this.isSpinning = false
      }
    },
    startSpinning() {
      this.isSpinning = true
      this.angle = 0
      this.targetAngle = Math.floor(Math.random() * (10000 - 1500) + 1500)
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
      alert(`The winner is: ${winner}`)
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
      if (!this.chartData) return '32px'
      const itemCount = this.chartData.length
      if (itemCount === 0) return '32px'
      const baseSize = 32
      const sizeReduction = itemCount > 10 ? (itemCount - 10) * 4 : 0
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
