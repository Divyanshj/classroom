import React, { useEffect, useRef } from 'react';

function VideoCard(props){
  const videoRef = useRef();
  const peer = props.peer;
  const width = props.width

  useEffect(() => {
    peer.on('stream', (stream) => {
      videoRef.current.srcObject = stream;
    });
  }, [peer]);

  return (
    <video
      playsInline
      autoPlay
      ref={videoRef}
      style={{backgroundSize: "cover", overflow: "hidden", width: width}}
    />
  );
};


export default VideoCard;
