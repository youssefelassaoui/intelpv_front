"use client";
import { Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CustomDateRangePicker from "../components/CustomDateRangePicker";
import WeatherCards from "../components/WeatherCards";
import ChartSection from "../components/WeatherChartSection";
import Footer from "../components/Footer";

const WeatherStation = () => {
  const [startDate, setStartDate] = useState(new Date("2024-10-09"));
  const [endDate, setEndDate] = useState(new Date("2024-10-15"));

  // Static weather data
  const staticWeatherData = [
    {
      date: "2024-10-09",
      temperature: 28.5,
      humidity: 65,
      windSpeed: 12,
      solarRadiation: 850,
      precipitation: 0,
    },
    {
      date: "2024-10-10",
      temperature: 29.2,
      humidity: 62,
      windSpeed: 10,
      solarRadiation: 920,
      precipitation: 0,
    },
    {
      date: "2024-10-11",
      temperature: 27.8,
      humidity: 70,
      windSpeed: 15,
      solarRadiation: 780,
      precipitation: 2.5,
    },
    {
      date: "2024-10-12",
      temperature: 26.5,
      humidity: 75,
      windSpeed: 18,
      solarRadiation: 650,
      precipitation: 8.2,
    },
    {
      date: "2024-10-13",
      temperature: 25.9,
      humidity: 72,
      windSpeed: 14,
      solarRadiation: 720,
      precipitation: 1.5,
    },
    {
      date: "2024-10-14",
      temperature: 27.3,
      humidity: 68,
      windSpeed: 11,
      solarRadiation: 830,
      precipitation: 0,
    },
    {
      date: "2024-10-15",
      temperature: 28.7,
      humidity: 63,
      windSpeed: 9,
      solarRadiation: 890,
      precipitation: 0,
    },
  ];

  // Static additional weather data
  const staticAdditionalWeatherData = [
    {
      date: "2024-10-09",
      pressure: 1012,
      uvIndex: 8,
      visibility: 15,
      dewPoint: 21.3,
      cloudCover: 10,
    },
    {
      date: "2024-10-10",
      pressure: 1013,
      uvIndex: 9,
      visibility: 16,
      dewPoint: 21.5,
      cloudCover: 5,
    },
    {
      date: "2024-10-11",
      pressure: 1010,
      uvIndex: 7,
      visibility: 12,
      dewPoint: 22.1,
      cloudCover: 30,
    },
    {
      date: "2024-10-12",
      pressure: 1008,
      uvIndex: 5,
      visibility: 8,
      dewPoint: 22.8,
      cloudCover: 70,
    },
    {
      date: "2024-10-13",
      pressure: 1009,
      uvIndex: 6,
      visibility: 10,
      dewPoint: 22.3,
      cloudCover: 40,
    },
    {
      date: "2024-10-14",
      pressure: 1011,
      uvIndex: 7,
      visibility: 14,
      dewPoint: 21.8,
      cloudCover: 20,
    },
    {
      date: "2024-10-15",
      pressure: 1012,
      uvIndex: 8,
      visibility: 15,
      dewPoint: 21.4,
      cloudCover: 15,
    },
  ];

  // Filter data based on selected date range
  const filteredWeatherData = staticWeatherData.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });

  const filteredAdditionalWeatherData = staticAdditionalWeatherData.filter(
    (item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    }
  );

  return (
    <>
      <Navbar />
      <Grid
        container
        sx={{ backgroundColor: "#F5F7F8", minHeight: "100vh", padding: 3 }}
      >
        {/* Weather Cards */}
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center"
          sx={{ marginBottom: 2 }}
        >
          <WeatherCards loading={false} />
        </Grid>

        {/* Date Picker and Title */}
        <Grid
          container
          sx={{
            mb: 2,
            px: 2,
          }}
        >
          <Grid container item xs={12} md={11.5} spacing={2}>
            <Grid item xs={3} display="flex" alignItems="center">
              <Typography
                sx={{
                  fontSize: "16px",
                  fontFamily: "Poppins, sans-serif",
                  color: "#333",
                  fontWeight: 500,
                  ml: 6,
                }}
              >
                WEATHER STATION
              </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="center">
              <CustomDateRangePicker
                startDate={startDate}
                endDate={endDate}
                onRangeChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
              />
            </Grid>
            <Grid item xs={3} />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={11.5}>
            <ChartSection
              weatherData={filteredWeatherData}
              additionalWeatherData={filteredAdditionalWeatherData}
            />
          </Grid>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default WeatherStation;
