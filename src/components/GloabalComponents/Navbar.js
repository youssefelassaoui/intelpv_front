"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useThemeMode } from "../../contexts/ThemeContext";
import { translations } from "../../translations";
import ReactCountryFlag from "react-country-flag";
import MenuIcon from "@mui/icons-material/Menu";
import CloudIcon from "@mui/icons-material/Cloud";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import LanguageIcon from "@mui/icons-material/Language";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";

const NavItem = styled(Typography)(({ theme, selected }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  textDecoration: "none",
  fontSize: "0.75rem",
  lineHeight: "4rem",
  fontFamily: "'Poppins', sans-serif",
  color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
  borderBottom: selected ? `2px solid ${theme.palette.primary.main}` : "none",
  "&:hover": {
    color: theme.palette.primary.main,
  },
  cursor: "pointer",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -1,
    left: 0,
    width: "100%",
    height: "2px",
    backgroundColor: theme.palette.primary.main,
    transform: "scaleX(0)",
    transition: "transform 0.3s ease-in-out",
  },
  "&:hover::after": {
    transform: selected ? "scaleX(0)" : "scaleX(1)",
  },
}));


export default function ToolbarComponent() {
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null);
  const [mobileLanguageMenuAnchorEl, setMobileLanguageMenuAnchorEl] = useState(null);
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { mode, toggleMode } = useThemeMode();
  let user = null;
  try {
    const userData = useUser();
    user = userData.user;
  } catch (error) {
    console.warn('Clerk not available:', error);
  }
  const t = translations[language];

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleLanguageMenuOpen = (event) => {
    event.stopPropagation();
    setLanguageMenuAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchorEl(null);
  };

  const handleMobileLanguageMenuOpen = (event) => {
    event.stopPropagation();
    setMobileLanguageMenuAnchorEl(event.currentTarget);
  };

  const handleMobileLanguageMenuClose = () => {
    setMobileLanguageMenuAnchorEl(null);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setLanguageMenuAnchorEl(null);
    setMobileLanguageMenuAnchorEl(null);
  };

  const languages = [
    { code: "en", flag: "GB", name: "English" },
    { code: "fr", flag: "FR", name: "Français" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  const navItems = [
    {
      path: "/overview",
      label: t.nav.overview,
      icon: <DashboardIcon sx={{ fontSize: "1.2rem" }} />,
    },
    {
      path: "/plant-measures",
      label: t.nav.plantMeasures,
      icon: <EqualizerIcon sx={{ fontSize: "1.2rem" }} />,
    },
      {
        path: "/diagnostics",
        label: t.nav.diagnostics,
        icon: <TroubleshootIcon sx={{ fontSize: "1.2rem" }} />,
      },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src={mode === "dark" ? "intelligentpv-logo-white.png" : "intelligentpv-logo.png"}
            alt="Logo"
            style={{ height: "35px" }}
          />
        </Box>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
          <IconButton
            size="large"
            aria-label="menu"
            aria-controls="menu-mobile"
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            sx={{ color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Desktop Nav Items */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            gap: 4,
          }}
        >
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              {item.icon}
              {item.label}
            </NavItem>
          ))}
        </Box>

        {/* Language Switcher and User Button */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
          <Box
            onClick={handleLanguageMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "action.hover",
                boxShadow: "0 2px 4px rgba(46, 125, 50, 0.1)",
              },
            }}
          >
            <ReactCountryFlag
              countryCode={currentLanguage.flag}
              svg
              style={{
                width: "20px",
                height: "15px",
                borderRadius: "2px",
              }}
            />
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "text.primary",
                textTransform: "uppercase",
              }}
            >
              {currentLanguage.code}
            </Typography>
            <KeyboardArrowDownIcon
              sx={{
                fontSize: "16px",
                color: "text.secondary",
                transition: "transform 0.2s ease",
                transform: languageMenuAnchorEl ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </Box>
          <Menu
            anchorEl={languageMenuAnchorEl}
            open={Boolean(languageMenuAnchorEl)}
            onClose={handleLanguageMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: "140px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {languages.map((lang) => (
              <MenuItem
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                selected={language === lang.code}
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.875rem",
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(46, 125, 50, 0.08)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(46, 125, 50, 0.12)",
                    "&:hover": {
                      backgroundColor: "rgba(46, 125, 50, 0.16)",
                    },
                  },
                }}
              >
                <ReactCountryFlag
                  countryCode={lang.flag}
                  svg
                  style={{
                    width: "24px",
                    height: "18px",
                    borderRadius: "2px",
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: language === lang.code ? 600 : 400,
                    color: language === lang.code ? "primary.main" : "text.primary",
                  }}
                >
                  {lang.name}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
          <IconButton
            onClick={toggleMode}
            sx={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              color: "text.primary",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "action.hover",
                borderColor: "primary.main",
                transform: "scale(1.05)",
              },
            }}
            aria-label="toggle theme"
          >
            {mode === "light" ? (
              <DarkModeIcon sx={{ fontSize: "20px" }} />
            ) : (
              <LightModeIcon sx={{ fontSize: "20px" }} />
            )}
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              padding: "6px 12px",
              borderRadius: "8px",
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "action.hover",
                borderColor: "primary.main",
              },
            }}
          >
            {user && <UserButton />}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0.25,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "text.primary",
                  lineHeight: 1.2,
                }}
              >
                {user?.firstName || user?.username || "User"}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 400,
                  color: "text.secondary",
                  lineHeight: 1.2,
                }}
              >
                {user?.primaryEmailAddress?.emailAddress || ""}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Mobile Menu */}
        <Menu
          id="menu-mobile"
          anchorEl={mobileMenuAnchorEl}
          keepMounted
          open={Boolean(mobileMenuAnchorEl)}
          onClose={handleMobileMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              width: "100%",
              maxWidth: "300px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              backgroundColor: "background.paper",
            },
          }}
        >
          {navItems.map((item) => (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleMobileMenuClose}
              selected={location.pathname === item.path}
              sx={{
                color: location.pathname === item.path ? "primary.main" : "text.secondary",
                gap: 1,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.75rem",
                "&:hover": {
                  color: "primary.main",
                  backgroundColor: "action.hover",
                },
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                },
              }}
            >
              {item.icon}
              {item.label}
            </MenuItem>
          ))}
          <Box
            sx={{
              borderTop: "1px solid #E2E8F0",
              padding: "8px 16px",
            }}
          >
            <Box
              onClick={handleMobileLanguageMenuOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "action.hover",
                "&:hover": {
                  backgroundColor: "action.selected",
                },
              }}
            >
              <ReactCountryFlag
                countryCode={currentLanguage.flag}
                svg
                style={{
                  width: "20px",
                  height: "15px",
                  borderRadius: "2px",
                }}
              />
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "text.primary",
                  textTransform: "uppercase",
                }}
              >
                {currentLanguage.code}
              </Typography>
            </Box>
          </Box>
          <MenuItem
            onClick={toggleMode}
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              gap: 1,
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.75rem",
            }}
          >
            {mode === "light" ? (
              <>
                <DarkModeIcon sx={{ fontSize: "18px" }} />
                <Typography>Dark Mode</Typography>
              </>
            ) : (
              <>
                <LightModeIcon sx={{ fontSize: "18px" }} />
                <Typography>Light Mode</Typography>
              </>
            )}
          </MenuItem>
          <Box
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {user && <UserButton />}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.25,
                flex: 1,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                {user?.firstName || user?.username || "User"}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 400,
                  color: "text.secondary",
                }}
              >
                {user?.primaryEmailAddress?.emailAddress || ""}
              </Typography>
            </Box>
          </Box>
        </Menu>
        <Menu
          anchorEl={mobileLanguageMenuAnchorEl}
          open={Boolean(mobileLanguageMenuAnchorEl)}
          onClose={handleMobileLanguageMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: "140px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              borderRadius: "8px",
            },
          }}
        >
          {languages.map((lang) => (
            <MenuItem
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              selected={language === lang.code}
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.875rem",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <ReactCountryFlag
                countryCode={lang.flag}
                svg
                style={{
                  width: "24px",
                  height: "18px",
                  borderRadius: "2px",
                }}
              />
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: language === lang.code ? 600 : 400,
                }}
              >
                {lang.name}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
