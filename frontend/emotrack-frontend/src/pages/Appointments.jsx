import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const UPCOMING = [
  { id: 1, date: "2026-03-25", time: "10:00", doctor: "Dr. Popescu Ana", type: "Ședință individuală",  location: "Cabinet 12, Etaj 2", duration: "50 min", notes: "Continuăm tehnicile de relaxare" },
  { id: 2, date: "2026-04-01", time: "11:30", doctor: "Dr. Popescu Ana", type: "Ședință individuală",  location: "Cabinet 12, Etaj 2", duration: "50 min", notes: "" },
  { id: 3, date: "2026-04-08", time: "10:00", doctor: "Dr. Popescu Ana", type: "Evaluare lunară",      location: "Cabinet 12, Etaj 2", duration: "60 min", notes: "Evaluare lunară + revizuire obiective" },
  { id: 4, date: "2026-04-22", time: "10:00", doctor: "Dr. Popescu Ana", type: "Ședință individuală",  location: "Cabinet 12, Etaj 2", duration: "50 min", notes: "" },
];

const PAST = [
  { id: 5, date: "2026-03-18", time: "10:00", doctor: "Dr. Popescu Ana", type: "Ședință individuală", duration: "48 min", attended: true  },
  { id: 6, date: "2026-03-11", time: "11:00", doctor: "Dr. Popescu Ana", type: "Ședință individuală", duration: "52 min", attended: true  },
  { id: 7, date: "2026-02-26", time: "10:00", doctor: "Dr. Popescu Ana", type: "Ședință individuală", duration: "45 min", attended: true  },
  { id: 8, date: "2026-02-12", time: "10:00", doctor: "Dr. Popescu Ana", type: "Evaluare lunară",     duration: "60 min", attended: true  },
  { id: 9, date: "2026-01-29", time: "11:30", doctor: "Dr. Popescu Ana", type: "Ședință individuală", duration: "50 min", attended: false },
];

const MONTHS = ["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"];

function getDay(dateStr)   { return dateStr.split("-")[2]; }
function getMonth(dateStr) { return MONTHS[parseInt(dateStr.split("-")[1]) - 1]; }
function daysUntil(dateStr){ return Math.ceil((new Date(dateStr) - new Date()) / 86400000); }

function AppointmentCard({ apt, isPast }) {
  const [open, setOpen] = useState(false);
  const days = !isPast ? daysUntil(apt.date) : null;
  const isNext = !isPast && days <= 5;

  return (
    <div
      className="card"
      style={{
        cursor: "pointer",
        borderLeft: isNext ? "3px solid var(--accent)" : "3px solid transparent",
        borderRadius: isNext ? "0 var(--radius-lg) var(--radius-lg) 0" : "var(--radius-lg)",
        opacity: isPast && !apt.attended ? 0.55 : 1,
        transition: "box-shadow 0.15s",
      }}
      onClick={() => setOpen(o => !o)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Date block */}
        <div style={{
          width: 50, height: 50, borderRadius: "var(--radius-md)", flexShrink: 0,
          background: isNext ? "var(--accent-light)" : isPast ? "var(--surface2)" : "var(--surface2)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1, color: isNext ? "var(--accent)" : "var(--text)" }}>
            {getDay(apt.date)}
          </span>
          <span style={{ fontSize: 11, textTransform: "uppercase", color: isNext ? "var(--accent)" : "var(--text-3)" }}>
            {getMonth(apt.date)}
          </span>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{apt.time} · {apt.type}</span>
            {isNext && (
              <span style={{ fontSize: 10, background: "var(--accent-light)", color: "var(--accent)", borderRadius: 20, padding: "1px 7px", fontWeight: 600 }}>
                în {days} {days === 1 ? "zi" : "zile"}
              </span>
            )}
            {isPast && !apt.attended && (
              <span style={{ fontSize: 10, background: "var(--anger-bg)", color: "var(--anger)", borderRadius: 20, padding: "1px 7px", fontWeight: 600 }}>
                Absență
              </span>
            )}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>
            {apt.doctor} · {apt.duration}
          </div>
        </div>

        {/* Chevron */}
        <svg width="16" height="16" fill="none" stroke="var(--text-3)" strokeWidth="2" viewBox="0 0 24 24"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
            {apt.location && (
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ color: "var(--text-3)", minWidth: 80 }}>Locație</span>
                <span style={{ color: "var(--text)" }}>{apt.location}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "var(--text-3)", minWidth: 80 }}>Durată</span>
              <span style={{ color: "var(--text)" }}>{apt.duration}</span>
            </div>
            {apt.notes && (
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ color: "var(--text-3)", minWidth: 80 }}>Notițe</span>
                <span style={{ color: "var(--text)" }}>{apt.notes}</span>
              </div>
            )}
            {!isPast && (
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button className="btn btn-ghost btn-sm">Reprogramează</button>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--anger)", borderColor: "var(--anger-bg)" }}>
                  Anulează
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Appointments() {
  const [tab, setTab] = useState("upcoming");

  const attendedCount = PAST.filter(p => p.attended).length;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Programările mele" />
        <div className="page-body">

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Programări viitoare", value: UPCOMING.length },
              { label: "Ședințe efectuate", value: attendedCount },
              { label: "Total ședințe", value: UPCOMING.length + PAST.length },
            ].map((s, i) => (
              <div key={i} className="card card-sm">
                <div className="card-title">{s.label}</div>
                <div className="card-value">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 18, background: "var(--surface2)", padding: 4, borderRadius: "var(--radius-md)", width: "fit-content" }}>
            {[["upcoming", "Viitoare"], ["past", "Trecute"]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  padding: "7px 20px", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer",
                  fontFamily: "var(--font)", fontSize: 14, fontWeight: 500, transition: "all 0.15s",
                  background: tab === key ? "var(--surface)" : "transparent",
                  color: tab === key ? "var(--text)" : "var(--text-3)",
                  boxShadow: tab === key ? "var(--shadow-sm)" : "none",
                }}
              >
                {label}
                <span style={{ marginLeft: 6, fontSize: 12, color: tab === key ? "var(--accent)" : "var(--text-3)" }}>
                  {key === "upcoming" ? UPCOMING.length : PAST.length}
                </span>
              </button>
            ))}
          </div>

          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 680 }}>
            {tab === "upcoming"
              ? UPCOMING.map(apt => <AppointmentCard key={apt.id} apt={apt} isPast={false} />)
              : PAST.map(apt => <AppointmentCard key={apt.id} apt={apt} isPast={true} />)
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointments;