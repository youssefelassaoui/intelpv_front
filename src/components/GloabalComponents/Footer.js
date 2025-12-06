"use client";
import { Box, Typography, Link } from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#3C3D37",
        padding: "0.5rem",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Centered content */}
      <Box
        sx={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: "Poppins, sans-serif",
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "0.875rem",
            "& a": {
              color: "#77B254",
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
                color: "#8bc34a",
              },
            },
          }}
        >
          {t.footer.copyright}{" "}
          <Link
            href="https://www.greenenergypark.ma/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              fontWeight: 500,
            }}
          >
            greenenergypark.ma
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
