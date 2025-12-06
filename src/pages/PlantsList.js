"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  Typography,
  Box,
  Container,
  CardActionArea,
  Skeleton,
  Chip,
  Button,
} from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
import Footer from "../components/GloabalComponents/Footer";
import {
  BoltOutlined,
  LocationOn,
  CalendarMonth,
  CheckCircle,
  WarningAmber,
  ErrorOutline,
  ArrowForward,
} from "@mui/icons-material";

const PlantCard = ({ plant, loading, onSelect }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  // Function to determine status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case "Active":
        return {
          icon: <CheckCircle sx={{ fontSize: 16 }} />,
          color: "#4caf50",
        };
      case "Maintenance":
        return {
          icon: <WarningAmber sx={{ fontSize: 16 }} />,
          color: "#ff9800",
        };
      case "Offline":
        return {
          icon: <ErrorOutline sx={{ fontSize: 16 }} />,
          color: "#f44336",
        };
      default:
        return {
          icon: <CheckCircle sx={{ fontSize: 16 }} />,
          color: "#4caf50",
        };
    }
  };

  const statusInfo = getStatusInfo(plant.status);

  return (
    <Card
      sx={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: 2,
        height: "220px",
        overflow: "hidden",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
        },
        position: "relative",
      }}
    >
      <CardActionArea sx={{ height: "100%" }} onClick={() => onSelect(plant)}>
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        ) : (
          <>
            <Box
              sx={{
                height: "100px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={plant.image || "/placeholder.svg"}
                alt={plant.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <Chip
                label={
                  plant.status === "Active" ? t.overview.status.active :
                  plant.status === "Maintenance" ? t.overview.status.maintenance :
                  plant.status === "Offline" ? t.overview.status.offline :
                  plant.status
                }
                size="small"
                icon={statusInfo.icon}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "white",
                  color: statusInfo.color,
                  borderColor: statusInfo.color,
                  "& .MuiChip-icon": {
                    color: statusInfo.color,
                  },
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                }}
                variant="outlined"
              />
            </Box>

            <Box sx={{ p: 1.5 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  mb: 0.5,
                  color: "#333",
                }}
              >
                {plant.name}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <LocationOn sx={{ fontSize: 16, color: "#666", mr: 0.5 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.75rem",
                    color: "#666",
                  }}
                >
                  {plant.location}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <CalendarMonth sx={{ fontSize: 16, color: "#666", mr: 0.5 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.75rem",
                    color: "#666",
                  }}
                >
                  {plant.commissionDate}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <BoltOutlined sx={{ fontSize: 16, color: "#666", mr: 0.5 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.75rem",
                    color: "#666",
                  }}
                >
                  {plant.capacity}
                </Typography>
              </Box>
            </Box>

            {/* View Details Button */}
            <Chip
              label={t.plantList.viewDetails}
              size="small"
              icon={<ArrowForward sx={{ fontSize: 14 }} />}
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "rgba(25, 118, 210, 0.1)",
                color: "#1976d2",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.2)",
                },
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(plant);
              }}
            />
          </>
        )}
      </CardActionArea>
    </Card>
  );
};

const PlantsList = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Static plant data
  const plants = [
    {
      id: 1,
      name: "Solar Farm Alpha",
      image:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format",
      location: "Desert Valley, AZ",
      capacity: "12.5 MW",
      commissionDate: "Jan 15, 2022",
      status: "Active",
    },
    {
      id: 2,
      name: "Sunlight Beta Station",
      image:
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format",
      location: "Mountain View, CA",
      capacity: "8.2 MW",
      commissionDate: "Mar 22, 2021",
      status: "Active",
    },
    {
      id: 3,
      name: "Green Energy Park",
      image:
        "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&auto=format",
      location: "Austin, TX",
      capacity: "15.0 MW",
      commissionDate: "Nov 10, 2022",
      status: "Maintenance",
    },
    {
      id: 4,
      name: "Solar Valley Plant",
      image:
        "https://images.unsplash.com/photo-1542336391-ae2936d8af02?w=800&auto=format",
      location: "Las Vegas, NV",
      capacity: "10.8 MW",
      commissionDate: "Jul 5, 2021",
      status: "Active",
    },
    {
      id: 5,
      name: "Desert Sun Complex",
      image:
        "https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?w=800&auto=format",
      location: "Phoenix, AZ",
      capacity: "18.3 MW",
      commissionDate: "Feb 28, 2023",
      status: "Active",
    },
    {
      id: 6,
      name: "Coastal Solar Array",
      image:
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&auto=format",
      location: "San Diego, CA",
      capacity: "7.5 MW",
      commissionDate: "Sep 15, 2022",
      status: "Offline",
    },
    {
      id: 7,
      name: "Midwest PV Center",
      image:
        "https://images.unsplash.com/photo-1611365892117-bce8b05f4a13?w=800&auto=format",
      location: "Chicago, IL",
      capacity: "9.2 MW",
      commissionDate: "Apr 30, 2021",
      status: "Active",
    },
    {
      id: 8,
      name: "Eastern Solar Hub",
      image:
        "https://images.unsplash.com/photo-1548348192-998fc98cceea?w=800&auto=format",
      location: "Atlanta, GA",
      capacity: "11.7 MW",
      commissionDate: "Aug 12, 2022",
      status: "Active",
    },
  ];

  const handlePlantSelect = (plant) => {
    // Navigate to PlantMeasures page with the selected plant ID
    navigate(`/plant-measures?id=${plant.id}`);
  };

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
          <Box sx={{ textAlign: "center", mb: 4, px: { xs: 1, sm: 2 } }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: "#333",
                mb: 1,
                fontSize: { xs: "1.5rem", sm: "2rem" }, // Responsive font size
              }}
            >
              {t.plantList.title}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: "#666",
                maxWidth: "800px",
                mx: "auto",
                fontSize: { xs: "0.875rem", sm: "1rem" }, // Responsive font size
              }}
            >
              {t.plantList.subtitle}
            </Typography>
          </Box>

          <Grid
            container
            spacing={{ xs: 2, sm: 3 }} // Responsive spacing
            sx={{
              display: "flex",
              justifyContent: "center", // Center the cards
              width: "100%",
              mx: "auto",
            }}
          >
            {plants.map((plant) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={plant.id}>
                <PlantCard
                  plant={plant}
                  loading={loading}
                  onSelect={handlePlantSelect}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default PlantsList;
