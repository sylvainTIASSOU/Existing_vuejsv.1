<template>
  <div id="select-main-div" class="mt-4">
    <div class="row gy-4 gy-md-5">
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <label class="form-label text-dark" for="symbol-select"
            >Symbol:</label
          >
          <select
            class="form-select"
            id="symbol-select"
            v-model="selectedSymbol"
          >
            <option v-for="symbol in symbols" :key="symbol" :value="symbol">
              {{ symbol }}
            </option>
          </select>
        </div>
      </div>

      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <label class="form-label text-dark" for="symbol-select"
            >Date:</label
          >
          <input
            type="date"
            v-model="startDate"
            class="form-control"
            placeholder="Date"
            aria-label="Date"
            aria-describedby="basic-addon1"
          />
        </div>

       
      </div>

      <!-- button -->
       <div class="col-12">
          <div class="flex-wrap gap-3 d-block d-md-flex align-items-center">
            <button class="analytic-btn" @click="subscribeToTickData">
              Subscribe
            </button>
          </div>
        </div>
    </div>

  <!--cards -->
  <div class="p-3 mt-4 main-data">      
    <div class="row gy-4">
      <!-- card 1-->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div class="main-box rounded-[17px] p-[20px]  pink-border">
          <div
            class="text-center d-block d-lg-flex align-items-center justify-content-between"
          >
            <div :class="tickDataBoxClass">
              <h6 class="text-xl font-bold text-center p-color">Latest Tick Data</h6>
              <h1 class="text-dark" v-if="lastTickData">
                <h1> <span class="font-bold text-backgroundColorGreen">Symbol:</span> {{ lastTickData.symbol }}</h1> 
                <h1> <span class="font-bold text-backgroundColorGreen">Bid:</span> {{ lastTickData.bid }}</h1> 
                <h1> <span class="font-bold text-backgroundColorGreen">Ask:</span> {{ lastTickData.ask }}</h1> 
                <h1> <span class="font-bold text-backgroundColorGreen">Time:</span> {{ lastTickData.timestamp }}</h1> 
              </h1>

              <h1 class="text-center text-dark" v-else>
                No new tick data received.
              </h1>
            </div>
            <div>
              <img
                class="img-fluid"
                src="../assets/images/L-shape.png"
                alt=""
              />
            </div>
          </div>
          <div class="flex-wrap gap-2 mt-3 d-flex align-items-center">
            <img
              class="img-fluid"
              src="../assets/images/down-arrow.png"
              alt=""
            />
            <span class="pink-color">4.3%</span>
            <h6 class="mb-0 p-color">Down from yesterday</h6>
          </div>
        </div>
      </div>

      <!-- card 2-->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div class="main-box rounded-[17px] p-[20px] green-border">
          <div
            class="w-auto p-2 text-center d-block d-lg-flex align-items-center justify-content-between"
          >
            <div>
              <h6 class="text-xl font-bold text-center p-color">Latest Symbol News</h6>
              <h1 class="mt-3 text-dark text-start">
                <h1 v-if="newsData"  class="flex flex-col sapce-y-3">
                  
                    <h1><span class="font-bold text-backgroundColorGreen">Time: </span> {{ newsData.timestamp }}</h1> 
                    <h1><span class="font-bold text-backgroundColorGreen">Headline:</span>{{ newsData.headline }}</h1> 
                    <h1><span class="font-bold text-backgroundColorGreen">Source:</span></h1>
                    <a :href="newsData.sources" target="_blank">{{newsData.sources }}</a
                    >
                    <h1><span class="font-bold text-backgroundColorGreen">Actual:</span>{{ newsData.actual }}</h1> 
                    <h1><span class="font-bold text-backgroundColorGreen">Forecast:</span>{{ newsData.forecast }}</h1> 
                    <h1><span class="font-bold text-backgroundColorGreen">Previous:</span>{{ newsData.previous }}</h1> 
                  
                </h1>

                <h1 v-else>Loading available news...</h1>
              </h1>
            </div>
            <div class="hidden xl:flex">
              <img
                class="img-fluid"
                src="../assets/images/green-box.png"
                alt=""
              />
            </div>
          </div>
          <div class="flex-wrap gap-2 mt-3 d-flex align-items-center">
            <img class="img-fluid" src="../assets/images/up-arrow.png" alt="" />
            <span class="green-color">1.3%</span>
            <h6 class="mb-0 p-color">Up from past week</h6>
          </div>
        </div>
      </div>  

      <!-- card 3 -->

      <div class="mx-auto col-12 col-sm-12 col-md-6 col-lg-4">
        <div class="main-box rounded-[17px] p-[20px] blue-border">
          <div
            class="text-center d-block d-lg-flex align-items-center justify-content-between"
          >
            <div>
              <h6 class="text-xl font-bold text-start p-color">Total Accounts</h6>
              <h1 class="text-dark">
                <h1 v-if="accountInfo" class="flex flex-col items-start mt-3 space-y-2">
                  
                  <h1 class="text-lg text-center"> <span class="font-bold text-backgroundColorGreen">Currency:</span>  {{ accountInfo.currency }}</h1> <br />
                  <h1 class="text-lg text-center"> <span class="font-bold text-backgroundColorGreen">Balance:</span>  {{ accountInfo.balance }}</h1> <br />
                  <h1 class="text-lg text-center"> <span class="font-bold text-backgroundColorGreen">Equity:</span>  {{ accountInfo.equity }}</h1> <br />
                </h1>
                <h1 v-else>Loading account information...</h1>
              </h1>
            </div>
            <div class="hidden xl:flex">
              <img
                class="img-fluid"
                src="../assets/images/blue-user.png"
                alt=""
              />
            </div>
          </div>
          <div class="flex-wrap gap-2 mt-3 d-flex align-items-center">
            <img class="img-fluid" src="../assets/images/up-arrow.png" alt="" />
            <span class="green-color">1.3%</span>
            <h6 class="mb-0 p-color">Up from past week</h6>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- chart grphique-->
  <div class="px-3 py-5 my-5 chart-container strategy-chart position-relative">
    <div class="p-3">
      <h3 class="text-darck">Live Tick Data Chart</h3>
      <div id="chart" class=""></div>
    </div>
  </div>  

      
  </div>

  

  <!-- user table-->
  <!-- table Start -->
  <div class="p-3 table-sec">
    <div class="main-data">
      <div class="my-3 analytic-content text-dark">
        <h2>transactions</h2>
      </div>
    </div>
    <div class="mt-3 table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th class="frist-th">symbol</th>
            <th>ticket</th>
            <th>time</th>
            <th>type</th>
            <th>volume</th>
            <th>price</th>
            <th>profit</th>
            <th class="last-th">Status</th>
          </tr>
        </thead>
        <tbody>
        <!--  <tr>
            <td>
             William
            </td>
            <td>william@gmail.com</td>
            <td>12.09.2019 - 12.53 PM</td>
            <td>423</td>
            <td>New York</td>
            <td><button class="header-btn">Active</button></td>
          </tr>-->
        </tbody>
      </table>
    </div>
  </div>
  <!-- table End -->
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { createChart } from "lightweight-charts";

