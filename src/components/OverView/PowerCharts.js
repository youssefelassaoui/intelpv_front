"use client"

import { Box, Grid } from "@mui/material"
import ReactApexChart from "react-apexcharts"

const PowerCharts = () => {
  // Generate 7 days of data with 5-minute intervals
  const generateWeekData = () => {
    const data = []
    const startDate = new Date(2025, 4, 12) // May 12, 2025
    const maxPower = 25 // 25kW system
    const minutesInDay = 24 * 60
    const pointsPerDay = minutesInDay / 5 // Points every 5 minutes
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

    for (let day = 0; day < totalDays; day++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + day)
      const weatherFactor = weatherPatterns[day]

      for (let i = 0; i < pointsPerDay; i++) {
        const minuteOfDay = i * 5
        const hour = Math.floor(minuteOfDay / 60)
        const minute = minuteOfDay % 60

        const date = new Date(currentDate)
        date.setHours(hour, minute, 0, 0)

        const timeOfDay = hour + minute / 60
        let generationValue, consumptionValue

        // Generation values based on time of day and weather
        if (timeOfDay >= 6 && timeOfDay <= 19) {
          // Daytime generation (6 AM to 7 PM)
          const peakHour = 13 // Peak at 1 PM
          const hourDiff = Math.abs(timeOfDay - peakHour)

          // Bell curve for solar generation
          const bellCurve = Math.exp(-Math.pow(hourDiff, 2) / 8)

          // Apply weather factor and small random variations
          generationValue = maxPower * bellCurve * weatherFactor * (0.97 + Math.random() * 0.06)

          // Add some cloud passing effects (occasional dips)
          if (Math.random() < 0.05 && weatherFactor < 0.9) {
            generationValue *= 0.5 + Math.random() * 0.3
          }
        } else {
          // Night time generation (7 PM to 6 AM)
          generationValue = 0
        }

        // Consumption values based on time of day
        if (timeOfDay >= 6 && timeOfDay <= 9) {
          // Morning peak (6 AM to 9 AM)
          consumptionValue = maxPower * (0.4 + Math.random() * 0.15)
        } else if (timeOfDay >= 17 && timeOfDay <= 22) {
          // Evening peak (5 PM to 10 PM)
          consumptionValue = maxPower * (0.5 + Math.random() * 0.2)
        } else if (timeOfDay >= 23 || timeOfDay <= 5) {
          // Night time (11 PM to 5 AM)
          consumptionValue = maxPower * (0.08 + Math.random() * 0.07)
        } else {
          // Day time base load
          consumptionValue = maxPower * (0.25 + Math.random() * 0.1)
        }

        // Add small variations for consecutive readings
        if (data.length > 0) {
          const lastGen = data[data.length - 1].generation
          const lastCons = data[data.length - 1].consumption

          // Limit how much values can change in 5 minutes (smoother curves)
          const maxChange = 0.5 // Maximum 0.5 kW change in 5 minutes

          if (Math.abs(generationValue - lastGen) > maxChange) {
            generationValue = lastGen + Math.sign(generationValue - lastGen) * maxChange * Math.random()
          }

          if (Math.abs(consumptionValue - lastCons) > maxChange) {
            consumptionValue = lastCons + Math.sign(consumptionValue - lastCons) * maxChange * Math.random()
          }
        }

        data.push({
          date: date.toISOString(),
          generation: Number.parseFloat(Math.min(maxPower, Math.max(0, generationValue)).toFixed(2)),
          consumption: Number.parseFloat(Math.min(maxPower, Math.max(0, consumptionValue)).toFixed(2)),
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
      type: "area",
      height: 250,
      toolbar: { show: false },
      fontFamily: "Poppins, sans-serif",
      animations: {
        enabled: false, // Disable animations for better performance with many data points
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
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
        color: "#78909C",
        height: 1,
        width: "100%",
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: "solid",
        color: "#78909C",
        height: 6, // Make ticks longer to look like underscores
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      title: {
        text: "Power (kW)",
        style: {
          fontSize: "12px",
          fontFamily: "Poppins, sans-serif",
        },
      },
      min: 0,
      max: 25,
      tickAmount: 5, // 5 ticks (0, 5, 10, 15, 20, 25)
      labels: {
        formatter: (value) => value.toFixed(2), // Format to 2 decimal places
        style: {
          fontSize: "11px",
          fontFamily: "Poppins, sans-serif",
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
    grid: {
      show: true,
      borderColor: "#78909C",
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
      row: {
        colors: undefined,
        opacity: 0.5,
      },
      column: {
        colors: undefined,
        opacity: 0.5,
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
      x: {
        format: "dd/MM HH:mm", // Show date and time in tooltip
      },
      y: {
        formatter: (value) => `${value.toFixed(2)} kW`, // Format to 2 decimal places
      },
    },
  }

  const generationChart = {
    series: [
      {
        name: "Power Generation",
        data: weekData.map((item) => ({
          x: new Date(item.date).getTime(),
          y: item.generation,
        })),
      },
    ],
    options: {
      ...chartOptions,
      colors: ["#4CAF50"],
      title: {
        text: "Power Generation",
        align: "left",
        style: {
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
        },
      },
    },
  }

  const consumptionChart = {
    series: [
      {
        name: "Power Consumption",
        data: weekData.map((item) => ({
          x: new Date(item.date).getTime(),
          y: item.consumption,
        })),
      },
    ],
    options: {
      ...chartOptions,
      colors: ["#2196F3"],
      title: {
        text: "Power Consumption",
        align: "left",
        style: {
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
        },
      },
    },
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ReactApexChart options={generationChart.options} series={generationChart.series} type="area" height={300} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReactApexChart
            options={consumptionChart.options}
            series={consumptionChart.series}
            type="area"
            height={300}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default PowerCharts
