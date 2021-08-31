import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import socket from '../../socket';
import VideoCard from '../Video/VideoCard';
import ChatOption from './ChatOption';
import Heading from "../Main/Heading"
import CallOption from "./CallOption"
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
  grandParent: {
    display: "flex",
    flexDirection: "row"
  },
  root: {
    backgroundColor: "#ffffff",
    padding: "15px"

  },
  parent: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    paddingTop: "150px"

  },
  child: {
    backgroundColor: "#ffffff",
    height: "350px",
    position: "relative",
    display: "flex",
    width: "430px",
    justifyContent: "center",
    marginRight: "20px",
    marginBottom: "20px"
  },
  writeName: {
    position: "absolute",
    color: "#B3B3B3",
    fontFamily: "'Ubuntu', sans-serif",
    fontSize: "1.5rem",
    zIndex: "1",
    backgroundColor: "#282828",
    height: "180px",
    width: "380px",
    textAlign: "center",
    paddingTop: "150px"
  },
    parentbig: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    backgroundColor: "#181818",
    paddingTop: "10px"

  },
  childbig: {
    backgroundColor: "#282828",
    height: "270px",
    position: "relative",
    display: "flex",
    width: "360px",
    justifyContent: "center",
    marginRight: "20px",
    marginBottom: "20px"
  },
  writeNamebig: {
    position: "absolute",
    color: "#B3B3B3",
    fontFamily: "'Ubuntu', sans-serif",
    fontSize: "1.5rem",
    zIndex: "1",
    backgroundColor: "#282828",
    height: "150px",
    width: "350px",
    textAlign: "center",
    paddingTop: "120px"
  },
  meetingEnd: {
    backgroundColor: "#181818",
    padding: "50px",
    textAlign: "center"
  },
  meetingEndTitle: {
    color: "#B3B3B3",
    fontFamily: "'Ubuntu', sans-serif",
    fontSize: "2rem",
  }
});

