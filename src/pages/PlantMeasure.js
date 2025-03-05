"use client";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";
import Navbar from "../components/GloabalComponents/Navbar";
import MetricsHeader from "../components/PlantMeasure/MetricsHeader";
import Footer from "../components/GloabalComponents/Footer";
import CustomDateRangePicker from "../components/GloabalComponents/CustomDateRangePicker";

const PlantMeasures = () => {
  const [startDate, setStartDate] = useState(new Date("2023-08-25"));
  const [endDate, setEndDate] = useState(new Date("2023-08-31"));
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Navbar />
      <MetricsHeader />

      {/* Date Range and Tabs Section */}
      <Container maxWidth={false} sx={{ mt: 2, px: 3 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: "#333",
                fontSize: "1.2rem",
              }}
            >
              Plant Measures
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
            }}
          >
            <CustomDateRangePicker
              startDate={startDate}
              endDate={endDate}
              onRangeChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                textTransform: "none",
                minWidth: 100,
                fontSize: "0.9rem",
              },
              "& .Mui-selected": {
                color: " #2E7D32 ",
                fontWeight: 600,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "black",
              },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Production" />
            <Tab label="Performance" />
            <Tab label="Comparison" />
          </Tabs>
        </Box>

        {/* Placeholder Content Based on Active Tab */}
        <Box sx={{ mb: 4 }}>
          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Card
                  sx={{
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "1rem",
                      }}
                    >
                      Daily Production
                    </Typography>
                    <Box
                      sx={{
                        height: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Chart will be displayed here
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "1rem",
                      }}
                    >
                      Performance Metrics
                    </Typography>
                    <Box
                      sx={{
                        height: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Metrics will be displayed here
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card
                  sx={{
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "1rem",
                      }}
                    >
                      Plant Details
                    </Typography>
                    <Box
                      sx={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Plant details will be displayed here
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Box
              sx={{
                height: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Production data will be displayed here
              </Typography>
            </Box>
          )}

          {activeTab === 2 && (
            <Box
              sx={{
                height: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Performance data will be displayed here
              </Typography>
            </Box>
          )}

          {activeTab === 3 && (
            <Box
              sx={{
                height: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Comparison data will be displayed here
              </Typography>
            </Box>
          )}
        </Box>
      </Container>

      <Box sx={{ flexGrow: 1 }} />
      <Footer />
    </Box>
  );
};

export default PlantMeasures;
