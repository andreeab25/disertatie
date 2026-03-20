import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import VideoPlayer from "../components/VideoPlayer";

function VideoSession() {
  const { id } = useParams();
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 30 }}>
        <Topbar />
        <h2>Sesiune video #{id}</h2>
        <VideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4" />
        <div className="timeline">
          <div className="happy"></div>
          <div className="sad"></div>
          <div className="angry"></div>
          <div className="surprise"></div>
        </div>
        <p style={{ marginTop: 10, fontSize: 14 }}>Timeline emoții (fericire, tristețe, furie, surpriză)</p>
      </div>
    </div>
  );
}

export default VideoSession;