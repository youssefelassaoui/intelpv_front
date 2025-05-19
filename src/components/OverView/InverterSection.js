"use client";

import { useState } from "react";
import { Box, Card, Typography, Chip, Grid } from "@mui/material";

// Inverter image paths and names for our plants
const inverterData = {
  "Green & Smart..": {
    images: ["/SUN2000-20KTL-M0.png"],
    names: ["SUN2000-20KTL-M0"],
    color: "#129990",
  },
  "Green Energy Park (Trina)": {
    images: ["/SUN2000-100KTL-M1.png"],
    names: ["SUN2000-100KTL-M1"],
    color: "#129990",
  },
  "Hospital Universario..": {
    images: ["/SUN2000-60KTL-M0.png", "/SUN2000L-5KTL.png"],
    names: ["SUN2000-60KTL-M0", "SUN2000L-5KTL"],
    color: "#129990",
  },
  "Mohammed VI Museum": {
    images: ["/SUN2000L-5KTL.png"],
    names: ["SUN2000L-5KTL"],
    color: "#129990",
  },
  "Fkih ben saleh": {
    images: ["/SUN2000-60KTL-M0.png", "/SUN2000-20KTL-M0.png"],
    names: ["SUN2000-60KTL-M0", "SUN2000-20KTL-M0"],
    color: "#129990",
  },
  "SESA Project": {
    images: ["/sesa.webp"],
    names: [" DEYE SUN-8K-SG04LP3-EU"],
    color: "#129990",
  },
};

const InverterSection = () => {
  // State to keep track of selected plant
  const [selectedPlant, setSelectedPlant] = useState(
    "Green & Smart Building Park"
  );

  // Chip click handler
  const handleChipClick = (plant) => {
    setSelectedPlant(plant);
  };

  // Rendering inverter images for selected plant
  const renderInverters = () => {
    if (!selectedPlant || !inverterData[selectedPlant]) {
      return null;
    }

    const { images, names } = inverterData[selectedPlant];

    return (
      <Grid
        container
        spacing={1}
        justifyContent="center"
        alignItems="center"
        sx={{ maxWidth: "100%" }}
      >
        {images.map((imgSrc, index) => (
          <Grid
            item
            xs={5.5}
            key={`${selectedPlant}-${index}`}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={imgSrc || "/placeholder.svg"}
              alt={`Inverter ${names[index]}`}
              style={{
                maxWidth: "100%",
                maxHeight: "180px",
                objectFit: "contain",
              }}
            />
            <Typography
              sx={{
                mt: 0.5,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 500,
                color: "#333",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              {names[index]}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Card
      sx={{
        p: 1.5,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        height: "320px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          mb: 1,
        }}
      >
        Plant Inverters
      </Typography>

      {/* Chip Selection */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.75,
          mb: 1.5,
          justifyContent: "center",
        }}
      >
        {Object.keys(inverterData).map((plant) => (
          <Chip
            key={plant}
            label={plant}
            onClick={() => handleChipClick(plant)}
            sx={{
              backgroundColor:
                selectedPlant === plant
                  ? inverterData[plant].color
                  : "rgba(255, 255, 255, 0.9)",
              color: selectedPlant === plant ? "white" : "#333",
              border: `1px solid ${inverterData[plant].color}`,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: "0.65rem",
              height: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor:
                  selectedPlant === plant
                    ? inverterData[plant].color
                    : "rgba(255, 255, 255, 1)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              },
            }}
          />
        ))}
      </Box>

      {/* Inverter Images */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {renderInverters()}
      </Box>
    </Card>
  );
};

export default InverterSection;
