import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AVATAR_COLORS = [
  { bg: "#E8F4EE", color: "#2D6A4F", border: "#74C69D" },
  { bg: "#EFF6FF", color: "#1E40AF", border: "#93C5FD" },
  { bg: "#FEF3C7", color: "#92400E", border: "#FCD34D" },
  { bg: "#F5F3FF", color: "#5B21B6", border: "#C4B5FD" },
];

const dummyPatients = [
  {
    id: 1,
    name: "Ion Popescu",
    age: 32,
    lastSession: "2026-03-18",
    sessions: 14,
    dominant: "Fericire",
    emotionClass: "joy",
    trend: "+12%",
    trendUp: true,
    emotions: [
      { label: "Fericire", pct: 45, color: "#F59E0B" },
      { label: "Tristețe", pct: 25, color: "#3B82F6" },
      { label: "Furie",    pct: 15, color: "#EF4444" },
      { label: "Surpriză", pct: 15, color: "#8B5CF6" },
    ],
    status: "analyzed",
  },
  {
    id: 2,
    name: "Maria Ionescu",
    age: 28,
    lastSession: "2026-03-19",
    sessions: 8,
    dominant: "Tristețe",
    emotionClass: "sad",
    trend: "-5%",
    trendUp: false,
    emotions: [
      { label: "Fericire", pct: 20, color: "#F59E0B" },
      { label: "Tristețe", pct: 50, color: "#3B82F6" },
      { label: "Furie",    pct: 10, color: "#EF4444" },
      { label: "Surpriză", pct: 20, color: "#8B5CF6" },
    ],
    status: "analyzed",
  },
  {
    id: 3,
    name: "Andrei Vasilescu",
    age: 40,
    lastSession: "2026-03-15",
    sessions: 21,
    dominant: "Furie",
    emotionClass: "anger",
    trend: "-8%",
    trendUp: false,
    emotions: [
      { label: "Fericire", pct: 15, color: "#F59E0B" },
      { label: "Tristețe", pct: 30, color: "#3B82F6" },
      { label: "Furie",    pct: 40, color: "#EF4444" },
      { label: "Surpriză", pct: 15, color: "#8B5CF6" },
    ],
    status: "pending",
  },
  {
    id: 4,
    name: "Elena Georgescu",
    age: 36,
    lastSession: "2026-03-17",
    sessions: 6,
    dominant: "Surpriză",
    emotionClass: "surprise",
    trend: "+3%",
    trendUp: true,
    emotions: [
      { label: "Fericire", pct: 30, color: "#F59E0B" },
      { label: "Tristețe", pct: 20, color: "#3B82F6" },
      { label: "Furie",    pct: 10, color: "#EF4444" },
      { label: "Surpriză", pct: 40, color: "#8B5CF6" },
    ],
    status: "analyzed",
  },
  {
    id: 5,
    name: "Mihai Dumitrescu",
    age: 45,
    lastSession: "2026-03-21",
    sessions: 3,
    dominant: "Neutru",
    emotionClass: "neutral",
    trend: "—",
    trendUp: null,
    emotions: [
      { label: "Fericire", pct: 25, color: "#F59E0B" },
      { label: "Tristețe", pct: 25, color: "#3B82F6" },
      { label: "Furie",    pct: 25, color: "#EF4444" },
      { label: "Surpriză", pct: 25, color: "#8B5CF6" },
    ],
    status: "new",
  },
];

const stats = [
  { label: "Pacienți activi", value: "5", sub: "din 8 total" },
  { label: "Sesiuni luna aceasta", value: "23", sub: "↑4 față de luna trecută" },
  { label: "Înregistrări noi", value: "7", sub: "de procesat" },
  { label: "Îmbunătățire medie", value: "↑6%", sub: "față de luna trecută" },
];

function EmotionBar({ emotions }) {
  return (
    <div className="patient-emotion-bar">
      {emotions.map((e) => (
        <div
          key={e.label}
          style={{ flex: e.pct, background: e.color, opacity: 0.85 }}
          title={`${e.label}: ${e.pct}%`}
        />
      ))}
    </div>
  );
}

function PatientCard({ patient, colorSet }) {
  const initials = patient.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <Link to={`/patient/${patient.id}`} className="patient-card">
      <div className="patient-card-header">
        <div
          className="patient-avatar"
          style={{ background: colorSet.bg, color: colorSet.color, border: `2px solid ${colorSet.border}` }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="patient-name">{patient.name}</div>
          <div className="patient-meta">{patient.age} ani · {patient.sessions} sesiuni</div>
        </div>
        <span className={`status ${patient.status}`}>
          <span className="status-dot" />
          {patient.status === "analyzed" ? "Analizat" : patient.status === "pending" ? "În curs" : "Nou"}
        </span>
      </div>

      <EmotionBar emotions={patient.emotions} />

      <div className="patient-stats">
        <div className="patient-stat">
          <div className="patient-stat-label">Emoție dominantă</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
            <span className={`emotion-dot ${patient.emotionClass}`} style={{ width: 8, height: 8, borderRadius: "50%", display: "inline-block" }} />
            <span className="patient-stat-value">{patient.dominant}</span>
          </div>
        </div>
        <div className="patient-stat">
          <div className="patient-stat-label">Ultima sesiune</div>
          <div className="patient-stat-value">{patient.lastSession}</div>
        </div>
        <div className="patient-stat">
          <div className="patient-stat-label">Tendință</div>
          <div
            className="patient-stat-value"
            style={{ color: patient.trendUp === true ? "var(--accent)" : patient.trendUp === false ? "var(--anger)" : "var(--text-3)" }}
          >
            {patient.trend}
          </div>
        </div>
      </div>
    </Link>
  );
}

function Dashboard() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Dashboard Pacienți"
          actions={
            <button className="btn btn-primary btn-sm">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Pacient nou
            </button>
          }
        />
        <div className="page-body">
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
            {stats.map((s, i) => (
              <div key={i} className="card card-sm">
                <div className="card-title">{s.label}</div>
                <div className="card-value">{s.value}</div>
                <div className="card-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Section label */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div className="section-title">Pacienți</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm">Toți</button>
              <button className="btn btn-ghost btn-sm">Activi</button>
              <button className="btn btn-ghost btn-sm">În așteptare</button>
            </div>
          </div>

          {/* Patient grid */}
          <div className="patients-grid">
            {dummyPatients.map((p, i) => (
              <PatientCard key={p.id} patient={p} colorSet={AVATAR_COLORS[i % AVATAR_COLORS.length]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;