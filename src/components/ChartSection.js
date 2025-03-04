import React, { useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import CustomDateRangePicker from "./CustomDateRangePicker";
import ProductionComparison from "./ProductionComparison";

// Updated vibrant colors for better distinction
const COLORS = ["#2E7D32", "#66BB6A", "#81C784", "#A5D6A7", "#C8E6C9"];

const ChartSection = () => {
  const [barStartDate, setBarStartDate] = useState(new Date());
  const [barEndDate, setBarEndDate] = useState(new Date());
  const [donutStartDate, setDonutStartDate] = useState(new Date());
  const [donutEndDate, setDonutEndDate] = useState(new Date());

  const donutChartSeries = [2500, 1800, 2000, 1900, 2200];

  const barChartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
      fontFamily: "Poppins, sans-serif",
      height: 250,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["01/01", "01/02", "01/03", "01/04", "01/05"],
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
    yaxis: {
      title: {
        text: "Energy (kWh)",
        style: {
          fontFamily: "Poppins, sans-serif",
        },
      },
      labels: {
        formatter: function (value) {
          return value.toFixed(0);
        },
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " kWh";
        },
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center", // Centered legend
      fontFamily: "Poppins, sans-serif",
    },
    grid: {
      show: true,
      borderColor: "#f1f1f1",
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
        right: 0,
        bottom: 0,
        left: 10,
      },
    },
    colors: COLORS,
  };

  const barChartSeries = [
    {
      name: "Solar Farm Alpha",
      data: [120, 130, 110, 140, 125],
    },
    {
      name: "Sunlight Beta Station",
      data: [80, 90, 85, 95, 88],
    },
    {
      name: "Green Energy Park",
      data: [100, 95, 105, 98, 102],
    },
    {
      name: "Solar Valley Plant",
      data: [90, 85, 92, 88, 94],
    },
    {
      name: "Desert Sun Complex",
      data: [110, 105, 115, 108, 112],
    },
  ];

  // Calculate total for percentage calculation
  const totalEnergy = donutChartSeries.reduce((a, b) => a + b, 0);

  const donutChartOptions = {
    chart: {
      type: "donut",
      fontFamily: "Poppins, sans-serif",
      height: 250,
    },
    labels: [
      "Solar Farm Alpha",
      "Sunlight Beta Station",
      "Green Energy Park",
      "Solar Valley Plant",
      "Desert Sun Complex",
    ],
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Energy",
              formatter: function (w) {
                return (
                  w.globals.seriesTotals.reduce((a, b) => a + b, 0) + " kWh"
                );
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center", // Centered legend
      fontFamily: "Poppins, sans-serif",
    },
    tooltip: {
      y: {
        formatter: function (val, { seriesIndex }) {
          const percentage = ((val / totalEnergy) * 100).toFixed(1);
          return `${val} kWh (${percentage}%)`;
        },
      },
    },
    colors: COLORS,
  };

  const handleBarDateRangeChange = (start, end) => {
    setBarStartDate(start);
    setBarEndDate(end);
    // Add logic to filter bar chart data based on date range
  };

  const handleDonutDateRangeChange = (start, end) => {
    setDonutStartDate(start);
    setDonutEndDate(end);
    // Add logic to filter donut chart data based on date range
  };

  // Common card height for consistency
  const cardHeight = 350;

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "3fr 2fr 2fr" },
          gap: 2,
        }}
      >
        {/* Daily Production Bar Chart */}
        <Card
          sx={{
            p: 3,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            height: cardHeight,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
              }}
            >
              Daily Energy Production
            </Typography>
            <CustomDateRangePicker
              startDate={barStartDate}
              endDate={barEndDate}
              onRangeChange={handleBarDateRangeChange}
            />
          </Box>
          <Box sx={{ height: 290 }}>
            <ReactApexChart
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              height="100%"
              width="100%"
            />
          </Box>
        </Card>

        {/* Total Production Donut Chart */}
        <Card
          sx={{
            p: 3,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            height: cardHeight,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // Centered
              alignItems: "center",
              mb: 4,
              flexDirection: "column", // Stacked vertically
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
              }}
            >
              Energy Distribution
            </Typography>
            <CustomDateRangePicker
              startDate={donutStartDate}
              endDate={donutEndDate}
              onRangeChange={handleDonutDateRangeChange}
            />
          </Box>
          <Box sx={{ height: 250 }}>
            <ReactApexChart
              options={donutChartOptions}
              series={donutChartSeries}
              type="donut"
              height="100%"
              width="100%"
            />
          </Box>
        </Card>

        {/* Production Comparison - directly using the component */}
        <Box sx={{ height: 365 }}>
          <ProductionComparison />
        </Box>
      </Box>
    </Box>
  );
};

export default ChartSection;
