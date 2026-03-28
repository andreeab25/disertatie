import { useState, useRef, useCallback, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const EMOTIONS = [
  { key: "Fericire", color: "#F59E0B", cls: "joy" },
  { key: "Tristețe", color: "#3B82F6", cls: "sad" },
  { key: "Furie", color: "#EF4444", cls: "anger" },
  { key: "Surpriză", color: "#8B5CF6", cls: "surprise" },
];

const MY_RECORDINGS = [
  {
    id: 1,
    date: "2026-03-18",
    duration: "48 min",
    size: "12.4 MB",
    dominant: "Fericire",
    cls: "joy",
    intensity: 52,
    emotions: [
      { key: "Fericire", pct: 52, color: "#F59E0B" },
      { key: "Tristețe", pct: 24, color: "#3B82F6" },
      { key: "Furie", pct: 12, color: "#EF4444" },
      { key: "Surpriză", pct: 12, color: "#8B5CF6" },
    ],
    analyzed: true,
    segments: [
      { t: "0:00", Fericire: 30, Tristețe: 40, Furie: 20, Surpriză: 10 },
      { t: "12:00", Fericire: 45, Tristețe: 30, Furie: 15, Surpriză: 10 },
      { t: "24:00", Fericire: 55, Tristețe: 25, Furie: 10, Surpriză: 10 },
      { t: "36:00", Fericire: 60, Tristețe: 20, Furie: 10, Surpriză: 10 },
      { t: "48:00", Fericire: 65, Tristețe: 20, Furie: 8, Surpriză: 7 },
    ],
  },
  {
    id: 2,
    date: "2026-03-11",
    duration: "52 min",
    size: "13.8 MB",
    dominant: "Tristețe",
    cls: "sad",
    intensity: 48,
    emotions: [
      { key: "Fericire", pct: 20, color: "#F59E0B" },
      { key: "Tristețe", pct: 48, color: "#3B82F6" },
      { key: "Furie", pct: 18, color: "#EF4444" },
      { key: "Surpriză", pct: 14, color: "#8B5CF6" },
    ],
    analyzed: true,
    segments: [
      { t: "0:00", Fericire: 20, Tristețe: 50, Furie: 20, Surpriză: 10 },
      { t: "13:00", Fericire: 22, Tristețe: 48, Furie: 18, Surpriză: 12 },
      { t: "26:00", Fericire: 25, Tristețe: 45, Furie: 18, Surpriză: 12 },
      { t: "39:00", Fericire: 28, Tristețe: 42, Furie: 17, Surpriță: 13 },
      { t: "52:00", Fericire: 30, Tristețe: 40, Furie: 16, Surpriză: 14 },
    ],
  },
  {
    id: 3,
    date: "2026-02-26",
    duration: "45 min",
    size: "11.2 MB",
    dominant: "Furie",
    cls: "anger",
    intensity: 61,
    emotions: [
      { key: "Fericire", pct: 15, color: "#F59E0B" },
      { key: "Tristețe", pct: 30, color: "#3B82F6" },
      { key: "Furie", pct: 40, color: "#EF4444" },
      { key: "Surpriză", pct: 15, color: "#8B5CF6" },
    ],
    analyzed: true,
    segments: [
      { t: "0:00", Fericire: 15, Tristețe: 25, Furie: 50, Surpriză: 10 },
      { t: "11:00", Fericire: 15, Tristețe: 28, Furie: 45, Surpriță: 12 },
      { t: "22:00", Fericire: 18, Tristețe: 30, Furie: 38, Surpriză: 14 },
      { t: "33:00", Fericire: 20, Tristețe: 32, Furie: 32, Surpriză: 16 },
      { t: "45:00", Fericire: 22, Tristețe: 30, Furie: 30, Surpriză: 18 },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────
function fmtTime(s) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
    s % 60
  ).padStart(2, "0")}`;
}

function generateMockAnalysis(durationSec) {
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const joy = rand(20, 60),
    sad = rand(10, 40),
    anger = rand(5, 25);
  const surp = Math.max(5, 100 - joy - sad - anger);
  const total = joy + sad + anger + surp;
  const emotions = [
    {
      key: "Fericire",
      pct: Math.round((joy / total) * 100),
      color: "#F59E0B",
      cls: "joy",
    },
    {
      key: "Tristețe",
      pct: Math.round((sad / total) * 100),
      color: "#3B82F6",
      cls: "sad",
    },
    {
      key: "Furie",
      pct: Math.round((anger / total) * 100),
      color: "#EF4444",
      cls: "anger",
    },
    {
      key: "Surpriză",
      pct: Math.round((surp / total) * 100),
      color: "#8B5CF6",
      cls: "surprise",
    },
  ];
  const dominant = [...emotions].sort((a, b) => b.pct - a.pct)[0];
  const mins = Math.floor(durationSec / 60),
    secs = durationSec % 60;
  const numSeg = Math.max(3, Math.min(8, Math.floor(durationSec / 15)));
  return {
    duration: mins > 0 ? `${mins} min ${secs} sec` : `${secs} sec`,
    dominant: dominant.key,
    cls: dominant.cls,
    intensity: rand(40, 80),
    emotions,
    segments: Array.from({ length: numSeg }, (_, i) => {
      const t = Math.floor((durationSec / numSeg) * i);
      return {
        t: `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`,
        Fericire: rand(10, 70),
        Tristețe: rand(10, 50),
        Furie: rand(5, 30),
        Surpriză: rand(5, 20),
      };
    }),
  };
}

// ── Live waveform via Web Audio API ──────────────────────────────────
function LiveWaveform({ analyserRef, active }) {
  const canvasRef = useRef();
  const rafRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width,
      H = canvas.height;
    const accentColor = "#2D6A4F";

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      const BAR_COUNT = 52;
      const barW = Math.floor((W - BAR_COUNT * 2) / BAR_COUNT);

      const analyser = analyserRef.current;
      if (!analyser || !active) {
        // gentle idle animation
        const t = Date.now() * 0.002;
        for (let i = 0; i < BAR_COUNT; i++) {
          const h =
            4 + Math.sin(i * 0.4 + t) * 3 + Math.cos(i * 0.8 + t * 1.3) * 2;
          ctx.fillStyle = "rgba(0,0,0,0.1)";
          ctx.beginPath();
          ctx.roundRect(i * (barW + 2), (H - h) / 2, barW, h, 2);
          ctx.fill();
        }
        return;
      }

      const bufLen = analyser.frequencyBinCount;
      const data = new Uint8Array(bufLen);
      analyser.getByteFrequencyData(data);
      const step = Math.floor(bufLen / BAR_COUNT);

      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += data[i * step + j];
        const avg = sum / step;
        const h = Math.max(3, (avg / 255) * (H - 6));
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.6 + (avg / 255) * 0.4;
        ctx.beginPath();
        ctx.roundRect(i * (barW + 2), (H - h) / 2, barW, h, 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyserRef, active]);

  return (
    <canvas
      ref={canvasRef}
      width={580}
      height={60}
      style={{ width: "100%", height: 60, display: "block" }}
    />
  );
}

// ── Static waveform ──────────────────────────────────────────────────
function StaticWaveform({ played }) {
  const bars = Array.from({ length: 52 }, (_, i) =>
    Math.max(
      6,
      Math.min(
        40,
        18 + Math.sin(i * 0.55) * 11 + Math.cos(i * 1.1) * 6 + (i % 4) * 2
      )
    )
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 60 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: h,
            borderRadius: 2,
            background:
              i < Math.floor(52 * (played ?? 0))
                ? "var(--accent)"
                : "var(--border-strong)",
            opacity: 0.8,
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

// ── Live Recorder ─────────────────────────────────────────────────────
function LiveRecorder({ onSave }) {
  const [stage, setStage] = useState("idle"); // idle | permission | recording | paused | analyzing | done
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const mrRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);
  const elapsedRef = useRef(0);

  // Keep ref in sync so stopRecording can read latest value
  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  const startRecording = async () => {
    setError(null);
    setStage("permission");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const src = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.75;
      src.connect(analyser);
      analyserRef.current = analyser;

      const mr = new MediaRecorder(stream);
      mrRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.start(100);

      setElapsed(0);
      elapsedRef.current = 0;
      setStage("recording");
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } catch {
      setError(
        "Microfonul nu a putut fi accesat. Verifică permisiunile browserului."
      );
      setStage("idle");
    }
  };

  const pauseRecording = () => {
    mrRef.current?.pause();
    clearInterval(timerRef.current);
    setStage("paused");
  };

  const resumeRecording = () => {
    mrRef.current?.resume();
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    setStage("recording");
  };

  const stopAndAnalyze = () => {
    clearInterval(timerRef.current);
    mrRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
    analyserRef.current = null;

    const duration = elapsedRef.current;
    setStage("analyzing");
    setProgress(0);
    const steps = [15, 35, 60, 80, 100];
    let i = 0;
    const iv = setInterval(() => {
      if (i < steps.length) setProgress(steps[i++]);
      else {
        clearInterval(iv);
        const analysis = generateMockAnalysis(duration);
        const mimeType = MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setResult({ ...analysis, audioBlob: blob });
        setStage("done");
      }
    }, 600);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
    analyserRef.current = null;
    setStage("idle");
    setElapsed(0);
    setProgress(0);
    setResult(null);
    setError(null);
  };

  const STEP_LABELS = [
    "Transcriere audio...",
    "Extragere trăsături...",
    "Model ML...",
    "Clasificare emoții...",
    "Generare raport...",
  ];
  const stepIdx =
    progress < 15
      ? 0
      : progress < 35
      ? 1
      : progress < 60
      ? 2
      : progress < 80
      ? 3
      : 4;

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 15 }}>Înregistrare live</span>
        {stage === "recording" && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#EF4444",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#EF4444",
                display: "inline-block",
                animation: "recPulse 1s ease-in-out infinite",
              }}
            />
            REC · {fmtTime(elapsed)}
          </span>
        )}
        {stage === "paused" && (
          <span
            style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 600 }}
          >
            PAUZĂ · {fmtTime(elapsed)}
          </span>
        )}
      </div>

      {stage === "idle" && (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "28px 16px",
              gap: 14,
              background: "var(--surface2)",
              borderRadius: "var(--radius-md)",
              border: "1.5px dashed var(--border-strong)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--accent-light)",
                border: "2px solid var(--accent-mid)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>
                Înregistrează sesiunea
              </div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                Browserul va cere acces la microfon
              </div>
            </div>
          </div>
          {error && (
            <div
              style={{
                marginTop: 10,
                padding: "10px 14px",
                background: "#FEF2F2",
                borderRadius: "var(--radius-md)",
                fontSize: 13,
                color: "#991B1B",
              }}
            >
              {error}
            </div>
          )}
          <button
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 14 }}
            onClick={startRecording}
          >
            <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" />
            </svg>
            Începe înregistrarea
          </button>
        </div>
      )}

      {stage === "permission" && (
        <div
          style={{
            textAlign: "center",
            padding: "28px 0",
            color: "var(--text-3)",
            fontSize: 14,
          }}
        >
          Așteptând permisiunea pentru microfon...
        </div>
      )}

      {(stage === "recording" || stage === "paused") && (
        <div>
          {/* Big timer */}
          <div
            style={{
              textAlign: "center",
              fontSize: 42,
              fontWeight: 700,
              fontFamily: "var(--mono)",
              letterSpacing: "0.05em",
              color: "var(--text)",
              marginBottom: 16,
              lineHeight: 1,
            }}
          >
            {fmtTime(elapsed)}
          </div>

          {/* Waveform */}
          <div
            style={{
              background: "var(--surface2)",
              borderRadius: "var(--radius-md)",
              padding: "8px 10px",
              marginBottom: 16,
              opacity: stage === "paused" ? 0.4 : 1,
              transition: "opacity 0.3s",
            }}
          >
            <LiveWaveform
              analyserRef={analyserRef}
              active={stage === "recording"}
            />
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: 8 }}>
            {stage === "recording" ? (
              <button
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={pauseRecording}
              >
                <svg
                  width="13"
                  height="13"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                Pauză
              </button>
            ) : (
              <button
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={resumeRecording}
              >
                <svg
                  width="13"
                  height="13"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Continuă
              </button>
            )}
            <button
              className="btn btn-primary"
              style={{
                flex: 2,
                background: elapsed < 2 ? "var(--border-strong)" : "#EF4444",
                cursor: elapsed < 2 ? "not-allowed" : "pointer",
              }}
              onClick={elapsed >= 2 ? stopAndAnalyze : undefined}
            >
              <svg
                width="13"
                height="13"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
              Stop & Analizează
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: "8px 10px" }}
              onClick={reset}
              title="Anulează"
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {stage === "analyzing" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 13, color: "var(--text-2)" }}>
              {STEP_LABELS[stepIdx]}
            </span>
            <span
              style={{
                fontSize: 13,
                fontFamily: "var(--mono)",
                color: "var(--text-3)",
              }}
            >
              {progress}%
            </span>
          </div>
          <div className="analysis-progress" style={{ marginBottom: 14 }}>
            <div
              className="analysis-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <StaticWaveform played={progress / 100} />
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "var(--text-3)",
              textAlign: "center",
            }}
          >
            Se procesează · {fmtTime(elapsed)}
          </div>
        </div>
      )}

      {stage === "done" && result && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="11"
                height="11"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span
              style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}
            >
              Analiză completă · {result.duration}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              height: 8,
              borderRadius: 4,
              overflow: "hidden",
              gap: 2,
              marginBottom: 12,
            }}
          >
            {result.emotions.map((e) => (
              <div
                key={e.key}
                style={{ flex: e.pct, background: e.color, opacity: 0.85 }}
              />
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 14,
            }}
          >
            {result.emotions.map((e) => (
              <div
                key={e.key}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: e.color,
                  }}
                />
                <span style={{ fontSize: 12, color: "var(--text-2)" }}>
                  {e.key}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    marginLeft: "auto",
                    fontFamily: "var(--mono)",
                  }}
                >
                  {e.pct}%
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ flex: 1 }}
              onClick={reset}
            >
              Înregistrare nouă
            </button>
            <button
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
              onClick={() => {
                onSave(result, result.audioBlob);
                reset();
              }}
            >
              Salvează
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes recPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.75)} }`}</style>
    </div>
  );
}