const symbols = ref([]);
const lastTickData = ref(null);
const tickDataList = ref([]);
const accountInfo = ref(null);
const newsData = ref([]);
const websocket = ref(null);
const previousAsk = ref(null);
const selectedSymbol = ref("US_500");
const startDate = ref(
  new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .slice(0, 10)
); // 1 month ago
const endDate = ref(new Date().toISOString().slice(0, 10)); // Today
let chart = null;
let lineSeries = null;

const setupWebSocket = () => {
  const socket = new WebSocket("ws://86.48.6.174:8000/ws");

  socket.onopen = () => {
    console.log("WebSocket connection established.");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "tick" && data.symbol === selectedSymbol.value) {
        processTickData(data);
      } else {
        console.log("Received unknown data type:", data);
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  };

  socket.onclose = (event) => {
    console.log("WebSocket connection closed.", event);
    // Attempt to reconnect after 1 second
    setTimeout(() => {
      websocket.value = setupWebSocket();
    }, 1000);
  };

  return socket;
};
/* acount info function*/
const fetchAccountInfo = async () => {
  try {
    const response = await axios.get("http://86.48.6.174:8000/account_info");
    accountInfo.value = response.data;
  } catch (error) {
    console.error("Error fetching account info:", error);
  }
};

/* symbole det funtion */
const fetchAvailableSymbols = async () => {
  try {
    const response = await axios.get("http://86.48.6.174:8000/available_symbol");
    symbols.value = response.data;
    if (
      symbols.value.length > 0 &&
      !symbols.value.includes(selectedSymbol.value)
    ) {
      selectedSymbol.value = symbols.value[0];
    }
  } catch (error) {
    console.error("Error fetching symbols:", error);
  }
};
/*
function to get ticks
*/
const processTickData = (tickData) => {
  console.log("New tick data received:", tickData);
  const time = new Date(tickData.timestamp);
  const formattedTickData = {
    ...tickData,
    timestamp: time,
  };

  // Update previousAsk to be the ask price from five ticks ago if we have enough data
  if (tickDataList.value.length >= 5) {
    previousAsk.value = tickDataList.value[4].ask;
  } else {
    previousAsk.value = null; // Not enough data to compare
  }

  // Add new tick data to the top of the list
  tickDataList.value.unshift(formattedTickData);

  // Keep only the last five tick data points in the list
  if (tickDataList.value.length > 5) {
    tickDataList.value.pop();
  }

  lastTickData.value = formattedTickData;

  // Update the chart with the new tick data
  if (lineSeries) {
    lineSeries.update({
      time: time.getTime(), // Convert to seconds
      value: formattedTickData.ask, // Use the ask price for the line chart
    });
  }
};
const fetchNewsData = async () => {
  try {
    const response = await axios.get(
      `http://86.48.6.174:8000/fetch_news_data_from_db`,
      {
        params: {
          symbol: selectedSymbol.value,
          start: startDate.value,
          end: endDate.value,
        },
        
      }
    );  
    if(response.data && response.data.length > 0) {
      newsData.value = response.data[0];
    }
     
  } catch (error) {
    console.error("Error fetching news data:", error);
  }
};

