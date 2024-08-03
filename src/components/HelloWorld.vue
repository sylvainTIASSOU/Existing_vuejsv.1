<template>
  <div class="p-3 mt-4 main-data">
    <div class="analytic-content text-dark">
      <h2>Data Strategy</h2>
    </div>      

    <div id="select-main-div" class="mt-4">
      <div class="row gy-4 gy-md-5">
        <!-- input1-->
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

        <!-- input2-->
        <div class="col-12 col-sm-12 col-md-6 col-lg-4">
          <div>
            <label class="form-label text-dark" for="start-date"
              >Start Date:</label
            >
            <input
              type="date"
              id="start-date"
              v-model="startDate"
              class="form-control"
              placeholder="Start Date"
              aria-label="Start Date"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>

        <!-- input3-->
        <div class="col-12 col-sm-12 col-md-6 col-lg-4">
          <div>
            <label class="form-label text-dark" for="end-date">End Date:</label>
            <input
              type="date"
              id="end-date"
              v-model="endDate"
              class="form-control"
              placeholder="End Date"
              aria-label="end Date"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>

        <!-- input4-->
        <div class="col-12 col-sm-12 col-md-6 col-lg-4">
          <div>
            <label class="form-label text-dark" for="timeframe-select"
              >Timeframe:</label
            >
            <select
              class="form-select"
              id="timeframe-select"
              v-model="selectedTimeframe"
            >
              <option
                v-for="timeframe in timeframes"
                :key="timeframe"
                :value="timeframe"
              >
                {{ timeframe }}
              </option>
            </select>
          </div>
        </div>


        <div class="col-12 col-sm-12 col-md-6 col-lg-4">
          <div>
          <label class="form-label text-dark" for="indicator-select">Indicator:</label>
                <select class="form-select" id="indicator-select" v-model="selectedIndicator">
                  <option value="ma">Moving Average</option>
                </select>
          </div>
        </div>


        <div class="col-12 col-sm-12 col-md-6 col-lg-4">
          <div>
              <label class="form-label text-dark" for="indicator-period">Period:</label>
            <input
              type="number"
              id="indicator-period"
              v-model="indicatorPeriod"
              min="1"
              class="form-control"
              placeholder="Period"
              aria-label="Period"
              aria-describedby="basic-addon1"
            />   
          </div>
        </div>


        <div class="col-12">
          <div class="flex-wrap gap-3 d-block d-md-flex align-items-center">
           <button class="analytic-btn" type="button" @click="changeColors">Show News</button>
          <button class="analytic-btn" type="button" @click="toggleIndicators">Toggle Indicator</button>
          <button class="analytic-btn" type="button" @click="fetchLiveData">Historic Data</button>  
          </div>
         
        </div>      
      </div>
    </div>


     <!-- table Start -->
     <div class="px-3 my-5 strategy-chart">
      <div class="p-3">
        <h3 class="text-dark">Chart Information:</h3>
        
      </div>
    </div>
    <!-- table End -->
  </div>



