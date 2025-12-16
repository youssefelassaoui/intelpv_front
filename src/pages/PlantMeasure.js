"use client";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Chip,
  Divider,
  Tooltip,
  IconButton,
  Alert,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Zap, Cloud, AlertTriangle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
import MetricsHeader from "../components/PlantMeasure/MetricsHeader";
import Footer from "../components/GloabalComponents/Footer";
import CustomDateRangePicker from "../components/GloabalComponents/CustomDateRangePicker";
import ChartSection from "../components/PlantMeasure/ChartSection";
import PowerCharts from "../components/OverView/PowerCharts";
import DCMetricsChart from "../components/PlantMeasure/DCMetricsChart";
import WeatherMetricsChart from "../components/PlantMeasure/WeatherMetricsChart";
import SolarIrradianceChart from "../components/PlantMeasure/SolarIrradianceChart";
import PlantCard from "../components/OverView/PlantCard";
import StatusDataGrid from "../components/PlantMeasure/StatusDataGrid";
import { fetchDevicesByPlant, fetchFilteredMeasures } from "../services/api";

const PlantMeasures = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [devices, setDevices] = useState([]);
  
  const getDefaultDateRange = () => {
    const start = new Date("2025-09-01T00:00:00Z");
    const end = new Date("2025-09-20T23:59:59Z");
    return { start, end };
  };

  const defaultDates = getDefaultDateRange();

  const [powerStartDate, setPowerStartDate] = useState(defaultDates.start);
  const [powerEndDate, setPowerEndDate] = useState(defaultDates.end);
  const [powerDeviceId, setPowerDeviceId] = useState("");
  const [powerMeasures, setPowerMeasures] = useState([]);
  const [loadingPowerMeasures, setLoadingPowerMeasures] = useState(false);
  const [powerError, setPowerError] = useState(null);
  
  const [currentStartDate, setCurrentStartDate] = useState(defaultDates.start);
  const [currentEndDate, setCurrentEndDate] = useState(defaultDates.end);
  const [currentDeviceId, setCurrentDeviceId] = useState("");
  const [currentFilter, setCurrentFilter] = useState("A");
  const [currentMeasures, setCurrentMeasures] = useState([]);
  const [loadingCurrentMeasures, setLoadingCurrentMeasures] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  
  const [voltageStartDate, setVoltageStartDate] = useState(defaultDates.start);
  const [voltageEndDate, setVoltageEndDate] = useState(defaultDates.end);
  const [voltageDeviceId, setVoltageDeviceId] = useState("");
  const [voltageFilter, setVoltageFilter] = useState("A");
  const [voltageMeasures, setVoltageMeasures] = useState([]);
  const [loadingVoltageMeasures, setLoadingVoltageMeasures] = useState(false);
  const [voltageError, setVoltageError] = useState(null);

  const [statusStartDate, setStatusStartDate] = useState(defaultDates.start);
  const [statusEndDate, setStatusEndDate] = useState(defaultDates.end);
  const [statusDeviceId, setStatusDeviceId] = useState("");
  const [statusMeasures, setStatusMeasures] = useState([]);
  const [loadingStatusMeasures, setLoadingStatusMeasures] = useState(false);
  const [statusError, setStatusError] = useState(null);

  const [selectedPlant, setSelectedPlant] = useState(location.state?.plant || null);

  const plants = [
    {
      id: 1,
      name: "Green & Smart Building Park (Brique Rouge)",
      plantId: 49951765,
      image: "/gsbp.png",
      location: "Ben Guerir 43150, MO",
      capacity: "6 kW",
      strings: 3,
      status: "Active",
    },
    {
      id: 2,
      name: "Green Energy Park (Trina)",
      plantId: null,
      image: "/trina.png",
      location: "Route Régionale Kelaa Km 3, R206, Ben Guerir, MO",
      capacity: "22.23 kW",
      strings: 6,
      status: "Active",
    },
    {
      id: 3,
      name: "Hospital Universario Rien Sofía",
      plantId: 36076361,
      image: "/hospital.jpeg",
      location: "Av. Menéndez Pidal, s/n, Poniente Sur, 14004 Córdoba, ES",
      capacity: "1.72 MW",
      strings: 274,
      status: "Maintenance",
    },
    {
      id: 4,
      name: "Mohammed VI Museum of Modern and Contemporary Art",
      plantId: 33783322,
      image: "/musee.jpg",
      location: " 2 Av. Moulay Hassan, Rabat, MO",
      capacity: "136 KW",
      strings: 20,
      status: "Active",
    },
    {
      id: 6,
      name: "SESA Project (Douar)",
      plantId: null,
      image: "/douar.jpeg",
      location: "64F2+734, Ben Guerir",
      capacity: "25 KW",
      strings: 2,
      status: "Active",
    },
  ];

  const handlePlantSelect = (plant) => {
    setSelectedPlant(plant);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (selectedPlant?.name === "Green & Smart Building Park (Brique Rouge)") {
      const defaultStartDate = new Date("2025-10-01T00:00:00Z");
      const defaultEndDate = new Date("2025-10-10T23:59:59Z");
      
      setPowerStartDate(defaultStartDate);
      setPowerEndDate(defaultEndDate);
      setCurrentStartDate(defaultStartDate);
      setCurrentEndDate(defaultEndDate);
      setVoltageStartDate(defaultStartDate);
      setVoltageEndDate(defaultEndDate);
      setStatusStartDate(defaultStartDate);
      setStatusEndDate(defaultEndDate);
      
      setPowerDeviceId("49964390");
      setCurrentDeviceId("49964390");
      setVoltageDeviceId("49964390");
      setStatusDeviceId("49964390");
      
      setCurrentFilter("A");
      setVoltageFilter("A");
    }
  }, [selectedPlant]);

  useEffect(() => {
    const loadDevices = async () => {
      console.log("loadDevices called, selectedPlant:", selectedPlant);
      if (!selectedPlant) {
        console.log("No selectedPlant found");
        setDevices([]);
        if (selectedPlant?.name !== "Green & Smart Building Park (Brique Rouge)") {
          setPowerDeviceId("");
          setCurrentDeviceId("");
          setVoltageDeviceId("");
          setStatusDeviceId("");
        }
        return;
      }
      if (!selectedPlant.plantId) {
        console.log("No plantId found in selectedPlant:", selectedPlant);
        setDevices([]);
        if (selectedPlant?.name !== "Green & Smart Building Park (Brique Rouge)") {
          setPowerDeviceId("");
          setCurrentDeviceId("");
          setVoltageDeviceId("");
          setStatusDeviceId("");
        }
        return;
      }
      try {
        console.log("Fetching devices for plantId:", selectedPlant.plantId);
        const data = await fetchDevicesByPlant(selectedPlant.plantId);
        console.log("Fetched devices response:", data);
        const devicesList = Array.isArray(data) ? data : [];
        console.log("Setting devices:", devicesList);
        setDevices(devicesList);
        if (devicesList.length > 0) {
          if (selectedPlant?.name === "Green & Smart Building Park (Brique Rouge)") {
            const briqueRougeDevice = devicesList.find(device => 
              device.key.deviceId === 49964390 || 
              device.deviceName?.toLowerCase().includes("brique rouge")
            );
            if (briqueRougeDevice) {
              const deviceIdStr = briqueRougeDevice.key.deviceId.toString();
              if (!powerDeviceId || powerDeviceId !== deviceIdStr) setPowerDeviceId(deviceIdStr);
              if (!currentDeviceId || currentDeviceId !== deviceIdStr) setCurrentDeviceId(deviceIdStr);
              if (!voltageDeviceId || voltageDeviceId !== deviceIdStr) setVoltageDeviceId(deviceIdStr);
              if (!statusDeviceId || statusDeviceId !== deviceIdStr) setStatusDeviceId(deviceIdStr);
            } else {
              const deviceIdStr = "49964390";
              setPowerDeviceId(deviceIdStr);
              setCurrentDeviceId(deviceIdStr);
              setVoltageDeviceId(deviceIdStr);
              setStatusDeviceId(deviceIdStr);
            }
          } else {
            const firstDeviceId = devicesList[0]?.key?.deviceId || "";
            console.log("Setting device IDs to:", firstDeviceId);
            setPowerDeviceId(firstDeviceId);
            setCurrentDeviceId(firstDeviceId);
            setVoltageDeviceId(firstDeviceId);
            setStatusDeviceId(firstDeviceId);
          }
        } else {
          if (selectedPlant?.name !== "Green & Smart Building Park (Brique Rouge)") {
            setPowerDeviceId("");
            setCurrentDeviceId("");
            setVoltageDeviceId("");
            setStatusDeviceId("");
          }
        }
      } catch (e) {
        console.error("Error fetching devices:", e);
        setDevices([]);
        setPowerDeviceId("");
        setCurrentDeviceId("");
        setVoltageDeviceId("");
      }
    };
    loadDevices();
  }, [selectedPlant]);

  useEffect(() => {
    const loadPowerMeasures = async () => {
      if (!selectedPlant?.plantId || !powerDeviceId || !powerStartDate || !powerEndDate) {
        setPowerMeasures([]);
        return;
      }

      setLoadingPowerMeasures(true);
      setPowerError(null);
      
      try {
        const powerResponse = await fetchFilteredMeasures(selectedPlant.plantId, powerDeviceId, "outputActivePower", powerStartDate, powerEndDate);

        if (powerResponse?.error || powerResponse?.status === 500) {
          throw new Error(powerResponse?.message || "Database connection error. Please try again later.");
        }

        const powerData = Array.isArray(powerResponse) ? powerResponse : (powerResponse?.data || powerResponse?.measures || []);
        setPowerMeasures(Array.isArray(powerData) ? powerData : []);
      } catch (error) {
        console.error("Error fetching power measures:", error);
        const errorMessage = error.message || "Failed to fetch power data. Please check your database connection.";
        setPowerError(errorMessage);
        setPowerMeasures([]);
      } finally {
        setLoadingPowerMeasures(false);
      }
    };

    loadPowerMeasures();
  }, [selectedPlant?.plantId, powerDeviceId, powerStartDate, powerEndDate]);

  useEffect(() => {
    const loadCurrentMeasures = async () => {
      if (!selectedPlant?.plantId || !currentDeviceId || !currentStartDate || !currentEndDate) {
        setCurrentMeasures([]);
        return;
      }

      setLoadingCurrentMeasures(true);
      setCurrentError(null);
      
      try {
        const currentVariable = `${currentFilter}outputElectricity`;
        const currentResponse = await fetchFilteredMeasures(selectedPlant.plantId, currentDeviceId, currentVariable, currentStartDate, currentEndDate);

        if (currentResponse?.error || currentResponse?.status === 500) {
          throw new Error(currentResponse?.message || "Database connection error. Please try again later.");
        }

        const currentData = Array.isArray(currentResponse) ? currentResponse : (currentResponse?.data || currentResponse?.measures || []);
        setCurrentMeasures(Array.isArray(currentData) ? currentData : []);
      } catch (error) {
        console.error("Error fetching current measures:", error);
        const errorMessage = error.message || "Failed to fetch current data. Please check your database connection.";
        setCurrentError(errorMessage);
        setCurrentMeasures([]);
      } finally {
        setLoadingCurrentMeasures(false);
      }
    };

    loadCurrentMeasures();
  }, [selectedPlant?.plantId, currentDeviceId, currentStartDate, currentEndDate, currentFilter]);

  useEffect(() => {
    const loadVoltageMeasures = async () => {
      if (!selectedPlant?.plantId || !voltageDeviceId || !voltageStartDate || !voltageEndDate) {
        setVoltageMeasures([]);
        return;
      }

      setLoadingVoltageMeasures(true);
      setVoltageError(null);
      
      try {
        const voltageVariable = `${voltageFilter}outputVoltage`;
        const voltageResponse = await fetchFilteredMeasures(selectedPlant.plantId, voltageDeviceId, voltageVariable, voltageStartDate, voltageEndDate);

        if (voltageResponse?.error || voltageResponse?.status === 500) {
          throw new Error(voltageResponse?.message || "Database connection error. Please try again later.");
        }

        const voltageData = Array.isArray(voltageResponse) ? voltageResponse : (voltageResponse?.data || voltageResponse?.measures || []);
        setVoltageMeasures(Array.isArray(voltageData) ? voltageData : []);
      } catch (error) {
        console.error("Error fetching voltage measures:", error);
        const errorMessage = error.message || "Failed to fetch voltage data. Please check your database connection.";
        setVoltageError(errorMessage);
        setVoltageMeasures([]);
      } finally {
        setLoadingVoltageMeasures(false);
      }
    };

    loadVoltageMeasures();
  }, [selectedPlant?.plantId, voltageDeviceId, voltageStartDate, voltageEndDate, voltageFilter]);

  useEffect(() => {
    const loadStatusMeasures = async () => {
      if (!selectedPlant?.plantId || !statusDeviceId || !statusStartDate || !statusEndDate) {
        setStatusMeasures([]);
        return;
      }

      setLoadingStatusMeasures(true);
      setStatusError(null);
      
      try {
        const statusResponse = await fetchFilteredMeasures(selectedPlant.plantId, statusDeviceId, "Status", statusStartDate, statusEndDate);

        if (statusResponse?.error || statusResponse?.status === 500) {
          throw new Error(statusResponse?.message || "Database connection error. Please try again later.");
        }

        const statusData = Array.isArray(statusResponse) ? statusResponse : (statusResponse?.data || statusResponse?.measures || []);
        setStatusMeasures(Array.isArray(statusData) ? statusData : []);
      } catch (error) {
        console.error("Error fetching status measures:", error);
        const errorMessage = error.message || "Failed to fetch status data. Please check your database connection.";
        setStatusError(errorMessage);
        setStatusMeasures([]);
      } finally {
        setLoadingStatusMeasures(false);
      }
    };

    loadStatusMeasures();
  }, [selectedPlant?.plantId, statusDeviceId, statusStartDate, statusEndDate]);
  
  const powerDateRangePicker = (
    <Tooltip title={t.common.selectTimeRange} arrow placement="top">
      <Box>
        <CustomDateRangePicker
          startDate={powerStartDate}
          endDate={powerEndDate}
          onRangeChange={(start, end) => {
            setPowerStartDate(start);
            setPowerEndDate(end);
          }}
        />
      </Box>
    </Tooltip>
  );

  const currentDateRangePicker = (
    <Tooltip title={t.common.selectTimeRange} arrow placement="top">
      <Box>
        <CustomDateRangePicker
          startDate={currentStartDate}
          endDate={currentEndDate}
          onRangeChange={(start, end) => {
            setCurrentStartDate(start);
            setCurrentEndDate(end);
          }}
        />
      </Box>
    </Tooltip>
  );

  const voltageDateRangePicker = (
    <Tooltip title={t.common.selectTimeRange} arrow placement="top">
      <Box>
        <CustomDateRangePicker
          startDate={voltageStartDate}
          endDate={voltageEndDate}
          onRangeChange={(start, end) => {
            setVoltageStartDate(start);
            setVoltageEndDate(end);
          }}
        />
      </Box>
    </Tooltip>
  );
  
  const currentFilterChips = (
    <Tooltip title={t.common.selectVariable} arrow placement="top">
      <TextField
        select
        size="small"
        value={currentFilter}
        onChange={(e) => setCurrentFilter(e.target.value)}
        sx={{ 
          minWidth: 160, 
          maxWidth: 200,
          "& .MuiInputBase-input": { 
            fontSize: "10px", 
            py: 0.5,
            fontFamily: "Poppins, sans-serif",
            color: "text.primary"
          },
          "& .MuiOutlinedInput-root": { 
            height: "24px",
            minHeight: "24px",
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: "6px",
            padding: "4px 8px",
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "action.hover",
            },
            "& fieldset": {
              border: "none"
            }
          },
          "& .MuiSelect-select": {
            padding: "0 !important",
            paddingRight: "28px !important",
            display: "flex",
            alignItems: "center",
            fontSize: "10px",
            fontFamily: "Poppins, sans-serif"
          },
          "& .MuiSelect-icon": {
            right: "8px",
            color: "primary.main"
          }
        }}
        SelectProps={{
          displayEmpty: true,
          renderValue: (value) => {
            const labels = {
              "A": "AoutputElectricity",
              "B": "BoutputElectricity",
              "C": "CoutputElectricity"
            };
            return labels[value] || "Select";
          },
          MenuProps: {
            PaperProps: {
              sx: { 
                maxHeight: 250,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                mt: 1,
                backgroundColor: "background.paper",
                "& .MuiMenuItem-root": { 
                  fontSize: "10px", 
                  py: 0.75,
                  fontFamily: "Poppins, sans-serif",
                  color: "text.primary",
                  "&:hover": {
                    backgroundColor: "action.hover"
                  },
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "primary.dark"
                    }
                  }
                },
                zIndex: 1300
              },
            },
          },
        }}
      >
        <MenuItem value="A" sx={{ fontSize: "10px", fontFamily: "Poppins, sans-serif" }}>
          AoutputElectricity
        </MenuItem>
        <MenuItem value="B" sx={{ fontSize: "10px", fontFamily: "Poppins, sans-serif" }}>
          BoutputElectricity
        </MenuItem>
        <MenuItem value="C" sx={{ fontSize: "10px", fontFamily: "Poppins, sans-serif" }}>
          CoutputElectricity
        </MenuItem>
      </TextField>
    </Tooltip>
  );
  
  const voltageFilterChips = (
    <Tooltip title={t.common.selectVariable} arrow placement="top">
      <TextField
        select
        size="small"
        value={voltageFilter}
        onChange={(e) => setVoltageFilter(e.target.value)}
        sx={{ 
          minWidth: 160, 
          maxWidth: 200,
          "& .MuiInputBase-input": { 
            fontSize: "10px", 
            py: 0.5,
            fontFamily: "Poppins, sans-serif",
            color: "text.primary"
          },
          "& .MuiOutlinedInput-root": { 
            height: "24px",
            minHeight: "24px",
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: "6px",
            padding: "4px 8px",
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "action.hover",
            },
            "& fieldset": {
              border: "none"
            }
          },
          "& .MuiSelect-select": {
            padding: "0 !important",
            paddingRight: "28px !important",
            display: "flex",
            alignItems: "center",
            fontSize: "10px",
            fontFamily: "Poppins, sans-serif"
          },
          "& .MuiSelect-icon": {
            right: "8px",
            color: "primary.main"
          }
        }}
        SelectProps={{
          displayEmpty: true,
          renderValue: (value) => {
            const labels = {
              "A": "AoutputVoltage",
              "B": "BoutputVoltage",
              "C": "CoutputVoltage"
            };
            return labels[value] || "Select";
          },
          MenuProps: {
            PaperProps: {
              sx: { 
                maxHeight: 250,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                mt: 1,
                backgroundColor: "background.paper",
                "& .MuiMenuItem-root": { 
                  fontSize: "10px", 
                  py: 0.75,
                  fontFamily: "Poppins, sans-serif",
                  color: "text.primary",
                  "&:hover": {
                    backgroundColor: "action.hover"
                  },
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "primary.dark"
                    }
                  }
                },
                zIndex: 1300
              },
            },
          },
        }}
      >
        <MenuItem value="A" sx={{ fontSize: "10px", fontFamily: "Poppins, sans-serif" }}>
          AoutputVoltage
        </MenuItem>
        <MenuItem value="B" sx={{ fontSize: "10px", fontFamily: "Poppins, sans-serif" }}>
          BoutputVoltage
        </MenuItem>
        <MenuItem value="C" sx={{ fontSize: "10px", fontFamily: "Poppins, sans-serif" }}>
          CoutputVoltage
        </MenuItem>
      </TextField>
    </Tooltip>
  );
  
  const createDeviceSelect = (deviceId, setDeviceId) => selectedPlant?.plantId ? (
    <Tooltip title={t.common.selectDevice} arrow placement="top">
      <TextField
        select
        size="small"
        value={deviceId || ""}
        onChange={(e) => setDeviceId(e.target.value)}
        sx={{ 
          minWidth: 140, 
          maxWidth: 180,
          "& .MuiInputBase-input": { 
            fontSize: "10px", 
            py: 0.5,
            fontFamily: "Poppins, sans-serif",
            color: "text.primary"
          },
          "& .MuiOutlinedInput-root": { 
            height: "24px",
            minHeight: "24px",
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: "6px",
            padding: "4px 8px",
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "action.hover",
            },
            "& fieldset": {
              border: "none"
            },
            "&.Mui-disabled": {
              backgroundColor: "action.disabledBackground",
              borderColor: "action.disabled"
            }
          },
          "& .MuiSelect-select": {
            padding: "0 !important",
            paddingRight: "28px !important",
            display: "flex",
            alignItems: "center",
            fontSize: "10px",
            fontFamily: "Poppins, sans-serif"
          },
          "& .MuiSelect-icon": {
            right: "8px",
            color: "primary.main"
          }
        }}
        disabled={devices.length === 0}
        SelectProps={{
          displayEmpty: true,
        renderValue: (value) => {
          if (!value) return "Select Device";
          const device = devices.find(d => d.key?.deviceId === value);
          return device?.deviceName || "Select Device";
        },
          MenuProps: {
            PaperProps: {
              sx: { 
                maxHeight: 250,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                mt: 1,
                backgroundColor: "background.paper",
                "& .MuiMenuItem-root": { 
                  fontSize: "10px", 
                  py: 0.75,
                  fontFamily: "Poppins, sans-serif",
                  color: "text.primary",
                  "&:hover": {
                    backgroundColor: "action.hover"
                  },
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "primary.dark"
                    }
                  }
                },
                zIndex: 1300
              },
            },
          },
        }}
      >
        {devices.length === 0 ? (
          <MenuItem disabled sx={{ fontSize: "10px", fontFamily: "Poppins, sans-serif" }}>
            Loading devices...
          </MenuItem>
        ) : (
          devices.map((d) => (
            <MenuItem 
              key={d.key?.deviceId} 
              value={d.key?.deviceId}
              sx={{ fontSize: "10px", fontFamily: "Poppins, sans-serif" }}
            >
              {d.deviceName}
            </MenuItem>
          ))
        )}
      </TextField>
    </Tooltip>
  ) : null;

  const powerDeviceSelect = createDeviceSelect(powerDeviceId, setPowerDeviceId);
  const currentDeviceSelect = createDeviceSelect(currentDeviceId, setCurrentDeviceId);
  const voltageDeviceSelect = createDeviceSelect(voltageDeviceId, setVoltageDeviceId);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "background.default",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {selectedPlant && (
        <Card
          sx={{
            position: "relative",
            mx: 3,
            mt: 1,
            mb: 1,
            px: 1.5,
            py: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          <Box
            component="img"
            src={selectedPlant.image}
            alt={selectedPlant.name}
            sx={{
              width: 72,
              height: 56,
              borderRadius: 1,
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 0.25 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "text.primary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selectedPlant.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: "text.secondary",
                fontSize: "0.7rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selectedPlant.location}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: "text.secondary",
                fontSize: "0.7rem",
              }}
            >
              {t.common.capacity}: {selectedPlant.capacity} • {selectedPlant.strings} {t.common.strings}
            </Typography>
          </Box>
          <Box
            component="img"
            src="/SystemIcon.svg"
            alt="System Icon"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 32,
              height: 32,
            }}
          />
        </Card>
      )}

      {selectedPlant && <MetricsHeader />}

      {/* Date Range and Tabs Section */}
      {selectedPlant && (
        <Container maxWidth={false} sx={{ mt: 2, px: 3 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: "1.2rem",
                }}
              >
                {t.plantMeasures.title}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                textTransform: "none",
                minWidth: 100,
                fontSize: "0.9rem",
              },
              "& .Mui-selected": {
                color: "primary.main !important",
                fontWeight: 600,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "primary.main",
              },
            }}
          >
            <Tab 
              icon={<Zap size={18} />} 
              iconPosition="start"
              label={t.plantMeasures.energyOverview} 
            />
            <Tab 
              icon={<Cloud size={18} />} 
              iconPosition="start"
              label={t.plantMeasures.weatherMetrics} 
            />
            <Tab 
              icon={<AlertTriangle size={18} />} 
              iconPosition="start"
              label={t.plantMeasures.performance} 
            />
            {/* <Tab label="Comparison" /> */}
          </Tabs>
        </Box>

          {/* Content Based on Active Tab */}
          <Box sx={{ mb: 4 }}>
            {activeTab === 0 && (
            <Grid container spacing={0.5}>
              <Grid item xs={12}>
                <Card
                  sx={{
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    borderRadius: 2,
                    mb: 0.25,
                    position: "relative",
                    overflow: "visible"
                  }}
                >
                  <CardContent sx={{ position: "relative", p: 2, overflow: "visible" }}>
                    {selectedPlant?.plantId && (powerDeviceSelect || powerDateRangePicker) && (
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
                          {powerDeviceSelect}
                          {powerDateRangePicker}
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
                    <Box sx={{ pt: (selectedPlant?.plantId && (powerDeviceSelect || powerDateRangePicker)) ? 4 : 0, pb: 1 }}>
                      {selectedPlant?.plantId && <Divider sx={{ mb: 1 }} />}
                      {!selectedPlant?.plantId ? (
                        <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 1 }} />
                      ) : (
                        <DCMetricsChart 
                          powerMeasures={powerMeasures}
                          loadingMeasures={loadingPowerMeasures}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 0.25 }}>
                  {!selectedPlant?.plantId ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.08)", borderRadius: 2 }}>
                          <CardContent sx={{ p: 2 }}>
                            <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
                            <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 1 }} />
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.08)", borderRadius: 2 }}>
                          <CardContent sx={{ p: 2 }}>
                            <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
                            <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 1 }} />
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  ) : (
                    <PowerCharts 
                      currentDeviceControl={currentDeviceSelect}
                      currentDateRangePicker={currentDateRangePicker}
                      currentFilterChips={currentFilterChips}
                      currentMeasures={currentMeasures}
                      loadingCurrentMeasures={loadingCurrentMeasures}
                      currentError={currentError}
                      voltageDeviceControl={voltageDeviceSelect}
                      voltageDateRangePicker={voltageDateRangePicker}
                      voltageFilterChips={voltageFilterChips}
                      voltageMeasures={voltageMeasures}
                      loadingVoltageMeasures={loadingVoltageMeasures}
                      voltageError={voltageError}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card
                  sx={{
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    borderRadius: 2,
                    padding: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "1rem",
                    }}
                  >
                    {t.plantMeasures.weatherMetricsTitle}
                  </Typography>
                  <WeatherMetricsChart />
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card
                  sx={{
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    borderRadius: 2,
                    padding: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "1rem",
                    }}
                  >
                    Solar Irradiance Metrics
                  </Typography>
                  <SolarIrradianceChart />
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === 2 && (
            <Box sx={{ height: "auto" }}>
              <Card
                sx={{
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                  borderRadius: 2,
                  padding: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "1rem",
                  }}
                >
                  {t.plantMeasures.performanceData}
                </Typography>
                {!selectedPlant?.plantId ? (
                  <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
                ) : (
                  <StatusDataGrid 
                    statusMeasures={statusMeasures}
                    loadingStatusMeasures={loadingStatusMeasures}
                    statusError={statusError}
                    devices={devices}
                    statusDeviceId={statusDeviceId}
                    setStatusDeviceId={setStatusDeviceId}
                    statusStartDate={statusStartDate}
                    statusEndDate={statusEndDate}
                    setStatusStartDate={setStatusStartDate}
                    setStatusEndDate={setStatusEndDate}
                    t={t}
                  />
                )}
              </Card>
            </Box>
          )}
          </Box>
        </Container>
      )}

      {!selectedPlant && (
        <Container maxWidth={false} sx={{ mt: 2, px: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: "text.primary",
              fontSize: "1.2rem",
              mb: 2,
            }}
          >
            {t.plantList.title}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {plants.map((plant) => (
              <Card
                key={plant.id}
                onClick={() => handlePlantSelect(plant)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 1,
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                  position: "relative",
                  "&:hover": {
                    boxShadow: "0 2px 6px rgba(0,0,0,0.16)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Box
                  component="img"
                  src={plant.image}
                  alt={plant.name}
                  sx={{
                    width: 72,
                    height: 56,
                    borderRadius: 1,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "text.primary",
                      }}
                    >
                      {plant.name}
                    </Typography>
                    <Chip
                      label={plant.status === "Active" ? t.overview.status.active : t.overview.status.maintenance}
                      size="small"
                      sx={{
                        backgroundColor: plant.status === "Active" ? "#4CAF50" : "#FF9800",
                        color: "white",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "0.65rem",
                        height: "20px",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      display: "block",
                    }}
                  >
                    {plant.location}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    {t.common.capacity}: {plant.capacity} • {plant.strings} {t.common.strings}
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src="/SystemIcon.svg"
                  alt="System Icon"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 24,
                    height: 24,
                  }}
                />
              </Card>
            ))}
          </Box>
        </Container>
      )}

      <Box sx={{ flexGrow: 1 }} />
      <Footer />
    </Box>
  );
};

export default PlantMeasures;
