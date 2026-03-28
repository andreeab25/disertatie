import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    if (newPassword.length < 6) {
      setError("Parola trebuie să aibă minim 6 caractere!");
      return;
    }
    if (newPassword !== confirm) {
      setError("Parolele nu coincid!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/auth/change-password", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Eroare la schimbarea parolei!");
        return;
      }

      const data = await res.json();

      // Actualizează token-ul
      localStorage.setItem("token", data.token);

      // Redirect bazat pe rol
      const role = localStorage.getItem("role");
      if (role === "patient") navigate("/patient-dashboard");
      else navigate("/dashboard");

    } catch {
      setError("Eroare de conexiune!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "var(--bg)"
    }}>
      <div style={{
        background: "var(--surface)", borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)", padding: "40px 48px",
        width: 420, boxShadow: "var(--shadow-md)"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 36, height: 36, background: "var(--accent)",
            borderRadius: "var(--radius-md)", display: "flex",
            alignItems: "center", justifyContent: "center"
          }}>
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px" }}>
            Emo<span style={{ color: "var(--accent)" }}>Track</span>
          </span>
        </div>

        {/* Icon cheie */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "var(--accent-light)", border: "2px solid var(--accent-mid)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16
        }}>
          <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
          Schimbă parola
        </div>
        <div style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 24, lineHeight: 1.6 }}>
          Acesta este primul tău login. Te rugăm să setezi o parolă personală.
        </div>

        <div className="form-group">
          <label className="form-label">Parolă nouă</label>
          <input
            type="password"
            className="form-input"
            placeholder="minim 6 caractere"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirmă parola</label>
          <input
            type="password"
            className="form-input"
            placeholder="repetă parola"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {error && (
          <div style={{
            padding: "10px 14px", background: "var(--anger-bg)",
            borderRadius: "var(--radius-md)", fontSize: 13,
            color: "var(--anger)", marginBottom: 12
          }}>
            {error}
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ width: "100%", padding: "12px", marginTop: 4, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Se salvează..." : "Setează parola"}
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;