<template>
  <div id="select-main-div" class="mt-4">
    <!-- inputs-->
    <div class="row gy-4 gy-md-5">
      <!-- input1 -->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <label class="form-label text-dark" for="data-type-select">Data Type:</label>
          <select class="form-select" id="data-type-select" v-model="selectedDataType">
            <option value="tick">Tick Data</option>
            <option value="bar">Bar Data</option>
            <option value="trade">Trade Data</option>
          </select>
        </div>
      </div>

      <!-- input2 -->
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

      <!-- input3 -->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <label class="form-label text-dark" for="start-date">Start Date:</label>
          <input type="date" id="start-date" v-model="startDate" class="form-control" placeholder="Start Date"
            aria-label="Start Date" aria-describedby="basic-addon1" />
        </div>
      </div>

      <!-- input4 -->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <label class="form-label text-dark" for="end-date">End Date:</label>
          <input class="form-control" type="date" id="end-date" v-model="endDate" placeholder="End Date"
            aria-label="End Date" aria-describedby="basic-addon1" />
        </div>
      </div>

      <!-- input6 -->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <label class="form-label text-dark" for="indicator-select">Indicator:</label>
          <select class="form-select" id="indicator-select" v-model="selectedIndicator">
            <option v-for="indicator in indicators" :key="indicator" :value="indicator">
              {{ indicator }}
            </option>
          </select>
        </div>
      </div>

      <!-- input4 -->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <label class="form-label text-dark" v-if="requiresPeriod" for="indicator-period">Period:</label>
          <input class="form-control" v-if="requiresPeriod" type="number" id="indicator-period"
            v-model="indicatorPeriod" placeholder="Period" aria-label="Period" aria-describedby="basic-addon1" />
        </div>
      </div>

      <!-- input5 -->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
        <div>
          <div v-if="selectedDataType === 'bar'">
            <label class="form-label text-dark" for="timeframe-select">Timeframe:</label>
            <select class="form-select" id="timeframe-select" v-model="selectedTimeframe">
              <option v-for="timeframe in timeframes" :key="timeframe" :value="timeframe">
                {{ timeframe }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- button -->
      <div class="col-12">
        <div class="flex-wrap gap-3 d-block d-md-flex align-items-center">
          <button class="analytic-btn" type="button" @click="fetchData">
            Get Data
          </button>
          <button class="analytic-btn" type="button" @click="computeIndicator">
            Add Indicator Data
          </button>
          <button class="analytic-btn" type="button" @click="exportToExcel">
            Export to Excel
          </button>
          <button class="analytic-btn" type="button" @click="displayChart">
            Display Chart
          </button>
        </div>
      </div>


    </div>
  </div>

  <!-- tableau-->
  <div class="p-4 mt-10 border shadow-2xl table-sec rounded-[14px]">
    <div class="main-data">
      <div class="mt-3 table-responsive">
        <HotTable :key="tableKey" :data="paginatedData" :colHeaders="colHeaders" :columns="columns" :filters="true"
          :dropdownMenu="true" :contextMenu="true" :manualColumnResize="true" :manualRowResize="true"
          :licenseKey="'non-commercial-and-evaluation'" :stretchH="'all'" />
        <div class="pagination-controls">
          <button class="p-2 text-black border border-backgroundColorGreen" @click="previousPage"
            :disabled="currentPage === 1">
            Previous
          </button>
          <span class="p-2 text-black border border-backgroundColorGreen">Page {{ currentPage }} of {{ totalPages
            }}</span>
          <button class="p-2 text-black border border-backgroundColorGreen" @click="nextPage"
            :disabled="currentPage === totalPages">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isLoading" class="text-black spinner">
    <div class="spinner-inner"></div>
    <div class="loader"></div>
  </div>

  <div class="mt-10 border shadow-2xl rounded-[14px] table-responsive ">
    <div class="chart-container" style="height: 500px">
      <LWChart ref="chart" :type="chartType" :data="chartData" :chartOptions="chartOptions"
        :seriesOptions="seriesOptions" :priceScaleOptions="priceScaleOptions" :timeScaleOptions="timeScaleOptions"
        :autosize="true" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import * as XLSX from "xlsx";
import { SMA, RSI } from "technicalindicators";
import { HotTable } from "@handsontable/vue3";
import "handsontable/dist/handsontable.full.css";
import { registerAllModules } from "handsontable/registry";
import LWChart from "./LWChart.vue";

registerAllModules();
const tableKey = ref(0);
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
  new Date(new Date().setDate(new Date().getDate() - 3))
    .toISOString()
    .slice(0, 10)
);
const endDate = ref(
  new Date(new Date().setDate(new Date().getDate() - 2))
    .toISOString()
    .slice(0, 10)
); //ref(new Date().toISOString().slice(0, 10));
const indicators = ref([
  "Moving Average",
  "Relative Strength Index (RSI)",
  "Moving Average Convergence Divergence (MACD)",
  "Commodity Channel Index (CCI)",
  "Stochastic Indicator",
  "Super Trend",
  "William %R",
  "Volume",
  "Price Volume Trend (PVT)",
  "Exponential Moving Average (EMA)",
  "Open Interest",
  "McClellan Oscillator",
  "Fibonacci Retracement",
  "On Balance Volume (OBV) Indicator",
  "Aroon Indicator",
  "Bollinger Bands",
]);
const selectedIndicator = ref(indicators.value[0]);
const indicatorPeriod = ref(14);
const selectedDataType = ref("bar");
const showIndicator = ref(false);
const data = ref([]);
const m1Data = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(5000);
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return data.value.slice(start, end);
});
const totalPages = computed(() =>
  Math.ceil(data.value.length / itemsPerPage.value)
);
const requiresPeriod = computed(() =>
  ["Moving Average", "Relative Strength Index (RSI)"].includes(
    selectedIndicator.value
  )
);
const colHeaders = computed(() => {
  let headers = [];
  if (selectedDataType.value === "bar")
    headers.push("Time", "Open", "High", "Low", "Close", "Volume");
  if (selectedDataType.value === "tick")
    headers.push("Time", "Ask", "bid", "volume");
  if (selectedDataType.value === "trade")
    headers.push(
      "Ticket",
      "Type",
      "Entry",
      "Deal Price",
      "PnL",
      "Commission",
      "Swap",
      "Comment"
    );
  if (showIndicator.value)
    headers.push(`${selectedIndicator.value} (${indicatorPeriod.value})`);
  return headers;
});
const columns = computed(() => {
  let cols = [];
  if (selectedDataType.value === "bar") {
    cols.push(
      { data: "time" },
      { data: "open" },
      { data: "high" },
      { data: "low" },
      { data: "close" },
      { data: "volume" }
    );
  }
  if (selectedDataType.value === "tick") {
    cols.push(
      { data: "time" },
      { data: "ask" },
      { data: "bid" },
      { data: "volume" }
    );
  }
  if (selectedDataType.value === "trade") {
    cols.push(
      { data: "ticket" },
      { data: "type" },
      { data: "entry" },
      { data: "deal_price" },
      { data: "pnl" },
      { data: "commission" },
      { data: "swap" },
      { data: "comment" }
    );
  }
  if (showIndicator.value) {
    cols.push({ data: "indicator" });
  }
  return cols;
});
//M1 data transform to higher timeframe
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
      current.time = Math.floor(current.time / interval) * interval;
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
  //forceTableRerender();
};

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
const fetchData = async () => {
  isLoading.value = true;
  console.log("Fetching data:", {
    selectedDataType: selectedDataType.value,
    selectedSymbol: selectedSymbol.value,
    startDate: startDate.value,
    endDate: endDate.value,
    selectedTimeframe: selectedTimeframe.value,
  });
  try {
    data.value = [];
    if (selectedDataType.value === "tick") {
      console.log("Fetching tick data...");
      data.value = await fetchHistoricalTickData(
        selectedSymbol.value,
        startDate.value,
        endDate.value
      );
      console.log("Fetched tick data:", data.value.length);
    } else if (selectedDataType.value === "bar") {
      console.log("Fetching bar data...");
      data.value = await fetchHistoricalData(
        selectedSymbol.value,
        startDate.value,
        endDate.value,
        selectedTimeframe.value
      );
      m1Data.value = data.value;
      console.log("Fetched bar data:", data.value.length);
    } else if (selectedDataType.value === "trade") {
      console.log("Fetching trade data...");
      data.value = await fetchTradeData(
        selectedSymbol.value,
        startDate.value,
        endDate.value
      );
      console.log("Fetched trade data:", data.value.length);
    }
    //console.log('Data after fetch:', data.value);
    showIndicator.value = false;
    isLoading.value = false;
    displayChart();
    forceTableRerender();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const fetchHistoricalData = async (symbol, startTime, endTime, timeframe) => {
  try {
    const startTimestamp = new Date(`${startTime}T00:00:00`).getTime() / 1000;
    const endTimestamp = new Date(`${endTime}T23:59:59`).getTime() / 1000;
    const response = await axios.get(
      "http://86.48.6.174:8000/fetch_historic_m1_data_from_db_wp",
      {
        params: { symbol, start: startTimestamp, end: endTimestamp, timeframe },
      }
    );
    if (response.data && response.data.detail) {
      console.error("API Error:", response.data.detail);
      return [];
    }
    const formattedData = response.data.map((item) => ({
      time: Math.floor(new Date(item.timestamp).getTime()),
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
      volume: parseFloat(item.volume),
    }));
    formattedData.sort((a, b) => a.time - b.time);
    return formattedData;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return [];
  }
};
const fetchHistoricalTickData = async (symbol, startTime, endTime) => {
  console.log("Fetching historical tick data:", { symbol, startTime, endTime });
  const startTimestamp = new Date(`${startTime}T00:00:00`).getTime();
  const endTimestamp = new Date(`${endTime}T23:59:59`).getTime();
  console.log("API request params:", {
    symbol,
    start: startTimestamp,
    end: endTimestamp,
  });
  try {
    const response = await axios.get(
      "http://86.48.6.174:8000/fetch_historic_tick_from_db_wp",
      {
        params: { symbol, start: startTimestamp, end: endTimestamp },
      }
    );
    console.log("API response:", response.data.slice(0, 5)); // Log first 5 items
    const data = response.data
      .map((item) => {
        const time = new Date(item.times_msc);
        if (isNaN(time.getTime())) {
          console.error(`Invalid time value: ${item.times_msc}`);
          return null;
        }
        return {
          time: Math.floor(new Date(item.times_msc).getTime()),
          ask: parseFloat(item.ask),
          bid: parseFloat(item.bid),
          volume: parseInt(item.volume),
        };
      })
      .filter((item) => item !== null && !isNaN(item.ask));
    data.sort((a, b) => a.time - b.time);
    console.log("Processed tick data:", data.slice(0, 5)); // Log first 5 items
    return data;
  } catch (error) {
    console.error("Error fetching historical tick data:", error);
    return [];
  }
};
const fetchTradeData = async () => {
  try {
    const response = await axios.get("http://86.48.6.174:8000/historic_trade");
    const tradeDataObj = response.data;
    const formattedData = Object.entries(tradeDataObj).map(([id, trade]) => ({
      id,
      magic: trade.magic,
      symbol: trade.symbol,
      lots: trade.lots,
      type: trade.type,
      entry: trade.entry,
      deal_time: trade.deal_time,
      deal_price: trade.deal_price,
      pnl: trade.pnl,
      commission: trade.commission,
      swap: trade.swap,
      comment: trade.comment,
    }));
    formattedData.sort((a, b) => a.deal_time - b.deal_time);
    data.value = formattedData;
  } catch (error) {
    console.error("Error fetching trade data:", error);
  }
};
const computeIndicator = () => {
  if (data.value.length === 0 || indicatorPeriod.value <= 0) return;
  switch (selectedIndicator.value) {
    case "Moving Average":
      computeSMA();
      break;
    case "Relative Strength Index (RSI)":
      computeRSI();
      break;
    default:
      console.error("Unsupported indicator:", selectedIndicator.value);
  }
};
const computeSMA = () => {
  const closePrices = data.value.map((item) => item.close);
  const sma = SMA.calculate({
    period: indicatorPeriod.value,
    values: closePrices,
  });
  data.value.forEach((item, index) => {
    item.indicator =
      index >= indicatorPeriod.value - 1
        ? sma[index - indicatorPeriod.value + 1]
        : null;
  });
  showIndicator.value = true;
};
const computeRSI = () => {
  const closePrices = data.value.map((item) => item.close);
  const rsi = RSI.calculate({
    period: indicatorPeriod.value,
    values: closePrices,
  });
  data.value.forEach((item, index) => {
    item.indicator =
      index >= indicatorPeriod.value - 1
        ? rsi[index - indicatorPeriod.value + 1]
        : null;
  });
  showIndicator.value = true;
};
const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(data.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, "data.xlsx");
};

const chartType = computed(() =>
  selectedDataType.value === "tick" ? "line" : "candlestick"
);

const chartData = computed(() => {
  if (selectedDataType.value === "tick") {
    return data.value.map((item) => ({
      time: Math.floor(new Date(item.time).getTime()),
      value: parseFloat(item.ask),
    }));
  } else {
    return data.value.map((item) => ({
      time: Math.floor(new Date(item.time).getTime()),
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
    }));
  }
});

const chartOptions = ref({
  layout: {
    backgroundColor: "#315B2A", // Couleur de fond de la charte
    textColor: "rgba(255, 255, 255, 0.9)", // Couleur du texte
    fontFamily: "Arial, sans-serif" // Police personnalisée
  },
  grid: {
    vertLines: {
      color: "rgba(197, 203, 206, 0.5)",
    },
    horzLines: {
      color: "rgba(197, 203, 206, 0.5)",
    },
  },
  crosshair: {
    mode: 0,
  },
  priceScale: {
    borderColor: "rgba(197, 203, 206, 0.8)",
    scaleMargins: {
      top: 0.3,
      bottom: 0.25,
    },
    tickMarkFormatter: (price) => `$${price.toFixed(2)}`, // Formatteur pour les graduations du prix
  },
  timeScale: {
    borderColor: "rgba(197, 203, 206, 0.8)",
    timeVisible: true,
    secondsVisible: true,
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
    tickMarkFormatter: (time) => {
      const date = new Date(time * 1000); // Assurez-vous que l'échelle de temps est en secondes
      return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    },
  },
  // Configuration des axes
  priceAxis: {
    textColor: 'rgba(255, 255, 255, 0.9)', // Couleur du texte de l'axe des prix
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Couleur de fond de l'axe des prix
  },
  timeAxis: {
    textColor: 'rgba(255, 255, 255, 0.9)', // Couleur du texte de l'axe de temps
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Couleur de fond de l'axe de temps
  },
});

const seriesOptions = computed(() => {
  return selectedDataType.value === "tick"
    ? { color: "#00ff00", lineWidth: 2, topColor: '#2962FF', bottomColor: 'rgba(41, 98, 255, 0.28)' }
    : {
      upColor: "#00ff00",
      downColor: "#ff0000",
      borderDownColor: "rgba(255, 144, 0, 1)",
      borderUpColor: "rgba(255, 144, 0, 1)",
      wickDownColor: "rgba(255, 144, 0, 1)",
      wickUpColor: "rgba(255, 144, 0, 1)",
    };
});
const priceScaleOptions = ref({
  id: 'default-price-scale',
  position: 'left',
  mode: 1,
});
const timeScaleOptions = ref({});

const displayChart = () => {
  console.log("Displaying chart");
  const chartComponent = LWChart.value;
  if (chartComponent) {
    console.log("Chart data:", chartData.value.slice(0, 5)); // Log first 5 items
    chartComponent.reset();
    chartComponent.updateSeries({
      series: chartData.value,
      options: seriesOptions.value,
    });
    chartComponent.fitContent();
  } else {
    console.error("Chart component not found");
  }
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    forceTableRerender();
  }
};
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    forceTableRerender();
  }
};
const forceTableRerender = () => {
  tableKey.value += 1;
};
//watch([selectedDataType, startDate, endDate], () => {
//  fetchData();
//});
watch(data, () => {
  forceTableRerender();
});

watch(selectedTimeframe, updateTimeframeData);

onMounted(() => {
  fetchAvailableSymbols();
  fetchData();
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
  flex-direction: column;
  gap: 1em;
}

.data-table {
  height: 300px;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1em;
}

.main-container {
  width: 100%;
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

.handsontable {
  width: 100% !important;
  height: 500px !important;
  overflow: auto;
}

.chart-container {
  width: 100%;
  height: 500px;
}
</style>
