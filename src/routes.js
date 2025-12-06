import Overview from "./pages/Overview";
import WeatherStation from "./pages/WeatherStation";
import PlantMeasures from "./pages/PlantMeasure";
import PlantsList from "./pages/PlantsList";
import SignInPage from "./pages/SignIn";

const routes = [
  {
    path: "/sign-in/*",
    element: SignInPage,
    exact: false,
    protected: false,
  },
  {
    path: "/",
    element: Overview,
    exact: true,
    protected: true,
  },
  {
    path: "/overview",
    element: Overview,
    exact: true,
    protected: true,
  },
  {
    path: "/plant-measures",
    element: PlantMeasures,
    exact: true,
    protected: true,
  },
  {
    path: "/plants_list",
    element: PlantsList,
    exact: true,
    protected: true,
  },
  {
    path: "/alarmes",
    element: () => <div>Alarmes Page</div>,
    exact: true,
    protected: true,
  },
  {
    path: "/weather-station",
    element: WeatherStation,
    exact: true,
    protected: true,
  },
];

export default routes;
