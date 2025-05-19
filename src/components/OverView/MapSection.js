"use client"

import { useState, useRef } from "react"
import { Box, Card, Typography, Chip } from "@mui/material"
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Plant locations with coordinates - updated for our plants
const plantLocations = [
  {
    id: 1,
    name: "Green & Smart Building Park",
    coordinates: [32.217, -7.931],
    capacity: "6 kW",
    color: "#129990",
  },
  {
    id: 2,
    name: "Green Energy Park (Trina)",
    coordinates: [32.2207, -7.9287],
    capacity: "-- MW",
    color: "#129990",
  },
  {
    id: 3,
    name: "Hospital Universario..",
    coordinates: [37.872, -4.7894],
    capacity: "1.72 MW",
    color: "#129990",
  },
  {
    id: 4,
    name: "Mohammed VI Museum",
    coordinates: [34.0136, -6.8373],
    capacity: "136 KW",
    color: "#129990",
  },
  {
    id: 5,
    name: "Fkih ben saleh",
    coordinates: [32.5779, -6.6217],
    capacity: "400 KW",
    color: "#129990",
  },
  {
    id: 6,
    name: "SESA Project",
    coordinates: [32.2230987035737, -7.899800584375511], // Marrakech
    capacity: "25 KW",
    color: "#129990",
  },
]

// Component to handle map fly to functionality
function FlyToMarker({ coordinates }) {
  const map = useMap()
  map.flyTo(coordinates, 15, {
    duration: 1.5,
  })
  return null
}

// Custom PV system icon
const pvSystemIcon = new L.Icon({
  iconUrl: "/PvSysIcon.svg",
  iconSize: [28, 28], // Reduced from 32, 32
  iconAnchor: [14, 14], // Adjusted for new size
  popupAnchor: [0, -14], // Adjusted for new size
})

const MapSection = () => {
  const [activeLocation, setActiveLocation] = useState(null)
  const mapRef = useRef(null)

  const handleChipClick = (plant) => {
    setActiveLocation(plant)
  }

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
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {plantLocations.map((plant) => (
            <Marker key={plant.id} position={plant.coordinates} icon={pvSystemIcon}>
              <Tooltip permanent direction="top" offset={[0, -14]}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.65rem", // Reduced from 0.75rem
                    }}
                  >
                    {plant.name}
                  </Box>
                </Box>
              </Tooltip>
            </Marker>
          ))}

          {activeLocation && <FlyToMarker coordinates={activeLocation.coordinates} />}
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
                backgroundColor: activeLocation?.id === plant.id ? plant.color : "rgba(255, 255, 255, 0.9)",
                color: activeLocation?.id === plant.id ? "white" : "#333",
                border: `1px solid ${plant.color}`,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                fontSize: "0.65rem", // Reduced from 0.75rem
                height: "24px", // Added to reduce height
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)", // Add shadow for better visibility
                "&:hover": {
                  backgroundColor: activeLocation?.id === plant.id ? plant.color : "rgba(255, 255, 255, 1)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Card>
  )
}

export default MapSection
