// utils/dataGenerator.js

/**
 * Generates sample data for the lightweight chart
 * @param  {Boolean} ohlc Whether generated data should include open, high, low, and close values
 * @returns {Array} sample data
 */
export function generateSampleData(ohlc) {
    const randomFactor = 25 + Math.random() * 25;
    function samplePoint(i) {
      return (
        i *
          (0.5 +
            Math.sin(i / 10) * 0.2 +
            Math.sin(i / 20) * 0.4 +
            Math.sin(i / randomFactor) * 0.8 +
            Math.sin(i / 500) * 0.5) +
        200
      );
    }
  
    const res = [];
    let date = new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 0));
    const numberOfPoints = ohlc ? 100 : 500;
    for (let i = 0; i < numberOfPoints; ++i) {
      const time = Math.floor(date.getTime() / 1000);
      const value = samplePoint(i);
      if (ohlc) {
        const randomRanges = [
          -1 * Math.random(),
          Math.random(),
          Math.random(),
        ].map((i) => i * 10);
        const sign = Math.sin(Math.random() - 0.5);
        res.push({
          time,
          low: value + randomRanges[0],
          high: value + randomRanges[1],
          open: value + sign * randomRanges[2],
          close: samplePoint(i + 1),
        });
      } else {
        res.push({
          time,
          value,
        });
      }
  
      date.setUTCDate(date.getUTCDate() + 1);
    }
  
    return res;
  }
  