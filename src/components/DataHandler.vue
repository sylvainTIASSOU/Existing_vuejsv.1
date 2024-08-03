<template>
  <div class="controls">
    <h2>Display Historical Data</h2>
    <div class="controls-row">
      <label for="data-type-select">Data Type:</label>
      <select id="data-type-select" v-model="selectedDataType">
        <option value="tick">Tick Data</option>
        <option value="bar">Bar Data</option>
        <option value="trade">Trade Data</option>
      </select>

      <label for="symbol-select">Symbol:</label>
      <select id="symbol-select" v-model="selectedSymbol">
        <option v-for="symbol in symbols" :key="symbol" :value="symbol">{{ symbol }}</option>
      </select>

      <label for="start-date">Start Date:</label>
      <input type="date" id="start-date" v-model="startDate" />

      <label for="end-date">End Date:</label>
      <input type="date" id="end-date" v-model="endDate" />

      <div v-if="selectedDataType === 'bar'">
        <label for="timeframe-select">Timeframe:</label>
        <select id="timeframe-select" v-model="selectedTimeframe">
          <option v-for="timeframe in timeframes" :key="timeframe" :value="timeframe">{{ timeframe }}</option>
        </select>
      </div>

      <label for="indicator-select">Indicator:</label>
      <select id="indicator-select" v-model="selectedIndicator">
        <option v-for="indicator in indicators" :key="indicator" :value="indicator">{{ indicator }}</option>
      </select>

      <label v-if="requiresPeriod" for="indicator-period">Period:</label>
      <input v-if="requiresPeriod" type="number" id="indicator-period" v-model="indicatorPeriod" />
    </div>
    <div class="controls-row">
      <button type="button" @click="fetchData">Get Data</button>
      <button type="button" @click="computeIndicator">Add Indicator Data</button>
      <button type="button" @click="exportToExcel">Export to Excel</button>
      <button type="button" @click="displayChart">Display Chart</button>
    </div>
  </div>
  <div class="main-container">
    <HotTable :data="paginatedData" 
              :colHeaders="columnHeaders" 
              :columns="columns"
              :filters="true"
              :dropdownMenu="true"
              :pagination="paginationOptions"
              :width="width"
              :height="height" 
              :settings="settings" licenseKey="non-commercial-and-evaluation"
              />
    <div class="pagination-controls">
      <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script setup>
// ana
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { SMA, RSI } from 'technicalindicators';
import { HotTable } from '@handsontable/vue3';
import 'handsontable/dist/handsontable.full.css';

const symbols = ref([]);
const selectedSymbol = ref('BTCUSD');
const timeframes = ref(['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', '1W', 'MN']);
const selectedTimeframe = ref(timeframes.value[0]);

const startDate = ref(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10));
const endDate = ref(new Date().toISOString().slice(0, 10));
//const startDate = ref(new Date(new Date().setDate(new Date().getDate() - 30)).getTime());
//const endDate = ref(new Date().getTime());

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
  "Bollinger Bands"
]);
const selectedIndicator = ref(indicators.value[0]);
const indicatorPeriod = ref(14);

const selectedDataType = ref('tick');
const showIndicator = ref(false);
const data = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(100000);
const width = ref('100%');
const height = ref(400);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return data.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(data.value.length / itemsPerPage.value));

const requiresPeriod = computed(() => {
  return ['Moving Average', "Relative Strength Index (RSI)"].includes(selectedIndicator.value);
});

const columnHeaders = computed(() => {
  let headers = [];
  if (selectedDataType.value === 'bar') headers.push('timestamp','Open','High', 'Low', 'Close', 'Volume');
  if (selectedDataType.value === 'tick') headers.push('time','Ask', 'Bid','volume');
  if (selectedDataType.value === 'trade') headers.push('Ticket', 'Type', 'Entry', 'Deal Price', 'PnL', 'Commission', 'Swap', 'Comment');
  if (showIndicator.value) headers.push(`${selectedIndicator.value} (${indicatorPeriod.value})`);
  return headers;
});

