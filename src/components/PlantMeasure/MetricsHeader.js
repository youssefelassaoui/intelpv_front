import { Grid, Card, Typography, Box, Tooltip, Divider, useTheme } from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";
import {
  Info,
  BarChart,
  BoltOutlined,
  Speed,
  ArrowUpward,
  ArrowDownward,
  ArrowDropUp,
  ArrowDropDown,
  BatteryFull,
} from "@mui/icons-material";

const MetricCard = ({ title, value, unit, date, change, icon: Icon }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const isPositiveChange = change > 0;

  return (
    <Card
      sx={{
        p: 1,
        height: "auto",
        backgroundColor: "background.paper",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        borderRadius: 1.5,
        maxWidth: "95%",
        mx: "auto",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "rgba(46, 125, 50, 0.09)"
                : "rgba(46, 125, 50, 0.2)",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 1,
          }}
        >
          <Icon sx={{ color: "primary.main", fontSize: 18 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                fontSize: "0.8rem",
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            <Tooltip title={t.metrics.moreInformation}>
              <Info sx={{ fontSize: 12, color: "text.secondary", cursor: "pointer" }} />
            </Tooltip>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.65rem",
              lineHeight: 1.2,
              display: "block",
              mt: 0.1,
            }}
          >
            {t.metrics.calculatedOn} {date}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 0.8 }} />

      <Box sx={{ mt: 0.5 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: "1.6rem",
            lineHeight: 1.2,
            color: "text.primary",
          }}
        >
          {typeof value === "number"
            ? value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : value}
          <Typography
            component="span"
            sx={{
              ml: 0.5,
              fontSize: "0.8rem",
              color: "text.secondary",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {unit}
          </Typography>
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mt: 0.3, gap: 0.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: (theme) =>
                isPositiveChange
                  ? theme.palette.mode === "light"
                    ? "rgba(76, 175, 80, 0.1)"
                    : "rgba(76, 175, 80, 0.2)"
                  : theme.palette.mode === "light"
                    ? "rgba(244, 67, 54, 0.1)"
                    : "rgba(244, 67, 54, 0.2)",
              borderRadius: "4px",
              px: 0.5,
              py: 0.2,
            }}
          >
            {isPositiveChange ? (
              <ArrowDropUp
                sx={{ fontSize: 20, color: "#4caf50", margin: "-4px" }}
              />
            ) : (
              <ArrowDropDown
                sx={{ fontSize: 20, color: "#f44336", margin: "-4px" }}
              />
            )}
            <Typography
              variant="caption"
              sx={{
                color: isPositiveChange ? "#4caf50" : "#f44336",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {Math.abs(change)}%
            </Typography>
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: "#999",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.65rem",
              lineHeight: 1.2,
            }}
          >
            {isPositiveChange ? t.metrics.moreThan : t.metrics.lessThan} {t.metrics.than} 17/05/25
          </Typography>
        </Box>
      </Box>

      {/* Large arrow indicator on the right */}
      <Box
        sx={{
          position: "absolute",
          right: 10,
          bottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isPositiveChange ? (
          <ArrowUpward sx={{ fontSize: 24, color: "#4caf50" }} />
        ) : (
          <ArrowDownward sx={{ fontSize: 24, color: "#f44336" }} />
        )}
      </Box>
    </Card>
  );
};

const MetricsHeader = () => {
  const { language } = useLanguage();
  const theme = useTheme();
  const t = translations[language];
  
  const metrics = [
    {
      title: t.metrics.dailyEnergy,
      value: 142.85, // Daily production for 25kW in Benguerir (May)
      unit: "kWh/day",
      date: "18/05/25",
      change: 6.44,
      icon: BoltOutlined,
    },
    {
      title: t.metrics.specificYield,
      value: 5.71, // Daily yield for Benguerir in May
      unit: "kWh/kW",
      date: "18/05/25",
      change: 6.44,
      icon: Speed,
    },
    {
      title: t.metrics.pr,
      value: 0.82, // Realistic performance ratio
      unit: "",
      date: "18/05/25",
      change: -0.29,
      icon: BarChart,
    },
    {
      title: t.metrics.batteryState,
      value: 85,
      unit: "%",
      date: "18/05/25",
      change: 5.2,
      icon: BatteryFull,
    },
  ];

  return (
    <Box sx={{ py: 1.5, px: 3, backgroundColor: theme.palette.background.default }}>
      <Grid container spacing={2}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MetricsHeader;
