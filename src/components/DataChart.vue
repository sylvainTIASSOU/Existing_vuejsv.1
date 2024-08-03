<template>
  <div id="select-main-div" class="mt-4">
    <!-- inputs-->
    <div class="row gy-4 gy-md-5">
      <!-- input1 -->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <label class="form-label text-dark" for="symbol-select">Symbol:</label>
          <select class="form-select" id="symbol-select" v-model="selectedSymbol">
            <option v-for="symbol in symbols" :key="symbol" :value="symbol">
              {{ symbol }}
            </option>
          </select>
        </div>
      </div>

      <!-- input2 -->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <label class="form-label text-dark" for="start-date">Start Date:</label>
          <input type="date" id="start-date" v-model="startDate" class="form-control" placeholder="Start Date"
            aria-label="Start Date" aria-describedby="basic-addon1" />
        </div>
      </div>

      <!-- input3 -->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <label class="form-label text-dark" for="end-date">End Date:</label>
          <input type="date" id="end-date" v-model="endDate" class="form-control" placeholder="End Date"
            aria-label="End Date" aria-describedby="basic-addon1" />
        </div>
      </div>

      <!-- input4 -->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <label class="form-label text-dark" for="timeframe-select">Timeframe:</label>
          <select class="form-select" id="timeframe-select" v-model="selectedTimeframe">
            <option v-for="timeframe in timeframes" :key="timeframe" :value="timeframe">
              {{ timeframe }}
            </option>
          </select>
        </div>
      </div>

      <!-- input5 -->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <label class="form-label text-dark" for="indicator-select">Indicator:</label>
          <select class="form-select" id="indicator-select" v-model="selectedIndicator">
            <option value="ma">Moving Average</option>
          </select>
        </div>
      </div>

      <!-- input6 -->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <label class="form-label text-dark" for="indicator-period">Period:</label>
          <input type="number" id="indicator-period" v-model="indicatorPeriod" min="1" class="form-control"
            placeholder="Period" aria-label="Period" aria-describedby="basic-addon1" />
        </div>
      </div>

      <div class="col-12">
        <div class="flex-wrap gap-3 d-block d-md-flex align-items-center">
          <button class="analytic-btn" type="button" @click="changeColors">
            Show News
          </button>
          <button class="analytic-btn" type="button" @click="toggleIndicators">
            Toggle Indicator
          </button>
          <button class="analytic-btn" type="button" @click="fetchLiveData">
            Historic Data
          </button>
          <button class="analytic-btn" type="button" @click="toggleTrendline">
            Toggle Trendline
          </button>
        </div>
      </div>




      <!-- chart-->
      <div class="px-3 py-5 my-5 main-container strategy-chart position-relative">
        <div class="p-3">
          <!-- chart content-->
          <div class="chart-container" style="width: 100%; height: 500px;" ref="chartContainer"></div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="spinner">
      <div class="spinner-inner"></div>
      <div class="loader"></div>
    </div>

    <!-- <div class="main-container">
    
    <div class="info-container">
      <h3>Chart Information</h3>
      <p>Symbol: {{ selectedSymbol }}</p>
      <p>Start Date: {{ startDate }}</p>
      <p>End Date: {{ endDate }}</p>
      <h3>Last Ask: {{ lastAsk }}</h3>
      <h3>Last Bid: {{ lastBid }}</h3>
      <h2>Latest News</h2>
    </div>
  </div>  -->

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { createChart, CrosshairMode } from "lightweight-charts";

const symbols = ref([]);
const selectedSymbol = ref("US_500");
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
const selectedTimeframe = ref(timeframes.value[0]);

const startDate = ref(
  new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .slice(0, 10)
);
const endDate = ref(new Date().toISOString().slice(0, 10));
const m1Data = ref([]);
const data = ref([]);

const isLoading = ref(false);

let lwChart = null;
let series = null;
let maSeries = null;
let lineSeries = null;

const selectedIndicator = ref("ma");
const indicatorPeriod = ref(14);

