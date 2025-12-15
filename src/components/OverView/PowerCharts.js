"use client";

import { Box, Grid, Card, CardContent, Divider, useTheme, IconButton, Tooltip, Alert, Skeleton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ReactApexChart from "react-apexcharts";

const PowerCharts = ({ 
  currentDeviceControl, 
  currentDateRangePicker, 
  currentFilterChips, 
  currentMeasures = [], 
  loadingCurrentMeasures = false,
  currentError = null,
  voltageDeviceControl, 
  voltageDateRangePicker, 
  voltageFilterChips, 
  voltageMeasures = [], 
  loadingVoltageMeasures = false,
  voltageError = null
}) => {
  const theme = useTheme();
  
  const processMeasuresData = (measures) => {
    if (!Array.isArray(measures) || measures.length === 0) {
      console.log("No measures data or empty array");
      return [];
    }
    
    console.log("Processing measures data:", measures.slice(0, 3));
    
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
    
    console.log("Processed data sample:", processed.slice(0, 3));
    
    const aggregated = aggregateBy10Minutes(processed);
    console.log("Aggregated data sample:", aggregated.slice(0, 3));
    
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

  const currentData = processMeasuresData(currentMeasures);
  const voltageData = processMeasuresData(voltageMeasures);

  const chartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "Poppins, sans-serif",
      animations: {
        enabled: false, // Disable animations for better performance with many data points
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
        height: 6, // Make ticks longer to look like underscores
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
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
          show: false, // Hide internal x-axis grid lines
        },
      },
      yaxis: {
        lines: {
          show: false, // Hide internal y-axis grid lines
        },
      },
      row: {
        colors: undefined,
        opacity: 0.5,
      },
      column: {
        colors: undefined,
        opacity: 0.5,
      },
      padding: {
        top: 0,
        right: 10, // Add some padding on the right for y-axis ticks
        bottom: 0,
        left: 0,
      },
    },
    tooltip: {
      shared: true,
      theme: theme.palette.mode,
      x: {
        format: "dd/MM HH:mm", // Show date and time in tooltip
      },
      y: {
        formatter: (value) => `${value.toFixed(2)} kW`, // Format to 2 decimal places
      },
    },
  };

  const generationChart = {
    series: [
      {
        name: "Current",
        data: currentData,
      },
    ],
    options: {
      ...chartOptions,
      colors: ["#2196F3"],
      title: {
        text: "Current",
        align: "left",
        style: {
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
          color: theme.palette.text.primary,
        },
      },
      yaxis: {
        ...chartOptions.yaxis,
        title: {
          text: "Current (A)",
          style: { 
            fontSize: "12px", 
            fontFamily: "Poppins, sans-serif",
            color: theme.palette.text.primary,
          },
        },
      },
    },
  };

  const consumptionChart = {
    series: [
      {
        name: "Voltage",
        data: voltageData,
      },
    ],
    options: {
      ...chartOptions,
      colors: ["#F44336"],
      title: {
        text: "Voltage",
        align: "left",
        style: {
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
          color: theme.palette.text.primary,
        },
      },
      yaxis: {
        ...chartOptions.yaxis,
        title: {
          text: "Voltage (V)",
          style: { 
            fontSize: "12px", 
            fontFamily: "Poppins, sans-serif",
            color: theme.palette.text.primary,
          },
        },
      },
    },
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
              borderRadius: 2,
              position: "relative",
            }}
          >
            <CardContent sx={{ p: 2, position: "relative" }}>
              {(currentDeviceControl || currentDateRangePicker || currentFilterChips) && (
                <>
                  <Box sx={{ 
                    position: "absolute", 
                    top: 8, 
                    left: 8, 
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    justifyContent: "flex-start"
                  }}>
                    {currentDeviceControl}
                    {currentDateRangePicker}
                    {currentFilterChips}
                  </Box>
                  <Box sx={{ 
                    position: "absolute", 
                    top: 8, 
                    right: 8, 
                    zIndex: 1000,
                  }}>
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
                </>
              )}
              <Box sx={{ pt: (currentDeviceControl || currentDateRangePicker || currentFilterChips) ? 4 : 0, pb: 1 }}>
                {(currentDeviceControl || currentDateRangePicker || currentFilterChips) && <Divider sx={{ mb: 1 }} />}
                {loadingCurrentMeasures ? (
                  <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 1 }} />
                ) : (
                  <ReactApexChart
                    options={generationChart.options}
                    series={generationChart.series}
                    type="area"
                    height={240}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
              borderRadius: 2,
              position: "relative",
            }}
          >
            <CardContent sx={{ p: 2, position: "relative" }}>
              {(voltageDeviceControl || voltageDateRangePicker || voltageFilterChips) && (
                <>
                  <Box sx={{ 
                    position: "absolute", 
                    top: 8, 
                    left: 8, 
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    justifyContent: "flex-start"
                  }}>
                    {voltageDeviceControl}
                    {voltageDateRangePicker}
                    {voltageFilterChips}
                  </Box>
                  <Box sx={{ 
                    position: "absolute", 
                    top: 8, 
                    right: 8, 
                    zIndex: 1000,
                  }}>
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
                </>
              )}
              {voltageError && (
                <Alert severity="error" sx={{ mb: 1, mt: 4 }}>
                  {voltageError}
                </Alert>
              )}
              <Box sx={{ pt: (voltageDeviceControl || voltageDateRangePicker || voltageFilterChips) ? 4 : 0, pb: 1 }}>
                {(voltageDeviceControl || voltageDateRangePicker || voltageFilterChips) && <Divider sx={{ mb: 1 }} />}
                {loadingVoltageMeasures ? (
                  <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 1 }} />
                ) : (
                  <ReactApexChart
                    options={consumptionChart.options}
                    series={consumptionChart.series}
                    type="area"
                    height={240}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PowerCharts;
