import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useUserMediaStreams } from "../../hooks";
import Socket from "@/lib/socket-io";
import { StreamFeatures, Streams } from "@/types";
import { processSDP, sendToPeer } from "../../_utils";

interface PeerConnectionsContextValue {
  createAnswer: () => void;
  createOffer: () => void;
  callVisible: boolean;
  answerVisible: boolean;
  status: string;
  streams: Streams | undefined;
  endCall: () => void;
  localStreamFeatures: StreamFeatures
  toggleLocalStreamFeatures: (type: keyof StreamFeatures) => void;
}

const PeerConnecctionsContext = createContext<PeerConnectionsContextValue>({} as PeerConnectionsContextValue);

interface PeerConnectionsProviderProps {
  children: React.ReactNode;
}
export const PeerConnectionsProvider = ({children}: PeerConnectionsProviderProps) => {
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const [callVisible, setCallVisible] = useState(true)
  const [answerVisible, setAnswerVisible] = useState(false)
  const [status, setStatus] = useState('make a call now')


  const {streams, getUserMedia, setStreams, localStreamFeatures, toggleLocalStreamFeatures} = useUserMediaStreams({onUserMediaCallback: (stream) => {
    stream.getTracks().forEach(track => pcRef.current?.addTrack(track, stream))
  }})

  const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
    if(event.candidate) {
      sendToPeer('icecandidate', {candidate: event.candidate})
    }
  }

  const onIceConnectionsStateChange = (event: Event) => {
    console.log('onIceConnectionsStateChange', {event})
  }

  const handleTrack = (event: RTCTrackEvent) => {
    console.log('handletrack', {event})
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

    Socket.on('end-call', terminateCall)

    Socket.on('user-disconnected', () => {
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

    console.log('pcRef', pcRef.current)

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

  const terminateCall = () => {
    pcRef.current?.close()
    setAnswerVisible(false)
    setCallVisible(true)
    setStreams((current) => ({
      ...current,
      local: current?.local,
      remote: undefined,
    }))
  }

  const endCall = () => {
    Socket.emit('end-call', {socketId: Socket.id})
    terminateCall()
  }

  return (
    <PeerConnecctionsContext.Provider value={{
      createAnswer,
      createOffer,
      callVisible,
      answerVisible,
      status,
      streams,
      endCall,
      localStreamFeatures,
      toggleLocalStreamFeatures,
    }}>
      {children}
    </PeerConnecctionsContext.Provider>
  )
}

export const usePeerConnectionsContext = () => useContext(PeerConnecctionsContext)