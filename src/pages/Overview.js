import { useState } from "react";
import { Box, Typography, Card, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
import PlantCard from "../components/OverView/PlantCard";
import ChartSection from "../components/OverView/ChartSection";
import MapSection from "../components/OverView/MapSection";
import InverterSection from "../components/OverView/InverterSection";
import Footer from "../components/GloabalComponents/Footer";
import {
  BoltOutlined,
  PowerOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

// Update the StatsCard styled component to reduce padding and height
const StatsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

// Horizontal scrollable container for plant cards (mobile - very small screens only)
const ScrollableContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  overflowX: "auto",
  gap: theme.spacing(1.5),
  padding: theme.spacing(0.5, 0),
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
  "&::-webkit-scrollbar": {
    height: "6px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.mode === "light" ? "#f1f1f1" : "#2a2a2a",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.mode === "light" ? "#c1c1c1" : "#555555",
    borderRadius: "10px",
    "&:hover": {
      backgroundColor: theme.palette.mode === "light" ? "#a8a8a8" : "#777777",
    },
  },
}));

// Card wrapper for horizontal scroll (mobile)
const CardWrapper = styled(Box)(({ theme }) => ({
  width: "280px",
  flexShrink: 0,
}));

// Grid container for larger screens - shows all cards in one row until very small screens
const GridContainer = styled(Box)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
    flexWrap: "nowrap",
    gap: theme.spacing(1.5),
    overflowX: "auto",
    "&::-webkit-scrollbar": {
      height: "6px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: theme.palette.mode === "light" ? "#f1f1f1" : "#2a2a2a",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.mode === "light" ? "#c1c1c1" : "#555555",
      borderRadius: "10px",
      "&:hover": {
        backgroundColor: theme.palette.mode === "light" ? "#a8a8a8" : "#777777",
      },
    },
    "& > *": {
      flex: "0 0 auto",
      minWidth: "240px",
      maxWidth: "280px",
      [theme.breakpoints.up("md")]: {
        minWidth: "220px",
        maxWidth: "260px",
      },
      [theme.breakpoints.up("lg")]: {
        minWidth: "200px",
        maxWidth: "240px",
      },
      [theme.breakpoints.up("xl")]: {
        minWidth: "180px",
        maxWidth: "220px",
      },
    },
  },
  [theme.breakpoints.up("md")]: {
    flexWrap: "wrap",
    overflowX: "visible",
    "& > *": {
      flex: "1 1 calc(33.333% - 12px)",
      minWidth: "200px",
      maxWidth: "none",
    },
  },
  [theme.breakpoints.up("lg")]: {
    "& > *": {
      flex: "1 1 calc(20% - 12px)",
      minWidth: "180px",
    },
  },
  [theme.breakpoints.up("xl")]: {
    "& > *": {
      flex: "1 1 calc(16.666% - 12px)",
      minWidth: "160px",
    },
  },
}));

// Static Data
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
    id: 6,
    name: "SESA Project (Douar)",
    plantId: null,
    image: "/douar.jpeg",
    location: "64F2+734, Ben Guerir",
    capacity: "25 KW",
    strings: 2,
    status: "Active",
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
    id: 5,
    name: "Fkih ben saleh",
    image: "/fkih.png",
    location: "32.5778782, -6.6216788",
    capacity: "400 KW",
    strings: "12",
    status: "Active",
  },
  // New card added
];

const Overview = () => {
  const { language } = useLanguage();
  const t = translations[language];

  // Calculate summary statistics
  const totalCapacity = plants.reduce((sum, plant) => {
    return sum + Number.parseFloat(plant.capacity);
  }, 0);
  //   const totalStrings = plants.reduce((sum, plant) => sum + plant.strings, 0);
  const maintenanceCount = plants.filter(
    (plant) => plant.status === "Maintenance"
  ).length;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Grid
        container
        sx={{
          backgroundColor: "background.default",
          flex: 1,
          padding: { xs: 2, sm: 3 },
          overflow: "hidden",
          maxWidth: "100%",
          justifyContent: "center",
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            maxWidth: "1600px", // Maximum width for content
            width: "100%",
          }}
        >
          {/* Selected Plant Bar */}
          {/* Header Section */}
          {/* Replace the Stats Cards Grid section with this updated version */}
          <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
            {" "}
            {/* Reduced spacing from 2 to 1.5 */}
            <Grid item xs={12} sm={4}>
              <StatsCard>
                <Box
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(46, 125, 50, 0.1)"
                        : "rgba(46, 125, 50, 0.2)",
                    borderRadius: "50%",
                    p: 0.75,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BoltOutlined sx={{ fontSize: 20, color: "primary.main" }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: "text.secondary",
                      fontSize: "0.65rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {t.overview.totalCapacity}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "primary.main",
                      fontSize: "0.9rem",
                      lineHeight: 1.2,
                    }}
                  >
                    2.31 MW
                  </Typography>
                </Box>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatsCard>
                <Box
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(46, 125, 50, 0.1)"
                        : "rgba(46, 125, 50, 0.2)",
                    borderRadius: "50%",
                    p: 0.75,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PowerOutlined sx={{ fontSize: 20, color: "primary.main" }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: "text.secondary",
                      fontSize: "0.65rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {t.overview.totalStrings}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "text.primary",
                      fontSize: "0.9rem",
                      lineHeight: 1.2,
                    }}
                  >
                    317
                  </Typography>
                </Box>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatsCard>
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 152, 0, 0.1)",
                    borderRadius: "50%",
                    p: 0.75, // Reduced from 1
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <WarningAmberOutlined
                    sx={{ fontSize: 20, color: "#FF9800" }}
                  />{" "}
                  {/* Reduced from 24 */}
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: "text.secondary",
                      fontSize: "0.65rem", // Reduced from 0.75rem
                      lineHeight: 1.2, // Added to reduce line height
                    }}
                  >
                    {t.overview.inMaintenance}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "#FF9800",
                      fontSize: "0.9rem", // Reduced from default h6 size
                      lineHeight: 1.2, // Added to reduce line height
                    }}
                  >
                    {maintenanceCount} {t.overview.plants}
                  </Typography>
                </Box>
              </StatsCard>
            </Grid>
          </Grid>

          {/* Plants Cards Section - Responsive Layout */}
          <Box sx={{ mb: 1 }}>
            {/* Very Small Screens (xs): Horizontal Scroll */}
            <ScrollableContainer>
              {plants.map((plant) => (
                <CardWrapper key={plant.id}>
                  <PlantCard plant={plant} />
                </CardWrapper>
              ))}
            </ScrollableContainer>

            {/* Small and Up: All cards in one row (scrollable on small, wrapped on larger) */}
            <GridContainer>
              {plants.map((plant) => (
                <Box key={plant.id} sx={{ width: "100%" }}>
                  <PlantCard plant={plant} />
                </Box>
              ))}
            </GridContainer>
          </Box>

          {/* Charts Section */}
          <Box sx={{ mb: 1.5 }}>
            <ChartSection />
          </Box>

          {/* Map and Inverter Section */}
          <Box>
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={8}>
                <MapSection />
              </Grid>
              <Grid item xs={12} md={4}>
                <InverterSection />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default Overview;
