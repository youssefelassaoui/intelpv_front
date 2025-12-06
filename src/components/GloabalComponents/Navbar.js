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
import { UserButton } from "@clerk/clerk-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../translations";
import MenuIcon from "@mui/icons-material/Menu";
import CloudIcon from "@mui/icons-material/Cloud";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import WarningIcon from "@mui/icons-material/Warning";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import LanguageIcon from "@mui/icons-material/Language";

const NavItem = styled(Typography)(({ theme, selected }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  textDecoration: "none",
  fontSize: "0.75rem",
  lineHeight: "4rem",
  fontFamily: "'Poppins', sans-serif",
  color: selected ? "#2E7D32" : "#4A5568",
  borderBottom: selected ? "2px solid #2E7D32" : "none",
  "&:hover": {
    color: "#2E7D32",
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
    backgroundColor: "#2E7D32",
    transform: "scaleX(0)",
    transition: "transform 0.3s ease-in-out",
  },
  "&:hover::after": {
    transform: selected ? "scaleX(0)" : "scaleX(1)",
  },
}));


export default function ToolbarComponent() {
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

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
      path: "/alarms",
      label: t.nav.alarms,
      icon: <WarningIcon sx={{ fontSize: "1.2rem" }} />,
    },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffff",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src="intelligentpv-logo.png"
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
            sx={{ color: "black" }}
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
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={language}
              onChange={handleLanguageChange}
              sx={{
                height: "36px",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.75rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E2E8F0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2E7D32",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2E7D32",
                },
              }}
            >
              <MenuItem value="en" sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.75rem" }}>
                EN
              </MenuItem>
              <MenuItem value="fr" sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.75rem" }}>
                FR
              </MenuItem>
            </Select>
          </FormControl>
          <UserButton />
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
                color: location.pathname === item.path ? "#2E7D32" : "#4A5568",
                gap: 1,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.75rem",
                "&:hover": {
                  color: "#2E7D32",
                },
              }}
            >
              {item.icon}
              {item.label}
            </MenuItem>
          ))}
          <MenuItem
            sx={{
              borderTop: "1px solid #E2E8F0",
              gap: 1,
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.75rem",
            }}
          >
            <FormControl size="small" fullWidth>
              <Select
                value={language}
                onChange={handleLanguageChange}
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.75rem",
                }}
              >
                <MenuItem value="en">EN</MenuItem>
                <MenuItem value="fr">FR</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>
          <MenuItem
            sx={{
              gap: 1,
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.75rem",
            }}
          >
            <UserButton />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