<div v-if="isLoading" class="text-black">   
    <div class="spinner-inner"></div>
  </div>
  <div class="main-container">


    


    <div class="text-black info-con tainer">
      <h3>Chart Information</h3>
      <p>Symbol: {{ selectedSymbol }}</p>
      <p>Start Date: {{ startDate }}</p>            
      <p>End Date: {{ endDate }}</p>
      <h3>Last Ask: {{ lastAsk }}</h3>
      <h3>Last Bid: {{ lastBid }}</h3>
      <h2>Latest News</h2>
    </div>

   <!-- <div class="rating-cards">
      <div class="my-3 analytic-content text-dark">
        <h2>Latest News</h2>
      </div>
      <div class="row gy-4">
        <div class="col-12 col-sm-12 col-md-6 col-lg-4">
          <div class="main-cards">
            <div class="cards-image-sec">
              <img class="img-fluid" src="../assets/images/client-img.jfif" alt="">
            </div>
            <div class="p-2 my-2 main-card-body text-dark"> 
              <div class="text-center card-titles d-block d-md-flex justify-content-between">
                <h4>Lorem ipsum</h4>
                <div class="time-div">
                  <span class="fw-bold">News Tag</span>
                  <div class="time-div">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" class="bi bi-clock-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                      </svg>
                    </span>
                    <span class="mt-3 text-dark ms-2 fw-bold">2:00pm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-12 col-md-6 col-lg-4">
          <div class="main-cards">
            <div class="cards-image-sec">
              <img class="img-fluid" src="../assets/images/client-img.jfif" alt="">
            </div>
            <div class="p-2 my-2 main-card-body text-dark">
              <div class="text-center card-titles d-block d-md-flex justify-content-between">
                <h4>Lorem ipsum</h4>
                <div class="time-div">
                  <span class="fw-bold">News Tag</span>
                  <div class="time-div">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" class="bi bi-clock-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                      </svg>
                    </span>
                    <span class="mt-3 text-dark ms-2 fw-bold">2:00pm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mx-auto col-12 col-sm-12 col-md-6 col-lg-4">
          <div class="main-cards">
            <div class="cards-image-sec">
              <img class="img-fluid" src="../assets/images/client-img.jfif" alt="">
            </div>
            <div class="p-2 my-2 main-card-body text-dark">
              <div class="text-center card-titles d-block d-md-flex justify-content-between">
                <h4>Lorem ipsum</h4>
                <div class="time-div">
                  <span class="fw-bold">News Tag</span>
                  <div class="time-div">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" class="bi bi-clock-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                      </svg>
                    </span>
                    <span class="mt-3 text-dark ms-2 fw-bold">2:00pm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>-->
  
  </div>
  
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { createChart } from "lightweight-charts";

const symbols = ref([]);
const selectedSymbol = ref("US_500"); // Default symbol is BTCUSD
const timeframes = ref([
  "M1",
  "M5",
  "M15",
  "M30",
  "H1",
  "H4",
  "D1",
  "1W",
  "MN",
]);
const selectedTimeframe = ref(timeframes.value[0]); // Default timeframe is M1

const startDate = ref(
  new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .slice(0, 10)
); // 1 month ago
const endDate = ref(new Date().toISOString().slice(0, 10)); // Today
const m1Data = ref([]);
const data = ref([]);
const lastAsk = ref(0);
const lastBid = ref(0);

const isLoading = ref(false);

let lwChart;
let series;
let maSeries;

const selectedIndicator = ref("ma"); // Default to Moving Average
const indicatorPeriod = ref(14); // Default period for indicators

const fetchAvailableSymbols = async () => {
  try {
    const response = await axios.get("http://localhost:8000/available_symbol");
    symbols.value = response.data;
    if (
      symbols.value.length > 0 &&
      !symbols.value.includes(selectedSymbol.value)
    ) {
      selectedSymbol.value = symbols.value[0];
    }
    fetchLiveData(); // Fetch live data after setting the initial symbol
  } catch (error) {
    console.error("Error fetching symbols:", error);
  }
};

const setupWebSocket = () => {
  const socket = new WebSocket("ws://localhost:8000/ws");

  socket.onopen = () => {
    console.log("WebSocket connection established.");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "bar") {
        processBarData(data);
      } else {
        console.log("Received unknown data type:", data);
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  };
  return socket;
};

const aggregateData = (data, timeframe) => {
  const timeIntervals = {
    M1: 60,
    M5: 300,
    M15: 900,
    M30: 1800,
    H1: 3600,
    H4: 14400,
    D1: 86400,
    "1W": 604800,
    MN: 2592000,
  };

  const interval = timeIntervals[timeframe];
  const aggregatedData = [];
  let current = null;

  data.forEach((item) => {
    if (!current) {
      current = { ...item };
      current.time = Math.floor(current.timestamp / interval) * interval;
    } else {
      current.high = Math.max(current.high, item.high);
      current.low = Math.min(current.low, item.low);
      current.close = item.close;
      current.volume += item.volume;
      if (item.time >= current.time + interval) {
        aggregatedData.push(current);
        current = null;
      }
    }
  });

  if (current) {
    aggregatedData.push(current);
  }

  return aggregatedData;
};

