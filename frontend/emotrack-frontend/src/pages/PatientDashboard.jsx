import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const EMOTIONS_TREND = [
  { label: "Fericire", now: 52, prev: 38, color: "#F59E0B", cls: "joy",      up: true  },
  { label: "Tristețe", now: 24, prev: 35, color: "#3B82F6", cls: "sad",      up: false },
  { label: "Furie",    now: 12, prev: 18, color: "#EF4444", cls: "anger",    up: false },
  { label: "Surpriză", now: 12, prev: 9,  color: "#8B5CF6", cls: "surprise", up: true  },
];

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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const name = localStorage.getItem("name") || "";
  const firstName = name.split(" ")[0];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/me/profile", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Eroare");
        setProfile(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Urmatoarea programare mock — va fi conectata la backend cand facem AppointmentController
  const nextAppointment = {
    date: "2026-04-01",
    time: "11:30",
    doctor: "Dr. Popescu Ana",
    type: "Ședință individuală",
  };
  const daysUntil = Math.ceil((new Date(nextAppointment.date) - new Date()) / 86400000);

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
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
              Înregistrare nouă
            </Link>
          }
        />
        <div className="page-body">

          {/* Greeting */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.4px", marginBottom: 4 }}>
              Bună, {firstName}! 👋
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-3)" }}>
              Iată o privire de ansamblu asupra evoluției tale
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>

            {/* LEFT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Profil */}
              {!loading && profile && profile.hasProfile && (
                <div className="card">
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Profilul meu</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                    {[
                      { label: "Nume", val: profile.name },
                      { label: "Email", val: profile.email },
                      { label: "Vârstă", val: profile.age ? `${profile.age} ani` : "—" },
                      { label: "Diagnostic", val: profile.diagnosis || "—" },
                      { label: "Pacient din", val: profile.since || "—" },
                      { label: "Total sesiuni", val: profile.totalSessions ?? 0 },
                    ].map(({ label, val }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-3)" }}>{label}</span>
                        <span style={{ fontWeight: 500, color: "var(--text)" }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Urmatoarea programare */}
              <div className="card" style={{ borderLeft: "3px solid var(--accent)", borderRadius: "0 var(--radius-lg) var(--radius-lg) 0" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>
                      Următoarea programare
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>
                      {nextAppointment.date} · {nextAppointment.time}
                    </div>
                    <div style={{ fontSize: 14, color: "var(--text-2)" }}>{nextAppointment.doctor}</div>
                    <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2 }}>{nextAppointment.type}</div>
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

            </div>

            {/* RIGHT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Tendinte emotionale */}
              <div className="card">
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Evoluția emoțiilor tale</div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 14 }}>față de luna trecută</div>
                {EMOTIONS_TREND.map(e => <EmotionTrendRow key={e.label} e={e} />)}
              </div>

              {/* Link rapid la inregistrari */}
              <div className="card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "var(--radius-md)",
                  background: "var(--accent-light)", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <svg width="20" height="20" fill="none" stroke="var(--accent)" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Înregistrările mele</div>
                  <div style={{ fontSize: 13, color: "var(--text-3)" }}>
                    {profile?.totalSessions ?? 0} sesiuni înregistrate
                  </div>
                </div>
                <Link to="/my-recordings" className="btn btn-ghost btn-sm">
                  Vezi →
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;