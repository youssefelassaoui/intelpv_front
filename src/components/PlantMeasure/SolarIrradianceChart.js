"use client";
import ReactApexChart from "react-apexcharts";
import { Box, useTheme, Typography } from "@mui/material";

const SolarIrradianceChart = () => {
  const theme = useTheme();
  
  const generateSolarIrradianceData = () => {
    const data = {
      diffuseHorizontal: [],
      directNormal: [],
      globalHorizontal: [],
      globalTilted: [],
    };
    
    const startDate = new Date(2025, 7, 27); // August 27, 2025
    const totalDays = 7;
    
    for (let day = 0; day < totalDays; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);
      
      // Generate hourly data for each day (bell curve pattern)
      for (let hour = 0; hour < 24; hour++) {
        const date = new Date(currentDate);
        date.setHours(hour, 0, 0, 0);
        
        // Bell curve centered around noon (hour 12)
        const hourFactor = Math.cos(((hour - 12) / 12) * Math.PI);
        let irradianceFactor = 0;
        
        if (hour >= 6 && hour <= 18) {
          irradianceFactor = Math.max(0, hourFactor);
        }
        
        // Add some variation for realism
        const variation = 0.85 + Math.random() * 0.3;
        
        // Diffuse Horizontal Irradiance (orange) - typically 100-300 W/m² peak
        const diffuseHorizontal = 250 * irradianceFactor * variation * (0.9 + Math.random() * 0.2);
        
        // Direct Normal Irradiance (green) - typically 200-350 W/m² peak
        const directNormal = 300 * irradianceFactor * variation * (0.85 + Math.random() * 0.3);
        
        // Global Horizontal Irradiance (red) - typically 600-700 W/m² peak
        const globalHorizontal = 650 * irradianceFactor * variation * (0.9 + Math.random() * 0.2);
        
        // Global Tilted Irradiance (blue) - typically 600-700 W/m² peak, slightly higher than horizontal
        const globalTilted = 680 * irradianceFactor * variation * (0.9 + Math.random() * 0.2);
        
        data.diffuseHorizontal.push({
          x: date.getTime(),
          y: Math.max(0, Math.round(diffuseHorizontal)),
        });
        
        data.directNormal.push({
          x: date.getTime(),
          y: Math.max(0, Math.round(directNormal)),
        });
        
        data.globalHorizontal.push({
          x: date.getTime(),
          y: Math.max(0, Math.round(globalHorizontal)),
        });
        
        data.globalTilted.push({
          x: date.getTime(),
          y: Math.max(0, Math.round(globalTilted)),
        });
      }
    }
    
    return data;
  };

  const irradianceData = generateSolarIrradianceData();

  const generateDailyTicks = () => {
    const ticks = [];
    const startDate = new Date(2025, 7, 27); // August 27, 2025

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      date.setHours(12, 0, 0, 0); // Set to noon for each day
      ticks.push(date.getTime());
    }

    return ticks;
  };

  const dailyTicks = generateDailyTicks();

  const chartOptions = {
    chart: {
      type: "line",
      height: 240,
      toolbar: { show: true },
      fontFamily: "Poppins, sans-serif",
      animations: { enabled: false },
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
      categories: dailyTicks,
      tickAmount: 7,
      tickPlacement: "on",
      labels: {
        style: { 
          fontSize: "11px", 
          fontFamily: "Poppins, sans-serif",
          colors: theme.palette.text.primary
        },
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM",
          day: "dd MMM",
          hour: "HH:mm",
        },
        format: "dd MMM",
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
    yaxis: [
      {
        seriesName: "Diffuse Horizontal Irradiance",
        title: {
          text: "Diffuse Horizontal (W/m²)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
            color: "#FF9800",
          },
        },
        min: 0,
        max: 400,
        tickAmount: 5,
        labels: {
          formatter: (value) => value.toFixed(0),
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
            colors: "#FF9800",
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
      {
        seriesName: "Direct Normal Irradiance",
        title: {
          text: "Direct Normal (W/m²)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
            color: "#4CAF50",
          },
        },
        min: 0,
        max: 400,
        tickAmount: 5,
        opposite: true,
        labels: {
          formatter: (value) => value.toFixed(0),
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
            colors: "#4CAF50",
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
      {
        seriesName: "Global Horizontal Irradiance",
        title: {
          text: "Global Horizontal (W/m²)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
            color: "#F44336",
          },
        },
        min: 0,
        max: 800,
        tickAmount: 5,
        opposite: true,
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
        labels: {
          formatter: (value) => value.toFixed(0),
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
            colors: "#F44336",
          },
        },
      },
      {
        seriesName: "Global Tilted Irradiance",
        title: {
          text: "Global Tilted (W/m²)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
            color: "#2196F3",
          },
        },
        min: 0,
        max: 800,
        tickAmount: 5,
        opposite: true,
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
        labels: {
          formatter: (value) => value.toFixed(0),
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
            colors: "#2196F3",
          },
        },
      },
    ],
    grid: {
      show: true,
      borderColor: theme.palette.divider,
      strokeDashArray: 0,
      position: "back",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: false } },
      padding: { top: 0, right: 10, bottom: 0, left: 0 },
    },
    tooltip: {
      theme: theme.palette.mode,
      shared: true,
      x: { format: "dd MMM HH:mm" },
      y: [
        { formatter: (value) => `${value.toFixed(0)} W/m²` },
        { formatter: (value) => `${value.toFixed(0)} W/m²` },
        { formatter: (value) => `${value.toFixed(0)} W/m²` },
        { formatter: (value) => `${value.toFixed(0)} W/m²` },
      ],
      style: {
        fontFamily: "Poppins, sans-serif",
      },
    },
    colors: ["#FF9800", "#4CAF50", "#F44336", "#2196F3"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Poppins, sans-serif",
      fontSize: "11px",
      offsetY: 5,
      labels: {
        colors: theme.palette.text.primary,
      },
    },
  };

  const chartSeries = [
    {
      name: "Diffuse Horizontal Irradiance",
      type: "area",
      data: irradianceData.diffuseHorizontal,
      yAxisIndex: 0,
    },
    {
      name: "Direct Normal Irradiance",
      type: "area",
      data: irradianceData.directNormal,
      yAxisIndex: 1,
    },
    {
      name: "Global Horizontal Irradiance",
      type: "area",
      data: irradianceData.globalHorizontal,
      yAxisIndex: 2,
    },
    {
      name: "Global Tilted Irradiance",
      type: "area",
      data: irradianceData.globalTilted,
      yAxisIndex: 3,
    },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height={240}
      />
    </Box>
  );
};

export default SolarIrradianceChart;

