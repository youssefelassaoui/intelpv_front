import { Box, Typography, Card, Divider, useTheme, Skeleton } from "@mui/material"
import { TrendingUp, TrendingDown, InfoOutlined } from "@mui/icons-material"
import { useLanguage } from "../../contexts/LanguageContext"
import { translations } from "../../translations"

const ProductionComparison = ({ loading = false }) => {
  const { language } = useLanguage()
  const theme = useTheme()
  const t = translations[language]
  // Get current date for the week display
  const currentDate = new Date()
  const lastWeekDate = new Date(currentDate)
  lastWeekDate.setDate(currentDate.getDate() - 7)

  // Format dates for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const currentWeekStart = formatDate(lastWeekDate)
  const currentWeekEnd = formatDate(currentDate)

  const plants = [
    {
      name: "Green & Smart Building Park (Brique Rouge)",
      production: "5.8",
      change: "+0.6",
      trend: "up",
      color: "#2E7D32",
    },
    {
      name: "Green Energy Park (Trina)",
      production: "12.3",
      change: "-0.8",
      trend: "down",
      color: "#6EC3C4",
    },
    {
      name: "Hospital Universario Rien Sofía",
      production: "15.4",
      change: "+2.1",
      trend: "up",
      color: "#1976D2",
    },
    {
      name: "Mohammed VI Museum of Modern and Contemporary Art",
      production: "11.2",
      change: "+0.9",
      trend: "up",
      color: "#F57C00",
    },
    {
      name: "Fkih ben saleh",
      production: "8.7",
      change: "-0.5",
      trend: "down",
      color: "#63AEE2",
    },
    {
      name: "SESA Project",
      production: "7.5",
      change: "+1.2",
      trend: "up",
      color: "#5C8FA6",
    },
  ]

  if (loading) {
    return (
      <Card
        sx={{
          p: 1.5,
          height: "100%",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.paper",
          pb: 2,
        }}
      >
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1.5 }} />
        <Skeleton variant="text" width="40%" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
      </Card>
    )
  }

  return (
    <Card
      sx={{
        p: 1.5,
        height: "100%",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
        pb: 2,
      }}
    >
      <Box sx={{ mb: 1.5 }}>
        {" "}
        {/* Reduced from mb: 2 */}
        <Typography
          variant="h6"
          sx={{
            fontSize: "14px",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            color: "text.primary",
          }}
        >
          {t.charts.weeklyProductionComparison}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mt: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: "text.secondary",
              fontSize: "0.65rem", // Reduced from 0.75rem
            }}
          >
            {currentWeekStart} - {currentWeekEnd} {t.charts.vsPreviousWeek}
          </Typography>
          <InfoOutlined
            sx={{
              fontSize: 12, // Reduced from 14
              color: "text.secondary",
              cursor: "help",
            }}
          />
        </Box>
      </Box>
      <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
        {" "}
        {/* Reduced from mb: 2 */}
        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.65rem", // Reduced from 0.75rem
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          {t.charts.plant}
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {" "}
          {/* Reduced from gap: 2 */}
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.65rem", // Reduced from 0.75rem
              color: "text.secondary",
              fontWeight: 500,
              width: "55px", // Reduced from 60px
              textAlign: "right",
            }}
          >
            {t.charts.current}
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.65rem", // Reduced from 0.75rem
              color: "text.secondary",
              fontWeight: 500,
              width: "45px", // Reduced from 50px
              textAlign: "right",
            }}
          >
            {t.charts.wow}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 1 }} /> {/* Reduced from mb: 2 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.75, // Reduced from gap: 1
          flexGrow: 1,
          justifyContent: "space-between", // Distribute items evenly
        }}
      >
        {plants.map((plant) => (
          <Box
            key={plant.name}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 0.75, // Reduced from p: 1
              borderRadius: 1,
              backgroundColor: "rgba(0,0,0,0.02)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              {" "}
              {/* Reduced from gap: 1 */}
              <Box
                sx={{
                  width: 3,
                  height: 20, // Reduced from 24
                  backgroundColor: plant.color,
                  borderRadius: 1,
                }}
              />
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.8rem",
                  color: "text.primary",
                  maxWidth: "120px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {plant.name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "text.primary",
                  width: "55px",
                  textAlign: "right",
                }}
              >
                {plant.production} kW
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.25, // Reduced from 0.5
                  color: plant.trend === "up" ? "#2E7D32" : "#d32f2f",
                  width: "45px", // Reduced from 50px
                  justifyContent: "flex-end",
                }}
              >
                {plant.trend === "up" ? (
                  <TrendingUp sx={{ fontSize: 14 }} /> // Reduced from 16
                ) : (
                  <TrendingDown sx={{ fontSize: 14 }} /> // Reduced from 16
                )}
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.7rem", // Reduced from 0.75rem
                    fontWeight: 600,
                  }}
                >
                  {plant.change}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  )
}

export default ProductionComparison
