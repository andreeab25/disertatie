function VideoPlayer({ src }) {
    return (
      <video controls style={{ width: "100%", borderRadius: 8, marginBottom: 20 }}>
        <source src={src} type="video/mp4" />
        Browserul tău nu suportă video.
      </video>
    );
  }
  
  export default VideoPlayer;