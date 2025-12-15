"use client";

import { useState } from "react";
import { Box, Card, Typography, Chip, Grid } from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";

const inverterData = {
  "Green & Smart B.P.": {
    images: ["/SUN2000-20KTL-M0-removebg-preview.png"],
    names: ["SUN2000-20KTL-M0"],
    color: "#2E7D32",
  },
  "Green Energy Park": {
    images: ["/SUN2000-100KTL-M1-removebg-preview.png"],
    names: ["SUN2000-100KTL-M1"],
    color: "#6EC3C4",
  },
  "Hospital Rien Sofía": {
    images: ["/SUN2000-60KTL-M0-removebg-preview.png", "/SUN2000L-5KTL-removebg-preview.png"],
    names: ["SUN2000-60KTL-M0", "SUN2000L-5KTL"],
    color: "#1976D2",
  },
  "Mohammed VI Museum": {
    images: ["/SUN2000L-5KTL-removebg-preview.png"],
    names: ["SUN2000L-5KTL"],
    color: "#F57C00",
  },
  "Fkih ben saleh": {
    images: ["/SUN2000-60KTL-M0-removebg-preview.png", "/SUN2000-20KTL-M0-removebg-preview.png"],
    names: ["SUN2000-60KTL-M0", "SUN2000-20KTL-M0"],
    color: "#63AEE2",
  },
  "SESA Project": {
    images: ["/sesa.webp"],
    names: [" DEYE SUN-8K-SG04LP3-EU"],
    color: "#5C8FA6",
  },
};

const InverterSection = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [selectedPlant, setSelectedPlant] = useState(
    "Green & Smart B.P."
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
            <Box
              sx={{
                width: "100%",
                height: "180px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
              }}
            >
              <img
                src={imgSrc || "/placeholder.svg"}
                alt={`Inverter ${names[index]}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                  console.error(`Failed to load image: ${imgSrc}`);
                }}
              />
            </Box>
            <Typography
              sx={{
                mt: 0.5,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 500,
                color: "text.primary",
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
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          mb: 1,
          color: "text.primary",
        }}
      >
        {t.overview.plantInverters}
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
              backgroundColor: (theme) =>
                selectedPlant === plant
                  ? inverterData[plant].color
                  : theme.palette.mode === "light"
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(30, 30, 30, 0.9)",
              color: (theme) =>
                selectedPlant === plant ? "white" : theme.palette.text.primary,
              border: `1px solid ${inverterData[plant].color}`,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: "0.65rem",
              height: "24px",
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 1px 3px rgba(0,0,0,0.1)"
                  : "0 1px 3px rgba(0,0,0,0.5)",
              "&:hover": {
                backgroundColor: (theme) =>
                  selectedPlant === plant
                    ? inverterData[plant].color
                    : theme.palette.mode === "light"
                      ? "rgba(255, 255, 255, 1)"
                      : "rgba(30, 30, 30, 1)",
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "0 2px 4px rgba(0,0,0,0.2)"
                    : "0 2px 4px rgba(0,0,0,0.5)",
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
