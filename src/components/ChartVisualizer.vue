<template>
    <div class="main-container">
      <div class="chart-container">
        <LWChart
          :type="chartType"
          :data="data"
          :autosize="true"
          :chart-options="chartOptions"
          :series-options="seriesOptions"
          ref="lwChart"
        />
      </div>
      <div class="info-container">
        <h3>Chart Information</h3>
        <p>Symbol: {{ symbol }}</p>
        <p>Start Date: {{ startDate }}</p>
        <p>End Date: {{ endDate }}</p>
        <h3>Last Ask: {{ lastAsk }}</h3>
        <h3>Last Bid: {{ lastBid }}</h3>
        <h2>Latest News</h2>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import LWChart from './composition-api/LWChart.vue';
  
  const props = defineProps({
    data: Array,
    chartType: String,
    chartOptions: Object,
    seriesOptions: Object,
    symbol: String,
    startDate: String,
    endDate: String,
    lastAsk: Number,
    lastBid: Number
  });
  
  const lwChart = ref();
  
  watch(() => props.data, (newData) => {
    if (lwChart.value) {
      lwChart.value.getChart().updateSeriesData(newData);
    }
  });
  </script>
  
  <style scoped>
  .main-container {
    display: flex;
    gap: 1em;
    height: calc(100% - 5em);
  }
  
  .chart-container {
    flex: 1;
    overflow: auto;
  }
  
  .info-container {
    flex: 0 0 20%;
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1em;
    background-color: #f5f5f5;
    border-radius: 8px;
  }
  </style>
  