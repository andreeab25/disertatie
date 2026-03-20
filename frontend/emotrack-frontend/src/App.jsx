import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PatientPage from "./pages/PatientPage";
import VideoSession from "./pages/VideoSession";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/patient/:id" element={<PatientPage />} />
      <Route path="/video/:id" element={<VideoSession />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}

export default App;