let startPoint = null;
let isUpdatingLine = false;
let isHovered = false;
let isDragging = false;
let dragStartPoint = null;
let dragStartLineData = null;
let selectedPoint = null;
const hoverThreshold = 0.01;

const fetchAvailableSymbols = async () => {
  try {
    const response = await axios.get(
      "http://86.48.6.174:8000/available_symbol"
    );
    symbols.value = response.data;
    if (
      symbols.value.length > 0 &&
      !symbols.value.includes(selectedSymbol.value)
    ) {
      selectedSymbol.value = symbols.value[0];
    }
    fetchLiveData();
  } catch (error) {
    console.error("Error fetching symbols:", error);
  }
};

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

const subscribeToBarData = async () => {
  try {
    const response1 = await axios.get(
      `http://86.48.6.174:8000/unsubscribe_bar_data`
    );
    console.log(response1);
    const response = await axios.get(
      `http://86.48.6.174:8000/subscribe_bar_data/${selectedSymbol.value}/${selectedTimeframe.value}`
    );
    console.log(response);
    //data.value = []; // Clear existing chart data
    setupWebSocket();
  } catch (error) {
    console.error("Error subscribing to tick data:", error);
  }
};

const fetchHistoricalData = async (symbol, startTime, endTime, timeframe) => {
  try {
    const startTimestamp = new Date(`${startTime}T00:00:00`).getTime() / 1000;
    const endTimestamp = new Date(`${endTime}T23:59:59`).getTime() / 1000;

    const response = await axios.get(
      "http://86.48.6.174:8000/fetch_historic_m1_data_from_db_wp",
      {
        params: { symbol, timeframe, start: startTimestamp, end: endTimestamp },
      }
    );

    const formattedData = response.data.map((item) => ({
      ...item,
      time: Math.floor(new Date(item.timestamp).getTime()),
    }));

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
    maSeries = lwChart.addAreaSeries({
      topColor: '#2962FF',
      bottomColor: 'rgba(41, 98, 255, 0.28)',
      lineColor: '#2962FF',
      lineWidth: 2,
    });
  }

  const maValues = computeMovingAverage(data.value, period);
  maSeries.setData(maValues.filter((item) => item.value !== null));
};

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

