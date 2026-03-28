import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AVATAR_COLORS = [
  { bg: "#E8F4EE", color: "#2D6A4F", border: "#74C69D" },
  { bg: "#EFF6FF", color: "#1E40AF", border: "#93C5FD" },
  { bg: "#FEF3C7", color: "#92400E", border: "#FCD34D" },
  { bg: "#F5F3FF", color: "#5B21B6", border: "#C4B5FD" },
];

function AddPatientModal({ onClose, onSaved }) {
    const [form, setForm] = useState({
      name: "", email: "", age: "", diagnosis: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [tempPassword, setTempPassword] = useState(null);
  
    const handleSubmit = async () => {
      setError("");
      if (!form.name || !form.email || !form.age) {
        setError("Completează toate câmpurile obligatorii!");
        return;
      }
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/patients", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            age: parseInt(form.age),
          }),
        });
  
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || "Eroare la salvare!");
          return;
        }
  
        const data = await res.json();
        setTempPassword(data.tempPassword);
        onSaved(data);
      } catch {
        setError("Eroare de conexiune!");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <>
        <div onClick={!tempPassword ? onClose : undefined}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 1099 }}
        />
        <div style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "var(--surface)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)", padding: "28px 32px",
          width: 480, zIndex: 1100, boxShadow: "var(--shadow-lg)"
        }}>
  
          {/* ── Ecran confirmare cu parola temporară ── */}
          {tempPassword ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "var(--accent-light)", display: "flex",
                  alignItems: "center", justifyContent: "center"
                }}>
                  <svg width="18" height="18" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span style={{ fontWeight: 700, fontSize: 17 }}>Pacient adăugat!</span>
              </div>
  
              <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 16, lineHeight: 1.6 }}>
                Contul a fost creat pentru <strong>{form.name}</strong>.
                Trimite-i pacientului aceste date de acces:
              </p>
  
              <div style={{
                background: "var(--surface2)", borderRadius: "var(--radius-md)",
                padding: "14px 16px", marginBottom: 16
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: "var(--text-3)" }}>Email</span>
                  <span style={{ fontWeight: 600 }}>{form.email}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--text-3)" }}>Parolă temporară</span>
                  <span style={{
                    fontFamily: "var(--mono)", fontWeight: 700,
                    fontSize: 15, color: "var(--accent)",
                    letterSpacing: "0.1em"
                  }}>
                    {tempPassword}
                  </span>
                </div>
              </div>
  
              <div style={{
                padding: "10px 14px", background: "#FFFBEB",
                borderRadius: "var(--radius-md)", fontSize: 12,
                color: "#92400E", marginBottom: 16, lineHeight: 1.6
              }}>
                ⚠️ Parola este afișată o singură dată. La primul login, pacientul va fi rugat să o schimbe.
              </div>
  
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={onClose}>
                Am notat, închide
              </button>
            </div>
          ) : (
            /* ── Formular adăugare ── */
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: 17 }}>Pacient nou</span>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--text-3)" }}>×</button>
              </div>
  
              {[
                { label: "Nume complet *", key: "name", type: "text", placeholder: "Ion Popescu" },
                { label: "Email *", key: "email", type: "email", placeholder: "ion@email.ro" },
                { label: "Vârstă *", key: "age", type: "number", placeholder: "32" },
                { label: "Diagnostic", key: "diagnosis", type: "text", placeholder: "ex: Anxietate generalizată" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <input
                    type={type}
                    className="form-input"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
  
              {error && (
                <div style={{
                  padding: "10px 14px", background: "var(--anger-bg)",
                  borderRadius: "var(--radius-md)", fontSize: 13,
                  color: "var(--anger)", marginBottom: 12
                }}>
                  {error}
                </div>
              )}
  
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>
                  Anulează
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, opacity: loading ? 0.7 : 1 }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Se salvează..." : "Adaugă pacient"}
                </button>
              </div>
            </div>
          )}
        </div>
      </>
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
          <div className="patient-meta">{patient.age} ani · {patient.totalSessions} sesiuni</div>
        </div>
        <span className="status analyzed">
          <span className="status-dot" />
          Activ
        </span>
      </div>
      <div className="patient-stats">
        <div className="patient-stat">
          <div className="patient-stat-label">Diagnostic</div>
          <div className="patient-stat-value" style={{ fontSize: 12 }}>
            {patient.diagnosis || "—"}
          </div>
        </div>
        <div className="patient-stat">
          <div className="patient-stat-label">Ultima sesiune</div>
          <div className="patient-stat-value" style={{ fontSize: 12 }}>
            {patient.lastSession || "—"}
          </div>
        </div>
        <div className="patient-stat">
          <div className="patient-stat-label">Sesiuni</div>
          <div className="patient-stat-value">{patient.totalSessions}</div>
        </div>
      </div>
    </Link>
  );
}

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/patients", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Eroare la încărcarea pacienților");
      setPatients(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handlePatientSaved = (newPatient) => {
    fetchPatients(); // Reîncarcă lista
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Dashboard Pacienți"
          actions={
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Pacient nou
            </button>
          }
        />
        <div className="page-body">

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Pacienți activi", value: patients.length, sub: "total înregistrați" },
              { label: "Sesiuni luna aceasta", value: "—", sub: "în curând" },
              { label: "Înregistrări noi", value: "—", sub: "de procesat" },
              { label: "Îmbunătățire medie", value: "—", sub: "față de luna trecută" },
            ].map((s, i) => (
              <div key={i} className="card card-sm">
                <div className="card-title">{s.label}</div>
                <div className="card-value">{s.value}</div>
                <div className="card-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div className="section-title">Pacienți ({patients.length})</div>
          </div>

          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-3)" }}>
              Se încarcă pacienții...
            </div>
          )}

          {error && (
            <div style={{ padding: "16px", background: "var(--anger-bg)", borderRadius: "var(--radius-md)", color: "var(--anger)", fontSize: 14 }}>
              {error}
            </div>
          )}

          {!loading && !error && patients.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-3)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
                Niciun pacient încă
              </div>
              <div style={{ fontSize: 14, marginBottom: 20 }}>
                Apasă "Pacient nou" pentru a adăuga primul pacient.
              </div>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                + Adaugă primul pacient
              </button>
            </div>
          )}

          {!loading && !error && patients.length > 0 && (
            <div className="patients-grid">
              {patients.map((p, i) => (
                <PatientCard
                  key={p.id}
                  patient={p}
                  colorSet={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <AddPatientModal
          onClose={() => setShowModal(false)}
          onSaved={handlePatientSaved}
        />
      )}
    </div>
  );
}

export default Dashboard;