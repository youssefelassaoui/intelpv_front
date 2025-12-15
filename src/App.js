import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn } from "@clerk/clerk-react";
import { ThemeModeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./components/GloabalComponents/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import routes from "./routes";

const ClerkWrapper = ({ children }) => {
  try {
    return <SignedIn>{children}</SignedIn>;
  } catch (error) {
    return <>{children}</>;
  }
};

function App() {
  return (
    <ThemeModeProvider>
      <LanguageProvider>
        <Router>
          <div className="App">
            <ClerkWrapper>
              <Navbar />
            </ClerkWrapper>
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
                  <Route key={index} path={route.path} element={element} />
                );
              })}
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </ThemeModeProvider>
  );
}

export default App;
