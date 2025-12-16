"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Card, Typography, Chip, useTheme } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const plantLocations = [
  {
    id: 1,
    name: "Green & Smart B.P.",
    plantId: 49951765,
    coordinates: [32.217, -7.931],
    capacity: "6 kW",
    color: "#2E7D32",
  },
  {
    id: 2,
    name: "Green Energy Park",
    coordinates: [32.2207, -7.9287],
    capacity: "-- MW",
    color: "#6EC3C4",
  },
  {
    id: 3,
    name: "Hospital Rien Sofía",
    plantId: 36076361,
    coordinates: [37.872, -4.7894],
    capacity: "1.72 MW",
    color: "#1976D2",
  },
  {
    id: 4,
    name: "Mohammed VI Museum",
    plantId: 33783322,
    coordinates: [34.0136, -6.8373],
    capacity: "136 KW",
    color: "#F57C00",
  },
  {
    id: 5,
    name: "Fkih ben saleh",
    coordinates: [32.5779, -6.6217],
    capacity: "400 KW",
    color: "#63AEE2",
  },
  {
    id: 6,
    name: "SESA Project",
    coordinates: [32.2230987035737, -7.899800584375511],
    capacity: "25 KW",
    color: "#5C8FA6",
  },
];

// Component to handle map fly to functionality
function FlyToMarker({ coordinates }) {
  const map = useMap();
  map.flyTo(coordinates, 15, {
    duration: 1.5,
  });
  return null;
}

// Custom PV system icon - needs to be created inside component to handle dark mode
const createPvSystemIcon = (isDarkMode) => {
  const iconUrl = `${process.env.PUBLIC_URL || ''}/SystemIcon.svg`;
  return new L.Icon({
    iconUrl: iconUrl,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const MapSection = () => {
  const [activeLocation, setActiveLocation] = useState(null);
  const mapRef = useRef(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const handleChipClick = (plant) => {
    setActiveLocation(plant);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'leaflet-dark-mode-styles';
    style.textContent = `
      .leaflet-container {
        background-color: ${isDarkMode ? '#1a1a1a' : '#f5f5f5'} !important;
      }
      .leaflet-tooltip {
        background-color: ${isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'} !important;
        color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        border: 1px solid ${isDarkMode ? '#555' : '#ccc'} !important;
        box-shadow: ${isDarkMode ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.2)'} !important;
      }
      .leaflet-control {
        background-color: ${isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)'} !important;
      }
      .leaflet-control-zoom a {
        background-color: ${isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)'} !important;
        color: ${isDarkMode ? '#ffffff' : '#000000'} !important;
        border-color: ${isDarkMode ? '#555' : '#ccc'} !important;
      }
      .leaflet-control-zoom a:hover {
        background-color: ${isDarkMode ? 'rgba(50, 50, 50, 0.9)' : 'rgba(240, 240, 240, 0.9)'} !important;
      }
    `;
    const existingStyle = document.getElementById('leaflet-dark-mode-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    document.head.appendChild(style);
    return () => {
      const styleToRemove = document.getElementById('leaflet-dark-mode-styles');
      if (styleToRemove) {
        document.head.removeChild(styleToRemove);
      }
    };
  }, [isDarkMode]);

  return (
    <Card
      sx={{
        p: 1.5, // Reduced from p: 2
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        height: "320px", // Reduced from 350px
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: "14px", // Reduced from 16px
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          mb: 1, // Added mb to reduce space
        }}
      >
        Plant Locations
      </Typography>

      {/* Add CSS to ensure the map container takes full height */}
      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 4px;
        }
        .leaflet-tooltip {
          padding: 3px 6px !important;
        }
      `}</style>

      <Box sx={{ position: "relative", flexGrow: 1 }}>
        <MapContainer
          center={[33.5, -7.5]} // Centered on Morocco
          zoom={5}
          scrollWheelZoom={true}
          minZoom={3} // Limit zoom out
          maxBounds={[
            [-90, -180],
            [90, 180],
          ]} // Limit panning
          ref={mapRef}
          style={{ height: "100%" }}
        >
          {isDarkMode ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          {plantLocations.map((plant) => (
            <Marker
              key={plant.id}
              position={plant.coordinates}
              icon={createPvSystemIcon(isDarkMode)}
            >
              <Tooltip permanent direction="top" offset={[0, -14]}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.65rem",
                    }}
                  >
                    {plant.name}
                  </Box>
                </Box>
              </Tooltip>
            </Marker>
          ))}

          {activeLocation && (
            <FlyToMarker coordinates={activeLocation.coordinates} />
          )}
        </MapContainer>

        {/* Centered chips positioned on top of the map */}
        <Box
          sx={{
            position: "absolute",
            top: 8, // Reduced from 10
            left: 0,
            right: 0,
            zIndex: 1000,
            display: "flex",
            gap: 0.75, // Reduced from 1
            flexWrap: "wrap",
            justifyContent: "center", // Center the chips
            px: 1.5, // Reduced from 2
          }}
        >
          {plantLocations.map((plant) => (
            <Chip
              key={plant.id}
              label={plant.name}
              onClick={() => handleChipClick(plant)}
              sx={{
                backgroundColor: (theme) =>
                  activeLocation?.id === plant.id
                    ? plant.color
                    : theme.palette.mode === "light"
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(30, 30, 30, 0.9)",
                color: (theme) =>
                  activeLocation?.id === plant.id
                    ? "white"
                    : theme.palette.text.primary,
                border: `1px solid ${plant.color}`,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                fontSize: "0.65rem",
                height: "24px",
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "0 1px 3px rgba(0,0,0,0.2)"
                    : "0 1px 3px rgba(0,0,0,0.5)",
                "&:hover": {
                  backgroundColor: (theme) =>
                    activeLocation?.id === plant.id
                      ? plant.color
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
      </Box>
    </Card>
  );
};

export default MapSection;