const initializeChart = () => {
  const chartContainerElement = chartContainer.value;
  if (!lwChart) {
    lwChart = createChart(chartContainerElement, {
      width: chartContainerElement.clientWidth,
      height: chartContainerElement.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
    });
    series = lwChart.addCandlestickSeries();
    lineSeries = lwChart.addLineSeries();
    lwChart.subscribeClick(handleChartClick);
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

const handleChartClick = (param) => {
  if (isUpdatingLine || isDragging) return;

  const xTs = param.time || param.logical * hoverThreshold;
  const yPrice = series.coordinateToPrice(param.point.y);

  if (isHovered) {
    startDrag(xTs, yPrice);
  } else {
    handleLineDrawing(xTs, yPrice);
  }
};

const handleCrosshairMove = (param) => {
  if (isUpdatingLine) return;

  const xTs = param.time || param.logical * hoverThreshold;
  const yPrice = series.coordinateToPrice(param.point.y);

  if (startPoint) {
    updateLine(xTs, yPrice);
  } else {
    handleHoverEffect(xTs, yPrice);
  }

  if (isDragging) {
    const deltaX = xTs - dragStartPoint.x;
    const deltaY = yPrice - dragStartPoint.y;

    const newLineData = dragStartLineData.map((point, i) =>
      selectedPoint !== null
        ? i === selectedPoint
          ? { time: point.time + deltaX, value: point.value + deltaY }
          : point
        : { time: point.time + deltaX, value: point.value + deltaY }
    );

    dragLine(newLineData);
  }
};

const handleMouseDown = () => {
  if (isHovered) {
    startDrag();
  }
};

const handleMouseUp = () => {
  endDrag();
};

const handleLineDrawing = (xTs, yPrice) => {
  if (!startPoint) {
    startPoint = { time: xTs, price: yPrice };
  } else {
    lineSeries.setData([
      { time: startPoint.time, value: startPoint.price },
      { time: xTs, value: yPrice },
    ]);
    startPoint = null;
    selectedPoint = null;
  }
};

const handleHoverEffect = (xTs, yPrice) => {
  const linedata = lineSeries.data();
  if (!linedata.length) return;

  const hoverStatus = isLineHovered(xTs, yPrice, linedata[0], linedata[1]);
  if (hoverStatus && !isHovered) {
    startHover();
  }

  if (!hoverStatus && isHovered && !isDragging) {
    endHover();
  }
};

const startHover = () => {
  isHovered = true;
  lineSeries.applyOptions({ color: "orange" });
  chartContainer.value.style.cursor = "pointer";
  lwChart.applyOptions({ handleScroll: false, handleScale: false });
};

const endHover = () => {
  isHovered = false;
  lineSeries.applyOptions({ color: "dodgerblue" });
  chartContainer.value.style.cursor = "default";
  lwChart.applyOptions({ handleScroll: true, handleScale: true });
};

const startDrag = (xTs, yPrice) => {
  isDragging = true;
  dragStartPoint = { x: xTs, y: yPrice };
  dragStartLineData = [...lineSeries.data()];
};

const endDrag = () => {
  isDragging = false;
  dragStartPoint = null;
  dragStartLineData = null;
  selectedPoint = null;
};

const updateLine = (xTs, yPrice) => {
  isUpdatingLine = true;
  lineSeries.setData([
    { time: startPoint.time, value: startPoint.price },
    { time: xTs, value: yPrice },
  ]);
  selectedPoint = null;
  isUpdatingLine = false;
};

const dragLine = (newCords) => {
  isUpdatingLine = true;
  lineSeries.setData(newCords);
  isUpdatingLine = false;
};

const isLineHovered = (xTs, yPrice, point1, point2) => {
  if (isDragging) return true;

  const isPoint1 =
    xTs === point1.time &&
    Math.abs(yPrice - point1.value) / yPrice < hoverThreshold;
  if (isPoint1) {
    selectedPoint = 0;
    return true;
  }

  const isPoint2 =
    xTs === point2.time &&
    Math.abs(yPrice - point2.value) / yPrice < hoverThreshold;
  if (isPoint2) {
    selectedPoint = 1;
    return true;
  }

  selectedPoint = null;
  const m = (point2.value - point1.value) / (point2.time - point1.time);
  const c = point1.value - m * point1.time;
  const estimatedY = m * xTs + c;

  return Math.abs(yPrice - estimatedY) / yPrice < hoverThreshold;
};

const toggleTrendline = () => {
  if (lineSeries) {
    lwChart.removeSeries(lineSeries);
    lineSeries = null;
  } else {
    lineSeries = lwChart.addLineSeries();
  }
  lwChart.subscribeCrosshairMove(handleCrosshairMove);
};

const fetchLiveData = () => {
  isLoading.value = true;
  data.value = [];
  fetchHistoricalData(
    selectedSymbol.value,
    startDate.value,
    endDate.value,
    selectedTimeframe.value
  )
    .then(() => {
      subscribeToBarData();
      setupWebSocket();
      initializeChart();
    })
    .finally(() => {
      isLoading.value = false;
    });
};

onMounted(() => {
  fetchAvailableSymbols();
  const chartContainerElement = chartContainer.value;
  chartContainerElement.addEventListener("mousedown", handleMouseDown);
  chartContainerElement.addEventListener("mouseup", handleMouseUp);
});

watch(selectedTimeframe, updateTimeframeData);

const chartContainer = ref(null);
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

.main-cnt {
  @apply flex flex-col space-y-10 p-10 bg-white mt-10 shadow-lg rounded-[25px]
}

.main-container {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 13.1511px;
  background-color: #f9f9f9;
  height: calc(100% - 5em);
}

.chart-container {
  flex: 1;
  width: 100%;
  /* Assurez-vous que le conteneur prend toute la largeur */
  height: 500px;
  /* Définir une hauteur par défaut pour le conteneur */
  overflow: auto;
}

.info-container {

  display: flex;
  flex-direction: column;

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
