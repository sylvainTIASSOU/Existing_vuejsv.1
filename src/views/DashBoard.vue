<template>
  <div class="container-fluid">
    <div class="p-3 mt-4 main-data">
      <div class="analytic-content text-dark">
        <h2>Market Static Dashboard</h2>
      </div>

      <AppChart />
    </div>
  </div>
</template>

<script setup>
import AppChart from "../components/DataChart.vue";
</script>
