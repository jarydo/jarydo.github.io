import PersonalPage from "./pages/PersonalPage";
import ChannelPage from "./pages/ChannelPage";
import RecruiterPage from "./pages/RecruiterPage";
import ScratchAway from "./pages/channels/scratch-away/ScratchAway";
import CuriosityCards from "./pages/channels/curiosity-cards/CuriosityCards";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PersonalPage />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
        <Route path="/channel" element={<ChannelPage />} />
        <Route path="/channel/scratch-away" element={<ScratchAway />} />
        <Route path="/channel/curiosity-cards" element={<CuriosityCards />} />
      </Routes>
    </Router>
  );
}
export default App;
