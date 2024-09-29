<script setup lang="ts">
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiArrowLeftBold } from '@mdi/js'
import MenuIcon from 'vue-material-design-icons/Menu.vue'

const apexchart = VueApexCharts

const chartOptions = ref({
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
    text: 'Pie Chart',
    align: 'center',
    style: {
      fontSize: '24px'
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return opts.w.globals.labels[opts.seriesIndex]
    }
  },
  legend: {
    show: false
  }
})

const chartData = ref([])
const newName = ref('')

const addName = () => {
  if (newName.value) {
    chartData.value.push(1)
    chartOptions.value.labels.push(newName.value)
    newName.value = ''
  }
}

const removeLastData = () => {
  if (chartData.value.length > 0) {
    chartData.value.pop()
    chartOptions.value.labels.pop()
  }
}

const path = mdiArrowLeftBold

const resetData = () => {
  chartData.value = []
  chartOptions.value.labels = []
}
</script>

<template>
  <div style="background-color: white; padding: 20px; height: 100vh">
    <h1 style="text-align: center; font-size: 32px">Dynamic Pie Chart</h1>

    <header style="text-align: center; margin-bottom: 20px; position: relative">
      <apexchart
        v-if="chartData && chartData.length"
        type="pie"
        :options="chartOptions"
        :series="chartData"
        height="500"
      />
      <menu-icon />
    </header>

    <div style="text-align: center; margin-top: 20px">
      <input
        v-model="newName"
        placeholder="Enter a name"
        style="font-size: 20px; padding: 10px; width: 300px"
      />
      <v-btn @click="addName" style="font-size: 20px; padding: 10px 20px">Add</v-btn>
      <v-btn @click="removeLastData" style="font-size: 20px; padding: 10px 20px">Remove Last</v-btn>
      <v-btn @click="resetData" style="font-size: 20px; padding: 10px 20px">Reset</v-btn>
    </div>
  </div>
</template>

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
