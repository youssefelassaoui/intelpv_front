import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

function Diagnostics() {
  const { language } = useLanguage();
  const theme = useTheme();
  const t = translations[language];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          color: "text.primary",
          mb: 2,
        }}
      >
        {t.nav.diagnostics || "DIAGNOSTICS"}
      </Typography>
      <Box
        sx={{
          mt: 4,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Diagnostics page content will be added here.
        </Typography>
      </Box>
    </Box>
  );
}

export default Diagnostics;

