"use client";

import { useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";
import ReactApexChart from "react-apexcharts";
import CustomDateRangePicker from "../GloabalComponents/CustomDateRangePicker";
import ProductionComparison from "./ProductionComparison";

// Updated vibrant colors for better distinction
const COLORS = [
  "#48A6A7",
  "#6EC3C4",
  "#7BD8C6",
  "#B7ECEC",
  "#63AEE2",
  "#5C8FA6",
];

// Generate realistic production data based on capacity
const generateRealisticData = (baseCapacity, days) => {
  // Convert capacity string to number in kW
  let capacityValue = 0;
  if (baseCapacity.includes("kW") || baseCapacity.includes("KW")) {
    capacityValue = Number.parseFloat(baseCapacity) || 0;
  } else if (baseCapacity.includes("MW")) {
    capacityValue = (Number.parseFloat(baseCapacity) || 0) * 1000;
  }

  // If capacity is invalid or --, use a default value
  if (isNaN(capacityValue) || capacityValue === 0) {
    capacityValue = 500; // Default 500 kW
  }

  // Generate daily production with realistic variations
  return days.map(() => {
    // Realistic production is ~4-6 kWh per kW of capacity per day with weather variations
    const efficiencyFactor = 4 + Math.random() * 2; // Between 4-6 hours of peak production
    const weatherVariation = 0.7 + Math.random() * 0.6; // 70-130% variation due to weather

    // Calculate daily production in kWh
    const dailyProduction = Math.round(
      capacityValue * efficiencyFactor * weatherVariation
    );
    return dailyProduction;
  });
};

// Generate date labels for May 12-18
const generateDateLabels = () => {
  const dates = [];
  const startDate = new Date(2025, 4, 12); // May 12, 2025 (months are 0-indexed)

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(
      date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })
    );
  }

  return dates;
};

const dateLabels = generateDateLabels();

// Plant data with realistic production values
const plants = [
  {
    id: 1,
    name: "Green & Smart..",
    capacity: "6 kW",
    dailyProduction: generateRealisticData("6 kW", dateLabels),
    totalProduction: 0, // Will be calculated
  },
  {
    id: 2,
    name: "Green Energy Park (Trina)",
    capacity: "22.23 kW",
    dailyProduction: generateRealisticData("22.23 kW", dateLabels),
    totalProduction: 0,
  },
  {
    id: 3,
    name: "Hospital Universario..",
    capacity: "1.72 MW",
    dailyProduction: generateRealisticData("1.72 MW", dateLabels),
    totalProduction: 0,
  },
  {
    id: 4,
    name: "Mohammed VI Museum",
    capacity: "136 KW",
    dailyProduction: generateRealisticData("136 KW", dateLabels),
    totalProduction: 0,
  },
  {
    id: 5,
    name: "Fkih ben saleh",
    capacity: "400 KW",
    dailyProduction: generateRealisticData("400 KW", dateLabels),
    totalProduction: 0,
  },
  {
    id: 6,
    name: "SESA Project",
    capacity: "25 KW",
    dailyProduction: generateRealisticData("25 KW", dateLabels),
    totalProduction: 0,
  },
];

// Calculate total production for each plant
plants.forEach((plant) => {
  plant.totalProduction = plant.dailyProduction.reduce(
    (sum, daily) => sum + daily,
    0
  );
});

const ChartSection = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [barStartDate, setBarStartDate] = useState(new Date(2025, 4, 12));
  const [barEndDate, setBarEndDate] = useState(new Date(2025, 4, 18));
  const [donutStartDate, setDonutStartDate] = useState(new Date(2025, 4, 12));
  const [donutEndDate, setDonutEndDate] = useState(new Date(2025, 4, 18));

  // Extract data from our plants array
  const donutChartSeries = plants.map((plant) => plant.totalProduction);
  const plantNames = plants.map((plant) => plant.name);

  const barChartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
      fontFamily: "Poppins, sans-serif",
      height: 230,
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
      categories: dateLabels,
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        style: {
          fontSize: "10px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Energy (kWh)",
        style: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "11px",
        },
      },
      labels: {
        formatter: (value) => value.toFixed(0),
        style: {
          fontSize: "10px",
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
        formatter: (val) => val + " kWh",
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Poppins, sans-serif",
      fontSize: "11px",
      itemMargin: {
        horizontal: 5,
        vertical: 0,
      },
      formatter: (seriesName, opts) => {
        // Shorten names if too long
        return seriesName.length > 15
          ? seriesName.substring(0, 15) + "..."
          : seriesName;
      },
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
        left: 5,
      },
    },
    colors: COLORS,
  };

  // Create series from our plant data
  const barChartSeries = plants.map((plant) => ({
    name: plant.name,
    data: plant.dailyProduction,
  }));

  // Calculate total for percentage calculation
  const totalEnergy = donutChartSeries.reduce((a, b) => a + b, 0);

  const donutChartOptions = {
    chart: {
      type: "donut",
      fontFamily: "Poppins, sans-serif",
      height: 230,
    },
    labels: plantNames,
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: t.charts.totalEnergy,
              fontSize: "12px",
              formatter: (w) =>
                w.globals.seriesTotals
                  .reduce((a, b) => a + b, 0)
                  .toLocaleString() + " kWh",
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
      horizontalAlign: "center",
      fontFamily: "Poppins, sans-serif",
      fontSize: "10px",
      itemMargin: {
        horizontal: 4,
        vertical: 0,
      },
      formatter: (seriesName, opts) => {
        // Shorten names if too long
        return seriesName.length > 15
          ? seriesName.substring(0, 15) + "..."
          : seriesName;
      },
    },
    tooltip: {
      y: {
        formatter: (val, { seriesIndex }) => {
          const percentage = ((val / totalEnergy) * 100).toFixed(1);
          return `${val.toLocaleString()} kWh (${percentage}%)`;
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

  // Reduced card height for more compact layout
  const cardHeight = 320;

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "3fr 2fr 2fr" },
          gap: 1.5,
        }}
      >
        {/* Daily Production Bar Chart */}
        <Card
          sx={{
            p: 2,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            height: cardHeight,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "14px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
              }}
            >
              {t.charts.dailyEnergyProduction}
            </Typography>
            <CustomDateRangePicker
              startDate={barStartDate}
              endDate={barEndDate}
              onRangeChange={handleBarDateRangeChange}
            />
          </Box>
          <Box sx={{ height: 260 }}>
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
            p: 2,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            height: cardHeight,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "14px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
              }}
            >
              {t.charts.energyDistribution}
            </Typography>
            <CustomDateRangePicker
              startDate={donutStartDate}
              endDate={donutEndDate}
              onRangeChange={handleDonutDateRangeChange}
            />
          </Box>
          <Box sx={{ height: 230 }}>
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
        <Box sx={{ height: cardHeight }}>
          <ProductionComparison plants={plants} />
        </Box>
      </Box>
    </Box>
  );
};

export default ChartSection;
