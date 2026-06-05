import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { createLogger } from "../lib/logger";

const logger = createLogger("WEBRTC", true);

export default function VideoRoom({ channelId, onLeave }) {
  const { socket, authUser } = useAuthStore();
  const [peers, setPeers] = useState({}); // { socketId: MediaStream }
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const localVideoRef = useRef();
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({}); // { socketId: RTCPeerConnection }

  useEffect(() => {
    if (!socket) return;

    // Get local media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit("joinVoiceChannel", channelId);

        // Listen for new users joining
        socket.on("userJoinedVoice", ({ socketId }) => {
          logger.log("New user joined voice:", socketId);
          createPeerConnection(socketId, true);
        });

        // Listen for signals
        socket.on("webrtcSignal", async (data) => {
          const { senderSocketId, signal } = data;
          logger.log("Received signal from", senderSocketId, signal.type || 'candidate');
          
          if (signal.type === 'offer') {
            await createPeerConnection(senderSocketId, false, signal);
          } else if (signal.type === 'answer') {
            const pc = peerConnectionsRef.current[senderSocketId];
            if (pc) await pc.setRemoteDescription(new RTCSessionDescription(signal));
          } else if (signal.candidate) {
            const pc = peerConnectionsRef.current[senderSocketId];
            if (pc) await pc.addIceCandidate(new RTCIceCandidate(signal));
          }
        });

        socket.on("userLeftVoice", ({ socketId }) => {
          if (peerConnectionsRef.current[socketId]) {
            peerConnectionsRef.current[socketId].close();
            delete peerConnectionsRef.current[socketId];
          }
          setPeers(prev => {
            const newPeers = { ...prev };
            delete newPeers[socketId];
            return newPeers;
          });
        });
      })
      .catch(err => {
        logger.error("Error accessing media devices.", err);
      });

    return () => {
      socket.emit("leaveVoiceChannel", channelId);
      socket.off("userJoinedVoice");
      socket.off("webrtcSignal");
      socket.off("userLeftVoice");

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
    };
  }, [socket, channelId]);

  const createPeerConnection = async (targetSocketId, isInitiator, incomingOffer = null) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ]
    });

    peerConnectionsRef.current[targetSocketId] = pc;

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtcSignal", {
          targetSocketId,
          signal: event.candidate
        });
      }
    };

    pc.ontrack = (event) => {
      setPeers(prev => ({
        ...prev,
        [targetSocketId]: event.streams[0]
      }));
    };

    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("webrtcSignal", {
        targetSocketId,
        signal: pc.localDescription
      });
    } else if (incomingOffer) {
      await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtcSignal", {
        targetSocketId,
        signal: pc.localDescription
      });
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#111214]">
      <div className="flex-1 p-4 grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {/* Local Video */}
        <div className="relative bg-black rounded-lg overflow-hidden border border-[#1e1f22] flex items-center justify-center">
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-sm text-white font-medium">
            You {!micEnabled && "(Muted)"}
          </div>
        </div>

        {/* Remote Videos */}
        {Object.entries(peers).map(([socketId, stream]) => (
          <RemoteVideo key={socketId} stream={stream} />
        ))}
      </div>

      {/* Controls */}
      <div className="h-20 bg-[#2b2d31] flex items-center justify-center gap-4">
        <button 
          onClick={toggleMic}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${micEnabled ? "bg-[#35373c] hover:bg-[#404249] text-slate-200" : "bg-red-500 hover:bg-red-600 text-white"}`}
        >
          {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button 
          onClick={toggleVideo}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${videoEnabled ? "bg-[#35373c] hover:bg-[#404249] text-slate-200" : "bg-red-500 hover:bg-red-600 text-white"}`}
        >
          {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
        </button>
        <button 
          onClick={onLeave}
          className="w-16 h-12 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white"
        >
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
}

// Helper component for remote videos
const RemoteVideo = ({ stream }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden border border-[#1e1f22] flex items-center justify-center">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover"
      />
    </div>
  );
};