// ── Upload panel ──────────────────────────────────────────────────────
function UploadPanel({ onSave }) {
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (f) {
      setFile(f);
      setStage("ready");
    }
  };
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);
  const reset = () => {
    setFile(null);
    setStage("idle");
    setProgress(0);
    setResult(null);
  };

  const startAnalysis = () => {
    setStage("analyzing");
    setProgress(0);
    let i = 0;
    const steps = [15, 35, 60, 80, 100];
    const iv = setInterval(() => {
      if (i < steps.length) setProgress(steps[i++]);
      else {
        clearInterval(iv);
        setResult(generateMockAnalysis(2700));
        setStage("done");
      }
    }, 700);
  };

  const STEP_LABELS = [
    "Transcriere audio...",
    "Extragere trăsături...",
    "Model ML...",
    "Clasificare emoții...",
    "Generare raport...",
  ];
  const stepIdx =
    progress < 15
      ? 0
      : progress < 35
      ? 1
      : progress < 60
      ? 2
      : progress < 80
      ? 3
      : 4;

  return (
    <div className="card">
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
        Încarcă fișier audio
      </div>

      {stage === "idle" && (
        <div
          className={`upload-zone${dragging ? " drag-over" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".mp3,.wav,.m4a,.ogg"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div className="upload-zone-icon">
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="var(--text-2)"
              strokeWidth="1.6"
              viewBox="0 0 24 24"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="upload-zone-title">Încarcă înregistrare</div>
          <div className="upload-zone-sub">
            Trage fișierul sau apasă pentru a selecta
          </div>
          <div className="upload-zone-formats">MP3 · WAV · M4A · OGG</div>
        </div>
      )}

      {stage === "ready" && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              background: "var(--surface2)",
              borderRadius: "var(--radius-md)",
              marginBottom: 14,
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            </svg>
            <span
              style={{
                flex: 1,
                fontSize: 13,
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {file.name}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>
              {(file.size / 1024 / 1024).toFixed(1)} MB
            </span>
            <button
              onClick={reset}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-3)",
                fontSize: 18,
                lineHeight: 1,
                padding: "0 2px",
              }}
            >
              ×
            </button>
          </div>
          <StaticWaveform played={0} />
          <button
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 14 }}
            onClick={startAnalysis}
          >
            Analizează cu ML
          </button>
        </div>
      )}

      {stage === "analyzing" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 13, color: "var(--text-2)" }}>
              {STEP_LABELS[stepIdx]}
            </span>
            <span
              style={{
                fontSize: 13,
                fontFamily: "var(--mono)",
                color: "var(--text-3)",
              }}
            >
              {progress}%
            </span>
          </div>
          <div className="analysis-progress" style={{ marginBottom: 14 }}>
            <div
              className="analysis-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <StaticWaveform played={progress / 100} />
        </div>
      )}

      {stage === "done" && result && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="10"
                height="10"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span
              style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}
            >
              Analiză completă · {result.duration}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              height: 8,
              borderRadius: 4,
              overflow: "hidden",
              gap: 2,
              marginBottom: 12,
            }}
          >
            {result.emotions.map((e) => (
              <div
                key={e.key}
                style={{ flex: e.pct, background: e.color, opacity: 0.85 }}
              />
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 14,
            }}
          >
            {result.emotions.map((e) => (
              <div
                key={e.key}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: e.color,
                  }}
                />
                <span style={{ fontSize: 12, color: "var(--text-2)" }}>
                  {e.key}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    marginLeft: "auto",
                    fontFamily: "var(--mono)",
                  }}
                >
                  {e.pct}%
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ flex: 1 }}
              onClick={reset}
            >
              Fișier nou
            </button>
            <button
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
              onClick={() => {
                onSave(result, null);
                reset();
              }}
            >
              Salvează
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Recording detail slide-in ─────────────────────────────────────────
function RecordingDetail({ rec, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 400,
        height: "100vh",
        background: "var(--surface)",
        borderLeft: "1px solid var(--border)",
        zIndex: 1100,
        display: "flex",
        flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          padding: "18px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>
            Sesiune {rec.date}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 1 }}>
            {rec.duration} · {rec.size}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            color: "var(--text-3)",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div>
          <div className="section-title" style={{ marginBottom: 10 }}>
            Distribuție emoții
          </div>
          <div
            style={{
              display: "flex",
              height: 10,
              borderRadius: 5,
              overflow: "hidden",
              gap: 2,
              marginBottom: 12,
            }}
          >
            {rec.emotions.map((e) => (
              <div
                key={e.key}
                style={{ flex: e.pct, background: e.color, opacity: 0.85 }}
              />
            ))}
          </div>
          {rec.emotions.map((e) => (
            <div
              key={e.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: e.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, fontSize: 13, color: "var(--text-2)" }}>
                {e.key}
              </span>
              <div
                style={{
                  width: 80,
                  height: 5,
                  background: "var(--surface2)",
                  borderRadius: 3,
                }}
              >
                <div
                  style={{
                    width: `${e.pct}%`,
                    height: "100%",
                    background: e.color,
                    borderRadius: 3,
                    opacity: 0.8,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "var(--mono)",
                  minWidth: 30,
                  textAlign: "right",
                }}
              >
                {e.pct}%
              </span>
            </div>
          ))}
        </div>
        <div>
          <div className="section-title" style={{ marginBottom: 10 }}>
            Evoluție în sesiune
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart
              data={rec.segments}
              margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="t"
                tick={{ fontSize: 10, fill: "var(--text-3)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--text-3)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              {EMOTIONS.map((e) => (
                <Line
                  key={e.key}
                  type="monotone"
                  dataKey={e.key}
                  stroke={e.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div
          style={{
            background: "var(--surface2)",
            borderRadius: "var(--radius-md)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 8 }}
          >
            Rezumat
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-3)",
                  marginBottom: 4,
                }}
              >
                Emoție dominantă
              </div>
              <span
                className={`emotion-badge ${rec.cls}`}
                style={{ display: "inline-flex" }}
              >
                <span className={`emotion-dot ${rec.cls}`} />
                {rec.dominant}
              </span>
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-3)",
                  marginBottom: 4,
                }}
              >
                Intensitate
              </div>
              <div
                style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}
              >
                {rec.intensity}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function emotionToCls(emotion) {
  const map = {
    Fericire: "joy",
    Tristețe: "sad",
    Furie: "anger",
    Surpriză: "surprise",
  };
  return map[emotion] || "neutral";
}

// ── Main ──────────────────────────────────────────────────────────────
function MyRecordings() {
  const [recordings, setRecordings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("live");

  const fetchRecordings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/recordings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Eroare");
      const data = await res.json();

      // Convertește formatul backend la formatul frontend
      const converted = data.map((r) => ({
        id: r.id,
        date: r.date,
        duration: r.duration,
        size: r.size,
        dominant: r.dominantEmotion !== "—" ? r.dominantEmotion : "Neutru",
        cls: emotionToCls(r.dominantEmotion),
        intensity: r.intensity || 0,
        emotions: [
          { key: "Fericire", pct: 25, color: "#F59E0B" },
          { key: "Tristețe", pct: 25, color: "#3B82F6" },
          { key: "Furie", pct: 25, color: "#EF4444" },
          { key: "Surpriză", pct: 25, color: "#8B5CF6" },
        ],
        analyzed: r.status === "ANALYZED",
        segments: [],
      }));

      setRecordings(converted);
    } catch (err) {
      console.error("Eroare fetch recordings:", err);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const handleSave = async (result, audioBlob) => {
    try {
      const token = localStorage.getItem("token");

      // Upload fișier audio dacă există
      if (audioBlob) {
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.wav");

        const uploadRes = await fetch(
          "http://localhost:8080/api/recordings/upload",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (!uploadRes.ok) throw new Error("Eroare la upload!");
      }

      // Adaugă local în listă
      const newRec = {
        id: recordings.length + 1,
        date: new Date().toISOString().split("T")[0],
        duration: result.duration,
        size: activeTab === "live" ? "Live" : "—",
        dominant: result.dominant,
        cls: result.cls,
        intensity: result.intensity,
        emotions: result.emotions,
        analyzed: true,
        segments: result.segments,
      };
      setRecordings((prev) => [newRec, ...prev]);

      // Reîncarcă din backend
      await fetchRecordings();
    } catch (err) {
      console.error("Eroare salvare:", err);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Înregistrările mele" />
        <div className="page-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "340px 1fr",
              gap: 20,
              alignItems: "start",
            }}
          >
            {/* LEFT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Tab switcher */}
              <div
                style={{
                  display: "flex",
                  background: "var(--surface2)",
                  padding: 4,
                  borderRadius: "var(--radius-md)",
                  gap: 4,
                }}
              >
                {[
                  ["live", "🎙 Înregistrează live"],
                  ["upload", "⬆ Încarcă fișier"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: "var(--radius-sm)",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font)",
                      fontSize: 13,
                      fontWeight: 500,
                      background:
                        activeTab === key ? "var(--surface)" : "transparent",
                      color:
                        activeTab === key ? "var(--text)" : "var(--text-3)",
                      boxShadow:
                        activeTab === key ? "var(--shadow-sm)" : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === "live" ? (
                <LiveRecorder onSave={handleSave} />
              ) : (
                <UploadPanel onSave={handleSave} />
              )}

              <div
                style={{
                  padding: "10px 14px",
                  background: "var(--surface2)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 12,
                  color: "var(--text-3)",
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: "var(--text-2)" }}>Notă:</strong>{" "}
                Înregistrările sunt procesate prin modelul ML de detectare
                emoțională. Psihologul tău va putea vedea rezultatele analizate.
              </div>
            </div>

            {/* RIGHT: history table */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px 14px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 15 }}>
                  Istoricul înregistrărilor
                </span>
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                  {recordings.length} înregistrări
                </span>
              </div>
              <table className="sessions-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Durată</th>
                    <th>Emoție dominantă</th>
                    <th>Intensitate</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recordings.map((r) => (
                    <tr
                      key={r.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelected(r)}
                    >
                      <td style={{ fontFamily: "var(--mono)", fontSize: 13 }}>
                        {r.date}
                      </td>
                      <td style={{ color: "var(--text-2)", fontSize: 13 }}>
                        {r.duration}
                      </td>
                      <td>
                        <span className={`emotion-badge ${r.cls}`}>
                          <span className={`emotion-dot ${r.cls}`} />
                          {r.dominant}
                        </span>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
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
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--text-3)",
                              fontFamily: "var(--mono)",
                            }}
                          >
                            {r.intensity}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(r);
                          }}
                        >
                          Detalii
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <RecordingDetail rec={selected} onClose={() => setSelected(null)} />
      )}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.15)",
            zIndex: 1099,
          }}
        />
      )}
    </div>
  );
}

export default MyRecordings;
