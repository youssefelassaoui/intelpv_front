import React, { useState } from "react";
import { Box, Card, Typography, Chip, Grid } from "@mui/material";

// Inverter image paths and names
const inverterData = {
  "Solar Farm Alpha": {
    images: ["/SUN2000-100KTL-M1-removebg-preview.png"],
    names: ["SUN2000-100KTL-M1"],
    color: "#2E7D32",
  },
  "Sunlight Beta Station": {
    images: [
      "/SUN2000-20KTL-M0-removebg-preview.png",
      "/SUN2000-60KTL-M0-removebg-preview.png",
    ],
    names: ["SUN2000-20KTL-M0", "SUN2000-60KTL-M0"],
    color: "#66BB6A",
  },
  "Green Energy Park": {
    images: [
      "/SUN2000L-5KTL-removebg-preview.png",
      "/SUN2000-60KTL-M0-removebg-preview.png",
    ],
    names: ["SUN2000L-5KTL", "SUN2000-60KTL-M0"],
    color: "#81C784",
  },
  "Solar Valley Plant": {
    images: ["/SUN2000-60KTL-M0-removebg-preview.png"],
    names: ["SUN2000-60KTL-M0"],
    color: "#A5D6A7",
  },
  "Desert Sun Complex": {
    images: [
      "/SUN2000-20KTL-M0-removebg-preview.png",
      "/SUN2000-100KTL-M1-removebg-preview.png",
    ],
    names: ["SUN2000-20KTL-M0", "SUN2000-100KTL-M1"],
    color: "#C8E6C9",
  },
};

const InverterSection = () => {
  // State to keep track of selected plant
  const [selectedPlant, setSelectedPlant] = useState("Solar Farm Alpha");

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
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          container
          spacing={1} // Reduced spacing between grid items
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: "100%" }} // Ensure grid doesn't exceed container width
        >
          {images.map((imgSrc, index) => (
            <Grid
              item
              xs={5.5} // Reduced from 6 to 5.5 to prevent overflow
              key={`${selectedPlant}-${index}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  p: 1,
                  height: "110px", // Slightly reduced height
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={imgSrc || "/placeholder.svg"}
                  alt={`Inverter ${names[index]}`}
                  style={{
                    maxWidth: "90%", // Reduced from 100% to 90%
                    maxHeight: "90px", // Reduced from 100px to 90px
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  mt: 1,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.7rem", // Reduced font size slightly
                  fontWeight: 500,
                  color: "#333",
                  textAlign: "center",
                  // Ensure text doesn't overflow
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
      </Box>
    );
  };

  return (
    <Card
      sx={{
        p: 2,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        height: "350px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent any overflow
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: "16px",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
        }}
      >
        Plant Inverters
      </Typography>

      {/* Chip Selection */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
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
              fontSize: "0.75rem",
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

      {/* Inverter Images - Now with vertical centering and reduced width */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          overflow: "hidden", // Prevent scrolling
        }}
      >
        {renderInverters()}
      </Box>
    </Card>
  );
};

export default InverterSection;
