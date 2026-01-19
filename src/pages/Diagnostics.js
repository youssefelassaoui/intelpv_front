import React, { useState, Fragment, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Divider,
  Grid,
  useTheme,
  Paper,
  Avatar,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
import ReactApexChart from "react-apexcharts";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import { format } from "date-fns";

// Styled components
const AnomalyListContainer = styled(Card)(({ theme }) => ({
  height: "calc(100vh - 100px)",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 2,
  overflow: "hidden",
}));

const AnomalyListItem = styled(ListItemButton)(({ theme, selected }) => ({
  backgroundColor: selected
    ? theme.palette.mode === "light"
      ? "rgba(18, 153, 144, 0.1)"
      : "rgba(18, 153, 144, 0.2)"
    : "transparent",
  borderLeft: selected
    ? `4px solid ${theme.palette.primary.main}`
    : "4px solid transparent",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(18, 153, 144, 0.05)"
        : "rgba(18, 153, 144, 0.1)",
  },
  transition: "all 0.2s ease-in-out",
}));

const DetailCard = styled(Card)(({ theme }) => ({
  height: "calc(100vh - 100px)",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 2,
  overflow: "auto",
}));

const ThermalImageContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "250px",
  borderRadius: 2,
  overflow: "hidden",
  backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "#1a1a1a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  border: `1px solid ${theme.palette.divider}`,
}));

// Static drone data
const droneDatabase = {
  "DR-001": {
    id: "DR-001",
    model: "DJI Mavic 3 Thermal",
    operator: "Ahmed Benali",
    batteryLevel: 78,
    firmwareVersion: "v2.1.5",
    lastMaintenance: new Date("2025-01-10"),
    totalFlights: 342,
    status: "active",
  },
  "DR-002": {
    id: "DR-002",
    model: "DJI Mavic 3 Thermal",
    operator: "Fatima Alami",
    batteryLevel: 92,
    firmwareVersion: "v2.1.5",
    lastMaintenance: new Date("2025-01-08"),
    totalFlights: 298,
    status: "active",
  },
  "DR-003": {
    id: "DR-003",
    model: "DJI Phantom 4 RTK",
    operator: "Youssef El Amrani",
    batteryLevel: 65,
    firmwareVersion: "v2.0.8",
    lastMaintenance: new Date("2025-01-12"),
    totalFlights: 521,
    status: "active",
  },
  "DR-004": {
    id: "DR-004",
    model: "DJI Mavic 3 Thermal",
    operator: "Sara Idrissi",
    batteryLevel: 88,
    firmwareVersion: "v2.1.5",
    lastMaintenance: new Date("2025-01-09"),
    totalFlights: 267,
    status: "active",
  },
  "DR-005": {
    id: "DR-005",
    model: "DJI Phantom 4 RTK",
    operator: "Mohamed Tazi",
    batteryLevel: 71,
    firmwareVersion: "v2.0.8",
    lastMaintenance: new Date("2025-01-11"),
    totalFlights: 445,
    status: "active",
  },
};

