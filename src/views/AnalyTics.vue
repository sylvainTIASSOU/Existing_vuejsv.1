<template>
    <div class="p-3 mt-4 main-data">
      <div class="analytic-content text-dark">
        <h2>Data Analytics</h2>
        <h4 class="mt-4 text-2xl font-bold" style="color: #21744C;">Select a Range to display the Table</h4>
        <h5 class="text-xl font-bold">Display Historical Data</h5>
      </div>

      <AppChart />
    </div>
  </template>
  
  <script setup>
  import AppChart from '../components/DataWork.vue';
  </script>