import Overview from "./pages/Overview";
import WeatherStation from "./pages/WeatherStation";

const routes = [
  {
    path: "/",
    element: Overview,
    exact: true,
  },
  {
    path: "/overview",
    element: Overview,
    exact: true,
  },
  {
    path: "/plant-measures",
    element: () => <div>Plant Measures Page</div>, // Placeholder
    exact: true,
  },
  {
    path: "/alarmes",
    element: () => <div>Alarmes Page</div>, // Placeholder
    exact: true,
  },
  {
    path: "/weather-station",
    element: WeatherStation, // Placeholder
    exact: true,
  },
];

export default routes;
