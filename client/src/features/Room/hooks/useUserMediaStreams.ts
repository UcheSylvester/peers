import { Streams } from "@/types";
import { useState } from "react";

const defaultConstraints: MediaStreamConstraints = {
  audio: false,
  video: true,
}

interface UseUserMediaStreamsArgs {
  constraints?: MediaStreamConstraints;
  onUserMediaCallback?: (stream: MediaStream) => void;
  peerCOnnection?: RTCPeerConnection;
}
export const useUserMediaStreams = ({
  constraints,
  onUserMediaCallback,
}: UseUserMediaStreamsArgs) => {

  const [streams, setStreams] = useState<Streams>();

  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        ...defaultConstraints,
        ...constraints,
      });
      setStreams((current) => ({
        ...current,
        local: stream,
        remote: current?.remote,
      }));
      onUserMediaCallback?.(stream);
    } catch (error) {
      console.log({error});
    }
  }


  return {
    streams,
    setStreams,
    getUserMedia,
  }
}