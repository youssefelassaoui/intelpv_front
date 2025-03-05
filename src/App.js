import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/GloabalComponents/Navbar";
import routes from "./routes";

function App() {
  return (
    <Router>
      <div className="App">
        {/* <Navbar /> */}
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.element />}
              exact={route.exact}
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
