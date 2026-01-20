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
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import { format } from "date-fns";
import Footer from "../components/GloabalComponents/Footer";

// Styled components
const AnomalyListContainer = styled(Card)(({ theme }) => ({
  height: "calc(100vh - 120px)",
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
  height: "calc(100vh - 120px)",
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

const getStatusLabel = (status, t) => {
  switch (status) {
    case "new":
      return t.diagnostics.status.new;
    case "under_treatment":
      return t.diagnostics.status.underTreatment;
    case "treated":
      return t.diagnostics.status.treated;
    default:
      return status;
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

const getSeverityIcon = (severity, theme) => {
  return <WarningIcon sx={{ color: theme.palette.text.primary }} />;
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

  // Generate SCADA-style PV production chart with realistic bell curve and visible anomalies
  const generateChartData = (anomaly) => {
    if (!anomaly) return { series: [], options: {} };

    // Generate daytime hours only (6 AM to 6 PM = 12 hours)
    const startHour = 6;
    const endHour = 18;
    const totalHours = endHour - startHour;
    const powerData = [];
    const normalPowerData = [];
    const categories = [];
    const anomalyZones = [];

    // Plant capacity for scaling
    const plantCapacity = anomaly.plantCapacity || 20; // kW
    const peakPower = plantCapacity * 0.85; // 85% of capacity at peak

    // Determine anomaly type and time range
    let anomalyStartHour = 0;
    let anomalyEndHour = 0;
    let anomalyType = "";
    let powerLoss = 0;
    let anomalyStyle = "drop"; // "drop", "zero", "underperformance"

    if (anomaly.classification === "Inverter Fault") {
      anomalyStartHour = 11; // 11 AM
      anomalyEndHour = 13; // 1 PM
      anomalyType = "Inverter Trip";
      powerLoss = peakPower * 0.6; // 60% drop
      anomalyStyle = "drop";
    } else if (anomaly.classification === "String Mismatch") {
      anomalyStartHour = 10; // 10 AM
      anomalyEndHour = 14; // 2 PM
      anomalyType = "Partial Inverter Fault";
      powerLoss = peakPower * 0.4; // 40% drop
      anomalyStyle = "drop";
    } else if (anomaly.classification === "Shading Issue") {
      anomalyStartHour = 9; // 9 AM
      anomalyEndHour = 15; // 3 PM
      anomalyType = "Shading/Soiling";
      powerLoss = peakPower * 0.25; // 25% reduction
      anomalyStyle = "underperformance";
    } else if (anomaly.classification === "Hot Spot") {
      anomalyStartHour = 12; // 12 PM (noon)
      anomalyEndHour = 14; // 2 PM
      anomalyType = "Hot Spot Degradation";
      powerLoss = peakPower * 0.3; // 30% reduction
      anomalyStyle = "underperformance";
    } else if (anomaly.classification === "Cell Degradation") {
      anomalyStartHour = 8; // 8 AM
      anomalyEndHour = 16; // 4 PM
      anomalyType = "Cell Degradation";
      powerLoss = peakPower * 0.15; // 15% reduction
      anomalyStyle = "underperformance";
    } else {
      // Default: data loss scenario
      anomalyStartHour = 13; // 1 PM
      anomalyEndHour = 14; // 2 PM
      anomalyType = "Data Loss";
      powerLoss = peakPower;
      anomalyStyle = "zero";
    }

    // Generate bell-shaped solar production curve
    for (let hour = startHour; hour <= endHour; hour++) {
      const timeLabel = `${hour.toString().padStart(2, "0")}:00`;
      categories.push(timeLabel);

      // Calculate position in day (0 = sunrise, 1 = sunset)
      const dayPosition = (hour - startHour) / totalHours;

      // Bell curve: peak at midday (hour 12, position 0.5)
      const peakPosition = 0.5;
      const distanceFromPeak = Math.abs(dayPosition - peakPosition);
      
      // Bell curve formula: smooth rise and fall
      let solarFactor = 0;
      if (dayPosition >= 0 && dayPosition <= 1) {
        // Gaussian-like curve
        const sigma = 0.3; // Controls curve width
        solarFactor = Math.exp(-Math.pow((dayPosition - peakPosition) / sigma, 2) / 2);
      }

      // Base power with realistic variation
      const basePower = peakPower * solarFactor;
      const variation = (Math.random() - 0.5) * peakPower * 0.05; // 5% variation
      const normalPower = Math.max(0, basePower + variation);

      // Apply anomaly based on type
      let actualPower = normalPower;
      const isInAnomalyZone = hour >= anomalyStartHour && hour < anomalyEndHour;

      if (isInAnomalyZone) {
        if (anomalyStyle === "zero") {
          // Flat zero power (data loss or inverter OFF)
          actualPower = 0;
        } else if (anomalyStyle === "drop") {
          // Sudden power drop (partial inverter fault)
          actualPower = normalPower * 0.4; // 60% drop
          // Add some noise to make it look realistic
          actualPower += (Math.random() - 0.5) * peakPower * 0.02;
        } else if (anomalyStyle === "underperformance") {
          // Underperformance zone (soiling or shading)
          const reduction = powerLoss / peakPower;
          actualPower = normalPower * (1 - reduction);
          // Maintain curve shape but reduced
          actualPower += (Math.random() - 0.5) * peakPower * 0.03;
        }
      }

      powerData.push(Math.max(0, actualPower));
      normalPowerData.push(normalPower);
    }

    // Create anomaly zones for annotations
    const anomalyStartIndex = anomalyStartHour - startHour;
    const anomalyEndIndex = anomalyEndHour - startHour;

    // Create tooltip formatter with closure access to variables
    const createTooltipFormatter = () => {
      return function({ series, seriesIndex, dataPointIndex, w }) {
        const hour = startHour + dataPointIndex;
        const isInAnomalyZone = hour >= anomalyStartHour && hour < anomalyEndHour;
        const powerValue = series[seriesIndex][dataPointIndex];
        const normalValue = normalPowerData[dataPointIndex];
        const loss = normalValue - powerValue;
        
        let html = `
          <div style="padding: 10px; font-family: 'Poppins', sans-serif; background: ${theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff'}; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
            <div style="font-weight: 600; margin-bottom: 6px; color: ${theme.palette.text.primary};">
              ${categories[dataPointIndex]}
            </div>
            <div style="color: #129990; font-size: 16px; font-weight: 600; margin-bottom: ${isInAnomalyZone && loss > 0.1 ? '8px' : '0'};">
              Power: ${powerValue.toFixed(2)} kW
            </div>
        `;
        
        if (isInAnomalyZone && loss > 0.1) {
          html += `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid ${theme.palette.divider};">
              <div style="color: ${getSeverityColor(anomaly.severity)}; font-weight: 600; font-size: 12px; margin-bottom: 4px;">
                ⚠️ ${anomalyType}
              </div>
              <div style="color: #f44336; font-size: 11px;">
                Estimated Loss: ${loss.toFixed(2)} kW
              </div>
            </div>
          `;
        }
        
        html += `</div>`;
        return html;
      };
    };

    return {
      series: [
        {
          name: "Power Production",
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
          width: 3,
          colors: ["#129990"],
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.6,
            opacityTo: 0.1,
            stops: [0, 50, 100],
            colorStops: [
              {
                offset: 0,
                color: "#129990",
                opacity: 0.6,
              },
              {
                offset: 50,
                color: "#129990",
                opacity: 0.3,
              },
              {
                offset: 100,
                color: "#129990",
                opacity: 0.1,
              },
            ],
          },
        },
        markers: {
          size: 0,
          hover: {
            size: 6,
          },
        },
        xaxis: {
          categories: categories,
          type: "category",
          title: {
            text: "Time (Daytime Hours)",
            style: {
              color: theme.palette.text.primary,
              fontSize: "12px",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            },
          },
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
        yaxis: {
          title: {
            text: "Power (kW)",
            style: {
              color: theme.palette.text.primary,
              fontSize: "12px",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            },
          },
          labels: {
            style: {
              colors: theme.palette.text.secondary,
              fontSize: "11px",
              fontFamily: "Poppins, sans-serif",
            },
            formatter: (val) => val.toFixed(1),
          },
          min: 0,
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
          shared: false,
          theme: theme.palette.mode,
          style: {
            fontFamily: "Poppins, sans-serif",
            fontSize: "12px",
          },
          custom: createTooltipFormatter(),
        },
        colors: ["#129990"],
        annotations: {
          xaxis: [
            {
              x: categories[anomalyStartIndex],
              x2: categories[anomalyEndIndex - 1],
              fillColor: getSeverityColor(anomaly.severity),
              opacity: 0.2,
              borderColor: getSeverityColor(anomaly.severity),
              borderWidth: 2,
              strokeDashArray: anomalyStyle === "zero" ? 5 : 0,
              label: {
                text: `⚠️ ${anomalyType}`,
                style: {
                  color: "#fff",
                  background: getSeverityColor(anomaly.severity),
                  fontSize: "11px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  padding: {
                    left: 8,
                    right: 8,
                    top: 4,
                    bottom: 4,
                  },
                },
                orientation: "horizontal",
                offsetY: -10,
              },
            },
          ],
          points: [
            {
              x: categories[anomalyStartIndex],
              seriesIndex: 0,
              y: powerData[anomalyStartIndex],
              marker: {
                size: 8,
                fillColor: getSeverityColor(anomaly.severity),
                strokeColor: "#fff",
                strokeWidth: 2,
              },
            },
            {
              x: categories[anomalyEndIndex - 1],
              seriesIndex: 0,
              y: powerData[anomalyEndIndex - 1],
              marker: {
                size: 8,
                fillColor: getSeverityColor(anomaly.severity),
                strokeColor: "#fff",
                strokeWidth: 2,
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
        backgroundColor: "background.default",
        p: 2,
      }}
    >
      <Grid container spacing={2}>
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
                {t.diagnostics.title}
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
                    {plant === "all" ? t.diagnostics.allPlants : plant}
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
                {filteredAnomalies.length} {filteredAnomalies.length !== 1 ? t.diagnostics.anomalies : t.diagnostics.anomaly}
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
                      {getSeverityIcon(anomaly.severity, theme)}
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
                            label={getStatusLabel(anomaly.status, t)}
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
                      {getSeverityIcon(selectedAnomaly.severity, theme)}
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
                          label={getStatusLabel(selectedAnomaly.status, t)}
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
                      {t.diagnostics.plant}
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
                      {t.diagnostics.stringId}
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
                      {t.diagnostics.panelId}
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
                      {t.diagnostics.detectedAt}
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
                      {t.diagnostics.powerLossImpact}
                    </Typography>
                    <Grid container spacing={1.5} justifyContent="center">
                      <Grid item xs={12} sm={4}>
                        <Paper sx={{ p: 1.5, textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              color: "text.secondary",
                              fontSize: "0.7rem",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            {t.diagnostics.currentLoss}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                              color: "#f44336",
                              fontSize: "0.9rem",
                              display: "block",
                            }}
                          >
                            {selectedAnomaly.powerLoss.current} kW
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Paper sx={{ p: 1.5, textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              color: "text.secondary",
                              fontSize: "0.7rem",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            {t.diagnostics.dailyLoss}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                              color: "#ff9800",
                              fontSize: "0.9rem",
                              display: "block",
                            }}
                          >
                            {selectedAnomaly.powerLoss.dailyEnergyLoss} kWh
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Paper sx={{ p: 1.5, textAlign: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              color: "text.secondary",
                              fontSize: "0.7rem",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            {t.diagnostics.monthlyLoss}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                              color: "#ff9800",
                              fontSize: "0.9rem",
                              display: "block",
                            }}
                          >
                            {selectedAnomaly.powerLoss.estimatedMonthlyLoss} kWh
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Card>
                )}

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
                    {t.diagnostics.powerProduction}
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
                      {t.diagnostics.thermalImage}
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
                      {t.diagnostics.capturedBy} {selectedAnomaly.droneId || "N/A"} {t.diagnostics.at}{" "}
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
                      src="/thermal-pv.png"
                      alt="Thermal Image"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
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
                        backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.7)",
                        color: theme.palette.mode === "dark" ? theme.palette.text.primary : "white",
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
                    {t.diagnostics.solutionRecommendations}
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
                  {t.diagnostics.selectAnomaly}
                </Typography>
              </CardContent>
            )}
          </DetailCard>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default Diagnostics;
