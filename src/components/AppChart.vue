<template>
  <div class="controls">
    <div class="controls-row">
      <label for="symbol-select">Symbol:</label>
      <select id="symbol-select" v-model="selectedSymbol">
        <option v-for="symbol in symbols" :key="symbol" :value="symbol">{{ symbol }}</option>
      </select>
      
      <label for="start-date">Start Date:</label>
      <input type="date" id="start-date" v-model="startDate" />
      
      <label for="end-date">End Date:</label>
      <input type="date" id="end-date" v-model="endDate" />
      
      <label for="timeframe-select">Timeframe:</label>
      <select id="timeframe-select" v-model="selectedTimeframe">
        <option v-for="timeframe in timeframes" :key="timeframe" :value="timeframe">{{ timeframe }}</option>
      </select>
    </div>
    <div class="controls-row">
      <button type="button" @click="changeColors">Show News</button>
      <button type="button" @click="changeType">Add Indicator</button>
      <button type="button" @click="fetchLiveData">Historic Data</button>
    </div>
  </div>
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
      <p>Symbol: {{ selectedSymbol }}</p>
      <p>Start Date: {{ startDate }}</p>
      <p>End Date: {{ endDate }}</p>
      <h3>Last Ask: {{ lastAsk }}</h3>
      <h3>Last Bid: {{ lastBid }}</h3>
      <h2>Latest News</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LWChart from './composition-api/LWChart.vue';

const symbols = ref([]);
const selectedSymbol = ref('US_500');  // Default symbol is BTCUSD
const timeframes = ref(['M1', 'M5', 'M15', '1H', '1W']);
const selectedTimeframe = ref(timeframes.value[0]);  // Default timeframe is M1

const startDate = ref(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10));  // 1 month ago
const endDate = ref(new Date().toISOString().slice(0, 10));  // Today

const chartOptions = ref({});
const data = ref([]);
const seriesOptions = ref({
  color: 'rgb(45, 77, 205)',
});
const chartType = ref('candlestick'); // Default to candlestick
const lwChart = ref();
const lastAsk = ref(0);
const lastBid = ref(0);

const fetchAvailableSymbols = async () => {
  try {
    const response = await axios.get('http://localhost:8000/available_symbol');
    symbols.value = response.data;
    if (symbols.value.length > 0 && !symbols.value.includes(selectedSymbol.value)) {
      selectedSymbol.value = symbols.value[0];
    }
    fetchLiveData(); // Fetch live data after setting the initial symbol
  } catch (error) {
    console.error('Error fetching symbols:', error);
  }
};

const setupWebSocket = () => {
  const socket = new WebSocket('ws://localhost:8000/ws');

  socket.onopen = () => {
    console.log('WebSocket connection established.');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'bar') {
        processBarData(data);
      } else {
        console.log('Received unknown data type:', data);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };
  return socket;
};

const fetchHistoricalData = async (symbol, startTime, endTime, timeframe) => {
  try {
    // Convert start and end times to Unix timestamps
    const startTimestamp = new Date(`${startTime}T00:00:00`).getTime() / 1000;
    const endTimestamp = new Date(`${endTime}T23:59:59`).getTime() / 1000;

    const response = await axios.get('http://localhost:8000/historic_data', {
      params: { symbol, timeframe, start: startTimestamp, end: endTimestamp },
    });

    // Ensure the data contains valid date strings
    const formattedData = response.data.map(item => {
      const time = new Date(item.time);
      if (isNaN(time.getTime())) {
        throw new Error(`Invalid time value: ${item.time}`);
      }
      return {
        ...item,
        time: Math.floor(time.getTime() / 1000), // .slice(0, 10), // Convert to 'yyyy-mm-dd' format
      };
    });
    // Sort data by time in ascending order
    formattedData.sort((a, b) => a.time - b.time);
    data.value = formattedData;
  } catch (error) {
    console.error('Error fetching historical data:', error);
  }
};

