"use client";

import { useState, useEffect, useMemo } from "react";
import { Box, Card, CardContent, Typography, useTheme, Chip, Divider, IconButton, Tooltip, Skeleton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";
import ReactApexChart from "react-apexcharts";
import CustomDateRangePicker from "../GloabalComponents/CustomDateRangePicker";
import ProductionComparison from "./ProductionComparison";
import { fetchDailyEnergyByPlant } from "../../services/api";
import { format } from "date-fns";

const COLORS = [
  "#2E7D32",
  "#6EC3C4",
  "#1976D2",
  "#F57C00",
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

const allPlants = [
  {
    id: 1,
    name: "Green & Smart Building Park (Brique Rouge)",
    plantId: 49951765,
    capacity: "6 kW",
    color: "#2E7D32",
    totalProduction: 0,
  },
  {
    id: 2,
    name: "Green Energy Park (Trina)",
    capacity: "22.23 kW",
    color: "#6EC3C4",
    totalProduction: 0,
  },
  {
    id: 3,
    name: "Hospital Universario Rien Sofía",
    plantId: 36076361,
    capacity: "1.72 MW",
    color: "#1976D2",
    totalProduction: 0,
  },
  {
    id: 4,
    name: "Mohammed VI Museum of Modern and Contemporary Art",
    plantId: 33783322,
    capacity: "136 KW",
    color: "#F57C00",
    totalProduction: 0,
  },
  {
    id: 5,
    name: "Fkih ben saleh",
    capacity: "400 KW",
    color: "#63AEE2",
    totalProduction: 0,
  },
  {
    id: 6,
    name: "SESA Project",
    capacity: "25 KW",
    color: "#5C8FA6",
    totalProduction: 0,
  },
];

const plants = allPlants;

const plantsWithIds = allPlants.filter((plant) => plant.plantId);

// Placeholder total production (could be computed from API later)
plants.forEach((plant) => {
  plant.totalProduction = 0;
});

const ChartSection = () => {
  const { language } = useLanguage();
  const theme = useTheme();
  const t = translations[language];

  const getDefaultDateRange = () => {
    const start = new Date("2025-11-15T00:00:00Z");
    const end = new Date("2025-11-30T23:59:59Z");
    return { start, end };
  };

  const defaultDates = getDefaultDateRange();

  const [barStartDate, setBarStartDate] = useState(defaultDates.start);
  const [barEndDate, setBarEndDate] = useState(defaultDates.end);
  const [donutStartDate, setDonutStartDate] = useState(defaultDates.start);
  const [donutEndDate, setDonutEndDate] = useState(defaultDates.end);
  const [dailyEnergyData, setDailyEnergyData] = useState(null);
  const [donutEnergyData, setDonutEnergyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donutLoading, setDonutLoading] = useState(true);
  const [comparisonLoading, setComparisonLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donutError, setDonutError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    const loadDailyEnergyForAllPlants = async () => {
      if (!barStartDate || !barEndDate) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchDailyEnergyByPlant(barStartDate, barEndDate);
        setDailyEnergyData(data);
        setComparisonLoading(false);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch daily energy by plant:", err);
        setComparisonLoading(false);
      } finally {
        setLoading(false);
      }
    };

    loadDailyEnergyForAllPlants();
  }, [barStartDate?.getTime(), barEndDate?.getTime()]);

  useEffect(() => {
    const loadDonutEnergy = async () => {
      if (!donutStartDate || !donutEndDate) return;
      setDonutLoading(true);
      setDonutError(null);
      try {
        const data = await fetchDailyEnergyByPlant(donutStartDate, donutEndDate);
        setDonutEnergyData(data);
      } catch (err) {
        setDonutError(err.message);
      } finally {
        setDonutLoading(false);
      }
    };
    loadDonutEnergy();
  }, [donutStartDate?.getTime(), donutEndDate?.getTime()]);

  const generateDateLabelsFromRange = (start, end) => {
    if (!start || !end) return [];

    const dates = [];
    const currentDate = new Date(start);
    currentDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setUTCHours(23, 59, 59, 999);

    while (currentDate <= endDate) {
      dates.push(
        currentDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
        })
      );
      const nextDate = new Date(currentDate);
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
      currentDate.setTime(nextDate.getTime());
    }

    return dates;
  };

  const barChartDateLabels = useMemo(() => {
    return generateDateLabelsFromRange(barStartDate, barEndDate);
  }, [barStartDate?.getTime(), barEndDate?.getTime()]);

  const processDailyEnergyData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) {
      console.log("No API data or not an array:", apiData);
      return null;
    }

    console.log("Processing API data, items count:", apiData.length);
    const plantDataMap = {};
    
    apiData.forEach(item => {
      const plantId = item.plantId;
      if (!plantDataMap[plantId]) {
        plantDataMap[plantId] = new Map();
      }
      
      const energyValue = item.totalDayEnergy !== undefined 
        ? item.totalDayEnergy 
        : item.energy !== undefined 
        ? item.energy 
        : item.value !== undefined 
        ? item.value 
        : item.dailyEnergy !== undefined
        ? item.dailyEnergy
        : 0;
      
      const dateValue = item.date || item.timestamp || item.day;
      if (dateValue) {
        const dateKey = dateValue.split('T')[0];
        plantDataMap[plantId].set(dateKey, energyValue);
        console.log(`Plant ${plantId}, Date: ${dateKey}, Energy: ${energyValue}`);
      }
    });
    
    console.log("Plant data map sample (36076361):", Array.from(plantDataMap[36076361]?.entries() || []));

    const series = plantsWithIds.map((plant, plantIndex) => {
      if (!plant.plantId || !plantDataMap[plant.plantId]) {
        return {
          name: plant.name,
          data: plant.dailyProduction,
          color: plant.color || COLORS[plantIndex % COLORS.length],
        };
      }

      const dateMap = plantDataMap[plant.plantId];
      
      const processedData = [];
      const currentDate = new Date(barStartDate);
      currentDate.setHours(0, 0, 0, 0);
      const endDate = new Date(barEndDate);
      endDate.setHours(23, 59, 59, 999);

      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split("T")[0];
        const value = dateMap.get(dateKey) || 0;
        processedData.push(value);

        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        currentDate.setTime(nextDate.getTime());
      }

      return {
        name: plant.name,
        data: processedData,
        color: plant.color || COLORS[plantIndex % COLORS.length],
      };
    });

    return { series, labels: barChartDateLabels };
  };

  const safeCategories = Array.isArray(barChartDateLabels)
    ? barChartDateLabels
    : [];

  const processedData = dailyEnergyData 
    ? processDailyEnergyData(dailyEnergyData) 
    : null;

  const categoriesFromData =
    processedData?.labels && Array.isArray(processedData.labels) && processedData.labels.length
      ? processedData.labels
      : null;

  const baseCategories = categoriesFromData || safeCategories;
  const fallbackCategories =
    baseCategories && baseCategories.length > 0 ? baseCategories : [" "];

  const buildEmptySeries = () =>
    plantsWithIds.map((plant, index) => ({
      name: plant.name,
      data: fallbackCategories.map(() => 0),
      color: plant.color || COLORS[index % COLORS.length],
    }));

  const normalizedSeries = (processedData?.series || []).map((s, idx) => ({
    name: s?.name ?? plantsWithIds[idx]?.name ?? `Plant ${idx + 1}`,
    data: Array.isArray(s?.data)
      ? s.data
      : fallbackCategories.map(() => 0),
    color: s?.color || plantsWithIds[idx]?.color || COLORS[idx % COLORS.length],
  }));

  const barChartSeries = normalizedSeries.length ? normalizedSeries : buildEmptySeries();

  const barChartCategories = fallbackCategories;

  const aggregateDonutData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return plantsWithIds.map(() => 0);

    const totalsMap = new Map();
    apiData.forEach((item) => {
      const pid = item.plantId;
      const val =
        item.totalDayEnergy ??
        item.energy ??
        item.value ??
        item.dailyEnergy ??
        0;
      totalsMap.set(pid, (totalsMap.get(pid) || 0) + Number(val || 0));
    });

    return plantsWithIds.map((p) => totalsMap.get(p.plantId) || 0);
  };

  const donutChartSeries = aggregateDonutData(donutEnergyData);
  const plantNames = plantsWithIds.map((plant) => plant.name);

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
      categories: barChartCategories,
      axisBorder: {
        show: true,
        color: theme.palette.divider,
      },
      axisTicks: {
        show: true,
        color: theme.palette.divider,
      },
      labels: {
        show: true,
        style: {
          fontSize: "10px",
          colors: theme.palette.text.secondary,
          fontFamily: "Poppins, sans-serif",
        },
      },
    },
    yaxis: {
      show: true,
      title: {
        show: true,
        text: "Energy (kWh)",
        style: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "11px",
          color: theme.palette.text.primary,
        },
        offsetX: -10,
      },
      labels: {
        show: true,
        formatter: (value) => value.toFixed(0),
        style: {
          fontSize: "10px",
          colors: theme.palette.text.secondary,
          fontFamily: "Poppins, sans-serif",
        },
      },
      axisBorder: {
        show: true,
        color: theme.palette.divider,
      },
      axisTicks: {
        show: true,
        color: theme.palette.divider,
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
      labels: {
        colors: theme.palette.text.primary,
      },
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
      borderColor: theme.palette.divider,
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
        left: 20,
      },
    },
    tooltip: {
      theme: theme.palette.mode,
      style: {
        fontFamily: "Poppins, sans-serif",
      },
    },
    colors: plantsWithIds.map((plant, index) => plant.color || COLORS[index % COLORS.length]),
  };

  // Calculate total for percentage calculation
  const totalEnergy = donutChartSeries.reduce((a, b) => a + b, 0);

  const donutChartOptions = {
    chart: {
      type: "donut",
      fontFamily: "Poppins, sans-serif",
      height: 230,
      toolbar: {
        show: false,
      },
      events: {
        legendClick: function(chartContext, seriesIndex, opts) {
          return true;
        },
      },
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
              fontSize: "10px",
              fontWeight: 500,
              fontFamily: "Poppins, sans-serif",
              color: theme.palette.text.secondary,
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                if (total >= 1000) {
                  return (total / 1000).toFixed(2) + " MWh";
                }
                return total.toLocaleString() + " kWh";
              },
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 700,
              fontFamily: "Poppins, sans-serif",
              color: theme.palette.text.primary,
              offsetY: -10,
              formatter: (val) => {
                if (val >= 1000) {
                  return (val / 1000).toFixed(2) + " MW";
                }
                return val.toLocaleString() + " kW";
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
      horizontalAlign: "center",
      fontFamily: "Poppins, sans-serif",
      fontSize: "10px",
      labels: {
        colors: theme.palette.text.primary,
      },
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
      theme: theme.palette.mode,
      style: {
        fontFamily: "Poppins, sans-serif",
      },
      y: {
        formatter: (val, { seriesIndex }) => {
          const percentage = ((val / totalEnergy) * 100).toFixed(1);
          if (val >= 1000) {
            return `${(val / 1000).toFixed(2)} MWh (${percentage}%)`;
          }
          return `${val.toLocaleString()} kWh (${percentage}%)`;
        },
      },
    },
    colors: plantsWithIds.map((plant, index) => plant.color || COLORS[index % COLORS.length]),
  };

  const handleBarDateRangeChange = (start, end) => {
    const startDate = new Date(start);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setUTCHours(23, 59, 59, 999);

    setBarStartDate(startDate);
    setBarEndDate(endDate);
    setActiveFilter(null);
  };

  const handleQuickFilter = (days, filterKey) => {
    const today = new Date();
    const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59, 999));
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - (days - 1));
    start.setUTCHours(0, 0, 0, 0);

    setBarStartDate(start);
    setBarEndDate(end);
    setActiveFilter(filterKey);
  };

  const handleDonutDateRangeChange = (start, end) => {
    setDonutStartDate(start);
    setDonutEndDate(end);
    // Add logic to filter donut chart data based on date range
  };

  // Increased card height to prevent bottom cutoff
  const cardHeight = 380;

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
          onClick={(e) => e.stopPropagation()}
          sx={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            height: cardHeight,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.paper",
            position: "relative",
          }}
        >
          <CardContent sx={{ position: "relative", p: 2, overflow: "visible" }}>
            <Typography
              variant="h6"
              onClick={(e) => e.stopPropagation()}
              sx={{
                fontSize: "14px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                color: "text.primary",
                userSelect: "none",
                mb: 1,
              }}
            >
              {t.charts.dailyEnergyProduction}
            </Typography>
            <Box sx={{ 
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              mb: 0.5,
              justifyContent: "space-between"
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Tooltip title={t.common?.selectTimeRange || "Select range of time"} arrow placement="top">
                  <Box>
                    <CustomDateRangePicker
                      startDate={barStartDate}
                      endDate={barEndDate}
                      onRangeChange={handleBarDateRangeChange}
                    />
                  </Box>
                </Tooltip>
                <Tooltip title="Select period" arrow placement="top">
                  <Chip
                    label="5 jrs"
                    onClick={() => handleQuickFilter(5, "5jrs")}
                    size="small"
                    sx={{
                      height: "24px",
                      fontSize: "10px",
                      fontFamily: "Poppins, sans-serif",
                      backgroundColor: (theme) =>
                        activeFilter === "5jrs"
                          ? theme.palette.primary.main
                          : theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(255,255,255,0.1)",
                      color: (theme) =>
                        activeFilter === "5jrs" ? "#fff" : theme.palette.text.primary,
                      border: (theme) =>
                        activeFilter === "5jrs"
                          ? `1px solid ${theme.palette.primary.main}`
                          : "1px solid transparent",
                      "&:hover": {
                        backgroundColor: (theme) =>
                          activeFilter === "5jrs"
                            ? theme.palette.primary.dark
                            : theme.palette.mode === "light"
                            ? "rgba(0,0,0,0.1)"
                            : "rgba(255,255,255,0.15)",
                      },
                    }}
                  />
                </Tooltip>
                <Tooltip title="Select period" arrow placement="top">
                  <Chip
                    label="10 jrs"
                    onClick={() => handleQuickFilter(10, "10jrs")}
                    size="small"
                    sx={{
                      height: "24px",
                      fontSize: "10px",
                      fontFamily: "Poppins, sans-serif",
                      backgroundColor: (theme) =>
                        activeFilter === "10jrs"
                          ? theme.palette.primary.main
                          : theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(255,255,255,0.1)",
                      color: (theme) =>
                        activeFilter === "10jrs" ? "#fff" : theme.palette.text.primary,
                      border: (theme) =>
                        activeFilter === "10jrs"
                          ? `1px solid ${theme.palette.primary.main}`
                          : "1px solid transparent",
                      "&:hover": {
                        backgroundColor: (theme) =>
                          activeFilter === "10jrs"
                            ? theme.palette.primary.dark
                            : theme.palette.mode === "light"
                            ? "rgba(0,0,0,0.1)"
                            : "rgba(255,255,255,0.15)",
                      },
                    }}
                  />
                </Tooltip>
                <Tooltip title="Select period" arrow placement="top">
                  <Chip
                    label="15 jrs"
                    onClick={() => handleQuickFilter(15, "15jrs")}
                    size="small"
                    sx={{
                      height: "24px",
                      fontSize: "10px",
                      fontFamily: "Poppins, sans-serif",
                      backgroundColor: (theme) =>
                        activeFilter === "15jrs"
                          ? theme.palette.primary.main
                          : theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(255,255,255,0.1)",
                      color: (theme) =>
                        activeFilter === "15jrs" ? "#fff" : theme.palette.text.primary,
                      border: (theme) =>
                        activeFilter === "15jrs"
                          ? `1px solid ${theme.palette.primary.main}`
                          : "1px solid transparent",
                      "&:hover": {
                        backgroundColor: (theme) =>
                          activeFilter === "15jrs"
                            ? theme.palette.primary.dark
                            : theme.palette.mode === "light"
                            ? "rgba(0,0,0,0.1)"
                            : "rgba(255,255,255,0.15)",
                      },
                    }}
                  />
                </Tooltip>
                <Tooltip title="Select period" arrow placement="top">
                  <Chip
                    label="20 jrs"
                    onClick={() => handleQuickFilter(20, "20jrs")}
                    size="small"
                    sx={{
                      height: "24px",
                      fontSize: "10px",
                      fontFamily: "Poppins, sans-serif",
                      backgroundColor: (theme) =>
                        activeFilter === "20jrs"
                          ? theme.palette.primary.main
                          : theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(255,255,255,0.1)",
                      color: (theme) =>
                        activeFilter === "20jrs" ? "#fff" : theme.palette.text.primary,
                      border: (theme) =>
                        activeFilter === "20jrs"
                          ? `1px solid ${theme.palette.primary.main}`
                          : "1px solid transparent",
                      "&:hover": {
                        backgroundColor: (theme) =>
                          activeFilter === "20jrs"
                            ? theme.palette.primary.dark
                            : theme.palette.mode === "light"
                            ? "rgba(0,0,0,0.1)"
                            : "rgba(255,255,255,0.15)",
                      },
                    }}
                  />
                </Tooltip>
              </Box>
              <Tooltip title="Filters" arrow placement="top">
                <IconButton 
                  size="small"
                  sx={{ 
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "action.hover"
                    }
                  }}
                >
                  <FilterListIcon sx={{ fontSize: "20px" }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 0.5 }} />
            <Box sx={{ pt: 0.5, pb: 1 }}>
              <Box
                sx={{ height: 280, flex: 1 }}
                onClick={(e) => e.stopPropagation()}
              >
            {loading ? (
              <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 1 }} />
            ) : error ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography variant="body2" color="error">
                  Error: {error}
                </Typography>
              </Box>
            ) : (
              <ReactApexChart
                options={barChartOptions}
                series={barChartSeries}
                type="bar"
                height={280}
              />
            )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Total Production Donut Chart */}
        <Card
          onClick={(e) => e.stopPropagation()}
          sx={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            height: cardHeight,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.paper",
            position: "relative",
          }}
        >
          <CardContent sx={{ position: "relative", p: 2, overflow: "visible" }}>
            <Typography
              variant="h6"
              onClick={(e) => e.stopPropagation()}
              sx={{
                fontSize: "14px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                color: "text.primary",
                userSelect: "none",
                mb: 1,
              }}
            >
              {t.charts.energyDistribution}
            </Typography>
            <Box sx={{ 
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              mb: 0.5,
              justifyContent: "space-between"
            }}>
              <Tooltip title={t.common?.selectTimeRange || "Select range of time"} arrow placement="top">
                <Box>
                  <CustomDateRangePicker
                    startDate={donutStartDate}
                    endDate={donutEndDate}
                    onRangeChange={(start, end) => {
                      const s = new Date(start);
                      s.setUTCHours(0, 0, 0, 0);
                      const e = new Date(end);
                      e.setUTCHours(23, 59, 59, 999);
                      setDonutStartDate(s);
                      setDonutEndDate(e);
                    }}
                  />
                </Box>
              </Tooltip>
              <Tooltip title="Filters" arrow placement="top">
                <IconButton 
                  size="small"
                  sx={{ 
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "action.hover"
                    }
                  }}
                >
                  <FilterListIcon sx={{ fontSize: "20px" }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 0.5 }} />
            <Box sx={{ pt: 0.5, pb: 1 }}>
              <Box sx={{ height: 250, flex: 1 }}>
                {donutLoading ? (
                  <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 1 }} />
                ) : donutError ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Typography variant="body2" color="error">
                      Error: {donutError}
                    </Typography>
                  </Box>
                ) : (
                  <ReactApexChart
                    options={donutChartOptions}
                    series={donutChartSeries}
                    type="donut"
                    height={250}
                  />
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Production Comparison - directly using the component */}
        <Box sx={{ height: cardHeight }}>
          <ProductionComparison loading={comparisonLoading} />
        </Box>
      </Box>
    </Box>
  );
};

export default ChartSection;
