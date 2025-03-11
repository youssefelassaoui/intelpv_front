import React from "react";
import { Box, Container, Typography, Card, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../components/GloabalComponents/Navbar";
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

const StatsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  backgroundColor: "white",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

// Static Data
const plants = [
  {
    id: 1,
    name: "Green & Smart Building Park",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format",
    location: "Ben Guerir 43150, MO",
    capacity: "6 kW",
    strings: 3,
    status: "Active",
  },
  {
    id: 2,
    name: "Green Energy Park",
    image:
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format",
    location: "Route Régionale Kelaa Km 3, R206, Ben Guerir, MO",
    capacity: "--",
    strings: "--",
    status: "Active",
  },
  {
    id: 3,
    name: "Hospital Universario Rien Sofia",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&auto=format",
    location: "Av. Menéndez Pidal, s/n, Poniente Sur, 14004 Córdoba, ES",
    capacity: "1.72 MW",
    strings: 274,
    status: "Maintenance",
  },
  {
    id: 4,
    name: "Mohammed VI Museum of Modern and Contemporary Art",
    image:
      "https://images.unsplash.com/photo-1542336391-ae2936d8af02?w=800&auto=format",
    location: " 2 Av. Moulay Hassan, Rabat, MO",
    capacity: "10.8 MW",
    strings: 420,
    status: "Active",
  },
  {
    id: 5,
    name: "Fkih ben saleh",
    image:
      "https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?w=800&auto=format",
    location: "--",
    capacity: "--",
    strings: "--",
    status: "Active",
  },
];

const Overview = () => {
  // Calculate summary statistics
  const totalCapacity = plants.reduce((sum, plant) => {
    return sum + parseFloat(plant.capacity);
  }, 0);
  const totalStrings = plants.reduce((sum, plant) => sum + plant.strings, 0);
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
      <Navbar />
      <Grid
        container
        sx={{
          backgroundColor: "#f5f5f5",
          flex: 1,
          padding: { xs: 2, sm: 3 }, // Responsive padding
          overflow: "hidden",
          maxWidth: "100%",
          justifyContent: "center", // Center the grid content
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
          {/* Header Section */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <StatsCard>
                <Box
                  sx={{
                    backgroundColor: "rgba(46, 125, 50, 0.1)",
                    borderRadius: "50%",
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BoltOutlined sx={{ fontSize: 24, color: "#2E7D32" }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    Total Capacity
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "#2E7D32",
                    }}
                  >
                    {totalCapacity.toFixed(1)} MW
                  </Typography>
                </Box>
              </StatsCard>
            </Grid>

            <Grid item xs={12} sm={4}>
              <StatsCard>
                <Box
                  sx={{
                    backgroundColor: "rgba(46, 125, 50, 0.1)",
                    borderRadius: "50%",
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PowerOutlined sx={{ fontSize: 24, color: "#2E7D32" }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    Total Strings
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "#33372C",
                    }}
                  >
                    {totalStrings}
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
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <WarningAmberOutlined
                    sx={{ fontSize: 24, color: "#FF9800" }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    In Maintenance
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "#FF9800",
                    }}
                  >
                    {maintenanceCount} Plants
                  </Typography>
                </Box>
              </StatsCard>
            </Grid>
          </Grid>

          {/* Plants Cards Section */}
          <Box sx={{ mb: 1.5 }}>
            <Grid container spacing={1.5}>
              {plants.map((plant) => (
                <Grid item xs={12} sm={6} md={2.4} key={plant.id}>
                  <PlantCard plant={plant} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Charts Section */}
          <Box sx={{ mb: 2 }}>
            <ChartSection />
          </Box>

          {/* Map and Inverter Section */}
          <Box>
            <Grid container spacing={2}>
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
