import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>EmotionTrack</h2>
      <nav>
        <Link to="/dashboard">Dashboard</Link><br/><br/>
        <Link to="/analytics">Analize Emoționale</Link><br/><br/>
        <Link to="/">Logout</Link>
      </nav>
    </div>
  );
}

export default Sidebar;