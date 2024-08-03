<template>
  <div class="controls">
    <label for="symbol-select">Symbol:</label>
    <select id="symbol-select" v-model="selectedSymbol">
      <option v-for="symbol in symbols" :key="symbol" :value="symbol">{{ symbol }}</option>
    </select>
    <input type="date" v-model="startDate" />
    <button @click="subscribeToTickData">Subscribe</button>
  </div>
  <div class="main-container">
  <div class="column">
    <!-- Existing tick data box -->
    <div class="info-container-tick" :class="tickDataBoxClass">
      <h3>Latest Tick Data</h3>
      <p v-if="lastTickData">
        <span>Symbol:</span> {{ lastTickData.symbol }}<br />
        <span>Bid:</span> {{ lastTickData.bid }}<br />
        <span>Ask:</span> {{ lastTickData.ask }}<br />
        <span>Time:</span> {{ lastTickData.timestamp }}<br />
      </p>
      <p v-else>No new tick data received.</p>
    </div>
    <!-- New account info box -->
    <div class="info-container-account">
      <h3>Account Info</h3>
      <p v-if="accountInfo">
        <span>Name:</span> {{ accountInfo.name }}<br />
        <span>Number:</span> {{ accountInfo.number }}<br />
        <span>Currency:</span> {{ accountInfo.currency }}<br />
        <span>Leverage:</span> {{ accountInfo.leverage }}<br />
        <span>Free Margin:</span> {{ accountInfo.free_margin }}<br />
        <span>Balance:</span> {{ accountInfo.balance }}<br />
        <span>Equity:</span> {{ accountInfo.equity }}<br />
      </p>
      <p v-else>Loading account information...</p>
    </div>
  </div>
  <!-- Existing tick data table and bar data box -->
  <div class="info-container-chart">
    <h3>Tick Data Table</h3>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Bid</th>
            <th>Ask</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tick in tickDataList" :key="tick.timestamp">
            <td>{{ tick.symbol }}</td>
            <td>{{ tick.bid }}</td>
            <td>{{ tick.ask }}</td>
            <td>{{ tick.timestamp }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="column">
    <div class="info-container-bar">
      <h3>Latest Bar Data</h3>
      <p v-if="lastBarData">
        <span>Time:</span> {{ lastBarData.time }}<br />
        <span>Open:</span> {{ lastBarData.open }}<br />
        <span>High:</span> {{ lastBarData.high }}<br />
        <span>Low:</span> {{ lastBarData.low }}<br />
        <span>Close:</span> {{ lastBarData.close }}<br />
        <span>Tick Volume:</span> {{ lastBarData.tick_volume }}<br />
      </p>
      <p v-else>No new bar data received.</p>
    </div>
    <div class="info-container-news">
        <h3>Latest Symbol News</h3>
        <p v-if="SymbolNews">
          <span>Name:</span> {{ accountInfo.name }}<br />
          <span>Number:</span> {{ accountInfo.number }}<br />
          <span>Currency:</span> {{ accountInfo.currency }}<br />
          <span>Leverage:</span> {{ accountInfo.leverage }}<br />
          <span>Free Margin:</span> {{ accountInfo.free_margin }}<br />
          <span>Balance:</span> {{ accountInfo.balance }}<br />
          <span>Equity:</span> {{ accountInfo.equity }}<br />
        </p>
        <p v-else>Loading Available News...</p>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';

const symbols = ref([]);
const lastBarData = ref(null);
const lastTickData = ref(null);
const tickDataList = ref([]);
const accountInfo = ref(null); 
const websocket = ref(null);
const previousAsk = ref(null);
const selectedSymbol = ref('BTCUSD');

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
      } else if (data.type === 'tick') {
        processTickData(data);
      } else {
        console.log('Received unknown data type:', data);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed.', event);
    // Attempt to reconnect after 1 second
    setTimeout(() => {
      websocket.value = setupWebSocket();
    }, 1000);
  };

  return socket;
};

const processBarData = (barData) => {
  console.log('New bar data received:', barData);
  lastBarData.value = {
    ...barData,
    time: barData.time,
  };
};

const fetchAccountInfo = async () => {
  try {
    const response = await axios.get('http://localhost:8000/account_info');
    accountInfo.value = response.data;
  } catch (error) {
    console.error('Error fetching account info:', error);
  }
};

const fetchAvailableSymbols = async () => {
  try {
    const response = await axios.get('http://localhost:8000/available_symbol');
    symbols.value = response.data;
    if (symbols.value.length > 0 && !symbols.value.includes(selectedSymbol.value)) {
      selectedSymbol.value = symbols.value[0];
    }
  } catch (error) {
    console.error('Error fetching symbols:', error);
  }
};

const processTickData = (tickData) => {
  console.log('New tick data received:', tickData);
  const time = new Date(tickData.timestamp);
  const formattedTickData = {
    ...tickData,
    timestamp: time,
  };

  // Update previousAsk before updating lastTickData
  previousAsk.value = lastTickData.value ? lastTickData.value.ask : formattedTickData.ask;

  lastTickData.value = formattedTickData;
  tickDataList.value.unshift(formattedTickData); // Add new tick data to the top of the list
};

const tickDataBoxClass = computed(() => {
  if (!lastTickData.value || previousAsk.value === null) {
    return '';
  }
  return lastTickData.value.ask > previousAsk.value ? 'green-bg' : 'red-bg';
});

const subscribeToTickData = async () => {
  try {
    const response1 = await axios.get(`http://localhost:8000/unsubscribe`);
    console.log(response1)
    const response = await axios.get(`http://localhost:8000/subscribe/${selectedSymbol.value}`)
    console.log(response)
    tickDataList.value = []; // Clear existing chart data
    setupWebSocket();
  } catch (error) {
    console.error('Error subscribing to bar data:', error);
  }
};

// Watch for changes in selectedSymbol and resubscribe if symbol changes
watch(selectedSymbol, (newSymbol, oldSymbol) => {
  if (newSymbol !== oldSymbol) {
    tickDataList.value = []; // Reset tick data list on symbol change
    subscribeToTickData();
  }
});

onMounted(() => {
  fetchAccountInfo();
  fetchAvailableSymbols();
  websocket.value = setupWebSocket();
});
</script>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.controls label {
  font-weight: bold;
}

.main-container {
  display: flex;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  gap: 20px;
}

.column {
  flex: 0 0 20%;
  display: flex;
  flex-direction: column;
}

.info-container-bar,
.info-container-chart,
.info-container-news,
.info-container-account,
.info-container-tick{
  padding: 15px;
  background-color: #d3d0d0;
  border-radius: 8px;
  margin-bottom: 20px;
  transition: background-color 0.5s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.info-container-bar,
.info-container-tick,
.info-container-account {
  flex: 0 0 20%;
  height: 210px; /* Fix the height to maintain size */
}
.info-container-news{
  flex: 0 0 20%;
  height: 250px;
  overflow-y: auto;
}

.info-container-chart {
  flex: 0 0 60%;
}


.table-container {
  max-height: 600px; /* Adjust this value as needed */
  overflow-y: auto;
}

.green-bg {
  background-color: #42f16b; /* Light green */
}

.red-bg {
  background-color: #ef3f4d; /* Light red */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

h3 {
  margin-top: 0;
}

p {
  margin: 0;
  line-height: 1.6;
}

span {
  font-weight: bold;
}
</style>
