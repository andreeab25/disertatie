import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [name, setName] = useState("");
  const [role, setRole] = useState("PSYCHOLOGIST");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setType(type === "password" ? "text" : "password");
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Email sau parolă greșite!");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role.toLowerCase());
      localStorage.setItem("name", data.name);
      localStorage.setItem("userId", data.userId);

      if (data.mustChangePassword) {
        navigate("/change-password");
        return;
      }

      if (data.role === "PATIENT") navigate("/patient-dashboard");
      else navigate("/dashboard");
    } catch {
      setError("Eroare de conexiune la server!");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Completează toate câmpurile!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const err = await res.text();
        setError(err || "Eroare la înregistrare!");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role.toLowerCase());
      localStorage.setItem("name", data.name);
      localStorage.setItem("userId", data.userId);

      if (data.role === "PATIENT") navigate("/patient-dashboard");
      else navigate("/dashboard");
    } catch {
      setError("Eroare de conexiune la server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      {/* LEFT: form */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-logo">
            <div
              style={{
                width: 36,
                height: 36,
                background: "var(--accent)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span
              style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px" }}
            >
              Emo<span style={{ color: "var(--accent)" }}>Track</span>
            </span>
          </div>
          <div className="login-title">
            {mode === "login" ? "Bun venit înapoi" : "Creează cont"}
          </div>
          <div className="login-sub">Platformă de monitorizare emoțională</div>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            background: "var(--surface2)",
            padding: 4,
            borderRadius: "var(--radius-md)",
            gap: 4,
            marginBottom: 20,
          }}
        >
          {[
            ["login", "Autentificare"],
            ["register", "Cont nou"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setMode(key);
                setError("");
                setEmail("");
                setPassword("");
                setName("");
                setType("password");
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font)",
                fontSize: 13,
                fontWeight: 500,
                transition: "all 0.15s",
                background: mode === key ? "var(--surface)" : "transparent",
                color: mode === key ? "var(--text)" : "var(--text-3)",
                boxShadow: mode === key ? "var(--shadow-sm)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Câmp Nume — doar la register */}
        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Nume complet</label>
            <input
              type="text"
              className="form-input"
              placeholder="Dr. Popescu Ana"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Adresă email</label>
          <input
            type="email"
            className="form-input"
            placeholder="email@exemplu.ro"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Parolă</label>
          <div style={{ position: "relative" }}>
            <input
              type={type}
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (mode === "login" ? handleLogin() : handleRegister())
              }
              style={{ paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={handleToggle}
              style={{
                position: "absolute",
                right: 12,
                top: "40%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
              }}
            >
              {type === "password" ? (
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Rol — doar la register */}
        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Rol</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="PSYCHOLOGIST">Psiholog</option>
              <option value="PATIENT">Pacient</option>
            </select>
          </div>
        )}

        {/* Eroare */}
        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "var(--anger-bg)",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              color: "var(--anger)",
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: 4,
            opacity: loading ? 0.7 : 1,
          }}
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={loading}
        >
          {loading
            ? "Se procesează..."
            : mode === "login"
            ? "Autentificare"
            : "Creează cont"}
        </button>
      </div>

      {/* RIGHT: visual */}
      <div className="login-right">
        <div style={{ position: "relative", width: 360, height: 360 }}>
          {[280, 220, 160, 100].map((size, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: size,
                height: size,
                borderRadius: "50%",
                border: `1px solid rgba(45,106,79,${0.06 + i * 0.04})`,
                transform: "translate(-50%, -50%)",
                background: i === 3 ? "rgba(45,106,79,0.06)" : "transparent",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "var(--accent)",
                fontWeight: 600,
                marginBottom: 2,
              }}
            >
              Stare curentă
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-1px",
              }}
            >
              Echilibru
            </div>
          </div>
          {[
            {
              label: "Fericire",
              pct: "45%",
              x: "50%",
              y: "12%",
              color: "#F59E0B",
              bg: "#FFFBEB",
            },
            {
              label: "Tristețe",
              pct: "24%",
              x: "85%",
              y: "50%",
              color: "#3B82F6",
              bg: "#EFF6FF",
            },
            {
              label: "Furie",
              pct: "12%",
              x: "50%",
              y: "88%",
              color: "#EF4444",
              bg: "#FEF2F2",
            },
            {
              label: "Surpriză",
              pct: "12%",
              x: "15%",
              y: "50%",
              color: "#8B5CF6",
              bg: "#F5F3FF",
            },
            {
              label: "Neutru",
              pct: "7%",
              x: "20%",
              y: "22%",
              color: "#6B7280",
              bg: "#F9FAFB",
            },
          ].map((e) => (
            <div
              key={e.label}
              style={{
                position: "absolute",
                left: e.x,
                top: e.y,
                transform: "translate(-50%, -50%)",
                background: e.bg,
                border: `1.5px solid ${e.color}33`,
                borderRadius: 20,
                padding: "6px 12px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: 11, color: e.color, fontWeight: 600 }}>
                {e.label}
              </div>
              <div
                style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}
              >
                {e.pct}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 13,
            color: "var(--text-3)",
            textAlign: "center",
            maxWidth: 280,
          }}
        >
          Analiză emoțională bazată pe voce · Monitorizare în timp real
        </div>
      </div>
    </div>
  );
}

export default Login;
