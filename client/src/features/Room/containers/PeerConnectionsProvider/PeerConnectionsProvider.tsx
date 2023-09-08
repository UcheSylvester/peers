import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useUserMediaStreams } from "../../hooks";
import Socket from "@/lib/socket-io";
import { Streams } from "@/types";
import { processSDP, sendToPeer } from "../../_utils";

interface PeerConnectionsContextValue {
  createAnswer: () => void;
  createOffer: () => void;
  callVisible: boolean;
  answerVisible: boolean;
  status: string;
  textRef: React.RefObject<HTMLTextAreaElement>;
  streams: Streams | undefined;
}

const PeerConnecctionsContext = createContext<PeerConnectionsContextValue>({} as PeerConnectionsContextValue);

interface PeerConnectionsProviderProps {
  children: React.ReactNode;
}
export const PeerConnectionsProvider = ({children}: PeerConnectionsProviderProps) => {
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const [callVisible, setCallVisible] = useState(true)
  const [answerVisible, setAnswerVisible] = useState(false)
  const [status, setStatus] = useState('make a call now')


  const {streams, getUserMedia, setStreams} = useUserMediaStreams({onUserMediaCallback: (stream) => {
    stream.getTracks().forEach(track => pcRef.current?.addTrack(track, stream))
  }})

  const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
    if(event.candidate) {
      sendToPeer('icecandidate', {candidate: event.candidate})
      // console.log('icecandidate', {event, candidate: JSON.stringify(event.candidate)})
    }
  }

  const onIceConnectionsStateChange = (event: Event) => {
    console.log('onIceConnectionsStateChange', {event})
  }

  const handleTrack = (event: RTCTrackEvent) => {
    console.log({event})
    // if(!remoteVideoRef.current) return
    // remoteVideoRef.current.srcObject = event.streams[0]
    setStreams((current) => ({
      ...current,
      local: current?.local,
      remote: event.streams[0]
    }))
  }

  useEffect(() => {
    Socket.on('connection-success', (data) => {
      console.log('connection successful', {sockID: data.socketId, sid: Socket.id})
      // set User

    })

    Socket.on('sdp', async (data) => {
      try {
        console.log('recieving sdp', {data})
        // set remote description as soon as we recieve sdp from the server
       await  pcRef.current?.setRemoteDescription(new RTCSessionDescription(data.sdp))
        textRef.current!.value = JSON.stringify(data.sdp)

        if(data.sdp.type === 'offer') {
          setCallVisible(false)
          setAnswerVisible(true)
          setStatus('incoming call...')

        } else if(data.sdp.type === 'answer') {
          setStatus('call answered')
        }
        
      } catch (error) {
        console.log({error})
      }
    })

    Socket.on('icecandidate', async (data) => {
      try {
        console.log('recieving candidate', {data})
        // set candidates as soon as we recieve them from the server
        await pcRef.current?.addIceCandidate(data.candidate)
        
      } catch (error) {
        console.log({error})
      }
    })


    getUserMedia()

    const _pc = new RTCPeerConnection()
    _pc.addEventListener('icecandidate', onIceCandidate)
    _pc.addEventListener('iceconnectionstatechange', onIceConnectionsStateChange)
    _pc.addEventListener('track', handleTrack)

    pcRef.current = _pc

  }, [])


  const createOffer = async () => {
    const offer = await pcRef.current?.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    processSDP(pcRef.current, offer)

    setCallVisible(false)
    setStatus('calling...')

  }

  const createAnswer = async () => {
    const answer = await pcRef.current?.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    processSDP(pcRef.current, answer)
    setAnswerVisible(false)
    setStatus('call answered')
  }

  return (
    <PeerConnecctionsContext.Provider value={{
      createAnswer,
      createOffer,
      callVisible,
      answerVisible,
      status,
      textRef,
      streams

    }}>
      {children}
    </PeerConnecctionsContext.Provider>
  )
}

export const usePeerConnectionsContext = () => useContext(PeerConnecctionsContext)