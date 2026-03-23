import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CustomPieChart from "../components/CustomPieChart";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const statCards = [
  { title: "Emoție predominantă", value: "Fericire" },
  { title: "Cea mai frecventă emoție", value: "Tristețe" },
  { title: "Intensitate medie", value: "65%" },
  { title: "Număr sesiuni", value: "12" },
];

const pieData = [
  { name: "Fericire", value: 40 },
  { name: "Tristețe", value: 25 },
  { name: "Furie", value: 20 },
  { name: "Surpriză", value: 15 },
];

const pieColors = ["#FACC15", "#3B82F6", "#EF4444", "#A78BFA"];

const lineData = [
  { time: "09:00", Fericire: 30, Tristețe: 20, Furie: 10, Surpriză: 5 },
  { time: "10:00", Fericire: 50, Tristețe: 15, Furie: 20, Surpriză: 10 },
  { time: "11:00", Fericire: 40, Tristețe: 30, Furie: 15, Surpriză: 20 },
  { time: "12:00", Fericire: 60, Tristețe: 25, Furie: 10, Surpriză: 15 },
];

const sessions = [
  { id: 1, date: "2026-03-18", emotion: "Fericire", intensity: "70%" },
  { id: 2, date: "2026-03-19", emotion: "Tristețe", intensity: "50%" },
  { id: 3, date: "2026-03-20", emotion: "Furie", intensity: "40%" },
];

function Analytics() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: "240px", flex: 1, padding: 30, overflowY: "auto" }}>
        <Topbar />
        <h2 style={{ marginBottom: 20 }}>Analize Emoționale</h2>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 30 }}>
          {statCards.map((card, idx) => (
            <div key={idx} className="card" style={{ flex: "1 1 200px" }}>
              <h3>{card.title}</h3>
              <p style={{ fontSize: "20px", fontWeight: 600, marginTop: 10 }}>{card.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 30, flexWrap: "wrap", marginBottom: 30 }}>
          <div className="card" style={{ flex: "1 1 300px", height: 300 }}>
            <h3>Distribuție emoții</h3>
            <ResponsiveContainer width="100%" height="85%">
              <CustomPieChart />
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ flex: "1 1 600px", height: 300 }}>
            <h3>Evoluție în timp</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={lineData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Fericire" stroke="#FACC15" />
                <Line type="monotone" dataKey="Tristețe" stroke="#3B82F6" />
                <Line type="monotone" dataKey="Furie" stroke="#EF4444" />
                <Line type="monotone" dataKey="Surpriză" stroke="#A78BFA" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabel detaliat */}
        <div className="card">
          <h3>Sesiuni analizate</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Emoție dominantă</th>
                <th>Intensitate</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id}>
                  <td>{s.date}</td>
                  <td>{s.emotion}</td>
                  <td>{s.intensity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Analytics;