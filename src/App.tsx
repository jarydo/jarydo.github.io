import PersonalPage from "./pages/PersonalPage";
import ChannelPage from "./pages/ChannelPage";
import RecruiterPage from "./pages/RecruiterPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PersonalPage />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
        <Route path="/channel" element={<ChannelPage />} />
      </Routes>
    </Router>
  );
}

export default App;
