import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SessionTable from "../components/SessionTable";

const dummySessions = [
  { id: 1, date: "2026-03-18", emotion: "Fericire", intensity: "70%" },
  { id: 2, date: "2026-03-19", emotion: "Tristețe", intensity: "50%" },
];

function PatientPage() {
  const { id } = useParams();

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 20 }}>
        <Topbar />
        <h2>Detalii pacient #{id}</h2>
        <SessionTable sessions={dummySessions} />
      </div>
    </div>
  );
}

export default PatientPage;