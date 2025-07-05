import PersonalPage from "./pages/PersonalPage";
import RecruiterPage from "./pages/RecruiterPage";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// Redirect component for external URLs
const ExternalRedirect = ({ to }: { to: string }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/macos_assets/background.png)" }}
    >
      <img
        src="/wii_assets/channel_icon.png"
        alt="Channel Icon"
        className="w-32 h-32"
      />
    </div>
  );
};

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<PersonalPage />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
        {/* Previously launched project redirects*/}
        <Route
          path="/channel"
          element={<ExternalRedirect to="https://channel.jaryddiamond.com" />}
        />
        <Route
          path="/channel/curiosity-cards"
          element={
            <ExternalRedirect to="https://channel.jaryddiamond.com/curiosity-cards" />
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
