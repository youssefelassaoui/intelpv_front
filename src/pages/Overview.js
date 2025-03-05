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
    name: "Solar Farm Alpha",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format",
    location: "Desert Valley, AZ",
    capacity: "12.5 MW",
    strings: 450,
    status: "Active",
  },
  {
    id: 2,
    name: "Sunlight Beta Station",
    image:
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format",
    location: "Mountain View, CA",
    capacity: "8.2 MW",
    strings: 320,
    status: "Active",
  },
  {
    id: 3,
    name: "Green Energy Park",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&auto=format",
    location: "Austin, TX",
    capacity: "15.0 MW",
    strings: 580,
    status: "Maintenance",
  },
  {
    id: 4,
    name: "Solar Valley Plant",
    image:
      "https://images.unsplash.com/photo-1542336391-ae2936d8af02?w=800&auto=format",
    location: "Las Vegas, NV",
    capacity: "10.8 MW",
    strings: 420,
    status: "Active",
  },
  {
    id: 5,
    name: "Desert Sun Complex",
    image:
      "https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?w=800&auto=format",
    location: "Phoenix, AZ",
    capacity: "18.3 MW",
    strings: 650,
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
        backgroundColor: "#f5f5f5",
        overflow: "hidden", // Prevent horizontal scrollbar
      }}
    >
      <Navbar />
      <Container
        maxWidth={false}
        sx={{
          py: 3,
          px: 2,
          flexGrow: 1,
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
                <WarningAmberOutlined sx={{ fontSize: 24, color: "#FF9800" }} />
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
          {" "}
          {/* Reduced margin bottom to 8px */}
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
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Overview;
