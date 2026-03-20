import { Link } from "react-router-dom";

function PatientCard({ patient }) {
  return (
    <div className="card">
      <h3>{patient.name}</h3>
      <p>Vârstă: {patient.age}</p>
      <p>Ultima sesiune: {patient.lastSession}</p>
      <Link to={`/patient/${patient.id}`}><button>Vezi detalii</button></Link>
    </div>
  );
}

export default PatientCard;