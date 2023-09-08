import { Box, Button, Group, Stack, Textarea, Title, createStyles } from "@mantine/core"
import { NextPage } from "next"
import { useEffect, useRef, useState } from "react"

import io from 'socket.io-client'

const socket = io('http://localhost:8080/webRTCPeers', {
  path: '/webrtc'
})

const Home: NextPage = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const candidates = useRef<RTCIceCandidate[]>([])
  const {classes} = useStyles()
  const [callVisible, setCallVisible] = useState(true)
  const [answerVisible, setAnswerVisible] = useState(false)
  const [status, setStatus] = useState('make a call now')

  const getUserMedia = async () => {
    try {
      const constraints = { audio: false, video: true }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log({stream})
      stream.getTracks().forEach(track => {
        pcRef.current?.addTrack(track, stream)
      })
      // display stream
      if(!localVideoRef.current) return
      localVideoRef.current.srcObject = stream
    } catch (error) {
      console.log({error})
    }
  }

  const handleIceCandidates = (event: RTCPeerConnectionIceEvent) => {
    if(event.candidate) {
      sendToPeer('icecandidate', {candidate: event.candidate})
      // console.log('icecandidate', {event, candidate: JSON.stringify(event.candidate)})
    }
  }

  const handleIceConnectionsStateChange = (event: Event) => {
    console.log('onIceConnectionsStateChange', {event})
  }

  const handleTrack = (event: RTCTrackEvent) => {
    // console.log('ontrack',{event})
    if(!remoteVideoRef.current) return
    remoteVideoRef.current.srcObject = event.streams[0]
  }

  useEffect(() => {

    socket.on('connection-success', (data) => {
      console.log('connection successful', {data})
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
    _pc.addEventListener('icecandidate', handleIceCandidates)
    _pc.addEventListener('iceconnectionstatechange', handleIceConnectionsStateChange)
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

  const setRemoteDescription = async () => {
    const sdp = JSON.parse(textRef.current?.value || '')
    const description = new RTCSessionDescription(sdp)

    await pcRef.current?.setRemoteDescription(description)
  }

  const addCandidate = async () => {
    // const candidate = JSON.parse(textRef.current?.value || '')
    // await pcRef.current?.addIceCandidate(candidate)
    candidates.current.forEach(candidate => {
      pcRef.current?.addIceCandidate(candidate)
    })
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
          <Title order={3}>Caller</Title>
          <Box className={classes.video} ref={localVideoRef} component="video" autoPlay />
        </Stack>

        <Stack spacing={5}>
          <Title order={3}>Callee</Title>
          <Box className={classes.video} ref={remoteVideoRef} component="video" autoPlay />
        </Stack>

      </Group>

      <Group>
        {renderButtons()}
      </Group>

      <Title order={4}>{status}</Title>

      <Textarea ref={textRef} />

      <Group>
        <Button fullWidth={false} onClick={setRemoteDescription}>
          Set Remote Description
        </Button>
        <Button fullWidth={false} onClick={addCandidate}>
          Add Candidate
        </Button>
      </Group>
    </Stack>
  )
}

const useStyles = createStyles(() => ({
  video: {
    border: '1px solid red',
    height: 300,
    width: 500,
    objectFit: 'cover',
    transform: 'rotateY(180deg)'
  }
}))

export default Home