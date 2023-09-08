import { StreamFeatures, Streams } from "@/types";
import { useState } from "react";

const defaultConstraints: MediaStreamConstraints = {
  audio: true,
  video: true,
}

interface UseUserMediaStreamsArgs {
  constraints?: MediaStreamConstraints;
  onUserMediaCallback?: (stream: MediaStream) => void;
}
export const useUserMediaStreams = ({
  constraints,
  onUserMediaCallback,
}: UseUserMediaStreamsArgs) => {

  const [streams, setStreams] = useState<Streams>();
  const [localStreamFeatures, setLocalStreamFeatures] = useState<StreamFeatures>({
    audio: {enabled: true},
    video: {enabled: true},
  });

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

  const getStreamTracks = (stream: MediaStream) => {
    return stream.getTracks();
  } 

  const toggleStreamFeatures = ( type: keyof StreamFeatures, stream: MediaStream | undefined) => {
    if (!stream) return;
    const tracks = getStreamTracks(stream);
    tracks.forEach((track) => {
      if(track.kind === type) track.enabled = !track.enabled;
    })
    console.log({tracks})
  }

  const toggleLocalStreamFeatures = (type: keyof StreamFeatures) => {
    toggleStreamFeatures(type, streams?.local);
    setLocalStreamFeatures((current) => ({
      ...current,
      [type]: {
        enabled: !current[type].enabled,
      },
    }));
  }


  return {
    streams,
    setStreams,
    getUserMedia,
    toggleLocalStreamFeatures,
    localStreamFeatures
  }
}