const tickDataBoxClass = computed(() => {
  if (!lastTickData.value || previousAsk.value === null) {
    return "";
  }
  return lastTickData.value.ask > previousAsk.value ? "green-bg" : "red-bg";
});

const subscribeToTickData = async () => {
  try {
    const response1 = await axios.get(`http://86.48.6.174:8000/unsubscribe`);
    console.log(response1);
    const response = await axios.get(
      `http://86.48.6.174:8000/subscribe/${selectedSymbol.value}`
    );
    console.log(response);
    tickDataList.value = []; // Clear existing chart data
    setupWebSocket();
  } catch (error) {
    console.error("Error subscribing to tick data:", error);
  }
};

const resetChart = () => {
  if (lineSeries) {
    lineSeries.setData(tickDataList.value);
  }
};

const initializeChart = () => {
  const chartElement = document.getElementById("chart");
  chart = createChart(chartElement, {
    width: chartElement.clientWidth,
    height: 600,
  });
  lineSeries = chart.addLineSeries();
};

// Watch for changes in selectedSymbol and resubscribe if symbol changes
watch(selectedSymbol, (newSymbol, oldSymbol) => {
  if (newSymbol !== oldSymbol) {
    tickDataList.value = []; // Reset tick data list on symbol change
    resetChart();
    subscribeToTickData();
    fetchNewsData(); // Fetch news data for the new symbol
  }
});

// Fetch news data on component mount
onMounted(() => {
  fetchAccountInfo();
  fetchAvailableSymbols();
  initializeChart();
  websocket.value = setupWebSocket();
  fetchNewsData();
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
  margin: 0 auto;
  gap: 20px;
}

.info-container-tick {
  flex: 1 1 25%;
  padding: 15px;
  background-color: #d3d0d0;
  border-radius: 8px;
  transition: background-color 0.5s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 180px;
}

.info-container-news {
  flex: 1 1 50%;
  padding: 15px;
  background-color: #d3d0d0;
  border-radius: 8px;
  transition: background-color 0.5s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 180px;
  overflow-y: auto;
}

.info-container-account {
  flex: 1 1 25%;
  padding: 15px;
  background-color: #d3d0d0;
  border-radius: 8px;
  transition: background-color 0.5s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 180px;
  overflow-y: auto;
}

.chart-container {
  width: 100%;
  height: auto;
}

.info-container-chart {
  flex: 1 1 100%;
}

.news-item {
  margin-bottom: 10px;
  padding: 10px;
  border-left: 5px solid #42f16b; /* Green border for news items */
  background-color: #f9f9f9;
  border-radius: 5px;
}

.green-bg {
  background-color: #02270b; /* Light green */
}

.red-bg {
  background-color: #ef3f4d; /* Light red */
}

@media (min-width: 768px) {
  .info-container-tick,
  .info-container-news,
  .info-container-account {
    height: 180px; /* Ensure consistent height for larger screens */
  }
}
</style>
