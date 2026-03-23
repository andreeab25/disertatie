import { useParams, Link } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid, RadarChart,
  PolarGrid, PolarAngleAxis, Radar,
} from "recharts";

// ── Mock data per patient ──────────────────────────────────────────
const PATIENTS = {
  1: { name: "Ion Popescu",     age: 32, diagnosis: "Anxietate generalizată",  since: "2025-09" },
  2: { name: "Maria Ionescu",   age: 28, diagnosis: "Depresie ușoară",         since: "2025-11" },
  3: { name: "Andrei Vasilescu",age: 40, diagnosis: "Tulburare de stres",       since: "2025-06" },
  4: { name: "Elena Georgescu", age: 36, diagnosis: "Fobie socială",            since: "2026-01" },
  5: { name: "Mihai Dumitrescu",age: 45, diagnosis: "Insomnie cronică",         since: "2026-02" },
};

const EMOTIONS = [
  { key: "Fericire", color: "#F59E0B", cls: "joy" },
  { key: "Tristețe", color: "#3B82F6", cls: "sad" },
  { key: "Furie",    color: "#EF4444", cls: "anger" },
  { key: "Surpriză", color: "#8B5CF6", cls: "surprise" },
];

const sessionHistory = [
  { date: "Ian 15", Fericire: 30, Tristețe: 45, Furie: 15, Surpriză: 10, intensity: 62 },
  { date: "Ian 29", Fericire: 35, Tristețe: 40, Furie: 12, Surpriză: 13, intensity: 58 },
  { date: "Feb 12", Fericire: 38, Tristețe: 38, Furie: 14, Surpriză: 10, intensity: 61 },
  { date: "Feb 26", Fericire: 42, Tristețe: 32, Furie: 16, Surpriză: 10, intensity: 55 },
  { date: "Mar 11", Fericire: 48, Tristețe: 28, Furie: 14, Surpriză: 10, intensity: 50 },
  { date: "Mar 18", Fericire: 52, Tristețe: 24, Furie: 12, Surpriză: 12, intensity: 46 },
];

const sessions = [
  { id: 1, date: "2026-03-18", duration: "48 min", dominant: "Fericire", cls: "joy",     intensity: "52%", status: "analyzed" },
  { id: 2, date: "2026-03-11", duration: "52 min", dominant: "Tristețe", cls: "sad",     intensity: "48%", status: "analyzed" },
  { id: 3, date: "2026-02-26", duration: "45 min", dominant: "Fericire", cls: "joy",     intensity: "42%", status: "analyzed" },
  { id: 4, date: "2026-02-12", duration: "50 min", dominant: "Tristețe", cls: "sad",     intensity: "61%", status: "analyzed" },
  { id: 5, date: "2026-01-29", duration: "40 min", dominant: "Furie",    cls: "anger",   intensity: "58%", status: "analyzed" },
];

const radarData = [
  { emotion: "Fericire", current: 52, previous: 42 },
  { emotion: "Tristețe", current: 24, previous: 32 },
  { emotion: "Furie",    current: 12, previous: 16 },
  { emotion: "Surpriză", current: 12, previous: 10 },
];

// ── Mock ML analysis simulation ────────────────────────────────────
function generateMockAnalysis(filename) {
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const joy  = rand(20, 60);
  const sad  = rand(10, 40);
  const anger= rand(5, 25);
  const surp = 100 - joy - sad - anger;
  const total= joy + sad + anger + surp;
  const dominant = [
    { name: "Fericire", val: joy },
    { name: "Tristețe", val: sad },
    { name: "Furie",    val: anger },
    { name: "Surpriză", val: surp },
  ].sort((a, b) => b.val - a.val)[0].name;
  return {
    filename,
    duration: `${rand(30, 65)} min`,
    emotions: [
      { key: "Fericire", pct: Math.round(joy  / total * 100), color: "#F59E0B", cls: "joy" },
      { key: "Tristețe", pct: Math.round(sad  / total * 100), color: "#3B82F6", cls: "sad" },
      { key: "Furie",    pct: Math.round(anger/ total * 100), color: "#EF4444", cls: "anger" },
      { key: "Surpriză", pct: Math.round(surp / total * 100), color: "#8B5CF6", cls: "surprise" },
    ],
    dominant,
    intensity: `${rand(40, 80)}%`,
    segments: Array.from({ length: 12 }, (_, i) => ({
      t: `${i * 4}:00`,
      Fericire: rand(10, 70),
      Tristețe: rand(10, 50),
      Furie:    rand(5, 30),
      Surpriză: rand(5, 20),
    })),
  };
}

