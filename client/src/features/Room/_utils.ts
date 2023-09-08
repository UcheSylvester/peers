import Socket from "@/lib/socket-io"

export const processSDP = async (peerConnection: RTCPeerConnection | null, sdp?: RTCSessionDescriptionInit) => {
  if(!sdp) return
  console.log({sdp: JSON.stringify(sdp)})
  await peerConnection?.setLocalDescription(sdp)

  // send sdp to server
  sendToPeer('sdp', { sdp })
}

export const sendToPeer = (eventType: string, payload: unknown) => {
  Socket.emit(eventType, payload)
}