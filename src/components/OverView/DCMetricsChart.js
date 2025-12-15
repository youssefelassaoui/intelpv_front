"use client"

import { useTheme } from "@mui/material"
import ReactApexChart from "react-apexcharts"

const DCMetricsChart = () => {
  const theme = useTheme()
  // Generate 7 days of data with 5-minute intervals for DC metrics
  const generateWeekData = () => {
    const data = []
    const startDate = new Date(2025, 4, 12) // May 12, 2025
    const totalDays = 7

    // Weather patterns for each day (0-1 scale, where 1 is perfect sunny day)
    const weatherPatterns = [
      0.95, // Day 1: Mostly sunny
      0.85, // Day 2: Partly cloudy
      0.65, // Day 3: Cloudy with some sun
      0.9, // Day 4: Sunny
      0.75, // Day 5: Partly cloudy
      0.4, // Day 6: Mostly cloudy
      0.8, // Day 7: Mostly sunny
    ]

    // System specs
    const maxDcVoltage = 400 // Maximum DC voltage
    const maxDcCurrent = 8 // Maximum DC current
    const maxDcPower = 25000 // Maximum DC power (25kW)

    for (let day = 0; day < totalDays; day++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + day)
      const weatherFactor = weatherPatterns[day]

      // Generate data points for each hour of the day
      for (let hour = 0; hour < 24; hour++) {
        const date = new Date(currentDate)
        date.setHours(hour, 0, 0, 0)

        const timeOfDay = hour
        let dcVoltage, dcCurrent, dcPower

        // Generate realistic values based on time of day
        if (timeOfDay >= 6 && timeOfDay <= 19) {
          // Daytime generation (6 AM to 7 PM)
          const peakHour = 13 // Peak at 1 PM
          const hourDiff = Math.abs(timeOfDay - peakHour)

          // Bell curve for solar generation
          const bellCurve = Math.exp(-Math.pow(hourDiff, 2) / 8)

          // Apply weather factor and small random variations
          const generationFactor = bellCurve * weatherFactor * (0.97 + Math.random() * 0.06)

          // DC voltage rises quickly in morning, stays stable during day, falls in evening
          dcVoltage = maxDcVoltage * (0.2 + 0.8 * generationFactor)

          // DC current follows the sun curve more directly
          dcCurrent = maxDcCurrent * generationFactor

          // DC power is voltage * current
          dcPower = dcVoltage * dcCurrent

          // Add some cloud passing effects (occasional dips)
          if (Math.random() < 0.05 && weatherFactor < 0.9) {
            const dipFactor = 0.5 + Math.random() * 0.3
            dcVoltage *= 0.9 + dipFactor * 0.1 // Voltage drops less during clouds
            dcCurrent *= dipFactor // Current drops more during clouds
            dcPower = dcVoltage * dcCurrent
          }
        } else {
          // Night time (7 PM to 6 AM)
          dcVoltage = maxDcVoltage * 0.05 * (0.8 + Math.random() * 0.4) // Small residual voltage
          dcCurrent = 0
          dcPower = 0
        }

        // Add small variations for consecutive readings
        if (data.length > 0 && data[data.length - 1].date.getDate() === date.getDate()) {
          const lastVoltage = data[data.length - 1].dcVoltage
          const lastCurrent = data[data.length - 1].dcCurrent

          // Limit how much values can change in an hour (smoother curves)
          const maxVoltageChange = maxDcVoltage * 0.1 // Maximum 10% change in an hour
          const maxCurrentChange = maxDcCurrent * 0.1 // Maximum 10% change in an hour

          if (Math.abs(dcVoltage - lastVoltage) > maxVoltageChange) {
            dcVoltage = lastVoltage + Math.sign(dcVoltage - lastVoltage) * maxVoltageChange * Math.random()
          }

          if (Math.abs(dcCurrent - lastCurrent) > maxCurrentChange) {
            dcCurrent = lastCurrent + Math.sign(dcCurrent - lastCurrent) * maxCurrentChange * Math.random()
          }

          dcPower = dcVoltage * dcCurrent
        }

        data.push({
          date: date,
          dcVoltage: Number.parseFloat(Math.max(0, dcVoltage).toFixed(2)),
          dcCurrent: Number.parseFloat(Math.max(0, dcCurrent).toFixed(2)),
          dcPower: Number.parseFloat(Math.max(0, dcPower).toFixed(2)),
        })
      }
    }

    return data
  }

  const weekData = generateWeekData()

  // Generate dates for x-axis ticks (one for each day)
  const generateDailyTicks = () => {
    const ticks = []
    const startDate = new Date(2025, 4, 12) // May 12, 2025

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      ticks.push(date.getTime())
    }

    return ticks
  }

  const dailyTicks = generateDailyTicks()

  const chartOptions = {
    chart: {
      type: "line",
      height: 300,
      toolbar: { show: false },
      fontFamily: "Poppins, sans-serif",
      animations: {
        enabled: false, // Disable animations for better performance
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "datetime",
      categories: dailyTicks,
      tickAmount: 7, // 7 ticks for 7 days
      tickPlacement: "on", // Place ticks on the values
      labels: {
        style: {
          fontSize: "11px",
          fontFamily: "Poppins, sans-serif",
          colors: theme.palette.text.secondary,
        },
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd/MM", // Format as DD/MM
          hour: "HH:mm",
        },
        format: "dd/MM", // Default format for x-axis labels
      },
      axisBorder: {
        show: true,
        color: theme.palette.divider,
        height: 1,
        width: "100%",
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: "solid",
        color: theme.palette.divider,
        height: 6, // Make ticks longer to look like underscores
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: [
      {
        title: {
          text: "Voltage (V)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
            color: theme.palette.mode === "dark" ? "#FF6B6B" : "#FF5733",
          },
        },
        min: 0,
        max: 450,
        tickAmount: 5,
        labels: {
          formatter: (value) => value.toFixed(2), // Format to 2 decimal places
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
            colors: theme.palette.mode === "dark" ? "#FF6B6B" : "#FF5733",
          },
        },
        axisBorder: {
          show: true,
          color: theme.palette.divider,
          width: 1,
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: {
          show: true,
          borderType: "solid",
          color: theme.palette.divider,
          width: 6, // Make ticks longer to look like underscores
          offsetX: 0,
          offsetY: 0,
        },
      },
      {
        title: {
          text: "Current (A)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
            color: theme.palette.mode === "dark" ? "#4ECDC4" : "#33FF57",
          },
        },
        min: 0,
        max: 10,
        tickAmount: 5,
        opposite: true,
        labels: {
          formatter: (value) => value.toFixed(2), // Format to 2 decimal places
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
            colors: theme.palette.mode === "dark" ? "#4ECDC4" : "#33FF57",
          },
        },
        axisBorder: {
          show: true,
          color: theme.palette.divider,
          width: 1,
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: {
          show: true,
          borderType: "solid",
          color: theme.palette.divider,
          width: 6, // Make ticks longer to look like underscores
          offsetX: 0,
          offsetY: 0,
        },
      },
      {
        title: {
          text: "Power (kW)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
            color: "#3357FF",
          },
        },
        min: 0,
        max: 30,
        tickAmount: 5,
        opposite: true,
        labels: {
          formatter: (value) => value.toFixed(2), // Format to 2 decimal places
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
            colors: "#3357FF",
          },
        },
        axisBorder: {
          show: true,
          color: "#78909C",
          width: 1,
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: {
          show: true,
          borderType: "solid",
          color: "#78909C",
          width: 6, // Make ticks longer to look like underscores
          offsetX: 0,
          offsetY: 0,
        },
      },
    ],
    grid: {
      show: true,
      borderColor: theme.palette.divider,
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: false, // Hide internal x-axis grid lines
        },
      },
      yaxis: {
        lines: {
          show: false, // Hide internal y-axis grid lines
        },
      },
      padding: {
        top: 0,
        right: 10, // Add some padding on the right for y-axis ticks
        bottom: 0,
        left: 0,
      },
    },
    tooltip: {
      shared: true,
      theme: theme.palette.mode,
      x: {
        format: "dd/MM HH:mm", // Show date and time in tooltip
      },
      y: [
        {
          formatter: (value) => `${value.toFixed(2)} V`, // Format to 2 decimal places
        },
        {
          formatter: (value) => `${value.toFixed(2)} A`, // Format to 2 decimal places
        },
        {
          formatter: (value) => `${(value / 1000).toFixed(2)} kW`, // Convert to kW and format
        },
      ],
    },
    colors: theme.palette.mode === "dark" 
      ? ["#FF6B6B", "#4ECDC4", "#95E1D3"] 
      : ["#FF5733", "#33FF57", "#3357FF"],
    title: {
      text: "DC Metrics",
      align: "left",
      style: {
        fontSize: "14px",
        fontFamily: "Poppins, sans-serif",
        color: theme.palette.text.primary,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontFamily: "Poppins, sans-serif",
      fontSize: "11px",
      offsetY: -10,
      labels: {
        colors: theme.palette.text.primary,
      },
    },
  }

  const chartSeries = [
    {
      name: "DC Voltage",
      type: "line",
      data: weekData.map((item) => ({
        x: item.date.getTime(),
        y: item.dcVoltage,
      })),
    },
    {
      name: "DC Current",
      type: "line",
      data: weekData.map((item) => ({
        x: item.date.getTime(),
        y: item.dcCurrent,
      })),
    },
    {
      name: "DC Power",
      type: "line",
      data: weekData.map((item) => ({
        x: item.date.getTime(),
        y: item.dcPower / 1000, // Convert to kW for display
      })),
    },
  ]

  return (
    <ReactApexChart options={chartOptions} series={chartSeries} type="line" height="220" />
  )
}

export default DCMetricsChart
