"use client";
import React from "react";
import { Grid, Card, Typography } from "@mui/material";
import ApexCharts from "react-apexcharts";

const ChartSection = ({ weatherData = [], additionalWeatherData = [] }) => {
  // Safe access function to handle undefined values
  const safeValue = (value, defaultValue = 0, decimals = 0) => {
    if (value === undefined || value === null) return defaultValue;
    return typeof value === "number"
      ? parseFloat(value.toFixed(decimals))
      : defaultValue;
  };

  // Map our static data to match the expected structure
  const mappedWeatherData = weatherData.map((item) => ({
    timestamp: item.date,
    tairAvg: item.temperature || 0,
    rhAvg: item.humidity || 0,
    wsWvc1: item.windSpeed || 0,
  }));

  const mappedAdditionalData = additionalWeatherData.map((item) => ({
    timeInterval: item.date,
    avgDhirsi: 200 + Math.random() * 100, // Generate random values for irradiance metrics
    avgDnirsi: 400 + Math.random() * 150,
    avgGhipyr: 600 + Math.random() * 200,
    avgCmpGti: 500 + Math.random() * 180,
  }));

  const chartData1 = {
    series: [
      {
        name: "Air Temperature",
        data: mappedWeatherData.map((item) => ({
          x: new Date(item.timestamp).toLocaleString(),
          y: safeValue(item.tairAvg),
        })),
      },
      {
        name: "Relative Humidity",
        data: mappedWeatherData.map((item) => ({
          x: new Date(item.timestamp).toLocaleString(),
          y: safeValue(item.rhAvg),
        })),
      },
      {
        name: "Wind Speed",
        data: mappedWeatherData.map((item) => ({
          x: new Date(item.timestamp).toLocaleString(),
          y: safeValue(item.wsWvc1),
        })),
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 250,
        zoom: { enabled: true },
        toolbar: { show: true },
      },
      stroke: { curve: "smooth", width: 2 },
      dataLabels: { enabled: false },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
          },
        },
      },
      grid: { show: false },
      yaxis: [
        {
          title: { text: "Temperature (°C)" },
          opposite: false,
          axisBorder: {
            show: true,
            color: "#FF5733",
          },
          axisTicks: {
            show: true,
          },
          labels: {
            style: {
              colors: "#FF5733",
              fontSize: "11px",
              fontFamily: "Poppins, sans-serif",
            },
          },
        },
        {
          title: { text: "Humidity (%)" },
          opposite: true,
          axisBorder: {
            show: true,
            color: "#33FF57",
          },
          axisTicks: {
            show: true,
          },
          labels: {
            style: {
              colors: "#33FF57",
              fontSize: "11px",
              fontFamily: "Poppins, sans-serif",
            },
          },
        },
        {
          title: { text: "Wind Speed (m/s)" },
          opposite: true,
          axisBorder: {
            show: true,
            color: "#3357FF",
          },
          axisTicks: {
            show: true,
          },
          labels: {
            style: {
              colors: "#3357FF",
              fontSize: "11px",
              fontFamily: "Poppins, sans-serif",
            },
          },
        },
      ],
      colors: ["#FF5733", "#33FF57", "#3357FF"],
      tooltip: {
        shared: true,
        x: { format: "yyyy-MM-dd HH:mm:ss" },
        y: { formatter: (value) => `${value.toFixed(1)}` },
      },
    },
  };

  const chartData2 = {
    series: [
      {
        name: "Diffuse Horizontal Irradance",
        data: mappedAdditionalData.map((item) => ({
          x: new Date(item.timeInterval).toLocaleString(),
          y: safeValue(item.avgDhirsi, 0, 1),
        })),
      },
      {
        name: "Direct Normal Irradiance",
        data: mappedAdditionalData.map((item) => ({
          x: new Date(item.timeInterval).toLocaleString(),
          y: safeValue(item.avgDnirsi, 0, 1),
        })),
      },
      {
        name: "Global Horizontal Irradiance",
        data: mappedAdditionalData.map((item) => ({
          x: new Date(item.timeInterval).toLocaleString(),
          y: safeValue(item.avgGhipyr, 0, 2),
        })),
      },
      {
        name: "Global Tilted Irradiance",
        data: mappedAdditionalData.map((item) => ({
          x: new Date(item.timeInterval).toLocaleString(),
          y: safeValue(item.avgCmpGti, 0, 1),
        })),
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 250,
        zoom: { enabled: true },
        toolbar: { show: true },
      },
      stroke: { curve: "smooth", width: 2 },
      dataLabels: { enabled: false },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
          },
        },
      },
      yaxis: {
        title: { text: "Irradiance (W/m²)" },
        axisBorder: {
          show: true,
          color: "#77B254",
        },
        axisTicks: {
          show: true,
          color: "#77B254",
        },
        labels: {
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
          },
        },
      },
      grid: { show: false },
      colors: ["#FF9D23", "#16C47F", "#F93827", "#344CB7"],
      tooltip: {
        shared: true,
        x: { format: "yyyy-MM-dd HH:mm:ss" },
        y: { formatter: (value) => `${value.toFixed(2)} W/m²` },
      },
    },
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={11.5}>
        <Card sx={{ boxShadow: 3, padding: 2, borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              marginBottom: 2,
              fontSize: "14px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Solar Irradiance Metrics
          </Typography>
          <ApexCharts
            options={chartData2.options}
            series={chartData2.series}
            type="line"
            height={250}
          />
        </Card>
      </Grid>
      <Grid item xs={12} md={11.5}>
        <Card sx={{ boxShadow: 3, padding: 2, borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              marginBottom: 2,
              fontSize: "14px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Weather Analysis
          </Typography>
          <ApexCharts
            options={chartData1.options}
            series={chartData1.series}
            type="line"
            height={250}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChartSection;