const processBarData = (barData) => {
  if (barData.type === "bar") {
    const time = new Date(barData.time);
    if (isNaN(time.getTime())) {
      console.error(`Invalid time value: ${barData.time}`);
      return;
    } 

    const formattedBarData = {
      time: Math.floor(time.getTime() / 1000), //.slice(0, 10), //Convert to 'yyyy-mm-dd' format
      open: barData.open,
      high: barData.high,
      low: barData.low,
      close: barData.close,
      tick_volume: barData.tick_volume,
    };
    // Check if the data already contains a bar for this time
    const existingIndex = data.value.findIndex(item => item.time === formattedBarData.time);
    if (existingIndex !== -1) {
      // If a bar for this time already exists, update it instead of adding a new one
      data.value.splice(existingIndex, 1, formattedBarData);
    } else {
      // If no bar for this time exists, add the new bar
      data.value.push(formattedBarData);
    }

    // Sort data by time in ascending order
    data.value.sort((a, b) => a.time - b.time);

    const maxDataPoints = 1000;
    if (data.value.length > maxDataPoints) {
      data.value.shift();
    }

    // Use setData to update the chart data
    if (lwChart.value) {
      lwChart.value.getChart().removeSeries(lwChart.value.series);
      lwChart.value.series = lwChart.value.getChart().addCandlestickSeries();
      lwChart.value.series.setData(data.value);
    }
  }
};

const randomShade = () => Math.round(Math.random() * 255);

const randomColor = (alpha = 1) => {
  return `rgba(${randomShade()}, ${randomShade()}, ${randomShade()}, ${alpha})`;
};

const colorsTypeMap = {
  candlestick: [
    ['upColor', 1],
    ['downColor', 1],
    ['borderUpColor', 1],
    ['borderDownColor', 1],
    ['wickUpColor', 1],
    ['wickDownColor', 1],
  ],
  line: [['color', 1]],
};

const changeColors = () => {
  const options = {};
  const colorsToSet = colorsTypeMap[chartType.value];
  colorsToSet.forEach((c) => {
    options[c[0]] = randomColor(c[1]);
  });
  seriesOptions.value = options;
};

const changeType = () => {
  const types = ['line', 'candlestick'];
  const indexToRemove = types.indexOf(chartType.value);
  if (indexToRemove !== -1) {
    types.splice(indexToRemove, 1);
  }
  const randIndex = Math.floor(Math.random() * types.length);
  chartType.value = types[randIndex];
  //updateChart();
  lwChart.value.fitContent();
};

const subscribeBarData = async () => {
  try {
    // Fetch the historical data first
    await fetchHistoricalData(selectedSymbol.value, startDate.value, endDate.value, selectedTimeframe.value);
    //unsubscribe from previous subscribed bar data
    const response1 = await axios.get(`http://localhost:8000/unsubscribe_bar_data`);
    console.log(response1)
    // Subscribe to live bar data
    const response = await axios.get(`http://localhost:8000/subscribe_bar_data/${selectedSymbol.value}/${selectedTimeframe.value}`);
    console.log(response.data.message);
    setupWebSocket();
  } catch (error) {
    console.error('Error subscribing to bar data:', error);
  }
};

const resetChart = () => {
  if (lwChart.value) {
    // Remove all existing series from the chart
    const chart = lwChart.value.getChart();
    chart.removeSeries(lwChart.value.series);

    // Initialize a new series
    lwChart.value.series = chart.addCandlestickSeries();
  }
};

const fetchLiveData = () => {
  data.value = [];
  resetChart();
  fetchHistoricalData(selectedSymbol.value, startDate.value, endDate.value, selectedTimeframe.value);
  subscribeBarData()
  setupWebSocket();
};

onMounted(() => {
  fetchAvailableSymbols();
});

</script>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  margin-bottom: 1em;
}

.controls-row {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 1em;
}

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
