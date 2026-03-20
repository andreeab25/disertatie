import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import PatientCard from "../components/PatientCard";

const dummyPatients = [
  { id: 1, name: "Ion Popescu", age: 32, lastSession: "2026-03-18" },
  { id: 2, name: "Maria Ionescu", age: 28, lastSession: "2026-03-19" },
  { id: 3, name: "Andrei Vasilescu", age: 40, lastSession: "2026-03-15" },
  { id: 4, name: "Elena Georgescu", age: 36, lastSession: "2026-03-17" },
];

function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "240px", flex: 1, padding: 30, overflowY: "auto" }}>
        <Topbar />
        <h2 style={{ marginBottom: 20 }}>Pacienți</h2>
        <div className="grid">
          {dummyPatients.map(p => <PatientCard key={p.id} patient={p} />)}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;