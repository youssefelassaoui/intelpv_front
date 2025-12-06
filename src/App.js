import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./components/GloabalComponents/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import routes from "./routes";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <SignedIn>
            <Navbar />
          </SignedIn>
          <Routes>
            {routes.map((route, index) => {
              const RouteElement = route.element;
              const element = route.protected ? (
                <ProtectedRoute>
                  <RouteElement />
                </ProtectedRoute>
              ) : (
                <RouteElement />
              );

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={element}
                />
              );
            })}
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
