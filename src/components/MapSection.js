import React, { useState, useRef } from "react";
import { Box, Card, Typography, Chip } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Plant locations with coordinates
const plantLocations = [
  {
    id: 1,
    name: "Solar Farm Alpha",
    coordinates: [33.4484, -112.074], // Phoenix, AZ area
    capacity: "12.5 MW",
    color: "#2E7D32",
  },
  {
    id: 2,
    name: "Sunlight Beta Station",
    coordinates: [37.7749, -122.4194], // San Francisco, CA area
    capacity: "8.2 MW",
    color: "#66BB6A",
  },
  {
    id: 3,
    name: "Green Energy Park",
    coordinates: [30.2672, -97.7431], // Austin, TX area
    capacity: "15.0 MW",
    color: "#81C784",
  },
  {
    id: 4,
    name: "Solar Valley Plant",
    coordinates: [36.1699, -115.1398], // Las Vegas, NV area
    capacity: "10.8 MW",
    color: "#A5D6A7",
  },
  {
    id: 5,
    name: "Desert Sun Complex",
    coordinates: [33.4538, -112.074], // Phoenix, AZ area (slightly offset)
    capacity: "18.3 MW",
    color: "#C8E6C9",
  },
];

// Component to handle map fly to functionality
function FlyToMarker({ coordinates }) {
  const map = useMap();
  map.flyTo(coordinates, 10, {
    duration: 1.5,
  });
  return null;
}

// Custom PV system icon
const pvSystemIcon = new L.Icon({
  iconUrl: "/PvSysIcon.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const MapSection = () => {
  const [activeLocation, setActiveLocation] = useState(null);
  const mapRef = useRef(null);

  const handleChipClick = (plant) => {
    setActiveLocation(plant);
  };

  return (
    <Card
      sx={{
        p: 2,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        height: "350px", // Reduced height
        display: "flex",
        flexDirection: "column",
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
        Plant Locations
      </Typography>

      {/* Add CSS to ensure the map container takes full height */}
      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 4px;
        }
      `}</style>

      <Box sx={{ position: "relative", flexGrow: 1 }}>
        <MapContainer
          center={[39.8283, -98.5795]} // Center of the US
          zoom={4}
          scrollWheelZoom={true}
          minZoom={3} // Limit zoom out
          maxBounds={[
            [-90, -180],
            [90, 180],
          ]} // Limit panning
          ref={mapRef}
          style={{ height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {plantLocations.map((plant) => (
            <Marker
              key={plant.id}
              position={plant.coordinates}
              icon={pvSystemIcon}
            >
              <Tooltip permanent direction="top" offset={[0, -16]}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.75rem",
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
            top: 10,
            left: 0,
            right: 0,
            zIndex: 1000,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "center", // Center the chips
            px: 2, // Add some padding on the sides
          }}
        >
          {plantLocations.map((plant) => (
            <Chip
              key={plant.id}
              label={plant.name}
              onClick={() => handleChipClick(plant)}
              sx={{
                backgroundColor:
                  activeLocation?.id === plant.id
                    ? plant.color
                    : "rgba(255, 255, 255, 0.9)",
                color: activeLocation?.id === plant.id ? "white" : "#333",
                border: `1px solid ${plant.color}`,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                fontSize: "0.75rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)", // Add shadow for better visibility
                "&:hover": {
                  backgroundColor:
                    activeLocation?.id === plant.id
                      ? plant.color
                      : "rgba(255, 255, 255, 1)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
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
