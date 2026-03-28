import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function emotionToCls(emotion) {
  const map = {
    Fericire: "joy",
    Tristețe: "sad",
    Furie: "anger",
    Surpriză: "surprise",
  };
  return map[emotion] || "neutral";
}

// ── Player audio inline ───────────────────────────────────────────────
function AudioPlayer({ recordingId }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const audioRef = useRef(null);
  const token = localStorage.getItem("token");

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
      Math.floor(s % 60)
    ).padStart(2, "0")}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress(
        audio.duration ? (audio.currentTime / audio.duration) * 100 : 0
      );
    };
    const onEnded = () => setPlaying(false);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        setPlaying(true);
      }
    } catch (err) {
      console.error("Play error:", err.message, "audio src:", audio.src);
      setLoadError(true);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        background: "var(--surface2)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <audio
        ref={audioRef}
        src={`http://localhost:8080/api/recordings/${recordingId}/stream`}
        preload="metadata"
        // Trimite token prin query param nu e ideal dar simplu pentru demo
      />
      <button
        onClick={togglePlay}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "var(--accent)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {playing ? (
          <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>

      {/* Progress bar */}
      <div
        onClick={handleSeek}
        style={{
          flex: 1,
          height: 4,
          background: "var(--border-strong)",
          borderRadius: 2,
          cursor: "pointer",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "var(--accent)",
            borderRadius: 2,
            transition: "width 0.1s",
          }}
        />
      </div>

      <span
        style={{
          fontSize: 11,
          fontFamily: "var(--mono)",
          color: "var(--text-3)",
          flexShrink: 0,
        }}
      >
        {fmt(currentTime)} / {fmt(duration)}
      </span>
    </div>
  );
}

// ── Recording row expandabil ──────────────────────────────────────────
function RecordingRow({ r }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr style={{ cursor: "pointer" }} onClick={() => setExpanded((e) => !e)}>
        <td style={{ fontFamily: "var(--mono)", fontSize: 13 }}>{r.date}</td>
        <td style={{ color: "var(--text-2)", fontSize: 13 }}>{r.duration}</td>
        <td>
          <span className={`emotion-badge ${r.cls}`}>
            <span className={`emotion-dot ${r.cls}`} />
            {r.dominant}
          </span>
        </td>
        <td>
          {r.intensity ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 60,
                  height: 4,
                  background: "var(--surface2)",
                  borderRadius: 2,
                }}
              >
                <div
                  style={{
                    width: `${r.intensity}%`,
                    height: "100%",
                    background: "var(--accent)",
                    borderRadius: 2,
                  }}
                />
              </div>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                {r.intensity}%
              </span>
            </div>
          ) : (
            "—"
          )}
        </td>
        <td>
          <span
            className={`status ${
              r.status === "ANALYZED" ? "analyzed" : "pending"
            }`}
          >
            <span className="status-dot" />
            {r.status === "ANALYZED" ? "Analizat" : "În curs"}
          </span>
        </td>
        <td>
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="var(--text-3)"
            strokeWidth="2"
            viewBox="0 0 24 24"
            style={{
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td
            colSpan={6}
            style={{ padding: "12px 16px", background: "var(--surface2)" }}
          >
            <AudioPlayer recordingId={r.id} />
          </td>
        </tr>
      )}
    </>
  );
}

function PatientPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("token");

        const patientRes = await fetch(
          `http://localhost:8080/api/patients/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!patientRes.ok) throw new Error("Eroare la încărcarea pacientului");
        const patientData = await patientRes.json();

        const recRes = await fetch(
          `http://localhost:8080/api/recordings/patient/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const recData = recRes.ok ? await recRes.json() : [];

        setPatient({
          ...patientData,
          recordings: recData.map((r) => ({
            id: r.id,
            date: r.date,
            duration: r.duration,
            dominant: r.dominantEmotion !== "—" ? r.dominantEmotion : "Neutru",
            cls: emotionToCls(r.dominantEmotion),
            intensity: r.intensity || 0,
            status: r.status,
          })),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading || !patient)
    return (
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Topbar title="Se încarcă..." />
          <div
            style={{ padding: 40, textAlign: "center", color: "var(--text-3)" }}
          >
            Se încarcă datele pacientului...
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Topbar title="Eroare" />
          <div style={{ padding: 40, color: "var(--anger)" }}>{error}</div>
        </div>
      </div>
    );

  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title={patient.name}
          actions={
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">
                ← Înapoi
              </Link>
              <button className="btn btn-primary btn-sm">Raport complet</button>
            </>
          }
        />
        <div className="page-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: 20,
              alignItems: "start",
            }}
          >
            {/* LEFT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "var(--accent-light)",
                      border: "2.5px solid var(--accent-mid)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--accent)",
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>
                      {patient.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--text-3)",
                        marginTop: 2,
                      }}
                    >
                      {patient.age} ani
                    </div>
                  </div>
                </div>

                <hr className="divider" />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    fontSize: 13,
                  }}
                >
                  {[
                    { label: "Email", val: patient.email },
                    { label: "Diagnostic", val: patient.diagnosis },
                    { label: "Pacient din", val: patient.since },
                    { label: "Total sesiuni", val: patient.totalSessions },
                    { label: "Ultima sesiune", val: patient.lastSession },
                  ].map(({ label, val }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "var(--text-3)" }}>{label}</span>
                      <span
                        style={{
                          fontWeight: 500,
                          color: "var(--text)",
                          textAlign: "right",
                          maxWidth: 160,
                          wordBreak: "break-word",
                        }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div
                  style={{
                    padding: "18px 24px 14px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Sesiuni</span>
                  <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                    {patient.recordings?.length || 0} sesiuni
                  </span>
                </div>

                {!patient.recordings || patient.recordings.length === 0 ? (
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "var(--text-3)",
                      fontSize: 14,
                    }}
                  >
                    Nicio sesiune înregistrată încă.
                  </div>
                ) : (
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
                      {patient.recordings.map((r) => (
                        <RecordingRow key={r.id} r={r} />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientPage;
