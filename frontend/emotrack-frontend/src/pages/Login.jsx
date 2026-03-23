import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("psychologist");
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("email", email || (role === "psychologist" ? "dr.popescu@clinic.ro" : "ion.popescu@email.ro"));
    localStorage.setItem("role", role);
    if (role === "patient") navigate("/patient-dashboard");
    else navigate("/dashboard");
  };

  return (
    <div className="login-wrap">
      {/* Left: form */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-logo">
            <div style={{
              width: 36, height: 36, background: "var(--accent)", borderRadius: "var(--radius-md)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px" }}>
              Emo<span style={{ color: "var(--accent)" }}>Track</span>
            </span>
          </div>
          <div className="login-title">Bun venit înapoi</div>
          <div className="login-sub">Platformă de monitorizare emoțională</div>
        </div>

        <div className="form-group">
          <label className="form-label">Adresă email</label>
          <input
            type="email"
            className="form-input"
            placeholder="dr.popescu@clinic.ro"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Parolă</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Rol</label>
          <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
            <option value="psychologist">Psiholog</option>
            <option value="patient">Pacient</option>
          </select>
        </div>

        <button className="btn btn-primary" style={{ width: "100%", marginTop: 8, padding: "12px" }} onClick={handleLogin}>
          Autentificare
        </button>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "var(--text-3)" }}>
          Demo: apasă Autentificare fără a completa datele
        </div>
      </div>

      {/* Right: visual */}
      <div className="login-right">
        {/* Decorative emotion visualization */}
        <div style={{ position: "relative", width: 360, height: 360 }}>
          {/* Concentric circles */}
          {[280, 220, 160, 100].map((size, i) => (
            <div key={i} style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: size, height: size,
              borderRadius: "50%",
              border: `1px solid rgba(45,106,79,${0.06 + i * 0.04})`,
              transform: "translate(-50%, -50%)",
              background: i === 3 ? "rgba(45,106,79,0.06)" : "transparent",
            }} />
          ))}

          {/* Center label */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 2 }}>Stare curentă</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", letterSpacing: "-1px" }}>Echilibru</div>
          </div>

          {/* Emotion nodes */}
          {[
            { label: "Fericire", pct: "45%", x: "50%", y: "12%", color: "#F59E0B", bg: "#FFFBEB" },
            { label: "Tristețe", pct: "24%", x: "85%", y: "50%", color: "#3B82F6", bg: "#EFF6FF" },
            { label: "Furie",    pct: "12%", x: "50%", y: "88%", color: "#EF4444", bg: "#FEF2F2" },
            { label: "Surpriză", pct: "12%", x: "15%", y: "50%", color: "#8B5CF6", bg: "#F5F3FF" },
            { label: "Neutru",   pct: "7%",  x: "20%", y: "22%", color: "#6B7280", bg: "#F9FAFB" },
          ].map((e) => (
            <div key={e.label} style={{
              position: "absolute",
              left: e.x, top: e.y,
              transform: "translate(-50%, -50%)",
              background: e.bg,
              border: `1.5px solid ${e.color}33`,
              borderRadius: 20,
              padding: "6px 12px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: 11, color: e.color, fontWeight: 600 }}>{e.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{e.pct}</div>
            </div>
          ))}
        </div>

        <div style={{
          position: "absolute", bottom: 32,
          fontSize: 13, color: "var(--text-3)", textAlign: "center", maxWidth: 280,
        }}>
          Analiză emoțională bazată pe voce · Monitorizare în timp real
        </div>
      </div>
    </div>
  );
}

export default Login;