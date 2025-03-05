import React from "react";
import { Grid, Card, Typography, Box, Tooltip, Divider } from "@mui/material";
import {
  Info,
  BarChart,
  BoltOutlined,
  Speed,
  ArrowUpward,
  ArrowDownward,
  ArrowDropUp,
  ArrowDropDown,
} from "@mui/icons-material";

const MetricCard = ({ title, value, unit, date, change, icon: Icon }) => {
  const isPositiveChange = change > 0;

  return (
    <Card
      sx={{
        p: 1,
        height: "auto",
        backgroundColor: "white",
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
            backgroundColor: "rgba(46, 125, 50, 0.09)",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 1,
          }}
        >
          <Icon sx={{ color: "#2E7D32", fontSize: 18 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#666",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                fontSize: "0.8rem",
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            <Tooltip title="More information">
              <Info sx={{ fontSize: 12, color: "#999", cursor: "pointer" }} />
            </Tooltip>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "#999",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.65rem",
              lineHeight: 1.2,
              display: "block",
              mt: 0.1,
            }}
          >
            Calculated on {date}
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
              color: "#666",
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
              backgroundColor: isPositiveChange
                ? "rgba(76, 175, 80, 0.1)"
                : "rgba(244, 67, 54, 0.1)",
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
            {isPositiveChange ? "more" : "less"} than 30/08/23
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
  const metrics = [
    {
      title: "Energy Produced",
      value: 25418.85,
      unit: "kWh",
      date: "31/08/23",
      change: 6.44,
      icon: BoltOutlined,
    },
    {
      title: "Specific Yield",
      value: 2.8,
      unit: "kWh/kW",
      date: "31/08/23",
      change: 6.44,
      icon: Speed,
    },
    {
      title: "PR",
      value: 0.72,
      unit: "",
      date: "31/08/23",
      change: -0.29,
      icon: BarChart,
    },
  ];

  return (
    <Box sx={{ py: 1.5, px: 3, backgroundColor: "#f5f5f5" }}>
      <Grid container spacing={2}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} md={4} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MetricsHeader;
