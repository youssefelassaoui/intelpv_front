"use client";
import { Grid, Card, Typography, Box } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";
import {
  WiThermometer,
  WiHumidity,
  WiBarometer,
  WiStrongWind,
  WiRain,
  WiDaySunny,
  WiDaySunnyOvercast,
  WiDayCloudy,
  WiHorizon,
} from "react-icons/wi";

const WeatherCard = ({ param, loading }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
  <Card
    sx={{
      boxShadow: 3,
      padding: 1.5,
      textAlign: "center",
      borderRadius: 2,
      height: "140px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: "#fff",
    }}
  >
    {loading ? (
      <Skeleton variant="rectangular" width="100%" height="100%" />
    ) : (
      <>
        <Typography
          variant="body2"
          sx={{
            fontSize: "14px",
            fontFamily: "Poppins, sans-serif",
            color: "#333",
            marginBottom: "2px",
          }}
        >
          {param.title}
        </Typography>
        <Box
          sx={{
            color: "#77B254",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "2px",
          }}
        >
          {param.icon}
          <Typography
            sx={{
              fontSize: "11px",
              fontFamily: "Poppins, sans-serif",
              color: "#333",
            }}
          >
            {param.currentValue} {param.unit}
          </Typography>
        </Box>
        <Grid container spacing={1} sx={{ mt: 0.5 }}>
          <Grid item xs={4}>
            <Typography
              sx={{
                fontSize: "10px",
                fontFamily: "Poppins, sans-serif",
                color: "#666",
              }}
            >
              {t.weatherStation.min}
            </Typography>
            <Typography
              sx={{
                fontSize: "10px",
                fontFamily: "Poppins, sans-serif",
                color: "#333",
              }}
            >
              {param.values.min}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              sx={{
                fontSize: "10px",
                fontFamily: "Poppins, sans-serif",
                color: "#666",
              }}
            >
              {t.weatherStation.avg}
            </Typography>
            <Typography
              sx={{
                fontSize: "10px",
                fontFamily: "Poppins, sans-serif",
                color: "#333",
              }}
            >
              {param.values.avg}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              sx={{
                fontSize: "10px",
                fontFamily: "Poppins, sans-serif",
                color: "#666",
              }}
            >
              {t.weatherStation.max}
            </Typography>
            <Typography
              sx={{
                fontSize: "10px",
                fontFamily: "Poppins, sans-serif",
                color: "#333",
              }}
            >
              {param.values.max}
            </Typography>
          </Grid>
        </Grid>
      </>
    )}
  </Card>
  );
};

const WeatherCards = ({ loading }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const parameters = [
    {
      title: t.weatherStation.temperature,
      icon: <WiThermometer size={42} />,
      id: "temperature",
      unit: "°C",
      currentValue: "24.5",
      values: { max: "28.5", avg: "24.2", min: "20.1" },
    },
    {
      title: t.weatherStation.humidity,
      icon: <WiHumidity size={42} />,
      id: "humidity",
      unit: "%",
      currentValue: "65",
      values: { max: "85", avg: "65", min: "45" },
    },
    {
      title: t.weatherStation.pressure,
      icon: <WiBarometer size={42} />,
      id: "pressure",
      unit: "hPa",
      currentValue: "1013",
      values: { max: "1020", avg: "1013", min: "1005" },
    },
    {
      title: t.weatherStation.windSpeed,
      icon: <WiStrongWind size={42} />,
      id: "wind",
      unit: "m/s",
      currentValue: "8.2",
      values: { max: "12.5", avg: "8.2", min: "3.1" },
    },
    {
      title: t.weatherStation.rain,
      icon: <WiRain size={42} />,
      id: "rain",
      unit: "mm",
      currentValue: "12",
      values: { max: "25", avg: "12", min: "0" },
    },
    {
      title: t.weatherStation.ghi,
      icon: <WiDaySunny size={42} />,
      id: "ghi",
      unit: "W/m²",
      currentValue: "580",
      values: { max: "950", avg: "580", min: "0" },
    },
    {
      title: t.weatherStation.dhi,
      icon: <WiDaySunnyOvercast size={42} />,
      id: "dhi",
      unit: "W/m²",
      currentValue: "280",
      values: { max: "450", avg: "280", min: "0" },
    },
    {
      title: t.weatherStation.dni,
      icon: <WiDayCloudy size={42} />,
      id: "dni",
      unit: "W/m²",
      currentValue: "520",
      values: { max: "850", avg: "520", min: "0" },
    },
    {
      title: t.weatherStation.gti,
      icon: <WiHorizon size={42} />,
      id: "gti",
      unit: "W/m²",
      currentValue: "620",
      values: { max: "1050", avg: "620", min: "0" },
    },
  ];

  return (
    <Grid
      container
      spacing={2}
      sx={{
        mt: 3,
        px: 2,
        mb: 6, // Add margin bottom for spacing
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        maxWidth: "1400px",
        mx: "auto",
      }}
    >
      {parameters.map((param) => (
        <Grid item xs={12} sm={6} md={4} lg={1.2} key={param.id}>
          <WeatherCard param={param} loading={loading} />
        </Grid>
      ))}
    </Grid>
  );
};

export default WeatherCards;
