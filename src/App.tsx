import PersonalPage from "./pages/PersonalPage";
import ProjectsPage from "./pages/ProjectsPage";
import RecruiterPage from "./pages/RecruiterPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PersonalPage />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
        <Route path="/playground" element={<ProjectsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
