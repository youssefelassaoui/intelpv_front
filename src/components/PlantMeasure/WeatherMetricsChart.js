"use client";
import ReactApexChart from "react-apexcharts";
import { Box } from "@mui/material";

const WeatherMetricsChart = () => {
  // Generate 7 days of data with hourly intervals for weather metrics
  const generateWeekData = () => {
    const data = [];
    const startDate = new Date(2025, 4, 12); // May 12, 2025
    const totalDays = 7;

    // Benguerir, Morocco climate data (May averages)
    // Temperature: 18-32°C (64-90°F)
    // Humidity: 30-60%
    // Wind Speed: 3-15 km/h (2-9 mph)
    // Solar Radiation: 5.5-7.5 kWh/m²/day (peak 800-1000 W/m²)

    // Daily patterns for Benguerir in May
    const dailyPatterns = [
      {
        minTemp: 18,
        maxTemp: 31,
        humidity: 40,
        windSpeed: 8,
        solarStrength: 0.95,
      }, // Day 1: Hot, dry, moderate wind
      {
        minTemp: 19,
        maxTemp: 32,
        humidity: 35,
        windSpeed: 6,
        solarStrength: 0.98,
      }, // Day 2: Very hot, dry, light wind
      {
        minTemp: 17,
        maxTemp: 28,
        humidity: 55,
        windSpeed: 12,
        solarStrength: 0.75,
      }, // Day 3: Cooler, more humid, windy
      {
        minTemp: 16,
        maxTemp: 26,
        humidity: 60,
        windSpeed: 15,
        solarStrength: 0.65,
      }, // Day 4: Coolest, humid, very windy
      {
        minTemp: 18,
        maxTemp: 29,
        humidity: 45,
        windSpeed: 10,
        solarStrength: 0.85,
      }, // Day 5: Moderate, slightly humid
      {
        minTemp: 20,
        maxTemp: 33,
        humidity: 30,
        windSpeed: 5,
        solarStrength: 1.0,
      }, // Day 6: Very hot, very dry, calm
      {
        minTemp: 19,
        maxTemp: 30,
        humidity: 42,
        windSpeed: 9,
        solarStrength: 0.9,
      }, // Day 7: Hot, moderate humidity
    ];

    for (let day = 0; day < totalDays; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);
      const pattern = dailyPatterns[day];

      // Generate data points for each hour of the day
      for (let hour = 0; hour < 24; hour++) {
        const date = new Date(currentDate);
        date.setHours(hour, 0, 0, 0);

        // Temperature follows a sinusoidal pattern with minimum at ~5am and maximum at ~3pm
        const hourFactor = Math.sin(((hour - 5) / 24) * 2 * Math.PI);
        const temperature =
          pattern.minTemp +
          (pattern.maxTemp - pattern.minTemp) * Math.max(0, hourFactor);

        // Humidity is typically inverse to temperature
        const humidityBase = pattern.humidity;
        const humidityVariation = 15; // +/- variation throughout day
        const humidity =
          humidityBase - humidityVariation * hourFactor + Math.random() * 5;

        // Wind speed typically increases during the day and decreases at night
        const windBase = pattern.windSpeed;
        const windVariation = 4; // +/- variation throughout day
        const windSpeed =
          windBase +
          windVariation * Math.max(0, hourFactor) * (0.7 + Math.random() * 0.6);

        // Solar radiation follows a bell curve centered around noon
        const solarHourFactor = Math.cos(((hour - 12) / 12) * Math.PI);
        let solarRadiation = 0;
        if (hour >= 6 && hour <= 18) {
          // Daytime (6am to 6pm)
          solarRadiation =
            1000 *
            pattern.solarStrength *
            Math.max(0, solarHourFactor) *
            (0.9 + Math.random() * 0.2);
        }

        // Add small variations for consecutive readings
        if (
          data.length > 0 &&
          data[data.length - 1].date.getDate() === date.getDate()
        ) {
          const lastTemp = data[data.length - 1].temperature;
          const lastHumidity = data[data.length - 1].humidity;
          const lastWind = data[data.length - 1].windSpeed;

          // Limit how much values can change in an hour (smoother curves)
          const maxTempChange = 2; // Maximum 2°C change in an hour
          const maxHumidityChange = 5; // Maximum 5% change in an hour
          const maxWindChange = 3; // Maximum 3 km/h change in an hour

          if (Math.abs(temperature - lastTemp) > maxTempChange) {
            const tempDiff = temperature - lastTemp;
            const adjustedChange =
              Math.sign(tempDiff) *
              (maxTempChange * 0.8 + Math.random() * maxTempChange * 0.4);
            data[data.length - 1].temperature = lastTemp + adjustedChange;
          }

          if (Math.abs(humidity - lastHumidity) > maxHumidityChange) {
            const humidityDiff = humidity - lastHumidity;
            const adjustedChange =
              Math.sign(humidityDiff) *
              (maxHumidityChange * 0.8 +
                Math.random() * maxHumidityChange * 0.4);
            data[data.length - 1].humidity = lastHumidity + adjustedChange;
          }

          if (Math.abs(windSpeed - lastWind) > maxWindChange) {
            const windDiff = windSpeed - lastWind;
            const adjustedChange =
              Math.sign(windDiff) *
              (maxWindChange * 0.8 + Math.random() * maxWindChange * 0.4);
            data[data.length - 1].windSpeed = lastWind + adjustedChange;
          }
        }

        data.push({
          date: date,
          temperature: Number.parseFloat(temperature.toFixed(1)),
          humidity: Number.parseFloat(
            Math.min(100, Math.max(0, humidity)).toFixed(1)
          ),
          windSpeed: Number.parseFloat(Math.max(0, windSpeed).toFixed(1)),
          solarRadiation: Number.parseFloat(
            Math.max(0, solarRadiation).toFixed(0)
          ),
        });
      }
    }

    return data;
  };

  const weekData = generateWeekData();

  // Generate dates for x-axis ticks (one for each day)
  const generateDailyTicks = () => {
    const ticks = [];
    const startDate = new Date(2025, 4, 12); // May 12, 2025

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      ticks.push(date.getTime());
    }

    return ticks;
  };

  const dailyTicks = generateDailyTicks();

  // Normalize solar radiation to fit on the same scale as other metrics
  const normalizedSolarData = weekData.map((item) => ({
    x: item.date.getTime(),
    y: item.solarRadiation / 40, // Scale down to roughly 0-25 range
  }));

  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Poppins, sans-serif",
      animations: { enabled: false },
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
      tickAmount: 7,
      tickPlacement: "on",
      labels: {
        style: { fontSize: "11px", fontFamily: "Poppins, sans-serif" },
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
        color: "#78909C",
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: [
      {
        title: {
          text: "Temperature (°C)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
            color: "#FF5733",
          },
        },
        min: 10,
        max: 40,
        tickAmount: 6,
        labels: {
          formatter: (value) => value.toFixed(0),
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
            colors: "#FF5733",
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
          text: "Humidity (%)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
            color: "#2196F3",
          },
        },
        min: 0,
        max: 100,
        tickAmount: 5,
        opposite: true,
        labels: {
          formatter: (value) => value.toFixed(0),
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
            colors: "#2196F3",
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
        seriesName: "Wind Speed",
        title: {
          text: "Wind Speed (km/h)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
            color: "#4CAF50",
          },
        },
        min: 0,
        max: 25,
        tickAmount: 5,
        opposite: true,
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
        labels: {
          formatter: (value) => value.toFixed(0),
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
            colors: "#4CAF50",
          },
        },
        show: false,
      },
      {
        seriesName: "Solar Radiation",
        title: {
          text: "Solar Radiation (W/m²)",
          style: {
            fontSize: "12px",
            fontFamily: "Poppins, sans-serif",
            color: "#FFC107",
          },
        },
        min: 0,
        max: 25,
        tickAmount: 5,
        opposite: true,
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
        labels: {
          formatter: (value) => (value * 40).toFixed(0),
          style: {
            fontSize: "11px",
            fontFamily: "Poppins, sans-serif",
            colors: "#FFC107",
          },
        },
        show: false,
      },
    ],
    grid: {
      show: true,
      borderColor: "#78909C",
      strokeDashArray: 0,
      position: "back",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: false } },
      padding: { top: 0, right: 10, bottom: 0, left: 0 },
    },
    tooltip: {
      shared: true,
      x: { format: "dd/MM HH:mm" },
      y: [
        { formatter: (value) => `${value.toFixed(1)} °C` },
        { formatter: (value) => `${value.toFixed(1)} %` },
        { formatter: (value) => `${value.toFixed(1)} km/h` },
        { formatter: (value) => `${(value * 40).toFixed(0)} W/m²` },
      ],
    },
    colors: ["#FF5733", "#2196F3", "#4CAF50", "#FFC107"],
    title: {
      text: "Weather Metrics",
      align: "left",
      style: { fontSize: "14px", fontFamily: "Poppins, sans-serif" },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Poppins, sans-serif",
      fontSize: "11px",
      offsetY: 5,
    },
  };

  const chartSeries = [
    {
      name: "Temperature",
      type: "area",
      data: weekData.map((item) => ({
        x: item.date.getTime(),
        y: item.temperature,
      })),
    },
    {
      name: "Humidity",
      type: "area",
      data: weekData.map((item) => ({
        x: item.date.getTime(),
        y: item.humidity,
      })),
    },
    {
      name: "Wind Speed",
      type: "area",
      data: weekData.map((item) => ({
        x: item.date.getTime(),
        y: item.windSpeed,
      })),
    },
    {
      name: "Solar Radiation",
      type: "area",
      data: normalizedSolarData,
    },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height="350"
      />
    </Box>
  );
};

export default WeatherMetricsChart;
