"use client";
import { useState } from "react";
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
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
import MetricsHeader from "../components/PlantMeasure/MetricsHeader";
import Footer from "../components/GloabalComponents/Footer";
import CustomDateRangePicker from "../components/GloabalComponents/CustomDateRangePicker";
import ChartSection from "../components/PlantMeasure/ChartSection";
import PowerCharts from "../components/OverView/PowerCharts";
import DCMetricsChart from "../components/PlantMeasure/DCMetricsChart";
import WeatherMetricsChart from "../components/PlantMeasure/WeatherMetricsChart";

const PlantMeasures = () => {
  const { language } = useLanguage();
  const t = translations[language];
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
        overflow: "hidden",
        width: "100%",
      }}
    >
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
              {t.plantMeasures.title}
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
                color: " #5CB338 !important",
                fontWeight: 600,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#33372C",
              },
            }}
          >
            <Tab label={t.plantMeasures.energyOverview} />
            <Tab label={t.plantMeasures.weatherMetrics} />
            <Tab label={t.plantMeasures.performance} />
            {/* <Tab label="Comparison" /> */}
          </Tabs>
        </Box>

        {/* Content Based on Active Tab */}
        <Box sx={{ mb: 4 }}>
          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card
                  sx={{
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    borderRadius: 2,
                    marginBottom: 2,
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
                      {t.plantMeasures.powerGeneration}
                    </Typography>
                    <PowerCharts />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card
                  sx={{
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    borderRadius: 2,
                    marginBottom: 2,
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
                      {t.plantMeasures.dcMetrics}
                    </Typography>
                    <DCMetricsChart />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Box sx={{ height: "auto" }}>
              <Card
                sx={{
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                  borderRadius: 2,
                  padding: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "1rem",
                  }}
                >
                  {t.plantMeasures.weatherMetricsTitle}
                </Typography>
                <WeatherMetricsChart />
              </Card>
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ height: "auto" }}>
              <Card
                sx={{
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                  borderRadius: 2,
                  padding: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "1rem",
                  }}
                >
                  {t.plantMeasures.performanceData}
                </Typography>
                <ChartSection />
              </Card>
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
