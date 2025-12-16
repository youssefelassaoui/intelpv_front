"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Paper, Popover, useTheme } from "@mui/material";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
} from "date-fns";

const CustomDateRangePicker = ({ startDate, endDate, onRangeChange }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(startDate || new Date());
  const [selectionStart, setSelectionStart] = useState(startDate || new Date());
  const [selectionEnd, setSelectionEnd] = useState(endDate || new Date());
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      setSelectionStart(new Date(startDate));
      setSelectionEnd(new Date(endDate));
      setCurrentMonth(new Date(startDate));
    }
  }, [startDate?.getTime(), endDate?.getTime()]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (startDate) {
      setCurrentMonth(new Date(startDate));
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleMouseDown = (date) => {
    setSelectionStart(date);
    setSelectionEnd(date);
    setIsSelecting(true);
  };

  const handleMouseEnter = (date) => {
    if (isSelecting) {
      setSelectionEnd(date);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    if (selectionStart && selectionEnd) {
      const start = new Date(
        Math.min(selectionStart.getTime(), selectionEnd.getTime())
      );
      const end = new Date(
        Math.max(selectionStart.getTime(), selectionEnd.getTime())
      );
      setSelectionStart(start);
      setSelectionEnd(end);
      onRangeChange(start, end);
      handleClose();
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
        if (selectionStart && selectionEnd) {
          const start = new Date(
            Math.min(selectionStart.getTime(), selectionEnd.getTime())
          );
          const end = new Date(
            Math.max(selectionStart.getTime(), selectionEnd.getTime())
          );
          setSelectionStart(start);
          setSelectionEnd(end);
          onRangeChange(start, end);
          handleClose();
        }
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isSelecting, selectionStart, selectionEnd, onRangeChange]);

  const isInRange = (date) => {
    if (!selectionStart || !selectionEnd) return false;
    const start = new Date(Math.min(selectionStart, selectionEnd));
    const end = new Date(Math.max(selectionStart, selectionEnd));
    return isWithinInterval(date, { start, end });
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <Box sx={{ p: 2, userSelect: "none" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <ChevronLeft
            size={20}
            onClick={handlePrevMonth}
            style={{ cursor: "pointer", color: theme.palette.text.secondary }}
          />
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontFamily: "Poppins, sans-serif",
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {format(currentMonth, "MMMM")}
              <ChevronDown size={16} color={theme.palette.text.secondary} />
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontFamily: "Poppins, sans-serif",
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {format(currentMonth, "yyyy")}
              <ChevronDown size={16} color={theme.palette.text.secondary} />
            </Typography>
          </Box>
          <ChevronRight
            size={20}
            onClick={handleNextMonth}
            style={{ cursor: "pointer", color: theme.palette.text.secondary }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Typography
              key={day}
              sx={{
                textAlign: "center",
                color: "text.secondary",
                fontSize: "12px",
                fontFamily: "Poppins, sans-serif",
                mb: 1,
              }}
            >
              {day}
            </Typography>
          ))}
          {days.map((day) => (
            <Box
              key={day.toString()}
              onMouseDown={() => handleMouseDown(day)}
              onMouseEnter={() => handleMouseEnter(day)}
              onMouseUp={handleMouseUp}
              sx={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: isInRange(day) ? "0" : "16px",
                backgroundColor: isInRange(day) 
                  ? theme.palette.primary.main 
                  : "transparent",
                color: isInRange(day)
                  ? "#fff"
                  : isSameMonth(day, currentMonth)
                  ? theme.palette.text.primary
                  : theme.palette.text.disabled,
                fontSize: "13px",
                fontFamily: "Poppins, sans-serif",
                position: "relative",
                "&:hover": {
                  backgroundColor: isInRange(day) 
                    ? theme.palette.primary.dark 
                    : theme.palette.action.hover,
                },
                ...(isSameDay(day, new Date()) && {
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 2,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "16px",
                    height: "2px",
                    backgroundColor: "#4C99F4",
                  },
                }),
                ...(isInRange(day) && {
                  "&:first-of-type": {
                    borderTopLeftRadius: "16px",
                    borderBottomLeftRadius: "16px",
                  },
                  "&:last-of-type": {
                    borderTopRightRadius: "16px",
                    borderBottomRightRadius: "16px",
                  },
                }),
              }}
            >
              {format(day, "d")}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box
          onClick={handleClick}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: "6px",
            padding: "4px 8px",
            cursor: "pointer",
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <Calendar size={12} color={theme.palette.primary.main} />
          <Typography
            sx={{ 
              fontSize: "10px", 
              fontFamily: "Poppins, sans-serif",
              color: "text.primary",
            }}
          >
            {selectionStart
              ? format(selectionStart, "dd/MM/yyyy")
              : "Select"}
          </Typography>
        </Box>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "10px",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          to
        </Typography>
        <Box
          onClick={handleClick}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: "6px",
            padding: "4px 8px",
            cursor: "pointer",
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <Calendar size={12} color={theme.palette.primary.main} />
          <Typography
            sx={{ 
              fontSize: "10px", 
              fontFamily: "Poppins, sans-serif",
              color: "text.primary",
            }}
          >
            {selectionEnd ? format(selectionEnd, "dd/MM/yyyy") : "Select"}
          </Typography>
        </Box>
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          "& .MuiPopover-paper": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            mt: 1,
            backgroundColor: "background.paper",
          },
        }}
      >
        <Paper 
          sx={{ 
            borderRadius: "8px", 
            overflow: "hidden",
            backgroundColor: "background.paper",
          }}
        >
          {renderCalendar()}
        </Paper>
      </Popover>
    </Box>
  );
};

export default CustomDateRangePicker;
