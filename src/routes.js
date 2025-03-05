import Overview from "./pages/Overview";
import WeatherStation from "./pages/WeatherStation";
import PlantMeasures from "./pages/PlantMeasure";
import PlantsList from "./pages/PlantsList"; // Placeholder for PlantsList

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
    element: PlantMeasures, // Placeholder
    exact: true,
  },
  {
    path: "/plants_list",
    element: PlantsList, // Placeholder
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