const updateTimeframeData = () => {
  if (selectedTimeframe.value === "M1") {
    data.value = m1Data.value;
  } else {
    data.value = aggregateData(m1Data.value, selectedTimeframe.value);
  }
  updateChart();
};

const fetchHistoricalData = async (symbol, startTime, endTime, timeframe) => {
  try {
    const startTimestamp = new Date(`${startTime}T00:00:00`).getTime() / 1000;
    const endTimestamp = new Date(`${endTime}T23:59:59`).getTime() / 1000;

    const response = await axios.get(
      "http://localhost:8000/fetch_historic_m1_data_from_db_wp",
      {
        params: { symbol, timeframe, start: startTimestamp, end: endTimestamp },
      }
    );

    const formattedData = response.data.map((item) => {
      const time = new Date(item.timestamp);
      if (isNaN(time.getTime())) {
        throw new Error(`Invalid time value: ${item.timestamp}`);
      }
      return {
        ...item,
        time: Math.floor(time.getTime()),
      };
    });

    formattedData.sort((a, b) => a.time - b.time);
    data.value = formattedData;
    m1Data.value = formattedData;
  } catch (error) {
    console.error("Error fetching historical data:", error);
  }
};

const processBarData = (barData) => {
  const time = new Date(barData.time);
  if (isNaN(time.getTime())) {
    console.error(`Invalid time value: ${barData.time}`);
    return;
  }

  const formattedBarData = {
    time: Math.floor(time.getTime() / 1000),
    open: barData.open,
    high: barData.high,
    low: barData.low,
    close: barData.close,
    tick_volume: barData.tick_volume,
  };

  const existingIndex = data.value.findIndex(
    (item) => item.time === formattedBarData.time
  );
  if (existingIndex !== -1) {
    data.value.splice(existingIndex, 1, formattedBarData);
  } else {
    data.value.push(formattedBarData);
  }

  data.value.sort((a, b) => a.time - b.time);

  const maxDataPoints = 1000;
  if (data.value.length > maxDataPoints) {
    data.value.shift();
  }

  updateChart();
};

const computeMovingAverage = (data, period) => {
  let maValues = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      continue;
    }
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    maValues.push({ time: data[i].time, value: sum / period });
  }
  return maValues;
};

const addMAIndicator = (period) => {
  if (!maSeries) {
    maSeries = lwChart.addLineSeries({
      color: "blue",
      lineWidth: 2,
    });
  }

  const maValues = computeMovingAverage(data.value, period);
  maSeries.setData(maValues.filter((item) => item.value !== null));
};
/*const addVolumendicator = (period) => {
  if (!maSeries) {
    vaSeries = lwChart.addHistogramSeires({
      color: '#26a69a',
      priceFomrat: {type: 'volume'},
      priceScale
    });
  }

  const maValues = computeMovingAverage(data.value, period);
  maSeries.setData(maValues.filter(item => item.value !== null));
};*/

const toggleIndicators = () => {
  if (selectedIndicator.value === "ma") {
    const period = indicatorPeriod.value;

    if (!maSeries) {
      addMAIndicator(period);
    } else {
      lwChart.removeSeries(maSeries);
      maSeries = null;
    }
  }
};

const setupChart = () => {
  const chartContainer = document.querySelector(".chart-container");
  if (!lwChart) {
    lwChart = createChart(chartContainer, {
      width: chartContainer.clientWidth,
      height: chartContainer.clientHeight,
    });
    series = lwChart.addCandlestickSeries();
  }
  updateChart();
};

const updateChart = () => {
  if (series) {
    series.setData(data.value);
  }

  if (maSeries) {
    addMAIndicator(indicatorPeriod.value);
  }
};

const fetchLiveData = () => {
  isLoading.value = true; // Show spinner
  data.value = [];
  fetchHistoricalData(
    selectedSymbol.value,
    startDate.value,
    endDate.value,
    selectedTimeframe.value
  )
    .then(() => {
      setupWebSocket();
      setupChart();
    })
    .finally(() => {
      isLoading.value = false; // Hide spinner
    });
};

onMounted(() => {
  fetchAvailableSymbols();
});

watch(selectedTimeframe, updateTimeframeData);
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
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.spinner-inner {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

h3 {
  margin: 0.5em 0;
}
</style>