function Room(props){
  const classes = useStyles();

  const [peers, setPeers] = useState([]);
  const [userVideoAudio, setUserVideoAudio] = useState({
    localUser: { video: true, audio: true },
  });

  // const [displayChat, setDisplayChat] = useState(false);
  const [video, setVideo] = useState(true);
  const [leave, setLeave] = useState(false);

  const peersRef = useRef([]);
  const userVideoRef = useRef();

  const userStream = useRef();

  const roomID = props.match.params.roomID;
  const currentUser = sessionStorage.getItem('user');

  useEffect(() => {

    // Set Back Button Event
    window.addEventListener('popstate', endCall);

    // Connect Camera & Mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideoRef.current.srcObject = stream;
        userStream.current = stream;

        socket.emit('joinRoom', { roomID, userName: currentUser });
        socket.on('userJoin', ({clients, socketList}) => {
          const peer_array = [];

          clients.forEach((client) => {
            let userId = client
            let userName = socketList[client].userName;
            let video = socketList[client].video
            let audio = socketList[client].audio

            if (userName !== currentUser) {
              const peer = createPeer(userId, socket.id, stream);

              peer.userName = userName;
              peer.peerID = userId;
              peersRef.current.push({
                peerID: userId,
                peer,
                userName,
              });

              peer_array.push(peer);

              setUserVideoAudio((preList) => {
                return {
                  ...preList,
                  [peer.userName]: { video, audio },
                };
              });
            }
          });

          setPeers(peer_array);
        });

        socket.on('receiveCall', ({ signal, from, info }) => {
          let userName = info.userName;
          let video = info.video
          let audio = info.audio

          const peerIDs = findPeer(from);
          if (!peerIDs) {
            const peer = addPeer(signal, from, stream);

            peer.userName = userName;
            peersRef.current.push({
              peerID: from,
              peer,
              userName: userName,
            });

            setPeers((users) => {
              return [...users, peer];
            });

            setUserVideoAudio((preList) => {
              return {
                ...preList,
                [peer.userName]: { video, audio },
              };
            });
          }
        });

        socket.on('callAccepted', ({ signal, answerId }) => {
          const peerIDs = findPeer(answerId);
          peerIDs.peer.signal(signal);
        });

        socket.on('userLeave', ({ userId }) => {
          const peerIDs = findPeer(userId);
          peerIDs.peer.destroy();
          setPeers((users) => {
            users = users.filter((user) => user.peerID !== peerIDs.peer.peerID);
            return [...users];
          });
        });
      });

    socket.on('toggleVideo', ({ userId, switchTarget }) => {
      const peerIDs = findPeer(userId);

      setUserVideoAudio((preList) => {
        let video = preList[peerIDs.userName].video;
        let audio = preList[peerIDs.userName].audio;

        if (switchTarget === 'video') video = !video;
        else audio = !audio;

        return {
          ...preList,
          [peerIDs.userName]: { video, audio },
        };
      });
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  function createPeer(userId, caller, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: {
        iceServers: [{
          urls: [ "stun:bn-turn1.xirsys.com" ]
       },
       {url:'stun:stun01.sipphone.com'},
       {url:'stun:stun.ekiga.net'},
       {url:'stun:stun.fwdnet.net'},
       {url:'stun:stun.ideasip.com'},
       {url:'stun:stun.iptel.org'},
       {url:'stun:stun.rixtelecom.se'},
       {url:'stun:stun.schlund.de'},
       {url:'stun:stun.l.google.com:19302'},
       {url:'stun:stun1.l.google.com:19302'},
       {url:'stun:stun2.l.google.com:19302'},
       {url:'stun:stun3.l.google.com:19302'},
       {url:'stun:stun4.l.google.com:19302'},
       {url:'stun:stunserver.org'},
       {url:'stun:stun.softjoys.com'},
       {url:'stun:stun.voiparound.com'},
       {url:'stun:stun.voipbuster.com'},
       {url:'stun:stun.voipstunt.com'},
       {url:'stun:stun.voxgratia.org'},
       {url:'stun:stun.xten.com'},
        {
          username: "yq_BxvdCMrMv110BQ2bGPCD655MPBLy8UcPGPIS94u2JQdC3_xZqU_lfu1onKQ3gAAAAAGDR8wBjcnV5ZmZlc3Np",
          credential: "c92f9d3e-d365-11eb-8c7b-0242ac140004",
          urls: [
              "turn:bn-turn1.xirsys.com:80?transport=udp",
              "turn:bn-turn1.xirsys.com:3478?transport=udp",
              "turn:bn-turn1.xirsys.com:80?transport=tcp",
              "turn:bn-turn1.xirsys.com:3478?transport=tcp",
              "turns:bn-turn1.xirsys.com:443?transport=tcp",
              "turns:bn-turn1.xirsys.com:5349?transport=tcp"
          ]
       }]
      }
    });

    peer.on('signal', (signal) => {
      socket.emit('callUser', {
        userToCall: userId,
        from: caller,
        signal,
      });
    });
    peer.on('disconnect', () => {
      peer.destroy();
    });

    return peer;
  }


  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: {
        iceServers: [{
          urls: [ "stun:bn-turn1.xirsys.com" ]
       },
       {url:'stun:stun01.sipphone.com'},
       {url:'stun:stun.ekiga.net'},
       {url:'stun:stun.fwdnet.net'},
       {url:'stun:stun.ideasip.com'},
       {url:'stun:stun.iptel.org'},
       {url:'stun:stun.rixtelecom.se'},
       {url:'stun:stun.schlund.de'},
       {url:'stun:stun.l.google.com:19302'},
       {url:'stun:stun1.l.google.com:19302'},
       {url:'stun:stun2.l.google.com:19302'},
       {url:'stun:stun3.l.google.com:19302'},
       {url:'stun:stun4.l.google.com:19302'},
       {url:'stun:stunserver.org'},
       {url:'stun:stun.softjoys.com'},
       {url:'stun:stun.voiparound.com'},
       {url:'stun:stun.voipbuster.com'},
       {url:'stun:stun.voipstunt.com'},
       {url:'stun:stun.voxgratia.org'},
       {url:'stun:stun.xten.com'},
        {
          username: "yq_BxvdCMrMv110BQ2bGPCD655MPBLy8UcPGPIS94u2JQdC3_xZqU_lfu1onKQ3gAAAAAGDR8wBjcnV5ZmZlc3Np",
          credential: "c92f9d3e-d365-11eb-8c7b-0242ac140004",
          urls: [
              "turn:bn-turn1.xirsys.com:80?transport=udp",
              "turn:bn-turn1.xirsys.com:3478?transport=udp",
              "turn:bn-turn1.xirsys.com:80?transport=tcp",
              "turn:bn-turn1.xirsys.com:3478?transport=tcp",
              "turns:bn-turn1.xirsys.com:443?transport=tcp",
              "turns:bn-turn1.xirsys.com:5349?transport=tcp"
          ]
       }]
      }
    });

    peer.on('signal', (signal) => {
      socket.emit('acceptCall', { signal, to: callerId });
    });

    peer.on('disconnect', () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function findPeer(id) {
    return peersRef.current.find((p) => p.peerID === id);
  }

  function createVideo(peer, index, width, videoHolder, userNameCust)
  {
    return (
      <div className={videoHolder} key={index}>
        {writeUserName(peer.userName,userNameCust, index)}
        <VideoCard key={index} peer={peer} width={width} />
      </div>
    )
  }


  function writeUserName(userName, userNameCust, index) {
    if (userVideoAudio.hasOwnProperty(userName)) {
      if (!userVideoAudio[userName].video) {
          return <div className={userNameCust} key={userName}>{userName}</div>;
      }
    }
  }

  const goToBack = (e) => {
    e.preventDefault();
    setVideo(false)
    setLeave(true)
    socket.emit('leaveRoom', { roomID });
  };

  const endCall = (e) => {
    e.preventDefault();
    socket.emit('finish', {roomID})
    sessionStorage.removeItem('user');
    window.location.href = '/'
  }

  const toggleCameraAudio = (e) => {
    const target = e.currentTarget.getAttribute('data-switch');
    console.log(e.currentTarget.getAttribute('data-switch'))


    setUserVideoAudio((preList) => {
      let videoSwitch = preList['localUser'].video;
      let audioSwitch = preList['localUser'].audio;

      if (target === 'video') {
        const userVideoTrack = userVideoRef.current.srcObject.getVideoTracks()[0];
        videoSwitch = !videoSwitch;
        userVideoTrack.enabled = videoSwitch;
      } else {
        const userAudioTrack = userVideoRef.current.srcObject.getAudioTracks()[0];
        audioSwitch = !audioSwitch;

        if (userAudioTrack) {
          userAudioTrack.enabled = audioSwitch;
        } else {
          userStream.current.getAudioTracks()[0].enabled = audioSwitch;
        }
      }

      return {
        ...preList,
        localUser: { video: videoSwitch, audio: audioSwitch },
      };
    });

    socket.emit('toggle', { roomID, switchTarget: target });
  };


  return (
    <div className={classes.root}>
    <Heading meeting={true} room={roomID} />
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={1}>
          <CallOption goToBack={goToBack} toggleCameraAudio={toggleCameraAudio} userVideoAudio={userVideoAudio['localUser']} endCall={endCall} leave={leave}/>
        </Grid>
        <Grid item xs={6} sm={8}>
          <div className={classes.grandParent}>
          {
            !peers || peers.length < 2 ? (
              <div className={classes.parent}>
              {
                video ?
                (<div className={classes.child}>
                  {
                    userVideoAudio['localUser'].video ? null : (<div className={classes.writeName}>{currentUser}</div>)
                  }
                  <video style={{backgroundSize: "cover", overflow: "hidden", width: "380px"}} ref={userVideoRef} autoPlay muted></video>
                  </div>
                ) : (
                  <div className={classes.meetingEnd}>
                  <p className={classes.meetingEndTitle}>Video Chat Ended !!</p>
                  <p className={classes.meetingEndTitle}>You Can Still Chat with Others !!</p></div>)
              }
              {video && peers && peers.map((peer,index) => createVideo(peer,index,"380px",classes.child, classes.writeName))}
            </div>
            ) : (
              <div className={classes.parentbig}>
              {
                video ?
                (<div className={classes.childbig}>
                  {
                    userVideoAudio['localUser'].video ? null : (<div className={classes.writeNamebig}>{currentUser}</div>)
                  }
                  <video style={{backgroundSize: "cover", overflow: "hidden", width: "340px"}} ref={userVideoRef} autoPlay muted></video>
                  </div>
                ) : (null)
              }
              {video && peers && peers.map((peer,index) => createVideo(peer,index,"340px",classes.childbig,classes.writeNamebig))}
            </div>
            )
          }
          </div>
        </Grid>
        <Grid item xs={6} sm={3}>
        <ChatOption roomID={roomID} />
        </Grid>
      </Grid>
    </div>
    </div>
  );
};


export default Room;