// ── Custom tooltip ──────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "var(--text-2)" }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: "var(--text)" }}>{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

// ── Waveform visual ─────────────────────────────────────────────────
function WaveformDisplay({ active }) {
  const bars = Array.from({ length: 40 }, (_, i) => {
    const h = 20 + Math.sin(i * 0.7) * 12 + Math.cos(i * 1.3) * 8 + Math.random() * 10;
    return Math.max(8, Math.min(48, h));
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 52, padding: "2px 0" }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: h,
            background: active ? (i < 18 ? "var(--accent)" : "var(--border-strong)") : "var(--border-strong)",
            borderRadius: 2,
            transition: "background 0.3s",
            opacity: active && i >= 18 ? 0.5 : 1,
          }}
        />
      ))}
    </div>
  );
}

// ── Upload zone ──────────────────────────────────────────────────────
function AudioUpload({ onAnalyze }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState("idle"); // idle | ready | analyzing | done
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setStage("ready");
    setResult(null);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const startAnalysis = () => {
    setStage("analyzing");
    setProgress(0);
    const steps = [
      { pct: 15, label: "Transcriere audio..." },
      { pct: 35, label: "Extragere trăsături vocale..." },
      { pct: 60, label: "Analiză model ML..." },
      { pct: 80, label: "Clasificare emoții..." },
      { pct: 100, label: "Generare raport..." },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i].pct);
        i++;
      } else {
        clearInterval(interval);
        const analysis = generateMockAnalysis(file.name);
        setResult(analysis);
        setStage("done");
        onAnalyze?.(analysis);
      }
    }, 600);
  };

  const reset = () => {
    setFile(null); setStage("idle"); setProgress(0); setResult(null);
  };

  return (
    <div>
      {stage === "idle" && (
        <div
          className={`upload-zone${dragging ? " drag-over" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".mp3,.wav,.m4a,.ogg,.webm"
            style={{ display: "none" }}
            onChange={e => handleFile(e.target.files[0])}
          />
          <div className="upload-zone-icon">
            <svg width="22" height="22" fill="none" stroke="var(--text-2)" strokeWidth="1.6" viewBox="0 0 24 24">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
          <div className="upload-zone-title">Încarcă înregistrare vocală</div>
          <div className="upload-zone-sub">Trage fișierul sau apasă pentru a selecta</div>
          <div className="upload-zone-formats">MP3 · WAV · M4A · OGG</div>
        </div>
      )}

      {stage === "ready" && (
        <div className="card" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, background: "var(--accent-light)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" fill="none" stroke="var(--accent)" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{(file.size / 1024 / 1024).toFixed(1)} MB</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={reset}>Elimină</button>
          </div>
          <WaveformDisplay active={false} />
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={startAnalysis}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Analizează cu ML
            </button>
          </div>
        </div>
      )}

      {stage === "analyzing" && (
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                {progress < 15 ? "Transcriere audio..." :
                 progress < 35 ? "Extragere trăsături vocale..." :
                 progress < 60 ? "Analiză model ML..." :
                 progress < 80 ? "Clasificare emoții..." :
                 "Generare raport..."}
              </span>
              <span style={{ fontSize: 13, color: "var(--text-3)", fontFamily: "var(--mono)" }}>{progress}%</span>
            </div>
            <div className="analysis-progress">
              <div className="analysis-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <WaveformDisplay active />
          <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-3)", textAlign: "center" }}>
            Procesare: {file.name}
          </div>
        </div>
      )}

      {stage === "done" && result && (
        <div className="card" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 20, height: 20, background: "var(--accent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="11" height="11" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>Analiză completă</span>
            <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-3)" }}>{result.duration}</span>
          </div>

          {/* Emotion bars */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", gap: 2, marginBottom: 12 }}>
              {result.emotions.map(e => (
                <div key={e.key} style={{ flex: e.pct, background: e.color, opacity: 0.85 }} title={`${e.key}: ${e.pct}%`} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {result.emotions.map(e => (
                <div key={e.key} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "var(--text-2)", flex: 1 }}>{e.key}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--mono)", color: "var(--text)" }}>{e.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini chart */}
          <div style={{ height: 120, marginBottom: 14 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.segments} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="t" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                {EMOTIONS.map(e => (
                  <Line key={e.key} type="monotone" dataKey={e.key} stroke={e.color} strokeWidth={1.5} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={reset} style={{ flex: 1 }}>Înregistrare nouă</button>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Salvează sesiunea</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────
function PatientPage() {
  const { id } = useParams();
  const patient = PATIENTS[id] || { name: `Pacient #${id}`, age: "—", diagnosis: "—", since: "—" };
  const initials = patient.name.split(" ").map(n => n[0]).join("").slice(0, 2);
  const [newAnalysis, setNewAnalysis] = useState(null);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title={patient.name}
          actions={
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">← Înapoi</Link>
              <button className="btn btn-primary btn-sm">Raport complet</button>
            </>
          }
        />

        <div className="page-body">
          {/* Two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Patient info card */}
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "var(--accent-light)", border: "2.5px solid var(--accent-mid)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 700, color: "var(--accent)", flexShrink: 0
                  }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{patient.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2 }}>{patient.age} ani</div>
                  </div>
                </div>

                <hr className="divider" />

                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                  {[
                    { label: "Diagnostic", val: patient.diagnosis },
                    { label: "Pacient din", val: patient.since },
                    { label: "Total sesiuni", val: sessions.length },
                    { label: "Ultima sesiune", val: sessions[0]?.date || "—" },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--text-3)" }}>{label}</span>
                      <span style={{ fontWeight: 500, color: "var(--text)" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload */}
              <div>
                <div className="section-title">Înregistrare nouă</div>
                <AudioUpload onAnalyze={setNewAnalysis} />
              </div>

              {/* Radar chart */}
              <div className="card">
                <div className="section-title" style={{ marginBottom: 8 }}>Profil emoțional</div>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData} margin={{ top: 4, right: 20, left: 20, bottom: 4 }}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="emotion" tick={{ fontSize: 12, fill: "var(--text-2)" }} />
                    <Radar name="Curent" dataKey="current" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.25} strokeWidth={2} />
                    <Radar name="Anterior" dataKey="previous" stroke="var(--sad)" fill="var(--sad)" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 3" />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Evolution line chart */}
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>Evoluție emoțională</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>Ultimele 6 sesiuni</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {EMOTIONS.map(e => (
                      <div key={e.key} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-2)" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color }} />
                        {e.key}
                      </div>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={sessionHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--text-3)" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--text-3)" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    {EMOTIONS.map(e => (
                      <Line key={e.key} type="monotone" dataKey={e.key} stroke={e.color}
                        strokeWidth={2} dot={{ r: 3, fill: e.color }} activeDot={{ r: 5 }} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Sessions table */}
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "18px 24px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Sesiuni</span>
                  <span style={{ fontSize: 12, color: "var(--text-3)" }}>{sessions.length} sesiuni</span>
                </div>
                <table className="sessions-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Durată</th>
                      <th>Emoție dominantă</th>
                      <th>Intensitate</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map(s => (
                      <tr key={s.id}>
                        <td style={{ fontFamily: "var(--mono)", fontSize: 13 }}>{s.date}</td>
                        <td style={{ color: "var(--text-2)", fontSize: 13 }}>{s.duration}</td>
                        <td>
                          <span className={`emotion-badge ${s.cls}`}>
                            <span className={`emotion-dot ${s.cls}`} />
                            {s.dominant}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 4, background: "var(--surface2)", borderRadius: 2, maxWidth: 80 }}>
                              <div style={{ width: s.intensity, height: "100%", background: "var(--accent)", borderRadius: 2 }} />
                            </div>
                            <span style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--mono)" }}>{s.intensity}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status ${s.status}`}>
                            <span className="status-dot" />
                            {s.status === "analyzed" ? "Analizat" : "În curs"}
                          </span>
                        </td>
                        <td>
                          <Link to={`/video/${s.id}`} className="btn btn-ghost btn-sm">Vezi</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientPage;