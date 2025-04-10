"use client";
import React from "react";
import { Grid, Card, Typography } from "@mui/material";
import ApexCharts from "react-apexcharts";

const ChartSection = () => {
  // Generate one day of data with 24 hourly points
  const generateDayData = () => {
    const today = new Date();
    const data = [];

    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(today);
      timestamp.setHours(hour, 0, 0, 0);

      // Generate realistic values based on time of day
      // DC values are higher during daylight hours (6am-6pm)
      const isDaylight = hour >= 6 && hour <= 18;
      const timeOfDayFactor = isDaylight
        ? Math.sin(((hour - 6) / 12) * Math.PI)
        : 0.1;

      data.push({
        timestamp: timestamp.toISOString(),
        dcCurrent: isDaylight
          ? (5 + 3 * timeOfDayFactor + Math.random() * 0.5).toFixed(2)
          : (0.2 + Math.random() * 0.3).toFixed(2),
        dcVoltage: isDaylight
          ? (300 + 100 * timeOfDayFactor + Math.random() * 10).toFixed(1)
          : (50 + Math.random() * 20).toFixed(1),
        dcPower: isDaylight
          ? (1500 + 1200 * timeOfDayFactor + Math.random() * 100).toFixed(0)
          : (10 + Math.random() * 15).toFixed(0),
        temperature: isDaylight
          ? (18 + 10 * timeOfDayFactor + Math.random() * 2).toFixed(1)
          : (15 + Math.random() * 3).toFixed(1),
        humidity: isDaylight
          ? (50 - 20 * timeOfDayFactor + Math.random() * 5).toFixed(0)
          : (65 + Math.random() * 10).toFixed(0),
        windSpeed: (2 + Math.random() * 6).toFixed(1),
        solarRadiation: isDaylight
          ? (200 + 800 * timeOfDayFactor + Math.random() * 50).toFixed(0)
          : (0).toFixed(0),
      });
    }

    return data;
  };

  const dayData = generateDayData();

  // DC Current Chart Configuration
  const dcCurrentChart = {
    series: [
      {
        name: "DC Current",
        data: dayData.map((item) => ({
          x: new Date(item.timestamp).getTime(),
          y: parseFloat(item.dcCurrent),
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
          datetimeUTC: false,
          format: "HH:mm",
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
          },
        },
        title: {
          text: "Time (24-hour)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
          },
        },
      },
      yaxis: {
        title: {
          text: "Current (A)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
          },
        },
        min: 0,
        labels: {
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
          },
        },
      },
      grid: { show: false },
      colors: ["#FF5733"],
      tooltip: {
        shared: true,
        x: { format: "HH:mm" },
        y: { formatter: (value) => `${value.toFixed(2)} A` },
      },
      title: {
        text: "DC Current (24-hour)",
        align: "left",
        style: {
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
        },
      },
    },
  };

  // DC Voltage Chart Configuration
  const dcVoltageChart = {
    series: [
      {
        name: "DC Voltage",
        data: dayData.map((item) => ({
          x: new Date(item.timestamp).getTime(),
          y: parseFloat(item.dcVoltage),
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
          datetimeUTC: false,
          format: "HH:mm",
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
          },
        },
        title: {
          text: "Time (24-hour)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
          },
        },
      },
      yaxis: {
        title: {
          text: "Voltage (V)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
          },
        },
        min: 0,
        labels: {
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
          },
        },
      },
      grid: { show: false },
      colors: ["#33FF57"],
      tooltip: {
        shared: true,
        x: { format: "HH:mm" },
        y: { formatter: (value) => `${value.toFixed(1)} V` },
      },
      title: {
        text: "DC Voltage (24-hour)",
        align: "left",
        style: {
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
        },
      },
    },
  };

  // DC Power Chart Configuration
  const dcPowerChart = {
    series: [
      {
        name: "DC Power",
        data: dayData.map((item) => ({
          x: new Date(item.timestamp).getTime(),
          y: parseFloat(item.dcPower),
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
          datetimeUTC: false,
          format: "HH:mm",
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
          },
        },
        title: {
          text: "Time (24-hour)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
          },
        },
      },
      yaxis: {
        title: {
          text: "Power (W)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
          },
        },
        min: 0,
        labels: {
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
          },
        },
      },
      grid: { show: false },
      colors: ["#3357FF"],
      tooltip: {
        shared: true,
        x: { format: "HH:mm" },
        y: { formatter: (value) => `${value.toFixed(0)} W` },
      },
      title: {
        text: "DC Power (24-hour)",
        align: "left",
        style: {
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
        },
      },
    },
  };

  // Weather Metrics Chart Configuration
  const weatherChart = {
    series: [
      {
        name: "Temperature",
        data: dayData.map((item) => ({
          x: new Date(item.timestamp).getTime(),
          y: parseFloat(item.temperature),
        })),
      },
      {
        name: "Humidity",
        data: dayData.map((item) => ({
          x: new Date(item.timestamp).getTime(),
          y: parseFloat(item.humidity),
        })),
      },
      {
        name: "Wind Speed",
        data: dayData.map((item) => ({
          x: new Date(item.timestamp).getTime(),
          y: parseFloat(item.windSpeed),
        })),
      },
      {
        name: "Solar Radiation",
        data: dayData.map((item) => ({
          x: new Date(item.timestamp).getTime(),
          y: parseFloat(item.solarRadiation),
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
          datetimeUTC: false,
          format: "HH:mm",
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
          },
        },
        title: {
          text: "Time (24-hour)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
          },
        },
      },
      yaxis: [
        {
          title: {
            text: "Temperature (°C)",
            style: {
              fontSize: "12px",
              fontFamily: "Poppins, sans-serif",
            },
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
          title: {
            text: "Humidity (%)",
            style: {
              fontSize: "12px",
              fontFamily: "Poppins, sans-serif",
            },
          },
          opposite: true,
          labels: {
            style: {
              colors: "#33FF57",
              fontSize: "11px",
              fontFamily: "Poppins, sans-serif",
            },
          },
        },
        {
          title: {
            text: "Wind Speed (m/s)",
            style: {
              fontSize: "12px",
              fontFamily: "Poppins, sans-serif",
            },
          },
          opposite: true,
          labels: {
            style: {
              colors: "#3357FF",
              fontSize: "11px",
              fontFamily: "Poppins, sans-serif",
            },
          },
        },
        {
          title: {
            text: "Solar Radiation (W/m²)",
            style: {
              fontSize: "12px",
              fontFamily: "Poppins, sans-serif",
            },
          },
          opposite: true,
          labels: {
            style: {
              colors: "#FF9D23",
              fontSize: "11px",
              fontFamily: "Poppins, sans-serif",
            },
          },
        },
      ],
      grid: { show: false },
      colors: ["#FF5733", "#33FF57", "#3357FF", "#FF9D23"],
      tooltip: {
        shared: true,
        x: { format: "HH:mm" },
        y: [
          { formatter: (value) => `${value.toFixed(1)} °C` },
          { formatter: (value) => `${value.toFixed(0)} %` },
          { formatter: (value) => `${value.toFixed(1)} m/s` },
          { formatter: (value) => `${value.toFixed(0)} W/m²` },
        ],
      },
      title: {
        text: "Weather Metrics (24-hour)",
        align: "left",
        style: {
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
        },
      },
    },
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={11.5}>
        <Card
          sx={{ boxShadow: 3, padding: 2, borderRadius: 2, marginBottom: 2 }}
        >
          <ApexCharts
            options={dcCurrentChart.options}
            series={dcCurrentChart.series}
            type="line"
            height={250}
          />
        </Card>
      </Grid>
      <Grid item xs={12} md={11.5}>
        <Card
          sx={{ boxShadow: 3, padding: 2, borderRadius: 2, marginBottom: 2 }}
        >
          <ApexCharts
            options={dcVoltageChart.options}
            series={dcVoltageChart.series}
            type="line"
            height={250}
          />
        </Card>
      </Grid>
      <Grid item xs={12} md={11.5}>
        <Card
          sx={{ boxShadow: 3, padding: 2, borderRadius: 2, marginBottom: 2 }}
        >
          <ApexCharts
            options={dcPowerChart.options}
            series={dcPowerChart.series}
            type="line"
            height={250}
          />
        </Card>
      </Grid>
      <Grid item xs={12} md={11.5}>
        <Card sx={{ boxShadow: 3, padding: 2, borderRadius: 2 }}>
          <ApexCharts
            options={weatherChart.options}
            series={weatherChart.series}
            type="line"
            height={250}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChartSection;
