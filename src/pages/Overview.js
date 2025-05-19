import { Box, Typography, Card, Grid } from "@mui/material";
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

// Update the StatsCard styled component to reduce padding and height
const StatsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1), // Reduced from 2
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1), // Reduced from 1.5
  backgroundColor: "white",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

// Horizontal scrollable container for plant cards
const ScrollableContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  overflowX: "auto",
  gap: theme.spacing(1.5), // Reduced from 2
  padding: theme.spacing(0.5, 0), // Reduced from 1, 0
  "&::-webkit-scrollbar": {
    height: "6px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f1f1f1",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#c1c1c1",
    borderRadius: "10px",
    "&:hover": {
      backgroundColor: "#a8a8a8",
    },
  },
}));

// Card wrapper to set fixed width
const CardWrapper = styled(Box)(({ theme }) => ({
  width: "280px",
  flexShrink: 0,
}));

// Static Data
const plants = [
  {
    id: 1,
    name: "Green & Smart Building Park ()",
    image: "/gsbp.jpg",
    location: "Ben Guerir 43150, MO",
    capacity: "6 kW",
    strings: 3,
    status: "Active",
  },
  {
    id: 2,
    name: "Green Energy Park (Trina)",
    image: "/trina.jpg",
    location: "Route Régionale Kelaa Km 3, R206, Ben Guerir, MO",
    capacity: "22.23 kW",
    strings: 6,
    status: "Active",
  },
  {
    id: 3,
    name: "Hospital Universario Rien Sofía",
    image: "/hospital.jpeg",
    location: "Av. Menéndez Pidal, s/n, Poniente Sur, 14004 Córdoba, ES",
    capacity: "1.72 MW",
    strings: 274,
    status: "Maintenance",
  },
  {
    id: 6,
    name: "SESA Project",
    image: "/douar.jpeg",
    location: "64F2+734, Ben Guerir",
    capacity: "25 KW",
    strings: 2,
    status: "Active",
  },
  {
    id: 4,
    name: "Mohammed VI Museum of Modern and Contemporary Art",
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
          {/* Replace the Stats Cards Grid section with this updated version */}
          <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
            {" "}
            {/* Reduced spacing from 2 to 1.5 */}
            <Grid item xs={12} sm={4}>
              <StatsCard>
                <Box
                  sx={{
                    backgroundColor: "rgba(46, 125, 50, 0.1)",
                    borderRadius: "50%",
                    p: 0.75, // Reduced from 1
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BoltOutlined sx={{ fontSize: 20, color: "#2E7D32" }} />{" "}
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
                    Total Capacity
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "#2E7D32",
                      fontSize: "0.9rem", // Reduced from default h6 size
                      lineHeight: 1.2, // Added to reduce line height
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
                    backgroundColor: "rgba(46, 125, 50, 0.1)",
                    borderRadius: "50%",
                    p: 0.75, // Reduced from 1
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PowerOutlined sx={{ fontSize: 20, color: "#2E7D32" }} />{" "}
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
                    Total Strings
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "#33372C",
                      fontSize: "0.9rem", // Reduced from default h6 size
                      lineHeight: 1.2, // Added to reduce line height
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
                    In Maintenance
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
                    {maintenanceCount} Plants
                  </Typography>
                </Box>
              </StatsCard>
            </Grid>
          </Grid>

          {/* Plants Cards Section - SINGLE ROW WITH HORIZONTAL SCROLL */}
          <Box sx={{ mb: 1 }}>
            <ScrollableContainer>
              {plants.map((plant) => (
                <CardWrapper key={plant.id}>
                  <PlantCard plant={plant} />
                </CardWrapper>
              ))}
            </ScrollableContainer>
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
