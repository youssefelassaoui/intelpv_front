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
  Chip,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CloudIcon from "@mui/icons-material/Cloud";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import WarningIcon from "@mui/icons-material/Warning";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EqualizerIcon from "@mui/icons-material/Equalizer";

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

const UserContainer = styled(Box)(({ open }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: open ? "auto" : "40px",
  transition: "width 0.3s ease-in-out",
  overflow: "hidden",
}));

const UserChip = styled(Chip)(({ open }) => ({
  position: "absolute",
  right: 0,
  opacity: open ? 1 : 0,
  transform: open ? "translateX(0)" : "translateX(100%)",
  transition: "all 0.3s ease-in-out",
  backgroundColor: "#f5f5f5",
  "& .MuiChip-deleteIcon": {
    color: "#4A5568",
  },
}));

export default function ToolbarComponent() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUserMenuOpen(!userMenuOpen);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
    setUserMenuOpen(false);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const navItems = [
    {
      path: "/overview",
      label: "OVERVIEW",
      icon: <DashboardIcon sx={{ fontSize: "1.2rem" }} />,
    },
    {
      path: "/plants_list",
      label: "PLANT-MEASURES",
      icon: <EqualizerIcon sx={{ fontSize: "1.2rem" }} />,
    },

    {
      path: "/weather-station",
      label: "WEATHER STATION",
      icon: <CloudIcon sx={{ fontSize: "1.2rem" }} />,
    },
    {
      path: "/alarms",
      label: "ALARMS",
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

        {/* User Icon and Menu */}
        <UserContainer
          open={userMenuOpen}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <IconButton
            sx={{ color: "black" }}
            aria-label="user"
            onClick={handleUserMenuClick}
          >
            <AccountCircle />
          </IconButton>
          <UserChip
            open={userMenuOpen}
            label="User Name"
            deleteIcon={<ArrowDropDownIcon />}
            onDelete={() => {}}
          />
        </UserContainer>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 120,
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            },
          }}
        >
          <MenuItem onClick={handleUserMenuClose}>Déconnecter</MenuItem>
        </Menu>

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
            onClick={handleUserMenuClose}
            sx={{
              borderTop: "1px solid #E2E8F0",
              gap: 1,
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.75rem",
            }}
          >
            <AccountCircle sx={{ fontSize: "1.2rem" }} />
            Déconnecter
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
