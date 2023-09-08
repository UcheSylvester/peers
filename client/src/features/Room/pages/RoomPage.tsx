import { VideoPlayer } from "@/components/VideoPlayer"
import { StreamType, Streams } from "@/types"
import {  Button, Group, Stack, Textarea, Title } from "@mantine/core"
import { useEffect, useRef, useState } from "react"
import io from 'socket.io-client'

const socket = io('http://localhost:8080/webRTCPeers', {
  path: '/webrtc'
})

export interface RoomPageProps {

}

export const RoomPage = () => {
  // const localVideoRef = useRef<HTMLVideoElement>(null)
  // const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [streams, setStreams] = useState<Streams>()
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const [callVisible, setCallVisible] = useState(true)
  const [answerVisible, setAnswerVisible] = useState(false)
  const [status, setStatus] = useState('make a call now')


  const getUserMedia = async () => {
    try {
      const constraints = { audio: false, video: true }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      // console.log({stream})
      stream.getTracks().forEach(track => {
        pcRef.current?.addTrack(track, stream)
      })
      // display stream
      setStreams((current) => ({
        ...current,
        remote: current?.remote,
        local: stream
      }))
      // if(!localVideoRef.current) return
      // localVideoRef.current.srcObject = stream
    } catch (error) {
      console.log({error})
    }
  }

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
    socket.on('connection-success', (data) => {
      console.log('connection successful', {sockID: data.socketId, sid: socket.id})
      // set User

    })

    socket.on('sdp', async (data) => {
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

    socket.on('icecandidate', async (data) => {
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

  const sendToPeer = (eventType: string, payload: unknown) => {
    socket.emit(eventType, payload)
  }

  const processSDP = async (sdp?: RTCSessionDescriptionInit) => {
    if(!sdp) return
    console.log({sdp: JSON.stringify(sdp)})
    await pcRef.current?.setLocalDescription(sdp)

    // send sdp to server
    sendToPeer('sdp', { sdp })
  }

  const createOffer = async () => {
    const offer = await pcRef.current?.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    processSDP(offer)

    setCallVisible(false)
    setStatus('calling...')

  }

  const createAnswer = async () => {
    const answer = await pcRef.current?.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    processSDP(answer)
    setAnswerVisible(false)
    setStatus('call answered')
  }



  const renderButtons = ()=> {
    if(callVisible) {
      return (
        <Button fullWidth={false} onClick={createOffer}>
          Call
        </Button>
      )
    }

    if(answerVisible) {
      return (
        <Button fullWidth={false} onClick={createAnswer}>
          Answer
        </Button>
      )
    }

    return null


  }

  
  return (
    <Stack>
      <Title>Home</Title>

      <Group>
        <Stack spacing={5}>
          <Title order={3}>Local</Title>
          {/* <Box className={cx(classes.video, classes.caller)} ref={localVideoRef} component="video" autoPlay  /> */}
          <VideoPlayer stream={streams?.local} streamType={StreamType.LOCAL} />
        </Stack>

        <Stack spacing={5}>
          <Title order={3}>Remote</Title>
          {/* <Box className={classes.video} ref={remoteVideoRef} component="video" autoPlay /> */}
          <VideoPlayer stream={streams?.remote} streamType={StreamType.REMOTE} />
        </Stack>

      </Group>

      <Group>
        {renderButtons()}
      </Group>

      <Title order={4}>{status}</Title>

      <Textarea ref={textRef} />
    </Stack>
  )
}