import { Link, useLocation } from "react-router-dom";

const icons = {
  dashboard: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  analytics: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  patients: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  recordings: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    </svg>
  ),
  appointments: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

function Sidebar() {
  const role = localStorage.getItem("role") || "psychologist";
  const email = localStorage.getItem("email") || "dr.popescu@clinic.ro";
  const location = useLocation();
  const initials = email.split("@")[0].slice(0, 2).toUpperCase();

  const psychologistLinks = [
    { to: "/dashboard", label: "Pacienți", icon: icons.patients },
    { to: "/analytics", label: "Analize", icon: icons.analytics },
  ];

  const patientLinks = [
    { to: "/patient-dashboard", label: "Dashboard", icon: icons.dashboard },
    { to: "/my-recordings", label: "Înregistrări", icon: icons.recordings },
    { to: "/appointments", label: "Programări", icon: icons.appointments },
  ];

  const links = role === "psychologist" ? psychologistLinks : patientLinks;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        <span className="sidebar-logo-text">Emo<span>Track</span></span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div className="sidebar-section">
          <div className="sidebar-section-label">
            {role === "psychologist" ? "Clinică" : "Cont meu"}
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar-link${location.pathname === to ? " active" : ""}`}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{email}</div>
            <div className="user-role">{role === "psychologist" ? "Psiholog" : "Pacient"}</div>
          </div>
        </div>
        <Link
          to="/"
          className="sidebar-link"
          style={{ marginTop: 4 }}
          onClick={() => localStorage.clear()}
        >
          <span className="nav-icon">{icons.logout}</span>
          Deconectare
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;