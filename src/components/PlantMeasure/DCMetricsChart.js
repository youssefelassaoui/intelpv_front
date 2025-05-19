"use client"
import ReactApexChart from "react-apexcharts"

const DCMetricsChart = () => {
  // Generate 7 days of data with hourly intervals for DC metrics
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

    // System specs for a realistic 25kW solar plant
    // For a commercial 25kW system:
    // - Typical DC voltage: 600-800V (can go up to 1000V)
    // - Typical DC current: ~30-40A at peak for the whole system
    const nominalDcVoltage = 750 // Nominal DC voltage
    const maxDcCurrent = 35 // Maximum DC current at peak

    for (let day = 0; day < totalDays; day++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + day)
      const weatherFactor = weatherPatterns[day]

      // Generate data points for each hour of the day
      for (let hour = 0; hour < 24; hour++) {
        const date = new Date(currentDate)
        date.setHours(hour, 0, 0, 0)

        const timeOfDay = hour
        let dcVoltage, dcCurrent

        // Generate realistic values based on time of day
        if (timeOfDay >= 6 && timeOfDay <= 19) {
          // Daytime generation (6 AM to 7 PM)
          const peakHour = 13 // Peak at 1 PM
          const hourDiff = Math.abs(timeOfDay - peakHour)

          // Bell curve for solar generation
          const bellCurve = Math.exp(-Math.pow(hourDiff, 2) / 8)

          // Apply weather factor and small random variations
          const generationFactor = bellCurve * weatherFactor * (0.97 + Math.random() * 0.06)

          // DC voltage behavior in a real system:
          // - Morning: Voltage rises as panels warm up and sun intensity increases
          // - Midday: Voltage stabilizes but may drop slightly due to panel temperature
          // - Evening: Voltage gradually decreases as sun intensity decreases

          // Temperature effect: voltage decreases as temperature increases
          const tempEffect = timeOfDay >= 10 && timeOfDay <= 15 ? 0.05 * Math.random() : 0

          // Voltage calculation with realistic behavior
          if (timeOfDay < 8) {
            // Morning ramp-up (steeper)
            const morningFactor = ((timeOfDay - 6) / 2) * generationFactor
            dcVoltage = nominalDcVoltage * (0.6 + 0.4 * morningFactor)
          } else if (timeOfDay > 17) {
            // Evening ramp-down (steeper)
            const eveningFactor = ((19 - timeOfDay) / 2) * generationFactor
            dcVoltage = nominalDcVoltage * (0.6 + 0.4 * eveningFactor)
          } else {
            // Midday plateau with slight temperature-induced dip
            dcVoltage = nominalDcVoltage * (0.95 + 0.05 * generationFactor - tempEffect)
          }

          // DC current follows solar irradiance more directly
          dcCurrent = maxDcCurrent * generationFactor

          // Add some cloud passing effects (occasional dips)
          if (Math.random() < 0.1 && weatherFactor < 0.9) {
            const cloudSeverity = 0.3 + Math.random() * 0.5 // 30-80% reduction
            // Current drops more significantly during cloud cover
            dcCurrent *= cloudSeverity
            // Voltage drops less during cloud cover
            dcVoltage *= 0.9 + 0.1 * cloudSeverity
          }

          // Add small noise to make it look more realistic
          dcVoltage += (Math.random() * 2 - 1) * 5 // +/- 5V noise
          dcCurrent += (Math.random() * 2 - 1) * 0.5 // +/- 0.5A noise
        } else {
          // Night time (7 PM to 6 AM)
          dcVoltage = 0 // No voltage at night
          dcCurrent = 0 // No current at night
        }

        // Add small variations for consecutive readings
        if (data.length > 0 && data[data.length - 1].date.getDate() === date.getDate()) {
          const lastVoltage = data[data.length - 1].dcVoltage
          const lastCurrent = data[data.length - 1].dcCurrent

          // Limit how much values can change in an hour (smoother curves)
          const maxVoltageChange = 50 // Maximum 50V change in an hour
          const maxCurrentChange = 5 // Maximum 5A change in an hour

          if (Math.abs(dcVoltage - lastVoltage) > maxVoltageChange && dcVoltage > 0 && lastVoltage > 0) {
            dcVoltage = lastVoltage + Math.sign(dcVoltage - lastVoltage) * maxVoltageChange * Math.random()
          }

          if (Math.abs(dcCurrent - lastCurrent) > maxCurrentChange && dcCurrent > 0 && lastCurrent > 0) {
            dcCurrent = lastCurrent + Math.sign(dcCurrent - lastCurrent) * maxCurrentChange * Math.random()
          }
        }

        data.push({
          date: date,
          dcVoltage: Number.parseFloat(Math.max(0, dcVoltage).toFixed(1)),
          dcCurrent: Number.parseFloat(Math.max(0, dcCurrent).toFixed(1)),
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
      height: 250,
      toolbar: { show: false },
      fontFamily: "Poppins, sans-serif",
      animations: {
        enabled: false,
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
      tickAmount: 7,
      tickPlacement: "on",
      labels: {
        style: {
          fontSize: "11px",
          fontFamily: "Poppins, sans-serif",
        },
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd/MM",
          hour: "HH:mm",
        },
        format: "dd/MM",
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
        color: "#C5172E",
        height: 6,
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
            color: "#C5172E",
          },
        },
        min: 0,
        max: 800,
        tickAmount: 5,
        labels: {
          formatter: (value) => value.toFixed(0), // Format to whole numbers for voltage
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
            colors: "#C5172E",
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
          width: 6,
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
            color: "#FCF259",
          },
        },
        min: 0,
        max: 40,
        tickAmount: 5,
        opposite: true,
        labels: {
          formatter: (value) => value.toFixed(1), // Format to 1 decimal place for current
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
            colors: "#FCF259",
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
          width: 6,
          offsetX: 0,
          offsetY: 0,
        },
      },
    ],
    grid: {
      show: true,
      borderColor: "#78909C",
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 0,
      },
    },
    tooltip: {
      shared: true,
      x: {
        format: "dd/MM HH:mm",
      },
      y: [
        {
          formatter: (value) => `${value.toFixed(1)} V`,
        },
        {
          formatter: (value) => `${value.toFixed(1)} A`,
        },
      ],
    },
    colors: ["#C5172E", "#FCF259"],
    title: {
      text: "DC Metrics",
      align: "left",
      style: {
        fontSize: "14px",
        fontFamily: "Poppins, sans-serif",
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Poppins, sans-serif",
      fontSize: "11px",
      offsetY: 5,
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
  ]

  return <ReactApexChart options={chartOptions} series={chartSeries} type="line" height="250" />
}

export default DCMetricsChart
