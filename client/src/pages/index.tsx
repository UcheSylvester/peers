import { Box, Button, Group, Stack, Textarea, Title, createStyles } from "@mantine/core"
import { NextPage } from "next"
import { useEffect, useRef } from "react"

import io from 'socket.io-client'

const socket = io('http://localhost:8080/webRTCPeers', {
  path: '/webrtc'
})

// const socket = io('/webrtc')

const Home: NextPage = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const {classes} = useStyles()


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
    console.log('icecandidate', {event, candidate: JSON.stringify(event.candidate)})
  }

  const handleIceConnectionsStateChange = (event: Event) => {
    console.log('onIceConnectionsStateChange', {event})
  }

  const handleTrack = (event: RTCTrackEvent) => {
    console.log('ontrack',{event})
    if(!remoteVideoRef.current) return
    remoteVideoRef.current.srcObject = event.streams[0]
  }

  useEffect(() => {


    socket.on('connection-success', (data) => {
      console.log('connection successful', {data})
    })


    getUserMedia()

    const _pc = new RTCPeerConnection()
    _pc.addEventListener('icecandidate', handleIceCandidates)
    _pc.addEventListener('iceconnectionstatechange', handleIceConnectionsStateChange)
    _pc.addEventListener('track', handleTrack)

    pcRef.current = _pc

  }, [])

  const createOffer = async () => {
    const offer = await pcRef.current?.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    await pcRef.current?.setLocalDescription(offer)
    console.log({offer: JSON.stringify(offer)})
  }

  const createAnswer = async () => {
    const answer = await pcRef.current?.createAnswer()
    pcRef.current?.setLocalDescription(answer)
    console.log({answer: JSON.stringify(answer)})
  }

  const setRemoteDescription = async () => {
    const sdp = JSON.parse(textRef.current?.value || '')
    const description = new RTCSessionDescription(sdp)

    await pcRef.current?.setRemoteDescription(description)
  }

  const addCandidate = async () => {
    const candidate = JSON.parse(textRef.current?.value || '')
    await pcRef.current?.addIceCandidate(candidate)
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
        <Button fullWidth={false} onClick={createOffer}>
          Create Offer
        </Button>
        <Button fullWidth={false} onClick={createAnswer}>
          Create Answer
        </Button>
      </Group>

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