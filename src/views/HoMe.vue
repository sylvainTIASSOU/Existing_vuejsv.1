<template>
    <div class="p-3 mt-4 main-data">
      <div class="analytic-content text-dark">
        <h2>Live Data</h2>
      </div>
      <StockChart/>
    </div>
  </template>
  
  <script setup>
  // @ is an alias to /src
  import StockChart from '@/components/LiveChart.vue';
  </script>