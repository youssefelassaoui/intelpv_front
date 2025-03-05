import React from "react";
import { Box, Typography, Card, Divider } from "@mui/material";
import { TrendingUp, TrendingDown, InfoOutlined } from "@mui/icons-material";

const ProductionComparison = () => {
  // Get current date for the week display
  const currentDate = new Date();
  const lastWeekDate = new Date(currentDate);
  lastWeekDate.setDate(currentDate.getDate() - 7);

  // Format dates for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const currentWeekStart = formatDate(lastWeekDate);
  const currentWeekEnd = formatDate(currentDate);

  const plants = [
    {
      name: "Solar Farm Alpha",
      production: "12.5",
      change: "+2.3",
      trend: "up",
      color: "#2E7D32",
    },
    {
      name: "Sunlight Beta Station",
      production: "8.2",
      change: "-1.5",
      trend: "down",
      color: "#66BB6A",
    },
    {
      name: "Green Energy Park",
      production: "15.0",
      change: "+3.2",
      trend: "up",
      color: "#81C784",
    },
    {
      name: "Solar Valley Plant",
      production: "10.8",
      change: "+0.8",
      trend: "up",
      color: "#A5D6A7",
    },
    {
      name: "Desert Sun Complex",
      production: "18.3",
      change: "-0.7",
      trend: "down",
      color: "#C8E6C9",
    },
  ];

  return (
    <Card
      sx={{
        p: 2,
        height: "100%",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "16px",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          Weekly Production Comparison
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mt: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: "text.secondary",
              fontSize: "0.75rem",
            }}
          >
            {currentWeekStart} - {currentWeekEnd} vs previous week
          </Typography>
          <InfoOutlined
            sx={{
              fontSize: 14,
              color: "text.secondary",
              cursor: "help",
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.75rem",
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          PLANT
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.75rem",
              color: "text.secondary",
              fontWeight: 500,
              width: "60px",
              textAlign: "right",
            }}
          >
            CURRENT
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.75rem",
              color: "text.secondary",
              fontWeight: 500,
              width: "50px",
              textAlign: "right",
            }}
          >
            WoW
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          flexGrow: 1,
          justifyContent: "space-between", // Distribute items evenly
        }}
      >
        {plants.map((plant) => (
          <Box
            key={plant.name}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
              borderRadius: 1,
              backgroundColor: "rgba(0,0,0,0.02)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 3,
                  height: 24,
                  backgroundColor: plant.color,
                  borderRadius: 1,
                }}
              />
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.875rem",
                  color: "#333",
                }}
              >
                {plant.name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#333",
                  width: "60px",
                  textAlign: "right",
                }}
              >
                {plant.production} MW
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: plant.trend === "up" ? "#2E7D32" : "#d32f2f",
                  width: "50px",
                  justifyContent: "flex-end",
                }}
              >
                {plant.trend === "up" ? (
                  <TrendingUp sx={{ fontSize: 16 }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16 }} />
                )}
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {plant.change}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default ProductionComparison;