// Mock data for anomalies with realistic power loss calculations
const mockAnomalies = [
  {
    id: 1,
    classification: "Hot Spot",
    severity: "high",
    status: "new",
    timestamp: new Date("2025-01-15T10:30:00"),
    plantName: "Green Energy Park (Trina)",
    plantCapacity: 22.23, // kW
    stringId: "String-06",
    panelId: "Panel-06-12",
    description: "Severe hot spot detected in panel. Temperature anomaly: 85°C (normal: 45°C). Bypass diode failure suspected causing reverse current flow.",
    temperature: 85,
    normalTemperature: 45,
    location: { row: 6, column: 12 },
    thermalImage: "/thermal-sample.jpg",
    thermalImageCapturedAt: new Date("2025-01-15T10:25:00"),
    droneId: "DR-001",
    powerLoss: {
      current: 0.85, // kW lost
      percentage: 3.8, // % of string capacity
      dailyEnergyLoss: 6.8, // kWh/day
      estimatedMonthlyLoss: 204, // kWh/month
      estimatedCostLoss: 20.4, // €/month (assuming 0.10€/kWh)
    },
    solutionRecommendations: [
      {
        action: "Immediate Panel Cleaning",
        priority: "High",
        description: "Remove dust, bird droppings, and debris from panel surface",
        estimatedTime: "30 minutes",
        cost: "Low",
      },
      {
        action: "Bypass Diode Replacement",
        priority: "High",
        description: "Replace failed bypass diode to prevent reverse current",
        estimatedTime: "2 hours",
        cost: "Medium (€15-25)",
      },
      {
        action: "Panel Replacement",
        priority: "Medium",
        description: "If hot spot persists, replace entire panel module",
        estimatedTime: "4 hours",
        cost: "High (€200-300)",
      },
    ],
  },
  {
    id: 2,
    classification: "String Mismatch",
    severity: "medium",
    status: "under_treatment",
    timestamp: new Date("2025-01-15T09:15:00"),
    plantName: "Green & Smart Building Park",
    plantCapacity: 6, // kW
    stringId: "String-03",
    panelId: "Panel-03-08",
    description: "Voltage mismatch detected. String voltage: 320V (expected: 380V). Possible loose connection or damaged cable affecting string performance.",
    voltage: 320,
    expectedVoltage: 380,
    location: { row: 3, column: 8 },
    thermalImage: "/thermal-sample.jpg",
    thermalImageCapturedAt: new Date("2025-01-15T09:10:00"),
    droneId: "DR-002",
    powerLoss: {
      current: 0.45, // kW lost
      percentage: 7.5, // % of string capacity
      dailyEnergyLoss: 3.6, // kWh/day
      estimatedMonthlyLoss: 108, // kWh/month
      estimatedCostLoss: 10.8, // €/month
    },
    solutionRecommendations: [
      {
        action: "Cable Inspection & Tightening",
        priority: "High",
        description: "Inspect all DC cables and connectors, tighten loose connections",
        estimatedTime: "1.5 hours",
        cost: "Low",
      },
      {
        action: "MC4 Connector Replacement",
        priority: "Medium",
        description: "Replace damaged or corroded MC4 connectors",
        estimatedTime: "2 hours",
        cost: "Medium (€10-20)",
      },
      {
        action: "Cable Replacement",
        priority: "Low",
        description: "If cable damage is found, replace affected cable section",
        estimatedTime: "3 hours",
        cost: "Medium (€50-100)",
      },
    ],
  },
  {
    id: 3,
    classification: "Shading Issue",
    severity: "low",
    status: "treated",
    timestamp: new Date("2025-01-14T14:20:00"),
    plantName: "Hospital Universario Rien Sofía",
    plantCapacity: 1720, // kW (1.72 MW)
    stringId: "String-15",
    panelId: "Panel-15-05",
    description: "Partial shading detected from nearby tree growth. Power reduction: 15% during peak hours. Tree branches need trimming.",
    powerReduction: 15,
    location: { row: 15, column: 5 },
    thermalImage: "/thermal-sample.jpg",
    thermalImageCapturedAt: new Date("2025-01-14T14:15:00"),
    droneId: "DR-003",
    powerLoss: {
      current: 0.12, // kW lost per panel
      percentage: 15, // % of panel capacity
      dailyEnergyLoss: 0.9, // kWh/day
      estimatedMonthlyLoss: 27, // kWh/month
      estimatedCostLoss: 2.7, // €/month
    },
    solutionRecommendations: [
      {
        action: "Vegetation Trimming",
        priority: "Medium",
        description: "Trim tree branches causing shading during peak sun hours",
        estimatedTime: "2 hours",
        cost: "Low (€30-50)",
      },
      {
        action: "Obstacle Removal",
        priority: "Low",
        description: "Remove any temporary structures or objects casting shadows",
        estimatedTime: "1 hour",
        cost: "Low",
      },
      {
        action: "Panel Repositioning",
        priority: "Low",
        description: "If shading is permanent, consider repositioning affected panels",
        estimatedTime: "6 hours",
        cost: "High (€300-500)",
      },
    ],
  },
  {
    id: 4,
    classification: "Inverter Fault",
    severity: "high",
    status: "new",
    timestamp: new Date("2025-01-15T11:45:00"),
    plantName: "Mohammed VI Museum",
    plantCapacity: 136, // kW
    stringId: "String-04",
    panelId: "Inverter-02",
    description: "Inverter communication failure detected. Last data received: 2 hours ago. Inverter may be offline or communication module malfunctioning.",
    lastDataTime: new Date("2025-01-15T09:45:00"),
    location: { row: 4, column: 0 },
    thermalImage: "/thermal-sample.jpg",
    thermalImageCapturedAt: new Date("2025-01-15T11:40:00"),
    droneId: "DR-004",
    powerLoss: {
      current: 8.5, // kW lost (entire inverter)
      percentage: 6.25, // % of plant capacity
      dailyEnergyLoss: 68, // kWh/day
      estimatedMonthlyLoss: 2040, // kWh/month
      estimatedCostLoss: 204, // €/month
    },
    solutionRecommendations: [
      {
        action: "Inverter Reset",
        priority: "High",
        description: "Perform soft reset of inverter via control panel",
        estimatedTime: "15 minutes",
        cost: "Low",
      },
      {
        action: "Communication Cable Inspection",
        priority: "High",
        description: "Check RS485/Modbus communication cables for damage or loose connections",
        estimatedTime: "1 hour",
        cost: "Low",
      },
      {
        action: "Communication Module Check",
        priority: "Medium",
        description: "Test and replace communication module if faulty",
        estimatedTime: "2 hours",
        cost: "Medium (€100-200)",
      },
      {
        action: "Firmware Update",
        priority: "Low",
        description: "Update inverter firmware to latest version",
        estimatedTime: "1 hour",
        cost: "Low",
      },
    ],
  },
  {
    id: 5,
    classification: "Cell Degradation",
    severity: "medium",
    status: "under_treatment",
    timestamp: new Date("2025-01-15T08:00:00"),
    plantName: "Green Energy Park (Trina)",
    plantCapacity: 22.23, // kW
    stringId: "String-08",
    panelId: "Panel-08-20",
    description: "Gradual power degradation detected over 3 months. Efficiency drop: 8%. Possible cell aging or micro-cracks. Panel under warranty.",
    efficiencyDrop: 8,
    location: { row: 8, column: 20 },
    thermalImage: "/thermal-sample.jpg",
    thermalImageCapturedAt: new Date("2025-01-15T07:55:00"),
    droneId: "DR-001",
    powerLoss: {
      current: 0.18, // kW lost
      percentage: 8, // % of panel capacity
      dailyEnergyLoss: 1.4, // kWh/day
      estimatedMonthlyLoss: 42, // kWh/month
      estimatedCostLoss: 4.2, // €/month
    },
    solutionRecommendations: [
      {
        action: "Performance Monitoring",
        priority: "Medium",
        description: "Continue monitoring panel performance for 2 weeks to confirm degradation trend",
        estimatedTime: "Ongoing",
        cost: "Low",
      },
      {
        action: "Warranty Claim",
        priority: "High",
        description: "Contact panel manufacturer for warranty claim if degradation exceeds 5%",
        estimatedTime: "2-4 weeks",
        cost: "Free (under warranty)",
      },
      {
        action: "Panel Replacement",
        priority: "Medium",
        description: "Replace panel if warranty claim is approved",
        estimatedTime: "4 hours",
        cost: "Free (under warranty) or €200-300",
      },
    ],
  },
  {
    id: 6,
    classification: "Connection Loose",
    severity: "low",
    status: "treated",
    timestamp: new Date("2025-01-13T16:30:00"),
    plantName: "SESA Project (Douar)",
    plantCapacity: 25, // kW
    stringId: "String-01",
    panelId: "Panel-01-03",
    description: "Loose connection detected and fixed. Resistance increased by 0.5Ω. Connection tightened and verified. Issue resolved.",
    resistance: 0.5,
    location: { row: 1, column: 3 },
    thermalImage: "/thermal-sample.jpg",
    thermalImageCapturedAt: new Date("2025-01-13T16:25:00"),
    droneId: "DR-005",
    powerLoss: {
      current: 0.08, // kW lost (before fix)
      percentage: 0.32, // % of string capacity
      dailyEnergyLoss: 0.6, // kWh/day (before fix)
      estimatedMonthlyLoss: 18, // kWh/month (before fix)
      estimatedCostLoss: 1.8, // €/month (before fix)
    },
    solutionRecommendations: [
      {
        action: "Cable Tightening",
        priority: "High",
        description: "Tighten all DC connections to manufacturer specifications",
        estimatedTime: "1 hour",
        cost: "Low",
      },
      {
        action: "Connector Replacement",
        priority: "Medium",
        description: "Replace connectors showing signs of wear or corrosion",
        estimatedTime: "2 hours",
        cost: "Medium (€10-20)",
      },
      {
        action: "Regular Maintenance",
        priority: "Low",
        description: "Schedule quarterly inspections to prevent future loose connections",
        estimatedTime: "2 hours/quarter",
        cost: "Low (€50-100/quarter)",
      },
    ],
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "new":
      return "#f44336"; // Red
    case "under_treatment":
      return "#ff9800"; // Orange
    case "treated":
      return "#4caf50"; // Green
    default:
      return "#757575";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "new":
      return "New";
    case "under_treatment":
      return "Under Treatment";
    case "treated":
      return "Treated";
    default:
      return status;
  }
};