const columns = computed(() => {
  let cols = [

  ];
  if (selectedDataType.value === 'bar') cols.push({data:'timestamp'},{ data: 'open' },{ data: 'high' },{ data: 'low' },{ data: 'close' },{ data: 'volume' });
  if (selectedDataType.value === 'tick') cols.push({ data: 'ask' }, { data: 'bid' },{ data: 'volume'});
  if (selectedDataType.value === 'trade') cols.push(
    { data: 'ticket' },
    { data: 'type' },
    { data: 'entry' },
    { data: 'deal_price' },
    { data: 'pnl' },
    { data: 'commission' },
    { data: 'swap' },
    { data: 'comment' }
  );
  if (showIndicator.value) cols.push({ data: 'indicator' });
  return cols;
});
const settings = {
  licenseKey: 'non-commercial-and-evaluation',
  //... other options
}
const paginationOptions = {
  itemsPerPage: itemsPerPage.value,
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

const fetchData = async () => {
  try {
    let response;
    if (selectedDataType.value === 'tick') {
      response = await fetchHistoricalTickData(selectedSymbol.value, startDate.value, endDate.value);
    } else if (selectedDataType.value === 'bar') {
      response = await fetchHistoricalData(selectedSymbol.value, startDate.value, endDate.value, selectedTimeframe.value);
    } else if (selectedDataType.value === 'trade') {
      response = await fetchTradeData(selectedSymbol.value, startDate.value, endDate.value);
    }
    data.value = response;
    showIndicator.value = false; // Reset indicator display when new data is fetched
    displayChart(); // Update the chart after fetching new data
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


const fetchHistoricalData = async (symbol, startTime, endTime, timeframe) => {
  try {
    const startTimestamp = new Date(`${startTime}T00:00:00`).getTime()/1000 ;
    const endTimestamp = new Date(`${endTime}T23:59:59`).getTime()/1000 ;

    const response = await axios.get('http://localhost:8000/fetch_historic_m1_data_from_db_wp', {
      params: { symbol, timeframe, start: startTimestamp, end: endTimestamp },
    });

    const formattedData = response.data.map(item => {
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
    showIndicator.value = false;
  } catch (error) {
    console.error('Error fetching historical data:', error);
  }
};

const fetchHistoricalTickData = async (symbol, startTime, endTime) => {
  try {
    const startTimestamp = new Date(`${startTime}T00:00:00`).getTime()/1000;
    const endTimestamp = new Date(`${endTime}T23:59:59}`).getTime()/1000;

    const response = await axios.get('http://localhost:8000/fetch_historic_tick_from_db_wp', {
      params: { symbol, start: startTimestamp, end: endTimestamp },
    });

    const formattedData = response.data.map(item => {
      const time = new Date(item.timestamp);
      if (isNaN(time.getTime())) {
        throw new Error(`Invalid time value: ${item.time}`);
      }
      return {
        ...item,
        time: Math.floor(time.getTime() / 1000),
      };
    });

    data.value = formattedData;
    showIndicator.value = false;
  } catch (error) {
    console.error('Error fetching historical tick data:', error);
  }
};

const fetchTradeData = async () => {
  try {
    const response = await axios.get('http://localhost:8000/historic_trade');

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

    data.value = formattedData;
  } catch (error) {
    console.error('Error fetching trade data:', error);
  }
};

const computeIndicator = () => {
  if (data.value.length === 0 || indicatorPeriod.value <= 0) return;

  switch (selectedIndicator.value) {
    case 'Moving Average':
      computeSMA();
      break;
    case 'Relative Strength Index (RSI)':
      computeRSI();
      break;
    default:
      console.error('Unsupported indicator:', selectedIndicator.value);
  }
};

const computeSMA = () => {
  const closePrices = data.value.map(item => item.close);
  const sma = SMA.calculate({ period: indicatorPeriod.value, values: closePrices });

  data.value.forEach((item, index) => {
    item.indicator = index >= indicatorPeriod.value - 1 ? sma[index - indicatorPeriod.value + 1] : null;
  });

  showIndicator.value = true;
};

const computeRSI = () => {
  const closePrices = data.value.map(item => item.close);
  const rsi = RSI.calculate({ period: indicatorPeriod.value, values: closePrices });

  data.value.forEach((item, index) => {
    item.indicator = index >= indicatorPeriod.value - 1 ? rsi[index - indicatorPeriod.value + 1] : null;
  });

  showIndicator.value = true;
};

const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(data.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, 'data.xlsx');
};

const displayChart = () => {
  // Implementation for displaying chart goes here
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
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
  flex-direction: column;
  gap: 1em;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1em;
}
</style>
