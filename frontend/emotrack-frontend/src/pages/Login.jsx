import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // aici poți integra backend
    navigate("/dashboard");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ background: "white", padding: 40, borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h1 style={{ marginBottom: 20 }}>EmoTrack</h1>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button onClick={handleLogin} style={{ width: "100%" }}>Login</button>
      </div>
    </div>
  );
}

export default Login;