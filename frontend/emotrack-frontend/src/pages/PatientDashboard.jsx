import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const MY_APPOINTMENTS = [
  { id: 1, date: "2026-03-25", time: "10:00", doctor: "Dr. Popescu Ana", type: "Ședință individuală", status: "upcoming" },
  { id: 2, date: "2026-04-01", time: "11:30", doctor: "Dr. Popescu Ana", type: "Ședință individuală", status: "upcoming" },
  { id: 3, date: "2026-04-08", time: "10:00", doctor: "Dr. Popescu Ana", type: "Evaluare lunară",     status: "upcoming" },
];

const MY_RECENT_SESSIONS = [
  { id: 1, date: "2026-03-18", dominant: "Fericire", cls: "joy",     intensity: "52%", analyzed: true },
  { id: 2, date: "2026-03-11", dominant: "Tristețe", cls: "sad",     intensity: "48%", analyzed: true },
  { id: 3, date: "2026-02-26", dominant: "Fericire", cls: "joy",     intensity: "42%", analyzed: true },
];

const MY_EMOTIONS_TREND = [
  { label: "Fericire", now: 52, prev: 38, color: "#F59E0B", cls: "joy",      up: true  },
  { label: "Tristețe", now: 24, prev: 35, color: "#3B82F6", cls: "sad",      up: false },
  { label: "Furie",    now: 12, prev: 18, color: "#EF4444", cls: "anger",    up: false },
  { label: "Surpriză", now: 12, prev: 9,  color: "#8B5CF6", cls: "surprise", up: true  },
];

function NextAppointmentCard({ apt }) {
  const daysUntil = Math.ceil((new Date(apt.date) - new Date()) / (1000 * 60 * 60 * 24));
  return (
    <div className="card" style={{ borderLeft: "3px solid var(--accent)", borderRadius: "0 var(--radius-lg) var(--radius-lg) 0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>
            Următoarea programare
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>
            {apt.date} · {apt.time}
          </div>
          <div style={{ fontSize: 14, color: "var(--text-2)" }}>{apt.doctor}</div>
          <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2 }}>{apt.type}</div>
        </div>
        <div style={{
          background: "var(--accent-light)", borderRadius: "var(--radius-md)",
          padding: "10px 14px", textAlign: "center", flexShrink: 0
        }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>{daysUntil}</div>
          <div style={{ fontSize: 11, color: "var(--accent)", marginTop: 2 }}>zile</div>
        </div>
      </div>
    </div>
  );
}

function EmotionTrendRow({ e }) {
  const diff = e.now - e.prev;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 14, color: "var(--text-2)" }}>{e.label}</span>
      <div style={{ width: 100, height: 6, background: "var(--surface2)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${e.now}%`, height: "100%", background: e.color, borderRadius: 3, opacity: 0.8 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--mono)", color: "var(--text)", minWidth: 32, textAlign: "right" }}>{e.now}%</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: e.up ? "var(--accent)" : "var(--anger)", minWidth: 36, textAlign: "right" }}>
        {e.up ? "+" : ""}{diff}%
      </span>
    </div>
  );
}

function PatientDashboard() {
  const email = localStorage.getItem("email") || "pacient@email.ro";
  const firstName = email.split("@")[0].split(".")[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Pagina mea"
          actions={
            <Link to="/my-recordings" className="btn btn-primary btn-sm">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
              Înregistrare nouă
            </Link>
          }
        />
        <div className="page-body">

          {/* Greeting */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.4px", marginBottom: 4 }}>
              Bună, {displayName} 👋
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-3)" }}>
              Iată o privire de ansamblu asupra evoluției tale
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>

            {/* LEFT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Next appointment highlight */}
              <NextAppointmentCard apt={MY_APPOINTMENTS[0]} />

              {/* All upcoming appointments */}
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Programări viitoare</span>
                  <span style={{ fontSize: 12, color: "var(--text-3)" }}>{MY_APPOINTMENTS.length} programate</span>
                </div>
                <div>
                  {MY_APPOINTMENTS.map((apt, i) => (
                    <div key={apt.id} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "12px 20px",
                      borderBottom: i < MY_APPOINTMENTS.length - 1 ? "1px solid var(--border)" : "none",
                    }}>
                      {/* Date block */}
                      <div style={{
                        width: 42, height: 42, borderRadius: "var(--radius-md)",
                        background: i === 0 ? "var(--accent-light)" : "var(--surface2)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1, color: i === 0 ? "var(--accent)" : "var(--text)" }}>
                          {apt.date.split("-")[2]}
                        </span>
                        <span style={{ fontSize: 10, color: i === 0 ? "var(--accent)" : "var(--text-3)", textTransform: "uppercase" }}>
                          {["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"][parseInt(apt.date.split("-")[1]) - 1]}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{apt.time} · {apt.type}</div>
                        <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 1 }}>{apt.doctor}</div>
                      </div>
                      {i === 0 && (
                        <span style={{ fontSize: 11, background: "var(--accent-light)", color: "var(--accent)", borderRadius: 20, padding: "2px 8px", fontWeight: 600 }}>
                          Următor
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Emotion trend */}
              <div className="card">
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Evoluția emoțiilor tale</div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 14 }}>față de luna trecută</div>
                {MY_EMOTIONS_TREND.map(e => <EmotionTrendRow key={e.label} e={e} />)}
              </div>

              {/* Recent sessions mini list */}
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Înregistrări recente</span>
                  <Link to="/my-recordings" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
                    Vezi toate →
                  </Link>
                </div>
                {MY_RECENT_SESSIONS.map((s, i) => (
                  <div key={s.id} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 20px",
                    borderBottom: i < MY_RECENT_SESSIONS.length - 1 ? "1px solid var(--border)" : "none",
                  }}>
                    <span className={`emotion-badge ${s.cls}`}>
                      <span className={`emotion-dot ${s.cls}`} />
                      {s.dominant}
                    </span>
                    <span style={{ flex: 1, fontSize: 13, color: "var(--text-2)", fontFamily: "var(--mono)" }}>{s.date}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 50, height: 4, background: "var(--surface2)", borderRadius: 2 }}>
                        <div style={{ width: s.intensity, height: "100%", background: "var(--accent)", borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--mono)" }}>{s.intensity}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;