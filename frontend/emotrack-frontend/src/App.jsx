import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PatientPage from "./pages/PatientPage";
import VideoSession from "./pages/VideoSession";
import Analytics from "./pages/Analytics";
import PatientDashboard from "./pages/PatientDashboard";
import MyRecordings from "./pages/MyRecordings";
import Appointments from "./pages/Appointments";
import ChangePassword from "./pages/ChangePassword";

// Redirect based on role after login
function RoleRedirect() {
  const role = localStorage.getItem("role");
  if (role === "patient") return <Navigate to="/patient-dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

// Guard: only psychologists
function PsychologistRoute({ element }) {
  const role = localStorage.getItem("role");
  if (role !== "psychologist") return <Navigate to="/patient-dashboard" replace />;
  return element;
}

// Guard: only patients
function PatientRoute({ element }) {
  const role = localStorage.getItem("role");
  if (role === "psychologist") return <Navigate to="/dashboard" replace />;
  return element;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<RoleRedirect />} />

      <Route path="/dashboard"      element={<PsychologistRoute element={<Dashboard />} />} />
      <Route path="/patient/:id"    element={<PsychologistRoute element={<PatientPage />} />} />
      <Route path="/video/:id"      element={<PsychologistRoute element={<VideoSession />} />} />
      <Route path="/analytics"      element={<PsychologistRoute element={<Analytics />} />} />
      <Route path="/change-password" element={<ChangePassword />} />

      <Route path="/patient-dashboard" element={<PatientRoute element={<PatientDashboard />} />} />
      <Route path="/my-recordings"     element={<PatientRoute element={<MyRecordings />} />} />
      <Route path="/appointments"      element={<PatientRoute element={<Appointments />} />} />

      <Route path="*" element={<RoleRedirect />} />
    </Routes>
  );
}

export default App;