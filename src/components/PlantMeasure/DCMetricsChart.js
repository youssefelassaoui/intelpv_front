"use client"
import ReactApexChart from "react-apexcharts"
import { useTheme, Skeleton } from "@mui/material"

const DCMetricsChart = ({ powerMeasures = [], loadingMeasures = false }) => {
  const theme = useTheme()

  const processPowerData = (measures) => {
    if (!Array.isArray(measures) || measures.length === 0) {
      console.log("No power measures data or empty array");
      return [];
    }
    
    console.log("Processing power measures data:", measures.slice(0, 3));
    
    const processed = measures.map(item => {
      let timestamp;
      let value;
      
      if (item.datetime) {
        timestamp = new Date(item.datetime).getTime();
      } else if (item.timestamp) {
        timestamp = new Date(item.timestamp).getTime();
      } else if (item.date) {
        timestamp = new Date(item.date).getTime();
      } else if (item.time) {
        timestamp = new Date(item.time).getTime();
      } else if (item.timeStamp) {
        timestamp = new Date(item.timeStamp).getTime();
      } else {
        console.warn("No timestamp found in item:", item);
        return null;
      }
      
      if (item.measure !== undefined && item.measure !== null) {
        value = Number(item.measure);
      } else if (item.value !== undefined && item.value !== null) {
        value = Number(item.value);
      } else if (item.measureValue !== undefined && item.measureValue !== null) {
        value = Number(item.measureValue);
      } else if (item.data !== undefined && item.data !== null) {
        value = Number(item.data);
      } else {
        console.warn("No value found in item:", item);
        return null;
      }
      
      return {
        x: timestamp,
        y: isNaN(value) ? 0 : value
      };
    }).filter(item => item !== null).sort((a, b) => a.x - b.x);
    
    console.log("Processed power data sample:", processed.slice(0, 3));
    
    const aggregated = aggregateBy10Minutes(processed);
    console.log("Aggregated power data sample:", aggregated.slice(0, 3));
    
    return aggregated;
  };

  const aggregateBy10Minutes = (data) => {
    if (data.length === 0) return [];
    
    const aggregated = [];
    const intervalMs = 10 * 60 * 1000;
    
    let currentInterval = null;
    let intervalValues = [];
    
    data.forEach(point => {
      const intervalStart = Math.floor(point.x / intervalMs) * intervalMs;
      
      if (currentInterval === null || currentInterval !== intervalStart) {
        if (currentInterval !== null && intervalValues.length > 0) {
          const avgValue = intervalValues.reduce((sum, v) => sum + v, 0) / intervalValues.length;
          aggregated.push({
            x: currentInterval,
            y: avgValue
          });
        }
        currentInterval = intervalStart;
        intervalValues = [point.y];
      } else {
        intervalValues.push(point.y);
      }
    });
    
    if (currentInterval !== null && intervalValues.length > 0) {
      const avgValue = intervalValues.reduce((sum, v) => sum + v, 0) / intervalValues.length;
      aggregated.push({
        x: currentInterval,
        y: avgValue
      });
    }
    
    return aggregated;
  };

  const powerData = processPowerData(powerMeasures)

  const chartOptions = {
    chart: {
      type: "area",
      height: 220,
      toolbar: { show: false },
      fontFamily: "Poppins, sans-serif",
      animations: {
        enabled: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          fontSize: "11px",
          fontFamily: "Poppins, sans-serif",
          colors: theme.palette.text.secondary,
        },
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd/MM",
          hour: "HH:mm",
        },
        format: "dd/MM HH:mm",
      },
      axisBorder: {
        show: true,
        color: theme.palette.divider,
        height: 1,
        width: "100%",
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: "solid",
        color: theme.palette.divider,
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      title: {
        text: "Power (kW)",
        style: {
          fontSize: "12px",
          fontFamily: "Poppins, sans-serif",
          color: theme.palette.text.primary,
        },
      },
      min: 0,
      labels: {
        formatter: (value) => value.toFixed(2),
        style: {
          fontSize: "11px",
          fontFamily: "Poppins, sans-serif",
          colors: theme.palette.text.secondary,
        },
      },
      axisBorder: {
        show: true,
        color: theme.palette.divider,
        width: 1,
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: "solid",
        color: theme.palette.divider,
        width: 6,
        offsetX: 0,
        offsetY: 0,
      },
    },
    grid: {
      show: true,
      borderColor: theme.palette.divider,
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 0,
      },
    },
    tooltip: {
      shared: true,
      theme: theme.palette.mode,
      x: {
        format: "dd/MM HH:mm",
      },
      y: {
        formatter: (value) => `${value.toFixed(2)} kW`,
      },
    },
    colors: ["#4CAF50"],
    legend: {
      show: false,
    },
  }

  const chartSeries = [
    {
      name: "Power",
      data: powerData.length > 0 ? powerData : [],
    },
  ]

  if (loadingMeasures) {
    return <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 1 }} />
  }

  return <ReactApexChart options={chartOptions} series={chartSeries} type="area" height="220" />
}

export default DCMetricsChart
