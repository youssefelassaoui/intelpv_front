"use client";
import { useMemo, useState } from "react";
import {
  Box,
  useTheme,
  Skeleton,
  Alert,
  Tooltip,
  TextField,
  MenuItem,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Popover,
  InputBase,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import CustomDateRangePicker from "../GloabalComponents/CustomDateRangePicker";
import { format } from "date-fns";

const getStatusCause = (statusCode) => {
  const code = Number(statusCode);
  
  const causes = {
    2065: "Upgrade Failed or Software Version Unmatch",
    2037: "Grid Underfrequency",
    2062: "Low Insulation Resistance",
    103: "High DC Input Voltage",
    200: "Abnormal DC Circuit",
    202: "Abnormal Invert Circuit",
    412: "DC Arc Fault",
    2032: "Grid Failure",
    2033: "Grid Undervoltage",
    2034: "Grid Overvoltage",
    2035: "Unbalanced Grid Voltage",
    301: "Abnormal Grid Voltage",
    305: "Abnormal Grid Frequency",
    326: "Abnormal Grounding",
    2036: "Grid Overfrequency",
    61440: "Monitoring Unit Faulty",
    410: "Abnormal Auxiliary Power",
    411: "AFCI Self-Check Failure",
    2038: "Unstable Grid Frequency",
    2039: "OutputOvercurrent",
    2040: "Output DC Component Overhigh",
    2051: "Abnormal Residual Current",
    2061: "Abnormal Grounding",
    2064: "Device Fault",
    2002: "DC Arc Fault",
    2011: "String Reversed",
    2012: "String Current Backfeed",
    2067: "Transient AC Overvoltage",
    2001: "High String Input Voltage",
    505: "Upgrade Failed",
    504: "Software Version Unmatch",
    321: "Cabinet Overtemperature",
    2031: "Power grid phase wire short-circuit to PE",
    2063: "Overtemperature",
    313: "Low Insulation Resistance",
    318: "Abnormal Residual Current",
    2066: "License Expired",
    322: "Abnormal SPI Communication",
    400: "System Fault",
  };

  if (causes[code]) {
    return causes[code];
  }

  if (code >= 106 && code <= 113) {
    return "Abnormal String " + (code - 105);
  }

  if (code >= 120 && code <= 127) {
    return "String " + (code - 119) + " Reversed";
  }

  return "Unknown Status";
};

const getStatusAction = (statusCode) => {
  const code = Number(statusCode);
  
  const actions = {
    2065: "This text is displayed for information purposes only. If an update is not performed, please Contact inverter service",
    2037: "The inverter automatically recovers after detecting that the power grid becomes normal.",
    2062: "Please check the DC wiring and measure. If you consider the wiring to be in order, Contact inverter service",
    103: "Please check the DC wiring and measure. If you consider the wiring to be in order, Contact inverter service",
    200: "Please check the DC wiring and measure. If you consider the wiring to be in order, Contact inverter service",
    202: "Please check the DC wiring and measure. If you consider the wiring to be in order, Contact inverter service",
    412: "Please check the DC wiring and measure. If you consider the wiring to be in order, Contact inverter service",
    2032: "Please check the AC wiring and measure. If you consider the wiring to be in order, Contact inverter service",
    2033: "Please check the AC wiring and measure. If you consider the wiring to be in order, Contact inverter service",
    2034: "Please check the AC wiring and measure. If you consider the wiring to be in order, Contact inverter service",
    2035: "Please check the AC wiring and measure. If you consider the wiring to be in order, Contact inverter service",
    301: "Please check the AC wiring and measure. If you consider the wiring to be in order, Contact inverter service",
    305: "Please check the AC wiring and measure. If you consider the wiring to be in order, Contact inverter service",
    326: "Please check the AC wiring and measure. If you consider the wiring to be in order, Contact inverter service",
    2036: "If the alarm occurs occasionally, the power grid may be abnormal temporarily.",
    61440: "If problem occurs repeatedly, Contact inverter service",
    410: "If problem occurs repeatedly, Contact inverter service",
    411: "If problem occurs repeatedly, Contact inverter service",
    2038: "If problem occurs once only: wait for the regulator to become stable again. If problem occurs repeatedly: please Contact inverter service",
    2039: "If problem occurs once only: wait for the regulator to become stable again. If problem occurs repeatedly: please Contact inverter service",
    2040: "If problem occurs once only: wait for the regulator to become stable again. If problem occurs repeatedly: please Contact inverter service",
    2051: "If problem occurs once only: wait for the regulator to become stable again. If problem occurs repeatedly: please Contact inverter service",
    2061: "If problem occurs once only: wait for the regulator to become stable again. If problem occurs repeatedly: please Contact inverter service",
    2064: "If constant, Contact inverter service",
    2002: "Check whether the string cables arc or are in poor contact.",
    2011: "Check whether the PV string is reversely connected.",
    2012: "Check whether the PV modules connected in series in the PV string are enough. If not, add more modules.",
    2067: "Check whether the grid connection voltage exceeds the upper threshold. If yes, contact the local power operator.",
    2001: "Check the number of PV modules connected in series in the PV string.",
    505: "Check the manual and update the pv-system again.",
    504: "Check the manual and measure/check the pv-system",
    321: "Check the inverter for heat build up or blockage of the cooler ribs and rectify as required. If this does not correct the problem, Contact inverter service",
    2031: "Check the impedance of the output phase wire to PE.",
    2063: "Check temperature of direct surroundings and reduce this as required.",
    313: "Check system isolation. If you consider the isolation impedance to be in order, Contact inverter service",
    318: "Check system isolation. If you consider the isolation impedance to be in order, Contact inverter service",
    2066: "1.Apply for a new certificate.2.Load the new certificate",
    322: "1.) Switch off device with DC disconnector. 2.) Wait until the display has turned off completely. 3.) Switch on device with DC disconnector. If this does not rectify the error, Contact inverter service",
    400: "1.) Switch off device with DC disconnector. 2.) Wait until the display has turned off completely. 3.) Switch on device with DC disconnector. If this does not rectify the error, Contact inverter service",
  };

  if (actions[code]) {
    return actions[code];
  }

  if (code >= 106 && code <= 113) {
    return "Please check the DC wiring and measure. If you consider the wiring to be in order, Contact inverter service";
  }

  if (code >= 120 && code <= 127) {
    return "Please check the DC wiring and measure. If you consider the wiring to be in order, Contact inverter service";
  }

  return "Contact inverter service";
};

const StatusDataGrid = ({
  statusMeasures,
  loadingStatusMeasures,
  statusError,
  devices,
  statusDeviceId,
  setStatusDeviceId,
  statusStartDate,
  statusEndDate,
  setStatusStartDate,
  setStatusEndDate,
  t,
}) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    dateTime: "",
    deviceName: "",
    statusCode: "",
    cause: "",
    action: "",
  });
  const [filterAnchor, setFilterAnchor] = useState({});
  const [activeFilterColumn, setActiveFilterColumn] = useState(null);

  const processedData = useMemo(() => {
    if (!Array.isArray(statusMeasures) || statusMeasures.length === 0) {
      return [];
    }

    return statusMeasures.map((item, index) => {
      const statusCode = item.measure || item.value || item.statusCode;
      const cause = getStatusCause(statusCode);
      const action = getStatusAction(statusCode);
      const datetime = item.datetime || item.timestamp || item.date || item.time;
      const deviceId = item.deviceId || statusDeviceId;
      const device = devices.find(d => d.key.deviceId.toString() === deviceId?.toString());
      const deviceName = device?.deviceName || "Unknown Device";
      
      return {
        id: `${item.datetime || item.timestamp || Date.now()}-${statusCode}-${index}`,
        datetime: datetime ? new Date(datetime) : new Date(),
        dateTimeFormatted: datetime ? format(new Date(datetime), "dd/MM/yyyy HH:mm:ss") : format(new Date(), "dd/MM/yyyy HH:mm:ss"),
        statusCode: statusCode,
        cause: cause,
        action: action,
        deviceName: deviceName,
      };
    }).sort((a, b) => b.datetime - a.datetime);
  }, [statusMeasures, devices, statusDeviceId]);

  const filteredData = useMemo(() => {
    return processedData.filter((row) => {
      if (filters.dateTime && !row.dateTimeFormatted.toLowerCase().includes(filters.dateTime.toLowerCase())) {
        return false;
      }
      if (filters.deviceName && !row.deviceName.toLowerCase().includes(filters.deviceName.toLowerCase())) {
        return false;
      }
      if (filters.statusCode && !row.statusCode.toString().includes(filters.statusCode)) {
        return false;
      }
      if (filters.cause && !row.cause.toLowerCase().includes(filters.cause.toLowerCase())) {
        return false;
      }
      if (filters.action && !row.action.toLowerCase().includes(filters.action.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [processedData, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = (event, column) => {
    setActiveFilterColumn(column);
    setFilterAnchor({
      ...filterAnchor,
      [column]: event.currentTarget,
    });
  };

  const handleFilterClose = (column) => {
    setFilterAnchor({
      ...filterAnchor,
      [column]: null,
    });
    setActiveFilterColumn(null);
  };

  const handleFilterChange = (column, value) => {
    setFilters({
      ...filters,
      [column]: value,
    });
    setPage(0);
  };

  const handleClearFilter = (column) => {
    setFilters({
      ...filters,
      [column]: "",
    });
    setPage(0);
  };

  const FilterPopover = ({ column, label }) => {
    const open = Boolean(filterAnchor[column]);
    const hasFilter = filters[column] && filters[column].length > 0;

    return (
      <>
        <IconButton
          size="small"
          onClick={(e) => handleFilterClick(e, column)}
          sx={{
            ml: 0.5,
            color: hasFilter ? theme.palette.primary.main : theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <FilterListIcon fontSize="small" />
        </IconButton>
        <Popover
          open={open}
          anchorEl={filterAnchor[column]}
          onClose={() => handleFilterClose(column)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Box sx={{ p: 2, minWidth: 250 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                Filter {label}
              </Typography>
              {hasFilter && (
                <IconButton
                  size="small"
                  onClick={() => handleClearFilter(column)}
                  sx={{ p: 0.5 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <InputBase
              placeholder={`Search ${label}...`}
              value={filters[column] || ""}
              onChange={(e) => handleFilterChange(column, e.target.value)}
              sx={{
                width: "100%",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                px: 1,
                py: 0.5,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.875rem",
              }}
            />
          </Box>
        </Popover>
      </>
    );
  };

  const statusDeviceSelect = (
    <Tooltip title={t.common?.selectDevice || "Select device"} arrow placement="top">
      <TextField
        select
        size="small"
        value={statusDeviceId || ""}
        onChange={(e) => setStatusDeviceId(e.target.value)}
        sx={{ 
          minWidth: 140, 
          maxWidth: 180,
          "& .MuiInputBase-input": { 
            fontSize: "10px", 
            py: 0.5,
            fontFamily: "Poppins, sans-serif",
            color: "text.primary"
          },
          "& .MuiOutlinedInput-root": { 
            height: "24px",
            minHeight: "24px",
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: "6px",
            padding: "4px 8px",
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "action.hover",
            },
            "& fieldset": {
              border: "none"
            },
            "&.Mui-disabled": {
              backgroundColor: "action.disabledBackground",
              borderColor: "action.disabled"
            }
          },
          "& .MuiSelect-select": {
            padding: "0 !important",
            paddingRight: "28px !important",
            display: "flex",
            alignItems: "center",
            fontSize: "10px",
            fontFamily: "Poppins, sans-serif"
          },
          "& .MuiSelect-icon": {
            right: "8px",
            color: "primary.main"
          }
        }}
        disabled={devices.length === 0}
        SelectProps={{
          displayEmpty: true,
          renderValue: (value) => {
            if (!value) return "Select Device";
            const device = devices.find(d => d.key?.deviceId?.toString() === value.toString());
            return device?.deviceName || "Select Device";
          },
          MenuProps: {
            PaperProps: {
              sx: { 
                maxHeight: 250,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                mt: 1,
                backgroundColor: "background.paper",
                "& .MuiMenuItem-root": { 
                  fontSize: "10px", 
                  py: 0.75,
                  fontFamily: "Poppins, sans-serif",
                  color: "text.primary",
                  "&:hover": {
                    backgroundColor: "action.hover"
                  },
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "primary.dark"
                    }
                  }
                },
                zIndex: 1300
              },
            },
          },
        }}
      >
        {devices.length === 0 ? (
          <MenuItem disabled sx={{ fontSize: "10px", fontFamily: "Poppins, sans-serif" }}>
            Loading devices...
          </MenuItem>
        ) : (
          devices.map((d) => (
            <MenuItem 
              key={d.key?.deviceId} 
              value={d.key?.deviceId?.toString()}
              sx={{ fontSize: "10px", fontFamily: "Poppins, sans-serif" }}
            >
              {d.deviceName}
            </MenuItem>
          ))
        )}
      </TextField>
    </Tooltip>
  );

  const statusDateRangePicker = (
    <Tooltip title={t.common?.selectTimeRange || "Select range of time"} arrow placement="top">
      <Box>
        <CustomDateRangePicker
          startDate={statusStartDate}
          endDate={statusEndDate}
          onRangeChange={(start, end) => {
            setStatusStartDate(start);
            setStatusEndDate(end);
          }}
        />
      </Box>
    </Tooltip>
  );

  return (
    <Box>
      <Box sx={{ 
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
        mb: 2,
        justifyContent: "space-between"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          {statusDeviceSelect}
          {statusDateRangePicker}
        </Box>
        <Tooltip title="Filters" arrow placement="top">
          <IconButton 
            size="small"
            sx={{ 
              color: "primary.main",
              "&:hover": {
                backgroundColor: "action.hover"
              }
            }}
          >
            <FilterListIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ mb: 2 }} />
      
      {statusError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {statusError}
        </Alert>
      )}

      {loadingStatusMeasures ? (
        <Box>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
        </Box>
      ) : processedData.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No status data available for the selected period
          </Typography>
        </Box>
      ) : (
        <Box>
          <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: "none", border: `1px solid ${theme.palette.divider}` }}>
            <Table stickyHeader sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    backgroundColor: "#2E7D32",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.875rem",
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Date & Time
                      <FilterPopover column="dateTime" label="Date & Time" />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: "#2E7D32",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.875rem",
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Device Name
                      <FilterPopover column="deviceName" label="Device Name" />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: "#2E7D32",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.875rem",
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Status Code
                      <FilterPopover column="statusCode" label="Status Code" />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: "#2E7D32",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.875rem",
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Cause
                      <FilterPopover column="cause" label="Cause" />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: "#2E7D32",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.875rem",
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Action
                      <FilterPopover column="action" label="Action" />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No results found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row) => (
                    <TableRow 
                      key={row.id} 
                      hover 
                      sx={{ 
                        "&:nth-of-type(even)": {
                          backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                        },
                        "&:hover": {
                          backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                        },
                      }}
                    >
                      <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.875rem", color: theme.palette.text.primary }}>
                        {row.dateTimeFormatted}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.875rem", color: theme.palette.text.primary }}>
                        {row.deviceName}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.875rem", color: theme.palette.text.primary, fontWeight: 500 }}>
                        {row.statusCode}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.875rem", color: theme.palette.text.primary, maxWidth: 400 }}>
                        {row.cause}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.875rem", color: theme.palette.text.primary, maxWidth: 400 }}>
                        {row.action}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              "& .MuiTablePagination-toolbar": {
                fontFamily: "'Poppins', sans-serif",
              },
              "& .MuiTablePagination-selectLabel": {
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.875rem",
              },
              "& .MuiTablePagination-displayedRows": {
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.875rem",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default StatusDataGrid;
