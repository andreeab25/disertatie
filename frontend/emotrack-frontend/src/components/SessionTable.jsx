function SessionTable({ sessions }) {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Emoție Principală</th>
            <th>Intensitate</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id}>
              <td>{s.date}</td>
              <td>{s.emotion}</td>
              <td>{s.intensity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  
  export default SessionTable;