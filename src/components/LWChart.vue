<script>
import { createChart } from 'lightweight-charts';
import { nextTick } from 'vue';

// Lightweight Chart instances are stored as normal JS variables
// If you need to use a ref then it is recommended that you use `shallowRef` instead
let series;
let chart;

// Function to get the correct series constructor name for current series type.
function getChartSeriesConstructorName(type) {
    return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
}

// Creates the chart series and sets the data.
const addSeriesAndData = (type, seriesOptions, data) => {
    const seriesConstructor = getChartSeriesConstructorName(type);
    series = chart[seriesConstructor](seriesOptions);
    series.setData(data);
};

// Auto resizes the chart when the browser window is resized.
const resizeHandler = container => {
    if (!chart || !container) return;
    const dimensions = container.getBoundingClientRect();
    chart.resize(dimensions.width, dimensions.height);
};

export default {
    props: {
        type: {
            type: String,
            default: 'line',
        },
        data: {
            type: Array,
            required: true,
        },
        autosize: {
            default: true,
            type: Boolean,
        },
        chartOptions: {
            type: Object,
        },
        seriesOptions: {
            type: Object,
        },
        timeScaleOptions: {
            type: Object,
            default: () => ({
                timeVisible: true,
                secondsVisible: true,
            }),
        },
        priceScaleOptions: {
            type: Object,
            default: () => ({
                id: 'default-price-scale',
                position: 'left',
                mode: 1, // Logarithmic mode
            }),
        },
        areaSeriesOptions: {
            type: Object,
            default: () => ({
                topColor: 'rgba(67, 83, 254, 0.7)',
                bottomColor: 'rgba(67, 83, 254, 0.3)',
                lineColor: 'rgba(67, 83, 254, 1)',
                lineWidth: 2,
            }),
        },
    },
    mounted() {
        // Create the Lightweight Charts Instance using the container ref.
        chart = createChart(this.$refs.chartContainer, this.chartOptions);
        addSeriesAndData(this.type, this.seriesOptions, this.data);
        chart.addAreaSeries({
            topColor: '#2962FF',
            bottomColor: 'rgba(41, 98, 255, 0.28)',
            lineColor: '#2962FF',
            lineWidth: 2,
        });
        chart
            .addLineSeries({
                color: '#2962FF',
                lineWidth: 2,
            })
        chart.addCandlestickSeries({
            priceScaleId: 'left',
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
        });


        if (this.priceScaleOptions) {
            nextTick(() => {
                try {
                    chart.priceScale(this.priceScaleOptions.id).applyOptions(this.priceScaleOptions);
                } catch (error) {
                    console.error('Error applying price scale options:', error);
                }
            });
        }

        if (this.timeScaleOptions) {
            nextTick(() => {
                try {
                    chart.timeScale().applyOptions(this.timeScaleOptions);
                } catch (error) {
                    console.error('Error applying time scale options:', error);
                }
            });
        }

        chart.timeScale().fitContent();

        if (this.autosize) {
            window.addEventListener('resize', () =>
                resizeHandler(this.$refs.chartContainer)
            );
        }
    },
    unmounted() {
        if (chart) {
            chart.remove();
            chart = null;
        }
        if (series) {
            series = null;
        }
        window.removeEventListener('resize', resizeHandler);
    },
    watch: {
        /*autosize(enabled) {
            if (!enabled) {
                window.removeEventListener('resize', () =>
                    resizeHandler(this.$refs.chartContainer)
                );
                return;
            }
            window.addEventListener('resize', () =>
                resizeHandler(this.$refs.chartContainer)
            );
        },*/
        data(newData) {
            if (!series) return;
            series.setData(newData);
        },
        chartOptions(newOptions) {
            if (!chart) return;
            chart.applyOptions(newOptions);
        },
        seriesOptions(newOptions) {
            if (!series) return;
            series.applyOptions(newOptions);
        },
        priceScaleOptions(newOptions) {
            if (!chart) return;
            nextTick(() => {
                try {
                    chart.priceScale(newOptions.id).applyOptions(newOptions);
                } catch (error) {
                    console.error('Error applying price scale options:', error);
                }
            });
        },
        timeScaleOptions(newOptions) {
            if (!chart) return;
            nextTick(() => {
                try {
                    chart.timeScale().applyOptions(newOptions);
                } catch (error) {
                    console.error('Error applying time scale options:', error);
                }
            });
        },
    },
    methods: {
        fitContent() {
            if (!chart) return;
            chart.timeScale().fitContent();
        },
        getChart() {
            return chart;
        },
    },
    expose: ['fitContent', 'getChart'],
};
</script>

<template>
    <div class="lw-chart" ref="chartContainer"></div>
</template>

<style scoped>
.lw-chart {
    height: 100%;
}
</style>