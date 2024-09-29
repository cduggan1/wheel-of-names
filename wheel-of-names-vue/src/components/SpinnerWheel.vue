<template>
  <div
    v-if="chartData && chartData.length"
    style="margin-bottom: 20px; display: flex; align-items: center"
  >
    <apexchart type="pie" :options="chartOptions" :series="chartData" height="500" />
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { mdiArrowLeftBold } from '@mdi/js'
import SvgIcon from 'vue3-icon'

export default defineComponent({
  name: 'SpinnerWheel',
  components: {
    apexchart: VueApexCharts,
    'svg-icon': SvgIcon
  },
  data() {
    return {
      mdiArrowLeftBold: mdiArrowLeftBold,
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
        legend: {
          show: false
        }
      },
      chartData: [],
      newName: ''
    }
  },
  methods: {
    calculateLabelFontSize() {
      if (!this.chartData) return '32px'
      const itemCount = this.chartData.length
      if (itemCount === 0) return '32px'
      const baseSize = 32
      const sizeReduction = itemCount > 10 ? (itemCount - 10) * 4 : 0
      const answer = Math.max(baseSize - sizeReduction, 10) + 'px'
      return answer
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
      this.updateLabelFontSize()
    },
    updateLabelFontSize() {
      const newFontSize = this.calculateLabelFontSize()
      this.chartOptions.dataLabels.style.fontSize = newFontSize
      this.chartOptions = { ...this.chartOptions }
    }
  }
})
</script>

<style scoped>
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