const getSeverityIcon = (severity) => {
  switch (severity) {
    case "high":
      return <ErrorIcon sx={{ color: "#f44336" }} />;
    case "medium":
      return <WarningIcon sx={{ color: "#ff9800" }} />;
    case "low":
      return <InfoIcon sx={{ color: "#2196f3" }} />;
    default:
      return <InfoIcon />;
  }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case "high":
      return "#f44336";
    case "medium":
      return "#ff9800";
    case "low":
      return "#2196f3";
    default:
      return "#757575";
  }
};

function Diagnostics() {
  const { language } = useLanguage();
  const theme = useTheme();
  const t = translations[language];
  const [selectedAnomaly, setSelectedAnomaly] = useState(mockAnomalies[0]);
  const [selectedPlant, setSelectedPlant] = useState("all");

  // Get unique plant names
  const plantNames = useMemo(() => {
    const plants = [...new Set(mockAnomalies.map((a) => a.plantName))];
    return ["all", ...plants];
  }, []);

  // Filter anomalies by plant
  const filteredAnomalies = useMemo(() => {
    if (selectedPlant === "all") return mockAnomalies;
    return mockAnomalies.filter((a) => a.plantName === selectedPlant);
  }, [selectedPlant]);

  // Update selected anomaly when filter changes
  useEffect(() => {
    if (
      selectedAnomaly &&
      !filteredAnomalies.find((a) => a.id === selectedAnomaly.id)
    ) {
      setSelectedAnomaly(filteredAnomalies[0] || null);
    }
  }, [filteredAnomalies, selectedAnomaly]);

  // Generate chart data with electrical metrics showing anomaly
  const generateChartData = (anomaly) => {
    if (!anomaly) return { series: [], options: {} };

    // Generate time series data for the last 24 hours
    const hours = 24;
    const voltageData = [];
    const currentData = [];
    const powerData = [];
    const categories = [];
    const anomalyStartIndex = 20; // Anomaly starts at hour 20

    for (let i = hours - 1; i >= 0; i--) {
      const date = new Date();
      date.setHours(date.getHours() - i);
      categories.push(format(date, "HH:mm"));

      // Normal values
      const normalVoltage = 380;
      const normalCurrent = 5.5;
      const normalPower = normalVoltage * normalCurrent; // ~2090W

      // Anomaly values (when anomaly is active)
      let voltage, current, power;
      if (i >= anomalyStartIndex) {
        // Anomaly period - show deviation
        if (anomaly.classification === "String Mismatch") {
          voltage = anomaly.voltage || 320;
          current = normalCurrent * 0.85; // Reduced current
          power = voltage * current;
        } else if (anomaly.classification === "Hot Spot") {
          voltage = normalVoltage * 0.95; // Slight voltage drop
          current = normalCurrent * 0.9; // Reduced current
          power = voltage * current;
        } else {
          voltage = normalVoltage * (1 - (anomaly.powerReduction || 15) / 100);
          current = normalCurrent * (1 - (anomaly.powerReduction || 15) / 100);
          power = voltage * current;
        }
        // Add some variation
        voltage += (Math.random() - 0.5) * 10;
        current += (Math.random() - 0.5) * 0.3;
        power = voltage * current;
      } else {
        // Normal period
        voltage = normalVoltage + (Math.random() - 0.5) * 5;
        current = normalCurrent + (Math.random() - 0.5) * 0.2;
        power = voltage * current;
      }

      voltageData.push(voltage);
      currentData.push(current);
      powerData.push(power / 1000); // Convert to kW
    }

    return {
      series: [
        {
          name: "Voltage",
          type: "line",
          data: voltageData,
        },
        {
          name: "Current",
          type: "line",
          data: currentData,
        },
        {
          name: "Power",
          type: "line",
          data: powerData,
        },
      ],
      options: {
        chart: {
          type: "line",
          height: 350,
          fontFamily: "Poppins, sans-serif",
          toolbar: { show: false },
          zoom: { enabled: false },
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
        markers: {
          size: 0,
          hover: {
            size: 4,
          },
        },
        xaxis: {
          categories: categories,
          type: "category",
          labels: {
            style: {
              colors: theme.palette.text.secondary,
              fontSize: "11px",
              fontFamily: "Poppins, sans-serif",
            },
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
            title: {
              text: "Voltage (V)",
              style: {
                color: "#2196F3",
                fontSize: "12px",
                fontFamily: "Poppins, sans-serif",
              },
            },
            labels: {
              style: {
                colors: "#2196F3",
                fontSize: "11px",
                fontFamily: "Poppins, sans-serif",
              },
              formatter: (val) => val.toFixed(0),
            },
            axisBorder: {
              show: true,
              color: theme.palette.divider,
              width: 1,
            },
            axisTicks: {
              show: true,
              borderType: "solid",
              color: theme.palette.divider,
              width: 6,
            },
          },
          {
            title: {
              text: "Current (A)",
              style: {
                color: "#4CAF50",
                fontSize: "12px",
                fontFamily: "Poppins, sans-serif",
              },
            },
            labels: {
              style: {
                colors: "#4CAF50",
                fontSize: "11px",
                fontFamily: "Poppins, sans-serif",
              },
              formatter: (val) => val.toFixed(2),
            },
            opposite: true,
            axisBorder: {
              show: true,
              color: theme.palette.divider,
              width: 1,
            },
            axisTicks: {
              show: true,
              borderType: "solid",
              color: theme.palette.divider,
              width: 6,
            },
          },
          {
            title: {
              text: "Power (kW)",
              style: {
                color: "#FF9800",
                fontSize: "12px",
                fontFamily: "Poppins, sans-serif",
              },
            },
            labels: {
              style: {
                colors: "#FF9800",
                fontSize: "11px",
                fontFamily: "Poppins, sans-serif",
              },
              formatter: (val) => val.toFixed(2),
            },
            opposite: true,
            axisBorder: {
              show: true,
              color: theme.palette.divider,
              width: 1,
            },
            axisTicks: {
              show: true,
              borderType: "solid",
              color: theme.palette.divider,
              width: 6,
            },
          },
        ],
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
          style: {
            fontFamily: "Poppins, sans-serif",
          },
          y: {
            formatter: (val, { seriesIndex }) => {
              if (seriesIndex === 0) return `${val.toFixed(0)} V`;
              if (seriesIndex === 1) return `${val.toFixed(2)} A`;
              return `${val.toFixed(2)} kW`;
            },
          },
        },
        colors: ["#2196F3", "#4CAF50", "#FF9800"],
        annotations: {
          xaxis: [
            {
              x: categories[anomalyStartIndex],
              borderColor: getSeverityColor(anomaly.severity),
              label: {
                text: "Anomaly Detected",
                style: {
                  color: "#fff",
                  background: getSeverityColor(anomaly.severity),
                  fontSize: "10px",
                  fontFamily: "Poppins, sans-serif",
                  padding: {
                    left: 5,
                    right: 5,
                    top: 2,
                    bottom: 2,
                  },
                },
              },
            },
          ],
        },
      },
    };
  };

  const chartData = generateChartData(selectedAnomaly);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "background.default",
        p: 2,
      }}
    >
      <Grid container spacing={2} sx={{ height: "calc(100vh - 100px)" }}>
        {/* Left Side - Anomaly List */}
        <Grid item xs={12} md={4}>
          <AnomalyListContainer>
            <Box
              sx={{
                p: 1.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 1,
                  fontSize: "0.95rem",
                }}
              >
                Anomalies & Faults
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                sx={{
                  mb: 1,
                  "& .MuiInputBase-input": {
                    fontSize: "0.875rem",
                    fontFamily: "'Poppins', sans-serif",
                  },
                }}
              >
                {plantNames.map((plant) => (
                  <MenuItem key={plant} value={plant}>
                    {plant === "all" ? "All Plants" : plant}
                  </MenuItem>
                ))}
              </TextField>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "text.secondary",
                }}
              >
                {filteredAnomalies.length} anomaly{filteredAnomalies.length !== 1 ? "ies" : ""}
              </Typography>
            </Box>

            <List
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 0,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor:
                    theme.palette.mode === "light" ? "#f1f1f1" : "#2a2a2a",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor:
                    theme.palette.mode === "light" ? "#c1c1c1" : "#555555",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "light" ? "#a8a8a8" : "#777777",
                  },
                },
              }}
            >
              {filteredAnomalies.map((anomaly, index) => (
                <Fragment key={anomaly.id}>
                  <AnomalyListItem
                    selected={selectedAnomaly?.id === anomaly.id}
                    onClick={() => setSelectedAnomaly(anomaly)}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "transparent",
                        width: 40,
                        height: 40,
                        mr: 1.5,
                      }}
                    >
                      {getSeverityIcon(anomaly.severity)}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                              color: "text.primary",
                            }}
                          >
                            {anomaly.classification}
                          </Typography>
                          <Chip
                            label={getStatusLabel(anomaly.status)}
                            size="small"
                            sx={{
                              height: "20px",
                              fontSize: "0.65rem",
                              fontWeight: 500,
                              backgroundColor: getStatusColor(anomaly.status),
                              color: "white",
                              opacity: 0.6,
                              "& .MuiChip-label": {
                                px: 1,
                              },
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              color: "text.secondary",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            {anomaly.plantName}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <AccessTimeIcon
                              sx={{ fontSize: 12, color: "text.secondary" }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                fontFamily: "'Poppins', sans-serif",
                                color: "text.secondary",
                                fontSize: "0.7rem",
                              }}
                            >
                              {format(anomaly.timestamp, "MMM dd, HH:mm")}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </AnomalyListItem>
                  {index < mockAnomalies.length - 1 && <Divider />}
                </Fragment>
              ))}
            </List>
          </AnomalyListContainer>
        </Grid>

        {/* Right Side - Anomaly Details */}
        <Grid item xs={12} md={8}>
          <DetailCard>
            {selectedAnomaly ? (
              <CardContent sx={{ flex: 1, overflow: "auto", p: 2 }}>
                {/* Header */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 1.5,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: getSeverityColor(selectedAnomaly.severity),
                        width: 40,
                        height: 40,
                      }}
                    >
                      {getSeverityIcon(selectedAnomaly.severity)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          color: "text.primary",
                          mb: 0.5,
                          fontSize: "1.1rem",
                        }}
                      >
                        {selectedAnomaly.classification}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          label={getStatusLabel(selectedAnomaly.status)}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(
                              selectedAnomaly.status
                            ),
                            color: "white",
                            fontWeight: 500,
                            opacity: 0.6,
                          }}
                        />
                        <Chip
                          label={selectedAnomaly.severity.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getSeverityColor(
                              selectedAnomaly.severity
                            ),
                            color: "white",
                            fontWeight: 500,
                            opacity: 0.6,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Divider />
                </Box>

                {/* Plant Details - Single Row */}
                <Paper
                  sx={{
                    p: 1.5,
                    mb: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? "rgba(18, 153, 144, 0.02)"
                        : "rgba(18, 153, 144, 0.05)",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: "150px", textAlign: "center" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        color: "text.secondary",
                        mb: 0.5,
                        fontSize: "0.7rem",
                      }}
                    >
                      Plant
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 500,
                        color: "text.primary",
                        fontSize: "0.875rem",
                      }}
                    >
                      {selectedAnomaly.plantName}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  <Box sx={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: "100px", textAlign: "center" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        color: "text.secondary",
                        mb: 0.5,
                        fontSize: "0.7rem",
                      }}
                    >
                      String ID
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 500,
                        color: "text.primary",
                        fontSize: "0.875rem",
                      }}
                    >
                      {selectedAnomaly.stringId}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  <Box sx={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: "100px", textAlign: "center" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        color: "text.secondary",
                        mb: 0.5,
                        fontSize: "0.7rem",
                      }}
                    >
                      Panel ID
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 500,
                        color: "text.primary",
                        fontSize: "0.875rem",
                      }}
                    >
                      {selectedAnomaly.panelId}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  <Box sx={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: "150px", textAlign: "center" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        color: "text.secondary",
                        mb: 0.5,
                        fontSize: "0.7rem",
                      }}
                    >
                      Detected At
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 500,
                        color: "text.primary",
                        fontSize: "0.875rem",
                      }}
                    >
                      {format(selectedAnomaly.timestamp, "MMM dd, yyyy HH:mm")}
                    </Typography>
                  </Box>
                </Paper>

                {/* Description */}
                <Paper
                  sx={{
                    p: 1.5,
                    mb: 2,
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? "rgba(18, 153, 144, 0.05)"
                        : "rgba(18, 153, 144, 0.1)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: "text.primary",
                      fontSize: "0.875rem",
                    }}
                  >
                    {selectedAnomaly.description}
                  </Typography>
                </Paper>

                {/* Power Loss Information */}
                {selectedAnomaly.powerLoss && (
                  <Card sx={{ p: 1.5, mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: "text.primary",
                        mb: 1.5,
                        fontSize: "0.95rem",
                      }}
                    >
                      Power Loss Impact
                    </Typography>
                    <Grid container spacing={1.5}>
                      <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: 1, textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              color: "text.secondary",
                              fontSize: "0.7rem",
                            }}
                          >
                            Current Loss
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                              color: "#f44336",
                              fontSize: "0.9rem",
                            }}
                          >
                            {selectedAnomaly.powerLoss.current} kW
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: 1, textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              color: "text.secondary",
                              fontSize: "0.7rem",
                            }}
                          >
                            Daily Loss
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                              color: "#ff9800",
                              fontSize: "0.9rem",
                            }}
                          >
                            {selectedAnomaly.powerLoss.dailyEnergyLoss} kWh
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: 1, textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              color: "text.secondary",
                              fontSize: "0.7rem",
                            }}
                          >
                            Monthly Loss
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                              color: "#ff9800",
                              fontSize: "0.9rem",
                            }}
                          >
                            {selectedAnomaly.powerLoss.estimatedMonthlyLoss} kWh
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: 1, textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              color: "text.secondary",
                              fontSize: "0.7rem",
                            }}
                          >
                            Cost Impact
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                              color: "#4caf50",
                              fontSize: "0.9rem",
                            }}
                          >
                            €{selectedAnomaly.powerLoss.estimatedCostLoss}/mo
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Card>
                )}

                {/* Solution Recommendations */}
                <Card sx={{ p: 1.5, mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "text.primary",
                      mb: 1.5,
                      fontSize: "0.95rem",
                    }}
                  >
                    Solution Recommendations
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {selectedAnomaly.solutionRecommendations?.map(
                      (solution, index) => (
                        <Paper
                          key={index}
                          sx={{
                            p: 1.5,
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundColor:
                              theme.palette.mode === "light"
                                ? "rgba(18, 153, 144, 0.03)"
                                : "rgba(18, 153, 144, 0.05)",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                              color: "text.primary",
                              fontSize: "0.875rem",
                              mb: 1,
                            }}
                          >
                            {solution.action}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              color: "text.secondary",
                              fontSize: "0.75rem",
                              display: "block",
                              mb: 1,
                            }}
                          >
                            {solution.description}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              color: "text.secondary",
                              fontSize: "0.7rem",
                            }}
                          >
                            ⏱️ {solution.estimatedTime}
                          </Typography>
                        </Paper>
                      )
                    )}
                  </Box>
                </Card>

                {/* Chart */}
                <Card sx={{ mb: 2, p: 1.5 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "text.primary",
                      mb: 1.5,
                      fontSize: "0.95rem",
                    }}
                  >
                    Electrical Metrics (Last 24 Hours)
                  </Typography>
                  {chartData.series.length > 0 && (
                    <ReactApexChart
                      options={chartData.options}
                      series={chartData.series}
                      type="line"
                      height={280}
                    />
                  )}
                </Card>


                {/* Thermal Image */}
                <Card sx={{ p: 1.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: "text.primary",
                        fontSize: "0.95rem",
                      }}
                    >
                      Thermal Image
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        textAlign: "right",
                      }}
                    >
                      Captured by drone {selectedAnomaly.droneId || "N/A"} at{" "}
                      {selectedAnomaly.thermalImageCapturedAt
                        ? format(
                            selectedAnomaly.thermalImageCapturedAt,
                            "MMM dd, yyyy HH:mm"
                          )
                        : "N/A"}
                    </Typography>
                  </Box>
                  <ThermalImageContainer>
                    <img
                      src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&h=600&fit=crop&q=80"
                      alt="Thermal Image"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "sepia(100%) saturate(300%) hue-rotate(-10deg) brightness(1.2) contrast(1.1)",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        const fallback = document.createElement("div");
                        fallback.style.cssText = `
                          text-align: center;
                          color: ${theme.palette.text.secondary};
                          padding: 20px;
                        `;
                        fallback.innerHTML = `
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="opacity: 0.5; margin-bottom: 8px;">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                          </svg>
                          <p style="font-family: 'Poppins', sans-serif; margin: 0;">Thermal Image</p>
                          <p style="font-family: 'Poppins', sans-serif; font-size: 0.75rem; margin-top: 4px;">Location: Row ${selectedAnomaly.location.row}, Column ${selectedAnomaly.location.column}</p>
                        `;
                        e.target.parentElement.appendChild(fallback);
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "0.7rem",
                        }}
                      >
                        Row {selectedAnomaly.location.row}, Column{" "}
                        {selectedAnomaly.location.column}
                      </Typography>
                    </Box>
                  </ThermalImageContainer>
                </Card>
              </CardContent>
            ) : (
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "text.secondary",
                  }}
                >
                  Select an anomaly to view details
                </Typography>
              </CardContent>
            )}
          </DetailCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Diagnostics;
